import { style, keyframes } from '@vanilla-extract/css';
import { vars } from '../../tokens/theme.css';

const fadeIn = keyframes({
  from: { opacity: 0, transform: 'translateY(-4px)' },
  to: { opacity: 1, transform: 'translateY(0)' },
});

export const root = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.sm,
  marginTop: vars.space.xs,
});

export const triggerButton = style({
  display: 'inline-flex',
  alignItems: 'center',
  alignSelf: 'flex-start',
  gap: vars.space.xs,
  padding: `${vars.space.xs} ${vars.space.sm}`,
  backgroundColor: 'rgba(138, 0, 0, 0.12)',
  border: `1px dashed ${vars.color.borderActive}`,
  borderRadius: vars.radius.md,
  color: vars.color.text,
  fontFamily: vars.font.body,
  fontSize: vars.fontSize.small,
  letterSpacing: vars.letterSpacing.tight,
  cursor: 'pointer',
  transition: `all ${vars.transition.fast}`,
  ':hover': {
    backgroundColor: 'rgba(138, 0, 0, 0.24)',
    borderColor: vars.color.accentBright,
    boxShadow: vars.shadow.glowSubtle,
  },
  ':focus-visible': {
    outline: `2px solid ${vars.color.accentBright}`,
    outlineOffset: '2px',
  },
});

export const tray = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.sm,
  padding: vars.space.md,
  backgroundColor: vars.color.surface,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.md,
  animation: `${fadeIn} ${vars.transition.fast}`,
});

export const trayHeader = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: vars.space.sm,
  flexWrap: 'wrap',
});

export const trayLabel = style({
  fontFamily: vars.font.body,
  fontSize: vars.fontSize.micro,
  textTransform: 'uppercase',
  letterSpacing: vars.letterSpacing.wider,
  color: vars.color.textMuted,
});

export const trayActions = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: vars.space.sm,
});

export const reloadButton = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '4px',
  backgroundColor: 'rgba(138, 0, 0, 0.14)',
  border: `1px solid ${vars.color.borderActive}`,
  color: vars.color.text,
  fontFamily: vars.font.body,
  fontSize: vars.fontSize.micro,
  cursor: 'pointer',
  padding: '3px 8px',
  borderRadius: vars.radius.sm,
  transition: `all ${vars.transition.fast}`,
  ':hover': {
    backgroundColor: 'rgba(138, 0, 0, 0.28)',
    borderColor: vars.color.accentBright,
    color: vars.color.text,
  },
  ':focus-visible': {
    outline: `2px solid ${vars.color.accentBright}`,
    outlineOffset: '2px',
  },
});

export const closeButton = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '4px',
  background: 'none',
  border: 'none',
  color: vars.color.textMuted,
  fontFamily: vars.font.body,
  fontSize: vars.fontSize.micro,
  cursor: 'pointer',
  padding: '2px 4px',
  borderRadius: vars.radius.sm,
  transition: `color ${vars.transition.fast}`,
  ':hover': {
    color: vars.color.text,
  },
});

export const wordsGrid = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: vars.space.xs,
});

export const wordChip = style({
  display: 'inline-flex',
  alignItems: 'center',
  padding: `4px ${vars.space.sm}`,
  backgroundColor: vars.color.surfaceElevated,
  border: `1px solid ${vars.color.borderActive}`,
  borderLeft: `2px solid ${vars.color.accent}`,
  borderRadius: vars.radius.sm,
  color: vars.color.text,
  fontFamily: vars.font.body,
  fontSize: vars.fontSize.small,
  fontWeight: 500,
  letterSpacing: vars.letterSpacing.normal,
  lineHeight: 1.35,
  userSelect: 'text',
});

export const questionsSection = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.xs,
  paddingTop: vars.space.xs,
  borderTop: `1px solid ${vars.color.borderSubtle}`,
});

export const questionsLabel = style({
  fontFamily: vars.font.body,
  fontSize: vars.fontSize.micro,
  textTransform: 'uppercase',
  letterSpacing: vars.letterSpacing.wider,
  color: vars.color.textMuted,
});

export const questionsList = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: vars.space.xs,
});

export const questionChip = style({
  display: 'inline-flex',
  alignItems: 'center',
  padding: `4px ${vars.space.sm}`,
  backgroundColor: vars.color.diegeticSurface,
  border: `1px solid ${vars.color.borderSubtle}`,
  borderRadius: vars.radius.sm,
  color: vars.color.text,
  fontFamily: vars.font.display,
  fontStyle: 'italic',
  fontSize: vars.fontSize.small,
  lineHeight: 1.35,
  userSelect: 'text',
});
