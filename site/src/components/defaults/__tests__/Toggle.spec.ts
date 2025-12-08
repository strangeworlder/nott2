import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import Toggle from '../Toggle.vue';

describe('Toggle.vue', () => {
  it('renders correct label based on state', async () => {
    const wrapper = mount(Toggle, {
      props: {
        modelValue: true,
        labelOn: 'Active',
        labelOff: 'Inactive',
      },
    });
    expect(wrapper.text()).toContain('Active');

    await wrapper.setProps({ modelValue: false });
    expect(wrapper.text()).toContain('Inactive');
  });

  it('emits update:modelValue when clicked', async () => {
    const wrapper = mount(Toggle, {
      props: {
        modelValue: false,
      },
    });
    await wrapper.trigger('click');
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true]);
  });

  it('applies active classes when true', () => {
    const wrapper = mount(Toggle, {
      props: {
        modelValue: true,
      },
    });
    expect(wrapper.classes()).toContain('border-green-500');
  });
});
