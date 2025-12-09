import { computed } from 'vue';
import {
  addCardToTrophyPile,
  addNextReserve,
  addVisibleCard,
  getNextValidCard,
  getRankName,
  isRankAvailable,
  isSuitAvailable,
  revealHiddenTen,
  selectCard,
  setTrophyTop,
  shuffleThreatDeck,
  shuffleTrophyPile,
  updateDeckState,
} from './game/deckLogic';
import {
  acesRemaining,
  act3Countdown,
  activeCard,
  areJokersAvailable,
  bottomStack,
  cardsAddedFromReserve,
  characters,
  currentAct,
  currentPhase,
  debugMode,
  drawnCards,
  effortResult,
  faceCardReserves,
  identifiedCards,
  isBlackJokerRemoved,
  isEndgame,
  isGameOver,
  isGameWon,
  isGenrePointAwarded,
  isGenrePointUsed,
  isMiddleStackEmpty,
  isSuccess,
  isTrophyTopRandomized,
  jokersAdded,
  knownBottomStackCards,
  lastAddedFaceCardRank,
  manualJoker,
  manualOverride,
  manualRank,
  manualSuit,
  middleStack,
  pendingActSetups,
  playerGenrePoints,
  removedFaceCards,
  reserveQueue,
  rollEffort,
  rollMain,
  rollTotal,
  sacrificeConfirmed,
  selectedCardId,
  selectedJoker,
  selectedPlayset,
  strikes,
  strikesToAssign,
  tableGenrePoints,
  targetDifficulty,
  trophyPile,
  trophyTop,
  unknownBottomStack,
  unknownThreatCards,
  visibleCards,
  weaknessesFound,
} from './game/gameState';
import {
  applyGameStateUpdates,
  assignStrike,
  awardGenrePoint,
  consumePendingActSetup,
  fullReset,
  hasMorePendingActSetups,
  nextPhase,
  peekPendingActSetup,
  prevPhase,
  reset,
  startAct3,
  startEndgame,
  startGame,
  startNextScene,
  toggleGenrePointAward,
  toggleGenrePointUsage,
  triggerJokerEvent,
} from './game/phaseLogic';

export function useLivePlay() {
  // Derived State (local to useLivePlay or just forwarded?)
  // Most computed props are now forwarded from gameState or defined there to share them.

  const selectedSuit = computed(() => activeCard.value?.suit || null);
  const selectedRank = computed(() => activeCard.value?.rank || null);
  const isFaceCard = computed(() => {
    // If we have an active card, use it
    if (activeCard.value) {
      return activeCard.value.type === 'face' || (activeCard.value.rank || 0) > 10;
    }
    // Fallback: Check if we have a selected rank that implies face card (e.g. from manual entry persistence)
    // or if we are in a phase where we should know.
    // Ideally, we shouldn't lose activeCard. But if we do, let's try to infer from other state.
    if (selectedRank.value && selectedRank.value > 10) return true;

    return false;
  });

  const isWelcomePhase = computed(() => currentPhase.value === 'welcome' && currentAct.value === 1);
  const isFirstWeakness = computed(
    () => currentAct.value === 1 && weaknessesFound.value.length === 0
  );

  const cardName = computed(() => {
    if (!selectedRank.value) return '';
    return getRankName(selectedRank.value);
  });

  // Resolution logic moved to gameState.ts
  // We just return them below from the imports.

  const availableTrophyRanks = computed(() => {
    return trophyPile.value.map((c) => c.rank).filter((r) => r > 0);
  });

  const hasFaceCardOnTable = computed(() => {
    return visibleCards.value.some((c) => c.rank > 10);
  });

  const pendingFalloutRank = computed(() => {
    return lastAddedFaceCardRank.value || 0;
  });

  return {
    // State
    activeCard,
    visibleCards,
    selectedCardId,
    strikes,
    characters,
    strikesToAssign,
    isGameOver,
    weaknessesFound,
    isEndgame,
    isGameWon,
    isBlackJokerRemoved,
    jokersAdded,
    areJokersAvailable,
    act3Countdown,
    cardsAddedFromReserve,
    manualSuit,
    manualRank,
    manualJoker,
    acesRemaining,
    unknownThreatCards,
    unknownBottomStack,
    identifiedCards,
    knownBottomStackCards,
    faceCardReserves,
    removedFaceCards,
    middleStack,
    bottomStack,
    reserveQueue,
    drawnCards,
    trophyPile,
    trophyTop,
    isTrophyTopRandomized,
    currentPhase,
    currentAct,
    selectedJoker,
    sacrificeConfirmed,
    rollMain,
    rollEffort,
    targetDifficulty,
    manualOverride,
    debugMode,
    tableGenrePoints,
    playerGenrePoints,
    selectedPlayset,
    selectedSuit,
    selectedRank,
    isFaceCard,
    isWelcomePhase,
    isFirstWeakness,
    cardName,
    rollTotal,
    isSuccess,
    effortResult,
    availableTrophyRanks,
    isMiddleStackEmpty,
    hasFaceCardOnTable,
    isGenrePointAwarded,
    isGenrePointUsed,
    pendingFalloutRank,
    pendingActSetups,

    // Methods
    isRankAvailable,
    isSuitAvailable,
    updateDeckState,
    addNextReserve,
    shuffleThreatDeck,
    shuffleTrophyPile,
    addVisibleCard,
    selectCard,
    setTrophyTop,
    revealHiddenTen,
    reset,
    fullReset,
    startGame,
    startAct3,
    triggerJokerEvent,
    startEndgame,
    applyGameStateUpdates,
    startNextScene,
    getRankName,
    awardGenrePoint,
    toggleGenrePointUsage,
    toggleGenrePointAward,
    getNextValidCard,
    lastAddedFaceCardRank,
    nextPhase,
    prevPhase,
    assignStrike,
    addCardToTrophyPile,
    consumePendingActSetup,
    peekPendingActSetup,
    hasMorePendingActSetups,
  };
}
