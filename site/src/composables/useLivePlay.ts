import { computed } from 'vue';
import { effortScale } from '../data/rules';
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
  faceCardReserves,
  isBlackJokerRemoved,
  isEndgame,
  isGameOver,
  isGameWon,
  isGenrePointAwarded,
  isGenrePointUsed,
  isMiddleStackEmpty,
  isTrophyTopRandomized,
  jokersAdded,
  lastAddedFaceCardRank,
  manualJoker,
  manualOverride,
  manualRank,
  manualSuit,
  middleStack,
  playerGenrePoints,
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
  visibleCards,
  weaknessesFound,
} from './game/gameState';
import {
  applyGameStateUpdates,
  assignStrike,
  awardGenrePoint,
  fullReset,
  nextPhase,
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
  const isFaceCard = computed(() => (selectedRank.value || 0) > 10);
  const isFirstTime = computed(() => currentPhase.value === 'welcome' && currentAct.value === 1);

  const cardName = computed(() => {
    if (!selectedRank.value) return '';
    return getRankName(selectedRank.value);
  });

  const rollTotal = computed(() => {
    if (rollMain.value === null) return null;
    return (rollMain.value || 0) + (rollEffort.value || 0);
  });

  const effortResult = computed(() => {
    if (!rollEffort.value) return null;
    return effortScale[(rollEffort.value - 1) as 0 | 1 | 2 | 3];
  });

  const getDifficulty = () => {
    if (!selectedRank.value) return 0;
    // Number Cards (1-10) use their own rank as difficulty
    if (selectedRank.value <= 10) return selectedRank.value;

    // Face Cards (11+) use the Trophy Pile + Modifier
    const base =
      !trophyTop.value || (trophyTop.value.rank as number) === 0 ? 0 : trophyTop.value.rank;
    let modifier = 0;
    if (selectedRank.value === 11) modifier = 1;
    if (selectedRank.value === 12) modifier = 2;
    if (selectedRank.value === 13) modifier = 3;

    return base + modifier;
  };

  const isSuccess = computed(() => {
    if (selectedJoker.value === 'Red') return true;
    if (selectedJoker.value === 'Black') return false;

    if (!rollTotal.value) return false;

    const target = getDifficulty();
    return rollTotal.value >= target;
  });

  const targetDifficulty = computed(() => {
    return getDifficulty();
  });

  const availableTrophyRanks = computed(() => {
    return trophyPile.value.map((c) => c.rank).filter((r) => r > 0);
  });

  const hasFaceCardOnTable = computed(() => {
    return visibleCards.value.some((c) => c.rank > 10);
  });

  const pendingFalloutRank = computed(() => {
    return 0;
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
    isFirstTime,
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
    faceCardReserves,
    lastAddedFaceCardRank,
    nextPhase,
    prevPhase,
    assignStrike,
    addCardToTrophyPile,
  };
}
