import { style } from '@vanilla-extract/css';
import { vars } from '../../tokens/theme.css';

export const dieSelectorRoot = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.sm,
});

export const dieSelectorLabel = style({
  fontFamily: vars.font.body,
  fontSize: vars.fontSize.label,
  color: vars.color.textMuted,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
});

export const dieGrid = style({
  display: 'grid',
  gap: vars.space.xs,
  selectors: {
    '&[data-sides="4"]':  { gridTemplateColumns: 'repeat(4, 1fr)' },
    '&[data-sides="10"]': { gridTemplateColumns: 'repeat(5, 1fr)' },
  },
});

export const dieFace = style({
  width: '42px',
  height: '42px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: vars.radius.md,
  border: `1px solid ${vars.color.border}`,
  backgroundColor: vars.color.surface,
  color: vars.color.textMuted,
  fontFamily: vars.font.display,
  fontSize: vars.fontSize.body,
  fontWeight: 600,
  cursor: 'pointer',
  transition: `all ${vars.transition.fast}`,
  ':hover': {
    borderColor: vars.color.textMuted,
    color: vars.color.text,
  },
  selectors: {
    '&[data-selected="true"]': {
      borderColor: vars.color.accentBright,
      color: vars.color.text,
      backgroundColor: 'rgba(138,0,0,0.15)',
      boxShadow: vars.shadow.glow,
    },
    '&[data-color="red"][data-selected="true"]': {
      borderColor: vars.color.accentBright,
      boxShadow: vars.shadow.glowIntense,
    },
  },
});
