/**
 * Icon
 *
 * Philosophical:
 * Visual shorthand — each icon is a compact symbolic language for the game world.
 * Card suit icons (spades, hearts, diamonds, clubs) are the game's fundamental
 * symbols rendered as bespoke inline SVGs — these are candidates for future
 * custom icon commissions. All other icons use Google Material Symbols Rounded,
 * a professional variable icon font that brings visual consistency and polish.
 *
 * Technical:
 * Dual-mode rendering:
 * - **Custom SVG icons** (card suits): rendered as inline <svg> for full path
 *   control and future replacement with custom artwork.
 * - **Material Symbol icons** (everything else): rendered as a <span> with the
 *   `material-symbols-rounded` font class. Size is controlled via `font-size`;
 *   color via the Vanilla Extract color recipe.
 *
 * The component inspects the `name` prop — if it matches a custom SVG key,
 * it renders inline SVG; otherwise it renders a Material Symbol font glyph.
 *
 * Props:
 * - name: Icon identifier (CustomIconName | MaterialIconName). Required.
 * - size: Width/height in pixels. Defaults to 24.
 * - color: Color variant token. Defaults to 'inherit'.
 * - id: Optional id attribute.
 */

import React from 'react';
import { iconRecipe, materialIconStyle } from './Icon.css';

// ── Custom SVG Icons (card suits — future custom icon candidates) ───────────

const CUSTOM_ICON_NAMES = ['spades', 'hearts', 'diamonds', 'clubs', 'strike_filled', 'strike_empty', 'strike_dead'] as const;
type CustomIconName = (typeof CUSTOM_ICON_NAMES)[number];

const CUSTOM_SVGS: Record<CustomIconName, React.ReactElement> = {
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
  // ── Strike / death marks (custom SVGs for artist replacement) ──────────
  strike_filled: (
    <path
      fill="currentColor"
      d="M18.3 5.71a1 1 0 0 0-1.41 0L12 10.59 7.11 5.7A1 1 0 0 0 5.7 7.11L10.59 12 5.7 16.89a1 1 0 1 0 1.41 1.41L12 13.41l4.89 4.89a1 1 0 0 0 1.41-1.41L13.41 12l4.89-4.89a1 1 0 0 0 0-1.4z"
    />
  ),
  strike_empty: (
    <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="2" />
  ),
  strike_dead: (
    <>
      <circle cx="12" cy="10" r="6" fill="currentColor" />
      <path fill="currentColor" d="M8 16l-2 6h3l3-3 3 3h3l-2-6z" />
      <circle cx="10" cy="9" r="1.5" fill="var(--nott2-color-bg, #0e0e0e)" />
      <circle cx="14" cy="9" r="1.5" fill="var(--nott2-color-bg, #0e0e0e)" />
    </>
  ),
};

function isCustomIcon(name: string): name is CustomIconName {
  return (CUSTOM_ICON_NAMES as readonly string[]).includes(name);
}

// ── Material Symbol Names ───────────────────────────────────────────────────
// These map 1:1 to Material Symbols Rounded glyph names.

type MaterialIconName =
  // Time & navigation
  | 'schedule'
  | 'chevron_right'
  | 'chevron_left'
  | 'expand_more'
  | 'refresh'
  // People & identity
  | 'group'
  | 'person'
  // Status & feedback
  | 'check'
  | 'close'
  | 'warning'
  | 'bolt'
  | 'auto_awesome'
  | 'star'
  // Game / thematic
  | 'target'
  | 'air'
  | 'local_fire_department'
  | 'dangerous'
  | 'casino'
  | 'emoji_events'
  | 'theater_comedy'
  | 'skull'
  // Media
  | 'movie'
  | 'mic'
  | 'mic_off'
  | 'videocam'
  | 'videocam_off'
  // Document / UI
  | 'description'
  | 'assignment'
  | 'settings'
  | 'shuffle'
  | 'delete'
  | 'playing_cards'
  // Misc
  | 'crown'
  | 'swords'
  | 'check_circle'
  | 'arrow_downward'
  | 'key'
  | 'military_tech'
  | 'input'
  | 'person_raised_hand'
  | 'deployed_code'
  // Auth / access
  | 'lock'
  | 'link_off'
  | 'group_off'
  | 'error_outline'
  | 'login';

// ── Combined type ───────────────────────────────────────────────────────────

export type IconName = CustomIconName | MaterialIconName;
export type IconColor = 'white' | 'red' | 'muted' | 'success' | 'inherit';

interface IconProps {
  name: IconName;
  size?: number | string;
  color?: IconColor;
  id?: string;
}

export function Icon({ name, size = 24, color = 'inherit', id }: IconProps) {
  if (isCustomIcon(name)) {
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
        {CUSTOM_SVGS[name]}
      </svg>
    );
  }

  // Material Symbols Rounded — rendered via icon font
  return (
    <span
      id={id}
      className={`material-symbols-rounded ${iconRecipe({ color })} ${materialIconStyle}`}
      style={{ fontSize: typeof size === 'number' ? `${size}px` : size }}
      aria-hidden="true"
    >
      {name}
    </span>
  );
}

// ── Utility ─────────────────────────────────────────────────────────────────

/**
 * Maps a suit name (e.g. 'Spades') to its corresponding custom IconName.
 * Eliminates the need for every component to maintain its own SUIT_SYMBOL map.
 */
export function suitToIconName(suit: string): CustomIconName {
  const map: Record<string, CustomIconName> = {
    Spades: 'spades',
    Hearts: 'hearts',
    Clubs: 'clubs',
    Diamonds: 'diamonds',
  };
  return map[suit] ?? 'spades';
}
