import { recipe } from '@vanilla-extract/recipes';
import { vars } from '../../tokens/theme.css';

export const rowRecipe = recipe({
  base: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  variants: {
    gap: {
      xs: { gap: vars.space.xs },
      sm: { gap: vars.space.sm },
      md: { gap: vars.space.md },
      lg: { gap: vars.space.lg },
      xl: { gap: vars.space.xl },
    },
    wrap: {
      true:  { flexWrap: 'wrap' },
      false: { flexWrap: 'nowrap' },
    },
    justify: {
      start:   { justifyContent: 'flex-start' },
      center:  { justifyContent: 'center' },
      end:     { justifyContent: 'flex-end' },
      between: { justifyContent: 'space-between' },
    },
    align: {
      start:   { alignItems: 'flex-start' },
      center:  { alignItems: 'center' },
      end:     { alignItems: 'flex-end' },
      stretch: { alignItems: 'stretch' },
    },
  },
  defaultVariants: {
    gap: 'sm',
    wrap: false,
    justify: 'start',
    align: 'center',
  },
});
