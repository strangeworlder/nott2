import { recipe } from '@vanilla-extract/recipes';
import { style, keyframes } from '@vanilla-extract/css';
import { vars } from '../../tokens/theme.css';

/* ── Breathing pulse for the left-edge intensity bar ────────────────────── */
const edgePulse = keyframes({
  '0%, 100%': { opacity: 0.6 },
  '50%':       { opacity: 1 },
});

/* ── Main band recipe ────────────────────────────────────────────────────── */
export const bandRecipe = recipe({
  base: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    gap: vars.space.sm,
    padding: `${vars.space.sm} ${vars.space.md}`,
    paddingLeft: vars.space.lg,       // Extra room to clear the intensity bar
    borderRadius: vars.radius.md,
    border: '1px solid',
    overflow: 'hidden',
    transition: `all ${vars.transition.normal}`,

    /* Left-edge intensity bar — base shared across levels */
    '::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      width: 2,
      borderRadius: `${vars.radius.md} 0 0 ${vars.radius.md}`,
    },
  },
  variants: {
    level: {
      'controlled': {
        borderColor: vars.color.success,
        background: `linear-gradient(90deg, rgba(45,90,45,0.12) 0%, transparent 60%)`,
        color: vars.color.successBright,
        boxShadow: `inset 0 -1px 0 ${vars.color.success}`,
        '::before': {
          width: 2,
          background: `linear-gradient(180deg, transparent, ${vars.color.successBright}, transparent)`,
        },
      },
      'pushing-it': {
        borderColor: 'rgba(251,191,36,0.35)',
        background: `linear-gradient(90deg, rgba(251,191,36,0.08) 0%, transparent 60%)`,
        color: vars.color.warning,
        boxShadow: `inset 0 -1px 0 rgba(251,191,36,0.3), 0 2px 12px rgba(251,191,36,0.1)`,
        '::before': {
          width: 2,
          background: `linear-gradient(180deg, transparent, ${vars.color.warning}, transparent)`,
          animationName: edgePulse,
          animationDuration: '3s',
          animationTimingFunction: 'ease-in-out',
          animationIterationCount: 'infinite',
        },
      },
      'overexertion': {
        borderColor: vars.color.caution,
        background: `linear-gradient(90deg, rgba(251,146,60,0.1) 0%, transparent 50%)`,
        color: vars.color.cautionBright,
        boxShadow: `inset 0 -1px 0 ${vars.color.caution}, 0 4px 20px rgba(251,146,60,0.15)`,
        '::before': {
          width: 3,
          background: `linear-gradient(180deg, transparent, ${vars.color.cautionBright}, transparent)`,
          animationName: edgePulse,
          animationDuration: '2.5s',
          animationTimingFunction: 'ease-in-out',
          animationIterationCount: 'infinite',
        },
      },
      'breaking-point': {
        borderColor: vars.color.accent,
        background: `linear-gradient(90deg, rgba(138,0,0,0.15) 0%, transparent 50%)`,
        color: vars.color.accentBright,
        boxShadow: `inset 0 -1px 0 ${vars.color.accent}, ${vars.shadow.glow}`,
        '::before': {
          width: 4,
          background: `linear-gradient(180deg, transparent, ${vars.color.accentBright}, transparent)`,
          animationName: edgePulse,
          animationDuration: '2s',
          animationTimingFunction: 'ease-in-out',
          animationIterationCount: 'infinite',
        },
      },
    },
    active: {
      true: {
        borderWidth: 1,
      },
      false: {},
    },
  },
  compoundVariants: [
    {
      variants: { level: 'controlled', active: true },
      style: {
        background: `linear-gradient(90deg, rgba(45,90,45,0.18) 0%, rgba(45,90,45,0.04) 60%)`,
        boxShadow: `inset 0 -1px 0 ${vars.color.success}, ${vars.shadow.glowGreenSubtle}`,
        '::before': { opacity: 1 },
      },
    },
    {
      variants: { level: 'pushing-it', active: true },
      style: {
        background: `linear-gradient(90deg, rgba(251,191,36,0.14) 0%, rgba(251,191,36,0.03) 60%)`,
        boxShadow: `inset 0 -1px 0 rgba(251,191,36,0.4), 0 4px 16px rgba(251,191,36,0.15)`,
      },
    },
    {
      variants: { level: 'overexertion', active: true },
      style: {
        background: `linear-gradient(90deg, rgba(251,146,60,0.16) 0%, rgba(251,146,60,0.03) 50%)`,
        boxShadow: `inset 0 -1px 0 ${vars.color.caution}, 0 4px 24px rgba(251,146,60,0.2)`,
      },
    },
    {
      variants: { level: 'breaking-point', active: true },
      style: {
        background: `linear-gradient(90deg, rgba(138,0,0,0.22) 0%, rgba(138,0,0,0.04) 50%)`,
        boxShadow: `inset 0 -1px 0 ${vars.color.accent}, ${vars.shadow.glowIntense}`,
      },
    },
  ],
  defaultVariants: { level: 'controlled', active: false },
});

/* ── Sub-element styles ──────────────────────────────────────────────────── */

export const bandIcon = style({
  fontSize: '1.2rem',
  flexShrink: 0,
  filter: 'drop-shadow(0 0 3px currentColor)',
});

export const bandLabel = style({
  fontFamily: vars.font.display,
  fontSize: vars.fontSize.label,
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: vars.letterSpacing.normal,
  flexShrink: 0,
});

export const bandDesc = style({
  fontSize: vars.fontSize.micro,
  fontFamily: vars.font.body,
  marginLeft: 'auto',
  opacity: 0.75,
  letterSpacing: vars.letterSpacing.wide,
});

/* ── Reduced motion ──────────────────────────────────────────────────────── */
export const reducedMotion = style({
  '@media': {
    '(prefers-reduced-motion: reduce)': {
      '::before': {
        animation: 'none',
        opacity: 0.8,
      },
    },
  },
});
