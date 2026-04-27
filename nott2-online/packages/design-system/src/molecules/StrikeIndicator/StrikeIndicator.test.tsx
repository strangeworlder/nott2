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

  it('renders skull when isDead', () => {
    const { container } = render(<StrikeIndicator isDead />);
    expect(container.textContent).toContain('☠');
  });

  it('renders skull at 3 strikes', () => {
    const { container } = render(<StrikeIndicator strikes={3} />);
    expect(container.textContent).toContain('☠');
  });
});
