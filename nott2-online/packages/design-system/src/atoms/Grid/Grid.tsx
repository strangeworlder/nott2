/**
 * Grid
 *
 * Philosophical:
 * A rigid structure of confinement. Unlike the Row or Stack which flow and wrap
 * naturally, the Grid forces content into a predefined matrix. It is mathematical
 * and unyielding — perfect for arrays of choices, dice, or systematic data.
 *
 * Technical:
 * A CSS grid container that enforces equal-width columns.
 *
 * Props:
 * - columns: Number of columns (1–12). Defaults to 1.
 * - gap: Space between grid items. Defaults to 'sm'.
 * - className: Optional custom CSS class.
 * - children: The grid items.
 */

import React from 'react';
import { clsx } from 'clsx';
import { gridRecipe } from './Grid.css';

type Columns = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
type GapSize = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface GridProps {
  columns?: Columns;
  gap?: GapSize;
  className?: string;
  id?: string;
  children: React.ReactNode;
}

export function Grid({
  columns = 1,
  gap = 'sm',
  className,
  id,
  children,
}: GridProps) {
  return (
    <div
      id={id}
      className={clsx(gridRecipe({ columns, gap }), className)}
    >
      {children}
    </div>
  );
}
