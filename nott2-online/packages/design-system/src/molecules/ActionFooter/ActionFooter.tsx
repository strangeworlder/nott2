/**
 * ActionFooter
 *
 * Philosophical:
 * The ActionFooter is the threshold — the moment before commitment. Its
 * primary button anchors the bottom of a phase screen, always visible,
 * always beckoning. When disabled, it withholds consequence until the
 * player is ready.
 *
 * Technical:
 * A sticky-to-bottom footer with a single primary action button.
 * Delegates variant and disabled state to Button. Includes optional
 * secondary hint text.
 *
 * Props:
 * - label: Button text.
 * - disabled: Disabled state. Defaults to false.
 * - variant: Button variant. Defaults to 'primary'.
 * - hint: Optional explanatory text shown above button.
 * - onClick: Click handler.
 */

import React from 'react';
import { Button } from '../../atoms/Button/Button';
import { footer, hintText } from './ActionFooter.css';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

interface ActionFooterProps {
  label: string;
  disabled?: boolean;
  variant?: ButtonVariant;
  hint?: string;
  onClick?: () => void;
  id?: string;
}

export function ActionFooter({
  label,
  disabled = false,
  variant = 'primary',
  hint,
  onClick,
  id,
}: ActionFooterProps) {
  return (
    <div className={footer} id={id}>
      {hint && <p className={hintText}>{hint}</p>}
      <Button variant={variant} disabled={disabled} onClick={onClick} block size="lg">
        {label}
      </Button>
    </div>
  );
}
