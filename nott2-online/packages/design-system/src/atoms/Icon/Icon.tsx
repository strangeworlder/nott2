/**
 * Icon
 *
 * Philosophical:
 * Visual shorthand — each icon is a compact symbolic language for the game world.
 * Card suit icons (♠ ♥ ♦ ♣) are the game's fundamental symbols; utility icons
 * support the interface's functional language. All icons are inline SVG to allow
 * full color control via CSS currentColor.
 *
 * Technical:
 * Renders an inline SVG icon from a named library. Size is specified in pixels;
 * color is controlled via the Vanilla Extract color variant (default: inherit).
 *
 * Props:
 * - name: Icon identifier. Required.
 * - size: Width/height in pixels. Defaults to 24.
 * - color: Color variant token. Defaults to 'inherit'.
 */

import React from 'react';
import { iconRecipe } from './Icon.css';

type IconName =
  | 'spades'
  | 'hearts'
  | 'diamonds'
  | 'clubs'
  | 'clock'
  | 'users'
  | 'skull'
  | 'star'
  | 'check'
  | 'x'
  | 'chevron-right'
  | 'chevron-left'
  | 'chevron-down'
  | 'refresh';

type IconColor = 'white' | 'red' | 'muted' | 'success' | 'inherit';

interface IconProps {
  name: IconName;
  size?: number | string;
  color?: IconColor;
  id?: string;
}

const ICONS: Record<IconName, React.ReactElement> = {
  spades: (
    <path
      fill="currentColor"
      d="M12 2C8 7 4 9 4 13a4 4 0 0 0 7 2.6V17H9v2h6v-2h-2v-1.4A4 4 0 0 0 20 13c0-4-4-6-8-11z"
    />
  ),
  hearts: (
    <path
      fill="currentColor"
      d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
    />
  ),
  diamonds: (
    <path fill="currentColor" d="M12 2L2 12l10 10 10-10L12 2z" />
  ),
  clubs: (
    <path
      fill="currentColor"
      d="M12 2a4 4 0 0 0-3.1 6.54A4 4 0 1 0 12 14.07V17H9v2h6v-2h-3v-2.93A4 4 0 1 0 15.1 8.54 4 4 0 0 0 12 2z"
    />
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
      <polyline points="12 6 12 12 16 14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
    </>
  ),
  users: (
    <>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" fill="none" />
      <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" fill="none" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="currentColor" strokeWidth="2" fill="none" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="2" fill="none" />
    </>
  ),
  skull: (
    <>
      <circle cx="12" cy="10" r="7" stroke="currentColor" strokeWidth="2" fill="none" />
      <path d="M9 14v3h6v-3" stroke="currentColor" strokeWidth="2" fill="none" />
      <line x1="9" y1="11" x2="9" y2="11" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <line x1="15" y1="11" x2="15" y2="11" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </>
  ),
  star: (
    <polygon
      points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
      fill="currentColor"
    />
  ),
  check: (
    <polyline points="20 6 9 17 4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  ),
  x: (
    <>
      <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </>
  ),
  'chevron-right': (
    <polyline points="9 18 15 12 9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  ),
  'chevron-left': (
    <polyline points="15 18 9 12 15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  ),
  'chevron-down': (
    <polyline points="6 9 12 15 18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  ),
  refresh: (
    <>
      <polyline points="23 4 23 10 17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </>
  ),
};

export function Icon({ name, size = 24, color = 'inherit', id }: IconProps) {
  return (
    <svg
      id={id}
      className={iconRecipe({ color })}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      {ICONS[name]}
    </svg>
  );
}

export type { IconName };
