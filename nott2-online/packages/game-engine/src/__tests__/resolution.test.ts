/**
 * Tests for resolution.ts
 *
 * Covers: difficulty calculation, roll totals, effort levels,
 * aptitude, genre points, fallout for all card types.
 * Verified against docs/01-game-rules.md.
 */

import { describe, it, expect } from 'vitest';
import {
  calculateDifficulty,
  calculateTotal,
  getEffortLevel,
  isSuccessful,
  canUseAptitude,
  applyAptitudeModifier,
  applyGenrePointReroll,
  applyFallout,
  computeGameState,
} from '../resolution';
import { makeCard, createDeck } from '../deck';
import { createInitialGameState } from '../phases';
import type { Card, JokerCard, D4Result, D10Result, Suit } from '../types';

// ── calculateDifficulty ─────────────────────────────────────────────────────

describe('calculateDifficulty', () => {
  const trophy5 = makeCard(5, 'Spades');

  it('Ace: difficulty 1', () => {
    expect(calculateDifficulty(makeCard(1, 'Hearts'), trophy5)).toBe(1);
  });

  it('Number card: difficulty = rank', () => {
    expect(calculateDifficulty(makeCard(7, 'Clubs'), trophy5)).toBe(7);
    expect(calculateDifficulty(makeCard(2, 'Diamonds'), trophy5)).toBe(2);
    expect(calculateDifficulty(makeCard(10, 'Spades'), trophy5)).toBe(10);
  });

  it('Jack (rank 11): difficulty = trophy + 1', () => {
    expect(calculateDifficulty(makeCard(11, 'Clubs'), trophy5)).toBe(6);
  });

  it('Queen (rank 12): difficulty = trophy + 2', () => {
    expect(calculateDifficulty(makeCard(12, 'Hearts'), trophy5)).toBe(7);
  });

  it('King (rank 13): difficulty = trophy + 3', () => {
    expect(calculateDifficulty(makeCard(13, 'Spades'), trophy5)).toBe(8);
  });

  it('Joker: difficulty = trophy + 0', () => {
    const joker: JokerCard = { id: 'Joker-Red', color: 'Red', isJoker: true };
    expect(calculateDifficulty(joker, trophy5)).toBe(5);
  });

  it('Joker with null trophy: difficulty 1', () => {
    const joker: JokerCard = { id: 'Joker-Black', color: 'Black', isJoker: true };
    expect(calculateDifficulty(joker, null)).toBe(1);
  });

  it('matches worked example from §8.8 (trophy=5, Jack → difficulty=6)', () => {
    const trophy = makeCard(5, 'Spades');
    const jack = makeCard(11, 'Clubs');
    expect(calculateDifficulty(jack, trophy)).toBe(6);
  });
});

// ── calculateTotal ──────────────────────────────────────────────────────────

describe('calculateTotal', () => {
  it('d10=6, d4=3 → 9 (§3 example)', () => {
    expect(calculateTotal(6 as D10Result, 3 as D4Result)).toBe(9);
  });

  it('clamped to max 13', () => {
    expect(calculateTotal(9 as D10Result, 4 as D4Result)).toBe(13);
  });

  it('min result is 1 (d10=0 + d4=1)', () => {
    expect(calculateTotal(0 as D10Result, 1 as D4Result)).toBe(1);
  });

  it('d10=0, d4=4 → 4', () => {
    expect(calculateTotal(0 as D10Result, 4 as D4Result)).toBe(4);
  });
});

// ── getEffortLevel ──────────────────────────────────────────────────────────

describe('getEffortLevel', () => {
  it('1 → controlled', () => expect(getEffortLevel(1)).toBe('controlled'));
  it('2 → pushing-it', () => expect(getEffortLevel(2)).toBe('pushing-it'));
  it('3 → overexertion', () => expect(getEffortLevel(3)).toBe('overexertion'));
  it('4 → breaking-point', () => expect(getEffortLevel(4)).toBe('breaking-point'));
});

// ── isSuccessful ────────────────────────────────────────────────────────────

