import { recipe } from '@vanilla-extract/recipes';
import { style } from '@vanilla-extract/css';
import { vars } from '../../tokens/theme.css';

export const bandRecipe = recipe({
  base: {
    display: 'flex',
    alignItems: 'center',
    gap: vars.space.sm,
    padding: `${vars.space.sm} ${vars.space.md}`,
    borderRadius: vars.radius.md,
    border: '1px solid',
  },
  variants: {
    level: {
      'controlled':     { borderColor: '#2a5a2a', backgroundColor: 'rgba(42,90,42,0.1)',   color: '#4ade80' },
      'pushing-it':     { borderColor: '#5a5a2a', backgroundColor: 'rgba(90,90,42,0.1)',   color: '#fbbf24' },
      'overexertion':   { borderColor: '#6a3a1a', backgroundColor: 'rgba(106,58,26,0.1)',  color: '#fb923c' },
      'breaking-point': { borderColor: vars.color.accent, backgroundColor: 'rgba(138,0,0,0.12)', color: vars.color.accentBright },
    },
  },
  defaultVariants: { level: 'controlled' },
});

export const bandIcon = style({
  fontSize: '1.2rem',
  flexShrink: 0,
});

export const bandLabel = style({
  fontFamily: vars.font.display,
  fontSize: '0.8rem',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  flexShrink: 0,
});

export const bandDesc = style({
  fontSize: vars.fontSize.micro,
  marginLeft: 'auto',
  opacity: 0.8,
});
