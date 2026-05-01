/**
 * @nott2/game-engine — Resolution Logic
 *
 * d13 rolls, difficulty calculation, effort scale, aptitude modifiers,
 * genre point rerolls, and the complete fallout system.
 *
 * Source of truth: docs/01-game-rules.md §6, §9, §10, §11
 */

import type {
  Card,
  JokerCard,
  DeckState,
  GameState,
  EffortLevel,
  D4Result,
  D10Result,
  Suit,
} from './types';
import { isJoker, isFaceCard, isAce } from './types';
import {
  addToTrophyPile,
  returnCard,
  shuffleThreatDeck,
  shuffleTrophyPile,
  removeCardPermanently,
  addFromReserve,
  addFaceCardFromReserve,
  removeHighestFaceCard,
  recordWeakness,
} from './deck';

// ── Difficulty Calculation ──────────────────────────────────────────────────

/**
 * Calculate the difficulty for a given threat card.
 * §9.1
 */
export function calculateDifficulty(
  card: Card | JokerCard,
  trophyTop: Card | null,
): number {
  const trophyRank = trophyTop?.rank ?? 1;

  if (isJoker(card)) {
    // Joker: difficulty = Trophy Top + 0 (§11.1 — but shuffle happens first)
    return trophyRank;
  }

  const { rank } = card as Card;

  if (rank === 1) return 1;           // Ace: rank = 1 (difficulty = 1)
  if (rank <= 10) return rank;        // Number card: rank = difficulty
  if (rank === 11) return trophyRank + 1; // Jack: Trophy + 1
  if (rank === 12) return trophyRank + 2; // Queen: Trophy + 2
  if (rank === 13) return trophyRank + 3; // King: Trophy + 3

  return trophyRank;
}

// ── Roll Calculation ────────────────────────────────────────────────────────

/**
 * Calculate the d13 total. Clamped to [1, 13]. §3
 */
export function calculateTotal(d10: D10Result, d4: D4Result): number {
  return Math.min(13, Math.max(1, d10 + d4));
}

/**
 * Determine the Effort Level from the d4 result. §8.6
 */
export function getEffortLevel(d4: D4Result): EffortLevel {
  switch (d4) {
    case 1: return 'controlled';
    case 2: return 'pushing-it';
    case 3: return 'overexertion';
    case 4: return 'breaking-point';
  }
}

/**
 * Check whether a roll is successful. §8.5
 */
export function isSuccessful(total: number, difficulty: number): boolean {
  return total >= difficulty;
}

// ── Aptitude ────────────────────────────────────────────────────────────────

/**
 * Can the character use their Aptitude for this card? §8.7
 */
export function canUseAptitude(characterSuit: Suit, card: Card | JokerCard): boolean {
  if (isJoker(card)) return false;
  return (card as Card).suit === characterSuit;
}

/**
 * Apply an aptitude modification to the d4 effort die. §8.7
 * Returns the new d4 value (clamped to [1,4]).
 */
export function applyAptitudeModifier(d4: D4Result, modifier: 1 | -1): D4Result {
  const newD4 = d4 + modifier;
  return Math.min(4, Math.max(1, newD4)) as D4Result;
}

/**
 * Apply a Genre Point reroll. §6.2
 * +1 to the new d10, clamp total to 13.
 */
export function applyGenrePointReroll(newD10: D10Result, d4: D4Result): number {
  const modifiedD10 = Math.min(9, newD10 + 1) as D10Result;
  return calculateTotal(modifiedD10, d4);
}

// ── Fallout Handler ─────────────────────────────────────────────────────────

export interface FalloutResult {
  newDeck: DeckState;
  newStrikesToAssign: number;
  weaknessFound: boolean;
  actTransition: 'none' | 'act2' | 'act3' | 'finale' | 'win' | 'lose';
  isGameWon: boolean;
  pendingActSetups: string[];
}

/**
 * Master fallout dispatcher. Routes to the correct handler based on card type.
 * §9
 */
export function applyFallout(
  state: GameState,
  card: Card | JokerCard,
  isSuccess: boolean,
  d4: D4Result,
): FalloutResult {
  if (isJoker(card)) {
    return handleJokerFallout(state, card as JokerCard, isSuccess);
  }

  const c = card as Card;
  if (isAce(c)) {
    // Aces always succeed (§8.1). Failure path removed.
    return handleAceFallout(state, c, d4);
  }
  if (isFaceCard(c)) {
    return handleFaceCardFallout(state, c, isSuccess, d4);
  }
  return handleNumberCardFallout(state, c, isSuccess, d4);
}

