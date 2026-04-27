/**
 * @nott2/game-engine — Deck Logic Tests
 *
 * Tests for the card-array based deck model.
 */

import { describe, it, expect } from 'vitest';
import {
  createDeck,
  drawCard,
  returnCard,
  addToTrophyPile,
  shuffleThreatDeck,
  shuffleTrophyPile,
  addFromReserve,
  addFaceCardFromReserve,
  removeHighestFaceCard,
  removeCardPermanently,
  removeNumberCardsForAct3,
  addJokersToDeck,
  isPrologue,
  peekTop,
  shuffle,
  makeCard,
  SUITS,
} from '../deck';
import type { DeckState, Card, Suit } from '../types';

// ── Helper ──────────────────────────────────────────────────────────────────

function makeDeck(overrides: Partial<DeckState> = {}): DeckState {
  return {
    threatDeck: [],
    reserve: [],
    faceCardReserve: [],
    trophyPile: [],
    trophyTop: null,
    visibleCards: [],
    removedCards: [],
    weaknessesBySuit: new Set(),
    cardsAddedFromReserve: 0,
    ...overrides,
  };
}

// ── createDeck ──────────────────────────────────────────────────────────────

describe('createDeck', () => {
  describe('Random mode', () => {
    const deck = createDeck({ classicSetup: false, finalGirl: false });

    it('creates a threat deck with 13 cards (4 aces + 8 number + 1 jack)', () => {
      expect(deck.threatDeck).toHaveLength(13);
    });

    it('has 4 Aces on top', () => {
      const topFour = deck.threatDeck.slice(0, 4);
      expect(topFour.every(c => c.rank === 1)).toBe(true);
      // All 4 suits represented
      const suits = new Set(topFour.map(c => c.suit));
      expect(suits.size).toBe(4);
    });

    it('has exactly 1 Jack in the hidden middle', () => {
      const middle = deck.threatDeck.slice(4);
      const jacks = middle.filter(c => c.rank === 11);
      expect(jacks).toHaveLength(1);
    });

    it('has 8 number cards in the hidden middle', () => {
      const middle = deck.threatDeck.slice(4);
      const numbers = middle.filter(c => c.rank >= 2 && c.rank <= 10);
      expect(numbers).toHaveLength(8);
    });

    it('has 27 cards in the reserve', () => {
      expect(deck.reserve).toHaveLength(27);
    });

    it('has 1 card in the trophy pile', () => {
      expect(deck.trophyPile).toHaveLength(1);
      expect(deck.trophyTop).toEqual(deck.trophyPile[0]);
    });

    it('has 11 face cards in reserve (3J + 4Q + 4K)', () => {
      expect(deck.faceCardReserve).toHaveLength(11);
      const jacks = deck.faceCardReserve.filter(c => c.rank === 11);
      const queens = deck.faceCardReserve.filter(c => c.rank === 12);
      const kings = deck.faceCardReserve.filter(c => c.rank === 13);
      expect(jacks).toHaveLength(3);
      expect(queens).toHaveLength(4);
      expect(kings).toHaveLength(4);
    });

    it('starts with empty visible, removed cards, and 0 reserve counter', () => {
      expect(deck.visibleCards).toHaveLength(0);
      expect(deck.removedCards).toHaveLength(0);
      expect(deck.cardsAddedFromReserve).toBe(0);
    });

    it('total card count is correct (no cards lost)', () => {
      const total =
        deck.threatDeck.length +
        deck.reserve.length +
        deck.faceCardReserve.length +
        deck.trophyPile.length;
      // 13 (threat) + 27 (reserve) + 11 (face reserve) + 1 (trophy) = 52
      // Note: we start with 36 number + 4 aces + 12 face = 52, minus jokers
      expect(total).toBe(52);
    });

    it('has no duplicate card IDs', () => {
      const allCards = [
        ...deck.threatDeck,
        ...deck.reserve,
        ...deck.faceCardReserve,
        ...deck.trophyPile,
      ];
      const ids = allCards.map(c => c.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });
  });

  describe('Classic mode', () => {
    const deck = createDeck({ classicSetup: true, finalGirl: false });

    it('threat deck has 4 aces + 13 middle cards = 17', () => {
      expect(deck.threatDeck).toHaveLength(17);
    });

    it('has 4 Aces on top', () => {
      const topFour = deck.threatDeck.slice(0, 4);
      expect(topFour.every(c => c.rank === 1)).toBe(true);
    });

    it('middle has all 2s, 3s, 4s (12 cards) + 1 Jack', () => {
      const middle = deck.threatDeck.slice(4);
      const twos = middle.filter(c => c.rank === 2);
      const threes = middle.filter(c => c.rank === 3);
      const fours = middle.filter(c => c.rank === 4);
      const jacks = middle.filter(c => c.rank === 11);
      expect(twos).toHaveLength(4);
      expect(threes).toHaveLength(4);
      expect(fours).toHaveLength(4);
      expect(jacks).toHaveLength(1);
    });

    it('reserve has 5s through 10s minus the trophy card', () => {
      // 6 ranks × 4 suits = 24, minus 1 (trophy) = 23
      expect(deck.reserve).toHaveLength(23);
    });

    it('trophy card is a 10', () => {
      expect(deck.trophyTop?.rank).toBe(10);
    });
  });
});

// ── drawCard ────────────────────────────────────────────────────────────────

describe('drawCard', () => {
  it('draws the top card and adds to visibleCards', () => {
    const card1 = makeCard(5, 'Hearts');
    const card2 = makeCard(7, 'Spades');
    const deck = makeDeck({ threatDeck: [card1, card2] });

    const [newDeck, drawn] = drawCard(deck);
    expect(drawn).toEqual(card1);
    expect(newDeck.threatDeck).toEqual([card2]);
    expect(newDeck.visibleCards).toEqual([card1]);
  });

  it('returns null on empty deck', () => {
    const deck = makeDeck({ threatDeck: [] });
    const [newDeck, drawn] = drawCard(deck);
    expect(drawn).toBeNull();
    expect(newDeck).toBe(deck); // unchanged
  });
});

// ── returnCard ──────────────────────────────────────────────────────────────

describe('returnCard', () => {
  it('moves card from visibleCards to bottom of threatDeck', () => {
    const card = makeCard(3, 'Clubs');
    const existing = makeCard(8, 'Diamonds');
    const deck = makeDeck({
      threatDeck: [existing],
      visibleCards: [card],
    });

    const newDeck = returnCard(deck, card);
    expect(newDeck.visibleCards).toHaveLength(0);
    expect(newDeck.threatDeck).toEqual([existing, card]);
  });
});

// ── addToTrophyPile ─────────────────────────────────────────────────────────

describe('addToTrophyPile', () => {
  it('moves card to trophy pile and updates trophyTop', () => {
    const card = makeCard(6, 'Hearts');
    const oldTrophy = makeCard(2, 'Spades');
    const deck = makeDeck({
      trophyPile: [oldTrophy],
      trophyTop: oldTrophy,
      visibleCards: [card],
    });

    const newDeck = addToTrophyPile(deck, card);
    expect(newDeck.trophyPile).toEqual([oldTrophy, card]);
    expect(newDeck.trophyTop).toEqual(card);
    expect(newDeck.visibleCards).toHaveLength(0);
  });
});

// ── shuffleThreatDeck ───────────────────────────────────────────────────────

describe('shuffleThreatDeck', () => {
  it('sweeps visibleCards back into threatDeck and clears them', () => {
    const c1 = makeCard(2, 'Spades');
    const c2 = makeCard(3, 'Hearts');
    const v1 = makeCard(5, 'Clubs');
    const deck = makeDeck({
      threatDeck: [c1, c2],
      visibleCards: [v1],
    });

    const newDeck = shuffleThreatDeck(deck);
    expect(newDeck.visibleCards).toHaveLength(0);
    expect(newDeck.threatDeck).toHaveLength(3);
    // All 3 cards should be present
    const ids = new Set(newDeck.threatDeck.map(c => c.id));
    expect(ids.has(c1.id)).toBe(true);
    expect(ids.has(c2.id)).toBe(true);
    expect(ids.has(v1.id)).toBe(true);
  });
});

// ── shuffleTrophyPile ───────────────────────────────────────────────────────

describe('shuffleTrophyPile', () => {
  it('picks a new top card from the trophy pile', () => {
    const cards = [makeCard(2, 'Spades'), makeCard(5, 'Hearts'), makeCard(8, 'Clubs')];
    const deck = makeDeck({ trophyPile: cards, trophyTop: cards[2] });

    const newDeck = shuffleTrophyPile(deck);
    expect(newDeck.trophyPile).toHaveLength(3);
    // trophyTop should be the last element of the shuffled array
    expect(newDeck.trophyTop).toEqual(newDeck.trophyPile[newDeck.trophyPile.length - 1]);
  });

  it('returns unchanged deck if trophy pile is empty', () => {
    const deck = makeDeck({ trophyPile: [], trophyTop: null });
    const newDeck = shuffleTrophyPile(deck);
    expect(newDeck).toBe(deck);
  });
});

// ── removeCardPermanently ───────────────────────────────────────────────────

describe('removeCardPermanently', () => {
  it('moves card from visible to removedCards', () => {
    const card = makeCard(1, 'Spades');
    const deck = makeDeck({ visibleCards: [card] });

    const newDeck = removeCardPermanently(deck, card);
    expect(newDeck.visibleCards).toHaveLength(0);
    expect(newDeck.removedCards).toEqual([card]);
  });
});

// ── addFromReserve ──────────────────────────────────────────────────────────

describe('addFromReserve', () => {
  it('moves top reserve card to bottom of threatDeck', () => {
    const reserveCard = makeCard(7, 'Diamonds');
    const deckCard = makeCard(3, 'Spades');
    const deck = makeDeck({
      threatDeck: [deckCard],
      reserve: [reserveCard],
    });

    const [newDeck, added] = addFromReserve(deck);
    expect(added).toBe(true);
    expect(newDeck.threatDeck).toEqual([deckCard, reserveCard]);
    expect(newDeck.reserve).toHaveLength(0);
    expect(newDeck.cardsAddedFromReserve).toBe(1);
  });

  it('increments counter even when reserve is empty', () => {
    const deck = makeDeck({ reserve: [] });
    const [newDeck, added] = addFromReserve(deck);
    expect(added).toBe(false);
    expect(newDeck.cardsAddedFromReserve).toBe(1);
  });
});

// ── addFaceCardFromReserve ──────────────────────────────────────────────────

describe('addFaceCardFromReserve', () => {
  it('adds target face card to bottom of threatDeck', () => {
    const jack = makeCard(11, 'Hearts');
    const deck = makeDeck({ faceCardReserve: [jack] });

    const [newDeck, added] = addFaceCardFromReserve(deck, 11);
    expect(added).toEqual(jack);
    expect(newDeck.threatDeck).toEqual([jack]);
    expect(newDeck.faceCardReserve).toHaveLength(0);
  });

  it('uses fallback chain when target not available', () => {
    const queen = makeCard(12, 'Spades');
    const deck = makeDeck({ faceCardReserve: [queen] });

    // Requesting Jack (11), but only Queen (12) available
    const [newDeck, added] = addFaceCardFromReserve(deck, 11);
    expect(added).toEqual(queen);
    expect(newDeck.threatDeck).toEqual([queen]);
  });

  it('returns null when no face cards at all', () => {
    const deck = makeDeck({ faceCardReserve: [] });
    const [newDeck, added] = addFaceCardFromReserve(deck, 11);
    expect(added).toBeNull();
    expect(newDeck).toBe(deck);
  });
});

// ── removeHighestFaceCard ───────────────────────────────────────────────────

describe('removeHighestFaceCard', () => {
  it('removes King before Queen before Jack', () => {
    const jack = makeCard(11, 'Hearts');
    const queen = makeCard(12, 'Spades');
    const king = makeCard(13, 'Clubs');
    const deck = makeDeck({ threatDeck: [jack, queen, king] });

    const newDeck = removeHighestFaceCard(deck);
    expect(newDeck.threatDeck).toHaveLength(2);
    expect(newDeck.threatDeck.map(c => c.rank)).toEqual([11, 12]);
  });

  it('returns unchanged if no face cards', () => {
    const deck = makeDeck({ threatDeck: [makeCard(5, 'Hearts')] });
    const newDeck = removeHighestFaceCard(deck);
    expect(newDeck).toBe(deck);
  });
});

// ── removeNumberCardsForAct3 ────────────────────────────────────────────────

describe('removeNumberCardsForAct3', () => {
  it('keeps only face cards in the threat deck', () => {
    const cards = [
      makeCard(2, 'Spades'),
      makeCard(11, 'Hearts'),
      makeCard(8, 'Clubs'),
      makeCard(13, 'Diamonds'),
    ];
    const deck = makeDeck({ threatDeck: cards });

    const newDeck = removeNumberCardsForAct3(deck);
    expect(newDeck.threatDeck).toHaveLength(2);
    expect(newDeck.threatDeck.every(c => c.rank >= 11)).toBe(true);
  });
});

// ── addJokersToDeck ─────────────────────────────────────────────────────────

describe('addJokersToDeck', () => {
  it('adds 2 jokers and shuffles', () => {
    const deck = makeDeck({ threatDeck: [makeCard(11, 'Spades')] });
    const newDeck = addJokersToDeck(deck);
    expect(newDeck.threatDeck).toHaveLength(3);
    const ids = new Set(newDeck.threatDeck.map(c => c.id));
    expect(ids.has('Joker-Red')).toBe(true);
    expect(ids.has('Joker-Black')).toBe(true);
  });
});

// ── isPrologue ──────────────────────────────────────────────────────────────

describe('isPrologue', () => {
  it('returns true when top card is an Ace', () => {
    const deck = makeDeck({ threatDeck: [makeCard(1, 'Spades'), makeCard(5, 'Hearts')] });
    expect(isPrologue(deck)).toBe(true);
  });

  it('returns false when top card is not an Ace', () => {
    const deck = makeDeck({ threatDeck: [makeCard(5, 'Hearts')] });
    expect(isPrologue(deck)).toBe(false);
  });

  it('returns false when deck is empty', () => {
    const deck = makeDeck({ threatDeck: [] });
    expect(isPrologue(deck)).toBe(false);
  });
});

// ── peekTop ─────────────────────────────────────────────────────────────────

describe('peekTop', () => {
  it('returns top card without removing', () => {
    const card = makeCard(3, 'Diamonds');
    const deck = makeDeck({ threatDeck: [card] });
    expect(peekTop(deck)).toEqual(card);
    expect(deck.threatDeck).toHaveLength(1); // unchanged
  });

  it('returns null for empty deck', () => {
    const deck = makeDeck({ threatDeck: [] });
    expect(peekTop(deck)).toBeNull();
  });
});

// ── shuffle utility ─────────────────────────────────────────────────────────

describe('shuffle', () => {
  it('returns a new array with the same elements', () => {
    const input = [1, 2, 3, 4, 5];
    const result = shuffle(input);
    expect(result).toHaveLength(5);
    expect(result.sort()).toEqual(input.sort());
  });

  it('does not mutate the input', () => {
    const input = [1, 2, 3];
    const copy = [...input];
    shuffle(input);
    expect(input).toEqual(copy);
  });
});
