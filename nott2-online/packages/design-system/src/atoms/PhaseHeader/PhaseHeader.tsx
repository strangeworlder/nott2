/**
 * PhaseHeader
 *
 * Philosophical:
 * The title card before the action begins. Every operational screen in the game
 * has a name — "Scene Setup," "The Roll," "Fallout" — and that name is both
 * label and omen. The optional step indicator adds a sense of procedure and
 * progress, reminding players that there is a script, and they are following it.
 *
 * Technical:
 * A stacked title + subtitle + optional step indicator for use at the top
 * of operational phase screens. Distinct from PhaseDisplay, which is cinematic.
 *
 * Props:
 * - title: The phase name (required).
 * - subtitle: Contextual description of what to do now (optional).
 * - step: Optional { current, total } to show "Step X of Y" above the title.
 * - id: Optional id attribute.
 */

import React from 'react';
import { headerRoot, stepLabel, titleStyle, subtitleStyle } from './PhaseHeader.css';

interface PhaseHeaderProps {
  title: string;
  subtitle?: string;
  step?: { current: number; total: number };
  id?: string;
}

export function PhaseHeader({ title, subtitle, step, id }: PhaseHeaderProps) {
  return (
    <div id={id} className={headerRoot}>
      {step && (
        <div className={stepLabel} aria-label={`Step ${step.current} of ${step.total}`}>
          Step {step.current} of {step.total}
        </div>
      )}
      <h2 className={titleStyle}>{title}</h2>
      {subtitle && <p className={subtitleStyle}>{subtitle}</p>}
    </div>
  );
}
