/**
 * DiceResult — "The Verdict"
 *
 * Philosophical:
 * The verdict after the dice have spoken. Where the ResultBanner is the jump
 * scare and the DifficultyBadge is the omen, this is the courtroom reading —
 * one massive amber number flanked by two die-shaped silhouettes. The total
 * radiates warmth; it IS the component. The d10 diamond and d4 pyramid are
 * quiet evidence tokens orbiting the central truth. No plus signs, no equals
 * signs — the spatial relationship implies the math. You see the number
 * before you read anything else. That's the point.
 *
 * Technical:
 * Displays a central total number flanked by DieChip atoms (d10 left, d4 right).
 * Supports modification on both dice — d4 via Aptitude, d10 via Genre Point Reroll.
 * When modified, the relevant DieChip glows amber and shows the original value
 * struck-through beneath.
 *
 * Props:
 * - d10: The d10 result (0–9, required).
 * - d4: The d4 result (1–4, required).
 * - modifier: Optional { value: -1 | 1, label: string } for d4 aptitude modification.
 * - originalD4: The pre-modification d4 value, shown as ghost on the d4 chip.
 * - d10Modified: Whether the d10 was changed (e.g. Genre Point Reroll).
 * - originalD10: The pre-reroll d10 value, shown as ghost on the d10 chip.
 * - id: Optional id attribute.
 */

import React from 'react';
import { DieChip } from '../../atoms/DieChip/DieChip';
import { resultRoot, totalNumber, divider } from './DiceResult.css';

export interface DiceResultProps {
  d10: number;
  d4: number;
  modifier?: { value: -1 | 1; label: string };
  originalD4?: number;
  d10Modified?: boolean;
  originalD10?: number;
  id?: string;
}

export function DiceResult({
  d10,
  d4,
  modifier,
  originalD4,
  d10Modified = false,
  originalD10,
  id,
}: DiceResultProps) {
  const total = d10 + d4;
  const isD4Modified = modifier !== undefined && originalD4 !== undefined;

  return (
    <div
      id={id}
      className={resultRoot}
      role="status"
      aria-label={`Roll result: d10=${d10}, d4=${d4}, total=${total}`}
    >
      {/* Left — d10 diamond */}
      <DieChip
        die="d10"
        value={d10}
        modified={d10Modified}
        originalValue={originalD10}
      />

      <div className={divider} aria-hidden="true" />

      {/* Center — The Verdict */}
      <span className={totalNumber}>{total}</span>

      <div className={divider} aria-hidden="true" />

      {/* Right — d4 pyramid */}
      <DieChip
        die="d4"
        value={d4}
        modified={isD4Modified}
        originalValue={originalD4}
        label={isD4Modified ? `D4 ${modifier!.value > 0 ? '+' : ''}${modifier!.value}` : undefined}
      />
    </div>
  );
}
