import { getPlaysetConfig } from '../../utils/contentLoader';
import type { Suit } from '../useGameEngine';
import {
  addCardToTrophyPile,
  addFaceCardFromReserve,
  addNextReserve,
  getNextValidCard,
  removeHighestFaceCardFromDeck,
  shuffleThreatDeck,
  shuffleTrophyPile,
  updateDeckState,
} from './deckLogic';
import {
  acesRemaining,
  activeCard,
  bottomStack,
  cardsAddedFromReserve,
  characters,
  currentAct,
  currentPhase,
  drawnCards,
  faceCardReserves,
  falloutCard,
  identifiedCards,
  isBlackJokerRemoved,
  isEndgame,
  isEndgameInitialized,
  isGameWon,
  isGenrePointAwarded,
  isGenrePointUsed,
  isSuccess,
  jokersAdded,
  knownBottomStackCards,
  lastAddedFaceCardRank,
  manualJoker,
  manualRank,
  manualSuit,
  middleStack,
  pendingActSetups,
  playerGenrePoints,
  removedFaceCards,
  reserveQueue,
  rollEffort,
  rollMain,
  sacrificeConfirmed,
  selectedCardId,
  selectedJoker,
  selectedPlayset,
  strikes,
  strikesToAssign,
  tableGenrePoints,
  trophyPile,
  trophyTop,
  unknownBottomStack,
  unknownReserveCards,
  unknownThreatCards,
  visibleCards,
  weaknessesFound,
} from './gameState';

// --------------------------------------------------------------------------------
// Phase Control
// --------------------------------------------------------------------------------

export const nextPhase = () => {
  switch (currentPhase.value) {
    case 'welcome':
      currentPhase.value = 'game-setup';
      break;
    case 'game-setup':
      currentPhase.value = 'act-setup';
      break;
    case 'act-setup':
      // Logic handled in ActSetup.vue but typically we go to ...
      // Wait, ActSetup emits 'next' which calls nextPhase OR startGame.
      // If startGame is called, it handles the transition.
      // If nextPhase is called (Act 2/3), we go to scene-setup.
      currentPhase.value = 'scene-setup';
      break;
    case 'trophy-setup':
      currentPhase.value = 'scene-setup';
      break;
    case 'scene-setup':
      currentPhase.value = 'conversation-stakes';
      break;
    case 'conversation-stakes':
      currentPhase.value = 'resolution';
      break;
    case 'resolution':
      currentPhase.value = 'resolve-scene';
      break;
    case 'resolve-scene':
      applyGameStateUpdates();
      // Don't transition to fallout if the game was just won (e.g., Red Joker victory)
      if (currentPhase.value !== 'win') {
        currentPhase.value = 'fallout';
      }
      break;
    case 'fallout':
      startNextScene();
      break;
  }
};

export const prevPhase = () => {
  switch (currentPhase.value) {
    case 'game-setup':
      currentPhase.value = 'welcome';
      break;
    case 'act-setup':
      if (currentAct.value === 1) currentPhase.value = 'game-setup';
      break;
    case 'scene-setup':
      // Cannot go back to game setup from scene setup easily without reset
      break;
    case 'conversation-stakes':
      currentPhase.value = 'scene-setup';
      break;
    case 'resolution':
      currentPhase.value = 'conversation-stakes';
      break;
    case 'resolve-scene':
      currentPhase.value = 'resolution';
      break;
    case 'fallout':
      currentPhase.value = 'resolve-scene';
      break;
  }
};

// --------------------------------------------------------------------------------
// Transitions & Resets
// --------------------------------------------------------------------------------

export const reset = () => {
  currentPhase.value = 'welcome';
};

