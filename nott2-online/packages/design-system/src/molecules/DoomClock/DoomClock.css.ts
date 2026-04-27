import { style, keyframes } from '@vanilla-extract/css';
import { vars } from '../../tokens/theme.css';

/* ── Root ─────────────────────────────────────────────────────────────────── */

export const clockRoot = style({
  position: 'relative',
  display: 'inline-flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 4,
});

/* ── SVG canvas ──────────────────────────────────────────────────────────── */

export const clockSvg = style({
  display: 'block',
  overflow: 'visible',
});

/* ── Segments ────────────────────────────────────────────────────────────── */

export const segmentEmpty = style({
  fill: 'none',
  stroke: vars.color.border,
  strokeLinecap: 'round',
  transition: `all ${vars.transition.normal}`,
});

export const segmentFilled = style({
  fill: 'none',
  strokeLinecap: 'round',
  transition: `all ${vars.transition.normal}`,
});

/* ── Hour markers ────────────────────────────────────────────────────────── */

export const hourMarker = style({
  stroke: vars.color.textMuted,
  opacity: 0.3,
  transition: `opacity ${vars.transition.normal}`,
});

/* ── Clock hand ──────────────────────────────────────────────────────────── */

export const clockHand = style({
  stroke: vars.color.text,
  strokeLinecap: 'round',
  transition: `all ${vars.transition.slow}`,
});

export const clockHandPin = style({
  fill: vars.color.text,
});

/* ── Below-clock label ───────────────────────────────────────────────────── */

export const clockTextArea = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 1,
  marginTop: 2,
});

export const clockCountText = style({
  fontFamily: vars.font.display,
  fontWeight: 700,
  fontSize: vars.fontSize.h3,
  color: vars.color.text,
  lineHeight: 1,
  transition: `color ${vars.transition.normal}`,
});

export const clockSubLabel = style({
  fontFamily: vars.font.body,
  fontSize: vars.fontSize.micro,
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.12em',
  color: vars.color.textMuted,
});

/* ── Near-full pulse (10–12 segments) ────────────────────────────────────── */

const pulseGlow = keyframes({
  '0%, 100%': { opacity: 0.4 },
  '50%': { opacity: 0.8 },
});

export const pulseRing = style({
  fill: 'none',
  stroke: vars.color.accentBright,
  opacity: 0.4,
  animationName: pulseGlow,
  animationDuration: '2s',
  animationIterationCount: 'infinite',
  animationTimingFunction: 'ease-in-out',
});

/* ── Broken state (Act 3) ────────────────────────────────────────────────── */

const crackFlicker = keyframes({
  '0%, 100%': { opacity: 0.7 },
  '50%': { opacity: 1 },
});

export const brokenSegment = style({
  fill: 'none',
  strokeLinecap: 'round',
  transition: `all ${vars.transition.slow}`,
});

export const crackLine = style({
  stroke: vars.color.accentBright,
  fill: 'none',
  strokeLinecap: 'round',
  opacity: 0.7,
  animationName: crackFlicker,
  animationDuration: '3s',
  animationIterationCount: 'infinite',
  animationTimingFunction: 'ease-in-out',
});

export const brokenLabel = style({
  fontFamily: vars.font.display,
  fontWeight: 700,
  fill: vars.color.accentBright,
  textAnchor: 'middle',
  dominantBaseline: 'central',
  fontSize: '14px',
});
