import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import List from '../List.vue';

describe('List.vue', () => {
  it('renders ul by default', () => {
    const wrapper = mount(List);
    expect(wrapper.element.tagName).toBe('UL');
  });

  it('renders ol when as prop is ol', () => {
    const wrapper = mount(List, {
      props: {
        as: 'ol',
      },
    });
    expect(wrapper.element.tagName).toBe('OL');
  });

  it('applies variant classes', () => {
    const wrapper = mount(List, {
      props: {
        variant: 'decimal',
      },
    });
    expect(wrapper.classes()).toContain('list-decimal');
  });

  it('applies color classes', () => {
    const wrapper = mount(List, {
      props: {
        color: 'red',
      },
    });
    expect(wrapper.classes()).toContain('text-nott-red');
  });

  it('applies spacing classes', () => {
    const wrapper = mount(List, {
      props: {
        spacing: 'lg',
      },
    });
    expect(wrapper.classes()).toContain('space-y-4');
  });
});
