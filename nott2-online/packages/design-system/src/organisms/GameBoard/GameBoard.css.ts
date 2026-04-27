import { style } from '@vanilla-extract/css';
import { vars } from '../../tokens/theme.css';

export const gameBoardRoot = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: vars.space.lg,
  padding: vars.space.lg,
  backgroundColor: vars.color.background,
  borderRadius: vars.radius.lg,
  border: `1px solid ${vars.color.border}`,
  minHeight: '200px',
});

export const zone = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.sm,
});

export const zoneLabel = style({
  fontFamily: vars.font.body,
  fontSize: vars.fontSize.micro,
  color: vars.color.textMuted,
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
});

export const deckStack = style({
  position: 'relative',
  width: '52px',
  height: '72px',
  cursor: 'pointer',
  ':hover': { transform: 'scale(1.05)' },
  transition: `transform ${vars.transition.fast}`,
});

export const deckCard = style({
  position: 'absolute',
  width: '52px',
  height: '72px',
  borderRadius: vars.radius.md,
  backgroundImage: `repeating-linear-gradient(
    45deg,
    ${vars.color.accent} 0px,
    ${vars.color.accent} 2px,
    transparent 2px,
    transparent 8px
  )`,
  backgroundColor: vars.color.surface,
  border: `1px solid ${vars.color.border}`,
});

export const deckCount = style({
  position: 'absolute',
  inset: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontFamily: vars.font.display,
  fontSize: '1.25rem',
  fontWeight: 700,
  color: vars.color.text,
  zIndex: 10,
});

export const cardLine = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: vars.space.sm,
  alignItems: 'flex-start',
});

export const emptyHint = style({
  color: vars.color.textMuted,
  fontSize: vars.fontSize.label,
  fontStyle: 'italic',
  padding: `${vars.space.md} 0`,
});

export const emptyCard = style({
  width: '52px',
  height: '72px',
  border: `1px dashed ${vars.color.border}`,
  borderRadius: vars.radius.md,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: vars.color.textMuted,
  fontSize: '1.25rem',
});

export const phaseInfo = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.xs,
  marginLeft: 'auto',
  alignItems: 'flex-end',
});

export const actBadge = style({
  fontFamily: vars.font.display,
  fontSize: vars.fontSize.label,
  fontWeight: 700,
  color: vars.color.accentBright,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
});

export const phaseName = style({
  color: vars.color.textMuted,
  fontSize: vars.fontSize.micro,
  textTransform: 'capitalize',
  letterSpacing: '0.05em',
});
