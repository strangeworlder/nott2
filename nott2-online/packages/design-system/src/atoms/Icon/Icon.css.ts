import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { vars } from '../../tokens/theme.css';

/**
 * Shared color recipe applied to both SVG icons and Material Symbol spans.
 * For SVGs, `color` controls `currentColor` on path fills/strokes.
 * For Material Symbols, `color` controls the font glyph color.
 */
export const iconRecipe = recipe({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    verticalAlign: 'middle',
    lineHeight: 1,
  },
  variants: {
    color: {
      white: { color: vars.color.text },
      red: { color: vars.color.accentBright },
      muted: { color: vars.color.textMuted },
      success: { color: vars.color.successBright },
      inherit: { color: 'inherit' },
    },
  },
  defaultVariants: {
    color: 'inherit',
  },
});

/**
 * Additional styles for Material Symbols font rendering.
 * Applied alongside the color recipe on material icon spans.
 */
export const materialIconStyle = style({
  fontFamily: '"Material Symbols Rounded", sans-serif',
  fontWeight: 'normal',
  fontStyle: 'normal',
  lineHeight: 1,
  letterSpacing: 'normal',
  textTransform: 'none',
  whiteSpace: 'nowrap',
  wordWrap: 'normal',
  direction: 'ltr',
  WebkitFontSmoothing: 'antialiased',
  textRendering: 'optimizeLegibility',
  /**
   * Variable font axes:
   * FILL 0 = outlined, 1 = filled
   * wght  = weight (100–700)
   * GRAD  = grade (-50–200)
   * opsz  = optical size (20–48)
   */
  fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24",
});
