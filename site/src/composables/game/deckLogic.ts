import { getPlaysetConfig } from '../../utils/contentLoader';
import type { Rank, Suit } from '../useGameEngine';
import {
  acesRemaining,
  bottomStack,
  cardsAddedFromReserve,
  currentAct,
  drawnCards,
  faceCardReserves,
  identifiedCards,
  isTrophyTopRandomized,
  knownBottomStackCards,
  type LivePlayCard,
  lastAddedFaceCardRank,
  manualJoker,
  manualRank,
  manualSuit,
  middleStack,
  removedFaceCardIds,
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
  const suits: Suit[] = ['Spades', 'Hearts', 'Clubs', 'Diamonds'];
  // If we have ALREADY drawn all 4 suits, then rank is exhausted.
  // BUT what if we haven't drawn them, but they are physically in the deck?
  // Drawn check is minimal.
  const availableSuits = suits.filter((s) => !drawnCards.value.has(`${rank}-${s}`));
  if (availableSuits.length === 0) return false;

  // Standard Logic: Check if PHYSICAL copies exist in deck.
  // 1. Middle Stack (Active/Known Counts)
  if ((middleStack.value[rank] || 0) > 0) return true;
  // 2. Bottom Stack (Known Counts)
  if ((bottomStack.value[rank] || 0) > 0) return true;

  // 3. Unknown Threat Cards (Rank Specific)
  if ((unknownThreatCards.value[rank] || 0) > 0) return true;
  if (rank <= 10 && (unknownThreatCards.value[0] || 0) > 0) return true; // Generic Number Cards

  // 4. Unknown Bottom Stack
  if ((unknownBottomStack.value[rank] || 0) > 0) return true;
  if (rank <= 10 && (unknownBottomStack.value[0] || 0) > 0) return true;

  return false;
};

export const isSuitAvailable = (rank: Rank, suit: Suit) => {
  const cardId = `${rank}-${suit}`;

  // 0. Permanently removed face cards (weakness discovery or Black Joker success)
  if (rank > 10 && removedFaceCardIds.value.has(cardId)) {
    return false;
  }

  // 1. Directly Drawn?
  if (drawnCards.value.has(cardId)) return false;

  // 2. At Bottom of Deck (Known)?
  if (knownBottomStackCards.value.has(cardId)) return false;

  // 3. Explicitly Identified and In-Play?
  // If it is in `identifiedCards` (and passed drawn checks above), it implies it is in Middle Stack (Active).
  if (identifiedCards.value.has(cardId)) {
    // It is identified. It is not drawn. It is not at bottom.
    // So it MUST be in the active deck (Middle Stack).
    // So it is available.
    return true;
  }

  // 4. If NOT Identified, is it available as an Unknown instance?
  // We need to check if there are "Unidentified Copies" of this Rank in the deck (middle or bottom).

  // Middle Stack Counts for Rank:
  const middleCount = middleStack.value[rank] || 0;
  // Bottom Stack Counts for Rank:
  const bottomCount = bottomStack.value[rank] || 0;
  // Unknown Threat Counts:
  const unknownSpecific = unknownThreatCards.value[rank] || 0;
  const unknownGeneric = rank <= 10 ? unknownThreatCards.value[0] || 0 : 0;
  // Unknown Bottom Stack Counts:
  const unknownBottomSpecific = unknownBottomStack.value[rank] || 0;
  const unknownBottomGeneric = rank <= 10 ? unknownBottomStack.value[0] || 0 : 0;

  const totalActiveCount =
    middleCount +
    bottomCount +
    unknownSpecific +
    unknownGeneric +
    unknownBottomSpecific +
    unknownBottomGeneric;

  // Now, how many of these are "taken" by Identified cards?
  // Identified cards that are currently in the Active Deck (not drawn, not bottom).
  let activeIdentifiedCount = 0;

  // Iterate known identified cards for this rank
  const suits: Suit[] = ['Spades', 'Hearts', 'Clubs', 'Diamonds'];
  for (const s of suits) {
    const id = `${rank}-${s}`;
    if (identifiedCards.value.has(id)) {
      if (!drawnCards.value.has(id) && !knownBottomStackCards.value.has(id)) {
        activeIdentifiedCount++;
      }
    }
  }

  // Open Slots = Total Active - Active Identified
  // If Open Slots > 0, then a non-identified suit (like this one) is valid.
  return totalActiveCount - activeIdentifiedCount > 0;
};

