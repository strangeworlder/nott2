/**
 * CardMatt — The physical playing surface where 3D cards land.
 *
 * Philosophical:
 * Every card game needs a table. The CardMatt is that table — a textured,
 * felt-like surface that gives the 3D cards a grounded, physical home. The
 * dashed border whispers "place cards here" before any are dealt, and the
 * rotated title on the left edge evokes a casino table's printed labels —
 * elegant, functional, out of the way.
 *
 * Technical:
 * A ref-forwarding molecule. An invisible inner div (75% wide, 33% tall,
 * vertically centered, right-aligned) accepts a `ref` so the react-ttrpg-cards
 * library measures its bounding rect and lands physics-driven 3D cards in a
 * tighter, better-positioned zone rather than across the entire surface.
 * The component itself renders no card visuals — the 3D overlay handles that.
 *
 * Props:
 *   title      string  — the rotated label on the left edge (default: "Visible Threats")
 *   count      number  — how many cards are on the matt (shown as a count badge)
 *   emptyHint  string  — text shown when count is 0 (default: "Draw from deck")
 *   glow       boolean — when true, applies a pulsing amber/crimson halo to signal
 *                        that cards are selectable (default: false)
 *   ref        forwarded to the invisible inner target area div
 */


import React from 'react';
import * as styles from './CardMatt.css';

export interface CardMattProps {
  /** Label rendered rotated 90° CCW on the left edge */
  title?: string;
  /** Number of cards currently on the matt */
  count?: number;
  /** Hint text shown on the empty matt */
  emptyHint?: string;
  /**
   * When true, applies a pulsing amber/crimson halo around the surface to
   * signal that the player should select a card. Mirrors the Deck `glow` prop.
   */
  glow?: boolean;
}

export const CardMatt = React.forwardRef<HTMLDivElement, CardMattProps>(
  function CardMatt({ title = 'Visible Threats', count = 0, emptyHint = 'Draw from deck', glow = false }, ref) {
    const surfaceClass = [
      styles.cardMattSurface,
      glow ? styles.cardMattSurfaceGlow : '',
    ].filter(Boolean).join(' ');

    return (
      <div className={styles.cardMattRoot}>
        {/* Rotated title on the left edge */}
        <div className={styles.cardMattTitle}>
          {title}
        </div>

        {/* The felt surface — this is the 3D card landing zone */}
        <div className={surfaceClass}>
          {count === 0 && (
            <div className={styles.cardMattEmpty}>
              {emptyHint}
            </div>
          )}
          {count > 0 && (
            <div className={styles.cardMattCount}>
              {count} {count === 1 ? 'card' : 'cards'}
            </div>
          )}
          {/* Invisible precision target area — ref is forwarded here so
              react-ttrpg-cards measures this rect for card placement */}
          <div ref={ref} className={styles.cardMattTargetArea} aria-hidden="true" />
        </div>
      </div>
    );
  },
);
