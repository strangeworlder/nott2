import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import ProcessStep from '../ProcessStep.vue';

describe('ProcessStep.vue', () => {
  it('renders step number and title', () => {
    const wrapper = mount(ProcessStep, {
      props: {
        step: 1,
        title: 'Step Title',
      },
    });
    expect(wrapper.text()).toContain('1');
    expect(wrapper.text()).toContain('Step Title');
  });

  it('renders slot content', () => {
    const wrapper = mount(ProcessStep, {
      props: {
        step: 2,
      },
      slots: {
        default: 'Step Description',
      },
    });
    expect(wrapper.text()).toContain('Step Description');
  });

  it('applies success variant', () => {
    const wrapper = mount(ProcessStep, {
      props: {
        step: 3,
        variant: 'success',
      },
    });
    expect(wrapper.find('.text-nott-green').exists()).toBe(true);
  });

  it('applies failure variant', () => {
    const wrapper = mount(ProcessStep, {
      props: {
        step: 4,
        variant: 'failure',
      },
    });
    expect(wrapper.find('.text-nott-red').exists()).toBe(true);
  });
});
