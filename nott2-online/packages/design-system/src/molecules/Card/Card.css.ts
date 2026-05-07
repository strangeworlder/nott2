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
    complete: {
      true: { borderColor: vars.color.success },
      false: {},
    },
  },
  defaultVariants: { variant: 'default', interactive: false, noPadding: false, complete: false },
});

export const cardTitle = style({
  fontFamily: vars.font.display,
  fontSize: vars.fontSize.h3,
  color: vars.color.text,
  marginBottom: vars.space.md,
  marginTop: 0,
});

export const cardTitleRow = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.sm,
  marginBottom: vars.space.md,
  marginTop: 0,
});

export const cardTitleText = style({
  fontFamily: vars.font.display,
  fontSize: vars.fontSize.h3,
  margin: 0,
  lineHeight: 1.2,
  transition: `color ${vars.transition.normal}`,
});

export const completionIndicator = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.xs,
  fontSize: vars.fontSize.micro,
  color: vars.color.success,
  marginTop: vars.space.xs,
});

export const collapsibleContent = style({
  overflow: 'hidden',
  transition: `max-height ${vars.transition.normal}, opacity ${vars.transition.normal}`,
});

export const collapsibleContentOpen = style({
  maxHeight: '2000px',
  opacity: 1,
});

export const collapsibleContentClosed = style({
  maxHeight: '0px',
  opacity: 0,
});

export const collapseToggle = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.xs,
  cursor: 'pointer',
  background: 'none',
  border: 'none',
  color: vars.color.textMuted,
  fontSize: vars.fontSize.micro,
  padding: `${vars.space.xs} 0`,
  marginTop: vars.space.sm,
  transition: `color ${vars.transition.normal}`,
  ':hover': {
    color: vars.color.text,
  },
});
