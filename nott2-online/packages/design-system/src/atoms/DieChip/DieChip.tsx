/**
 * DieChip
 *
 * Philosophical:
 * The ghost of the die. After it has landed, what remains is this — a silent
 * silhouette holding a number. The d10 is a diamond (two pyramids joined at
 * the waist). The d4 is a single pyramid. The shape IS the identity — you
 * know which die you're looking at before you read the label. When a die has
 * been modified (aptitude, genre point), the chip glows amber and the original
 * value haunts it like a struck-through ghost beneath.
 *
 * Technical:
 * A shaped container (via CSS clip-path) that displays a die value inside
 * a geometric silhouette. Supports two die types (d10, d4) and an optional
 * "modified" state with a ghost original value.
 *
 * Props:
 * - die: 'd10' | 'd4' — determines the clip-path shape (diamond vs pyramid).
 * - value: The current die value (required).
 * - modified: Whether this value has been changed. Enables amber glow + ghost.
 * - originalValue: The pre-modification value, shown struck-through.
 * - label: Optional override for the die label (defaults to "D10" / "D4").
 * - id: Optional id attribute.
 */

import React from 'react';
import {
  chipWrapper, chipShape, chipValue, chipLabel, chipGhost,
} from './DieChip.css';

export interface DieChipProps {
  die: 'd10' | 'd4';
  value: number;
  modified?: boolean;
  originalValue?: number;
  label?: string;
  id?: string;
}

export function DieChip({
  die,
  value,
  modified = false,
  originalValue,
  label,
  id,
}: DieChipProps) {
  const displayLabel = label ?? die.toUpperCase();
  const showGhost = modified && originalValue !== undefined;

  return (
    <div
      id={id}
      className={chipWrapper({ modified })}
      aria-label={`${displayLabel}: ${value}${showGhost ? ` (was ${originalValue})` : ''}`}
    >
      <div className={chipShape({ die, modified })}>
        <span className={chipValue({ modified })}>{value}</span>
      </div>
      <span className={chipLabel}>{displayLabel}</span>
      <span
        className={chipGhost}
        style={showGhost ? undefined : { visibility: 'hidden' }}
        aria-label={showGhost ? `Original: ${originalValue}` : undefined}
        aria-hidden={!showGhost}
      >
        {showGhost ? originalValue : '\u00A0'}
      </span>
    </div>
  );
}
