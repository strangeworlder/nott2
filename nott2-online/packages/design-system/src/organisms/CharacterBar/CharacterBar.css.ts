import { style } from '@vanilla-extract/css';
import { vars } from '../../tokens/theme.css';

export const barRoot = style({
  position: 'sticky',
  bottom: 0,
  zIndex: 10,
  backgroundColor: vars.color.background,
  borderTop: `1px solid ${vars.color.border}`,
  padding: `${vars.space.sm} ${vars.space.md}`,
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.md,
});

export const barInner = style({
  display: 'flex',
  gap: vars.space.sm,
  flexWrap: 'nowrap',
  overflowX: 'auto',
  scrollbarWidth: 'none',
  '::-webkit-scrollbar': { display: 'none' },
  flex: 1,
});



export const genrePool = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  gap: 2,
  flexShrink: 0,
  marginLeft: 'auto',
});

export const genrePoolLabel = style({
  fontSize: vars.fontSize.nano,
  textTransform: 'uppercase',
  letterSpacing: vars.letterSpacing.normal,
  color: vars.color.textMuted,
});

export const genrePoolCount = style({
  fontFamily: vars.font.display,
  fontSize: vars.fontSize.h3,
  fontWeight: 700,
  color: vars.color.text,
  lineHeight: 1,
});


