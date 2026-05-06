/**
 * SegmentedControl
 *
 * Philosophical:
 * A row of mutually exclusive options where exactly one is always selected.
 * Unlike a Toggle (binary on/off), a SegmentedControl presents a small set of
 * discrete choices — adjusting effort by −1/0/+1, choosing a mode, selecting a
 * tier. The active segment glows green (same language as Toggle "on"), while
 * inactive segments recede into muted gray. The player scans, chooses, commits.
 *
 * Technical:
 * A generic, type-safe selector for N options. Renders as a horizontal button
 * strip with one active segment. Each option defines a value, a display label,
 * and an optional disabled flag.
 *
 * Props:
 * - options: Array of { value, label, disabled? } defining each segment.
 * - value: The currently selected value (controlled).
 * - onChange: Callback fired with the new value when a segment is clicked.
 * - id: Optional HTML id attribute on the root element.
 *
 * Events:
 * - onChange(value: T) — fired when a non-disabled, non-selected segment is clicked.
 */

import React from 'react';
import { segmentedRoot, segmentRecipe } from './SegmentedControl.css';

export interface SegmentOption<T extends string | number> {
  value: T;
  label: React.ReactNode;
  disabled?: boolean;
}

interface SegmentedControlProps<T extends string | number> {
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  id?: string;
}

export function SegmentedControl<T extends string | number>({
  options,
  value,
  onChange,
  id,
}: SegmentedControlProps<T>) {
  return (
    <div id={id} className={segmentedRoot} role="radiogroup">
      {options.map((opt) => {
        const isSelected = opt.value === value;
        const isDisabled = opt.disabled === true;
        return (
          <button
            key={String(opt.value)}
            type="button"
            role="radio"
            aria-checked={isSelected}
            aria-disabled={isDisabled || undefined}
            disabled={isDisabled}
            className={segmentRecipe({
              selected: isSelected,
              disabled: isDisabled,
            })}
            onClick={() => {
              if (!isDisabled && !isSelected) onChange(opt.value);
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