export const fullReset = () => {
  strikes.value = 0;
  weaknessesFound.value = [];
  isEndgame.value = false;
  acesRemaining.value = 4;

  // Reset Stacks
  middleStack.value = {
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
  };
  bottomStack.value = {
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
  };
  unknownThreatCards.value = { 0: 0, 11: 0, 12: 0, 13: 0 };
  unknownBottomStack.value = { 0: 0, 11: 0, 12: 0, 13: 0 };
  unknownReserveCards.value = 0;
  knownBottomStackCards.value = new Set();
  identifiedCards.value = new Set();

  faceCardReserves.value = { 11: 3, 12: 4, 13: 4 };
  lastAddedFaceCardRank.value = null;
  removedFaceCards.value = { 11: 0, 12: 0, 13: 0 };

  drawnCards.value.clear();
  visibleCards.value = [];
  trophyPile.value = [];
  trophyTop.value = null;

  reserveQueue.value = [5, 5, 5, 5, 6, 6, 6, 6, 7, 7, 7, 7, 8, 8, 8, 8, 9, 9, 9, 9, 10, 10, 10];

  reset();
  isEndgameInitialized.value = false;
  isGameWon.value = false;
  isBlackJokerRemoved.value = false;
  jokersAdded.value = false;
  cardsAddedFromReserve.value = 0;
  currentAct.value = 1;
  selectedPlayset.value = null;
  characters.value = [
    { id: 'Spades', name: 'The Power', strikes: 0, isDead: false },
    { id: 'Hearts', name: 'The Resolve', strikes: 0, isDead: false },
    { id: 'Clubs', name: 'The Intellect', strikes: 0, isDead: false },
    { id: 'Diamonds', name: 'The Finesse', strikes: 0, isDead: false },
  ];
  strikesToAssign.value = 0;
  tableGenrePoints.value = 13;
  playerGenrePoints.value = 0;
  pendingActSetups.value = [];
};

export const startGame = () => {
  const config = getPlaysetConfig(selectedPlayset.value);

  if (config.rulesModules?.classicSetup) {
    unknownThreatCards.value = { 0: 0, 11: 0, 12: 0, 13: 0 };
    unknownBottomStack.value = { 0: 0, 11: 0, 12: 0, 13: 0 };
    unknownReserveCards.value = 0;
  } else {
    unknownThreatCards.value = { 0: 8, 11: 1, 12: 0, 13: 0 };
    // Initializes Middle Stack to empty (We rely on unknownThreatCards for the initial draw now)
    middleStack.value = {
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
    };
    unknownReserveCards.value = 14;
  }

  trophyPile.value = [];

  if (config.rulesModules?.classicSetup) {
    const suits: Suit[] = ['Spades', 'Hearts', 'Clubs', 'Diamonds'];
    for (const s of suits) {
      trophyPile.value.push({
        id: `10-${s}`,
        rank: 10,
        suit: s,
        name: 'Trophy',
        description: '',
        type: 'number',
      });
    }
    shuffleTrophyPile();
    nextPhase(); // act-setup -> scene-setup (via nextPhase's normal flow? No, startGame moves it)
    // Wait, currentPhase is 'act-setup'. nextPhase() sets it to 'scene-setup'. Correct.
  } else {
    // Non-classic: We need to identify the trophy card physically.
    // Go to trophy-setup phase
    currentPhase.value = 'trophy-setup';
  }
};

export const startAct3 = () => {
  currentAct.value = 3;
  isEndgame.value = true;
  // Queue the Act 3 screen
  pendingActSetups.value.push('3');
  currentPhase.value = 'act-setup';
};

export const startEndgame = () => {
  acesRemaining.value = 0;
  middleStack.value = { 2: 0, 3: 0, 4: 0, 11: middleStack.value[11] };

  for (let i = 1; i <= 10; i++) {
    bottomStack.value[i] = 0;
  }
  reserveQueue.value = [];

  // Clear unknown number cards (for random/non-classic mode)
  unknownThreatCards.value[0] = 0;
  unknownBottomStack.value[0] = 0;
  rollMain.value = null;
  rollEffort.value = null;
  isGenrePointUsed.value = false;
  isGenrePointAwarded.value = false;
  sacrificeConfirmed.value = false;

  currentPhase.value = 'scene-setup';
  isEndgameInitialized.value = true;
};

export const triggerJokerEvent = () => {
  jokersAdded.value = true;
  // Queue the Jokers screen
  pendingActSetups.value.push('jokers');
  currentPhase.value = 'act-setup';
};

// Consume the first item from the pending act setups queue
export const consumePendingActSetup = (): string | null => {
  if (pendingActSetups.value.length === 0) return null;
  return pendingActSetups.value.shift() || null;
};

// Peek at the first item without consuming
export const peekPendingActSetup = (): string | null => {
  return pendingActSetups.value[0] || null;
};

// Check if there are more pending act setups
export const hasMorePendingActSetups = (): boolean => {
  return pendingActSetups.value.length > 0;
};

