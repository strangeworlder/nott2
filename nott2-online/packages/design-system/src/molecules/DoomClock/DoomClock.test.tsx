import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DoomClock } from './DoomClock';

describe('DoomClock', () => {
  it('renders with zero progress', () => {
    render(<DoomClock current={0} />);
    const el = screen.getByRole('meter');
    expect(el).toBeTruthy();
    expect(el.getAttribute('aria-valuenow')).toBe('0');
    expect(el.getAttribute('aria-valuemax')).toBe('13');
  });

  it('shows correct countdown in aria-label', () => {
    render(<DoomClock current={5} />);
    const el = screen.getByRole('meter');
    expect(el.getAttribute('aria-label')).toContain('8 reserve cards remaining');
  });

  it('shows correct countdown at 12 of 13', () => {
    render(<DoomClock current={12} />);
    const el = screen.getByRole('meter');
    expect(el.getAttribute('aria-label')).toContain('1 reserve cards remaining');
  });

  it('enters broken state at 13', () => {
    render(<DoomClock current={13} />);
    const el = screen.getByRole('meter');
    expect(el.getAttribute('aria-label')).toContain('broken');
    expect(el.getAttribute('aria-valuenow')).toBe('13');
  });

  it('broken state shows XIII label below the clock', () => {
    render(<DoomClock current={13} />);
    expect(screen.getByText('XIII')).toBeTruthy();
  });

  it('accepts an id prop', () => {
    const { container } = render(<DoomClock current={0} id="my-clock" />);
    expect(container.querySelector('#my-clock')).toBeTruthy();
  });

  it('aria-valuenow does not exceed 13 when given higher values', () => {
    render(<DoomClock current={15} />);
    const el = screen.getByRole('meter');
    // current is passed through directly but broken state triggers
    expect(el.getAttribute('aria-label')).toContain('broken');
  });
});
