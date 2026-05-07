import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { vars } from '../../tokens/theme.css';

export const tileBase = style({
  width: '100%',
  aspectRatio: '1 / 1', // enforce square
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: vars.radius.md,
  border: `1px solid ${vars.color.border}`,
  backgroundColor: vars.color.surface,
  color: vars.color.textMuted,
  fontFamily: vars.font.display,
  fontSize: vars.fontSize.body,
  fontWeight: 600,
  cursor: 'pointer',
  transition: `all ${vars.transition.fast}`,
  ':hover': {
    borderColor: vars.color.textMuted,
    color: vars.color.text,
  },
  ':disabled': {
    cursor: 'not-allowed',
    opacity: 0.5,
  },
});

export const tileRecipe = recipe({
  base: tileBase,
  variants: {
    selected: {
      true: {
        color: vars.color.text,
      },
      false: {},
    },
    variant: {
      default: {},
      danger: {},
      neutral: {},
    },
  },
  compoundVariants: [
    {
      variants: { selected: true, variant: 'default' },
      style: {
        borderColor: vars.color.successBright,
        backgroundColor: 'rgba(74, 222, 128, 0.1)',
        boxShadow: vars.shadow.glowGreenSubtle,
      },
    },
    {
      variants: { selected: true, variant: 'danger' },
      style: {
        borderColor: vars.color.accentBright,
        backgroundColor: 'rgba(138, 0, 0, 0.15)',
        boxShadow: vars.shadow.glowIntense,
      },
    },
    {
      variants: { selected: true, variant: 'neutral' },
      style: {
        borderColor: vars.color.accentBright, // generic accent for neutral
        backgroundColor: 'rgba(138, 0, 0, 0.15)',
        boxShadow: vars.shadow.glow,
      },
    },
  ],
  defaultVariants: {
    selected: false,
    variant: 'default',
  },
});
