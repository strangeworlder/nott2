import { style } from '@vanilla-extract/css';
import { vars } from '../../tokens/theme.css';

export const badgeRoot = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: vars.space.md,
});

export const badgeNumber = style({
  fontFamily: vars.font.display,
  fontSize: '1.75rem',
  fontWeight: 700,
  color: vars.color.accentBright,
  lineHeight: 1,
  flexShrink: 0,
});

export const badgeLabel = style({
  fontSize: vars.fontSize.nano,
  textTransform: 'uppercase',
  letterSpacing: vars.letterSpacing.normal,
  color: vars.color.textMuted,
  marginTop: 2,
});

export const badgeBreakdown = style({
  fontSize: vars.fontSize.label,
  color: vars.color.textMuted,
});
