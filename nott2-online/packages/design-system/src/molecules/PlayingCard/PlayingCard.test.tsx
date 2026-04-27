import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PlayingCard } from './PlayingCard';

describe('PlayingCard', () => {
  it('renders a suit symbol', () => {
    const { container } = render(<PlayingCard suit="Hearts" rank={1} />);
    expect(container.textContent).toContain('♥');
  });

  it('renders rank label for Ace', () => {
    const { container } = render(<PlayingCard suit="Spades" rank={1} />);
    expect(container.textContent).toContain('A');
  });

  it('renders rank label for Jack', () => {
    const { container } = render(<PlayingCard suit="Clubs" rank={11} />);
    expect(container.textContent).toContain('J');
  });

  it('renders rank label for numeric card', () => {
    const { container } = render(<PlayingCard suit="Diamonds" rank={7} />);
    expect(container.textContent).toContain('7');
  });

  it('renders Joker variant', () => {
    const { container } = render(<PlayingCard joker jokerColor="Red" />);
    expect(container.textContent).toContain('JOKER');
  });

  it('renders card back when faceDown', () => {
    const { container } = render(<PlayingCard suit="Spades" rank={5} faceDown />);
    expect(container.textContent).not.toContain('♠');
  });

  it('fires onClick when clicked', () => {
    const handler = vi.fn();
    const { container } = render(<PlayingCard suit="Hearts" rank={3} onClick={handler} />);
    fireEvent.click(container.firstChild as Element);
    expect(handler).toHaveBeenCalledOnce();
  });
});