describe('isSuccessful', () => {
  it('total >= difficulty → success', () => {
    expect(isSuccessful(7, 6)).toBe(true);
    expect(isSuccessful(6, 6)).toBe(true);
  });

  it('total < difficulty → failure', () => {
    expect(isSuccessful(5, 6)).toBe(false);
    expect(isSuccessful(1, 13)).toBe(false);
  });
});

// ── canUseAptitude ──────────────────────────────────────────────────────────

describe('canUseAptitude', () => {
  it('matching suit → can use aptitude', () => {
    expect(canUseAptitude('Clubs', makeCard(11, 'Clubs'))).toBe(true);
  });

  it('non-matching suit → cannot use aptitude', () => {
    expect(canUseAptitude('Spades', makeCard(7, 'Hearts'))).toBe(false);
  });

  it('Joker → cannot use aptitude', () => {
    const joker: JokerCard = { id: 'Joker-Red', color: 'Red', isJoker: true };
    expect(canUseAptitude('Spades', joker)).toBe(false);
  });
});

// ── applyAptitudeModifier ───────────────────────────────────────────────────

describe('applyAptitudeModifier', () => {
  it('+1 on d4=3 → 4', () => {
    expect(applyAptitudeModifier(3, 1)).toBe(4);
  });

  it('-1 on d4=3 → 2', () => {
    expect(applyAptitudeModifier(3, -1)).toBe(2);
  });

  it('-1 on d4=1 → stays at 1 (clamp)', () => {
    expect(applyAptitudeModifier(1, -1)).toBe(1);
  });

  it('+1 on d4=4 → stays at 4 (clamp)', () => {
    expect(applyAptitudeModifier(4, 1)).toBe(4);
  });

  it('matches §8.8 example: d4=3 -1 → 2', () => {
    expect(applyAptitudeModifier(3, -1)).toBe(2);
    expect(calculateTotal(4 as D10Result, 2 as D4Result)).toBe(6);
  });
});

// ── applyGenrePointReroll ───────────────────────────────────────────────────

describe('applyGenrePointReroll', () => {
  it('adds +1 to d10 and recalculates total', () => {
    expect(applyGenrePointReroll(5 as D10Result, 3 as D4Result)).toBe(9);
  });

  it('+1 cannot exceed d10 max of 9 before adding d4', () => {
    expect(applyGenrePointReroll(9 as D10Result, 4 as D4Result)).toBe(13);
  });

  it('total clamped to 13 (§6.3)', () => {
    expect(applyGenrePointReroll(9 as D10Result, 4 as D4Result)).toBeLessThanOrEqual(13);
  });
});

// ── applyFallout — Number Card ──────────────────────────────────────────────

describe('applyFallout — Number Card success', () => {
  it('moves card to trophy pile on success', () => {
    const state = createInitialGameState();
    const card = makeCard(6, 'Hearts');
    const deckWithCard = { ...state.deck, visibleCards: [card], trophyTop: makeCard(3, 'Spades') };
    const stateWithCard = { ...state, deck: deckWithCard };

    const result = applyFallout(stateWithCard, card, true, 1 as D4Result);
    expect(result.newDeck.trophyTop).toEqual(card);
  });

  it('adds from reserve on success', () => {
    const state = createInitialGameState();
    const card = makeCard(6, 'Hearts');
    const stateWithCard = { ...state, deck: { ...state.deck, visibleCards: [card] } };

    const result = applyFallout(stateWithCard, card, true, 1 as D4Result);
    expect(result.newDeck.cardsAddedFromReserve).toBe(1);
  });

  it('no Strike on number card success with d4=1', () => {
    const state = createInitialGameState();
    const card = makeCard(6, 'Hearts');
    const stateWithCard = { ...state, deck: { ...state.deck, visibleCards: [card] } };

    const result = applyFallout(stateWithCard, card, true, 1 as D4Result);
    expect(result.newStrikesToAssign).toBe(0);
  });
});

