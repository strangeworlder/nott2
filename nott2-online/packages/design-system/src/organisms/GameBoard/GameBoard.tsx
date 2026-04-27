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
 * Sub-components (DeckZone, CardLine, TrophyZone, PhaseInfo, DoomClockZone) are
 * positioned zones within it.
 *
 * TrophyZone: uses the Deck molecule to show the trophy pile as a deck with the
 * top card visible face-up. `topCard` prop carries the visible card; `count`
 * carries how many cards are in the pile.
 * Consumers compose these sub-components inside GameBoard.
 *
 * Props:
 * - vertical: When true, renders as a narrow vertical column (for sidebar use).
 *             When false/omitted, renders as the traditional horizontal bar.
 *
 * Usage:
 *   <GameBoard vertical>
 *     <GameBoard.DeckZone count={12} onClick={onDraw} />
 *     <GameBoard.CardLine cards={visibleCards} selectedId={id} onSelect={fn} />
 *     <GameBoard.TrophyZone topCard={{ suit: 'Hearts', rank: 5 }} count={3} />
 *     <GameBoard.DoomClockZone current={cardsAdded} act={currentAct} isPrologue={false} />
 *   </GameBoard>
 */

import React from 'react';
import { PlayingCard } from '../../molecules/PlayingCard/PlayingCard';
import type { Suit, Rank } from '../../molecules/PlayingCard/PlayingCard';
import { Deck } from '../../molecules/Deck/Deck';
import type { DeckStatus } from '../../molecules/Deck/Deck';
import { DoomClock } from '../../molecules/DoomClock/DoomClock';
import * as styles from './GameBoard.css';

interface GameBoardProps { children: React.ReactNode; vertical?: boolean; }
interface DeckZoneProps { count: number; label?: string; status?: DeckStatus | null; onClick?: () => void; vertical?: boolean; }
interface CardLineProps {
  cards: Array<{ id: string; suit: Suit; rank: Rank }>;
  selectedId: string | null;
  onSelect: (id: string) => void;
  vertical?: boolean;
}
interface TrophyZoneProps {
  /** The top card of the trophy pile, rendered face-up. */
  topCard?: { suit: Suit; rank: Rank } | null;
  /** Total number of cards in the trophy pile (for hover count badge). */
  count?: number;
  /** True before trophy card is set — renders an empty/placeholder deck. */
  isRandomized?: boolean;
  vertical?: boolean;
}
interface PhaseInfoProps { phase: string; act: 1 | 2 | 3; isEndgame?: boolean; vertical?: boolean; }
/** How many reserve cards have been added (0–13). Visible once the Aces are done. */
interface DoomClockZoneProps { current: number; act: 1 | 2 | 3; isPrologue?: boolean; vertical?: boolean; }

function DeckZone({ count, label = 'Threat Deck', status, onClick, vertical }: DeckZoneProps) {
  return (
    <div className={`${styles.zone} ${vertical ? styles.zoneVertical : ''}`}>
      <Deck count={count} label={label} status={status} onClick={onClick} compact />
    </div>
  );
}

function CardLine({ cards, selectedId, onSelect, vertical }: CardLineProps) {
  return (
    <div className={`${styles.zone} ${vertical ? styles.zoneVertical : ''}`}>
      <span className={styles.zoneLabel}>Cards ({cards.length})</span>
      <div className={`${styles.cardLine} ${vertical ? styles.cardLineVertical : ''}`}>
        {cards.map(card => (
          <PlayingCard
            key={card.id}
            suit={card.suit}
            rank={card.rank}
            selected={card.id === selectedId}
            compact={vertical}
            onClick={() => onSelect(card.id)}
          />
        ))}
        {cards.length === 0 && (
          <span className={styles.emptyHint}>—</span>
        )}
      </div>
    </div>
  );
}

function TrophyZone({ topCard, count = 0, isRandomized, vertical }: TrophyZoneProps) {
  // When isRandomized, we have no known card yet — show an empty deck.
  const effectiveCount = isRandomized ? 0 : count;
  const effectiveTopCard = isRandomized ? null : topCard;

  return (
    <div className={`${styles.zone} ${vertical ? styles.zoneVertical : ''}`}>
      <Deck
        count={effectiveCount}
        label="Trophy"
        topCard={effectiveTopCard ?? undefined}
        compact
      />
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

function DoomClockZone({ current, act, isPrologue = true }: DoomClockZoneProps) {
  // Visible once the Aces are done (prologue over), regardless of act
  if (act < 2 && isPrologue) return null;
  return (
    <div className={`${styles.zone} ${styles.zoneVertical}`}>
      <span className={styles.zoneLabel}>Countdown</span>
      <DoomClock current={current} />
    </div>
  );
}

export function GameBoard({ children, vertical = false }: GameBoardProps) {
  // In vertical mode, clone children and inject the `vertical` prop
  const enhancedChildren = vertical
    ? React.Children.map(children, child =>
        React.isValidElement(child) ? React.cloneElement(child as React.ReactElement<any>, { vertical: true }) : child
      )
    : children;

  return (
    <div className={`${styles.gameBoardRoot} ${vertical ? styles.gameBoardVertical : ''}`}>
      {enhancedChildren}
    </div>
  );
}

GameBoard.DeckZone = DeckZone;
GameBoard.CardLine = CardLine;
GameBoard.TrophyZone = TrophyZone;
GameBoard.PhaseInfo = PhaseInfo;
GameBoard.DoomClockZone = DoomClockZone;