export const getNextValidCard = (): { rank: Rank; suit: Suit } => {
  // 1. Check Aces
  if (acesRemaining.value > 0) {
    const suits: Suit[] = ['Spades', 'Hearts', 'Clubs', 'Diamonds'];
    const availableSuit = suits.find((s) => !drawnCards.value.has(`1-${s}`));
    if (availableSuit) return { rank: 1, suit: availableSuit };
  }

  // 2. Check Middle Stack (Known Ranks)
  const ranks = Object.keys(middleStack.value)
    .map(Number)
    .sort((a, b) => a - b);

  for (const rank of ranks) {
    if (middleStack.value[rank] > 0) {
      // ... logic to pick suit?
      // Just pick first available suit.
      const suits: Suit[] = ['Spades', 'Hearts', 'Clubs', 'Diamonds'];
      const availableSuit = suits.find((s) => isSuitAvailable(rank as Rank, s));
      if (availableSuit) return { rank: rank as Rank, suit: availableSuit };
    }
  }

  // 3. Check Unknowns (Specific Rank) - e.g. Jack in Random Mode
  const unknownRanks = [11, 12, 13];
  for (const r of unknownRanks) {
    if ((unknownThreatCards.value[r] || 0) > 0) {
      // We have an Unknown Jack.
      // Return Generic or specific?
      // If no identified Jack exists, we return generic?
      // But SceneSetup usually wants a specific card to display/edit?
      // Or usually ManualCardEntry handles it.
      // If we return {11, Unknown}, SceneSetup defaults to Spades/2?
      // User requirement implies we know it's a Jack.
      // Let's return { 11, 'Spades' } as default, Manual Entry will act.
      return { rank: r as Rank, suit: 'Spades' }; // Simplified
    }
  }

  // 4. Check Generic Unknowns (Number Cards)
  if ((unknownThreatCards.value[0] || 0) > 0) {
    return { rank: 2, suit: 'Spades' }; // Default low card
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
      // Drawing an Unknown Card (Generic or Face)
      if (rank > 10) {
        // Unknown Face Card
        if ((unknownThreatCards.value[rank] || 0) > 0) {
          unknownThreatCards.value[rank]--;
        } else if ((unknownBottomStack.value[rank] || 0) > 0) {
          unknownBottomStack.value[rank]--;
        }
      } else {
        // Unknown Number Card (Generic)
        if ((unknownThreatCards.value[0] || 0) > 0) {
          unknownThreatCards.value[0]--;
        } else if ((unknownBottomStack.value[0] || 0) > 0) {
          unknownBottomStack.value[0]--;
        }
      }
    } else {
      // Drawing a Known Card
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
      // Returning an Unknown card to the bottom.
      // It becomes Unknown Bottom Stack.
      if (rank > 10) {
        unknownBottomStack.value[rank] = (unknownBottomStack.value[rank] || 0) + 1;
      } else {
        unknownBottomStack.value[0] = (unknownBottomStack.value[0] || 0) + 1;
      }
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
    // Random Mode Reserve: Generic
    if (unknownReserveCards.value > 0) {
      unknownReserveCards.value--;
      unknownBottomStack.value[0] = (unknownBottomStack.value[0] || 0) + 1;
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
  // Iterate keys 0, 11, 12, 13 (or just generic copy)
  const keys = [0, 11, 12, 13];
  for (const k of keys) {
    unknownThreatCards.value[k] =
      (unknownThreatCards.value[k] || 0) + (unknownBottomStack.value[k] || 0);
    unknownBottomStack.value[k] = 0;
  }

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

export const addFaceCardFromReserve = (targetType: 'Jack' | 'Queen' | 'King'): boolean => {
  const tryAdd = (rank: number): boolean => {
    // Check specific reserve first
    if (faceCardReserves.value[rank as 11 | 12 | 13] > 0) {
      faceCardReserves.value[rank as 11 | 12 | 13]--;
      lastAddedFaceCardRank.value = rank;

      if (isClassicMode()) {
        updateDeckState(rank as Rank, 'Spades', 'add'); // Classic adds Spades by default or random? Logic implies Spades is placeholder for "A Jack" until drawn?
        // Actually updateDeckState 'add' just increments bottomStack count. Suit allows 'Spades' as generic container if we don't track suits in stack.
        // Wait, standard Face Cards have no suit in reserve?
        // Game says "Add a random Jack".
        // updateDeckState 'add' increases bottomStack[rank].
        // When we draw, we check available suits.
        // So yes, generic add is fine.
      } else {
        unknownBottomStack.value[rank] = (unknownBottomStack.value[rank] || 0) + 1;
      }
      return true;
    }

    // Check recycling bin (removedFaceCards) - The prompt implies reserves, but usually games cycle.
    // "If Reserve empty: Jack->Queen->King->None"
    // It does NOT say "Reshuffle graveyard".
    // So if reserve is empty, we look for HIGHER tier.
    return false;
  };

  // Logic:
  // 1-2 (Controlled/Pushing) -> Add Jack.
  // 3-4 (Overexertion/Breaking) -> Add Queen.
  // Failure -> Add King.

  // Fallback Chain:
  // Jack -> Queen -> King -> None
  // Queen -> King -> Jack -> None
  // King -> Queen -> Jack -> None ?
  // Rules Rule 254:
  // "No Jacks? Add a Queen instead."
  // "No Queens? Add a King instead."
  // "No Kings? Add a Jack or Queen instead."

  if (targetType === 'Jack') {
    if (tryAdd(11)) return true;
    if (tryAdd(12)) return true;
    if (tryAdd(13)) return true;
  } else if (targetType === 'Queen') {
    if (tryAdd(12)) return true;
    if (tryAdd(13)) return true;
    if (tryAdd(11)) return true;
  } else if (targetType === 'King') {
    if (tryAdd(13)) return true;
    if (tryAdd(12)) return true;
    if (tryAdd(11)) return true;
  }

  return false;
};

// Deprecated or can comprise:
export const addFaceCardToThreatDeck = (targetRank: number, effort: number | null = null) => {
  // Mapping old calls to new Logic if needed, or just remove.
  // We will update phaseLogic to use addFaceCardFromReserve directly.
  // Keeping this stub or removing it?
  // Let's replace it with the new one entirely if no other callers exist.
  // Only usage likely in phaseLogic.
  let type: 'Jack' | 'Queen' | 'King' = 'Jack';
  if (targetRank === 12) type = 'Queen';
  if (targetRank === 13) type = 'King';

  // Effort overload override?
  if (effort && effort >= 3) type = 'Queen';

  addFaceCardFromReserve(type);
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
    const checkUnknown = (r: number) => {
      if ((unknownThreatCards.value[r] || 0) > 0) {
        unknownThreatCards.value[r]--;
        removedFaceCards.value[r]++;
        return true;
      }
      if ((unknownBottomStack.value[r] || 0) > 0) {
        unknownBottomStack.value[r]--;
        removedFaceCards.value[r]++;
        return true;
      }
      return false;
    };
    if (checkUnknown(13)) return;
    if (checkUnknown(12)) return;
    if (checkUnknown(11)) return;
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
      // We assume the "Unknown" count was already decremented when it was drawn.

      visibleCards.value[visibleUnknown] = {
        id: `${manualRank.value}-${manualSuit.value}`,
        rank: manualRank.value,
        suit: manualSuit.value,
        name: getRankName(manualRank.value),
        description: '',
        type: manualRank.value > 10 ? 'face' : 'number',
      };

      // Mark as Identified
      identifiedCards.value.add(visibleCards.value[visibleUnknown].id);

      // Update Deck State (Identity Revealed)
      // We just need to mark it as drawn in `drawnCards`.
      updateDeckState(manualRank.value, manualSuit.value, 'draw');
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

      // Check if already identified BEFORE marking (for correct decrement logic below)
      const isAlreadyIdentified = identifiedCards.value.has(newCard.id);

      // Mark as Identified
      identifiedCards.value.add(newCard.id);

      // Update Deck State
      if (!isClassicMode() && manualRank.value !== 1) {
        // Random Mode: Check if this specific card was returned to deck previously

        if (isAlreadyIdentified) {
          // This card was returned to the deck previously and is now in middleStack
          if (middleStack.value[manualRank.value] > 0) {
            middleStack.value[manualRank.value]--;
          } else if (bottomStack.value[manualRank.value] > 0) {
            bottomStack.value[manualRank.value]--;
          }
        } else if (manualRank.value > 10) {
          // Face Card from Unknown pool
          if ((unknownThreatCards.value[manualRank.value] || 0) > 0) {
            unknownThreatCards.value[manualRank.value]--;
          } else if ((unknownBottomStack.value[manualRank.value] || 0) > 0) {
            unknownBottomStack.value[manualRank.value]--;
          }
        } else {
          // Number Card (Generic Rank 0 pool usually)
          if ((unknownThreatCards.value[0] || 0) > 0) {
            unknownThreatCards.value[0]--;
          } else if ((unknownBottomStack.value[0] || 0) > 0) {
            unknownBottomStack.value[0]--;
          }
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