// --------------------------------------------------------------------------------
// Resolution Logic (Merged)
// --------------------------------------------------------------------------------

export const assignStrike = (charId: string) => {
  const char = characters.value.find((c) => c.id === charId);
  if (char) {
    char.strikes++;
    if (char.strikes >= 3) {
      char.isDead = true;
    }

    if (strikesToAssign.value > 0) {
      strikesToAssign.value--;
    }

    if (characters.value.every((c) => c.isDead)) {
      isGameWon.value = false;
      currentPhase.value = 'win';
    } else {
      // Check Rules Modules
      checkFinalGirlCondition();
    }
  }
};

export const checkFinalGirlCondition = () => {
  const config = getPlaysetConfig(selectedPlayset.value);
  if (config.rulesModules?.finalGirl) {
    const survivors = characters.value.filter((c) => c.strikes < 3);
    if (survivors.length === 1) {
      if (currentAct.value < 3) {
        startAct3();
        jokersAdded.value = true;
      }
    }
  }
};

export const awardGenrePoint = () => {
  if (tableGenrePoints.value > 0) {
    tableGenrePoints.value--;
    playerGenrePoints.value++;
  }
};

export const toggleGenrePointUsage = () => {
  if (isGenrePointUsed.value) {
    // Refund
    isGenrePointUsed.value = false;
    playerGenrePoints.value++;
  } else {
    // Use
    if (playerGenrePoints.value > 0) {
      isGenrePointUsed.value = true;
      playerGenrePoints.value--;
    }
  }
};

export const toggleGenrePointAward = () => {
  if (isGenrePointAwarded.value) {
    isGenrePointAwarded.value = false;
    playerGenrePoints.value--;
    tableGenrePoints.value++;
  } else {
    if (tableGenrePoints.value > 0) {
      isGenrePointAwarded.value = true;
      tableGenrePoints.value--;
      playerGenrePoints.value++;
    }
  }
};

export const applyGameStateUpdates = () => {
  // Save activeCard for Fallout usage (persistence through shuffle)
  falloutCard.value = activeCard.value;

  // Breaking Point Logic
  if (rollEffort.value === 4) {
    strikesToAssign.value++;
  }

  const success = isSuccess.value;

  if (selectedJoker.value) {
    handleJokerResolution(success);
  } else if (activeCard.value) {
    // 1. Ace
    if (activeCard.value.rank === 1) {
      handleAceResolution(success);
    }
    // 2. Number Card (2-10)
    else if (activeCard.value.type === 'number' && activeCard.value.rank <= 10) {
      handleNumberCardResolution(success);
    }
    // 3. Face Card
    else {
      handleFaceResolution(success);
    }
  }

  // 4. Act 3 Trigger (Global Rule: If we add enough cards)
  if (!isEndgame.value && activeCard.value?.rank !== 1 && !selectedJoker.value) {
    // Logic from old code: "if !isEndgame && rank != 1"
    // Added "!selectedJoker" because Jokers don't draw from reserve typically?
    // Actually standard rules say reserve adds on success/failure for Number cards.
    // Handlers will call addNextReserve() if appropriate.
    // But we need to check if Act 3 triggered AFTER that.
    if (cardsAddedFromReserve.value >= 13 && currentAct.value < 3) {
      startAct3();
    }
  }
};

const handleJokerResolution = (success: boolean) => {
  if (selectedJoker.value === 'Red') {
    if (success) {
      isGameWon.value = true;
      currentPhase.value = 'win';
    }
    // Failure = Death (Handled by UI/Rules text usually? Or do we kill character here?)
    // "Character Dies." -> assignStrike(active)?
    // Let's leave UI to handle narrative unless we want to force kill.
  } else if (selectedJoker.value === 'Black') {
    if (success) {
      removeHighestFaceCardFromDeck();
    } else {
      // Failure: Add King
      addFaceCardFromReserve('King');
    }
    isBlackJokerRemoved.value = true;
    shuffleThreatDeck();
    shuffleTrophyPile();
    selectedJoker.value = null; // Clear selection
    triggerJokerEvent(); // Logic to proceed?
  }
};

