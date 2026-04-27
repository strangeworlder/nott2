import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PlayerAvatar } from './PlayerAvatar';

describe('PlayerAvatar', () => {
  it('renders player name', () => {
    render(<PlayerAvatar name="Alice" suit="Spades" />);
    expect(screen.getByText('Alice')).toBeTruthy();
  });

  it('renders suit as an SVG icon', () => {
    const { container } = render(<PlayerAvatar name="Bob" suit="Hearts" />);
    // Suit is now rendered via Icon component (inline SVG)
    const svg = container.querySelector('svg');
    expect(svg).toBeTruthy();
  });

  it('renders character name when provided', () => {
    render(<PlayerAvatar name="Alice" suit="Spades" characterName="The Jock" />);
    expect(screen.getByText('The Jock')).toBeTruthy();
  });

  it('shows online indicator', () => {
    const { container } = render(<PlayerAvatar name="Alice" suit="Spades" isConnected={true} />);
    const dot = container.querySelector('[data-online="true"]');
    expect(dot).toBeTruthy();
  });

  it('shows offline indicator', () => {
    const { container } = render(<PlayerAvatar name="Alice" suit="Spades" isConnected={false} />);
    const dot = container.querySelector('[data-online="false"]');
    expect(dot).toBeTruthy();
  });

  it('supports legacy suitSymbol prop', () => {
    const { container } = render(<PlayerAvatar name="Carol" suitSymbol="♦" />);
    // Should reverse-map ♦ to Diamonds and render the SVG icon
    const svg = container.querySelector('svg');
    expect(svg).toBeTruthy();
  });
});
