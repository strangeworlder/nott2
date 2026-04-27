# Phase 4: Multiplayer Infrastructure

> **Goal**: Firebase RTDB sync, anonymous auth, room management, host-authority state sync working. Two browser tabs can share game state.  
> **Skills**: `firebase-basics`, `firebase-auth-basics`, `multiplayer-game`, `zustand`  
> **Estimated Effort**: 3 sessions  
> **Depends on**: Phase 2 (game engine)

---

## Deliverables

- [x] Firebase project configured (RTDB + Anonymous Auth)
- [x] Anonymous auth flow — auto-sign-in on first visit, persist across sessions
- [x] Room creation — generate room code, host pushes initial state
- [x] Room joining — enter code, client receives snapshot, hydrates store
- [x] Bidirectional state sync — host pushes, clients receive, echo prevention
- [x] Player presence — online/offline detection, reconnection
- [x] Host authority — validation layer, host-only mutations
- [x] Zustand middleware for Firebase sync
- [x] Room cleanup — idle room detection, manual leave
- [ ] Multi-tab test: 2+ tabs sharing state in real-time

---

## 4.1 Firebase Project Setup

### Services Needed

| Service | Purpose |
|---------|---------|
| **Realtime Database** | Game state sync, signaling (Phase 5), chat |
| **Anonymous Auth** | Player identity without login friction |

### RTDB Structure

```
games/
└── {roomCode}/                    # 6-char alphanumeric code
    ├── meta/
    │   ├── hostId: string         # Firebase UID of host
    │   ├── playset: string        # Selected playset ID
    │   ├── createdAt: number      # Server timestamp
    │   ├── status: string         # 'lobby' | 'playing' | 'finished'
    │   └── roomCode: string       # For display
    ├── players/
    │   └── {playerId}/
    │       ├── name: string
    │       ├── seatIndex: number  # 0-3
    │       ├── characterId: string
    │       ├── ready: boolean
    │       └── lastSeen: number
    ├── state/                     # Serialized GameState (host-owned)
    │   └── ... (full game state)
    ├── actions/                   # Client → Host action queue
    │   └── {actionId}/
    │       ├── type: string
    │       ├── playerId: string
    │       ├── payload: object
    │       └── timestamp: number
    ├── signaling/                 # WebRTC signaling (Phase 5)
    │   └── ...
    └── chat/                      # Chat messages
        └── ...
```

### Security Rules

```json
{
  "rules": {
    "games": {
      "$roomCode": {
        ".read": true,
        ".write": true,
        "state": {
          ".write": "auth != null && data.child('../meta/hostId').val() === auth.uid"
        },
        "actions": {
          ".write": "auth != null"
        }
      }
    }
  }
}
```

> [!NOTE]
> Initial rules are permissive. In production, `state` writes should be restricted to the host UID only. Action writes require auth. Eventually, Cloud Functions could validate actions server-side.

---

## 4.2 Anonymous Auth (`auth.ts`)

```typescript
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';

// Auto sign-in on app load
// Store UID in Zustand for use as playerId
// Anonymous accounts persist across sessions (same browser)
// Upgrade to linked accounts later if needed
```

### Flow

1. App loads → check `onAuthStateChanged`
2. If no user → `signInAnonymously()`
3. Store `user.uid` as `playerId` in Zustand
4. All Firebase writes use this UID for accountability

---

## 4.3 Room Management (`lobby.ts`)

### Create Room

```typescript
async function createRoom(hostId: string, playerName: string): Promise<string> {
  // 1. Generate 6-char room code (uppercase alphanumeric, no ambiguous chars)
  // 2. Check if code exists (unlikely collision)
  // 3. Write meta + host player entry
  // 4. Return room code
}
```

Room code format: `[A-HJ-NP-Z2-9]{6}` (no I, O, 0, 1 to avoid confusion)

### Join Room

```typescript
async function joinRoom(roomCode: string, playerId: string, playerName: string): Promise<void> {
  // 1. Verify room exists and status === 'lobby'
  // 2. Check player count < 4
  // 3. Assign next available seat index
  // 4. Write player entry
  // 5. Subscribe to state changes
}
```

### Leave Room

```typescript
async function leaveRoom(roomCode: string, playerId: string): Promise<void> {
  // 1. Remove player entry
  // 2. If host left → either transfer host or close room
  // 3. Clean up listeners
}
```

---

## 4.4 State Sync (`sync.ts`)

### Host → Firebase → Clients

The host is the single source of truth for `state/`. When the host's Zustand store changes, it serializes and pushes to Firebase.

