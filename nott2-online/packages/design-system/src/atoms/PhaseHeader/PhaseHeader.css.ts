import { style } from '@vanilla-extract/css';
import { vars } from '../../tokens/theme.css';

export const headerRoot = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.xs,
  marginBottom: vars.space.md,
});

export const stepLabel = style({
  fontSize: vars.fontSize.small,
  fontWeight: 600,
  letterSpacing: vars.letterSpacing.normal,
  textTransform: 'uppercase',
  color: vars.color.textMuted,
});

export const titleStyle = style({
  fontFamily: vars.font.display,
  fontSize: vars.fontSize.h3,
  color: vars.color.text,
  margin: 0,
  lineHeight: 1.2,
});

export const subtitleStyle = style({
  fontSize: vars.fontSize.label,
  color: vars.color.textMuted,
  margin: 0,
  lineHeight: 1.5,
});
