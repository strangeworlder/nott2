import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { vars } from '../../tokens/theme.css';

export const iconRecipe = recipe({
  base: {
    display: 'inline-block',
    flexShrink: 0,
    verticalAlign: 'middle',
    lineHeight: 1,
  },
  variants: {
    color: {
      white: { color: vars.color.text },
      red: { color: vars.color.accentBright },
      muted: { color: vars.color.textMuted },
      success: { color: '#4ade80' },
      inherit: { color: 'inherit' },
    },
  },
  defaultVariants: {
    color: 'inherit',
  },
});
