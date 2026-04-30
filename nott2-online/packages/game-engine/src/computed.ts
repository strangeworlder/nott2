/**
 * @nott2/game-engine — Computed State
 *
 * Derives read-only computed properties from raw GameState.
 * Pure function — no side effects.
 *
 * Extracted from resolution.ts to keep resolution focused on
 * roll calculation, difficulty, and fallout mechanics.
 */

import type {
  GameState,
} from './types';
import { isFaceCard } from './types';
import {
  calculateDifficulty,
  calculateTotal,
  getEffortLevel,
  isSuccessful,
} from './resolution';
import { isPrologue } from './deck';

/**
 * Derive computed game state from raw GameState.
 * Pure function — no side effects.
 */
export function computeGameState(state: GameState) {
  const { scene, deck, characters } = state;

  // Find the active card
  const activeCard = scene.selectedCardId
    ? (deck.visibleCards.find(c => c.id === scene.selectedCardId) ?? null)
    : null;

  const activeJokerCard = scene.activeJoker
    ? { id: `Joker-${scene.activeJoker}`, color: scene.activeJoker, isJoker: true as const }
    : null;

  const threatCard = activeJokerCard ?? activeCard;

  // Difficulty
  const targetDifficulty = threatCard
    ? calculateDifficulty(
        threatCard,
        deck.trophyTop,
      )
    : null;

  // Roll total
  const actualD4 = scene.modifiedEffort ?? scene.rollEffort;
  const rollTotal =
    scene.rollMain !== null && actualD4 !== null
      ? calculateTotal(scene.rollMain, actualD4)
      : null;

  // Success
  const isSuccessResult =
    rollTotal !== null && targetDifficulty !== null
      ? isSuccessful(rollTotal, targetDifficulty)
      : null;

  // Effort level
  const effortLevel = actualD4 !== null ? getEffortLevel(actualD4) : null;

  // Act 3 countdown (how many reserve cards until Act 3 at 13)
  const act3Countdown = Math.max(0, 13 - deck.cardsAddedFromReserve);

  // Prologue check — is the top card an Ace?
  const isPrologueActive = isPrologue(deck);

  // Threat deck size
  const threatDeckSize = deck.threatDeck.length;

  // Living/dead characters
  const livingCharacters = characters.filter(c => !c.isDead);
  const deadCharacters = characters.filter(c => c.isDead);
  const isGameOver = livingCharacters.length === 0;

  // Has a face card on the visible table?
  const hasFaceCardOnTable = deck.visibleCards.some(c => isFaceCard(c));

  // Active suit/rank
  const activeSuit = activeCard ? activeCard.suit : (activeJokerCard ? null : null);
  const activeRank = activeCard ? activeCard.rank : null;

  // Face card check
  const activeIsFaceCard = activeCard ? isFaceCard(activeCard) : false;

  return {
    activeCard,
    activeJokerCard,
    isFaceCard: activeIsFaceCard,
    rollTotal,
    targetDifficulty,
    isSuccess: isSuccessResult,
    effortLevel,
    act3Countdown,
    isPrologue: isPrologueActive,
    threatDeckSize,
    isGameOver,
    activeSuit,
    activeRank,
    livingCharacters,
    deadCharacters,
    hasFaceCardOnTable,
  };
}
