import { style, keyframes } from '@vanilla-extract/css';
import { vars } from '../../tokens/theme.css';

/* ── Root container ──────────────────────────────────────────────────────── */

export const transitionRoot = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: vars.space.lg,
  userSelect: 'none',
});

/* ── SVG canvas ──────────────────────────────────────────────────────────── */

export const transitionSvg = style({
  display: 'block',
  overflow: 'visible',
  filter: 'drop-shadow(0 0 30px rgba(138, 0, 0, 0.4))',
});

/* ── Segments ────────────────────────────────────────────────────────────── */

export const segmentEmpty = style({
  fill: 'none',
  stroke: vars.color.border,
  strokeLinecap: 'round',
});

export const segmentFilled = style({
  fill: 'none',
  strokeLinecap: 'round',
});

/* Newly-filled segment glow pulse */
const newSegmentGlow = keyframes({
  '0%':   { filter: 'brightness(1)', strokeOpacity: 0 },
  '30%':  { filter: 'brightness(2.5)', strokeOpacity: 1 },
  '100%': { filter: 'brightness(1)', strokeOpacity: 1 },
});

export const segmentNew = style({
  fill: 'none',
  strokeLinecap: 'round',
  strokeOpacity: 0,
  animationName: newSegmentGlow,
  animationDuration: '1.2s',
  animationFillMode: 'forwards',
  animationTimingFunction: 'ease-out',
  animationDelay: '800ms',

  '@media': {
    '(prefers-reduced-motion: reduce)': {
      animation: 'none',
      strokeOpacity: 1,
    },
  },
});

/* ── Hour markers ────────────────────────────────────────────────────────── */

export const hourMarker = style({
  stroke: vars.color.textMuted,
  opacity: 0.3,
});

/* ── Clock hand ──────────────────────────────────────────────────────────── */

export const clockHand = style({
  stroke: vars.color.text,
  strokeLinecap: 'round',
  transition: 'transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
  transitionDelay: '600ms',
});

export const clockHandPin = style({
  fill: vars.color.text,
});

/* ── Below-clock label ───────────────────────────────────────────────────── */

export const clockTextArea = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 2,
  marginTop: vars.space.md,
});

export const clockCountText = style({
  fontFamily: vars.font.display,
  fontWeight: 700,
  fontSize: 'clamp(2rem, 5vw, 3.5rem)',
  color: vars.color.text,
  lineHeight: 1,
  transition: 'opacity 200ms ease-out, transform 200ms ease-out, color 400ms ease-out',
  display: 'inline-block',
});

/** Applied for ~200ms while the number is "flipping" to the new value. */
export const clockCountUpdating = style({
  opacity: 0,
  transform: 'scale(0.6)',
});

export const clockSubLabel = style({
  fontFamily: vars.font.body,
  fontSize: vars.fontSize.label,
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: vars.letterSpacing.wide,
  color: vars.color.textMuted,
});

/* ── Dismiss hint ────────────────────────────────────────────────────────── */

const hintFade = keyframes({
  '0%':   { opacity: 0 },
  '100%': { opacity: 0.5 },
});

export const dismissHint = style({
  fontFamily: vars.font.body,
  fontSize: vars.fontSize.micro,
  color: vars.color.textMuted,
  textTransform: 'uppercase',
  letterSpacing: vars.letterSpacing.wider,
  opacity: 0,
  animationName: hintFade,
  animationDuration: '600ms',
  animationFillMode: 'forwards',
  animationDelay: '2s',
});

/* ── Broken state ────────────────────────────────────────────────────────── */

export const brokenSegment = style({
  fill: 'none',
  strokeLinecap: 'round',
});

const crackFlicker = keyframes({
  '0%, 100%': { opacity: 0.7 },
  '50%': { opacity: 1 },
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

  '@media': {
    '(prefers-reduced-motion: reduce)': {
      animation: 'none',
      opacity: 0.85,
    },
  },
});

const shakeAnim = keyframes({
  '0%, 100%': { transform: 'translate(0, 0) rotate(0deg)' },
  '10%': { transform: 'translate(-2px, 1px) rotate(-1deg)' },
  '20%': { transform: 'translate(2px, -1px) rotate(1deg)' },
  '30%': { transform: 'translate(-1px, 2px) rotate(0deg)' },
  '40%': { transform: 'translate(1px, -2px) rotate(1deg)' },
  '50%': { transform: 'translate(-2px, 1px) rotate(-1deg)' },
  '60%': { transform: 'translate(2px, 0px) rotate(0deg)' },
  '70%': { transform: 'translate(-1px, -1px) rotate(1deg)' },
  '80%': { transform: 'translate(1px, 2px) rotate(-1deg)' },
  '90%': { transform: 'translate(-1px, -1px) rotate(0deg)' },
});

export const brokenShake = style({
  animationName: shakeAnim,
  animationDuration: '600ms',
  animationDelay: '400ms',
  animationFillMode: 'forwards',
  animationTimingFunction: 'ease-in-out',

  '@media': {
    '(prefers-reduced-motion: reduce)': {
      animation: 'none',
    },
  },
});

const pulseGlow = keyframes({
  '0%, 100%': { filter: 'drop-shadow(0 0 30px rgba(220, 38, 38, 0.3))' },
  '50%':      { filter: 'drop-shadow(0 0 60px rgba(220, 38, 38, 0.8))' },
});

export const brokenGlow = style({
  animationName: pulseGlow,
  animationDuration: '2s',
  animationIterationCount: 'infinite',
  animationTimingFunction: 'ease-in-out',

  '@media': {
    '(prefers-reduced-motion: reduce)': {
      animation: 'none',
      filter: 'drop-shadow(0 0 40px rgba(220, 38, 38, 0.5))',
    },
  },
});
