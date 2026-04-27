# Game Engine Deep Dive

## 1. Overview

The game engine is the digital brain behind Night of the Thirteenth. It simulates a physical card game — tracking decks, shuffles, draws, and probability — while enforcing the game's rules through a finite state machine.

The engine is split across three modules:

| Module | File | Responsibility |
|--------|------|---------------|
| **State** | `gameState.ts` | Holds all mutable reactive state as a singleton |
| **Deck Logic** | `deckLogic.ts` | Card manipulation, availability queries, deck actions |
| **Phase Logic** | `phaseLogic.ts` | FSM transitions, resolution handlers, game lifecycle |

A fourth file, `useLivePlay.ts`, acts as a **Facade** — re-exporting state and methods as a single import point for UI components.

---

## 2. Type System

### 2.1 Core Types (`types.ts`)

```typescript
type Suit = 'Spades' | 'Hearts' | 'Clubs' | 'Diamonds' | 'Unknown';
type Rank = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13;
type JokerColor = 'Red' | 'Black';

interface Card {
  id: string;       // e.g., "5-Hearts", "11-Spades"
  suit: Suit;
  rank: Rank;
  isJoker?: boolean;
  jokerColor?: JokerColor;
}
```

### 2.2 Extended Types (`gameState.ts`)

```typescript
type LivePlayPhase =
  | 'welcome' | 'game-setup' | 'act-setup' | 'trophy-setup'
  | 'scene-setup' | 'conversation-stakes' | 'resolution'
  | 'resolve-scene' | 'fallout' | 'win';

interface Character {
  id: string;        // Suit name (e.g., "Spades")
  name: string;      // Player-chosen name (e.g., "The Jock")
  strikes: number;   // 0-3
  isDead: boolean;   // true when strikes ≥ 3
}

interface LivePlayCard extends Card {
  name: string;        // Human-readable rank name
  description: string; // Flavor text (usually empty)
  type: 'number' | 'face';
}
```

### 2.3 The "Unknown" Suit

In **Random Mode** (non-classic setup), the initial deck composition is unknown — cards are shuffled before dealing, so players don't know which specific cards are in the Threat Deck vs. the Reserve.

The engine represents this uncertainty with `suit: 'Unknown'`. Unknown cards track counts by rank category:
- `unknownThreatCards[0]` — generic number cards (rank unknown) in Threat Deck
- `unknownThreatCards[11]` — unknown Jacks in Threat Deck
- `unknownBottomStack[0]` — generic number cards at bottom of deck

When a card is "revealed" (physically drawn from the deck), the player identifies it via Manual Card Entry, collapsing the Unknown into a specific suit.

---

## 3. State Management (`gameState.ts`)

All state is implemented as **module-level exports** — Vue `ref()` and `computed()` values that are singletons across the entire application.

### 3.1 Core Data

| State | Type | Description |
|-------|------|-------------|
| `visibleCards` | `ref<LivePlayCard[]>` | Cards currently face-up on the table (max 2, or 1 during Aces) |
| `selectedCardId` | `ref<string \| null>` | ID of the card the AP has selected |
| `falloutCard` | `ref<LivePlayCard \| null>` | Preserved active card during Fallout phase (survives shuffle) |
| `selectedJoker` | `ref<'Red' \| 'Black' \| null>` | Which Joker is active (if any) |
| `activeCard` | `computed<LivePlayCard \| null>` | Resolves to falloutCard during fallout, or selected visible card |

### 3.2 Game Stats

| State | Type | Description |
|-------|------|-------------|
| `strikes` | `ref<number>` | Global strike counter (deprecated — per-character now) |
| `characters` | `ref<Character[]>` | Array of 4 characters (one per suit) |
| `strikesToAssign` | `ref<number>` | Pending strikes to assign to characters |
| `weaknessesFound` | `ref<Suit[]>` | List of defeated Killer suits (up to 4) |
| `isEndgame` | `ref<boolean>` | Whether Act 3 has been triggered |
| `tableGenrePoints` | `ref<number>` | Genre Points remaining in the central pool (starts at 13) |
| `playerGenrePoints` | `ref<number>` | Genre Points held by the active player |
| `currentAct` | `ref<number>` | Current act (1, 2, or 3) |
| `currentPhase` | `ref<LivePlayPhase>` | Current FSM phase |
| `selectedPlayset` | `ref<string \| null>` | Active playset ID |

