import { beforeEach, describe, expect, it } from 'vitest';
import { useLivePlay } from '../useLivePlay';

describe('useLivePlay', () => {
  const {
    fullReset,
    toggleGenrePointUsage,
    playerGenrePoints,
    tableGenrePoints,
    isGenrePointUsed,
    awardGenrePoint,
    isGenrePointAwarded,
    toggleGenrePointAward,
    isRankAvailable,
    updateDeckState,
    shuffleThreatDeck,
    // bottomStack, // Import for verify
    selectedPlayset,
    acesRemaining,
  } = useLivePlay();

  beforeEach(() => {
    fullReset();
    selectedPlayset.value = 'generic_slasher_classic';
  });

  describe('Genre Points', () => {
    it('should initialize with correct genre points', () => {
      expect(tableGenrePoints.value).toBe(13);
      expect(playerGenrePoints.value).toBe(0);
    });

    it('should award genre points correctly', () => {
      awardGenrePoint();
      expect(tableGenrePoints.value).toBe(12);
      expect(playerGenrePoints.value).toBe(1);
    });

    it('should toggle genre point award (refund/award)', () => {
      // Award
      toggleGenrePointAward();
      expect(isGenrePointAwarded.value).toBe(true);
      expect(tableGenrePoints.value).toBe(12);
      expect(playerGenrePoints.value).toBe(1);

      // Refund
      toggleGenrePointAward();
      expect(isGenrePointAwarded.value).toBe(false);
      expect(tableGenrePoints.value).toBe(13);
      expect(playerGenrePoints.value).toBe(0);
    });

    it('should toggle genre point usage (use/refund)', () => {
      // Give player a point first
      awardGenrePoint();
      expect(playerGenrePoints.value).toBe(1);
      expect(tableGenrePoints.value).toBe(12);

      // Use point
      toggleGenrePointUsage();
      expect(isGenrePointUsed.value).toBe(true);
      expect(playerGenrePoints.value).toBe(0);
      expect(tableGenrePoints.value).toBe(12);

      // Refund (Toggle back off)
      toggleGenrePointUsage();
      expect(isGenrePointUsed.value).toBe(false);
      expect(playerGenrePoints.value).toBe(1);
      expect(tableGenrePoints.value).toBe(12);
    });
  });

  describe('Deck Logic', () => {
    it('should initialize with correct middle stack and empty bottom stack', () => {
      // Middle Stack: 2, 3, 4, 11
      // Note: Aces block other ranks, so we must check Aces first or exhaust them?
      // Actually, isRankAvailable(2) returns false if Aces are present.
      // So we expect FALSE for 2, 3, 4, 11 initially if Aces are present.
      // Let's verify Aces first.
      expect(isRankAvailable(1)).toBe(true);

      // Now exhaust Aces to check Middle Stack
      updateDeckState(1, 'Spades', 'draw');
      updateDeckState(1, 'Hearts', 'draw');
      updateDeckState(1, 'Clubs', 'draw');
      updateDeckState(1, 'Diamonds', 'draw');

      expect(isRankAvailable(2)).toBe(true);
      expect(isRankAvailable(3)).toBe(true);
      expect(isRankAvailable(4)).toBe(true);
      expect(isRankAvailable(11)).toBe(true);

      // Bottom Stack (5-10, 12, 13) should be empty/unavailable
      expect(isRankAvailable(5)).toBe(false);
      expect(isRankAvailable(6)).toBe(false);
      expect(isRankAvailable(12)).toBe(false);
      expect(isRankAvailable(13)).toBe(false);
    });

    it('should add reserves to bottom stack and make them available (manual selection)', () => {
      // Exhaust Aces
      acesRemaining.value = 0;

      // Add a 5 (Reserve)
      updateDeckState(5, 'Spades', 'add');

      expect(isRankAvailable(5)).toBe(true);
    });

    it('should make bottom stack available after shuffle', () => {
      // Exhaust Aces first
      updateDeckState(1, 'Spades', 'draw');
      updateDeckState(1, 'Hearts', 'draw');
      updateDeckState(1, 'Clubs', 'draw');
      updateDeckState(1, 'Diamonds', 'draw');

      // Add a 5 (Reserve)
      updateDeckState(5, 'Spades', 'add');
      // Bottom Stack is available
      expect(isRankAvailable(5)).toBe(true);

      // Shuffle (Merges Bottom into Middle)
      shuffleThreatDeck();

      // Now 5 should be available
      expect(isRankAvailable(5)).toBe(true);
    });

    it('should return cards to bottom stack and make them available (manual selection)', () => {
      // Exhaust Aces first
      updateDeckState(1, 'Spades', 'draw');
      updateDeckState(1, 'Hearts', 'draw');
      updateDeckState(1, 'Clubs', 'draw');
      updateDeckState(1, 'Diamonds', 'draw');

      // Draw a 2 (Available)
      updateDeckState(2, 'Spades', 'draw');

      // Return it (goes to Bottom Stack)
      updateDeckState(2, 'Spades', 'return');

      // If we drew the LAST 2, it would be unavailable.
      // But we have 4 2s.
      // Let's exhaust all 2s to verify.
      updateDeckState(2, 'Hearts', 'draw');
      updateDeckState(2, 'Clubs', 'draw');
      updateDeckState(2, 'Diamonds', 'draw');

      // Now 2s should be exhausted from Middle Stack
      // But we have 1 in Bottom Stack, so it IS available.
      expect(isRankAvailable(2)).toBe(true);

      // We returned one 2 earlier (Spades). It should be in Bottom Stack.
      // So isRankAvailable(2) should be true (available for manual override).
      expect(isRankAvailable(2)).toBe(true);

      // Shuffle
      shuffleThreatDeck();

      // Now available again (the returned 2 is in Middle Stack)
      expect(isRankAvailable(2)).toBe(true);
    });

    it('should block specific suit for returned cards (knownBottomStackCards)', () => {
      const { isSuitAvailable } = useLivePlay();

      // Exhaust Aces first
      updateDeckState(1, 'Spades', 'draw');
      updateDeckState(1, 'Hearts', 'draw');
      updateDeckState(1, 'Clubs', 'draw');
      updateDeckState(1, 'Diamonds', 'draw');

      // Draw a 10 of Hearts
      updateDeckState(10, 'Hearts', 'draw');

      // Return it (failure - goes to Bottom Stack)
      updateDeckState(10, 'Hearts', 'return');

      // Rank 10 should be available (it's in bottomStack)
      expect(isRankAvailable(10)).toBe(true);

      // But the specific suit (Hearts) should NOT be available
      // because we know it's at the bottom of the deck
      expect(isSuitAvailable(10, 'Hearts')).toBe(false);

      // Other 10s should still be available
      expect(isSuitAvailable(10, 'Spades')).toBe(true);
      expect(isSuitAvailable(10, 'Diamonds')).toBe(true);
      expect(isSuitAvailable(10, 'Clubs')).toBe(true);
    });

    it('should make returned cards available again after shuffle', () => {
      const { isSuitAvailable } = useLivePlay();

      // Exhaust Aces first
      updateDeckState(1, 'Spades', 'draw');
      updateDeckState(1, 'Hearts', 'draw');
      updateDeckState(1, 'Clubs', 'draw');
      updateDeckState(1, 'Diamonds', 'draw');

      // Draw and return a 10 of Hearts
      updateDeckState(10, 'Hearts', 'draw');
      updateDeckState(10, 'Hearts', 'return');

      // Should NOT be available before shuffle
      expect(isSuitAvailable(10, 'Hearts')).toBe(false);

      // Shuffle the deck (merges bottom to middle, clears knownBottomStackCards)
      shuffleThreatDeck();

      // NOW it should be available
      expect(isSuitAvailable(10, 'Hearts')).toBe(true);
    });
  });
});
