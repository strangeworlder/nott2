/**
 * PlayingCard
 *
 * Philosophical:
 * The playing card is the central totem of Night of the Thirteenth — every
 * drawn card is a moment of dread. This component renders a diegetic card
 * face, making the digital table feel like a physical one. Suit colors,
 * pip layouts, and the blood-red selection ring all reinforce the horror
 * tabletop aesthetic.
 *
 * Technical:
 * Renders a standard poker-sized playing card with correct pip layout for
 * ranks 2–10, face cards (face-down silhouette), and Jokers. The `faceDown`
 * prop hides the face and shows the card back pattern. The `selected` prop
 * applies a glowing red selection ring. Uses Icon component for suit symbols.
 *
 * Props:
 * - suit: Card suit ('Spades' | 'Hearts' | 'Clubs' | 'Diamonds')
 * - rank: Card rank (1–13)
 * - selected: Red glow selection ring. Defaults to false.
 * - faceDown: Show card back. Defaults to false.
 * - compact: Smaller variant for tight spaces. Defaults to false.
 * - joker: If true, renders as a Joker card (ignores suit/rank).
 * - jokerColor: 'Red' | 'Black' for Joker coloring.
 * - onClick: Click handler.
 */

import React from 'react';
import * as styles from './PlayingCard.css';
import { Icon, suitToIconName } from '../../atoms/Icon/Icon';

export type Suit = 'Spades' | 'Hearts' | 'Clubs' | 'Diamonds';
export type Rank = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13;

const RANK_LABEL: Record<number, string> = {
  1: 'A', 11: 'J', 12: 'Q', 13: 'K',
};

function getRankLabel(rank: Rank): string {
  return RANK_LABEL[rank] ?? String(rank);
}

function isRed(suit: Suit): boolean {
  return suit === 'Hearts' || suit === 'Diamonds';
}

interface PlayingCardProps {
  suit?: Suit;
  rank?: Rank;
  selected?: boolean;
  faceDown?: boolean;
  compact?: boolean;
  /** Micro size (28×40px). Renders simplified "A" + suit icon layout. */
  micro?: boolean;
  joker?: boolean;
  jokerColor?: 'Red' | 'Black';
  onClick?: () => void;
}

export function PlayingCard({
  suit = 'Spades',
  rank = 1,
  selected = false,
  faceDown = false,
  compact = false,
  micro = false,
  joker = false,
  jokerColor = 'Black',
  onClick,
}: PlayingCardProps) {
  const cardClass = [
    styles.card,
    micro ? styles.cardMicro : compact ? styles.cardCompact : '',
    selected ? styles.cardSelected : '',
    onClick ? styles.cardClickable : '',
  ].filter(Boolean).join(' ');

  if (faceDown) {
    return (
      <div className={cardClass} onClick={onClick} role={onClick ? 'button' : undefined}>
        <div className={styles.cardBack} />
      </div>
    );
  }

  if (joker) {
    const isRedJoker = jokerColor === 'Red';
    return (
      <div className={cardClass} onClick={onClick} role={onClick ? 'button' : undefined}>
        <div className={`${styles.corner} ${styles.cornerTL}`}>
          <span className={isRedJoker ? styles.rankRed : styles.rankBlack}>
            <Icon name="star" size={14} />
          </span>
        </div>
        <div className={styles.suitCenter}>
          <span className={`${styles.jokerSymbol} ${isRedJoker ? styles.rankRed : styles.rankBlack}`}>
            JOKER
          </span>
        </div>
        <div className={`${styles.corner} ${styles.cornerBR}`}>
          <span className={isRedJoker ? styles.rankRed : styles.rankBlack}>
            <Icon name="star" size={14} />
          </span>
        </div>
      </div>
    );
  }

  const red = isRed(suit);
  const rankLabel = getRankLabel(rank);
  const suitIcon = suitToIconName(suit);
  const rankClass = red ? styles.rankRed : styles.rankBlack;

  // Micro: simplified "A" + suit icon layout (for Ace turn order tokens)
  if (micro) {
    return (
      <div className={cardClass} onClick={onClick} role={onClick ? 'button' : undefined}>
        <div className={styles.microLayout}>
          <span className={`${styles.microRank} ${rankClass}`}>{rankLabel}</span>
          <span className={rankClass}>
            <Icon name={suitIcon} size={10} />
          </span>
        </div>
      </div>
    );
  }

  const centerSize = compact ? 20 : 32;
  const cornerSize = compact ? 8 : 12;

  return (
    <div className={cardClass} onClick={onClick} role={onClick ? 'button' : undefined}>
      {/* Top-left corner */}
      <div className={`${styles.corner} ${styles.cornerTL}`}>
        <span className={`${styles.rankLabel} ${rankClass}`}>{rankLabel}</span>
        <span className={`${styles.suitLabel} ${rankClass}`}>
          <Icon name={suitIcon} size={cornerSize} />
        </span>
      </div>

      {/* Center suit */}
      <div className={styles.suitCenter}>
        <span className={`${styles.suitLarge} ${rankClass}`}>
          <Icon name={suitIcon} size={centerSize} />
        </span>
      </div>

      {/* Bottom-right corner (rotated 180°) */}
      <div className={`${styles.corner} ${styles.cornerBR}`}>
        <span className={`${styles.rankLabel} ${rankClass}`}>{rankLabel}</span>
        <span className={`${styles.suitLabel} ${rankClass}`}>
          <Icon name={suitIcon} size={cornerSize} />
        </span>
      </div>
    </div>
  );
}
