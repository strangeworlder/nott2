/**
 * cardDealConfig — Centralized configuration for react-ttrpg-cards integration.
 *
 * Philosophical:
 * The horror table has its own identity — blood-red highlights, dark surfaces,
 * menacing edges. This module registers the NotT2 custom theme and exports a
 * shared configuration object so every card deal in the app speaks the same
 * visual language.
 *
 * Technical:
 * - Registers the `nott2-horror` theme via `registerTheme()` at module load.
 * - Exports `CARD_DEAL_CONFIG` partial options for `useCardDeal`.
 * - All visual constants live here, not scattered across components.
 */

import { registerTheme } from 'react-ttrpg-cards';
import type { UseCardDealOptions } from 'react-ttrpg-cards';

// ── Register custom theme ────────────────────────────────────────────────────
// This runs once when the module is first imported.
// Fields are merged onto the 'classic' base — only overrides needed.

registerTheme('nott2-horror', {
  // Face — warm parchment base (visible as fallback; texture image overlays)
  cardColor:      '#d4c5a0',     // Aged parchment fallback
  redPipColor:    '#8b1a1a',     // Deep blood red (high contrast on parchment)
  blackPipColor:  '#1a1210',     // Near-black ink (readable on parchment)
  edgeColor:      '#3d2b1a',     // Dark leather-brown edges

  // Back pattern — keep the dark, menacing backs
  backPattern:        'crosshatch',
  backPrimaryColor:   '#2d0000',  // Deep maroon base
  backSecondaryColor: '#1a0000',  // Even darker accent
  backAccentColor:    '#8b0000',  // Crimson crosshatch lines

  // PBR material — slightly rougher for a paper feel
  roughness: 0.55,
  metalness: 0.0,

  // Interaction highlights
  emissiveOnHover:  '#330000',   // Subtle blood glow on hover
  emissiveOnSelect: '#8b0000',   // Intense blood glow on selection
});

// ── Shared configuration ─────────────────────────────────────────────────────

export const CARD_DEAL_CONFIG: Partial<UseCardDealOptions> = {
  zIndex: 9998,                 // Below dice overlay (10000) so dice always render on top
  cardScale: 0.85,              // Fit within ~640px phase panel center zone
  config: {
    theme: 'nott2-horror',
    cornerRadius: 0.06,
    backImage: '/textures/card-back.png',
  },
  textureConfig: {
    mode: 'procedural-bg',
    backgroundImage: '/textures/parchment-card.png',
  },
  sound: { volume: 0.3 },
  timeout: 4000,
};
