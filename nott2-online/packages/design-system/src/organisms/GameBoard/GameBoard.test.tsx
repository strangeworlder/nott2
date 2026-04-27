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
    expect(screen.getByText(/No cards drawn/i)).toBeTruthy();
  });

  it('PhaseInfo renders act and phase name', () => {
    render(<GameBoard><GameBoard.PhaseInfo phase="scene-setup" act={1} /></GameBoard>);
    expect(screen.getByText(/Act 1/)).toBeTruthy();
  });
});
