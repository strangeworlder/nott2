import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import ListItem from '../ListItem.vue';

describe('ListItem.vue', () => {
  it('renders slot content', () => {
    const wrapper = mount(ListItem, {
      slots: {
        default: 'Item 1',
      },
    });
    expect(wrapper.text()).toContain('Item 1');
  });

  it('renders index when ordered variant', () => {
    const wrapper = mount(ListItem, {
      props: {
        variant: 'ordered',
        index: 0,
      },
      slots: {
        default: 'First Item',
      },
    });
    expect(wrapper.text()).toContain('1.');
    expect(wrapper.text()).toContain('First Item');
  });

  it('applies color class', () => {
    const wrapper = mount(ListItem, {
      props: {
        color: 'text-red-500',
      },
    });
    expect(wrapper.classes()).toContain('text-red-500');
  });
});
