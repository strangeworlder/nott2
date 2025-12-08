import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import Button from '../Button.vue';

describe('Button.vue', () => {
  it('renders slot content', () => {
    const wrapper = mount(Button, {
      slots: {
        default: 'Click me',
      },
    });
    expect(wrapper.text()).toContain('Click me');
  });

  it('emits click event', async () => {
    const wrapper = mount(Button);
    await wrapper.trigger('click');
    expect(wrapper.emitted('click')).toBeTruthy();
  });

  it('applies disabled state', () => {
    const wrapper = mount(Button, {
      props: {
        disabled: true,
      },
    });
    expect(wrapper.attributes('disabled')).toBeDefined();
    expect(wrapper.classes()).toContain('disabled:opacity-50');
  });

  it('applies variant classes', () => {
    const wrapper = mount(Button, {
      props: {
        variant: 'secondary',
      },
    });
    expect(wrapper.classes()).toContain('bg-transparent');
    expect(wrapper.classes()).toContain('border-nott-gray');
  });
});
