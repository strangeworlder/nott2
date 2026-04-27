/**
 * @nott2/game-engine — Types
 *
 * The complete domain type system for Night of the Thirteenth v2.0.
 * Zero React dependencies. Pure TypeScript.
 *
 * Source of truth: docs/01-game-rules.md
 */

// ── Primitives ─────────────────────────────────────────────────────────────

export type Suit = 'Spades' | 'Hearts' | 'Clubs' | 'Diamonds';
export type Rank = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13;
export type FaceRank = 11 | 12 | 13;
export type JokerColor = 'Red' | 'Black';
export type Act = 1 | 2 | 3;
export type StrikeCount = 0 | 1 | 2 | 3;
export type EffortLevel = 'controlled' | 'pushing-it' | 'overexertion' | 'breaking-point';
export type D4Result = 1 | 2 | 3 | 4;
export type D10Result = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

// ── Cards ───────────────────────────────────────────────────────────────────

export interface Card {
  id: string;      // e.g. "5-Hearts", "11-Spades", "1-Clubs"
  suit: Suit;
  rank: Rank;
}

export interface JokerCard {
  id: string;      // "Joker-Red" | "Joker-Black"
  color: JokerColor;
  isJoker: true;
}

export type GameCard = Card | JokerCard;

export function isJoker(card: GameCard): card is JokerCard {
  return 'isJoker' in card && card.isJoker === true;
}

export function isFaceCard(card: Card): boolean {
  return card.rank >= 11;
}

export function isAce(card: Card): boolean {
  return card.rank === 1;
}

export function isNumberCard(card: Card): boolean {
  return card.rank >= 2 && card.rank <= 10;
}

// ── Characters & Players ────────────────────────────────────────────────────

export interface Character {
  id: Suit;
  name: string;
  aptitude: Suit;
  strikes: StrikeCount;
  isDead: boolean;
}

export interface Player {
  id: string;
  name: string;
  characterId: Suit;
  isHost: boolean;
  isConnected: boolean;
  seatIndex: 0 | 1 | 2 | 3;
}

// ── Phase FSM ───────────────────────────────────────────────────────────────

export type Phase =
  | 'lobby'
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

// ── Deck State ──────────────────────────────────────────────────────────────

export interface DeckState {
  /** Threat deck — ordered array, index 0 is the top card. Draw from front. */
  threatDeck: Card[];
  /** Number card reserve — draw from [0] to add to threat deck bottom */
  reserve: Card[];
  /** Face card reserve — Jacks, Queens, Kings not yet in play */
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
  /** How many reserve cards have been added — Act 3 triggers at 13 */
  cardsAddedFromReserve: number;
}

// ── Turn Order ──────────────────────────────────────────────────────────────

export interface TurnOrder {
  /** Suits of players whose Aces are face-up (available to be AP) */
  available: Suit[];
  /** Suits of players who have already acted this round (Ace face-down) */
  acted: Suit[];
}

// ── Scene State ─────────────────────────────────────────────────────────────

export interface SceneState {
  /** ID of the selected threat card */
  selectedCardId: string | null;
  /** Active joker if a joker is the threat */
  activeJoker: JokerColor | null;
  /** Has the player confirmed their sacrifice? */
  sacrificeConfirmed: boolean;
  /** d10 result (0-9) */
  rollMain: D10Result | null;
  /** d4 result (1-4) */
  rollEffort: D4Result | null;
  /** Genre point reroll used this scene */
  isGenrePointUsed: boolean;
  /** Genre point awarded this scene */
  isGenrePointAwarded: boolean;
  /** Which player is the Active Player (AP) this scene */
  activePlayerId: string | null;
  /** Was "Something's Not Right" already used this scene? */
  escalationUsed: boolean;
  /** Modified d4 after aptitude application */
  modifiedEffort: D4Result | null;
}

// ── Rules Modules ────────────────────────────────────────────────────────────

export interface RulesModules {
  /** Classic Setup: curated deck composition */
  classicSetup: boolean;
  /** Final Girl: increased lethality, solo survivor triggers Act 3 */
  finalGirl: boolean;
}

// ── Full Game State ──────────────────────────────────────────────────────────

export interface GameState {
  phase: Phase;
  currentAct: Act;
  deck: DeckState;
  scene: SceneState;
  characters: Character[];
  players: Player[];
  /** Ace-token turn order system (§8.1.1) */
  turnOrder: TurnOrder;
  weaknessesFound: Suit[];
  /** Table Genre Point pool (starts at 13) */
  tableGenrePoints: number;
  /** Per-player personal Genre Point pools */
  playerGenrePoints: Record<string, number>;
  /** Strikes waiting to be assigned to characters */
  strikesToAssign: number;
  /** True when in The Finale (all 4 weaknesses found) */
  isEndgame: boolean;
  /** True when the endgame setup screen has been shown */
  isEndgameInitialized: boolean;
  /** True when the game has been won */
  isGameWon: boolean;
  /** True when Jokers have been added to the deck */
  jokersAdded: boolean;
  /** True when the Black Joker has been removed from play */
  isBlackJokerRemoved: boolean;
  /** Queue of act setup screens to show (e.g. ["act3", "finale"]) */
  pendingActSetups: string[];
  /** Active playset identifier */
  playset: string;
  rulesModules: RulesModules;
}

// ── Computed State ───────────────────────────────────────────────────────────

export interface ComputedGameState {
  activeCard: Card | null;
  activeJokerCard: JokerCard | null;
  isFaceCard: boolean;
  rollTotal: number | null;
  targetDifficulty: number | null;
  isSuccess: boolean | null;
  effortLevel: EffortLevel | null;
  act3Countdown: number;
  /** True when the top card of the threat deck is an Ace (Prologue phase) */
  isPrologue: boolean;
  /** Number of cards remaining in the threat deck */
  threatDeckSize: number;
  isGameOver: boolean;
  activeSuit: Suit | null;
  activeRank: Rank | null;
  livingCharacters: Character[];
  deadCharacters: Character[];
  hasFaceCardOnTable: boolean;
}

// ── Actions ──────────────────────────────────────────────────────────────────

export type ActionType =
  | 'draw_card'
  | 'select_card'
  | 'roll_dice'
  | 'advance_phase'
  | 'assign_strike'
  | 'award_genre_point'
  | 'use_genre_point'
  | 'apply_aptitude'
  | 'confirm_sacrifice'
  | 'escalate'
  | 'modify_effort';

export interface GameAction {
  type: ActionType;
  playerId: string;
  payload?: unknown;
}

export interface ValidationResult {
  valid: boolean;
  reason?: string;
}
