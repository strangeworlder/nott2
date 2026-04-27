/**
 * GameBoardPanel — always-visible top zone showing the physical game state.
 *
 * Renders: Threat Deck (count) | Visible Cards (selectable) | Trophy Pile top
 * This is the "table" — the shared physical representation of the game.
 */

'use client';

import { useGameStore } from '../store/game-store';
import { PlayingCard } from '@nott2/design-system';

const SUIT_SYMBOL: Record<string, string> = {
  Spades: '♠', Hearts: '♥', Clubs: '♣', Diamonds: '♦',
};

function getRankLabel(rank: number) {
  if (rank === 1) return 'A';
  if (rank === 11) return 'J';
  if (rank === 12) return 'Q';
  if (rank === 13) return 'K';
  return String(rank);
}

export function GameBoardPanel() {
  const { gameState, selectCard, selectJoker } = useGameStore();
  const { deck, scene } = gameState;
  const { visibleCards, trophyTop, threatDeck } = deck;
  // Count Aces remaining in the threat deck (Prologue cards)
  const acesRemaining = threatDeck.filter(c => c.rank === 1).length;

  return (
    <div className="game-board-panel">
      <div className="game-board-row" style={{ paddingBottom: 20 }}>
        {/* Threat Deck */}
        <div className="game-deck-zone">
          <div className="game-deck-box">
            <span>🂠</span>
            <div className="game-deck-box__count">
              {threatDeck.length} cards
            </div>
          </div>
          <span style={{ fontSize: '0.55rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Deck
          </span>
        </div>

        {/* Divider */}
        <div style={{ width: 1, height: 60, background: 'var(--color-border, #2a2a2a)', flexShrink: 0 }} />

        {/* Visible cards */}
        <div className="game-visible-cards">
          {visibleCards.length === 0 && (
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
              No cards on table
            </span>
          )}
          {visibleCards.map(card => (
            <div key={card.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <PlayingCard
                suit={card.suit as any}
                rank={card.rank as any}
                selected={scene.selectedCardId === card.id}
                onClick={() => selectCard(card.id)}
              />
              {card.rank >= 11 && (
                <span style={{ fontSize: '0.5rem', color: 'var(--color-accent-bright)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Face Card
                </span>
              )}
            </div>
          ))}
          {/* Jokers */}
          {gameState.jokersAdded && !gameState.isBlackJokerRemoved && (
            <PlayingCard
              joker jokerColor="Black"
              selected={scene.activeJoker === 'Black'}
              onClick={() => selectJoker('Black')}
            />
          )}
          {gameState.jokersAdded && (
            <PlayingCard
              joker jokerColor="Red"
              selected={scene.activeJoker === 'Red'}
              onClick={() => selectJoker('Red')}
            />
          )}
        </div>

        {/* Divider */}
        {trophyTop && (
          <>
            <div style={{ width: 1, height: 60, background: 'var(--color-border, #2a2a2a)', flexShrink: 0 }} />
            {/* Trophy */}
            <div className="game-trophy-zone">
              <div className="game-trophy-box">
                <span className="game-trophy-label">Trophy</span>
                <span className="game-trophy-rank">{getRankLabel(trophyTop.rank)}{SUIT_SYMBOL[trophyTop.suit]}</span>
              </div>
              <span style={{ fontSize: '0.55rem', color: 'var(--color-warning)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Rank {trophyTop.rank}
              </span>
            </div>
          </>
        )}

        {/* Aces indicator */}
        {acesRemaining > 0 && (
          <div style={{ marginLeft: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <div style={{ fontSize: '1.5rem' }}>🂡</div>
            <span style={{ fontSize: '0.55rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              {acesRemaining} Ace{acesRemaining > 1 ? 's' : ''} left
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
