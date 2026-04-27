/**
 * Button
 *
 * Philosophical:
 * The Button is the primary agent of change in the interface. It represents a potential
 * action the user can take. The design communicates consequence: primary buttons are
 * blood-red calls to action, secondary buttons offer careful alternatives, ghost buttons
 * recede into the background, and debug buttons break the fourth wall.
 *
 * Technical:
 * A styled button component built on Vanilla Extract recipes. Supports 4 visual variants,
 * 5 sizes, and full/block width mode.
 *
 * Props:
 * - variant: Visual style. Defaults to 'primary'.
 * - size: Size scale. Defaults to 'md'.
 * - disabled: Disables interaction. Defaults to false.
 * - block: Full-width mode. Defaults to false.
 * - onClick: Click handler.
 * - type: HTML button type. Defaults to 'button'.
 *
 * Slots (children):
 * - Button label or icon content.
 */

import React from 'react';
import { buttonRecipe } from './Button.css';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'debug';
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  block?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  id?: string;
}

export function Button({
  variant = 'primary',
  size = 'md',
  block = false,
  disabled = false,
  children,
  onClick,
  type = 'button',
  id,
}: ButtonProps) {
  return (
    <button
      id={id}
      type={type}
      className={buttonRecipe({ variant, size, block })}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
