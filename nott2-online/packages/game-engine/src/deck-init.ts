/**
 * @nott2/game-engine — Deck Initialisation
 *
 * Constants, card factories, and deck creation logic.
 * Separated from deck.ts (operations/mutations) to keep each module
 * focused on a single responsibility.
 *
 * Source of truth: docs/01-game-rules.md §4
 */

import type {
  Card,
  Suit,
  Rank,
  FaceRank,
  DeckState,
  RulesModules,
} from './types';

// ── Constants ──────────────────────────────────────────────────────────────

export const SUITS: Suit[] = ['Spades', 'Hearts', 'Clubs', 'Diamonds'];
export const NUMBER_RANKS: Rank[] = [2, 3, 4, 5, 6, 7, 8, 9, 10];
export const ALL_RANKS: Rank[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
export const FACE_RANKS: FaceRank[] = [11, 12, 13];
export const ACT3_RESERVE_TRIGGER = 13;

// ── Utilities ──────────────────────────────────────────────────────────────

/**
 * Fisher-Yates shuffle. Returns a new array — does not mutate the input.
 */
export function shuffle<T>(arr: readonly T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// ── Card Factory ────────────────────────────────────────────────────────────

export function makeCard(rank: Rank, suit: Suit): Card {
  return { id: `${rank}-${suit}`, suit, rank };
}

/**
 * Create all number cards (ranks 2-10) for all 4 suits = 36 cards.
 */
export function makeAllNumberCards(): Card[] {
  const cards: Card[] = [];
  for (const rank of NUMBER_RANKS) {
    for (const suit of SUITS) {
      cards.push(makeCard(rank, suit));
    }
  }
  return cards;
}

/**
 * Create all 4 Aces.
 */
export function makeAces(): Card[] {
  return SUITS.map(suit => makeCard(1, suit));
}

/**
 * Create all face cards of a given rank.
 */
export function makeFaceCards(rank: FaceRank): Card[] {
  return SUITS.map(suit => makeCard(rank, suit));
}

// ── Deck Initialization ─────────────────────────────────────────────────────

/**
 * Create the initial DeckState for the start of a game.
 * Both modes build a concrete deck of real Card objects.
 */
export function createDeck(rulesModules: RulesModules): DeckState {
  if (rulesModules.classicSetup) {
    return createClassicDeck();
  }
  return createRandomDeck();
}

/**
 * Random Mode (default) — §4.2–§4.5:
 *
 * 1. Shuffle 36 number cards.
 * 2. Deal 8 → threat deck middle.
 * 3. Deal 1 → trophy pile (the seed card).
 * 4. Remaining 27 → reserve.
 * 5. Pick 1 random Jack → add to middle.
 * 6. Shuffle middle (9 cards: 8 number + 1 Jack).
 * 7. Shuffle 4 Aces, place on top.
 * 8. faceCardReserve = remaining 3 Jacks + 4 Queens + 4 Kings.
 */
function createRandomDeck(): DeckState {
  // Step 1: all number cards, shuffled
  const allNumbers = shuffle(makeAllNumberCards());

  // Step 2: deal 8 for the threat deck middle
  const threatMiddle = allNumbers.slice(0, 8);

  // Step 3: deal 1 for the trophy pile
  const trophyCard = allNumbers[8];

  // Step 4: remaining 27 → reserve
  const reserve = allNumbers.slice(9);

  // Step 5: pick 1 random Jack
  const allJacks = shuffle(makeFaceCards(11));
  const chosenJack = allJacks[0];
  const remainingJacks = allJacks.slice(1); // 3 left

  // Step 6: add Jack to middle, shuffle
  const threatMiddleWithJack = shuffle([...threatMiddle, chosenJack]);

  // Step 7: Aces on top (shuffled order)
  const aces = shuffle(makeAces());
  const threatDeck = [...aces, ...threatMiddleWithJack];

  // Step 8: face card reserve
  const faceCardReserve = [
    ...remainingJacks,
    ...makeFaceCards(12), // 4 Queens
    ...makeFaceCards(13), // 4 Kings
  ];

  return {
    threatDeck,
    reserve,
    faceCardReserve,
    trophyPile: [trophyCard],
    trophyTop: trophyCard,
    visibleCards: [],
    removedCards: [],
    weaknessesBySuit: new Set(),
    cardsAddedFromReserve: 0,
  };
}

/**
 * Classic Setup — §12.1:
 *
 * Threat deck: all 2s, 3s, 4s (12 cards) + 1 random Jack, shuffled, Aces on top.
 * Reserve: all 5s, 6s, 7s, 8s, 9s, 10s — ordered by rank escalation (5,5,5,5,6,6,...).
 * Trophy pile: 1 random 10.
 * Face card reserve: remaining 3 Jacks + 4 Queens + 4 Kings.
 */
function createClassicDeck(): DeckState {
  // Threat deck middle: all 2s, 3s, 4s = 12 cards
  const threatMiddle: Card[] = [];
  for (const rank of [2, 3, 4] as Rank[]) {
    for (const suit of SUITS) {
      threatMiddle.push(makeCard(rank, suit));
    }
  }

  // Pick 1 random Jack
  const allJacks = shuffle(makeFaceCards(11));
  const chosenJack = allJacks[0];
  const remainingJacks = allJacks.slice(1);

  // Shuffle middle with Jack
  const threatMiddleWithJack = shuffle([...threatMiddle, chosenJack]);

  // Aces on top
  const aces = shuffle(makeAces());
  const threatDeck = [...aces, ...threatMiddleWithJack];

  // Reserve: ordered escalation (5s, 6s, 7s, 8s, 9s, 10s) — 4 of each, suits shuffled within rank
  const reserve: Card[] = [];
  for (const rank of [5, 6, 7, 8, 9, 10] as Rank[]) {
    const suitedCards = shuffle(SUITS.map(suit => makeCard(rank, suit)));
    reserve.push(...suitedCards);
  }

  // Trophy: random 10 (pick from the last 4 reserve cards which are 10s, or build fresh)
  const tens = shuffle(SUITS.map(suit => makeCard(10, suit)));
  const trophyCard = tens[0];
  // Remove the trophy 10 from the reserve
  const reserveFiltered = reserve.filter(c => c.id !== trophyCard.id);

  // Face card reserve
  const faceCardReserve = [
    ...remainingJacks,
    ...makeFaceCards(12),
    ...makeFaceCards(13),
  ];

  return {
    threatDeck,
    reserve: reserveFiltered,
    faceCardReserve,
    trophyPile: [trophyCard],
    trophyTop: trophyCard,
    visibleCards: [],
    removedCards: [],
    weaknessesBySuit: new Set(),
    cardsAddedFromReserve: 0,
  };
}
