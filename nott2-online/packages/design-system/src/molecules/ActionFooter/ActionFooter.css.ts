import { style } from '@vanilla-extract/css';
import { vars } from '../../tokens/theme.css';

export const footer = style({
  padding: `${vars.space.md} ${vars.space.lg}`,
  borderTop: `1px solid ${vars.color.border}`,
  backgroundColor: vars.color.background,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.sm,
});

export const hintText = style({
  fontFamily: vars.font.body,
  fontSize: vars.fontSize.label,
  color: vars.color.textMuted,
  margin: 0,
  textAlign: 'center',
  fontStyle: 'italic',
});