// ── Number Card Fallout ─────────────────────────────────────────────────────

/**
 * §9.2 — Number card resolution.
 */
function handleNumberCardFallout(
  state: GameState,
  card: Card,
  isSuccess: boolean,
  d4: D4Result,
): FalloutResult {
  let newDeck = state.deck;
  let strikesToAssign = state.strikesToAssign;

  if (isSuccess) {
    // Move to Trophy Pile
    newDeck = addToTrophyPile(newDeck, card);
  } else {
    // Return to bottom of Threat Deck
    newDeck = returnCard(newDeck, card);
  }

  // Add next card from Number Reserve (§9.2)
  [newDeck] = addFromReserve(newDeck);

  // Breaking Point always earns a Strike, even on number cards (§10.1)
  if (d4 === 4) {
    strikesToAssign += 1;
  }

  // Check Act 3 trigger
  const pending = [...state.pendingActSetups];
  let actTransition: FalloutResult['actTransition'] = 'none';

  if (state.currentAct === 2 && newDeck.cardsAddedFromReserve >= 13) {
    if (!state.isEndgame) {
      pending.push('act3');
      actTransition = 'act3';
    }
    // If all 4 weaknesses were already found, the Finale fires here too
    // (countdown and weaknesses met simultaneously or weaknesses came first).
    const finaleAlreadyQueued = pending.includes('finale') || state.pendingActSetups.includes('finale');
    if (newDeck.weaknessesBySuit.size >= 4 && !state.isEndgame && !finaleAlreadyQueued) {
      pending.push('finale');
      actTransition = 'finale';
    }
  }

  return {
    newDeck,
    newStrikesToAssign: strikesToAssign,
    weaknessFound: false,
    actTransition,
    isGameWon: false,
    pendingActSetups: pending,
  };
}

// ── Face Card Fallout ───────────────────────────────────────────────────────

/**
 * §9.3 — Face card resolution.
 */
function handleFaceCardFallout(
  state: GameState,
  card: Card,
  isSuccess: boolean,
  d4: D4Result,
): FalloutResult {
  let newDeck = state.deck;
  let strikesToAssign = state.strikesToAssign;
  let weaknessFound = false;
  const pending = [...state.pendingActSetups];
  let actTransition: FalloutResult['actTransition'] = 'none';

  if (isSuccess) {
    // 1. Weakness check
    const alreadyDefeated = newDeck.weaknessesBySuit.has(card.suit);

    if (!alreadyDefeated) {
      // First defeat of this suit → weakness found, remove card permanently
      weaknessFound = true;
      newDeck = removeCardPermanently(newDeck, card);
      newDeck = recordWeakness(newDeck, card.suit);
    } else {
      // Card goes back into threat deck (shuffled back in §9.3)
      newDeck = returnCard(newDeck, card);
    }

    // 2. Reinforcement: add face card from reserves based on effort
    const targetRank = (d4 <= 2) ? 11 : 12; // 1-2 → Jack, 3-4 → Queen
    [newDeck] = addFaceCardFromReserve(newDeck, targetRank);

    // Breaking Point strike (§10.1)
    if (d4 === 4) {
      strikesToAssign += 1;
    }

    // Act 1 → Act 2 transition on first face card resolution
    if (state.currentAct === 1) {
      pending.push('act2');
      actTransition = 'act2';
    }
  } else {
    // Failure
    // 1. Strike to active player
    strikesToAssign += 1;

    // 2. Breaking Point: additional strike
    if (d4 === 4) {
      strikesToAssign += 1;
    }

    // 3. Add King from reserves (§9.3 failure)
    [newDeck] = addFaceCardFromReserve(newDeck, 13);

    // 4. Card stays in Threat Deck (return to bottom, will be shuffled back in)
    newDeck = returnCard(newDeck, card);

    // Act 1 → Act 2 transition on face card failure (§9.3)
    if (state.currentAct === 1) {
      pending.push('act2');
      actTransition = 'act2';
    }
  }

  // ── Post-outcome: clock tick + Finale check ─────────────────────────────
  // Runs regardless of success/failure.
  //
  // In Act 3 there are no number cards left, so addFromReserve is never called.
  // Each face card scene (win or lose) counts as one tick toward the 13-clock,
  // allowing the countdown to complete and the Finale to eventually fire.
  if (state.currentAct === 3) {
    newDeck = { ...newDeck, cardsAddedFromReserve: newDeck.cardsAddedFromReserve + 1 };
  }

  // Finale fires when all 4 weaknesses are found.
  // If we're not yet in Act 3, queue Act 3 first (strips number cards from
  // the threat deck and visible zone), then the Finale immediately after.
  const totalWeaknesses = newDeck.weaknessesBySuit.size;
  const finaleAlreadyQueued = pending.includes('finale') || state.pendingActSetups.includes('finale');
  if (totalWeaknesses >= 4 && !state.isEndgame && !finaleAlreadyQueued) {
    if (state.currentAct !== 3) {
      // Not yet in Act 3 — queue Act 3 transition first
      if (!pending.includes('act3')) {
        pending.push('act3');
      }
      actTransition = 'act3';
    }
    // Queue the Finale right after Act 3 (or immediately if already in Act 3)
    pending.push('finale');
    if (state.currentAct === 3) {
      actTransition = 'finale';
    }
  }

  // Shuffle Threat Deck and Trophy Pile after any face card (§9.3)
  newDeck = shuffleThreatDeck(newDeck);
  newDeck = shuffleTrophyPile(newDeck);

  return {
    newDeck,
    newStrikesToAssign: strikesToAssign,
    weaknessFound,
    actTransition,
    isGameWon: false,
    pendingActSetups: pending,
  };
}

