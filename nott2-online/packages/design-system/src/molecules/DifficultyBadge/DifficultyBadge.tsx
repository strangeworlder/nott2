/**
 * DifficultyBadge
 *
 * Philosophical:
 * The omen before the roll. The difficulty number is a concrete forecast of
 * how bad things might get. Large numbers loom. Small ones breed false hope.
 * The breakdown text grounds it in mathematics, not mystery — but the number
 * itself should feel like a verdict already half-delivered.
 *
 * Technical:
 * Displays a difficulty value in bold display font alongside an optional
 * "how it's calculated" breakdown string.
 *
 * Props:
 * - value: The numeric difficulty (required).
 * - breakdown: Optional explanation string (e.g. "Trophy (5) + 3 = 8").
 * - id: Optional id attribute.
 */

import React from 'react';
import { badgeRoot, badgeNumber, badgeLabel, badgeBreakdown } from './DifficultyBadge.css';

interface DifficultyBadgeProps {
  value: number;
  breakdown?: string;
  id?: string;
}

export function DifficultyBadge({ value, breakdown, id }: DifficultyBadgeProps) {
  return (
    <div id={id} className={badgeRoot} aria-label={`Difficulty: ${value}`}>
      <div style={{ textAlign: 'center' }}>
        <div className={badgeNumber}>{value}</div>
        <div className={badgeLabel}>Difficulty</div>
      </div>
      {breakdown && (
        <div className={badgeBreakdown}>{breakdown}</div>
      )}
    </div>
  );
}
