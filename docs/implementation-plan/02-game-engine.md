# Phase 2: Game Engine

> **Goal**: Pure TypeScript game engine with full rule coverage, zero React dependencies, comprehensive tests.  
> **Skills**: `typescript-advanced-types`  
> **Estimated Effort**: 3–4 sessions  
> **Depends on**: Phase 0

---

## Deliverables

- [x] Complete type system for the entire game domain
- [x] Deck logic: creation, draw, shuffle, reserves, face card management
- [x] Phase FSM: all transitions, act management, pending setup queue
- [x] Resolution: d13 rolls, difficulty calculation, effort scale, aptitude
- [x] Fallout: number card, face card, ace, joker resolution handlers
- [x] Rules modules: Classic Setup, Final Girl
- [x] Scene prompts: suit × rank matrix lookup
- [x] Validation: move validation for host-authority model
- [ ] 100% rule coverage verified against `docs/01-game-rules.md`
- [x] All tests passing

---

## 2.1 Type System (`types.ts`)

### Core Types

```typescript
// Branded types for extra safety (typescript-advanced-types skill)
type Suit = 'Spades' | 'Hearts' | 'Clubs' | 'Diamonds';
type Rank = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13;
type JokerColor = 'Red' | 'Black';
type FaceRank = 11 | 12 | 13;  // Jack | Queen | King

interface Card {
  id: string;           // "5-Hearts", "11-Spades"
  suit: Suit;
  rank: Rank;
}

interface JokerCard {
  id: string;           // "Joker-Red", "Joker-Black"
  color: JokerColor;
  isJoker: true;
}

type GameCard = Card | JokerCard;
```

### Player & Character Types

```typescript
interface Character {
  id: Suit;              // One character per suit
  name: string;          // Player-chosen archetype name
  aptitude: Suit;        // Same as id
  strikes: 0 | 1 | 2 | 3;
  isDead: boolean;
}

interface Player {
  id: string;            // Firebase UID or anonymous ID
  name: string;          // Display name
  characterId: Suit;     // Which character they're playing
  isHost: boolean;
  isConnected: boolean;
  seatIndex: 0 | 1 | 2 | 3;
}
```

### Game State Types

```typescript
type Phase =
  | 'lobby'              // NEW: waiting for players
  | 'welcome'
  | 'game-setup'
  | 'act-setup'
  | 'trophy-setup'
  | 'scene-setup'
  | 'conversation-stakes'
  | 'resolution'
  | 'resolve-scene'
  | 'fallout'
  | 'win'
  | 'lose';

type Act = 1 | 2 | 3;

interface DeckState {
  /** Threat deck — ordered array, index 0 is the top card. Draw from front. */
  threatDeck: Card[];
  /** Number card reserve — draw from [0] to add to threat deck bottom */
  reserve: Card[];
  /** Face card reserve — pool of Jacks/Queens/Kings not yet in play */
  faceCardReserve: Card[];
  /** Trophy pile — last element is the top (determines face card difficulty) */
  trophyPile: Card[];
  /** Convenience: trophyPile[trophyPile.length - 1] or null */
  trophyTop: Card | null;
  /** Cards currently face-up on the table */
  visibleCards: Card[];
  /** Permanently removed cards (weakness victories, Ace tokens) */
  removedCards: Card[];
  /** Suits whose Face Card has been defeated (weakness found) */
  weaknessesBySuit: Set<Suit>;
  /** Reserve cards added to threat deck — Act 3 triggers at 13 */
  cardsAddedFromReserve: number;
}

interface TurnOrder {
  /** Suits of players whose Aces are face-up (available to act) */
  available: Suit[];
  /** Suits of players who have already acted this round (Ace face-down) */
  acted: Suit[];
}

interface SceneState {
  selectedCardId: string | null;
  activeJoker: JokerColor | null;
  sacrificeConfirmed: boolean;
  rollMain: number | null;                  // d10 (0–9)
  rollEffort: number | null;                // d4 (1–4)
  isGenrePointUsed: boolean;
  isGenrePointAwarded: boolean;
  activePlayerId: string | null;            // Who is the AP this scene
}

interface GameState {
  phase: Phase;
  currentAct: Act;
  deck: DeckState;
  scene: SceneState;
  characters: Character[];
  players: Player[];
  turnOrder: TurnOrder;                     // NEW: Ace token turn tracking
  weaknessesFound: Suit[];
  tableGenrePoints: number;                 // Pool (starts at 13)
  playerGenrePoints: Record<string, number>; // Per-player pool
  strikesToAssign: number;
  isEndgame: boolean;
  isEndgameInitialized: boolean;
  isGameWon: boolean;
  jokersAdded: boolean;
  isBlackJokerRemoved: boolean;
  pendingActSetups: string[];
  playset: string;
  rulesModules: {
    classicSetup: boolean;
    finalGirl: boolean;
  };
}
```