```typescript
// Zustand middleware approach
const firebaseSyncMiddleware = (roomCode: string, isHost: boolean) => (config) => (set, get, api) => {
  const store = config(
    (...args) => {
      set(...args);
      if (isHost && !get()._isRemoteUpdate) {
        // Debounce and push to Firebase
        debouncedPush(roomCode, get().state);
      }
    },
    get,
    api,
  );
  return store;
};
```

### Client ← Firebase

Clients listen to `state/` and hydrate their local Zustand store:

```typescript
onValue(ref(db, `games/${roomCode}/state`), (snapshot) => {
  const remoteState = snapshot.val();
  if (remoteState) {
    store.setState({
      _isRemoteUpdate: true,
      state: deserializeState(remoteState),
      computed: computeDerived(remoteState),
    });
    // Reset flag after reactive cycle
    requestAnimationFrame(() => store.setState({ _isRemoteUpdate: false }));
  }
});
```

### Echo Prevention

Same pattern as existing Vue app but adapted for Zustand:

```
Local change → set() → middleware checks _isRemoteUpdate
  → if false (local): serialize + push to Firebase
  → if true (remote): suppress push
```

### Serialization Concerns

| Type | Serialize | Deserialize |
|------|-----------|-------------|
| `Set<string>` | `Array.from()` | `new Set()` |
| `Map<K,V>` | `Object.fromEntries()` | `new Map(Object.entries())` |
| `null` vs `undefined` | Firebase drops `undefined` — use `null` | `?? defaultValue` |

---

## 4.5 Client → Host Actions

Instead of clients directly mutating `state/`, they push **actions** to an action queue. The host processes them.

```typescript
// Client side
async function sendAction(roomCode: string, action: GameAction): Promise<void> {
  const actionRef = push(ref(db, `games/${roomCode}/actions`));
  await set(actionRef, {
    ...action,
    timestamp: serverTimestamp(),
  });
}

// Host side — listens to action queue
onChildAdded(ref(db, `games/${roomCode}/actions`), (snapshot) => {
  const action = snapshot.val();
  const validation = engine.validateAction(store.getState().state, action);
  if (validation.valid) {
    store.applyAction(action);
    // Remove processed action
    remove(snapshot.ref);
  } else {
    // Optionally notify client of rejection
    remove(snapshot.ref);
  }
});
```

This is the **host-authority model** from the `multiplayer-game` skill's Turn-Based pattern.

---

## 4.6 Player Presence (`presence.ts`)

Firebase Realtime Database has built-in presence via `onDisconnect()`:

```typescript
const presenceRef = ref(db, `games/${roomCode}/players/${playerId}/lastSeen`);
const connectedRef = ref(db, '.info/connected');

onValue(connectedRef, (snap) => {
  if (snap.val() === true) {
    onDisconnect(presenceRef).set(serverTimestamp());
    set(presenceRef, serverTimestamp());
  }
});
```

### Reconnection

If a player disconnects and reconnects:
1. Their `lastSeen` timestamp will be stale
2. On reconnection, they re-subscribe to `state/`
3. Firebase sends the latest snapshot
4. Store hydrates — player is back in sync

---

## 4.7 Zustand Store Upgrade

The demo mode store (Phase 3) gets upgraded with multiplayer capabilities:

```typescript
interface MultiplayerSlice {
  // Connection state
  roomCode: string | null;
  isHost: boolean;
  isConnected: boolean;
  playerId: string | null;
  
  // Actions
  createRoom: (playerName: string) => Promise<string>;
  joinRoom: (roomCode: string, playerName: string) => Promise<void>;
  leaveRoom: () => Promise<void>;
  
  // Internal
  _isRemoteUpdate: boolean;
}
```

The game actions (`drawCard`, `selectCard`, `rollDice`, etc.) now check:
- **If host**: Apply locally + push to Firebase
- **If client**: Send as action to host via action queue
- **If demo mode** (no roomCode): Apply locally only (same as Phase 3)

---

## Verification

- [ ] Anonymous auth: user persists across page reloads
- [ ] Create room → get 6-char code
- [ ] Join room in second tab → sees same room
- [ ] Host changes phase → client sees phase change
- [ ] Client sends action → host processes and state updates
- [ ] Invalid action rejected (wrong player tries to draw card)
- [ ] Player disconnect → presence updates
- [ ] Player reconnect → state re-synced
- [ ] Host disconnect → game pauses (or host transfer)
- [ ] Demo mode still works without Firebase (no roomCode)
- [ ] 4-tab test → all tabs show consistent state
