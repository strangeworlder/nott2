/**
 * Stack
 *
 * Philosophical:
 * The Stack is the spine of every phase screen — a vertical column of moments,
 * each one leading inexorably to the next. Like the scenes in a horror film,
 * the Stack gives rhythm: a beat here, a beat there, always pressing downward.
 * It is deliberately invisible, serving only to space and order.
 *
 * Technical:
 * A flex column container with configurable gap between children.
 *
 * Props:
 * - gap: Space between children. Defaults to 'md' (16px).
 * - className: Optional extra CSS class.
 * - children: Stack content.
 */

import React from 'react';
import { stackRecipe } from './Stack.css';

type GapSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface StackProps {
  gap?: GapSize;
  className?: string;
  children: React.ReactNode;
  id?: string;
}

export function Stack({ gap = 'md', className, children, id }: StackProps) {
  const cls = [stackRecipe({ gap }), className].filter(Boolean).join(' ');
  return (
    <div id={id} className={cls}>
      {children}
    </div>
  );
}
