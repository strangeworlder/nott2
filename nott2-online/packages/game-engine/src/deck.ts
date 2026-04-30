/**
 * @nott2/game-engine — Deck Operations
 *
 * All deck manipulation functions. Pure functions — no mutation of input state.
 * Returns new state objects.
 *
 * Deck initialisation (constants, card factories, createDeck) lives in
 * deck-init.ts. This module re-exports everything from there for backward
 * compatibility.
 *
 * Source of truth: docs/01-game-rules.md §4, §9
 */

import type {
  Card,
  Suit,
  Rank,
  FaceRank,
  DeckState,
} from './types';

// Re-export everything from deck-init for backward compatibility.
// Consumers can import from either 'deck' or 'deck-init'.
export {
  SUITS,
  NUMBER_RANKS,
  ALL_RANKS,
  FACE_RANKS,
  ACT3_RESERVE_TRIGGER,
  shuffle,
  makeCard,
  makeAllNumberCards,
  makeAces,
  makeFaceCards,
  createDeck,
} from './deck-init';

import { shuffle } from './deck-init';

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