### Derived/Computed Types

```typescript
interface ComputedGameState {
  activeCard: Card | null;
  isFaceCard: boolean;
  rollTotal: number | null;
  targetDifficulty: number;
  isSuccess: boolean | null;
  effortLevel: EffortLevel | null;
  act3Countdown: number;
  isPrologue: boolean;                      // threatDeck[0]?.rank === 1
  threatDeckSize: number;                   // threatDeck.length
  isGameOver: boolean;
  activeSuit: Suit | null;
  activeRank: Rank | null;
  livingCharacters: Character[];
  deadCharacters: Character[];
  hasFaceCardOnTable: boolean;
}

type EffortLevel = 'controlled' | 'pushing-it' | 'overexertion' | 'breaking-point';
```

---

## 2.2 Deck Logic (`deck.ts`)

### Functions

| Function | Description | Tests |
|----------|-------------|-------|
| `createDeck(rulesModules)` | Build the full deck: shuffle real cards, deal, distribute | Random + Classic mode |
| `drawCard(deck)` | Pop top card from `threatDeck`, add to `visibleCards` | Ordered draw, empty deck |
| `returnCard(deck, card)` | Remove from `visibleCards`, push to end of `threatDeck` | Correct placement at bottom |
| `addToTrophyPile(deck, card)` | Remove from `visibleCards`, push to `trophyPile`, update `trophyTop` | New top card |
| `shuffleThreatDeck(deck)` | Fisher-Yates shuffle entire `threatDeck` (also sweeps `visibleCards` back in) | Randomization, visibility clear |
| `shuffleTrophyPile(deck)` | Fisher-Yates shuffle `trophyPile`, pick random new top | Random top selection |
| `addFromReserve(deck)` | `reserve.shift()` → `threatDeck.push()`, increment counter | Empty reserve, Act 3 trigger |
| `addFaceCardFromReserve(deck, target)` | Find in `faceCardReserve` with fallback chain, push to `threatDeck` | Jack→Queen→King fallback |
| `removeCardPermanently(deck, card)` | Move card to `removedCards` | Visibility cleanup |
| `removeHighestFaceCard(deck)` | Scan `threatDeck` for highest face card, splice out | King>Queen>Jack priority |
| `removeNumberCardsForAct3(deck)` | Filter `threatDeck` to keep only face cards | Act 3 setup |
| `addJokersToDeck(deck)` | Push Joker cards, shuffle | Finale setup |
| `isPrologue(deck)` | `threatDeck[0]?.rank === 1` | Prologue detection |
| `shuffle(arr)` | Fisher-Yates shuffle utility (pure, returns new array) | Randomization |

### Removed Functions

The following are no longer needed with the card array model:
- `isRankAvailable` — use `threatDeck.some(c => c.rank === rank)` directly
- `isSuitAvailable` — use `threatDeck.some(c => c.id === id)` directly
- `getNextValidCard` — just peek at `threatDeck[0]`
- `removeFromVisible` — subsumed by `returnCard` and `removeCardPermanently`
- `removeAce` — Aces are removed via `removeCardPermanently`

### Edge Cases to Test

- Empty threat deck → `drawCard` returns null
- Empty reserve → no card added, counter still increments
- All face card reserves exhausted → no reinforcement
- Trophy pile with 1 card → shuffle returns same card
- Classic mode reserve → ordered depletion with real cards
- Deck integrity invariant: total cards across all locations = expected total

---

## 2.2.1 Turn Order (`turn-order.ts`)

### Functions

| Function | Description |
|----------|-------------|
| `initTurnOrder(characters)` | Set all living characters as available (Ace face-up) |
| `markActed(turnOrder, suit)` | Move suit from `available` → `acted` (flip Ace face-down) |
| `resetRound(turnOrder)` | Move all `acted` → `available` (new round begins) |
| `isRoundComplete(turnOrder)` | `available.length === 0` |
| `getAvailablePlayers(turnOrder)` | Return list of suits that can be AP |
| `removeFromTurnOrder(turnOrder, suit)` | Remove dead player from both lists |
| `autoSelectPrologueAP(deck, characters)` | Match top Ace suit to character |

---

## 2.3 Phase FSM (`phases.ts`)

### State Machine

