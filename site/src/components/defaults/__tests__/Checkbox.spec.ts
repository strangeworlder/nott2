import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import Checkbox from '../Checkbox.vue';

describe('Checkbox.vue', () => {
  it('renders label', () => {
    const wrapper = mount(Checkbox, {
      props: {
        modelValue: false,
        label: 'Accept Terms',
      },
    });
    expect(wrapper.text()).toContain('Accept Terms');
  });

  it('emits update:modelValue when clicked', async () => {
    const wrapper = mount(Checkbox, {
      props: {
        modelValue: false,
      },
    });
    await wrapper.find('input').setValue(true);
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true]);
  });

  it('reflects modelValue prop', async () => {
    const wrapper = mount(Checkbox, {
      props: {
        modelValue: true,
      },
    });
    const input = wrapper.find('input').element as HTMLInputElement;
    expect(input.checked).toBe(true);
  });
});
