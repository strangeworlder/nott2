import { style, keyframes } from '@vanilla-extract/css';
import { vars } from '../../tokens/theme.css';

/* ── Subtle pulse on the bottom glow, like a wound that hasn't stopped bleeding ── */
const glowPulse = keyframes({
  '0%, 100%': { opacity: 0.7 },
  '50%':       { opacity: 1 },
});

export const badgeRoot = style({
  position: 'relative',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: vars.space.md,
  width: '100%',

  /* Surface + subtle gradient from left (transparent) to surface */
  background: `linear-gradient(90deg, transparent 0%, ${vars.color.surface} 30%)`,
  borderRadius: vars.radius.sm,

  /* The wound — bottom-edge red glow */
  boxShadow: `inset 0 -1px 0 ${vars.color.accent}, 0 4px 24px rgba(138, 0, 0, 0.25)`,

  padding: `${vars.space.sm} ${vars.space.md}`,
  overflow: 'hidden',

  /* Left edge bleed — a faint red sliver */
  '::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: 3,
    bottom: 0,
    background: `linear-gradient(180deg, transparent, ${vars.color.accent}, transparent)`,
    borderRadius: `${vars.radius.sm} 0 0 ${vars.radius.sm}`,
    animationName: glowPulse,
    animationDuration: '3s',
    animationIterationCount: 'infinite',
    animationTimingFunction: 'ease-in-out',
  },

  '@media': {
    '(prefers-reduced-motion: reduce)': {
      '::before': {
        animation: 'none',
        opacity: 0.8,
      },
    },
  },
});

export const badgeNumber = style({
  fontFamily: vars.font.display,
  fontSize: 'clamp(2rem, 4vw, 2.75rem)',
  fontWeight: 700,
  color: vars.color.accentBright,
  lineHeight: 1,
  flexShrink: 0,
  /* Cinematic text shadow — depth without gimmick */
  textShadow: `0 0 20px rgba(220, 38, 38, 0.5), 0 2px 4px rgba(0, 0, 0, 0.8)`,
  letterSpacing: vars.letterSpacing.tight,
  /* Give it a slight left indent to clear the left-edge bleed line */
  paddingLeft: vars.space.sm,
});

export const badgeDivider = style({
  width: 1,
  alignSelf: 'stretch',
  background: `linear-gradient(180deg, transparent 0%, ${vars.color.accent} 30%, ${vars.color.accent} 70%, transparent 100%)`,
  flexShrink: 0,
  margin: `${vars.space.xs} 0`,
});

export const badgeMeta = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
  minWidth: 0,
});

export const badgeLabel = style({
  fontSize: vars.fontSize.nano,
  fontFamily: vars.font.body,
  textTransform: 'uppercase',
  letterSpacing: vars.letterSpacing.widest,
  color: vars.color.textMuted,
  lineHeight: 1,
});

export const badgeBreakdown = style({
  fontSize: vars.fontSize.label,
  fontFamily: vars.font.body,
  color: vars.color.textMuted,
  lineHeight: 1.3,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
});