```
lobby → welcome → game-setup → act-setup →╮
                                           ├→ trophy-setup → scene-setup
                                           ╰→ scene-setup (classic)
                                           
scene-setup → conversation-stakes → resolution → resolve-scene → fallout
                                                                    │
                                                   ╭────────────────╯
                                                   ├→ scene-setup (next scene)
                                                   ├→ act-setup (act transition)
                                                   ├→ win (Red Joker victory)
                                                   ╰→ lose (TPK)
```

### Functions

| Function | Description |
|----------|-------------|
| `nextPhase(state)` | Advance to the next phase in the loop |
| `prevPhase(state)` | Go back (limited cases) |
| `startGame(state)` | Initialize decks after act-setup (classic vs random) |
| `startAct3(state)` | Remove number cards, set endgame |
| `startEndgame(state)` | Post-Act 3 setup screen initialization |
| `triggerJokerEvent(state)` | Queue joker addition screen |
| `consumePendingActSetup(state)` | Pop from pending queue |
| `startNextScene(state)` | Reset scene state, check weakness/act triggers |

---

## 2.4 Resolution (`resolution.ts`)

### Functions

| Function | Description |
|----------|-------------|
| `calculateDifficulty(card, trophyTop, joker)` | Number=rank, Face=trophy+mod, Joker=trophy+0 |
| `calculateTotal(d10, d4)` | Clamped 1–13 |
| `getEffortLevel(d4)` | 1=controlled, 2=pushing, 3=overexertion, 4=breaking |
| `canUseAptitude(characterSuit, cardSuit)` | Match check |
| `applyAptitudeModifier(d4, modifier)` | ±1 on effort, recompute total |
| `applyGenrePointReroll(d10)` | +1 to new d10, clamp total to 13 |
| `applyFallout(state, card, isSuccess, d4)` | Master fallout handler → routes to sub-handlers |
| `handleNumberCardFallout(state, card, isSuccess)` | Trophy or return + reserve |
| `handleFaceCardFallout(state, card, isSuccess, d4)` | Weakness, reinforcement, shuffle |
| `handleAceFallout(state, card, isSuccess)` | Remove or return |
| `handleJokerFallout(state, joker, isSuccess)` | Red=win/death, Black=remove highest/add king |

---

## 2.5 Rules Modules (`rules-modules.ts`)

### Classic Setup

| Aspect | Implementation |
|--------|---------------|
| Deck init | 2s, 3s, 4s (12 cards) + 1 Jack in threat deck |
| Reserve | Ordered queue: [5, 5, 5, 5, 6, 6, 6, 6, 7, 7, 7, 7, 8, 8, 8, 8, 9, 9, 9, 9, 10, 10, 10, 10] |
| Trophy start | Four 10s, randomly select one as top |
| Card identity | All cards known by rank (no Unknown suit) |

### Final Girl

| Aspect | Implementation |
|--------|---------------|
| Face card strike | Any face card encounter → automatic `strikesToAssign++` |
| Solo survivor | When 1 character alive → `startAct3()` + `triggerJokerEvent()` |

---

## 2.6 Validation (`validation.ts`)

For the host-authority model — validates player actions before applying:

```typescript
interface GameAction {
  type: 'draw_card' | 'select_card' | 'roll_dice' | 'advance_phase' |
        'assign_strike' | 'award_genre_point' | 'use_genre_point' |
        'apply_aptitude' | 'confirm_sacrifice' | 'escalate';
  playerId: string;
  payload: unknown;
}

function validateAction(state: GameState, action: GameAction): ValidationResult;
```

| Validation | Rule |
|-----------|------|
| Only AP can draw/select cards | `action.playerId === state.scene.activePlayerId` |
| Only AP can roll dice | Same |
| Only host can advance phase | `player.isHost` |
| Cards must be available | `isSuitAvailable()` |
| Face card must be selected if visible | Business rule enforcement |
| Genre point must be available | Pool check |
| Strike assignment valid | Character alive, strikes pending |
| Escalation once per scene | Track per scene |

---

## Verification

- [x] All tests pass (`npm run test` in game-engine package)
- [ ] Full game simulation: Act 1 → Act 2 → Act 3 → Finale → Win
- [ ] Full game simulation: TPK → Lose
- [ ] Classic Setup mode: complete game
- [ ] Final Girl mode: solo survivor triggers endgame
- [ ] All edge cases from `docs/01-game-rules.md` §8.8, §9.5, §10, §11.4
- [ ] Dual strike scenario: Breaking Point (d4=4) on Face Card failure
- [ ] Simultaneous Act 3 + Joker trigger
- [ ] Genre Point reroll with +1 modifier, clamped to 13
- [ ] Empty reserve behavior
- [ ] All face card reserves exhausted
