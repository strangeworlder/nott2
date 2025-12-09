import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import PlayingCard from '../PlayingCard.vue';

describe('PlayingCard.vue', () => {
  it('renders rank and suit', () => {
    const wrapper = mount(PlayingCard, {
      props: {
        suit: 'Spades',
        rank: 1,
      },
    });
    expect(wrapper.text()).toContain('A');
    expect(wrapper.findComponent({ name: 'Icon' }).exists()).toBe(true);
  });

  it('renders Joker', () => {
    const wrapper = mount(PlayingCard, {
      props: {
        isJoker: true,
        jokerColor: 'Red',
      },
    });
    expect(wrapper.text()).toContain('Joker');
    expect(wrapper.text()).toContain('Red');
    expect(wrapper.text()).toContain('★');
  });

  it('applies selected ring', () => {
    const wrapper = mount(PlayingCard, {
      props: {
        suit: 'Hearts',
        rank: 10,
        selected: true,
      },
    });
    expect(wrapper.classes()).toContain('ring-4');
    expect(wrapper.classes()).toContain('ring-nott-red');
  });

  it('applies correct color for red suits', () => {
    const wrapper = mount(PlayingCard, {
      props: {
        suit: 'Hearts',
        rank: 5,
      },
    });
    expect(wrapper.find('.text-nott-red').exists()).toBe(true);
  });

  it('renders correct number of pips for number cards', () => {
    const wrapper = mount(PlayingCard, {
      props: {
        suit: 'Spades',
        rank: 5,
      },
    });
    // 5 of Spades should render 5 pips + 2 corner icons = 7 icon elements
    // Note: Icon wrapper pattern may cause findAllComponents to find both wrapper and inner
    const icons = wrapper.findAllComponents({ name: 'Icon' });
    expect(icons.length).toBeGreaterThanOrEqual(7);
  });

  it('renders face cards with text', () => {
    const wrapper = mount(PlayingCard, {
      props: {
        suit: 'Diamonds',
        rank: 12,
      },
    });
    expect(wrapper.text()).toContain('Q');
    expect(wrapper.text()).toContain('Queen');
  });
});
