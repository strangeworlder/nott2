import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { vars } from '../../tokens/theme.css';

export const gridBase = style({
  display: 'grid',
});

export const gridRecipe = recipe({
  base: gridBase,
  variants: {
    columns: {
      1: { gridTemplateColumns: 'repeat(1, 1fr)' },
      2: { gridTemplateColumns: 'repeat(2, 1fr)' },
      3: { gridTemplateColumns: 'repeat(3, 1fr)' },
      4: { gridTemplateColumns: 'repeat(4, 1fr)' },
      5: { gridTemplateColumns: 'repeat(5, 1fr)' },
      6: { gridTemplateColumns: 'repeat(6, 1fr)' },
      7: { gridTemplateColumns: 'repeat(7, 1fr)' },
      8: { gridTemplateColumns: 'repeat(8, 1fr)' },
      9: { gridTemplateColumns: 'repeat(9, 1fr)' },
      10: { gridTemplateColumns: 'repeat(10, 1fr)' },
      11: { gridTemplateColumns: 'repeat(11, 1fr)' },
      12: { gridTemplateColumns: 'repeat(12, 1fr)' },
    },
    gap: {
      none: { gap: 0 },
      xs: { gap: vars.space.xs },
      sm: { gap: vars.space.sm },
      md: { gap: vars.space.md },
      lg: { gap: vars.space.lg },
      xl: { gap: vars.space.xl },
    },
  },
  defaultVariants: {
    columns: 1,
    gap: 'sm',
  },
});
