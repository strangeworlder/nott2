/**
 * Card (Container)
 *
 * Philosophical:
 * The Card container is the surface on which the game's content rests — a
 * diegetic piece of dark wood or aged paper, depending on the variant. It
 * creates depth and separation in the interface, grouping related mechanics
 * into a single visual unit.
 *
 * Technical:
 * A content grouping container with multiple visual variants. Supports
 * optional title header, interactive hover states, and noPadding mode.
 *
 * Props:
 * - variant: Visual style. Defaults to 'default'.
 * - title: Optional header string.
 * - interactive: Hover glow effect. Defaults to false.
 * - noPadding: Remove internal padding. Defaults to false.
 * - children: Card content.
 */

import React from 'react';
import { cardRecipe, cardTitle as cardTitleStyle } from './Card.css';

export type CardVariant =
  | 'default' | 'muted' | 'highlighted' | 'success'
  | 'failure' | 'instruction' | 'ghost';

interface CardProps {
  variant?: CardVariant;
  title?: string;
  interactive?: boolean;
  noPadding?: boolean;
  children: React.ReactNode;
  id?: string;
}

export function Card({
  variant = 'default',
  title,
  interactive = false,
  noPadding = false,
  children,
  id,
}: CardProps) {
  return (
    <div
      id={id}
      className={cardRecipe({ variant, interactive, noPadding })}
    >
      {title && <h3 className={cardTitleStyle}>{title}</h3>}
      {children}
    </div>
  );
}
