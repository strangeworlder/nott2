import { style } from '@vanilla-extract/css';
import { vars } from '../../tokens/theme.css';

export const card = style({
  position: 'relative',
  width: '80px',
  height: '112px',
  backgroundColor: '#f8f5ed',
  borderRadius: vars.radius.md,
  border: `1px solid ${vars.color.border}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  transition: `all ${vars.transition.normal}`,
  userSelect: 'none',
});

export const cardCompact = style({
  width: '52px',
  height: '72px',
});

export const cardSelected = style({
  borderColor: vars.color.accentBright,
  boxShadow: vars.shadow.glowIntense,
});

export const cardClickable = style({
  cursor: 'pointer',
  ':hover': {
    transform: 'translateY(-4px)',
    boxShadow: vars.shadow.glow,
  },
});

export const cardBack = style({
  width: '100%',
  height: '100%',
  borderRadius: vars.radius.md,
  backgroundImage: `repeating-linear-gradient(
    45deg,
    ${vars.color.accent} 0px,
    ${vars.color.accent} 2px,
    transparent 2px,
    transparent 8px
  )`,
  backgroundColor: vars.color.surface,
  opacity: 0.9,
});

export const corner = style({
  position: 'absolute',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  lineHeight: 1,
  padding: '4px 5px',
});

export const cornerTL = style({
  top: 0,
  left: 0,
});

export const cornerBR = style({
  bottom: 0,
  right: 0,
  transform: 'rotate(180deg)',
});

export const rankLabel = style({
  fontSize: '0.875rem',
  fontWeight: 700,
  fontFamily: 'Georgia, serif',
  lineHeight: 1,
});

export const suitLabel = style({
  fontSize: '0.625rem',
  lineHeight: 1,
  marginTop: '1px',
});

export const suitCenter = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

export const suitLarge = style({
  fontSize: '2rem',
  lineHeight: 1,
});

export const jokerSymbol = style({
  fontSize: '0.875rem',
  fontWeight: 800,
  letterSpacing: '0.1em',
  fontFamily: vars.font.display,
});

export const rankRed = style({ color: '#c0392b' });
export const rankBlack = style({ color: '#1a1a1a' });
