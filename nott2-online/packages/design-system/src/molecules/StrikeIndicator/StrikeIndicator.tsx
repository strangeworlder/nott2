/**
 * StrikeIndicator
 *
 * Philosophical:
 * Three strikes means death. Each mark accumulates dread. The final skull
 * is not an error state — it is the inevitable conclusion the game has been
 * building toward. The animation on a new strike makes the moment land.
 *
 * Technical:
 * Renders 0–3 visual strike marks. Empty slots show ○ (hollow ring); filled
 * marks show ✕ in blood-red with a glow — shape, weight, and color all differ.
 * The third strike or `isDead` prop shows a skull overlay.
 * `animated` triggers a brief scale animation on mount.
 *
 * Props:
 * - strikes: Current strike count (0–3). Defaults to 0.
 * - isDead: Show death state (skull). Defaults to false.
 * - animated: Animate the last strike on mount. Defaults to false.
 */

import React from 'react';
import { indicatorRoot, strikeMark, strikeEmpty, skullMark } from './StrikeIndicator.css';

type Strikes = 0 | 1 | 2 | 3;

interface StrikeIndicatorProps {
  strikes?: Strikes;
  isDead?: boolean;
  animated?: boolean;
  id?: string;
}

export function StrikeIndicator({
  strikes = 0,
  isDead = false,
  animated = false,
  id,
}: StrikeIndicatorProps) {
  if (isDead || strikes >= 3) {
    return (
      <div id={id} className={indicatorRoot} aria-label="Character eliminated">
        <span className={skullMark} data-animated={animated}>☠</span>
      </div>
    );
  }

  return (
    <div id={id} className={indicatorRoot} aria-label={`${strikes} of 3 strikes`}>
      {Array.from({ length: 3 }, (_, i) => (
        <span
          key={i}
          className={i < strikes ? strikeMark : strikeEmpty}
          data-animated={animated && i === strikes - 1}
          aria-hidden="true"
        >
          {i < strikes ? '✕' : '○'}
        </span>
      ))}
    </div>
  );
}
