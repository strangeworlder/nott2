/**
 * WeaknessTracker
 *
 * Philosophical:
 * The countdown to hope. Four suits, four weaknesses, four steps toward the
 * Killer's downfall. Each pip starts dark and found ones glow green — a slow
 * accumulation of hard-won knowledge. This is the game's progress bar, and
 * it should feel like a map being filled in, one bloody room at a time.
 *
 * Technical:
 * Renders 4 suit pips indicating which weaknesses have been discovered.
 * Found suits glow green; unfound are muted. Order is always Spades, Hearts,
 * Clubs, Diamonds. Uses Icon component for consistent suit rendering.
 *
 * Props:
 * - found: Set<string> of suit IDs whose weaknesses have been discovered.
 * - id: Optional id attribute.
 */

import React from 'react';
import { trackerRoot, pipBase, pipFound } from './WeaknessTracker.css';
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
  return (
    <div
      id={id}
      className={trackerRoot}
      role="status"
      aria-label={`Weaknesses found: ${found.size} of 4`}
    >
      {SUITS.map(s => (
        <span
          key={s.id}
          className={[pipBase, found.has(s.id) ? pipFound : ''].filter(Boolean).join(' ')}
          aria-label={`${s.id}: ${found.has(s.id) ? 'weakness found' : 'not found'}`}
        >
          <Icon name={s.icon} size={16} /> {s.id}
        </span>
      ))}
    </div>
  );
}
