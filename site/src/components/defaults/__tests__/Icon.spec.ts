import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import Icon from '../Icon.vue';

describe('Icon.vue', () => {
  it('renders correct icon based on name', () => {
    const wrapper = mount(Icon, {
      props: {
        name: 'clock',
      },
    });
    expect(wrapper.find('circle').exists()).toBe(true);
    expect(wrapper.find('polyline').exists()).toBe(true);
  });

  it('applies size prop', () => {
    const wrapper = mount(Icon, {
      props: {
        name: 'users',
        size: 48,
      },
    });
    expect(wrapper.attributes('width')).toBe('48');
    expect(wrapper.attributes('height')).toBe('48');
  });

  it('applies color classes', () => {
    const wrapper = mount(Icon, {
      props: {
        name: 'supplies',
        color: 'red',
      },
    });
    expect(wrapper.classes()).toContain('text-nott-red');
  });
});
