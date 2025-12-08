import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import Card from '../Card.vue';

describe('Card.vue', () => {
  it('renders slot content', () => {
    const wrapper = mount(Card, {
      slots: {
        default: 'Card Content',
      },
    });
    expect(wrapper.text()).toContain('Card Content');
  });

  it('renders title when provided', () => {
    const wrapper = mount(Card, {
      props: {
        title: 'Card Title',
      },
    });
    expect(wrapper.text()).toContain('Card Title');
    expect(wrapper.find('h3').exists()).toBe(true);
  });

  it('applies variant classes', () => {
    const wrapper = mount(Card, {
      props: {
        variant: 'highlighted',
      },
    });
    // Check for a class specific to the highlighted variant
    expect(wrapper.find('.border-nott-red').exists()).toBe(true);
  });

  it('applies noPadding class', () => {
    const wrapper = mount(Card, {
      props: {
        noPadding: true,
      },
    });
    expect(wrapper.find('.p-6').exists()).toBe(false);
  });

  it('applies center alignment', () => {
    const wrapper = mount(Card, {
      props: {
        center: true,
      },
    });
    expect(
      wrapper.classes().some((c) => c.includes('text-center')) ||
        wrapper.find('.text-center').exists()
    ).toBe(true);
  });
});
