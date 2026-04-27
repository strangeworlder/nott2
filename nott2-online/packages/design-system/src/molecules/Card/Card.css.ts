import { recipe } from '@vanilla-extract/recipes';
import { style } from '@vanilla-extract/css';
import { vars } from '../../tokens/theme.css';

export const cardRecipe = recipe({
  base: {
    borderRadius: vars.radius.lg,
    border: `1px solid ${vars.color.border}`,
    padding: vars.space.lg,
    transition: `all ${vars.transition.normal}`,
  },
  variants: {
    variant: {
      default:     { backgroundColor: vars.color.surface },
      muted:       { backgroundColor: vars.color.background, opacity: 0.7 },
      highlighted: { backgroundColor: vars.color.surfaceElevated, borderColor: vars.color.borderActive },
      success:     { backgroundColor: vars.color.surface, borderColor: vars.color.success },
      failure:     { backgroundColor: vars.color.surface, borderColor: vars.color.accentBright },
      instruction: { backgroundColor: 'rgba(138, 0, 0, 0.06)', borderColor: vars.color.accent, fontStyle: 'italic' },
      ghost:       { backgroundColor: 'transparent', borderColor: 'transparent' },
    },
    interactive: {
      true: {
        cursor: 'pointer',
        ':hover': {
          borderColor: vars.color.borderActive,
          boxShadow: vars.shadow.glow,
          transform: 'translateY(-1px)',
        },
      },
      false: {},
    },
    noPadding: {
      true: { padding: 0 },
      false: {},
    },
  },
  defaultVariants: { variant: 'default', interactive: false, noPadding: false },
});

export const cardTitle = style({
  fontFamily: vars.font.display,
  fontSize: vars.fontSize.h3,
  color: vars.color.text,
  marginBottom: vars.space.md,
  marginTop: 0,
});
