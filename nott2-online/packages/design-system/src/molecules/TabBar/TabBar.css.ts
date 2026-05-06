import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { vars } from '../../tokens/theme.css';

export const tabBarRoot = style({
  display: 'flex',
  borderBottom: `1px solid ${vars.color.border}`,
  marginBottom: vars.space.md,
});

export const tabRecipe = recipe({
  base: {
    padding: `${vars.space.sm} ${vars.space.md}`,
    background: 'transparent',
    border: 'none',
    borderBottom: '2px solid transparent',
    cursor: 'pointer',
    fontFamily: vars.font.body,
    fontSize: vars.fontSize.label,
    fontWeight: 600,
    color: vars.color.textMuted,
    transition: `all ${vars.transition.fast}`,
    marginBottom: '-1px',
    ':hover': {
      color: vars.color.text,
    },
  },
  variants: {
    active: {
      true: {
        color: vars.color.accentBright,
        borderBottomColor: vars.color.accentBright,
        fontWeight: 600,
      },
      false: {},
    },
  },
  defaultVariants: { active: false },
});
