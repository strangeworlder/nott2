/**
 * DiceResult
 *
 * Philosophical:
 * The autopsy report. After the dice have settled, this component presents the
 * clinical breakdown of what happened: a d10, a d4, and their sum. It is the
 * most-viewed UI state in the game. Its typography should be precise and
 * unambiguous — no drama here, just the truth of the numbers. Drama is the
 * ResultBanner's job. This is evidence.
 *
 * Technical:
 * Displays d10 + d4 = Total in a horizontal layout. Supports an optional
 * modifier on the d4 (from Aptitude), showing the modified value highlighted
 * and the original struck-through.
 *
 * Props:
 * - d10: The d10 result (0–9, required).
 * - d4: The d4 result (1–4, required).
 * - modifier: Optional { value: -1 | 1, label: string } for aptitude modification.
 * - originalD4: The pre-modification d4 value, shown struck-through when modifier is set.
 * - id: Optional id attribute.
 */

import { Text } from '../../atoms/Text/Text';
import {
  resultRoot, dieCell, dieCellTotal,
} from './DiceResult.css';

interface DiceResultProps {
  d10: number;
  d4: number;
  modifier?: { value: -1 | 1; label: string };
  originalD4?: number;
  id?: string;
}

export function DiceResult({ d10, d4, modifier, originalD4, id }: DiceResultProps) {
  const total = d10 + d4;
  const isModified = modifier !== undefined && originalD4 !== undefined;
  const d4LabelText = `d4${isModified ? ` (${modifier!.value > 0 ? '+' : ''}${modifier!.value} ${modifier!.label})` : ''}`;

  return (
    <div id={id} className={resultRoot} aria-label={`Roll result: d10=${d10}, d4=${d4}, total=${total}`}>
      {/* d10 */}
      <div className={dieCell}>
        <Text variant="label" color="muted">d10</Text>
        <Text variant="h3">{d10}</Text>
      </div>

      <Text variant="h3" color="muted" aria-hidden="true" style={{ alignSelf: 'center', gridRow: '1 / 4' }}>+</Text>

      {/* d4 (with optional modifier) */}
      <div className={dieCell}>
        <Text variant="label" color="muted">{d4LabelText}</Text>
        <Text variant="h3" color={isModified ? "red" : "white"}>
          {d4}
        </Text>
        {isModified && originalD4 !== undefined && (
          <Text variant="micro" color="muted" style={{ textDecoration: 'line-through' }} aria-label={`Original: ${originalD4}`}>
            {originalD4}
          </Text>
        )}
      </div>

      <Text variant="h3" color="muted" aria-hidden="true" style={{ alignSelf: 'center', gridRow: '1 / 4' }}>=</Text>

      {/* Total */}
      <div className={[dieCell, dieCellTotal].join(' ')}>
        <Text variant="label" color="muted">Total</Text>
        <Text variant="h2">{total}</Text>
      </div>
    </div>
  );
}
