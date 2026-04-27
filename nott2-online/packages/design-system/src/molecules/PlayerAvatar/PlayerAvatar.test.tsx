import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PlayerAvatar } from './PlayerAvatar';

describe('PlayerAvatar', () => {
  it('renders player name', () => {
    render(<PlayerAvatar name="Alice" suitSymbol="♠" />);
    expect(screen.getByText('Alice')).toBeTruthy();
  });

  it('renders suit symbol', () => {
    render(<PlayerAvatar name="Bob" suitSymbol="♥" />);
    expect(screen.getByText('♥')).toBeTruthy();
  });

  it('renders character name when provided', () => {
    render(<PlayerAvatar name="Alice" suitSymbol="♠" characterName="The Jock" />);
    expect(screen.getByText('The Jock')).toBeTruthy();
  });

  it('shows online indicator', () => {
    const { container } = render(<PlayerAvatar name="Alice" suitSymbol="♠" isConnected={true} />);
    const dot = container.querySelector('[data-online="true"]');
    expect(dot).toBeTruthy();
  });

  it('shows offline indicator', () => {
    const { container } = render(<PlayerAvatar name="Alice" suitSymbol="♠" isConnected={false} />);
    const dot = container.querySelector('[data-online="false"]');
    expect(dot).toBeTruthy();
  });
});
