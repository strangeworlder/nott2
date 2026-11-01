import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useLivePlay } from '../../../composables/useLivePlay';
import RulesReference from '../RulesReference.vue';

describe('RulesReference.vue', () => {
  const { fullReset, selectedPlayset } = useLivePlay();

  beforeEach(() => {
    fullReset();
    selectedPlayset.value = 'default';
    vi.restoreAllMocks();
  });

  it('renders the navigation tabs and Download Booklet PDF button from uiLabels.json', () => {
    const wrapper = mount(RulesReference);

    expect(wrapper.text()).toContain('Basic Rules');
    expect(wrapper.text()).toContain('Characters');
    expect(wrapper.text()).toContain('Prompt Matrix');
    expect(wrapper.text()).toContain('Effort Scale');
    expect(wrapper.text()).toContain('Download Booklet PDF');
  });

  it('opens the Ashcan Booklet PDF when Download Booklet PDF is clicked', async () => {
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);
    const wrapper = mount(RulesReference);

    const downloadButton = wrapper
      .findAll('button')
      .find((btn) => btn.text().includes('Download Booklet PDF'));
    expect(downloadButton).toBeDefined();

    await downloadButton!.trigger('click');

    expect(openSpy).toHaveBeenCalledWith(
      './NotT-2-Interactive-Ashcan.pdf',
      '_blank',
      'noopener,noreferrer'
    );
  });
});
