/**
 * GameBoard (Organism — Compound Component)
 *
 * Philosophical:
 * The GameBoard is the physical table rendered digitally — where the deck
 * lives, where cards are laid, where trophies are earned. Sub-components
 * represent spatial zones on this table.
 *
 * Technical:
 * Compound component pattern. GameBoard is the canvas container.
 * Sub-components (DeckZone, CardLine, TrophyZone, PhaseInfo) are
 * positioned zones within it. Consumers compose them inside GameBoard.
 *
 * Usage:
 *   <GameBoard>
 *     <GameBoard.DeckZone count={12} onClick={onDraw} />
 *     <GameBoard.CardLine cards={visibleCards} selectedId={id} onSelect={fn} />
 *     <GameBoard.TrophyZone card={trophyTop} />
 *     <GameBoard.PhaseInfo phase="scene-setup" act={1} />
 *   </GameBoard>
 */

import React from 'react';
import { PlayingCard } from '../../molecules/PlayingCard/PlayingCard';
import type { Suit, Rank } from '../../molecules/PlayingCard/PlayingCard';
import * as styles from './GameBoard.css';

interface GameBoardProps { children: React.ReactNode; }
interface DeckZoneProps { count: number; onClick?: () => void; }
interface CardLineProps {
  cards: Array<{ id: string; suit: Suit; rank: Rank }>;
  selectedId: string | null;
  onSelect: (id: string) => void;
}
interface TrophyZoneProps { card?: { suit: Suit; rank: Rank } | null; isRandomized?: boolean; }
interface PhaseInfoProps { phase: string; act: 1 | 2 | 3; isEndgame?: boolean; }

function DeckZone({ count, onClick }: DeckZoneProps) {
  return (
    <div className={styles.zone}>
      <span className={styles.zoneLabel}>Threat Deck</span>
      <div className={styles.deckStack} onClick={onClick} role={onClick ? 'button' : undefined}>
        {Array.from({ length: Math.min(count, 5) }, (_, i) => (
          <div key={i} className={styles.deckCard} style={{ top: `${i * -3}px`, left: `${i * 1}px` }} />
        ))}
        <span className={styles.deckCount}>{count}</span>
      </div>
    </div>
  );
}

function CardLine({ cards, selectedId, onSelect }: CardLineProps) {
  return (
    <div className={styles.zone}>
      <span className={styles.zoneLabel}>Visible Cards ({cards.length})</span>
      <div className={styles.cardLine}>
        {cards.map(card => (
          <PlayingCard
            key={card.id}
            suit={card.suit}
            rank={card.rank}
            selected={card.id === selectedId}
            onClick={() => onSelect(card.id)}
          />
        ))}
        {cards.length === 0 && (
          <span className={styles.emptyHint}>No cards drawn yet</span>
        )}
      </div>
    </div>
  );
}

function TrophyZone({ card, isRandomized }: TrophyZoneProps) {
  return (
    <div className={styles.zone}>
      <span className={styles.zoneLabel}>Trophy Top</span>
      {card ? (
        <PlayingCard suit={card.suit} rank={card.rank} compact />
      ) : (
        <div className={styles.emptyCard}>{isRandomized ? '?' : '—'}</div>
      )}
    </div>
  );
}

function PhaseInfo({ phase, act, isEndgame }: PhaseInfoProps) {
  return (
    <div className={styles.phaseInfo}>
      <span className={styles.actBadge} data-act={act}>Act {act}{isEndgame ? ' ☠' : ''}</span>
      <span className={styles.phaseName}>{phase.replace(/-/g, ' ')}</span>
    </div>
  );
}

export function GameBoard({ children }: GameBoardProps) {
  return <div className={styles.gameBoardRoot}>{children}</div>;
}

GameBoard.DeckZone = DeckZone;
GameBoard.CardLine = CardLine;
GameBoard.TrophyZone = TrophyZone;
GameBoard.PhaseInfo = PhaseInfo;