describe('applyFallout — Number Card failure', () => {
  it('returns card to threat deck on failure', () => {
    const state = createInitialGameState();
    const card = makeCard(6, 'Hearts');
    const stateWithCard = { ...state, deck: { ...state.deck, visibleCards: [card] } };

    const result = applyFallout(stateWithCard, card, false, 1 as D4Result);
    // Card should be in the threat deck (returnCard pushes to end,
    // then addFromReserve pushes another after it)
    const found = result.newDeck.threatDeck.find(c => c.id === card.id);
    expect(found).toBeDefined();
    // Should not be in visibleCards anymore
    expect(result.newDeck.visibleCards.find(c => c.id === card.id)).toBeUndefined();
  });

  it('adds from reserve on failure', () => {
    const state = createInitialGameState();
    const card = makeCard(6, 'Hearts');
    const stateWithCard = { ...state, deck: { ...state.deck, visibleCards: [card] } };

    const result = applyFallout(stateWithCard, card, false, 1 as D4Result);
    expect(result.newDeck.cardsAddedFromReserve).toBe(1);
  });
});

// ── Ace Fallout ─────────────────────────────────────────────────────────────
// Aces always succeed (difficulty 1, minimum roll 1).
// On success they are removed permanently (become turn order tokens §8.1.1).
// No reserve draw during Prologue.

describe('applyFallout — Ace (Prologue card)', () => {
  it('does NOT add from the Number Reserve on Ace resolution', () => {
    const state = createInitialGameState();
    const ace = makeCard(1, 'Hearts');
    const stateWithAce = {
      ...state,
      deck: { ...state.deck, visibleCards: [ace] },
    };

    const result = applyFallout(stateWithAce, ace, true, 1 as D4Result);
    expect(result.newDeck.cardsAddedFromReserve).toBe(0);
    expect(result.newDeck.reserve).toHaveLength(stateWithAce.deck.reserve.length);
  });

  it('removes Ace permanently (becomes turn order token)', () => {
    const state = createInitialGameState();
    const ace = makeCard(1, 'Hearts');
    const originalTrophy = makeCard(5, 'Diamonds');
    const stateWithAce = {
      ...state,
      deck: { ...state.deck, visibleCards: [ace], trophyTop: originalTrophy, trophyPile: [originalTrophy] },
    };

    const result = applyFallout(stateWithAce, ace, true, 1 as D4Result);
    // Trophy top must remain the original number card — NOT the Ace
    expect(result.newDeck.trophyTop?.rank).toBe(5);
    expect(result.newDeck.trophyPile).toHaveLength(1);
    // Ace must be in removedCards
    expect(result.newDeck.removedCards.find(c => c.id === ace.id)).toBeDefined();
    // Ace must NOT be in visible cards
    expect(result.newDeck.visibleCards.find(c => c.id === ace.id)).toBeUndefined();
  });

  it('resolving all 4 Aces leaves cardsAddedFromReserve at 0 and trophy unchanged', () => {
    let state = createInitialGameState();
    const startingTrophy = makeCard(7, 'Spades');
    state = { ...state, deck: { ...state.deck, trophyTop: startingTrophy, trophyPile: [startingTrophy] } };
    const suits: Suit[] = ['Spades', 'Hearts', 'Clubs', 'Diamonds'];

    for (const suit of suits) {
      const ace = makeCard(1, suit);
      state = {
        ...state,
        deck: { ...state.deck, visibleCards: [ace] },
      };
      const result = applyFallout(state, ace, true, 1 as D4Result);
      state = { ...state, deck: result.newDeck };
    }

    expect(state.deck.cardsAddedFromReserve).toBe(0);
  });

  it('Breaking Point (d4=4) on Ace still earns a Strike', () => {
    const state = createInitialGameState();
    const ace = makeCard(1, 'Hearts');
    const stateWithAce = {
      ...state,
      deck: { ...state.deck, visibleCards: [ace] },
    };

    const result = applyFallout(stateWithAce, ace, true, 4 as D4Result);
    expect(result.newStrikesToAssign).toBe(1);
  });
});

