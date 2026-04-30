/**
 * Deck
 *
 * Philosophical:
 * The deck is the beating heart of the table — a shrouded stack of fate.
 * Every card is a real PlayingCard, face-down, waiting. When the top card
 * is visible (Trophy Pile), it breaks the shroud — a known quantity atop
 * the unknown. The visual is identical either way: a stack of cards.
 *
 * Technical:
 * Renders a stack of PlayingCard components. All layers are face-down except
 * optionally the top card (when `topCard` is provided), which renders face-up.
 * This gives a consistent deck look whether the top is revealed or not.
 *
 * Props:
 * - count: Number of cards in the deck (required).
 * - label: Zone label displayed above the stack.
 * - status: Transient status overlay. 'shuffled' | 'empty' | null.
 * - compact: Smaller font/spacing variant. Defaults to false.
 * - topCard: When set, renders this card face-up as the top of the pile.
 * - onClick: Click handler — makes the stack interactive.
 * - id: HTML id attribute.
 */

import React from 'react';
import { PlayingCard } from '../PlayingCard/PlayingCard';
import type { Suit, Rank } from '../PlayingCard/PlayingCard';
import * as styles from './Deck.css';

export type DeckStatus = 'shuffled' | 'empty';

export interface TopCardInfo {
  suit?: Suit;
  rank?: Rank;
  joker?: boolean;
  jokerColor?: 'Red' | 'Black';
}

interface DeckProps {
  count: number;
  label?: string;
  status?: DeckStatus | null;
  compact?: boolean;
  /** When true, renders a pulsing amber/crimson glow around the deck to signal drawability */
  glow?: boolean;
  topCard?: TopCardInfo | null;
  onClick?: () => void;
  id?: string;
}

const MAX_LAYERS = 5;

export function Deck({
  count,
  label,
  status = null,
  compact = false,
  glow = false,
  topCard = null,
  onClick,
  id,
}: DeckProps) {
  const layers = Math.min(Math.max(count, 0), MAX_LAYERS);
  const isEmpty = count === 0;
  const hasTopCard = !isEmpty && topCard != null;

  const stackClass = [
    styles.deckStack,
    onClick ? styles.deckStackInteractive : '',
    glow ? styles.deckStackGlow : '',
  ].filter(Boolean).join(' ');

  const countClass = [
    styles.deckCount,
    compact ? styles.deckCountCompact : '',
  ].filter(Boolean).join(' ');

  const ariaLabel = label
    ? `${label}, ${count} card${count !== 1 ? 's' : ''}`
    : `${count} card${count !== 1 ? 's' : ''}`;

  return (
    <div id={id} className={styles.deckRoot}>
      {label && <span className={styles.deckLabel}>{label}</span>}

      <div
        className={stackClass}
        onClick={onClick}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick ? 0 : undefined}
        aria-label={ariaLabel}
        onKeyDown={onClick ? (e) => {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); }
        } : undefined}
      >
        {isEmpty ? (
          <div className={`${styles.deckEmpty} ${compact ? styles.deckEmptyCompact : ''}`}>—</div>
        ) : (
          <>
            {/* All layers are PlayingCards — face-down except optionally the top */}
            {Array.from({ length: layers }, (_, i) => {
              const isTop = i === layers - 1;
              return (
                <div
                  key={i}
                  style={{ position: 'absolute', top: `${i * -3}px`, left: `${i * 1}px` }}
                  aria-hidden="true"
                >
                  {isTop && hasTopCard ? (
                    <PlayingCard
                      suit={topCard!.suit}
                      rank={topCard!.rank}
                      joker={topCard!.joker}
                      jokerColor={topCard!.jokerColor}
                      compact
                    />
                  ) : (
                    <PlayingCard faceDown compact />
                  )}
                </div>
              );
            })}

            {/* Count overlay — only for face-down decks (not obscuring face-up top card) */}
            {!hasTopCard && <span className={countClass}>{count}</span>}
          </>
        )}

        {status === 'shuffled' && (
          <span className={`${styles.deckStatusBadge} ${styles.deckStatusShuffled}`} role="status" aria-label="Deck shuffled">
            Shuffled ↻
          </span>
        )}
        {status === 'empty' && (
          <span className={`${styles.deckStatusBadge} ${styles.deckStatusEmpty}`} role="status" aria-label="Deck empty">
            Empty
          </span>
        )}

        {!status && !isEmpty && (
          <span className={styles.deckStatusHover} aria-hidden="true">
            {count} card{count !== 1 ? 's' : ''}
          </span>
        )}
      </div>
    </div>
  );
}
