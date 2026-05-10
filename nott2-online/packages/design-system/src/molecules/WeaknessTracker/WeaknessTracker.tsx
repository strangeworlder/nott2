/**
 * WeaknessTracker
 *
 * Philosophical:
 * The evidence board. Four slots — Spades, Hearts, Clubs, Diamonds — each
 * representing a weakness the survivors are hunting. Unfound slots sit dark
 * and dormant with a faint red bleed at the edge: the unknown is dangerous.
 * Each discovery flips a slot to green — the temperature of relief — and a
 * breathing pulse confirms that knowledge has been won. When all four are
 * revealed, the whole board glows: the Killer's armour has been mapped.
 *
 * Technical:
 * Renders a 4-column CSS Grid of suit pips. Found suits glow green with a
 * breathing left-edge bleed; unfound suits are muted with a dormant red
 * bleed. When all 4 are found, the root container receives a green glow.
 *
 * Props:
 * - found: Set<string> of suit IDs whose weaknesses have been discovered.
 * - id: Optional id attribute.
 */

import React from 'react';
import {
  trackerRoot,
  allFoundGlow,
  pipSlot,
  pipFound,
  pipIcon,
  pipIconFound,
  pipLabel,
  pipLabelFound,
  reducedMotion,
} from './WeaknessTracker.css';
import { Icon } from '../../atoms/Icon/Icon';
import type { IconName } from '../../atoms/Icon/Icon';

const SUITS: { id: string; icon: IconName }[] = [
  { id: 'Spades',   icon: 'spades' },
  { id: 'Hearts',   icon: 'hearts' },
  { id: 'Clubs',    icon: 'clubs' },
  { id: 'Diamonds', icon: 'diamonds' },
];

interface WeaknessTrackerProps {
  found: Set<string>;
  id?: string;
}

export function WeaknessTracker({ found, id }: WeaknessTrackerProps) {
  const isAllFound = found.size === 4;

  return (
    <div
      id={id}
      className={[
        trackerRoot,
        isAllFound ? allFoundGlow : '',
        reducedMotion,
      ].filter(Boolean).join(' ')}
      role="status"
      aria-label={`Weaknesses found: ${found.size} of 4`}
    >
      {SUITS.map(s => {
        const isFound = found.has(s.id);
        return (
          <div
            key={s.id}
            className={[pipSlot, isFound ? pipFound : ''].filter(Boolean).join(' ')}
            aria-label={`${s.id}: ${isFound ? 'weakness found' : 'not found'}`}
          >
            <span
              className={[pipIcon, isFound ? pipIconFound : ''].filter(Boolean).join(' ')}
              aria-hidden="true"
            >
              <Icon name={s.icon} size={20} />
            </span>
            <span
              className={[pipLabel, isFound ? pipLabelFound : ''].filter(Boolean).join(' ')}
            >
              {s.id}
            </span>
          </div>
        );
      })}
    </div>
  );
}
