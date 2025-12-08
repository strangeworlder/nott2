import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import LivePlayHeader from '../LivePlayHeader.vue';

// Mock child components to isolate tests
vi.mock('../../CurrentThreat.vue', () => ({
  default: { template: '<div class="mock-current-threat"></div>' },
}));
vi.mock('../../TrophyPileTop.vue', () => ({
  default: { template: '<div class="mock-trophy-pile-top"></div>' },
}));

describe('LivePlayHeader.vue', () => {
  const defaultProps = {
    currentAct: 1,
    currentPhase: 'game-setup',
    fullReset: vi.fn(),
    trophyTop: null,
    isTrophyTopRandomized: false,
    cardName: '',
    activeCard: null,
    selectedJoker: null,
  };

  it('renders act number correctly', () => {
    const wrapper = mount(LivePlayHeader, {
      props: { ...defaultProps, currentAct: 2 },
    });
    expect(wrapper.text()).toContain('Act 2');
  });

  it('renders phase name correctly', () => {
    const wrapper = mount(LivePlayHeader, {
      props: { ...defaultProps, currentPhase: 'resolution' },
    });
    expect(wrapper.text()).toContain('Resolution');
  });

  it('shows context bar only in relevant phases', () => {
    const wrapper = mount(LivePlayHeader, {
      props: { ...defaultProps, currentPhase: 'resolution' },
    });
    expect(wrapper.find('.mock-current-threat').exists()).toBe(true);

    const wrapper2 = mount(LivePlayHeader, {
      props: { ...defaultProps, currentPhase: 'game-setup' },
    });
    expect(wrapper2.find('.mock-current-threat').exists()).toBe(false);
  });

  it('calls fullReset when reset button is clicked', async () => {
    const wrapper = mount(LivePlayHeader, {
      props: defaultProps,
    });
    await wrapper.find('button').trigger('click');
    expect(defaultProps.fullReset).toHaveBeenCalled();
  });
});