### 3.3 Manual Input

| State | Type | Description |
|-------|------|-------------|
| `manualSuit` | `ref<Suit>` | Suit selected in Manual Card Entry |
| `manualRank` | `ref<Rank>` | Rank selected in Manual Card Entry |
| `manualJoker` | `ref<'Red' \| 'Black' \| null>` | Joker selected in Manual Card Entry |
| `manualOverride` | `ref<boolean>` | Whether manual entry is overriding auto-detection |
| `debugMode` | `ref<boolean>` | Whether debug panel is visible (dev only) |

### 3.4 Deck State

The deck is a probabilistic model — not a literal array of cards. It tracks **counts** of cards in various locations.

| State | Type | Description |
|-------|------|-------------|
| `acesRemaining` | `ref<number>` | Aces still on top of the Threat Deck (starts at 4) |
| `middleStack` | `ref<Record<number, number>>` | Known card counts in the active (drawable) part of Threat Deck. Key = rank, value = count. |
| `bottomStack` | `ref<Record<number, number>>` | Known card counts at the bottom of the Threat Deck (not drawable until shuffle). |
| `reserveQueue` | `ref<number[]>` | Classic mode only: ordered list of reserve card ranks to be added |
| `drawnCards` | `ref<Set<string>>` | Set of card IDs currently drawn (visible, in Trophy, or removed) |
| `trophyPile` | `ref<LivePlayCard[]>` | All cards in the Trophy Pile |
| `trophyTop` | `ref<LivePlayCard \| null>` | The current top card of the Trophy Pile |
| `isTrophyTopRandomized` | `ref<boolean>` | Whether the top was set by shuffle (true) or by adding a card (false) |
| `faceCardReserves` | `ref<{11: number, 12: number, 13: number}>` | Available Jack/Queen/King reserves |
| `lastAddedFaceCardRank` | `ref<number \| null>` | Rank of the most recently added face card (for UI display) |
| `removedFaceCards` | `ref<Record<number, number>>` | Count of face cards permanently removed (by rank) |
| `removedFaceCardIds` | `ref<Set<string>>` | Specific IDs of face cards permanently removed (weakness/Black Joker) |
| `unknownThreatCards` | `ref<Record<number, number>>` | Unknown card counts in Threat Deck (key 0 = generic numbers) |
| `unknownBottomStack` | `ref<Record<number, number>>` | Unknown card counts at bottom of deck |
| `unknownReserveCards` | `ref<number>` | Unknown cards remaining in Reserve (Random mode) |
| `knownBottomStackCards` | `ref<Set<string>>` | Known card IDs at the bottom (can't be drawn until shuffle) |
| `identifiedCards` | `ref<Set<string>>` | All cards that have been revealed/identified in this game |
| `cardsAddedFromReserve` | `ref<number>` | Running count of cards added from Reserve (triggers Act 3 at 13) |

### 3.5 Resolution State

| State | Type | Description |
|-------|------|-------------|
| `sacrificeConfirmed` | `ref<boolean>` | Whether the Sacrifice has been defined |
| `rollMain` | `ref<number \| null>` | d10 result (0-9) |
| `rollEffort` | `ref<number \| null>` | d4 result (1-4) |
| `isGenrePointUsed` | `ref<boolean>` | Whether a Genre Point was spent this scene |
| `isGenrePointAwarded` | `ref<boolean>` | Whether a Genre Point was awarded this scene |
| `isEndgameInitialized` | `ref<boolean>` | Whether Act 3 setup has been completed |
| `isGameWon` | `ref<boolean>` | Game victory state |
| `isBlackJokerRemoved` | `ref<boolean>` | Whether Black Joker has been resolved |
| `jokersAdded` | `ref<boolean>` | Whether Jokers have been shuffled into the deck |
| `pendingActSetups` | `ref<string[]>` | Queue of pending act setup screens (e.g., ['3', 'jokers']) |

### 3.6 Computed State

| Computed | Derivation | Description |
|----------|-----------|-------------|
| `activeCard` | Phase + selectedCardId + visibleCards | The card being resolved |
| `isFaceCard` | activeCard.type or rank > 10 | Whether current card is a Face Card |
| `areJokersAvailable` | jokersAdded | Whether Jokers are in play |
| `isGameOver` | All characters dead or game won | Terminal state |
| `isMiddleStackEmpty` | All middleStack + unknownThreatCards counts = 0 | Whether threat deck is exhausted |
| `rollTotal` | rollMain + rollEffort | Combined d13 result |
| `effortResult` | effortScale[rollEffort - 1] | Effort level definition |
| `targetDifficulty` | Rank for numbers; Trophy Top + modifier for face/joker | The number to beat |
| `isSuccess` | rollTotal >= targetDifficulty | Success or failure |
| `act3Countdown` | 13 - cardsAddedFromReserve | Cards until Act 3 trigger |

---

## 4. Deck Logic (`deckLogic.ts`)

### 4.1 Card Availability

#### `isRankAvailable(rank: Rank): boolean`

Determines if a given rank can still be drawn from the Threat Deck. Checks:
1. If rank is 1 (Ace) — requires `acesRemaining > 0`
2. If all 4 suits of that rank have been drawn — rank exhausted
3. If physical copies exist in `middleStack`, `bottomStack`, `unknownThreatCards`, or `unknownBottomStack`

#### `isSuitAvailable(rank: Rank, suit: Suit): boolean`

Determines if a specific card (e.g., "5 of Hearts") can still be drawn. Checks:
1. Not permanently removed (face card weakness/Black Joker)
2. Not currently drawn
3. Not known to be at the bottom of the deck
4. If explicitly identified and in-play → available
5. If not identified → checks for available "open slots" (total active cards minus identified cards)

This two-level check (rank then suit) enables the Manual Card Entry UI to disable impossible selections.

### 4.2 Card Drawing

#### `getNextValidCard(): { rank: Rank; suit: Suit }`

Auto-detects what the next drawn card should be. Priority:
1. Aces (if remaining) — picks first undrawn Ace suit
2. Known ranks in `middleStack` — picks lowest available
3. Unknown face cards — returns generic (e.g., `{11, 'Spades'}` as placeholder)
4. Unknown number cards — returns `{2, 'Spades'}` as default

This is used to pre-populate the Manual Card Entry fields for convenience.

### 4.3 Deck Actions

#### `updateDeckState(rank, suit, action: 'draw' | 'add' | 'return')`

The central mutation function for card movement:

| Action | Effect |
|--------|--------|
| `draw` | Adds card ID to `drawnCards`; decrements appropriate stack counter (middle → bottom → unknown) |
| `add` | Increments `bottomStack[rank]` |
| `return` | Removes from `drawnCards`; increments `bottomStack` or `unknownBottomStack`; adds to `knownBottomStackCards` |

#### `addNextReserve(): boolean`

Adds the next card from the Reserve to the bottom of the Threat Deck.

- **Classic Mode:** Shifts from `reserveQueue` (known ranks) → `bottomStack`
- **Random Mode:** Decrements `unknownReserveCards` → increments `unknownBottomStack[0]`

Increments `cardsAddedFromReserve`. Returns `true` if this triggered the Act 3 threshold (13 cards).

### 4.4 Shuffle Operations

#### `shuffleThreatDeck()`

1. Returns all visible cards to the deck via `updateDeckState(_, _, 'return')`
2. Clears `visibleCards` and `selectedCardId`
3. Merges `bottomStack` into `middleStack` (all cards become drawable)
4. Merges `unknownBottomStack` into `unknownThreatCards`
5. Clears `knownBottomStackCards`

#### `shuffleTrophyPile()`

Randomly selects a card from `trophyPile` as the new `trophyTop`. Sets `isTrophyTopRandomized = true`.

### 4.5 Face Card Reserve Management

#### `addFaceCardFromReserve(targetType: 'Jack' | 'Queen' | 'King'): boolean`

Attempts to add a face card from reserves with fallback chain:

| If requesting... | Fallback order |
|-----------------|---------------|
| Jack | Jack → Queen → King |
| Queen | Queen → King → Jack |
| King | King → Queen → Jack |

Decrements `faceCardReserves`, sets `lastAddedFaceCardRank`, and adds to appropriate stack. Returns `false` if no face cards available.

#### `removeHighestFaceCardFromDeck()`

Used by Black Joker success. Removes the highest-ranked face card (King > Queen > Jack) from the Threat Deck. Checks both `middleStack`/`bottomStack` (Classic) and `unknownThreatCards`/`unknownBottomStack` (Random).

### 4.6 Visible Card Management

#### `addVisibleCard()`

Handles adding a card to the visible area:
- If `manualJoker` is set → sets `selectedJoker` (no physical card added)
- If an unknown card is visible → replaces it with the identified card
- Otherwise → creates a new `LivePlayCard` and adds to `visibleCards`

Handles identity tracking (`identifiedCards`), deck state updates, and the Final Girl rules module check.

#### `selectCard(id: string)`

Sets `selectedCardId` and clears `selectedJoker`.

### 4.7 Classic Mode Detection

```typescript
const isClassicMode = () => {
  const config = getPlaysetConfig(selectedPlayset.value);
  return config.rulesModules?.classicSetup;
};
```

This flag branches behavior in `addNextReserve`, `addFaceCardFromReserve`, `addVisibleCard`, `removeHighestFaceCardFromDeck`, and the initial deck setup in `startGame`.

---

## 5. Phase Logic (`phaseLogic.ts`)

### 5.1 Phase State Machine

#### `nextPhase()`

Transitions forward through the game loop:

```
welcome → game-setup → act-setup → scene-setup
                                  ↗ (classic: via startGame)
                     trophy-setup  → scene-setup  (non-classic: via startGame)
scene-setup → conversation-stakes → resolution → resolve-scene → fallout
                                                    ↓ (calls applyGameStateUpdates)
                                                    ↓ (may → 'win' if Red Joker)
fallout → startNextScene() → scene-setup (or act-setup if triggers)
```

The `resolve-scene → fallout` transition is special: it calls `applyGameStateUpdates()` first, which may change the phase to `'win'`.

#### `prevPhase()`

Allows backward navigation in limited cases:
- `game-setup → welcome`
- `act-setup → game-setup` (Act 1 only)
- `conversation-stakes → scene-setup`
- `resolution → conversation-stakes`
- `resolve-scene → resolution`
- `fallout → resolve-scene`

### 5.2 Game Lifecycle Events

#### `startGame()`

Called after Act 1 setup:
- **Classic Mode:** Initializes `unknownThreatCards` as all zeros (everything known), sets up Trophy Pile with four 10s, shuffles Trophy, advances phase.
- **Random Mode:** Sets `unknownThreatCards` to `{0: 8, 11: 1}` (8 unknown numbers + 1 unknown Jack), zeros out `middleStack`, sets `unknownReserveCards = 14`, transitions to `trophy-setup` for manual Trophy card identification.

#### `startAct3()`

Triggered when 4 weaknesses found or 13 reserve cards added:
1. Sets `currentAct = 3`, `isEndgame = true`
2. Queues 'Act 3' setup screen via `pendingActSetups`
3. Transitions to `act-setup` phase

#### `startEndgame()`

Called after the Act 3 interstitial is dismissed:
1. Clears all Aces, resets all number card stacks to 0
2. Removes number cards from unknown stacks
3. Clears reserve queue
4. Resets resolution state
5. Transitions to `scene-setup`
6. Sets `isEndgameInitialized = true`

#### `triggerJokerEvent()`

Queues the Joker addition screen. Called when 4 weaknesses trigger The Finale.

### 5.3 Pending Act Setup Queue

When multiple triggers fire simultaneously (e.g., 4th weakness found → Act 3 AND Jokers), they're queued:

```typescript
pendingActSetups.value.push('3');      // Act 3 screen
pendingActSetups.value.push('jokers'); // Joker addition screen
currentPhase.value = 'act-setup';
```

The `ActSetup` component displays the first item. When the user proceeds:
1. `consumePendingActSetup()` removes it from the queue
2. If more items remain, the phase stays `act-setup` (component re-renders with next key)
3. If queue is empty, normal progression resumes

### 5.4 Resolution Handlers

#### `applyGameStateUpdates()`

Called when transitioning from `resolve-scene` to `fallout`. This is the master resolution function:

1. **Preserves** activeCard as `falloutCard` (survives deck shuffles)
2. **Breaking Point check:** If d4 = 4, increments `strikesToAssign`
3. **Routes** to the appropriate handler based on card type:
   - Joker → `handleJokerResolution()`
   - Ace → `handleAceResolution()`
   - Number Card (2-10) → `handleNumberCardResolution()`
   - Face Card (11-13) → `handleFaceResolution()`
4. **Act 3 check:** If `cardsAddedFromReserve >= 13` and not in Act 3 → `startAct3()`

#### `handleJokerResolution(success: boolean)`

**Red Joker:**
- Success → `isGameWon = true`, phase → `win`
- Failure → Death (handled by UI/rules text)

**Black Joker:**
- Success → `removeHighestFaceCardFromDeck()`
- Failure → `addFaceCardFromReserve('King')`
- Always → `isBlackJokerRemoved = true`, shuffle threat + trophy, trigger joker event

#### `handleAceResolution(success: boolean)`

- Success → Card stays in `drawnCards` (effectively removed from game, does NOT go to Trophy)
- Failure → Card returned to bottom of Threat Deck

#### `handleNumberCardResolution(success: boolean)`

- Success → Card added to Trophy Pile + `addNextReserve()`
- Failure → Card returned to bottom + `addNextReserve()`

#### `handleFaceResolution(success: boolean)`

**On Success:**
1. **Weakness check:** If first defeat of this suit → remove card from `visibleCards` (so shuffle won't return it)
2. **If repeated suit:** Card stays in `visibleCards` (shuffle will return it to deck)
3. **Reinforcements:** Effort 1-2 → add Jack; Effort 3-4 → add Queen

**On Failure:**
1. Increment `strikesToAssign` (Strike from Killer)
2. `addFaceCardFromReserve('King')`
3. If Act 1 → transition to Act 2

**Always:** Shuffle Threat Deck and Trophy Pile.

### 5.5 Scene Cleanup

#### `startNextScene()`

Called when the Fallout phase completes:

1. If game won → return (no-op)
2. **Deferred weakness update:** If the fallout card was a successful, first-time face card defeat → add suit to `weaknessesFound`. If all 4 found → queue Act 3 + Jokers as pending setups.
3. Remove selected visible card
4. Reset all scene-specific state (selection, rolls, genre points, sacrifice, joker)
5. If endgame needs initialization → go to `act-setup`
6. Auto-detect next valid card for Manual Entry pre-population
7. Transition to `scene-setup`

### 5.6 Character & Genre Points

#### `assignStrike(charId: string)`

Increments strike count for the character. At 3 strikes, `isDead = true`. Checks for TPK (all dead → game over). Also checks Final Girl condition.

#### `checkFinalGirlCondition()`

If `finalGirl` rules module is active and only one survivor remains → triggers Act 3 and adds Jokers.

#### `toggleGenrePointUsage()`

Toggles Genre Point spend for the current scene. Moves 1 point from player pool (spent → removed from game via counter).

#### `toggleGenrePointAward()`

Toggles Genre Point award. Moves 1 point from table pool to player pool (or back if toggled off).

### 5.7 Full Reset

`fullReset()` restores every piece of state to its initial value — the digital equivalent of putting all the cards back in the box and starting fresh.

---

## 6. Difficulty Calculation

The `targetDifficulty` computed property in `gameState.ts`:

```typescript
const getDifficulty = () => {
  // Jokers: Trophy Top + 0 (base only)
  if (selectedJoker.value) {
    return trophyTop.value?.rank || 0;
  }

  const rank = activeCard.value?.rank;
  if (!rank) return 0;

  // Number Cards (1-10): Difficulty = Rank
  if (rank <= 10) return rank;

  // Face Cards (11+): Trophy Top + Modifier
  const base = trophyTop.value?.rank || 0;
  let modifier = 0;
  if (rank === 11) modifier = 1;  // Jack
  if (rank === 12) modifier = 2;  // Queen
  if (rank === 13) modifier = 3;  // King

  return base + modifier;
};
```

---

## 7. Data Flow Example: A Complete Scene

```
1. Player enters scene-setup phase
2. ManualCardEntry pre-populated via getNextValidCard()
3. Player draws a card → addVisibleCard()
   → Creates LivePlayCard
   → Updates drawnCards, middleStack/unknownThreatCards
   → identifiedCards set updated
4. Player selects card → selectCard(id)
   → selectedCardId set
   → activeCard computed updates
5. Phase advances → conversation-stakes → resolution
6. Player enters d10 and d4 values
   → rollMain, rollEffort set
   → rollTotal, isSuccess, effortResult, targetDifficulty all recompute
7. Phase advances to resolve-scene → player narrates
8. Phase advances to fallout → applyGameStateUpdates() fires
   → Appropriate handler modifies deck state
   → strikesToAssign set if needed
9. Player assigns strikes, awards genre points
10. Player clicks "Next Scene" → startNextScene()
    → Weakness tracking updates
    → Scene state resets
    → Phase → scene-setup (loop continues)
```
