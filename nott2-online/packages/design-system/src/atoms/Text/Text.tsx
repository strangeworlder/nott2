/**
 * Text
 *
 * Philosophical:
 * The Text component is the voice of the game. It ensures that every word spoken by
 * the interface adheres to the typographic hierarchy and aesthetic rules of the world.
 * It prevents default-font leakage and enforces consistency in tone, whether it's a
 * shouting header or a whispered caption. This component is the single typographic
 * authority — all textual content must pass through it.
 *
 * Technical:
 * A polymorphic typography component. The rendered HTML tag is determined by the
 * `variant` prop (h1→<h1>, h2→<h2>, h3→<h3>, label→<div>, others→<p>) or overridden
 * via the `as` prop.
 *
 * Props:
 * - variant: Typographic style. Defaults to 'body'.
 * - as: Override the rendered HTML element.
 * - color: Text color token. Defaults to 'white'.
 * - glow: Apply red (or green for success) text shadow. Defaults to false.
 * - border: Optional decorative border ('left' = red left border, 'bottom' = subtle rule).
 * - align: Text alignment.
 * - leading: Line-height override.
 * - animation: CSS animation ('pulse').
 *
 * Slots (children):
 * - The text content. Also supports dangerouslySetInnerHTML for rich text.
 */

import React, { ElementType } from 'react';
import { clsx } from 'clsx';
import {
  textRecipe,
  glowRed,
  glowGreen,
  borderLeft,
  borderBottom,
  animatePulse,
} from './Text.css';

type TextVariant = 'hero' | 'h1' | 'h2' | 'h3' | 'lead' | 'body' | 'label' | 'caption' | 'quote' | 'micro';
type TextColor = 'white' | 'red' | 'muted' | 'success';

interface TextProps {
  variant?: TextVariant;
  as?: ElementType;
  color?: TextColor;
  glow?: boolean;
  border?: 'left' | 'bottom' | 'none';
  align?: 'left' | 'center' | 'right' | 'justify';
  leading?: 'none' | 'tight' | 'snug' | 'normal' | 'relaxed' | 'loose';
  animation?: 'pulse' | 'none';
  children?: React.ReactNode;
  dangerouslySetInnerHTML?: { __html: string };
  className?: string;
  id?: string;
}

const variantTagMap: Record<TextVariant, ElementType> = {
  hero: 'p',
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  lead: 'p',
  body: 'p',
  label: 'div',
  caption: 'p',
  quote: 'p',
  micro: 'p',
};

export function Text({
  variant = 'body',
  as,
  color = 'white',
  glow = false,
  border,
  align,
  leading,
  animation,
  children,
  dangerouslySetInnerHTML,
  className,
  id,
}: TextProps) {
  const Tag = as ?? variantTagMap[variant];

  const cn = clsx(
    textRecipe({ variant, color, align, leading }),
    glow && (color === 'success' ? glowGreen : glowRed),
    border === 'left' && borderLeft,
    border === 'bottom' && borderBottom,
    animation === 'pulse' && animatePulse,
    className,
  );

  return (
    <Tag
      id={id}
      className={cn}
      dangerouslySetInnerHTML={dangerouslySetInnerHTML}
    >
      {dangerouslySetInnerHTML ? undefined : children}
    </Tag>
  );
}
