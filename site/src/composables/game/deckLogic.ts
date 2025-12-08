import { getPlaysetConfig } from '../../utils/contentLoader';
import type { Rank, Suit } from '../useGameEngine';
import {
  acesRemaining,
  bottomStack,
  cardsAddedFromReserve,
  currentAct,
  drawnCards,
  faceCardReserves,
  isTrophyTopRandomized,
  knownBottomStackCards,
  type LivePlayCard,
  lastAddedFaceCardRank,
  manualJoker,
  manualRank,
  manualSuit,
  middleStack,
  removedFaceCards,
  reserveQueue,
  selectedCardId,
  selectedJoker,
  selectedPlayset,
  strikesToAssign,
  trophyPile,
  trophyTop,
  unknownBottomStack,
  unknownReserveCards,
  unknownThreatCards,
  visibleCards,
} from './gameState';

// uuid removed

// Helper to check for Classic setup
const isClassicMode = () => {
  const config = getPlaysetConfig(selectedPlayset.value);
  return config.rulesModules?.classicSetup;
};

// --------------------------------------------------------------------------------
// Helpers
// --------------------------------------------------------------------------------

export const getRankName = (rank: number) => {
  if (rank === 1) return 'Ace';
  if (rank === 11) return 'Jack';
  if (rank === 12) return 'Queen';
  if (rank === 13) return 'King';
  return rank.toString();
};

// --------------------------------------------------------------------------------
// Deck Query Methods
// --------------------------------------------------------------------------------

export const isRankAvailable = (rank: Rank) => {
  if (acesRemaining.value > 0) {
    return rank === 1;
  }

  // If Aces are exhausted, Rank 1 is no longer available
  if (rank === 1) return false;

  // Generic Suit Availability Check:
  // If all 4 suits for this rank are already drawn, this rank is exhausted.
  const suits: Suit[] = ['Spades', 'Hearts', 'Clubs', 'Diamonds'];
  const availableSuits = suits.filter((s) => !drawnCards.value.has(`${rank}-${s}`));
  if (availableSuits.length === 0) return false;

  // Standard Check (Classic)
  if (middleStack.value[rank] > 0 || bottomStack.value[rank] > 0) return true;

  // Randomized Setup Check:
  if (unknownThreatCards.value > 0 || unknownBottomStack.value > 0) {
    // Restriction 1: Face Cards in Act 1 (Only Jack allowed)
    if (!isClassicMode() && currentAct.value === 1) {
      if (rank === 12 || rank === 13) return false;

      // Restriction 2: Forced Jack Check (Last unknown card)
      const totalUnknown = unknownThreatCards.value + unknownBottomStack.value;
      if (totalUnknown === 1) {
        const hasSeenJack = Array.from(drawnCards.value).some((id) => id.startsWith('11-'));
        if (!hasSeenJack) {
          return rank === 11;
        }
      }
    }
    return true;
  }

  return false;
};

export const isSuitAvailable = (rank: Rank, suit: Suit) => {
  const cardId = `${rank}-${suit}`;
  if (drawnCards.value.has(cardId)) return false;
  if (knownBottomStackCards.value.has(cardId)) return false;
  return true;
};

export const getNextValidCard = (): { rank: Rank; suit: Suit } => {
  // 1. Check Aces
  if (acesRemaining.value > 0) {
    const suits: Suit[] = ['Spades', 'Hearts', 'Clubs', 'Diamonds'];
    const availableSuit = suits.find((s) => !drawnCards.value.has(`1-${s}`));
    if (availableSuit) return { rank: 1, suit: availableSuit };
  }

  // 2. Check Middle Stack (Active Deck)
  const ranks = Object.keys(middleStack.value)
    .map(Number)
    .sort((a, b) => a - b);

  for (const rank of ranks) {
    if (middleStack.value[rank] > 0) {
      const suits: Suit[] = ['Spades', 'Hearts', 'Clubs', 'Diamonds'];
      const availableSuit = suits.find((s) => !drawnCards.value.has(`${rank}-${s}`));
      if (availableSuit) return { rank: rank as Rank, suit: availableSuit };
    }
  }

  // 3. Check Unknown Cards (Random Mode)
  if (unknownThreatCards.value > 0) {
    // Forced Jack Check
    if (!isClassicMode() && currentAct.value === 1 && unknownThreatCards.value === 1) {
      const hasSeenJack = Array.from(drawnCards.value).some((id) => id.startsWith('11-'));
      if (!hasSeenJack) {
        return { rank: 11, suit: 'Spades' };
      }
    }
    return { rank: 0 as unknown as Rank, suit: 'Unknown' };
  }

  // Fallback
  return { rank: 1, suit: 'Spades' };
};

// --------------------------------------------------------------------------------
// Deck Actions
// --------------------------------------------------------------------------------

