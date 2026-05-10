import { style, keyframes } from '@vanilla-extract/css';
import { vars } from '../../tokens/theme.css';

/* ── Amber pulse for the left-edge bleed bar ─────────────────────────────── */
const amberPulse = keyframes({
  '0%, 100%': { opacity: 0.6 },
  '50%':       { opacity: 1 },
});

/* ── Root container — "The Verdict" ──────────────────────────────────────── */
export const resultRoot = style({
  position: 'relative',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  gap: vars.space.lg,
  width: '100%',
  padding: `${vars.space.md} ${vars.space.lg}`,
  borderRadius: vars.radius.sm,
  overflow: 'hidden',

  /* Radial amber glow emanating from center */
  background: `radial-gradient(ellipse at center, rgba(180, 100, 40, 0.08) 0%, ${vars.color.surface} 70%)`,

  /* Bottom-edge glow — gold wound */
  boxShadow: `inset 0 -1px 0 ${vars.color.gold}, 0 4px 20px rgba(180, 100, 40, 0.15)`,

  /* Left-edge amber bleed bar */
  '::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: 3,
    bottom: 0,
    background: `linear-gradient(180deg, transparent, ${vars.color.goldBright}, transparent)`,
    borderRadius: `${vars.radius.sm} 0 0 ${vars.radius.sm}`,
    animationName: amberPulse,
    animationDuration: '3s',
    animationIterationCount: 'infinite',
    animationTimingFunction: 'ease-in-out',
  },

  '@media': {
    '(prefers-reduced-motion: reduce)': {
      '::before': {
        animation: 'none',
        opacity: 0.7,
      },
    },
  },
});

/* ── The Total — the centerpiece number ──────────────────────────────────── */
export const totalNumber = style({
  fontFamily: vars.font.display,
  fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
  fontWeight: 700,
  color: vars.color.goldBright,
  lineHeight: 1,
  letterSpacing: vars.letterSpacing.tight,
  textShadow: `0 0 20px rgba(220, 160, 60, 0.4), 0 2px 4px rgba(0, 0, 0, 0.8)`,
  flexShrink: 0,
  /* Subtle background glow behind the number */
  padding: `${vars.space.sm} ${vars.space.md}`,
});

/* ── Vertical divider — amber gradient line ──────────────────────────────── */
export const divider = style({
  width: 1,
  alignSelf: 'stretch',
  background: `linear-gradient(180deg, transparent 0%, ${vars.color.gold} 30%, ${vars.color.gold} 70%, transparent 100%)`,
  flexShrink: 0,
  margin: `${vars.space.xs} 0`,
  opacity: 0.5,
});
