/**
 * @nott2/game-engine — Phase FSM
 *
 * State machine for the game phase loop.
 * All phase transitions, act management, and pending setup queue.
 *
 * Source of truth: docs/01-game-rules.md §7, §8
 */

import type { GameState, Phase, Act, Character, Suit } from './types';
import {
  createDeck,
  addJokersToDeck,
  removeNumberCardsForAct3,
  shuffleThreatDeck,
} from './deck';

// ── Initial State Factory ───────────────────────────────────────────────────

const DEFAULT_CHARACTERS: Character[] = [
  { id: 'Spades', name: 'The Power', aptitude: 'Spades', strikes: 0, isDead: false },
  { id: 'Hearts', name: 'The Resolve', aptitude: 'Hearts', strikes: 0, isDead: false },
  { id: 'Clubs', name: 'The Intellect', aptitude: 'Clubs', strikes: 0, isDead: false },
  { id: 'Diamonds', name: 'The Finesse', aptitude: 'Diamonds', strikes: 0, isDead: false },
];

export function createInitialGameState(playset = 'default'): GameState {
  return {
    phase: 'lobby',
    currentAct: 1,
    deck: createDeck({ classicSetup: false, finalGirl: false }),
    scene: {
      selectedCardId: null,
      activeJoker: null,
      sacrificeConfirmed: false,
      rollMain: null,
      rollEffort: null,
      isGenrePointUsed: false,
      isGenrePointAwarded: false,
      activePlayerId: null,
      escalationUsed: false,
      modifiedEffort: null,
    },
    characters: [...DEFAULT_CHARACTERS],
    players: [],
    turnOrder: { available: [], acted: [] }, // Initialized properly after Prologue
    weaknessesFound: [],
    tableGenrePoints: 13,
    playerGenrePoints: {},
    strikesToAssign: 0,
    isEndgame: false,
    isEndgameInitialized: false,
    isGameWon: false,
    jokersAdded: false,
    isBlackJokerRemoved: false,
    pendingActSetups: [],
    playset,
    rulesModules: { classicSetup: false, finalGirl: false },
  };
}

// ── Phase Ordering ──────────────────────────────────────────────────────────

const MAIN_LOOP: Phase[] = [
  'scene-setup',
  'conversation-stakes',
  'resolution',
  'resolve-scene',
  'fallout',
];

/**
 * Advance to the next phase in the standard loop.
 * Handles inter-loop transitions (fallout → scene-setup vs act-setup etc.)
 */
export function nextPhase(state: GameState): GameState {
  const { phase } = state;

  // Terminal states
  if (phase === 'win' || phase === 'lose') return state;

  // Lobby → Welcome
  if (phase === 'lobby') return { ...state, phase: 'welcome' };

  // Welcome → Game Setup
  if (phase === 'welcome') return { ...state, phase: 'game-setup' };

  // Game Setup → Act Setup
  if (phase === 'game-setup') return { ...state, phase: 'act-setup' };

  // Act Setup → (Trophy Setup if classic) or Scene Setup
  if (phase === 'act-setup') {
    if (state.rulesModules.classicSetup) {
      return { ...state, phase: 'trophy-setup' };
    }
    return { ...state, phase: 'scene-setup', scene: resetScene(state.scene) };
  }

  // Trophy Setup → Scene Setup
  if (phase === 'trophy-setup') {
    return { ...state, phase: 'scene-setup', scene: resetScene(state.scene) };
  }

  // Scene Setup → Conversation/Stakes
  if (phase === 'scene-setup') return { ...state, phase: 'conversation-stakes' };

  // Conversation/Stakes → Resolution
  if (phase === 'conversation-stakes') return { ...state, phase: 'resolution' };

  // Resolution → Resolve Scene
  if (phase === 'resolution') return { ...state, phase: 'resolve-scene' };

  // Resolve Scene → Fallout
  if (phase === 'resolve-scene') return { ...state, phase: 'fallout' };

  // Fallout → determine next
  if (phase === 'fallout') {
    return evaluateFalloutTransition(state);
  }

  return state;
}

/**
 * Go back one phase (limited: only resolve-scene ↔ resolution).
 */
export function prevPhase(state: GameState): GameState {
  if (state.phase === 'resolve-scene') return { ...state, phase: 'resolution' };
  if (state.phase === 'resolution') return { ...state, phase: 'conversation-stakes' };
  return state;
}

function evaluateFalloutTransition(state: GameState): GameState {
  // Consume any pending act setups first
  if (state.pendingActSetups.length > 0) {
    const [next, ...remaining] = state.pendingActSetups;
    return {
      ...state,
      phase: 'act-setup',
      pendingActSetups: remaining,
    };
  }

  // Check for win/lose
  if (state.isGameWon) return { ...state, phase: 'win' };
  const living = state.characters.filter(c => !c.isDead);
  if (living.length === 0) return { ...state, phase: 'lose' };

  // Next scene
  return startNextScene(state);
}