const handleAceResolution = (success: boolean) => {
  if (success) {
    // Remove from game. Do NOT add to Trophy Pile.
    // It stays in 'drawnCards' (so effectively removed from deck).
    // Decrement Aces Remaining?
    // acesRemaining is decremented on DRAW. So we are good.
  } else {
    // Failure: Return to bottom
    updateDeckState(activeCard.value!.rank, activeCard.value!.suit, 'return');
  }
};

const handleNumberCardResolution = (success: boolean) => {
  if (success) {
    addCardToTrophyPile(activeCard.value!);
    addNextReserve();
  } else {
    updateDeckState(activeCard.value!.rank, activeCard.value!.suit, 'return');
    addNextReserve();
  }
};

const handleFaceResolution = (success: boolean) => {
  if (success) {
    // 1. Weakness Check (Global)
    // "First time defeating a suit -> Remove it."
    if (!weaknessesFound.value.includes(activeCard.value!.suit)) {
      // Remove from visibleCards so shuffleThreatDeck doesn't return it to deck
      visibleCards.value = visibleCards.value.filter((c) => c.id !== activeCard.value!.id);
    } else {
      // Repeat Weakness: Return to Deck.
      // We do NOTHING here. The card remains in visibleCards.
      // shuffleThreatDeck() will iterate visibleCards and return them to the deck.
    }

    // 2. Add Reserve (The Killer Learns)
    const effortLevel = rollEffort.value || 0;
    if (effortLevel >= 3) {
      addFaceCardFromReserve('Queen');
    } else {
      addFaceCardFromReserve('Jack');
    }
  } else {
    // Failure
    // Gain a Strike (in addition to any Breaking Point strike)
    strikesToAssign.value++;

    // Return to Deck:
    // We do NOTHING here. The card remains in visibleCards.
    // shuffleThreatDeck() will iterate visibleCards and return them to the deck.

    addFaceCardFromReserve('King');

    if (currentAct.value === 1) {
      currentAct.value = 2;
    }
  }

  // Always shuffle after Face Card
  // This will return all remaining visible cards (the current Face Card) to the deck.
  shuffleThreatDeck();
  shuffleTrophyPile();
};

export const startNextScene = () => {
  // applyGameStateUpdates is now called in nextPhase() before Fallout

  if (isGameWon.value) return;

  // Deferred Weakness Update
  // If we had a successful Face Card resolution that WASN'T returned to deck, it's a new weakness.
  if (
    falloutCard.value &&
    (falloutCard.value.type === 'face' || falloutCard.value.rank > 10) &&
    !weaknessesFound.value.includes(falloutCard.value.suit) &&
    isSuccess.value
  ) {
    // Double check: Did we return it?
    // If we returned it, it's not in drawnCards (or is in bottomStack logic).
    // But simpler: Check our logic criteria again.
    // If Success + Not in Weakness -> We didn't return it.
    weaknessesFound.value.push(falloutCard.value.suit);

    // Check if all 4 weaknesses found -> Trigger Act 3 AND Finale (add Jokers)
    if (weaknessesFound.value.length >= 4) {
      // Only start Act 3 if not already in progress
      if (currentAct.value < 3) {
        currentAct.value = 3;
        isEndgame.value = true;
        // Queue Act 3 screen
        pendingActSetups.value.push('3');
      }
      // Add Jokers if not already added
      if (!jokersAdded.value) {
        jokersAdded.value = true;
        // Queue Jokers screen
        pendingActSetups.value.push('jokers');
      }
      // Go to act-setup phase to show the queued screens
      if (pendingActSetups.value.length > 0) {
        currentPhase.value = 'act-setup';
        return; // Exit early to show act setup screens first
      }
    }
  }

  if (selectedCardId.value) {
    visibleCards.value = visibleCards.value.filter((c) => c.id !== selectedCardId.value);
  }

  // Reset Scene State
  selectedCardId.value = null;
  falloutCard.value = null; // Clear persistence
  selectedJoker.value = null;
  manualJoker.value = null;
  sacrificeConfirmed.value = false;
  isGenrePointAwarded.value = false;
  isGenrePointUsed.value = false;
  rollMain.value = null;
  rollEffort.value = null;

  if (isEndgame.value && !isEndgameInitialized.value) {
    currentPhase.value = 'act-setup';
    return;
  }

  const nextCard = getNextValidCard();
  manualRank.value = nextCard.rank;
  manualSuit.value = nextCard.suit;

  currentPhase.value = 'scene-setup';
};
