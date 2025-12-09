/**
 * gameState
 *
 * Philosophical:
 * This module is the "memory" of the game. It holds the absolute truth of the game's current state,
 * independent of any transient UI concerns. It tracks the physical reality of the cards, the
 * metaphysical status of the characters, and the narrative progression of the acts. It is the
 * single source of truth that all other systems rely upon.
 *
 * Technical:
 * Contains the global reactive state (Refs and Computeds) for the game.
 * State is implemented as a singleton to ensure consistency across the application.
 * Major state categories:
 * - Core Data (Visible cards, selection)
 * - Game Stats (Strikes, characters, acts)
 * - Deck State (Middle/Bottom stacks, known/unknown cards)
 * - Resolution State (Dice rolls, outcomes)
 */
import { computed, ref } from 'vue';
import { effortScale } from '../../data/rules';
import type { Card as GameCard, Rank, Suit } from '../useGameEngine';

// --------------------------------------------------------------------------------
// Type Definitions
// --------------------------------------------------------------------------------

export type LivePlayPhase =
  | 'welcome'
  | 'game-setup'
  | 'act-setup'
  | 'trophy-setup'
  | 'scene-setup'
  | 'conversation-stakes'
  | 'resolution'
  | 'resolve-scene'
  | 'fallout'
  | 'win';

export interface Character {
  id: string;
  name: string;
  strikes: number;
  isDead: boolean;
}

export interface LivePlayCard extends GameCard {
  name: string;
  description: string;
  type: 'number' | 'face';
}

// --------------------------------------------------------------------------------
// Shared State (Singleton)
// --------------------------------------------------------------------------------

// Core Data
export const visibleCards = ref<LivePlayCard[]>([]);
export const selectedCardId = ref<string | null>(null);
export const falloutCard = ref<LivePlayCard | null>(null);
export const selectedJoker = ref<'Red' | 'Black' | null>(null);

export const activeCard = computed(() => {
  if (currentPhase.value === 'fallout') return falloutCard.value;
  if (selectedJoker.value) return null;
  if (!selectedCardId.value) return null;
  return visibleCards.value.find((c) => c.id === selectedCardId.value) || null;
});

export const isFaceCard = computed(() => {
  return activeCard.value?.type === 'face' || (activeCard.value?.rank || 0) > 10;
});

// Game Stats
export const strikes = ref(0);
export const characters = ref<Character[]>([
  { id: 'Spades', name: 'The Power', strikes: 0, isDead: false },
  { id: 'Hearts', name: 'The Resolve', strikes: 0, isDead: false },
  { id: 'Clubs', name: 'The Intellect', strikes: 0, isDead: false },
  { id: 'Diamonds', name: 'The Finesse', strikes: 0, isDead: false },
]);
export const strikesToAssign = ref(0);
export const weaknessesFound = ref<Suit[]>([]);
export const isEndgame = ref(false);
export const tableGenrePoints = ref(13);
export const playerGenrePoints = ref(0);
export const currentAct = ref(1);
export const selectedPlayset = ref<string | null>(null);
export const currentPhase = ref<LivePlayPhase>('welcome');

// Manual Input
export const manualSuit = ref<Suit>('Spades');
export const manualRank = ref<Rank>(1);
export const manualJoker = ref<'Red' | 'Black' | null>(null);
export const manualOverride = ref(false);
export const debugMode = ref(false);

// Act 3
export const act3Countdown = computed(() => {
  if (currentAct.value >= 3) return null;
  return 13 - cardsAddedFromReserve.value;
});

// Deck State
export const acesRemaining = ref(4);
export const middleStack = ref<Record<number, number>>({
  1: 0,
  2: 4,
  3: 4,
  4: 4,
  5: 0,
  6: 0,
  7: 0,
  8: 0,
  9: 0,
  10: 0,
  11: 1,
  12: 0,
  13: 0,
});
export const bottomStack = ref<Record<number, number>>({
  1: 0,
  2: 0,
  3: 0,
  4: 0,
  5: 0,
  6: 0,
  7: 0,
  8: 0,
  9: 0,
  10: 0,
  11: 0,
  12: 0,
  13: 0,
});
export const reserveQueue = ref<number[]>([
  5, 5, 5, 5, 6, 6, 6, 6, 7, 7, 7, 7, 8, 8, 8, 8, 9, 9, 9, 9, 10, 10, 10,
]);
export const drawnCards = ref<Set<string>>(new Set());
export const trophyPile = ref<LivePlayCard[]>([]);
export const trophyTop = ref<LivePlayCard | null>(null);
export const isTrophyTopRandomized = ref(true);

