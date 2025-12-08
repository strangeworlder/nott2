import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it } from 'vitest';
import { useLivePlay } from '../../../composables/useLivePlay';
import TrophySetup from '../TrophySetup.vue';

describe('TrophySetup.vue', () => {
  const {
    fullReset,
    manualRank,
    manualSuit,
    trophyPile,
    trophyTop,
    selectedPlayset,
    isSuitAvailable,
  } = useLivePlay();

  beforeEach(() => {
    fullReset();
    selectedPlayset.value = 'default';
  });

  it('sets the trophy card correctly when confirmed', async () => {
    const wrapper = mount(TrophySetup);

    // Simulate user selecting a card (e.g., 5 of Spades)
    // Since the component uses the composable state directly, we can set it here.
    manualRank.value = 5;
    manualSuit.value = 'Spades';

    // Find the ManualCardEntry component and trigger the confirm event
    // We assume ManualCardEntry is present.
    const manualEntry = wrapper.findComponent({ name: 'ManualCardEntry' });
    expect(manualEntry.exists()).toBe(true);

    await manualEntry.vm.$emit('confirm');

    // Assert trophy pile has the card
    expect(trophyPile.value.length).toBeGreaterThan(0);
    const addedCard = trophyPile.value.find((c) => c.id === 'trophy-start');
    expect(addedCard).toBeDefined();
    expect(addedCard?.rank).toBe(5);
    expect(addedCard?.suit).toBe('Spades');

    // Assert it is the top card
    expect(trophyTop.value?.id).toBe('trophy-start');

    // Assert the card is NO LONGER available in the threat deck
    expect(isSuitAvailable(5, 'Spades')).toBe(false);
  });
});
