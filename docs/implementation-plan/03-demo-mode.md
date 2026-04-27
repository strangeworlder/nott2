# Phase 3: Demo Mode (1-Player Solo Testing)

> **Goal**: A fully playable single-player demo that allows testing the entire game loop without needing other players. This is available from day 0 and remains useful throughout development.  
> **Skills**: `zustand`, `vercel-react-best-practices`  
> **Estimated Effort**: 2 sessions  
> **Depends on**: Phase 1 (atoms) + Phase 2 (game engine)

---

## Philosophy

The demo mode is **not a separate game**. It's the real game with a **simulated table**. One human player controls all four characters, stepping through every phase manually. This serves three purposes:

1. **Development testing** — Verify UI + game engine integration without multiplayer
2. **Design review** — See the design system components in a real game context
3. **Gameplay validation** — Play through full games to find rule bugs

The demo mode should feel like a solitaire version of the existing play assistant, but built on the new architecture. It's the **foundation that the multiplayer mode wraps around**.

---

## Deliverables

- [x] Zustand game store wired to `@nott2/game-engine`
- [x] All game phases playable in sequence (welcome → setup → scenes → win/lose)
- [x] Card draw + selection UI
- [x] Dice rolling (manual input first, animated dice later)
- [x] Phase-by-phase UI screens using design system atoms
- [x] Genre point management
- [x] Strike assignment + death tracking
- [x] Act transitions (Act 1 → 2 → 3 → Finale)
- [x] Win/Lose screens
- [x] Demo accessible at `/demo` route
- [x] No Firebase dependency — fully offline

---

## 3.1 Zustand Store (Local Only)

The store wraps the game engine with React-friendly state management. In demo mode, it has **no Firebase sync** — all state is local.

```typescript
// apps/web/store/game-store.ts
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import * as engine from '@nott2/game-engine';

interface GameStore {
  // State
  state: engine.GameState;
  computed: engine.ComputedGameState;

  // Actions
  initGame: (playset: string) => void;
  nextPhase: () => void;
  prevPhase: () => void;
  drawCard: (suit: engine.Suit, rank: engine.Rank) => void;
  selectCard: (cardId: string) => void;
  rollDice: (d10: number, d4: number) => void;
  applyAptitude: (modifier: 1 | -1) => void;
  useGenrePoint: () => void;
  awardGenrePoint: () => void;
  confirmSacrifice: () => void;
  assignStrike: (characterId: string) => void;
  advanceToNextScene: () => void;
  fullReset: () => void;

  // Demo-specific
  setActivePlayer: (characterId: string) => void;  // Switch AP manually
}

// In demo mode, every action immediately mutates local state.
// In multiplayer mode (Phase 4), actions will additionally sync to Firebase.
```

### Key Design Decision: Engine as Pure Functions

The game engine (`@nott2/game-engine`) is a pure function library:

```typescript
// Engine functions take state in, return new state out
const newState = engine.drawCard(currentState, card);
const newState = engine.nextPhase(currentState);
const newState = engine.applyFallout(currentState);
```

The Zustand store calls these and `set()`s the result:

```typescript
drawCard: (suit, rank) => {
  const card = { id: `${rank}-${suit}`, suit, rank };
  const newState = engine.drawCard(get().state, card);
  set({ state: newState, computed: engine.computeDerived(newState) });
},
```

This separation means:
- Engine is testable without React
- Store is a thin wrapper
- Multiplayer can intercept actions before applying (Phase 4)

---

## 3.2 Demo Page Layout

Route: `/demo`

```
┌─────────────────────────────────────────────────────┐
│  HEADER: "Night of the Thirteenth — Demo Mode"      │
│  Act: 1  |  Phase: scene-setup  |  [Reset]          │
├─────────────────────────────────────────────────────┤
│                                                      │
│  PHASE CONTENT                                       │
│  (Dynamic — changes per phase)                       │
│                                                      │
│  ┌─ welcome ──────────────────────────────────────┐  │
│  │  Game intro, "Begin Setup" button              │  │
│  └────────────────────────────────────────────────┘  │
│                                                      │
│  ┌─ scene-setup ──────────────────────────────────┐  │
│  │  Visible cards | Card entry | Draw button      │  │
│  └────────────────────────────────────────────────┘  │
│                                                      │
│  ┌─ resolution ──────────────────────────────────┐   │
│  │  Difficulty | Dice selectors | Roll result     │  │
│  └────────────────────────────────────────────────┘  │
│                                                      │
├─────────────────────────────────────────────────────┤
│  FOOTER: Characters bar                              │
│  [♠ The Jock ⚡⚡_ ] [♥ The Final _ ] [♣ ... ] [♦ ..]│
│  Genre Points: Table: 11 | Player: 2                 │
└─────────────────────────────────────────────────────┘
```

