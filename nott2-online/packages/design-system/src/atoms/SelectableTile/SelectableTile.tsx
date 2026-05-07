/**
 * SelectableTile
 *
 * Philosophical:
 * A discrete choice laid bare. Unlike a Toggle strip which feels like a settings
 * switch, a SelectableTile is tactile and independent. It is a die face on the
 * table, a card waiting to be flipped, a module waiting to be activated.
 * When selected, it glows with intent — danger (red), safety (green), or neutral.
 *
 * Technical:
 * A square button component. Designed to be used in arrays (e.g., inside a <Grid>)
 * for mutually exclusive selections.
 *
 * Props:
 * - selected: Boolean indicating active state.
 * - variant: The glow color when selected ('default' [green], 'danger' [red], 'neutral' [subtle red]).
 * - disabled: Standard HTML disabled state.
 * - onClick: Standard click handler.
 * - className: Optional custom CSS class.
 * - children: The label or icon inside the tile.
 */

import React from 'react';
import { clsx } from 'clsx';
import { tileRecipe } from './SelectableTile.css';

export interface SelectableTileProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
  variant?: 'default' | 'danger' | 'neutral';
}

export function SelectableTile({
  selected = false,
  variant = 'default',
  disabled,
  className,
  onClick,
  children,
  id,
  ...props
}: SelectableTileProps) {
  return (
    <button
      id={id}
      type="button"
      className={clsx(tileRecipe({ selected, variant }), className)}
      disabled={disabled}
      aria-pressed={selected}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}
