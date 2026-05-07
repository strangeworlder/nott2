import { recipe } from '@vanilla-extract/recipes';
import { vars } from '../../tokens/theme.css';

export const badgeRecipe = recipe({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '2px 10px',
    borderRadius: vars.radius.sm,
    fontFamily: vars.font.display,
    fontSize: vars.fontSize.micro,
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: vars.letterSpacing.wide,
    border: '1px solid transparent',
    lineHeight: 1.6,
  },

  variants: {
    variant: {
      default: {
        backgroundColor: 'rgba(25,25,25,0.8)',
        color: vars.color.textMuted,
        borderColor: 'transparent',
      },
      outline: {
        backgroundColor: 'transparent',
        color: vars.color.textMuted,
        borderColor: vars.color.borderSubtle,
      },
      red: {
        backgroundColor: 'rgba(138,0,0,0.1)',
        color: vars.color.accentBright,
        borderColor: 'rgba(138,0,0,0.3)',
      },
      success: {
        backgroundColor: 'rgba(45,90,45,0.15)',
        color: vars.color.successBright,
        borderColor: 'rgba(45,90,45,0.3)',
      },
      warning: {
        backgroundColor: 'rgba(251,191,36,0.1)',
        color: vars.color.warning,
        borderColor: 'rgba(251,191,36,0.2)',
      },
    },
  },

  defaultVariants: {
    variant: 'default',
  },
});
