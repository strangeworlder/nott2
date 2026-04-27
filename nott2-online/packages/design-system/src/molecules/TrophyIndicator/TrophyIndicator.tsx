/**
 * TrophyIndicator
 *
 * Philosophical:
 * The power level of evil. The trophy top card sets the baseline for every
 * Face Card encounter — it is the Killer's current strength. This indicator
 * should feel like a status effect on the monster, amber-toned and ominous,
 * always present, always climbing.
 *
 * Technical:
 * A compact display of the current trophy top card: suit icon, rank label,
 * and numeric rank. Uses Icon component for both the trophy symbol and suit pip.
 *
 * Props:
 * - suit: Card suit string ('Spades' | 'Hearts' | 'Clubs' | 'Diamonds').
 * - rank: Numeric rank (1–13).
 * - id: Optional id attribute.
 */

import React from 'react';
import { trophyRoot, trophyLabel, trophyCard, trophyRank } from './TrophyIndicator.css';
import { Icon, suitToIconName } from '../../atoms/Icon/Icon';

const RANK_LABELS: Record<number, string> = { 1: 'A', 11: 'J', 12: 'Q', 13: 'K' };
const getRankLabel = (r: number) => RANK_LABELS[r] ?? String(r);

interface TrophyIndicatorProps {
  suit: string;
  rank: number;
  id?: string;
}

export function TrophyIndicator({ suit, rank, id }: TrophyIndicatorProps) {
  return (
    <div
      id={id}
      className={trophyRoot}
      role="status"
      aria-label={`Trophy top: ${getRankLabel(rank)} of ${suit}, rank ${rank}`}
    >
      <span className={trophyLabel}>
        <Icon name="emoji_events" size={16} /> Trophy
      </span>
      <span className={trophyCard} aria-hidden="true">
        {getRankLabel(rank)}{'\u2009'}<Icon name={suitToIconName(suit)} size={16} />
      </span>
      <span className={trophyRank}>Rank {rank}</span>
    </div>
  );
}
