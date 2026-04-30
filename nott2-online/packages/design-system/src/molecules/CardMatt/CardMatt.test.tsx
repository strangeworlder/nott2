import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CardMatt } from './CardMatt';

describe('CardMatt', () => {
  it('renders the title', () => {
    render(<CardMatt title="Visible Threats" />);
    expect(screen.getByText('Visible Threats')).toBeTruthy();
  });

  it('renders empty hint when count is 0', () => {
    render(<CardMatt count={0} emptyHint="Draw from deck" />);
    expect(screen.getByText('Draw from deck')).toBeTruthy();
  });

  it('hides empty hint when count > 0', () => {
    render(<CardMatt count={2} />);
    expect(screen.queryByText('Draw from deck')).toBeFalsy();
  });

  it('shows card count badge when count > 0', () => {
    render(<CardMatt count={3} />);
    expect(screen.getByText('3 cards')).toBeTruthy();
  });

  it('shows singular "card" for count 1', () => {
    render(<CardMatt count={1} />);
    expect(screen.getByText('1 card')).toBeTruthy();
  });

  it('forwards ref to the invisible inner target area div', () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<CardMatt ref={ref} count={0} />);
    expect(ref.current).toBeTruthy();
    expect(ref.current?.tagName).toBe('DIV');
  });
});
