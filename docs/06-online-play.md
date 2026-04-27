# Online Play System

## 1. Overview

The Online Play system enables multiple players to share a synchronized game session over the internet. It uses **Firebase Realtime Database** as the backend, with a host/client architecture where one player creates the session and others join via a shared Game ID.

The system consists of three parts:

| Component | File | Purpose |
|-----------|------|---------|
| **Firebase Init** | `utils/firebase.ts` | App initialization and database reference |
| **State Sync** | `composables/online/useGameStateSync.ts` | Bidirectional state synchronization |
| **UI** | `components/online-play/` | Lobby, canvas, and embedded game controls |

---

## 2. Architecture

### 2.1 Connection Model

```
┌─────────────┐                    ┌──────────────────────┐
│   HOST      │ ──── writes ────→  │  Firebase RTDB       │
│ (Creator)   │ ←── reads ──────   │  games/{gameId}/     │
└─────────────┘                    │    ├── visibleCards   │
                                   │    ├── currentPhase   │
┌─────────────┐                    │    ├── rollMain       │
│  CLIENT A   │ ──── writes ────→  │    ├── characters     │
│  (Joiner)   │ ←── reads ──────   │    ├── ...            │
└─────────────┘                    │    └── lastUpdated    │
                                   └──────────────────────┘
┌─────────────┐
│  CLIENT B   │ ←──→ same path
└─────────────┘
```

- **Host** creates a game → generates a random Game ID → pushes initial state to Firebase
- **Clients** join by entering the Game ID → subscribe to the Firebase path → hydrate local state
- **All participants** can push changes; there is no authority model beyond the hydration guard

### 2.2 Data Path

All game state for a session lives at:
```
games/{gameId}/
```

This is a single flat document containing the entire serialized game state.

---

## 3. Firebase Configuration (`firebase.ts`)

```typescript
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
```

All configuration is loaded from environment variables (stored in `site/.env.local`).

---

## 4. State Synchronization (`useGameStateSync.ts`)

### 4.1 Composable API

```typescript
const { connect, disconnect, isConnected } = useGameStateSync();
```

| Method | Parameters | Description |
|--------|-----------|-------------|
| `connect(gameId, asHost)` | `string, boolean` | Connect to a game session |
| `disconnect()` | — | Disconnect and clean up |

| State | Type | Description |
|-------|------|-------------|
| `isConnected` | `ref<boolean>` | Whether currently connected |
| `isHost` | `ref<boolean>` | Whether this client is the host |

### 4.2 Serialization

`serializeState()` converts the local reactive game state into a plain JavaScript object suitable for Firebase:

**Special handling for non-serializable types:**
- `Set<string>` → `Array.from()` (e.g., `drawnCards`, `knownBottomStackCards`, `identifiedCards`, `removedFaceCardIds`)
- `toRaw()` used on all reactive objects to strip Vue proxies
- `lastUpdated: Date.now()` added as metadata

**Serialized fields (56 total):**

| Category | Fields |
|----------|--------|
| Core | `visibleCards`, `selectedCardId`, `falloutCard`, `selectedJoker` |
| Stats | `strikes`, `characters`, `strikesToAssign`, `weaknessesFound`, `isEndgame`, `tableGenrePoints`, `playerGenrePoints`, `currentAct`, `selectedPlayset`, `currentPhase` |
| Manual | `manualSuit`, `manualRank`, `manualJoker`, `manualOverride` |
| Deck | `acesRemaining`, `middleStack`, `bottomStack`, `reserveQueue`, `drawnCards`, `trophyPile`, `trophyTop`, `isTrophyTopRandomized`, `faceCardReserves`, `lastAddedFaceCardRank`, `removedFaceCards`, `unknownThreatCards`, `unknownBottomStack`, `unknownReserveCards`, `knownBottomStackCards`, `identifiedCards`, `removedFaceCardIds` |
| Resolution | `sacrificeConfirmed`, `rollMain`, `rollEffort`, `isGenrePointUsed`, `isGenrePointAwarded`, `isEndgameInitialized`, `isGameWon`, `isBlackJokerRemoved`, `jokersAdded`, `cardsAddedFromReserve`, `pendingActSetups` |
| Metadata | `lastUpdated` |