// ── Ace Fallout ─────────────────────────────────────────────────────────────

/**
 * Aces are Prologue "establishing shot" cards (§8.1):
 *
 *   - Aces always succeed (difficulty 1, minimum roll 1).
 *   - On success, the Ace is permanently removed from the game.
 *     It becomes the player's turn-order token (§8.1.1).
 *   - There is no failure case for Aces.
 *   - No reserve draw during the Prologue.
 *   - Breaking Point (d4=4) still earns a Strike per §10.1.
 */
export function handleAceFallout(
  state: GameState,
  card: Card,
  d4: D4Result,
): FalloutResult {
  // Always success — permanently retire the Ace (becomes turn-order token)
  const newDeck = removeCardPermanently(state.deck, card);
  let strikesToAssign = state.strikesToAssign;

  // Breaking Point still earns a Strike (§10.1 — any card type).
  if (d4 === 4) {
    strikesToAssign += 1;
  }

  return {
    newDeck,
    newStrikesToAssign: strikesToAssign,
    weaknessFound: false,
    actTransition: 'none',
    isGameWon: false,
    pendingActSetups: [...state.pendingActSetups],
  };
}

// ── Joker Fallout ───────────────────────────────────────────────────────────

/**
 * §11.2/11.3 — Joker resolution.
 */
function handleJokerFallout(
  state: GameState,
  joker: JokerCard,
  isSuccess: boolean,
): FalloutResult {
  let newDeck = state.deck;
  let isGameWon = false;
  let actTransition: FalloutResult['actTransition'] = 'none';
  const pending = [...state.pendingActSetups];

  if (joker.color === 'Red') {
    // §11.2 Red Joker
    if (isSuccess) {
      // Win condition
      isGameWon = true;
      actTransition = 'win';
    } else {
      // Active player is killed (handled by caller via strikesToAssign)
      // Red Joker shuffled back into Threat Deck
      newDeck = shuffleThreatDeck(newDeck);
      // Party wipe check happens in phase logic
    }
  } else {
    // §11.3 Black Joker
    if (isSuccess) {
      // Remove highest face card from Threat Deck
      newDeck = removeHighestFaceCard(newDeck);
    } else {
      // Add King from reserves
      [newDeck] = addFaceCardFromReserve(newDeck, 13);
    }
    // Black Joker permanently removed after resolution
    newDeck = shuffleThreatDeck(newDeck);
    newDeck = shuffleTrophyPile(newDeck);
  }

  return {
    newDeck,
    newStrikesToAssign: state.strikesToAssign,
    weaknessFound: false,
    actTransition,
    isGameWon,
    pendingActSetups: pending,
  };
}


