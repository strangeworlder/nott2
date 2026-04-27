import { style, keyframes } from '@vanilla-extract/css';
import { vars } from '../../tokens/theme.css';

const pulse = keyframes({
  '0%, 100%': { opacity: 0.5 },
  '50%':      { opacity: 1 },
});

export const waitingRoot = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: vars.space.sm,
  padding: vars.space.md,
  color: vars.color.textMuted,
  fontSize: vars.fontSize.label,
  textAlign: 'center',
  animationName: pulse,
  animationDuration: '2s',
  animationTimingFunction: 'ease-in-out',
  animationIterationCount: 'infinite',
  '@media': {
    '(prefers-reduced-motion: reduce)': {
      animationName: 'none',
      opacity: 0.8,
    },
  },
});

export const waitingDot = style({
  width: 6,
  height: 6,
  borderRadius: vars.radius.full,
  backgroundColor: vars.color.accent,
});
