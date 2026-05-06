/**
 * Badge
 *
 * Philosophical:
 * A badge is a stamp, a tag, a classification mark. It tells you what something
 * *is* rather than what it *says*. "Act II" is a badge — it classifies the current
 * moment. "Host" is a badge — it marks a player's role. "3 GP" is a badge — it
 * stamps a resource count onto a character card. Badges are scanned, not read.
 *
 * Technical:
 * An inline-flex label component with 5 visual variants.
 *
 * Props:
 * - variant: Visual style. Defaults to 'default'.
 *
 * Slots (children):
 * - Short label text (1–3 words).
 */

import React from 'react';
import { badgeRecipe } from './Badge.css';

type BadgeVariant = 'default' | 'outline' | 'red' | 'success' | 'warning';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  id?: string;
}

export function Badge({ variant = 'default', children, id }: BadgeProps) {
  return (
    <span id={id} className={badgeRecipe({ variant })}>
      {children}
    </span>
  );
}
