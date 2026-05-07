import { style } from '@vanilla-extract/css';
import { vars } from '../../tokens/theme.css';

export const headerRoot = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.xs,
});

export const stepLabel = style({
  fontSize: vars.fontSize.small,
  fontWeight: 600,
  letterSpacing: vars.letterSpacing.normal,
  textTransform: 'uppercase',
  color: vars.color.textMuted,
});