export const faceCardReserves = ref({
  11: 3,
  12: 4,
  13: 4,
});
export const lastAddedFaceCardRank = ref<number | null>(null);
export const removedFaceCards = ref<Record<number, number>>({
  11: 0,
  12: 0,
  13: 0,
});

export const unknownThreatCards = ref<Record<number, number>>({ 0: 0, 11: 0, 12: 0, 13: 0 });
export const unknownBottomStack = ref<Record<number, number>>({ 0: 0, 11: 0, 12: 0, 13: 0 });
export const unknownReserveCards = ref(0);

// Known cards at bottom of deck (by card ID like "10-Hearts") - can't be drawn until shuffle
// Known cards at bottom of deck (by card ID like "10-Hearts") - can't be drawn until shuffle
export const knownBottomStackCards = ref<Set<string>>(new Set());

// Persistent set of all cards that have been revealed/identified in this game.
// Used to track which specific suits are "in play" vs which are generic "Unknowns".
export const identifiedCards = ref<Set<string>>(new Set());

// Permanently removed face cards by their full ID (e.g., "11-Clubs")
// These cards have been removed via weakness discovery or Black Joker success
export const removedFaceCardIds = ref<Set<string>>(new Set());

// Resolution State
// selectedJoker is defined above due to hoisting needs for activeCard
export const sacrificeConfirmed = ref(false);
export const rollMain = ref<number | null>(null);
export const rollEffort = ref<number | null>(null);

export const isGenrePointUsed = ref(false);
export const isGenrePointAwarded = ref(false);

export const isEndgameInitialized = ref(false);
export const isGameWon = ref(false);
export const isBlackJokerRemoved = ref(false);
export const jokersAdded = ref(false);
export const cardsAddedFromReserve = ref(0);

// Queue for pending act setup screens (e.g., 'act3', 'jokers')
// Used when multiple triggers happen simultaneously
export const pendingActSetups = ref<string[]>([]);

// Computed
export const areJokersAvailable = computed(() => {
  return jokersAdded.value;
});

export const isGameOver = computed(() => {
  return characters.value.every((c) => c.isDead) || isGameWon.value;
});

export const isMiddleStackEmpty = computed(() => {
  return (
    Object.values(middleStack.value).every((count) => count === 0) &&
    Object.values(unknownThreatCards.value).every((count) => count === 0)
  );
});

export const rollTotal = computed(() => {
  if (rollMain.value === null) return null;
  return (rollMain.value || 0) + (rollEffort.value || 0);
});

export const effortResult = computed(() => {
  if (!rollEffort.value) return null;
  // Safety check for index
  const index = (rollEffort.value - 1) as 0 | 1 | 2 | 3;
  if (index < 0 || index >= effortScale.length) return null;
  return effortScale[index];
});

// Helper for Difficulty
const getDifficulty = () => {
  // Jokers use the trophy top value as their difficulty (base only, no modifier)
  if (selectedJoker.value) {
    return !trophyTop.value || (trophyTop.value.rank as number) === 0 ? 0 : trophyTop.value.rank;
  }

  const rank = activeCard.value?.rank;
  if (!rank) return 0;

  // Number Cards (1-10) use their own rank as difficulty
  if (rank <= 10) return rank;

  // Face Cards (11+) use the Trophy Pile + Modifier
  const base =
    !trophyTop.value || (trophyTop.value.rank as number) === 0 ? 0 : trophyTop.value.rank;
  let modifier = 0;
  if (rank === 11) modifier = 1;
  if (rank === 12) modifier = 2;
  if (rank === 13) modifier = 3;

  return base + modifier;
};

export const targetDifficulty = computed(() => {
  return getDifficulty();
});

export const isSuccess = computed(() => {
  // Both Jokers require a roll against Trophy Top difficulty (per NotT_2.md rules)
  if (!rollTotal.value) return false;

  const target = targetDifficulty.value;
  return rollTotal.value >= target;
});