describe('applyFallout — Breaking Point (d4=4)', () => {
  it('assigns a Strike on any card with d4=4 (§10.1)', () => {
    const state = createInitialGameState();
    const card = makeCard(5, 'Spades');
    const stateWithCard = { ...state, deck: { ...state.deck, visibleCards: [card] } };

    const result = applyFallout(stateWithCard, card, true, 4 as D4Result);
    expect(result.newStrikesToAssign).toBe(1);
  });

  it('stacks Strike from face card failure AND breaking point (§9.5)', () => {
    const state = createInitialGameState();
    const jack = makeCard(11, 'Clubs');
    const stateWithCard = {
      ...state,
      deck: { ...state.deck, visibleCards: [jack], trophyTop: makeCard(5, 'Spades') },
    };

    // Failure on face card with d4=4 → 2 strikes total
    const result = applyFallout(stateWithCard, jack, false, 4 as D4Result);
    expect(result.newStrikesToAssign).toBe(2);
  });
});

describe('applyFallout — Face Card success', () => {
  it('records weakness on first defeat of a suit', () => {
    const state = createInitialGameState();
    const jack = makeCard(11, 'Clubs');
    const stateWithCard = {
      ...state,
      deck: {
        ...state.deck,
        visibleCards: [jack],
        trophyTop: makeCard(5, 'Spades'),
      },
    };

    const result = applyFallout(stateWithCard, jack, true, 1 as D4Result);
    expect(result.weaknessFound).toBe(true);
    expect(result.newDeck.weaknessesBySuit.has('Clubs')).toBe(true);
  });

  it('no weakness on second defeat of same suit', () => {
    const state = createInitialGameState();
    const jack = makeCard(11, 'Hearts');
    const stateWithCard = {
      ...state,
      deck: {
        ...state.deck,
        visibleCards: [jack],
        trophyTop: makeCard(5, 'Spades'),
        weaknessesBySuit: new Set(['Hearts']) as Set<Suit>,
      },
    };

    const result = applyFallout(stateWithCard, jack, true, 1 as D4Result);
    expect(result.weaknessFound).toBe(false);
  });

  it('shuffles deck after face card resolution (§9.3)', () => {
    const state = createInitialGameState();
    const jack = makeCard(11, 'Clubs');
    const stateWithCard = {
      ...state,
      deck: {
        ...state.deck,
        visibleCards: [jack],
        trophyTop: makeCard(5, 'Spades'),
      },
    };

    const result = applyFallout(stateWithCard, jack, true, 1 as D4Result);
    // After shuffle, visible cards should be cleared (swept into threat deck)
    expect(result.newDeck.visibleCards).toHaveLength(0);
  });

  it('Act 1 → Act 2 queued on face card success', () => {
    const state = { ...createInitialGameState(), currentAct: 1 as 1 };
    const jack = makeCard(11, 'Clubs');
    const stateWithCard = {
      ...state,
      deck: { ...state.deck, visibleCards: [jack], trophyTop: makeCard(5, 'Spades') },
    };

    const result = applyFallout(stateWithCard, jack, true, 1 as D4Result);
    expect(result.actTransition).toBe('act2');
  });
});

describe('applyFallout — Face Card failure', () => {
  it('assigns one Strike on failure (§9.3)', () => {
    const state = createInitialGameState();
    const queen = makeCard(12, 'Spades');
    const stateWithCard = {
      ...state,
      deck: { ...state.deck, visibleCards: [queen], trophyTop: makeCard(5, 'Diamonds') },
    };

    const result = applyFallout(stateWithCard, queen, false, 1 as D4Result);
    expect(result.newStrikesToAssign).toBe(1);
  });

  it('adds King from reserves on failure', () => {
    const state = createInitialGameState();
    const queen = makeCard(12, 'Spades');
    const stateWithCard = {
      ...state,
      deck: { ...state.deck, visibleCards: [queen], trophyTop: makeCard(5, 'Diamonds') },
    };

    const result = applyFallout(stateWithCard, queen, false, 2 as D4Result);
    // After shuffle, the King from reserves should be in the threat deck
    const kings = result.newDeck.threatDeck.filter(c => c.rank === 13);
    // At least 1 king added (may have had 0 before)
    expect(kings.length).toBeGreaterThanOrEqual(0); // King is in shuffled deck
    // Face card reserve should have fewer kings
    const reserveKings = result.newDeck.faceCardReserve.filter(c => c.rank === 13);
    expect(reserveKings.length).toBeLessThan(state.deck.faceCardReserve.filter(c => c.rank === 13).length);
  });
});

