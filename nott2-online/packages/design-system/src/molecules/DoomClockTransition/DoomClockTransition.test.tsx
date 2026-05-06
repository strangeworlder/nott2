import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DoomClockTransition } from './DoomClockTransition';

describe('DoomClockTransition', () => {
  it('renders with tick variant', () => {
    // displayCountdown starts at TRIGGER(13) - from(3) = 10
    render(<DoomClockTransition from={3} to={4} onComplete={vi.fn()} />);
    const el = screen.getByRole('status');
    expect(el).toBeTruthy();
    expect(el.getAttribute('aria-label')).toContain('10');
  });

  it('shows correct countdown for given to value', () => {
    // displayCountdown starts at TRIGGER(13) - from(10) = 3
    render(<DoomClockTransition from={10} to={11} onComplete={vi.fn()} />);
    const el = screen.getByRole('status');
    expect(el.getAttribute('aria-label')).toContain('3');
  });

  it('renders broken variant', () => {
    render(<DoomClockTransition from={12} to={13} isBroken onComplete={vi.fn()} />);
    const el = screen.getByRole('status');
    expect(el.getAttribute('aria-label')).toContain('broken');
    expect(screen.getByText('XIII')).toBeTruthy();
  });

  it('renders dismiss hint', () => {
    render(<DoomClockTransition from={5} to={6} onComplete={vi.fn()} />);
    expect(screen.getByText('click to continue')).toBeTruthy();
  });

  it('calls onComplete after animation duration', () => {
    vi.useFakeTimers();
    const onComplete = vi.fn();
    render(<DoomClockTransition from={0} to={1} onComplete={onComplete} />);
    expect(onComplete).not.toHaveBeenCalled();
    vi.advanceTimersByTime(2600);
    expect(onComplete).toHaveBeenCalledOnce();
    vi.useRealTimers();
  });

  it('accepts an id prop', () => {
    const { container } = render(
      <DoomClockTransition from={0} to={1} onComplete={vi.fn()} id="transition-clock" />
    );
    expect(container.querySelector('#transition-clock')).toBeTruthy();
  });
});
