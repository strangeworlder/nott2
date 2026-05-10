import { style, keyframes } from '@vanilla-extract/css';
import { vars } from '../../tokens/theme.css';

/* ── Breathing pulse on found-pip edge bleed — the held breath of relief ─── */
const glowPulse = keyframes({
  '0%, 100%': { opacity: 0.5 },
  '50%':       { opacity: 1 },
});

/* ── Root: 4-column evidence board ──────────────────────────────────────── */
export const trackerRoot = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gap: vars.space.sm,
});

/** Applied to root when all 4 weaknesses discovered — the board glows as a whole. */
export const allFoundGlow = style({
  boxShadow: vars.shadow.glowGreen,
  borderRadius: vars.radius.md,
});

/* ── Pip slot: base state (unfound) ─────────────────────────────────────── */
export const pipSlot = style({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: vars.space.xs,
  padding: `${vars.space.md} ${vars.space.sm}`,
  borderRadius: vars.radius.md,
  border: '1px solid',
  borderColor: vars.color.borderSubtle,
  backgroundColor: vars.color.surface,
  overflow: 'hidden',
  transition: `all ${vars.transition.slow}`,

  /* Left-edge bleed — dormant red. The unknown is dangerous. */
  '::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: 2,
    borderRadius: `${vars.radius.md} 0 0 ${vars.radius.md}`,
    background: `linear-gradient(180deg, transparent, ${vars.color.accent}, transparent)`,
    opacity: 0.35,
    transition: `all ${vars.transition.slow}`,
  },
});

/* ── Pip slot: found state — green glow, breathing bleed ────────────────── */
export const pipFound = style({
  borderColor: vars.color.success,
  background: `linear-gradient(180deg, rgba(45,90,45,0.14) 0%, transparent 70%)`,
  boxShadow: vars.shadow.glowGreenSubtle,

  '::before': {
    width: 3,
    background: `linear-gradient(180deg, transparent, ${vars.color.successBright}, transparent)`,
    opacity: 1,
    animationName: glowPulse,
    animationDuration: '3s',
    animationTimingFunction: 'ease-in-out',
    animationIterationCount: 'infinite',
  },
});

/* ── Pip icon ───────────────────────────────────────────────────────────── */
export const pipIcon = style({
  fontSize: '1.25rem',
  color: vars.color.textMuted,
  transition: `all ${vars.transition.slow}`,
  lineHeight: 1,
});

export const pipIconFound = style({
  color: vars.color.successBright,
  filter: 'drop-shadow(0 0 6px rgba(74, 222, 128, 0.5))',
});

/* ── Pip label ──────────────────────────────────────────────────────────── */
export const pipLabel = style({
  fontFamily: vars.font.display,
  fontSize: vars.fontSize.micro,
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: vars.letterSpacing.wide,
  color: vars.color.textMuted,
  transition: `color ${vars.transition.slow}`,
  lineHeight: 1,
});

export const pipLabelFound = style({
  color: vars.color.successBright,
});

/* ── Reduced motion ─────────────────────────────────────────────────────── */
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