**Note:** Computed values (e.g., `rollTotal`, `isSuccess`, `targetDifficulty`) are NOT serialized. They recompute automatically from hydrated base state.

### 4.3 Hydration

`hydrateState(state)` applies a Firebase snapshot to local reactive state:

1. Sets `isRemoteUpdate = true` (suppresses echo)
2. Assigns each field from the snapshot to its corresponding `ref`
3. Converts arrays back to Sets where needed (`hydrateSet()`)
4. Uses `??` operator for defaults (e.g., `state.tableGenrePoints ?? 13`)
5. Sets `isRemoteUpdate = false` via `setTimeout(0)` to allow the reactive system to settle before re-enabling the watcher

### 4.4 Echo Prevention

The critical challenge: when Firebase sends an update, hydrating local state triggers the watcher, which would push the same state back to Firebase in an infinite loop.

**Solution:** A `let isRemoteUpdate = false` flag:

```
Firebase update arrives
  → hydrateState() sets isRemoteUpdate = true
  → Local refs update (triggers watcher)
  → Watcher checks isRemoteUpdate → true → suppresses push
  → setTimeout(0) sets isRemoteUpdate = false
  → Ready for next local change
```

### 4.5 Host vs. Client Behavior

| Scenario | Host | Client |
|----------|------|--------|
| **On connect** | Pushes initial state to Firebase via `set()` | Waits for first `onValue` callback |
| **hasHydrated** | Set to `true` immediately | Set to `true` after first hydration |
| **Watcher guard** | Always pushes (hasHydrated = true) | Suppresses pushes until hydrated (prevents overwriting server state with empty defaults) |

This asymmetry prevents a newly connected client from wiping the game state with its default values before receiving the host's state.

### 4.6 Watcher Setup

The watcher observes the entire game state:

```typescript
watch(
  [GameState.visibleCards, GameState.selectedCardId, serializeState],
  () => {
    if (!isConnected.value) return;
    if (isRemoteUpdate) return;
    if (!isHost.value && !hasHydrated.value) return;

    const payload = serializeState();
    update(activeGameRef, payload);
  },
  { deep: true }
);
```

The triple-watch target (`visibleCards`, `selectedCardId`, and the full `serializeState` function) ensures the watcher fires on any state change.

### 4.7 Cleanup

`disconnect()` performs:
1. Detaches Firebase listener via `off(activeGameRef)`
2. Clears the active game reference
3. Stops the local watcher
4. Sets `isConnected = false`

This is called on:
- Manual "Leave" button click
- Component unmount (`onUnmounted` hook)

---

## 5. Online Play UI

### 5.1 OnlinePlayTool.vue

The main container with two modes:

#### Lobby Mode

- Text inputs for **Player Name** and **Game ID**
- **Join Game** button: Resets local state, connects as client, enters game mode
- **Create New** button: Generates random 6-char Game ID, resets, connects as host, enters game mode

#### Game Mode

Split-panel layout:
- **Left panel (flex-1):** Shared Game Canvas with a toolbar showing Game ID and Leave button
- **Right panel (450px):** Embedded LivePlayHelper (the full game assistant in compact form)

### 5.2 SharedGameCanvas.vue

A visual representation of the game table, maintaining a strict **16:9 aspect ratio** for positional consistency across devices.

#### Zone Layout

