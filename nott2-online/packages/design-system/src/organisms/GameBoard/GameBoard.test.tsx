import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { GameBoard } from './GameBoard';

describe('GameBoard', () => {
  it('renders children', () => {
    render(<GameBoard><div>Zone</div></GameBoard>);
    expect(screen.getByText('Zone')).toBeTruthy();
  });

  it('DeckZone renders count', () => {
    render(<GameBoard><GameBoard.DeckZone count={12} /></GameBoard>);
    expect(screen.getByText('12')).toBeTruthy();
  });

  it('CardLine renders empty hint when no cards', () => {
    render(<GameBoard><GameBoard.CardLine cards={[]} selectedId={null} onSelect={() => {}} /></GameBoard>);
    expect(screen.getByText('—')).toBeTruthy();
  });

  it('PhaseInfo renders act and phase name', () => {
    render(<GameBoard><GameBoard.PhaseInfo phase="scene-setup" act={1} /></GameBoard>);
    expect(screen.getByText(/Act 1/)).toBeTruthy();
  });

  it('TrophyZone renders trophy pile as a Deck with label and count', () => {
    render(
      <GameBoard>
        <GameBoard.TrophyZone topCard={{ suit: 'Hearts', rank: 7 }} count={3} />
      </GameBoard>
    );
    // Deck label
    expect(screen.getByText('Trophy')).toBeTruthy();
    // The face-up PlayingCard renders rank in both corners
    const rankLabels = screen.getAllByText('7');
    expect(rankLabels.length).toBeGreaterThan(0);
  });

  it('TrophyZone renders empty state when no topCard is provided', () => {
    render(
      <GameBoard>
        <GameBoard.TrophyZone count={0} />
      </GameBoard>
    );
    expect(screen.getByText('Trophy')).toBeTruthy();
    // Empty deck renders a dash
    expect(screen.getByText('—')).toBeTruthy();
  });
});
