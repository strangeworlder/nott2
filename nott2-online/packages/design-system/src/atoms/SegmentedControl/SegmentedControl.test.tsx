import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SegmentedControl } from './SegmentedControl';

const OPTIONS = [
  { value: -1, label: '−1' },
  { value: 0, label: 'No Change' },
  { value: 1, label: '+1' },
];

describe('SegmentedControl', () => {
  it('renders all options', () => {
    render(<SegmentedControl options={OPTIONS} value={0} onChange={() => {}} />);
    expect(screen.getByText('−1')).toBeTruthy();
    expect(screen.getByText('No Change')).toBeTruthy();
    expect(screen.getByText('+1')).toBeTruthy();
  });

  it('marks the selected option with aria-checked', () => {
    render(<SegmentedControl options={OPTIONS} value={0} onChange={() => {}} />);
    const radios = screen.getAllByRole('radio');
    expect(radios[0].getAttribute('aria-checked')).toBe('false');
    expect(radios[1].getAttribute('aria-checked')).toBe('true');
    expect(radios[2].getAttribute('aria-checked')).toBe('false');
  });

  it('calls onChange when an unselected segment is clicked', () => {
    const handler = vi.fn();
    render(<SegmentedControl options={OPTIONS} value={0} onChange={handler} />);
    fireEvent.click(screen.getByText('+1'));
    expect(handler).toHaveBeenCalledWith(1);
  });

  it('does not call onChange when the selected segment is clicked', () => {
    const handler = vi.fn();
    render(<SegmentedControl options={OPTIONS} value={0} onChange={handler} />);
    fireEvent.click(screen.getByText('No Change'));
    expect(handler).not.toHaveBeenCalled();
  });

  it('does not call onChange when a disabled segment is clicked', () => {
    const handler = vi.fn();
    const opts = [
      { value: -1, label: '−1', disabled: true },
      { value: 0, label: 'No Change' },
      { value: 1, label: '+1' },
    ];
    render(<SegmentedControl options={opts} value={0} onChange={handler} />);
    fireEvent.click(screen.getByText('−1'));
    expect(handler).not.toHaveBeenCalled();
  });

  it('has role="radiogroup" on the root', () => {
    render(<SegmentedControl options={OPTIONS} value={0} onChange={() => {}} />);
    expect(screen.getByRole('radiogroup')).toBeTruthy();
  });

  it('applies the id prop', () => {
    const { container } = render(
      <SegmentedControl options={OPTIONS} value={0} onChange={() => {}} id="aptitude-ctrl" />
    );
    expect(container.querySelector('#aptitude-ctrl')).toBeTruthy();
  });
});
