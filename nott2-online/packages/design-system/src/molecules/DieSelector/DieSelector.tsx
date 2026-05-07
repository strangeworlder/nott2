/**
 * DieSelector
 *
 * Philosophical:
 * Rolling dice is the moment the horror has been building toward — the
 * determination of fate. This component makes die selection tactile and
 * deliberate. Clicking a face is a choice, not a roll.
 *
 * Technical:
 * A click grid of die faces for d4 (1–4) or d10 (0–9). The selected
 * value is highlighted. Red color variant for the main die (d10),
 * white variant for the effort die (d4).
 *
 * Props:
 * - sides: Die type (4 | 10). Determines available values.
 * - value: Currently selected value (null = none selected).
 * - onChange: Called when a face is clicked.
 * - label: Optional header label.
 * - color: Visual color theme ('white' | 'red'). Defaults to 'white'.
 */

import React from 'react';
import { Grid } from '../../atoms/Grid/Grid';
import { SelectableTile } from '../../atoms/SelectableTile/SelectableTile';
import { Text } from '../../atoms/Text/Text';
import { dieSelectorRoot } from './DieSelector.css';

interface DieSelectorProps {
  sides: 4 | 10;
  value: number | null;
  onChange: (val: number) => void;
  label?: string;
  color?: 'white' | 'red';
  id?: string;
}

export function DieSelector({
  sides,
  value,
  onChange,
  label,
  color = 'white',
  id,
}: DieSelectorProps) {
  const faces = Array.from({ length: sides }, (_, i) => sides === 10 ? i : i + 1);

  return (
    <div id={id} className={dieSelectorRoot}>
      {label && <Text variant="label">{label}</Text>}
      <Grid columns={sides === 10 ? 5 : 4} gap="xs">
        {faces.map(face => (
          <SelectableTile
            key={face}
            selected={face === value}
            variant={color === 'red' ? 'danger' : 'neutral'}
            onClick={() => onChange(face)}
            aria-label={`${face}`}
            style={{ width: '42px', height: '42px' }}
          >
            {face}
          </SelectableTile>
        ))}
      </Grid>
    </div>
  );
}
