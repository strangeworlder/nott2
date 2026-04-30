/**
 * @nott2/game-engine — Public API
 *
 * Night of the Thirteenth v2.0 game engine.
 * Zero React dependencies. Pure TypeScript.
 */

// Types
export type {
  Suit,
  Rank,
  FaceRank,
  JokerColor,
  Act,
  StrikeCount,
  EffortLevel,
  D4Result,
  D10Result,
  Card,
  JokerCard,
  GameCard,
  Character,
  Player,
  Phase,
  DeckState,
  TurnOrder,
  SceneState,
  RulesModules,
  GameState,
  ComputedGameState,
  ActionType,
  GameAction,
  ValidationResult,
} from './types';

export { isJoker, isFaceCard, isAce, isNumberCard } from './types';

// Deck Logic
export {
  SUITS,
  NUMBER_RANKS,
  ALL_RANKS,
  FACE_RANKS,
  ACT3_RESERVE_TRIGGER,
  shuffle,
  makeCard,
  createDeck,
  drawCard,
  returnCard,
  addToTrophyPile,
  shuffleThreatDeck,
  shuffleTrophyPile,
  setTrophyTop,
  removeCardPermanently,
  addFromReserve,
  addFaceCardFromReserve,
  removeHighestFaceCard,
  recordWeakness,
  removeFromVisible,
  removeNumberCardsForAct3,
  addJokersToDeck,
  isPrologue,
  peekTop,
  getThreatDeckSize,
} from './deck';

// Resolution
export type { FalloutResult } from './resolution';
export {
  calculateDifficulty,
  calculateTotal,
  getEffortLevel,
  isSuccessful,
  canUseAptitude,
  applyAptitudeModifier,
  applyGenrePointReroll,
  applyFallout,
  handleAceFallout,
} from './resolution';

// Computed State
export { computeGameState } from './computed';

// Phase FSM
export {
  createInitialGameState,
  nextPhase,
  prevPhase,
  startGame,
  startAct2,
  startAct3,
  startEndgame,
  startNextScene,
  consumePendingActSetup,
} from './phases';

// Character & Genre Point Management
export {
  assignStrike,
  awardGenrePoint,
  spendGenrePoint,
} from './characters';

// Turn Order
export {
  initTurnOrder,
  markActed,
  resetRound,
  removeFromTurnOrder,
  isRoundComplete,
  getAvailablePlayers,
  autoSelectPrologueAP,
} from './turn-order';

// Validation
export { validateAction } from './validation';

// Scene Prompts
export type { FaceCardPrompt, CardPrompt, SuitPrompts, JokerPrompts, PromptData } from './scene-prompts';
export {
  getScenePrompt,
  getJokerPrompt,
  getFaceCardPrefix,
  getSuitTheme,
  getDefaultPrompts,
} from './scene-prompts';

export const GAME_ENGINE_VERSION = '0.0.0';
