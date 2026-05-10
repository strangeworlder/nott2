/**
 * EffortBand
 *
 * Philosophical:
 * The thermometer of desperation. Four readings — controlled, pushing it,
 * overexertion, breaking point — that tell the player how close they are to
 * losing control. Each level has its own color temperature, glow intensity,
 * and kinetic energy. This is the d4 made visible: a number translated into
 * consequence. The left-edge intensity bar is the wound — it widens and
 * breathes harder as the player pushes their luck further.
 *
 * Technical:
 * Displays the current effort level as a colored band with escalating
 * visual treatment — icon, label, optional description. Effort level maps
 * to game engine's getEffortLevel().
 *
 * Props:
 * - level: 'controlled' | 'pushing-it' | 'overexertion' | 'breaking-point' (required).
 * - active: Highlight as the current result. Intensifies glow and background. Defaults to false.
 * - showDescription: Show the rules description text. Defaults to true.
 * - id: Optional id attribute.
 */

import React from 'react';
import { bandRecipe, bandIcon, bandLabel, bandDesc, reducedMotion } from './EffortBand.css';
import { Icon } from '../../atoms/Icon/Icon';
import type { IconName } from '../../atoms/Icon/Icon';

export type EffortLevel = 'controlled' | 'pushing-it' | 'overexertion' | 'breaking-point';

const EFFORT_DATA: Record<EffortLevel, { icon: IconName; label: string; desc: string }> = {
  'controlled':     { icon: 'target',                label: 'Controlled',     desc: 'No extra cost.' },
  'pushing-it':     { icon: 'air',                   label: 'Pushing It',     desc: 'Minor cost — choose from 2–3 options.' },
  'overexertion':   { icon: 'local_fire_department', label: 'Overexertion',   desc: 'Sacrifice happens regardless.' },
  'breaking-point': { icon: 'dangerous',             label: 'Breaking Point', desc: 'Sacrifice + Twist. This earns a Strike.' },
};

interface EffortBandProps {
  level: EffortLevel;
  active?: boolean;
  showDescription?: boolean;
  id?: string;
}

export function EffortBand({ level, active = false, showDescription = true, id }: EffortBandProps) {
  const data = EFFORT_DATA[level];
  return (
    <div
      id={id}
      className={`${bandRecipe({ level, active })} ${reducedMotion}`}
      role="status"
      aria-label={`Effort: ${data.label}`}
    >
      <span className={bandIcon} aria-hidden="true">
        <Icon name={data.icon} size={20} />
      </span>
      <span className={bandLabel}>{data.label}</span>
      {showDescription && <span className={bandDesc}>{data.desc}</span>}
    </div>
  );
}
