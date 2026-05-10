import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { WeaknessTracker } from './WeaknessTracker';

describe('WeaknessTracker', () => {
  it('renders all 4 suits', () => {
    render(<WeaknessTracker found={new Set()} />);
    expect(screen.getByText(/Spades/)).toBeTruthy();
    expect(screen.getByText(/Hearts/)).toBeTruthy();
    expect(screen.getByText(/Clubs/)).toBeTruthy();
    expect(screen.getByText(/Diamonds/)).toBeTruthy();
  });

  it('has correct aria-label with found count', () => {
    const { container } = render(<WeaknessTracker found={new Set(['Spades', 'Hearts'])} />);
    expect(container.querySelector('[aria-label="Weaknesses found: 2 of 4"]')).toBeTruthy();
  });

  it('renders with no found weaknesses', () => {
    const { container } = render(<WeaknessTracker found={new Set()} />);
    expect(container.querySelector('[aria-label="Weaknesses found: 0 of 4"]')).toBeTruthy();
  });

  it('marks individual pips with correct aria state', () => {
    render(<WeaknessTracker found={new Set(['Clubs'])} />);
    expect(screen.getByLabelText('Clubs: weakness found')).toBeTruthy();
    expect(screen.getByLabelText('Spades: not found')).toBeTruthy();
  });
});
