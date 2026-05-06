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

export const charCard = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: vars.space.xs,
  padding: `${vars.space.xs} ${vars.space.sm}`,
  borderRadius: vars.radius.md,
  border: `1px solid ${vars.color.border}`,
  background: 'transparent',
  cursor: 'pointer',
  transition: `all ${vars.transition.normal}`,
  minWidth: 72,
  fontFamily: vars.font.body,
  ':hover': {
    borderColor: '#4a4a4a',
  },
});

/** Inner vertical stack: avatar → strikes → GP badge. */
export const charCardInner = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: vars.space.xs,
});

export const charCardActive = style({
  borderColor: vars.color.accentBright,
  boxShadow: vars.shadow.glowSubtle,
});

export const charCardDead = style({
  opacity: 0.4,
  cursor: 'default',
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

// ── Ace Turn Order Token ────────────────────────────────────────────────────

export const aceToken = style({
  display: 'flex',
  alignItems: 'center',
  flexShrink: 0,
  transition: `all ${vars.transition.normal}`,
});

export const aceTokenAvailable = style({
  filter: 'drop-shadow(0 0 3px rgba(45, 90, 45, 0.6))',
});

export const aceTokenActed = style({
  opacity: 0.5,
});
