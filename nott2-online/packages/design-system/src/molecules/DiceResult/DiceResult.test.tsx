import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DiceResult } from './DiceResult';

describe('DiceResult', () => {
  it('renders d10, d4, and total', () => {
    render(<DiceResult d10={7} d4={3} />);
    expect(screen.getByText('7')).toBeTruthy();
    expect(screen.getByText('3')).toBeTruthy();
    expect(screen.getByText('10')).toBeTruthy();
  });

  it('shows the correct total (d10 + d4)', () => {
    render(<DiceResult d10={5} d4={2} />);
    expect(screen.getByText('7')).toBeTruthy();
  });

  it('shows original d4 struck through when modifier set', () => {
    render(<DiceResult d10={5} d4={3} modifier={{ value: -1, label: 'Aptitude' }} originalD4={4} />);
    expect(screen.getByText('3')).toBeTruthy();
    expect(screen.getByText('4')).toBeTruthy();
  });

  it('shows d10 modification state', () => {
    const { container } = render(<DiceResult d10={8} d4={3} d10Modified originalD10={5} />);
    expect(screen.getByText('8')).toBeTruthy();
    expect(screen.getByText('5')).toBeTruthy();
  });

  it('has accessible aria-label', () => {
    const { container } = render(<DiceResult d10={7} d4={3} />);
    expect(container.querySelector('[aria-label="Roll result: d10=7, d4=3, total=10"]')).toBeTruthy();
  });

  it('renders DieChip atoms for both dice', () => {
    const { container } = render(<DiceResult d10={7} d4={3} />);
    expect(container.querySelector('[aria-label="D10: 7"]')).toBeTruthy();
    expect(container.querySelector('[aria-label="D4: 3"]')).toBeTruthy();
  });

  it('handles both modifiers simultaneously', () => {
    render(
      <DiceResult
        d10={8} d4={3}
        d10Modified originalD10={5}
        modifier={{ value: -1, label: 'Aptitude' }} originalD4={4}
      />
    );
    expect(screen.getByText('8')).toBeTruthy();
    expect(screen.getByText('5')).toBeTruthy();
    expect(screen.getByText('3')).toBeTruthy();
    expect(screen.getByText('4')).toBeTruthy();
    expect(screen.getByText('11')).toBeTruthy(); // total = 8 + 3
  });
});