export const updateDeckState = (rank: Rank, suit: Suit, action: 'draw' | 'add' | 'return') => {
  const cardId = `${rank}-${suit}`;

  if (action === 'draw') {
    drawnCards.value.add(cardId);

    if (rank === 1) {
      acesRemaining.value--;
    } else if (suit === 'Unknown') {
      if (unknownThreatCards.value > 0) {
        unknownThreatCards.value--;
      } else if (unknownBottomStack.value > 0) {
        unknownBottomStack.value--;
      }
    } else {
      if (middleStack.value[rank] > 0) {
        middleStack.value[rank]--;
      } else if (bottomStack.value[rank] > 0) {
        bottomStack.value[rank]--;
      }
    }
  } else if (action === 'add') {
    bottomStack.value[rank]++;
  } else if (action === 'return') {
    drawnCards.value.delete(cardId);

    if (rank === 1) {
      bottomStack.value[rank]++;
      knownBottomStackCards.value.add(cardId);
    } else if (suit === 'Unknown') {
      unknownBottomStack.value++;
      // Unknown cards are not tracked by specific ID
    } else {
      bottomStack.value[rank]++;
      knownBottomStackCards.value.add(cardId);
    }
  }
};

// Used when starting Act 3 logic usually, imported to break loop if needed
// Used when starting Act 3 logic usually, imported to break loop if needed
// import { startAct3 } from './phaseLogic' // Removed to break circular dependency

export const addNextReserve = (): boolean => {
  if (isClassicMode()) {
    const nextRank = reserveQueue.value.shift();
    if (nextRank) {
      bottomStack.value[nextRank]++;
      cardsAddedFromReserve.value++;
    }
  } else {
    if (unknownReserveCards.value > 0) {
      unknownReserveCards.value--;
      unknownBottomStack.value++;
      cardsAddedFromReserve.value++;
    }
  }

  // Check Trigger
  if (cardsAddedFromReserve.value >= 13 && currentAct.value < 3) {
    return true; // Signal to start Act 3
  }
  return false;
};

export const shuffleThreatDeck = () => {
  // Return all visible cards to the deck first
  visibleCards.value.forEach((card) => {
    updateDeckState(card.rank, card.suit, 'return');
  });
  visibleCards.value = [];
  selectedCardId.value = null;

  // Merge Bottom Stack into Middle Stack
  for (const rank in bottomStack.value) {
    const r = Number(rank);
    middleStack.value[r] += bottomStack.value[r];
    bottomStack.value[r] = 0;
  }

  // Merge Unknown Bottom Stack into Unknown Threat
  unknownThreatCards.value += unknownBottomStack.value;
  unknownBottomStack.value = 0;

  // Clear known bottom stack cards (they're now mixed into middle)
  knownBottomStackCards.value.clear();
};

export const shuffleTrophyPile = () => {
  if (trophyPile.value.length === 0) return;
  const randomIndex = Math.floor(Math.random() * trophyPile.value.length);
  trophyTop.value = trophyPile.value[randomIndex];
  isTrophyTopRandomized.value = true;
};

export const setTrophyTop = (rank: number) => {
  const card = trophyPile.value.find((c) => c.rank === rank);
  if (card) {
    trophyTop.value = card;
    isTrophyTopRandomized.value = false;
  }
};

export const addCardToTrophyPile = (card: LivePlayCard) => {
  // Add to pile
  trophyPile.value.push(card);
  // Set as new top
  trophyTop.value = card;
  isTrophyTopRandomized.value = false;

  // We do NOT return it to the deck/drawnCards. It effectively stays "drawn" (removed from deck) but is now in Trophy Pile.
  // So 'drawnCards' set should probably still contain it to prevent it being drawn again?
  // Yes. It is physically in play (in Trophy Pile).
};

export const revealHiddenTen = () => {
  const unknownTen = trophyPile.value.find((c) => c.rank === 10 && c.suit === 'Unknown');
  if (!unknownTen) return;

  const knownTens = trophyPile.value.filter((c) => c.rank === 10 && c.suit !== 'Unknown');
  const knownSuits = new Set(knownTens.map((c) => c.suit));

  if (knownSuits.size === 3) {
    const allSuits: Suit[] = ['Spades', 'Hearts', 'Clubs', 'Diamonds'];
    const missingSuit = allSuits.find((s) => !knownSuits.has(s));
    if (missingSuit) {
      unknownTen.suit = missingSuit;
    }
  }
};

