import { style } from '@vanilla-extract/css';
import { vars } from '../../tokens/theme.css';

export const trackerRoot = style({
  display: 'flex',
  gap: vars.space.sm,
  flexWrap: 'wrap',
});

export const pipBase = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 4,
  padding: `2px ${vars.space.sm}`,
  borderRadius: vars.radius.md,
  border: '1px solid',
  fontSize: vars.fontSize.label,
  borderColor: vars.color.border,
  color: vars.color.textMuted,
  backgroundColor: 'transparent',
  transition: `all ${vars.transition.normal}`,
});

export const pipFound = style({
  borderColor: vars.color.successBright,
  color: vars.color.successBright,
  backgroundColor: 'rgba(74, 222, 128, 0.08)',
});
