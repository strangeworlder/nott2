/**
 * Toggle
 *
 * Philosophical:
 * A compact switch for binary states. In the context of a horror TTRPG, toggling a
 * setting is a decisive act — enabling a rule module, turning on a mode, committing
 * to an option. The button variant communicates this weight; the switch variant offers
 * a lighter, settings-panel feel. Green denotes active/safe; muted gray denotes inactive.
 *
 * Technical:
 * Two visual modes:
 * - 'button': A text button that shows the current label (On/Off or custom).
 * - 'switch': A track+thumb slider with an adjacent label.
 *
 * Props:
 * - value: Current boolean state.
 * - onChange: Callback for state changes.
 * - labelOn: Label text when active. Defaults to 'On'.
 * - labelOff: Label text when inactive. Defaults to 'Off'.
 * - variant: Visual mode. Defaults to 'button'.
 *
 * Events:
 * - onChange(newValue: boolean)
 */

import React from 'react';
import { clsx } from 'clsx';
import {
  toggleButtonStyle,
  toggleButtonOn,
  toggleButtonOff,
  switchWrapper,
  switchTrack,
  switchTrackOn,
  switchTrackOff,
  switchThumb,
  switchThumbOn,
  switchThumbOff,
  switchLabel,
  switchLabelOn,
  switchLabelOff,
} from './Toggle.css';

interface ToggleProps {
  value: boolean;
  onChange: (value: boolean) => void;
  labelOn?: string;
  labelOff?: string;
  variant?: 'button' | 'switch';
  id?: string;
}

export function Toggle({
  value,
  onChange,
  labelOn = 'On',
  labelOff = 'Off',
  variant = 'button',
  id,
}: ToggleProps) {
  const handleToggle = () => onChange(!value);

  if (variant === 'switch') {
    return (
      <div
        id={id}
        className={switchWrapper}
        onClick={handleToggle}
        role="switch"
        aria-checked={value}
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') handleToggle(); }}
      >
        <div className={clsx(switchTrack, value ? switchTrackOn : switchTrackOff)}>
          <div className={clsx(switchThumb, value ? switchThumbOn : switchThumbOff)} />
        </div>
        <span className={clsx(switchLabel, value ? switchLabelOn : switchLabelOff)}>
          {value ? labelOn : labelOff}
        </span>
      </div>
    );
  }

  return (
    <button
      id={id}
      type="button"
      className={clsx(toggleButtonStyle, value ? toggleButtonOn : toggleButtonOff)}
      onClick={handleToggle}
      aria-pressed={value}
    >
      {value ? labelOn : labelOff}
    </button>
  );
}
