import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TrophyIndicator } from './TrophyIndicator';

describe('TrophyIndicator', () => {
  it('renders the rank label for a number card', () => {
    const { container } = render(<TrophyIndicator suit="Hearts" rank={7} />);
    // Rank text should be visible; suit is now an SVG icon
    expect(container.textContent).toContain('7');
    expect(container.querySelector('svg')).toBeTruthy();
  });

  it('renders A for rank 1', () => {
    render(<TrophyIndicator suit="Spades" rank={1} />);
    expect(screen.getByText(/A/)).toBeTruthy();
  });

  it('renders Q for rank 12', () => {
    render(<TrophyIndicator suit="Clubs" rank={12} />);
    expect(screen.getByText(/Q/)).toBeTruthy();
  });

  it('has accessible role and label', () => {
    render(<TrophyIndicator suit="Hearts" rank={7} />);
    expect(screen.getByRole('status')).toBeTruthy();
  });

  it('renders the trophy icon', () => {
    const { container } = render(<TrophyIndicator suit="Diamonds" rank={5} />);
    // Material Symbol 'emoji_events' renders as a <span> with that text
    const iconSpan = container.querySelector('.material-symbols-rounded');
    expect(iconSpan?.textContent).toBe('emoji_events');
  });
});
