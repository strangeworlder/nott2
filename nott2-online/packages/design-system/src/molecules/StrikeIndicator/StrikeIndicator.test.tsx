import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StrikeIndicator } from './StrikeIndicator';

describe('StrikeIndicator', () => {
  it('renders 0 strikes with empty marks', () => {
    const { container } = render(<StrikeIndicator strikes={0} />);
    expect(container.querySelector('[aria-label="0 of 3 strikes"]')).toBeTruthy();
  });

  it('renders correct aria-label for 2 strikes', () => {
    const { container } = render(<StrikeIndicator strikes={2} />);
    expect(container.querySelector('[aria-label="2 of 3 strikes"]')).toBeTruthy();
  });

  it('renders skull icon when isDead', () => {
    const { container } = render(<StrikeIndicator isDead />);
    expect(container.querySelector('[aria-label="Character eliminated"]')).toBeTruthy();
    // strike_dead is a custom SVG icon — rendered as an inline <svg>
    expect(container.querySelector('svg')).toBeTruthy();
  });

  it('renders skull icon at 3 strikes', () => {
    const { container } = render(<StrikeIndicator strikes={3} />);
    expect(container.querySelector('[aria-label="Character eliminated"]')).toBeTruthy();
    expect(container.querySelector('svg')).toBeTruthy();
  });
});
