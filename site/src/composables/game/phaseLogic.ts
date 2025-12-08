import { getPlaysetConfig } from '../../utils/contentLoader';
import type { Suit } from '../useGameEngine';
import {
  addCardToTrophyPile,
  addFaceCardToThreatDeck,
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
  isBlackJokerRemoved,
  isEndgame,
  isEndgameInitialized,
  isFaceCard,
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
      currentPhase.value = 'fallout';
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
  unknownThreatCards.value = 0;
  unknownBottomStack.value = 0;
  unknownReserveCards.value = 0;
  knownBottomStackCards.value = new Set();

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
};
export const startGame = () => {
  const config = getPlaysetConfig(selectedPlayset.value);

  if (config.rulesModules?.classicSetup) {
    unknownThreatCards.value = 0;
    unknownReserveCards.value = 0;
  } else {
    unknownThreatCards.value = 8;
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
      11: 1,
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
  currentPhase.value = 'act-setup';
};

export const startEndgame = () => {
  acesRemaining.value = 0;
  middleStack.value = { 2: 0, 3: 0, 4: 0, 11: middleStack.value[11] };

  for (let i = 1; i <= 10; i++) {
    bottomStack.value[i] = 0;
  }
  reserveQueue.value = [];
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
  currentPhase.value = 'act-setup';
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
  // Breaking Point Logic
  if (rollEffort.value === 4) {
    strikesToAssign.value++;
  }

  if (isSuccess.value) {
    // Joker Success
    if (selectedJoker.value === 'Red') {
      isGameWon.value = true;
      currentPhase.value = 'win';
      return;
    }
    if (selectedJoker.value === 'Black') {
      removeHighestFaceCardFromDeck();
      selectedJoker.value = null;
      triggerJokerEvent();
      return;
    }

    // Standard Success
    if (activeCard.value) {
      // Number Cards (Rank 2-10) and Aces (Rank 1) go to Trophy Pile on success
      if (activeCard.value.type === 'number' || activeCard.value.rank === 1) {
        addCardToTrophyPile(activeCard.value);
      } else {
        // Face Cards are returned (if not defeated/weakness logic handles removal separately?
        // Wait, "First time defeating a suit removes it (Weakness Found). If already defeated, it stays in deck."
        // Face Card Logic handles deck updates internally via `removeHighestFaceCardFromDeck`?
        // No, that's for Black Joker success.
        // Standard Face Card Success: "1-2 adds a Jack... First time defeating a suit removes it."
        // This logic is missing here properly?
        // Actually `applyGameStateUpdates` doesn't seem to implement the Face Card Success logic fully here?
        // Ah, let's look at `isFaceCard.value` check below in Failure block.
        // But this block is `if (isSuccess.value)`.
        // For Face Cards success:
        // We need to implement Face Card Success logic here too if it's missing.
        // But for now, fixing Number Cards.
        updateDeckState(activeCard.value.rank, activeCard.value.suit, 'return');
      }
    }

    if (!isEndgame.value && activeCard.value?.rank !== 1) {
      const act3Triggered = addNextReserve();
      if (act3Triggered) startAct3();
    }
  } else {
    // Failure
    if (selectedJoker.value) {
      shuffleThreatDeck();
      shuffleTrophyPile();
      return;
    }

    if (isFaceCard.value) {
      strikesToAssign.value++;
      addFaceCardToThreatDeck(13, rollEffort.value); // Add King

      if (currentAct.value === 1) {
        currentAct.value = 2;
      }

      shuffleThreatDeck();
      shuffleTrophyPile();
    } else {
      if (activeCard.value && activeCard.value.rank !== 1) {
        updateDeckState(activeCard.value.rank, activeCard.value.suit, 'return');
      }

      if (!isEndgame.value && activeCard.value?.rank !== 1) {
        const act3Triggered = addNextReserve();
        if (act3Triggered) startAct3();
      }
    }
  }
};

export const startNextScene = () => {
  // applyGameStateUpdates is now called in nextPhase() before Fallout

  if (isGameWon.value) return;

  if (selectedCardId.value) {
    visibleCards.value = visibleCards.value.filter((c) => c.id !== selectedCardId.value);
  }

  // Reset Scene State
  selectedCardId.value = null;
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
