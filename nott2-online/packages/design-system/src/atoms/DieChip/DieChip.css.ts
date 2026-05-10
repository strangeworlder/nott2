import { recipe } from '@vanilla-extract/recipes';
import { style, keyframes } from '@vanilla-extract/css';
import { vars } from '../../tokens/theme.css';

/* ── Subtle amber pulse for the modified state ────────────────────────────── */
const modifiedPulse = keyframes({
  '0%, 100%': { opacity: 0.6 },
  '50%':       { opacity: 1 },
});

/* ── Chip wrapper — carries the drop-shadow glow (clip-path would clip box-shadow) */
export const chipWrapper = recipe({
  base: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 2,
    transition: `filter ${vars.transition.normal}`,
  },
  variants: {
    modified: {
      true: {
        filter: `drop-shadow(0 0 6px ${vars.color.goldBright}) drop-shadow(0 0 14px rgba(220, 160, 60, 0.35))`,
      },
      false: {},
    },
  },
  defaultVariants: { modified: false },
});

/* ── The clipped shape — the actual die silhouette ───────────────────────── */
export const chipShape = recipe({
  base: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: `linear-gradient(180deg, rgba(45, 45, 45, 1) 0%, ${vars.color.surfaceElevated} 100%)`,
    border: `1px solid rgba(255, 255, 255, 0.12)`,
    transition: `background ${vars.transition.normal}, border-color ${vars.transition.normal}`,
  },
  variants: {
    die: {
      d10: {
        /* Diamond / bipyramid profile — wider than tall */
        width: 52,
        height: 56,
        clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
      },
      d4: {
        /* Pyramid / triangle profile — equilateral-ish */
        width: 50,
        height: 48,
        clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)',
        /* Push the number down slightly so it's visually centered in the triangle's mass */
        paddingTop: 10,
      },
    },
    modified: {
      true: {
        background: `linear-gradient(180deg, rgba(220, 160, 60, 0.12) 0%, ${vars.color.surface} 100%)`,
        borderColor: vars.color.gold,
      },
      false: {},
    },
  },
  defaultVariants: { die: 'd10', modified: false },
});

/* ── The value number inside the shape ───────────────────────────────────── */
export const chipValue = recipe({
  base: {
    fontFamily: vars.font.display,
    fontSize: vars.fontSize.lead,
    fontWeight: 700,
    lineHeight: 1,
    letterSpacing: vars.letterSpacing.tight,
    textShadow: '0 1px 3px rgba(0,0,0,0.6)',
  },
  variants: {
    modified: {
      true: {
        color: vars.color.goldBright,
      },
      false: {
        color: vars.color.text,
      },
    },
  },
  defaultVariants: { modified: false },
});

/* ── Die type label below the shape ──────────────────────────────────────── */
export const chipLabel = style({
  fontSize: vars.fontSize.nano,
  fontFamily: vars.font.body,
  textTransform: 'uppercase',
  letterSpacing: vars.letterSpacing.widest,
  color: 'rgba(180, 180, 180, 0.9)',
  lineHeight: 1,
  textShadow: [
    '0 0 3px rgba(0,0,0,1)',
    '0 0 6px rgba(0,0,0,0.9)',
    '0 1px 2px rgba(0,0,0,1)',
    '0 0 10px rgba(0,0,0,0.7)',
  ].join(', '),
});

/* ── Ghost original value (struck-through) ───────────────────────────────── */
export const chipGhost = style({
  fontSize: vars.fontSize.micro,
  fontFamily: vars.font.mono,
  color: 'rgba(180, 180, 180, 0.85)',
  textDecoration: 'line-through',
  lineHeight: 1,
  textShadow: [
    '0 0 3px rgba(0,0,0,1)',
    '0 0 6px rgba(0,0,0,0.9)',
    '0 1px 2px rgba(0,0,0,1)',
    '0 0 10px rgba(0,0,0,0.7)',
  ].join(', '),
  opacity: 0.85,
  animationName: modifiedPulse,
  animationDuration: '3s',
  animationTimingFunction: 'ease-in-out',
  animationIterationCount: 'infinite',

  '@media': {
    '(prefers-reduced-motion: reduce)': {
      animation: 'none',
      opacity: 0.6,
    },
  },
});