// ── Act Transitions ─────────────────────────────────────────────────────────

/**
 * Initialize the game decks after act-setup completes.
 */
export function startGame(state: GameState): GameState {
  const newDeck = createDeck(state.rulesModules);
  return { ...state, deck: newDeck, phase: 'scene-setup' };
}

/**
 * Transition to Act 2. Any remaining aces are discarded.
 * Called when the first Face Card is resolved.
 */
export function startAct2(state: GameState): GameState {
  // Transition to Act 2. Any remaining Aces in the deck are naturally
  // handled — they'll be drawn and resolved (always succeed) in sequence.
  // With the card array model, no special cleanup needed.
  return {
    ...state,
    currentAct: 2,
  };
}

/**
 * Act 3 setup: remove all number cards from the Threat Deck. §7.3
 */
export function startAct3(state: GameState): GameState {
  const newDeck = removeNumberCardsForAct3(state.deck);
  return {
    ...state,
    currentAct: 3,
    deck: newDeck,
  };
}

/**
 * The Finale: add both Jokers to the Threat Deck. §7.4
 */
export function startEndgame(state: GameState): GameState {
  let newDeck = state.deck;
  if (!state.jokersAdded) {
    newDeck = addJokersToDeck(newDeck);
    newDeck = shuffleThreatDeck(newDeck);
  }
  return {
    ...state,
    isEndgame: true,
    isEndgameInitialized: true,
    jokersAdded: true,
    deck: newDeck,
  };
}

/**
 * Reset scene state for the next scene.
 */
function resetScene(scene: GameState['scene']): GameState['scene'] {
  return {
    ...scene,
    selectedCardId: null,
    activeJoker: null,
    sacrificeConfirmed: false,
    rollMain: null,
    rollEffort: null,
    modifiedEffort: null,
    isGenrePointUsed: false,
    isGenrePointAwarded: false,
    escalationUsed: false,
    activePlayerId: null,
  };
}

/**
 * Start the next scene. Resets scene state.
 */
export function startNextScene(state: GameState): GameState {
  return {
    ...state,
    phase: 'scene-setup',
    scene: resetScene(state.scene),
    strikesToAssign: 0,
  };
}

/**
 * Apply pending act setups from the queue.
 */
export function consumePendingActSetup(state: GameState): GameState {
  if (state.pendingActSetups.length === 0) return state;
  const [, ...remaining] = state.pendingActSetups;
  return { ...state, pendingActSetups: remaining };
}

// ── Character Management ─────────────────────────────────────────────────────

/**
 * Assign a strike to a character. If they reach 3 strikes, they die.
 * Returns new characters array.
 */
export function assignStrike(state: GameState, characterId: Suit): GameState {
  const characters = state.characters.map(c => {
    if (c.id !== characterId) return c;
    const newStrikes = Math.min(3, c.strikes + 1) as 0 | 1 | 2 | 3;
    return {
      ...c,
      strikes: newStrikes,
      isDead: newStrikes >= 3,
    };
  });

  const living = characters.filter(c => !c.isDead);
  const newStrikesToAssign = Math.max(0, state.strikesToAssign - 1);

  let newState = { ...state, characters, strikesToAssign: newStrikesToAssign };

  // Final Girl: if one character left, trigger Act 3 immediately (§12.2)
  if (state.rulesModules.finalGirl && living.length === 1 && state.currentAct < 3) {
    newState = {
      ...newState,
      pendingActSetups: [...newState.pendingActSetups, 'act3', 'finale'],
    };
  }

  // TPK check
  if (living.length === 0) {
    newState = { ...newState, phase: 'lose' };
  }

  return newState;
}

// ── Genre Points ─────────────────────────────────────────────────────────────

/**
 * Award a genre point from the table pool to a player. §6.1
 */
export function awardGenrePoint(state: GameState, playerId: string): GameState {
  if (state.tableGenrePoints <= 0) return state;
  const current = state.playerGenrePoints[playerId] ?? 0;
  return {
    ...state,
    tableGenrePoints: state.tableGenrePoints - 1,
    playerGenrePoints: { ...state.playerGenrePoints, [playerId]: current + 1 },
    scene: { ...state.scene, isGenrePointAwarded: true },
  };
}

/**
 * Spend a genre point (reroll). Genre point is removed from game. §6.2
 */
export function spendGenrePoint(state: GameState, playerId: string): GameState {
  const current = state.playerGenrePoints[playerId] ?? 0;
  if (current <= 0) return state;
  return {
    ...state,
    playerGenrePoints: { ...state.playerGenrePoints, [playerId]: current - 1 },
    scene: { ...state.scene, isGenrePointUsed: true },
  };
}
