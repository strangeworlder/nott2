import { style } from '@vanilla-extract/css';
import { vars } from '../../tokens/theme.css';

export const trophyRoot = style({
  display: 'inline-flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 2,
  padding: `${vars.space.xs} ${vars.space.sm}`,
  borderRadius: vars.radius.md,
  border: `1px solid rgba(234, 179, 8, 0.3)`,
  backgroundColor: 'rgba(234, 179, 8, 0.04)',
});

export const trophyLabel = style({
  fontSize: vars.fontSize.nano,
  textTransform: 'uppercase',
  letterSpacing: vars.letterSpacing.normal,
  color: 'rgba(234, 179, 8, 0.7)',
  fontWeight: 600,
});

export const trophyCard = style({
  fontFamily: vars.font.display,
  fontSize: vars.fontSize.h3,
  fontWeight: 700,
  color: vars.color.warning,
  lineHeight: 1,
});

export const trophyRank = style({
  fontSize: vars.fontSize.nano,
  textTransform: 'uppercase',
  letterSpacing: vars.letterSpacing.normal,
  color: vars.color.warning,
  opacity: 0.7,
});