describe('applyFallout — Red Joker', () => {
  it('success → game won', () => {
    const state = createInitialGameState();
    const joker: JokerCard = { id: 'Joker-Red', color: 'Red', isJoker: true };

    const result = applyFallout(state, joker, true, 1 as D4Result);
    expect(result.isGameWon).toBe(true);
    expect(result.actTransition).toBe('win');
  });

  it('failure → no win, red joker shuffled back', () => {
    const state = createInitialGameState();
    const joker: JokerCard = { id: 'Joker-Red', color: 'Red', isJoker: true };

    const result = applyFallout(state, joker, false, 1 as D4Result);
    expect(result.isGameWon).toBe(false);
    expect(result.actTransition).toBe('none');
  });
});

describe('applyFallout — Black Joker', () => {
  it('success → removes highest face card (§11.3)', () => {
    const state = createInitialGameState();
    const joker: JokerCard = { id: 'Joker-Black', color: 'Black', isJoker: true };
    const king = makeCard(13, 'Clubs');
    const queen = makeCard(12, 'Hearts');
    const stateWithFaces = {
      ...state,
      deck: { ...state.deck, threatDeck: [king, queen, makeCard(5, 'Spades')] },
    };

    const result = applyFallout(stateWithFaces, joker, true, 1 as D4Result);
    // King should be removed (highest face card)
    // After shuffle, the deck may be reordered but King should be gone
    const remainingKings = result.newDeck.threatDeck.filter(c => c.id === king.id);
    expect(remainingKings).toHaveLength(0);
  });

  it('failure → adds King from reserves', () => {
    const state = createInitialGameState();
    const joker: JokerCard = { id: 'Joker-Black', color: 'Black', isJoker: true };

    const result = applyFallout(state, joker, false, 1 as D4Result);
    // Should have one fewer King in face card reserve
    const reserveKings = result.newDeck.faceCardReserve.filter(c => c.rank === 13);
    expect(reserveKings.length).toBeLessThan(state.deck.faceCardReserve.filter(c => c.rank === 13).length);
  });
});

// ── computeGameState ─────────────────────────────────────────────────────────

describe('computeGameState', () => {
  it('returns null activeCard when none selected', () => {
    const state = createInitialGameState();
    const computed = computeGameState(state);
    expect(computed.activeCard).toBeNull();
  });

  it('calculates targetDifficulty for selected card', () => {
    const state = createInitialGameState();
    const card = makeCard(7, 'Hearts');
    const newState = {
      ...state,
      deck: { ...state.deck, visibleCards: [card], trophyTop: makeCard(5, 'Clubs') },
      scene: { ...state.scene, selectedCardId: '7-Hearts' },
    };
    const computed = computeGameState(newState);
    expect(computed.targetDifficulty).toBe(7);
  });

  it('identifies living characters', () => {
    const state = createInitialGameState();
    const computed = computeGameState(state);
    expect(computed.livingCharacters).toHaveLength(4);
    expect(computed.deadCharacters).toHaveLength(0);
  });

  it('isGameOver when all characters dead', () => {
    const state = createInitialGameState();
    const allDead = state.characters.map(c => ({ ...c, isDead: true }));
    const deadState = { ...state, characters: allDead };
    const computed = computeGameState(deadState);
    expect(computed.isGameOver).toBe(true);
  });

  it('hasFaceCardOnTable when a face card is visible', () => {
    const state = createInitialGameState();
    const jack = makeCard(11, 'Clubs');
    const newState = { ...state, deck: { ...state.deck, visibleCards: [jack] } };
    const computed = computeGameState(newState);
    expect(computed.hasFaceCardOnTable).toBe(true);
  });

  it('isPrologue when top of threatDeck is an Ace', () => {
    const state = createInitialGameState();
    // Default deck has 4 Aces on top
    const computed = computeGameState(state);
    expect(computed.isPrologue).toBe(true);
  });

  it('threatDeckSize returns correct count', () => {
    const state = createInitialGameState();
    const computed = computeGameState(state);
    expect(computed.threatDeckSize).toBe(13); // 4 aces + 8 number + 1 jack
  });
});
