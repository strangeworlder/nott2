/**
 * DifficultyBadge
 *
 * Philosophical:
 * The omen before the roll. The difficulty number is a concrete forecast of
 * how bad things might get. Large numbers loom. Small ones breed false hope.
 * This component renders as "The Scar" — a cinematic horizontal strip that
 * cuts across the page. The number bleeds red on the left. A vertical wound
 * divides it from the clinical label and breakdown on the right. The bottom
 * edge pulses with a faint glow, like a threat that hasn't fully landed yet.
 *
 * Technical:
 * Displays a difficulty value in bold display font on the left, separated
 * from an optional label/breakdown block by a vertical divider. Full-width
 * strip with a gradient background and animated bottom-edge red glow.
 *
 * Props:
 * - value:     The numeric difficulty (required).
 * - breakdown: Optional explanation string (e.g. "Trophy (5) + 3 = 8").
 * - id:        Optional id attribute.
 */

import React from 'react';
import {
  badgeRoot, badgeNumber, badgeDivider,
  badgeMeta, badgeLabel, badgeBreakdown,
} from './DifficultyBadge.css';

interface DifficultyBadgeProps {
  value: number;
  breakdown?: string;
  id?: string;
}

export function DifficultyBadge({ value, breakdown, id }: DifficultyBadgeProps) {
  return (
    <div id={id} className={badgeRoot} aria-label={`Difficulty: ${value}`}>
      <div className={badgeNumber}>{value}</div>
      <div className={badgeDivider} aria-hidden="true" />
      <div className={badgeMeta}>
        <div className={badgeLabel}>Difficulty</div>
        {breakdown && (
          <div className={badgeBreakdown}>{breakdown}</div>
        )}
      </div>
    </div>
  );
}