```
┌──────────────────────────────────────────────────┐
│  ZONE 1          ZONE 2           ZONE 3         │
│  Threat Deck     Visible Cards    Trophy Pile     │
│  (5% x 25%)      (center)        (5% x 25%)     │
│                                                   │
│                                                   │
│                  ZONE 4                           │
│                  Resolution                       │
│                  (center, 40% height)             │
│                                                   │
│                                                   │
│──────────────────────────────────────────────────│
│  ZONE 5: HUD (bottom 20%, gradient overlay)       │
│  Strikes display                                  │
└──────────────────────────────────────────────────┘
```

#### Zone Details

| Zone | Label | Position | Content |
|------|-------|----------|---------|
| 1 | Threat Deck | Top-left (5%, 5%) | Clickable deck stack (red glow when cards available) |
| 2 | The Line | Top-center (25%-75%) | Visible cards (CanvasCard components, clickable for selection) |
| 3 | Trophy | Top-right (right 5%) | Current Trophy Pile top card |
| 4 | Resolution | Center (35%-75%) | Canvas controls overlay |
| 5 | HUD | Bottom (gradient) | Strike counter and game info |

#### Interactions

- **Deck click:** Draws a card (only in `scene-setup` phase, when `canAddMore` is true)
- **Card click:** Selects a visible card (only in `scene-setup` phase)
- **Controls:** "Next Phase" button via CanvasControls

### 5.3 Canvas Sub-Components

#### CanvasZone.vue

Positioned container with absolute positioning and optional debug label. Provides layout structure for canvas elements.

#### CanvasCard.vue

Simplified card rendering optimized for the canvas size:

| Prop | Type | Description |
|------|------|-------------|
| `rank` | number | Card rank |
| `suit` | string | Card suit |
| `active` | boolean | Whether this is the selected card |

Compact card with rank + suit symbol, highlighted border when active.

#### CanvasControls.vue

Phase-aware control overlay in the center of the canvas. Shows different controls based on `currentPhase`:
- Scene setup: Card selection guidance
- Resolution: Dice roll display
- Fallout: Summary display

---

## 6. Known Limitations

1. **No Authentication:** Any player who knows the Game ID can join. There is no login, password protection, or player verification.

2. **No Authority Model:** All connected clients can push state changes. There is no server-side validation. A malicious or buggy client could corrupt the game state.

3. **No Conflict Resolution:** If two clients push changes simultaneously, the last write wins. There is no operational transform or CRDT mechanism.

4. **Full State Sync:** Every change syncs the entire game state (~2KB). There is no delta/diff mechanism. This is acceptable for the current state size but could become inefficient with larger payloads.

5. **No Reconnection:** If a client disconnects and reconnects, they must rejoin with the Game ID. There is no session persistence or reconnection token.

6. **No Game Cleanup:** Game data persists in Firebase indefinitely. There is no TTL, cleanup job, or manual delete mechanism.

7. **Single Host Model:** The host designation is local only — it determines initial state push behavior but provides no ongoing privileges. If the host disconnects, the game continues normally for other clients.

---

## 7. Data Flow: Online Game Session

```
1. HOST clicks "Create New"
   → fullReset() clears local state
   → connect(gameId, asHost=true)
   → serializeState() → set() to Firebase
   → startWatching()

2. CLIENT enters Game ID, clicks "Join"
   → fullReset() clears local state
   → connect(gameId, asHost=false)
   → Firebase sends current state via onValue()
   → hydrateState() populates local refs (isRemoteUpdate=true)
   → Watcher suppressed (hasHydrated was false, now true)
   → isRemoteUpdate → false via setTimeout

3. HOST advances phase (e.g., selects playset)
   → Local refs change
   → Watcher fires → serializeState() → update() to Firebase
   → Firebase pushes to all subscribers
   → CLIENT receives → hydrateState() → UI updates

4. CLIENT enters dice roll
   → Local refs change
   → Watcher fires → serializeState() → update() to Firebase
   → Firebase pushes to all subscribers
   → HOST receives → hydrateState() → UI updates

5. Either player clicks "Leave"
   → disconnect() → off() detaches listener, watcher stopped
   → UI returns to lobby
```