export const addFaceCardToThreatDeck = (targetRank: number, effort: number | null = null) => {
  // Helper to try adding a specific rank
  const tryAdd = (rank: number): boolean => {
    if (faceCardReserves.value[rank as 11 | 12 | 13] > 0) {
      faceCardReserves.value[rank as 11 | 12 | 13]--;

      if (isClassicMode()) {
        updateDeckState(rank as Rank, 'Spades', 'add');
      } else {
        unknownBottomStack.value++;
      }

      lastAddedFaceCardRank.value = rank;
      return true;
    }
    // Check recycling bin (removedFaceCards)
    if (removedFaceCards.value[rank] > 0) {
      removedFaceCards.value[rank]--;

      if (isClassicMode()) {
        updateDeckState(rank as Rank, 'Spades', 'add');
      } else {
        unknownBottomStack.value++;
      }

      lastAddedFaceCardRank.value = rank;
      return true;
    }
    return false;
  };

  if (targetRank === 11) {
    // Jack
    if (tryAdd(11)) return;
    if (tryAdd(12)) return;
    if (tryAdd(13)) return; // Fallback to King?
    // Actually if both Jack and Queen are out, adding a Jack just fails?
    // Logic: "(If Reserve empty: Jack->Queen->King->None)"
    tryAdd(13);
    // Wait, if Jack empty, try Queen. If Queen empty, try King.
  } else if (targetRank === 12) {
    // Queen
    if (tryAdd(12)) return;
    if (tryAdd(13)) return;
    tryAdd(11);
  } else if (targetRank === 13) {
    // King
    if (tryAdd(13)) return;
    if (effort && effort <= 2) {
      if (tryAdd(11)) return;
      tryAdd(12);
    } else {
      if (tryAdd(12)) return;
      tryAdd(11);
    }
  }
};

export const removeHighestFaceCardFromDeck = () => {
  if (isClassicMode()) {
    const check = (r: number) => {
      if (middleStack.value[r] > 0) {
        middleStack.value[r]--;
        removedFaceCards.value[r]++;
        return true;
      }
      if (bottomStack.value[r] > 0) {
        bottomStack.value[r]--;
        removedFaceCards.value[r]++;
        return true;
      }
      return false;
    };
    if (check(13)) return;
    if (check(12)) return;
    if (check(11)) return;
  } else {
    if (unknownThreatCards.value > 0) {
      unknownThreatCards.value--;
      removedFaceCards.value[13]++;
    } else if (unknownBottomStack.value > 0) {
      unknownBottomStack.value--;
      removedFaceCards.value[13]++;
    }
  }
};

// --------------------------------------------------------------------------------
// Visible Card Actions
// --------------------------------------------------------------------------------

export const selectCard = (id: string) => {
  selectedCardId.value = id;
  selectedJoker.value = null;
};

export const addVisibleCard = () => {
  const config = getPlaysetConfig(selectedPlayset.value);

  if (manualJoker.value) {
    selectedJoker.value = manualJoker.value;
    selectedCardId.value = null;
  } else {
    // If we are identifying an unknown card (rank 0), we replace it.
    const visibleUnknown = visibleCards.value.findIndex(
      (c) => (c.rank as unknown as number) === 0 && c.suit === 'Unknown'
    );

    if (visibleUnknown !== -1) {
      // Replace the unknown card logic
      const oldCard = visibleCards.value[visibleUnknown];

      // Validate availability
      if (acesRemaining.value > 0 && manualRank.value !== 1) {
        // Warning? But let's allow corrections.
      }

      visibleCards.value[visibleUnknown] = {
        id: `${manualRank.value}-${manualSuit.value}`,
        rank: manualRank.value,
        suit: manualSuit.value,
        name: getRankName(manualRank.value),
        description: '',
        type: manualRank.value > 10 ? 'face' : 'number',
      };

      // Update Deck State (Identity Revealed)
      // It was "Drawn" as Unknown. Now we know it is X.
      // updateDeckState(0, 'Unknown', 'return') // ? No, we already deducted Unknown count when drawn.
      // We just need to mark it as drawn in `drawnCards`.
      // And potentially sync checks.
      updateDeckState(manualRank.value, manualSuit.value, 'draw'); // Determine that X is drawn.
      // But we already deducted 'Unknown' count.
      // Do we need to refund 'Unknown'?
      // `updateDeckState` for 'Unknown' (draw) reduced `unknownThreatCards`.
      // Now we say "It's actually 7-Spades".
      // `updateDeckState` for 7-Spades (draw) will reduce `middleStack[7]` if Classic.
      // But if Random, `middleStack` is 0s. So it just adds to `drawnCards`.
      // So for Random, this is correct.
      // For Classic, we shouldn't have had an Unknown card in the first place?
      // "Unknown" only happens in Random mode (or bug).
    } else {
      // Adding a completely new card (e.g. Draw)
      const newCard: LivePlayCard = {
        id: `${manualRank.value}-${manualSuit.value}`,
        rank: manualRank.value,
        suit: manualSuit.value,
        name: getRankName(manualRank.value),
        description: '',
        type: manualRank.value > 10 ? 'face' : 'number',
      };
      visibleCards.value.push(newCard);

      // Update Deck State
      if (!isClassicMode() && manualRank.value !== 1) {
        // We are drawing from "Unknown" stack conceptually
        if (unknownThreatCards.value > 0) {
          unknownThreatCards.value--;
        }
        drawnCards.value.add(newCard.id);
      } else {
        updateDeckState(manualRank.value, manualSuit.value, 'draw');
      }

      // Final Girl Module check
      if (config.rulesModules?.finalGirl && manualRank.value > 10) {
        strikesToAssign.value++;
      }
    }
  }
};
