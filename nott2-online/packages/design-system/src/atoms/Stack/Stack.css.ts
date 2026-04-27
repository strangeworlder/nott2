import { recipe } from '@vanilla-extract/recipes';
import { vars } from '../../tokens/theme.css';

export const stackRecipe = recipe({
  base: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  variants: {
    gap: {
      xs: { gap: vars.space.xs },
      sm: { gap: vars.space.sm },
      md: { gap: vars.space.md },
      lg: { gap: vars.space.lg },
      xl: { gap: vars.space.xl },
    },
  },
  defaultVariants: {
    gap: 'md',
  },
});
