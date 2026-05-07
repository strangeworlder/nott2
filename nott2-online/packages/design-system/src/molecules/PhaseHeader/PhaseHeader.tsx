/**
 * PhaseHeader (Molecule)
 *
 * Philosophical:
 * The title card before the action begins. Every operational screen in the
 * game has a name — "Scene Setup," "The Roll," "Fallout" — and that name
 * is both label and omen. The optional step indicator adds a sense of
 * procedure and progress, reminding players that there is a script, and
 * they are following it.
 *
 * PhaseHeader is the threshold between "you're about to do something" and
 * "do it." The Separator beneath it is the breath before the action. It is
 * deliberately compact and structural — the cinematic counterpart lives in
 * PhaseDisplay.
 *
 * Technical:
 * A molecule that composes three atoms: Text (for step label, title, and
 * subtitle) and Separator (the visual divider below the header block).
 * Used exclusively at the top of PhasePanel screens.
 *
 * Props:
 * - title: The phase name (required).
 * - subtitle: Contextual description of what to do now (optional).
 * - step: Optional { current, total } to show "Step X of Y" above the title.
 * - id: Optional id attribute.
 *
 * Events: None.
 * Slots: None — content is prop-driven.
 */

import React from 'react';
import { Text } from '../../atoms/Text/Text';
import { Separator } from '../../atoms/Separator/Separator';
import { headerRoot, stepLabel } from './PhaseHeader.css';

interface PhaseHeaderProps {
  title: string;
  subtitle?: string;
  step?: { current: number; total: number };
  id?: string;
}

export function PhaseHeader({ title, subtitle, step, id }: PhaseHeaderProps) {
  return (
    <div id={id}>
      <div className={headerRoot}>
        {step && (
          <span className={stepLabel} aria-label={`Step ${step.current} of ${step.total}`}>
            Step {step.current} of {step.total}
          </span>
        )}
        <Text variant="h3">{title}</Text>
        {subtitle && <Text variant="lead" color="muted">{subtitle}</Text>}
      </div>
      <Separator />
    </div>
  );
}
