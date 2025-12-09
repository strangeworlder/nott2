import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { computed, ref } from 'vue';
import { useLivePlay } from '../../../composables/useLivePlay';
import ResolutionPhase from '../ResolutionPhase.vue';

// Mock useLivePlay
vi.mock('../../../composables/useLivePlay');

describe('ResolutionPhase.vue', () => {
  const mockUseLivePlay = {
    rollMain: ref(null),
    rollEffort: ref(null),
    isFaceCard: ref(false),
    selectedJoker: ref(null),
    targetDifficulty: ref(10),
    isSuccess: ref(false),
    rollTotal: ref(0),
    selectedRank: ref(5),
    effortResult: ref(null),
    isTrophyTopRandomized: ref(false),
    availableTrophyRanks: ref([10]),
    trophyTop: ref({ rank: 10 }),
    setTrophyTop: vi.fn(),
    playerGenrePoints: ref(0),
    isGenrePointUsed: ref(false),
    toggleGenrePointUsage: vi.fn(),
    selectedPlayset: ref('default'),
    characters: ref([]),
    selectedSuit: ref('Spades'),
  };

  // Setup mock implementation
  (useLivePlay as any).mockReturnValue(mockUseLivePlay);

  it('renders correctly', () => {
    const wrapper = mount(ResolutionPhase);
    expect(wrapper.exists()).toBe(true);
  });

  it('blocks dice input when trophy selection is needed (REPRODUCTION CASE)', () => {
    // Setup condition where blocking SHOULD happen but currently fails
    // Condition: Face Card + Randomized Trophy + Multiple Available Ranks
    // The Bug: trophyTop has a value (e.g. from previous state or default), so !trophyTop.rank is false
    mockUseLivePlay.isFaceCard.value = true;
    mockUseLivePlay.isTrophyTopRandomized.value = true;
    mockUseLivePlay.availableTrophyRanks.value = [10, 11];

    // Crucial: we simulate that trophyTop HAS a value internally (which happens in the app),
    // but since isTrophyTopRandomized is true, we should still block until user confirms.
    mockUseLivePlay.trophyTop.value = { rank: 10 };

    const wrapper = mount(ResolutionPhase);

    // Identify dice container (it has the grid class)
    const diceContainer = wrapper.find('.grid.md\\:grid-cols-2');

    // Assertion: Should have opacity-30 and pointer-events-none
    expect(diceContainer.classes()).toContain('opacity-30');
    expect(diceContainer.classes()).toContain('pointer-events-none');

    // Also check the specific warning message is visible
    expect(wrapper.text()).toContain('Identify Trophy Card First');
  });
});
