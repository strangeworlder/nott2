/**
 * Row
 *
 * Philosophical:
 * The Row is horizontal momentum — the side-by-side placement of choices, of
 * characters, of cards on a table. Where the Stack descends like a story, the
 * Row spreads like a crime scene, laying options out in parallel so the eye
 * can weigh them simultaneously.
 *
 * Technical:
 * A flex row container with configurable gap, wrap, justify, and align.
 *
 * Props:
 * - gap: Space between children. Defaults to 'sm' (8px).
 * - wrap: Whether to wrap children. Defaults to false.
 * - justify: Justification of children. Defaults to 'start'.
 * - align: Alignment of children. Defaults to 'center'.
 * - className: Optional extra CSS class.
 * - children: Row content.
 */

import React from 'react';
import { rowRecipe } from './Row.css';

type GapSize    = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type Justify    = 'start' | 'center' | 'end' | 'between';
type Align      = 'start' | 'center' | 'end' | 'stretch';

interface RowProps {
  gap?:     GapSize;
  wrap?:    boolean;
  justify?: Justify;
  align?:   Align;
  className?: string;
  children: React.ReactNode;
  id?: string;
}

export function Row({
  gap = 'sm',
  wrap = false,
  justify = 'start',
  align = 'center',
  className,
  children,
  id,
}: RowProps) {
  const cls = [rowRecipe({ gap, wrap, justify, align }), className].filter(Boolean).join(' ');
  return (
    <div id={id} className={cls}>
      {children}
    </div>
  );
}
