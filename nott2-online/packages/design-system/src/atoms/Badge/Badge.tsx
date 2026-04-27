/**
 * Badge
 *
 * Philosophical:
 * Badges are small, high-signal visual indicators used to categorize, label, or
 * highlight specific attributes of an item. They are designed to be scanned quickly,
 * providing immediate context without interrupting the flow of reading. In the game's
 * UI, they represent status effects, tags, or mechanical properties that need to stand
 * out from body text.
 *
 * Technical:
 * An inline-flex label component with 5 visual variants.
 *
 * Props:
 * - variant: Visual style. Defaults to 'default'.
 *
 * Slots (children):
 * - Short label text.
 */

import React from 'react';
import { badgeRecipe } from './Badge.css';

type BadgeVariant = 'default' | 'outline' | 'red' | 'success' | 'danger';

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
