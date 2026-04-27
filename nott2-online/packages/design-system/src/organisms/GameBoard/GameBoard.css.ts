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

/* Vertical mode: stacks zones as a column, used in sidebar placement */
export const gameBoardVertical = style({
  flexDirection: 'column',
  flexWrap: 'nowrap',
  gap: vars.space.md,
  padding: `${vars.space.md} ${vars.space.sm}`,
  minHeight: 'unset',
  borderRadius: 0,
  border: 'none',
  height: '100%',
});

export const zone = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.sm,
});

/* Vertical mode: zone spans full width with a subtle separator */
export const zoneVertical = style({
  width: '100%',
  paddingBottom: vars.space.sm,
  borderBottom: `1px solid ${vars.color.border}`,
  selectors: {
    '&:last-child': {
      borderBottom: 'none',
      paddingBottom: 0,
    },
  },
});

export const zoneLabel = style({
  fontFamily: vars.font.body,
  fontSize: vars.fontSize.micro,
  color: vars.color.textMuted,
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
});




export const cardLine = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: vars.space.sm,
  alignItems: 'flex-start',
});

/* Vertical mode: cards stack in a single column */
export const cardLineVertical = style({
  flexDirection: 'column',
  flexWrap: 'nowrap',
  gap: vars.space.xs,
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
