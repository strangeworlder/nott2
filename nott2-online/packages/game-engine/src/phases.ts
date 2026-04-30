/**
 * @nott2/game-engine — Phase FSM
 *
 * State machine for the game phase loop.
 * All phase transitions, act management, and pending setup queue.
 *
 * Source of truth: docs/01-game-rules.md §7, §8
 */

import type { GameState, Phase, Act, Character } from './types';
import { removeFromTurnOrder } from './turn-order';
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

  // Act Setup → next pending setup (if any), else Trophy Setup or Scene Setup
  if (phase === 'act-setup') {
    // Chain directly through multiple pending act setups (e.g. act3 → finale)
    // without requiring a scene in between.
    if (state.pendingActSetups.length > 0) {
      return evaluateFalloutTransition(state);
    }
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
  // Consume any pending act setups, applying the correct state mutation on pop.
  if (state.pendingActSetups.length > 0) {
    const [next, ...remaining] = state.pendingActSetups;
    let newState: GameState = { ...state, pendingActSetups: remaining };

    // Apply the state mutation for the act being set up, so the act-setup
    // screen always sees the correct currentAct / isEndgame values.
    if (next === 'act2')   newState = startAct2(newState);
    else if (next === 'act3')   newState = startAct3(newState);
    else if (next === 'finale') newState = startEndgame(newState);

    return { ...newState, phase: 'act-setup' };
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
  // Transition to Act 2. Reset the turn order — the act-setup screen bypasses
  // startNextScene so the round counter would otherwise carry over stale.
  const living = state.characters.filter(c => !c.isDead);
  return {
    ...state,
    currentAct: 2,
    turnOrder: { available: living.map(c => c.id), acted: [] },
  };
}

/**
 * Act 3 setup: remove all number cards from the Threat Deck. §7.3
 */
export function startAct3(state: GameState): GameState {
  // Sweep any visible (already-drawn) cards back into the threat deck first,
  // then purge all number cards. This ensures no number card survives on the
  // table when Act 3 begins (§7.3).
  const deckWithVisibleReturned = {
    ...state.deck,
    threatDeck: [...state.deck.threatDeck, ...state.deck.visibleCards],
    visibleCards: [],
  };
  const newDeck = removeNumberCardsForAct3(deckWithVisibleReturned);

  // Reset turn order — act-setup bypasses startNextScene so the round counter
  // would otherwise carry over stale entries from the previous round.
  const living = state.characters.filter(c => !c.isDead);
  return {
    ...state,
    currentAct: 3,
    deck: newDeck,
    turnOrder: { available: living.map(c => c.id), acted: [] },
  };
}

/**
 * The Finale: add both Jokers to the Threat Deck. §7.4
 */
export function startEndgame(state: GameState): GameState {
  // Add Jokers to the threat deck and shuffle (§7.4). They are drawn normally
  // in Act 3 just like face cards. Guard prevents double-adding.
  let newDeck = state.deck;
  if (!state.jokersAdded) {
    newDeck = addJokersToDeck(newDeck);
    newDeck = shuffleThreatDeck(newDeck);
  }

  // Reset turn order — act-setup bypasses startNextScene so the round counter
  // would otherwise carry over stale entries.
  const living = state.characters.filter(c => !c.isDead);
  return {
    ...state,
    isEndgame: true,
    isEndgameInitialized: true,
    jokersAdded: true,
    deck: newDeck,
    turnOrder: { available: living.map(c => c.id), acted: [] },
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
 * If the round is complete (all living players have acted), reset the turn order.
 *
 * Redundancy: also checks that at least one living character is available.
 * If not (e.g. a character died while in `available` and stale entries remain),
 * the round is force-reset so the game can continue.
 */
export function startNextScene(state: GameState): GameState {
  const living = state.characters.filter(c => !c.isDead);
  const livingSuits = new Set(living.map(c => c.id));

  // Primary check: standard round completion
  const roundDone = state.turnOrder.available.length === 0 && state.turnOrder.acted.length > 0;

  // Redundancy check: are there any living characters still available to act?
  // If not, force a round reset even if turnOrder.available has stale (dead) entries.
  const livingAvailable = state.turnOrder.available.filter(s => livingSuits.has(s));
  const needsForceReset = !roundDone && livingAvailable.length === 0 && living.length > 0;

  const shouldReset = roundDone || needsForceReset;

  return {
    ...state,
    phase: 'scene-setup',
    scene: resetScene(state.scene),
    strikesToAssign: 0,
    turnOrder: shouldReset
      ? { available: living.map(c => c.id), acted: [] }
      : state.turnOrder,
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



