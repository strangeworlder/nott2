import { recipe } from '@vanilla-extract/recipes';
import { vars } from '../../tokens/theme.css';

export const buttonRecipe = recipe({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: vars.font.display,
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    border: '1px solid transparent',
    borderRadius: vars.radius.md,
    cursor: 'pointer',
    transition: `all ${vars.transition.normal}`,
    textDecoration: 'none',
    whiteSpace: 'nowrap',
    outline: 'none',
    ':focus-visible': {
      outline: `2px solid ${vars.color.accentBright}`,
      outlineOffset: '2px',
    },
    ':disabled': {
      opacity: 0.4,
      cursor: 'not-allowed',
      pointerEvents: 'none',
    },
  },

  variants: {
    variant: {
      primary: {
        backgroundColor: vars.color.accent,
        color: vars.color.text,
        borderColor: 'transparent',
        boxShadow: `0 0 10px rgba(138, 0, 0, 0.5)`,
        ':hover': {
          backgroundColor: vars.color.accentBright,
          boxShadow: vars.shadow.glow,
        },
      },
      secondary: {
        backgroundColor: 'transparent',
        color: vars.color.text,
        borderColor: vars.color.textMuted,
        ':hover': {
          borderColor: vars.color.accentBright,
          color: vars.color.accentBright,
          backgroundColor: 'rgba(138, 0, 0, 0.05)',
        },
      },
      ghost: {
        backgroundColor: 'transparent',
        color: vars.color.text,
        borderColor: 'transparent',
        ':hover': {
          color: vars.color.accentBright,
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
        },
      },
      debug: {
        backgroundColor: 'transparent',
        color: '#4ade80',
        borderColor: 'rgba(45, 90, 45, 0.4)',
        ':hover': {
          borderColor: '#4ade80',
          backgroundColor: 'rgba(45, 90, 45, 0.1)',
        },
      },
    },

    size: {
      xs: { padding: '4px 8px', fontSize: '0.75rem' },
      sm: { padding: '6px 12px', fontSize: '0.8125rem' },
      md: { padding: '8px 24px', fontSize: vars.fontSize.body },
      lg: { padding: '12px 32px', fontSize: '1.125rem' },
      xl: { padding: '16px 48px', fontSize: '1.25rem' },
    },

    block: {
      true: { width: '100%' },
      false: {},
    },
  },

  defaultVariants: {
    variant: 'primary',
    size: 'md',
    block: false,
  },
});
