/**
 * doom-clock-geometry.ts
 *
 * Shared constants and helpers for the DoomClock family of components.
 * Used by both the compact sidebar DoomClock and the full-screen
 * DoomClockTransition overlay.
 */

// ── Constants ────────────────────────────────────────────────────────────────

export const TOTAL_SEGMENTS = 12;
export const TRIGGER = 13;

// SVG layout
export const SIZE = 80;
export const CX = SIZE / 2;
export const CY = SIZE / 2;
// Arc ring sits between INNER_R and OUTER_R; hand tip aligns to arc midpoint
export const OUTER_R = 34;
export const INNER_R = 26;
export const ARC_MID_R = (OUTER_R + INNER_R) / 2;
export const STROKE_W = 6;
export const MARKER_R_INNER = OUTER_R + 2;
export const MARKER_R_OUTER = OUTER_R + 7;

// Hand dimensions
export const HAND_LENGTH = ARC_MID_R - 2; // nearly reaches arc
export const HAND_WIDTH = 1.8;
export const PIN_R = 2;

// Gap between arc segments in degrees
export const GAP_DEG = 5;
export const SEGMENT_DEG = 360 / TOTAL_SEGMENTS - GAP_DEG;

// 12 o'clock = -90°
export const CLOCK_OFFSET_DEG = -90;

// ── Colour scale ─────────────────────────────────────────────────────────────

export function segmentColor(index: number): string {
  const progress = (index + 1) / TOTAL_SEGMENTS;
  if (progress < 0.5)  return '#4a4a4a';
  if (progress < 0.75) return '#92400e';
  if (progress < 0.92) return '#d97706';
  return '#dc2626';
}

// ── Geometry helpers ─────────────────────────────────────────────────────────

export function toRad(deg: number) { return (deg * Math.PI) / 180; }

export function polarToXY(cx: number, cy: number, angleDeg: number, r: number) {
  const rad = toRad(angleDeg);
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

export function arcPath(cx: number, cy: number, startDeg: number, endDeg: number, r: number): string {
  const start = polarToXY(cx, cy, startDeg, r);
  const end   = polarToXY(cx, cy, endDeg,   r);
  const large = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${large} 1 ${end.x} ${end.y}`;
}

// ── Clock hand angle ──────────────────────────────────────────────────────────
// The hand points at the *current* hour position on the 12-segment clock face.
// At 0 it sits at 12 o'clock; each card advances it by one hour (30°).
// At 12 it is back at 12 (a full revolution). At 13 the clock is broken.

export function handAngleDeg(current: number): number {
  const steps = Math.min(current, TOTAL_SEGMENTS);
  return CLOCK_OFFSET_DEG + steps * (360 / TOTAL_SEGMENTS);
}
