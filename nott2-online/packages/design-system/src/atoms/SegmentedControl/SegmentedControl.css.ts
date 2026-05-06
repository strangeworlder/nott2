import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { vars } from '../../tokens/theme.css';

export const segmentedRoot = style({
  display: 'inline-flex',
  borderRadius: vars.radius.md,
  border: `1px solid ${vars.color.border}`,
  overflow: 'hidden',
  background: 'transparent',
});

export const segmentRecipe = recipe({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: `${vars.space.sm} ${vars.space.md}`,
    fontFamily: vars.font.display,
    fontSize: vars.fontSize.micro,
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: vars.letterSpacing.normal,
    border: 'none',
    borderRight: `1px solid ${vars.color.border}`,
    cursor: 'pointer',
    transition: `all ${vars.transition.normal}`,
    background: 'transparent',
    color: vars.color.textMuted,
    outline: 'none',
    minWidth: '60px',
    selectors: {
      '&:last-child': {
        borderRight: 'none',
      },
      '&:focus-visible': {
        outline: `2px solid ${vars.color.accentBright}`,
        outlineOffset: '-2px',
      },
    },
    ':hover': {
      color: vars.color.text,
      backgroundColor: 'rgba(255,255,255,0.04)',
    },
  },
  variants: {
    selected: {
      true: {
        color: vars.color.successBright,
        backgroundColor: 'rgba(45, 90, 45, 0.12)',
        boxShadow: vars.shadow.glowGreenSubtle,
        ':hover': {
          color: vars.color.successBright,
          backgroundColor: 'rgba(45, 90, 45, 0.18)',
        },
      },
      false: {},
    },
    disabled: {
      true: {
        opacity: 0.35,
        cursor: 'not-allowed',
        ':hover': {
          color: vars.color.textMuted,
          backgroundColor: 'transparent',
        },
      },
      false: {},
    },
  },
  defaultVariants: {
    selected: false,
    disabled: false,
  },
});
