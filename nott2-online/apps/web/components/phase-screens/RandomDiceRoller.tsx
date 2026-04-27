/**
 * RandomDiceRoller — 3-D physics dice roll for the Resolution step.
 *
 * Philosophical: The dice ARE the ritual. In "Night of the Thirteenth 2" the
 * d13 roll (d10 0-9 + d4 1-4) is the moment the story pivots — fate rendered
 * in tumbling polyhedra. This component lets the player physically throw their
 * dice on-screen instead of clicking a manual selector, bridging the tactile
 * magic of tabletop play with the digital companion.
 *
 * Technical: Wraps the `useDiceRoll` hook from `react-ttrpg-dice`. Rolls two
 * separate labeled groups — "d10" and "d4" — so we can extract each die's
 * individual value. The library returns d10 as 1-10; we subtract 1 to match
 * the game's 0-9 range. On completion it fires the `onResult` callback with
 * the corrected (d10, d4) pair.
 *
 * Props:
 *   onResult  (d10: D10Result, d4: D4Result) => void
 *             Called once the dice settle with the final values.
 *   disabled  boolean  — prevents rolling while a result is already locked in.
 *
 * Events:  none (uses callback prop)
 * Slots:   none
 */

'use client';

import { useDiceRoll } from 'react-ttrpg-dice';
import type { D10Result, D4Result } from '@nott2/game-engine';

interface Props {
  onResult: (d10: D10Result, d4: D4Result) => void;
  disabled?: boolean;
}

export default function RandomDiceRoller({ onResult, disabled = false }: Props) {
  const { rollGroups, isRolling, DiceOverlayPortal } = useDiceRoll({
    onRollComplete: (result) => {
      const rawD10 = result.rolls.find((r) => r.group === 'd10')?.value ?? 0;
      const rawD4  = result.rolls.find((r) => r.group === 'd4')?.value  ?? 1;

      // Library returns 10 for the "0" face (standard d10 UX: the "0" pip = 10).
      // Game uses 0-9 — remap 10 → 0 via modulo; all other values stay the same.
      const d10 = (rawD10 % 10) as D10Result;
      const d4  = rawD4  as D4Result;

      onResult(d10, d4);
    },
  });

  const handleRoll = () => {
    /** Shared palette — dark horror theme matching the demo UI */
    const slasherTheme = {
      dieColor:    '#1c1c1c', // near-black dark grey body
      numberColor: '#dc2626', // striking red (--color-accent-bright)
      accentColor: '#8a0000', // deep crimson edges / accent
      roughness:   0.35,
      metalness:   0.15,
    };

    rollGroups([
      { notation: '1d10', config: slasherTheme, label: 'd10' },
      { notation: '1d4',  config: slasherTheme, label: 'd4'  },
    ]);
  };

  return (
    <>
      <button
        id="random-dice-roller-btn"
        className="random-dice-btn"
        onClick={handleRoll}
        disabled={disabled || isRolling}
        aria-label={isRolling ? 'Dice are rolling…' : 'Roll dice randomly'}
      >
        <span className="random-dice-btn__icon" aria-hidden="true">🎲</span>
        <span className="random-dice-btn__label">
          {isRolling ? 'Rolling…' : 'Roll Randomly'}
        </span>
      </button>

      {/* Full-page 3-D physics overlay rendered via portal */}
      {DiceOverlayPortal}
    </>
  );
}