### Phase Screens

Each phase renders a dedicated component. In demo mode, the player manually advances through each phase.

| Phase | Demo Behavior |
|-------|--------------|
| `welcome` | Show intro text, "Begin" button |
| `game-setup` | Playset selection (start with "default") |
| `act-setup` | Act transition text, "Continue" button |
| `trophy-setup` | Manual trophy card selector (random mode) |
| `scene-setup` | Show visible cards, card entry form, draw/select |
| `conversation-stakes` | Show prompt, sacrifice text area, "Confirm" |
| `resolution` | Dice selectors (d10 + d4), aptitude toggle, genre point toggle |
| `resolve-scene` | Show result (success/fail + effort level), narration space |
| `fallout` | Show fallout effects, strike assignment, genre point award |
| `win` | Victory screen |
| `lose` | Defeat screen |

### Active Player Selection

In demo mode, the player is controlling all 4 characters. The UI needs a way to set who the "Active Player" is each scene.

For **Aces**: Automatically assigned per suit.
For **Main Game**: Player picks which character is the AP (dropdown or character selector bar).

---

## 3.3 Card Entry Component

Since this is an offline demo (no physical cards), the player needs to either:

**Option A: Full Manual Entry** (port from existing ManualCardEntry)
- Suit selector (♠ ♥ ♣ ♦)
- Rank selector (grid of numbers, disabled for unavailable)
- Joker selector (Red / Black / None)

**Option B: Auto-Deal** (new for demo mode)
- "Deal Random Card" button that uses the engine's probability model
- The engine picks a random available card from the threat deck
- Player can override with manual entry if they want control

**Recommendation**: Implement **both**. Auto-deal is the default for fast testing, manual entry available via a toggle. Auto-deal is also what multiplayer mode will use (the host's engine deals cards server-side).

---

## 3.4 Dice Integration

### Phase 1 (This phase): Manual Dice Entry

Simple `DieSelector` components (d10 grid 0–9, d4 grid 1–4). Click to set value, engine computes total.

### Phase 7 (Later): Animated 3D Dice

Replace the manual selectors with `react-ttrpg-dice` for animated rolling. The 3D result feeds into the same store action. Manual override still available.

---

## 3.5 Character Management Bar

Always visible at the bottom of the demo page:

```
┌──────────────────────────────────────────────────────┐
│ ♠ The Jock [⚡⚡_]   ♥ The Final [___]   ♣ The Nerd [⚡__]   ♦ The Rebel [___] │
│ AP: ♠ The Jock        Genre Pool: 11    Player GP: 2                          │
└──────────────────────────────────────────────────────┘
```

- Click a character to set them as AP (if phase allows)
- Strike indicators (filled/empty)
- Dead characters grayed out with ☠️
- Genre point counters

---

## 3.6 Debug Panel

A collapsible debug panel for development:

- Full deck state (middle stack, bottom stack, reserves, unknown)
- Trophy pile contents
- Weaknesses found
- Cards added from reserve counter
- Act 3 countdown
- Manual state override controls
- "Skip to Act 3" button
- "Kill character" button
- "Add weakness" button

---

## Architecture Note: Demo → Multiplayer Upgrade Path

The demo mode is designed to be **wrapped** by multiplayer:

```
Demo Mode:                          Multiplayer Mode:
┌────────────┐                      ┌────────────────────┐
│ User Input │                      │ User Input         │
│     ↓      │                      │     ↓              │
│ Zustand    │      ────→           │ Zustand            │
│ Store      │                      │ Store              │
│     ↓      │                      │     ↓     ↓        │
│ Game       │                      │ Game   Firebase    │
│ Engine     │                      │ Engine   Sync      │
│     ↓      │                      │     ↓     ↓        │
│ UI Update  │                      │ UI    → Other      │
│            │                      │ Update  Players    │
└────────────┘                      └────────────────────┘
```

The only difference is that in multiplayer, the Zustand store also pushes/receives state from Firebase. The engine, the store actions, and the UI components are identical.

---

## Verification

- [x] Can start a new game from `/demo`
- [x] Play through all 4 Aces (Act 1 prologue)
- [x] Draw and resolve a number card
- [x] Draw and resolve a face card (Jack)
- [x] Weakness discovered on first face card defeat
- [x] Act 1 → Act 2 transition fires on face card resolution
- [x] Genre point spend + reroll works
- [x] Aptitude modifier works (±1 d4)
- [x] Strike assignment assigns to correct character
- [x] 3 strikes = death, visual indicator
- [ ] TPK → lose screen
- [ ] Full game: play through to Red Joker → Win
- [x] Auto-deal mode works: cards drawn from engine probability
- [x] Classic Setup mode: deck composition correct
- [x] Final Girl mode: solo survivor triggers endgame
- [x] Debug panel can skip to Act 3
