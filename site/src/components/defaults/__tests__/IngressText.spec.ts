import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import IngressText from '../IngressText.vue';
import Text from '../Text.vue';

describe('IngressText.vue', () => {
  it('renders slot content', () => {
    const wrapper = mount(IngressText, {
      slots: {
        default: 'Intro text',
      },
    });
    expect(wrapper.text()).toContain('Intro text');
  });

  it('uses Text component with correct props', () => {
    const wrapper = mount(IngressText);
    const textComponent = wrapper.findComponent(Text);
    expect(textComponent.exists()).toBe(true);
    expect(textComponent.props('variant')).toBe('quote');
    expect(textComponent.props('color')).toBe('muted');
    expect(textComponent.props('align')).toBe('center');
  });
});
