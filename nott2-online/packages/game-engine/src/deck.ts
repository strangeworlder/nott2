/**
 * @nott2/game-engine — Deck Logic
 *
 * All deck manipulation functions. Pure functions — no mutation of input state.
 * Returns new state objects.
 *
 * The deck is modelled as concrete Card[] arrays — a true digital deck.
 * Cards have a defined order; you draw from the top (index 0) and add
 * to the bottom (push). Shuffling randomises the array order.
 *
 * Source of truth: docs/01-game-rules.md §4, §9
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
function makeAllNumberCards(): Card[] {
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
function makeAces(): Card[] {
  return SUITS.map(suit => makeCard(1, suit));
}

/**
 * Create all face cards of a given rank.
 */
function makeFaceCards(rank: FaceRank): Card[] {
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

// ── Queries ─────────────────────────────────────────────────────────────────

/**
 * Is the game still in the Prologue? (Aces on top of the threat deck)
 */
export function isPrologue(deck: DeckState): boolean {
  return (deck.threatDeck[0]?.rank ?? 0) === 1;
}

/**
 * Peek at the top card of the threat deck without removing it.
 */
export function peekTop(deck: DeckState): Card | null {
  return deck.threatDeck[0] ?? null;
}

/**
 * Get the total number of cards in the threat deck.
 */
export function getThreatDeckSize(deck: DeckState): number {
  return deck.threatDeck.length;
}

// ── Deck Mutations (return new state) ──────────────────────────────────────

/**
 * Draw the top card from the threat deck and add to visibleCards.
 * Returns [newDeck, drawnCard] or [deck, null] if empty.
 */
export function drawCard(deck: DeckState): [DeckState, Card | null] {
  if (deck.threatDeck.length === 0) return [deck, null];

  const [card, ...remaining] = deck.threatDeck;
  return [
    {
      ...deck,
      threatDeck: remaining,
      visibleCards: [...deck.visibleCards, card],
    },
    card,
  ];
}

/**
 * Return a card to the bottom of the threat deck (failure outcome).
 */
export function returnCard(deck: DeckState, card: Card): DeckState {
  const newVisible = deck.visibleCards.filter(c => c.id !== card.id);
  return {
    ...deck,
    threatDeck: [...deck.threatDeck, card],
    visibleCards: newVisible,
  };
}

/**
 * Add a card to the trophy pile (success outcome for number cards).
 */
export function addToTrophyPile(deck: DeckState, card: Card): DeckState {
  const newPile = [...deck.trophyPile, card];
  const newVisible = deck.visibleCards.filter(c => c.id !== card.id);
  return {
    ...deck,
    trophyPile: newPile,
    trophyTop: card,
    visibleCards: newVisible,
  };
}

/**
 * Shuffle the threat deck. Also sweeps any visible cards back in first.
 * §9.3: "shuffle the entire Threat Deck"
 */
export function shuffleThreatDeck(deck: DeckState): DeckState {
  const combined = [...deck.threatDeck, ...deck.visibleCards];
  return {
    ...deck,
    threatDeck: shuffle(combined),
    visibleCards: [],
  };
}

/**
 * Shuffle the trophy pile — pick a random card as the new top.
 * §9.3: "shuffle the Trophy Pile. Reveal the new top card."
 */
export function shuffleTrophyPile(deck: DeckState): DeckState {
  if (deck.trophyPile.length === 0) return deck;

  const shuffled = shuffle(deck.trophyPile);
  const newTop = shuffled[shuffled.length - 1];
  return {
    ...deck,
    trophyPile: shuffled,
    trophyTop: newTop,
  };
}

/**
 * Set the trophy top to a specific card (for manual override or multiplayer sync).
 */
export function setTrophyTop(deck: DeckState, card: Card): DeckState {
  return {
    ...deck,
    trophyTop: card,
  };
}

/**
 * Remove a card permanently from the game (weakness victory, Ace tokens, etc.).
 */
export function removeCardPermanently(deck: DeckState, card: Card): DeckState {
  const newVisible = deck.visibleCards.filter(c => c.id !== card.id);
  return {
    ...deck,
    removedCards: [...deck.removedCards, card],
    visibleCards: newVisible,
  };
}

/**
 * Add a card from the Number Reserve to the bottom of the Threat Deck.
 * Returns [newDeck, wasCardAdded].
 * §9.2: "Add the next card from the Number Reserve"
 */
export function addFromReserve(deck: DeckState): [DeckState, boolean] {
  const newCount = deck.cardsAddedFromReserve + 1;

  if (deck.reserve.length === 0) {
    // No cards left, but counter still increments for Act 3 trigger
    return [{ ...deck, cardsAddedFromReserve: newCount }, false];
  }

  const [card, ...remaining] = deck.reserve;
  return [
    {
      ...deck,
      threatDeck: [...deck.threatDeck, card],
      reserve: remaining,
      cardsAddedFromReserve: newCount,
    },
    true,
  ];
}

/**
 * Add a face card from reserves to the bottom of the Threat Deck.
 * Follows the fallback chain per §9.3:
 *   Jack requested → Jack → Queen → King
 *   Queen requested → Queen → King → Jack
 *   King requested → King → Queen → Jack
 *
 * Returns [newDeck, addedCard | null].
 */
export function addFaceCardFromReserve(
  deck: DeckState,
  target: FaceRank,
): [DeckState, Card | null] {
  let fallbackOrder: FaceRank[];
  if (target === 11) {
    fallbackOrder = [11, 12, 13];
  } else if (target === 12) {
    fallbackOrder = [12, 13, 11];
  } else {
    fallbackOrder = [13, 12, 11];
  }

  for (const rank of fallbackOrder) {
    const idx = deck.faceCardReserve.findIndex(c => c.rank === rank);
    if (idx >= 0) {
      const card = deck.faceCardReserve[idx];
      const newReserve = [
        ...deck.faceCardReserve.slice(0, idx),
        ...deck.faceCardReserve.slice(idx + 1),
      ];
      return [
        {
          ...deck,
          faceCardReserve: newReserve,
          threatDeck: [...deck.threatDeck, card],
        },
        card,
      ];
    }
  }

  // No face cards available at all
  return [deck, null];
}

/**
 * Remove the highest-ranked face card from the Threat Deck (Black Joker success).
 * Priority: King > Queen > Jack. §11.3
 */
export function removeHighestFaceCard(deck: DeckState): DeckState {
  for (const rank of [13, 12, 11] as FaceRank[]) {
    const idx = deck.threatDeck.findIndex(c => c.rank === rank);
    if (idx >= 0) {
      const newThreat = [
        ...deck.threatDeck.slice(0, idx),
        ...deck.threatDeck.slice(idx + 1),
      ];
      return { ...deck, threatDeck: newThreat };
    }
  }
  // No face card in deck — do nothing (§11.4)
  return deck;
}

/**
 * Record that a weakness has been found for a suit.
 */
export function recordWeakness(deck: DeckState, suit: Suit): DeckState {
  const newWeaknesses = new Set(deck.weaknessesBySuit);
  newWeaknesses.add(suit);
  return { ...deck, weaknessesBySuit: newWeaknesses };
}

/**
 * Remove a specific card from the visible (table) cards.
 */
export function removeFromVisible(deck: DeckState, cardId: string): DeckState {
  return { ...deck, visibleCards: deck.visibleCards.filter(c => c.id !== cardId) };
}

/**
 * Remove number cards from the threat deck (Act 3 setup: §7.3).
 * All number cards (ranks 1-10) are filtered out. Only face cards remain.
 */
export function removeNumberCardsForAct3(deck: DeckState): DeckState {
  return {
    ...deck,
    threatDeck: deck.threatDeck.filter(c => c.rank >= 11),
  };
}

/**
 * Add both Jokers to the threat deck and shuffle (Finale setup: §7.4).
 * Jokers are represented as Cards with special rank values (14=Red, 15=Black)
 * since the engine's JokerCard type is handled separately in resolution logic.
 */
export function addJokersToDeck(deck: DeckState): DeckState {
  // Note: Jokers are tracked as JokerCards in the game state,
  // but we add placeholder entries here for deck ordering.
  // The actual Joker identification happens when drawn.
  const combined = [
    ...deck.threatDeck,
    { id: 'Joker-Red', suit: 'Spades' as Suit, rank: 14 as Rank },
    { id: 'Joker-Black', suit: 'Spades' as Suit, rank: 15 as Rank },
  ];
  return { ...deck, threatDeck: shuffle(combined) };
}
