import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DifficultyBadge } from './DifficultyBadge';

describe('DifficultyBadge', () => {
  it('renders the numeric value', () => {
    render(<DifficultyBadge value={8} />);
    expect(screen.getByText('8')).toBeTruthy();
  });

  it('renders the "Difficulty" label', () => {
    render(<DifficultyBadge value={8} />);
    expect(screen.getByText('Difficulty')).toBeTruthy();
  });

  it('renders breakdown when provided', () => {
    render(<DifficultyBadge value={8} breakdown="Trophy (5) + 3 = 8" />);
    expect(screen.getByText('Trophy (5) + 3 = 8')).toBeTruthy();
  });

  it('does not render breakdown when omitted', () => {
    render(<DifficultyBadge value={5} />);
    expect(screen.queryByText(/Trophy/)).toBeNull();
  });

  it('has accessible aria-label', () => {
    const { container } = render(<DifficultyBadge value={7} />);
    expect(container.querySelector('[aria-label="Difficulty: 7"]')).toBeTruthy();
  });

  it('forwards the id prop', () => {
    const { container } = render(<DifficultyBadge value={9} id="diff-badge" />);
    expect(container.querySelector('#diff-badge')).toBeTruthy();
  });
});
