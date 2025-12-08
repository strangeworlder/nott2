import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as contentLoader from '../../utils/contentLoader';
import { useLivePlay } from '../useLivePlay';

// Mock contentLoader
vi.mock('../../utils/contentLoader', () => ({
  getPlaysetConfig: vi.fn(),
}));

describe('useLivePlay - Final Girl Module', () => {
  const {
    addVisibleCard,
    strikesToAssign,
    manualRank,
    manualSuit,
    selectedPlayset,
    visibleCards,
    fullReset,
    assignStrike,
    currentAct,
    isEndgame,
    jokersAdded,
    areJokersAvailable,
  } = useLivePlay();

  beforeEach(() => {
    fullReset();
    vi.clearAllMocks();
  });

  it('should assign a strike when a Face Card is drawn and Final Girl module is active', () => {
    // Setup Final Girl module active
    selectedPlayset.value = 'summercamp';
    vi.mocked(contentLoader.getPlaysetConfig).mockReturnValue({
      rulesModules: { finalGirl: true },
    });

    // Setup Face Card (Jack)
    manualRank.value = 11;
    manualSuit.value = 'Spades';

    // Action
    addVisibleCard();

    // Assert
    expect(strikesToAssign.value).toBe(1);
    expect(visibleCards.value.length).toBe(1);
  });

  it('should trigger Act 3 and add Jokers when only 1 survivor remains', () => {
    // Setup Final Girl module active
    selectedPlayset.value = 'summercamp';
    vi.mocked(contentLoader.getPlaysetConfig).mockReturnValue({
      rulesModules: { finalGirl: true },
    });

    // Kill 3 characters
    assignStrike('Spades');
    assignStrike('Spades');
    assignStrike('Spades'); // Dead

    assignStrike('Hearts');
    assignStrike('Hearts');
    assignStrike('Hearts'); // Dead

    assignStrike('Clubs');
    assignStrike('Clubs');
    assignStrike('Clubs'); // Dead

    // Assert
    expect(currentAct.value).toBe(3);
    expect(isEndgame.value).toBe(true);
    expect(jokersAdded.value).toBe(true);
    expect(areJokersAvailable.value).toBe(true);
  });

  it('should NOT trigger Act 3 when more than 1 survivor remains', () => {
    // Setup Final Girl module active
    selectedPlayset.value = 'summercamp';
    vi.mocked(contentLoader.getPlaysetConfig).mockReturnValue({
      rulesModules: { finalGirl: true },
    });

    // Kill 2 characters
    assignStrike('Spades');
    assignStrike('Spades');
    assignStrike('Spades'); // Dead

    assignStrike('Hearts');
    assignStrike('Hearts');
    assignStrike('Hearts'); // Dead

    // Assert
    expect(currentAct.value).toBe(1);
    expect(isEndgame.value).toBe(false);
    expect(jokersAdded.value).toBe(false);
  });
});
