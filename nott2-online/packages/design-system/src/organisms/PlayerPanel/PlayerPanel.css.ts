import { style } from '@vanilla-extract/css';
import { vars } from '../../tokens/theme.css';

export const panelRoot = style({
  backgroundColor: vars.color.surface,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.lg,
  overflow: 'hidden',
});

export const panelHeader = style({
  display: 'flex',
  alignItems: 'center',
  padding: `${vars.space.sm} ${vars.space.md}`,
  borderBottom: `1px solid ${vars.color.border}`,
  backgroundColor: vars.color.background,
});

export const panelTitle = style({
  fontFamily: vars.font.display,
  fontSize: vars.fontSize.label,
  color: vars.color.textMuted,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
});

export const panelBody = style({
  padding: vars.space.md,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.md,
});

export const difficultyBadge = style({
  padding: `${vars.space.xs} ${vars.space.sm}`,
  backgroundColor: vars.color.surfaceElevated,
  borderRadius: vars.radius.md,
  fontSize: vars.fontSize.label,
  color: vars.color.textMuted,
  fontFamily: vars.font.body,
});

export const diceRow = style({
  display: 'flex',
  gap: vars.space.lg,
  flexWrap: 'wrap',
});

export const resultBanner = style({
  padding: `${vars.space.sm} ${vars.space.md}`,
  borderRadius: vars.radius.md,
  fontFamily: vars.font.display,
  fontSize: '1.125rem',
  fontWeight: 700,
  letterSpacing: '0.05em',
  textAlign: 'center',
});

export const success = style({
  backgroundColor: 'rgba(45, 90, 45, 0.2)',
  borderColor: vars.color.success,
  border: `1px solid ${vars.color.success}`,
  color: '#4ade80',
});

export const failure = style({
  backgroundColor: 'rgba(138, 0, 0, 0.15)',
  border: `1px solid ${vars.color.accentBright}`,
  color: vars.color.accentBright,
});

export const infoBanner = style({
  padding: `${vars.space.sm} ${vars.space.md}`,
  backgroundColor: 'rgba(138, 0, 0, 0.1)',
  border: `1px solid ${vars.color.accent}`,
  borderRadius: vars.radius.md,
  color: vars.color.accentBright,
  fontSize: vars.fontSize.label,
  fontFamily: vars.font.body,
});
