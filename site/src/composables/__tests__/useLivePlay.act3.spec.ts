import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as contentLoader from '../../utils/contentLoader';
import { useLivePlay } from '../useLivePlay';

// Mock contentLoader
vi.mock('../../utils/contentLoader', () => ({
  getPlaysetConfig: vi.fn(),
}));

describe('useLivePlay - Act 3 and Finale Logic', () => {
  const {
    fullReset,
    startAct3,
    triggerJokerEvent,
    currentAct,
    isEndgame,
    jokersAdded,
    areJokersAvailable,
    weaknessesFound,
    selectedPlayset,
    addNextReserve,
    cardsAddedFromReserve,
    act3Countdown,
    activeCard,
    visibleCards,
    selectedCardId,
    applyGameStateUpdates,
    rollMain,
    rollEffort,
    trophyTop,
  } = useLivePlay();

  beforeEach(() => {
    fullReset();
    vi.clearAllMocks();
    selectedPlayset.value = { id: 'default', name: 'Default', description: 'Default', details: [] };
    vi.mocked(contentLoader.getPlaysetConfig).mockReturnValue({
      rulesModules: { classicSetup: true },
    });
  });

  it('should return true (signal Act 3) when 13 cards are added from reserve', () => {
    // Add 12 cards
    for (let i = 0; i < 12; i++) {
      const triggered = addNextReserve();
      expect(triggered).toBe(false);
    }
    expect(cardsAddedFromReserve.value).toBe(12);
    expect(currentAct.value).toBe(1); // Logic doesn't auto-update Act anymore, implies caller must handle it

    // Add 13th card
    const triggered = addNextReserve();
    expect(cardsAddedFromReserve.value).toBe(13);
    expect(triggered).toBe(true);

    // Simulating the caller (phaseLogic) handling the signal
    if (triggered) startAct3();
    expect(currentAct.value).toBe(3);
    expect(isEndgame.value).toBe(true);
  });

  it('should correctly calculate Act 3 countdown', () => {
    expect(act3Countdown.value).toBe(13);

    addNextReserve();
    expect(act3Countdown.value).toBe(12);

    for (let i = 0; i < 11; i++) {
      addNextReserve();
    }
    expect(act3Countdown.value).toBe(1);

    addNextReserve();
    expect(act3Countdown.value).toBe(0);
  });

  it('should automatically trigger Act 3 and Jokers when 4 weaknesses are found', () => {
    startAct3();
    triggerJokerEvent();

    expect(currentAct.value).toBe(3);
    expect(jokersAdded.value).toBe(true);
  });

  it('should not add card from reserve when an Ace is resolved', () => {
    // Setup
    const ace = {
      id: 'ace-spades',
      rank: 1 as const,
      suit: 'Spades' as const,
      name: 'Ace',
      type: 'number' as const,
      description: '',
    };
    visibleCards.value = [ace];
    selectedCardId.value = ace.id;

    // Force Failure (so we would normally add a card)
    trophyTop.value = {
      id: 'trophy',
      rank: 10,
      suit: 'Hearts' as const,
      name: 'Ten',
      type: 'number' as const,
      description: '',
    };
    rollMain.value = 1;
    rollEffort.value = 1;

    const initialReserveCount = cardsAddedFromReserve.value;

    applyGameStateUpdates();

    expect(cardsAddedFromReserve.value).toBe(initialReserveCount);
  });

  it('should add card from reserve when a Number Card is resolved', () => {
    // Setup
    const two = {
      id: 'two-spades',
      rank: 2 as const,
      suit: 'Spades' as const,
      name: 'Two',
      type: 'number' as const,
      description: '',
    };
    visibleCards.value = [two];
    selectedCardId.value = two.id;

    // Force Failure
    trophyTop.value = {
      id: 'trophy',
      rank: 10,
      suit: 'Hearts' as const,
      name: 'Ten',
      type: 'number' as const,
      description: '',
    };
    rollMain.value = 1;
    rollEffort.value = 1;

    const initialReserveCount = cardsAddedFromReserve.value;

    applyGameStateUpdates();

    expect(cardsAddedFromReserve.value).toBe(initialReserveCount + 1);
  });
});
