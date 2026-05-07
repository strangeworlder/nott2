import { style } from '@vanilla-extract/css';
import { vars } from '../../tokens/theme.css';

export const charCard = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: vars.space.xs,
  padding: `${vars.space.xs} ${vars.space.sm}`,
  borderRadius: vars.radius.md,
  border: `1px solid ${vars.color.border}`,
  background: 'transparent',
  transition: `all ${vars.transition.normal}`,
  minWidth: 72,
  fontFamily: vars.font.body,
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
