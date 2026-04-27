/**
 * GameBoardPanel — always-visible top zone showing the physical game state.
 *
 * Philosophical:
 * This is the table surface. A shared, persistent view of the physical game
 * state that all players see at all times — the deck, the cards, the trophy.
 * It grounds every conversation in the same material reality.
 *
 * Technical:
 * A thin store-connected wrapper around the DS `GameBoard` compound component.
 * Uses `GameBoard.DeckZone`, `GameBoard.CardLine`, `GameBoard.TrophyZone`,
 * `GameBoard.PhaseInfo`, and `GameBoard.DoomClockZone` — the same zones visible
 * in Storybook — rather than hand-rolling ad-hoc CSS. This ensures the demo
 * and DS stay in sync visually.
 *
 * Mounted guard prevents hydration mismatch from Zustand localStorage state.
 */

'use client';

import { useState, useEffect } from 'react';
import { useGameStore } from '../store/game-store';
import { GameBoard } from '@nott2/design-system';
import type { Suit, Rank } from '@nott2/design-system';

export function GameBoardPanel() {
  const { gameState, computed, selectCard, selectJoker, drawCard } = useGameStore();
  const { deck, scene, phase, currentAct, isEndgame } = gameState;
  const { visibleCards, trophyTop, threatDeck } = deck;

  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  if (!mounted) {
    return <div className="game-board-panel" role="region" aria-label="Game board" />;
  }

  // Build card list for CardLine — exclude joker IDs (rank 14/15), which are
  // rendered specially in SceneSetupScreen, not as standard PlayingCards.
  const allVisibleCards = visibleCards
    .filter(c => !c.id.startsWith('Joker-'))
    .map(c => ({ id: c.id, suit: c.suit as Suit, rank: c.rank as Rank }));

  const selectedId = scene.selectedCardId ?? (
    scene.activeJoker === 'Black' ? 'Joker-Black'
    : scene.activeJoker === 'Red' ? 'Joker-Red'
    : null
  );

  return (
    <div className="game-board-panel" role="region" aria-label="Game board">
      <GameBoard vertical>
        <GameBoard.DeckZone count={threatDeck.length} />
        <GameBoard.CardLine
          cards={allVisibleCards}
          selectedId={selectedId}
          onSelect={(id) => {
            if (id === 'joker-black') selectJoker('Black');
            else if (id === 'joker-red') selectJoker('Red');
            else selectCard(id);
          }}
        />
        <GameBoard.TrophyZone
          topCard={trophyTop ? { suit: trophyTop.suit as Suit, rank: trophyTop.rank as Rank } : null}
          count={deck.trophyPile.length}
        />
        <GameBoard.DoomClockZone
          current={deck.cardsAddedFromReserve}
          act={currentAct as 1 | 2 | 3}
          isPrologue={computed.isPrologue}
        />
      </GameBoard>
    </div>
  );
}
