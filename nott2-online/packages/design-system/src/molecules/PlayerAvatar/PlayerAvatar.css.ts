import { recipe } from '@vanilla-extract/recipes';
import { style } from '@vanilla-extract/css';
import { vars } from '../../tokens/theme.css';

export const avatarRecipe = recipe({
  base: {
    display: 'flex',
    alignItems: 'center',
    gap: vars.space.sm,
    borderRadius: vars.radius.lg,
    border: `1px solid ${vars.color.border}`,
    backgroundColor: vars.color.surface,
    position: 'relative',
    transition: `all ${vars.transition.normal}`,
  },
  variants: {
    size: {
      sm: { padding: `${vars.space.xs} ${vars.space.sm}`, fontSize: vars.fontSize.label },
      md: { padding: `${vars.space.sm} ${vars.space.md}`, fontSize: vars.fontSize.body },
      lg: { padding: `${vars.space.md} ${vars.space.lg}`, fontSize: vars.fontSize.bodyLg },
    },
    active: {
      true: {
        borderColor: vars.color.accentBright,
        boxShadow: vars.shadow.glow,
      },
      false: {},
    },
  },
  defaultVariants: { size: 'md', active: false },
});

export const avatarSymbol = style({
  fontFamily: vars.font.display,
  fontSize: '1.25em',
  lineHeight: 1,
  color: vars.color.accentBright,
});

export const avatarMeta = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
  minWidth: 0,
});

export const avatarName = style({
  fontFamily: vars.font.body,
  color: vars.color.text,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  fontWeight: 600,
});

export const onlineIndicator = style({
  width: '8px',
  height: '8px',
  borderRadius: vars.radius.full,
  flexShrink: 0,
  selectors: {
    '&[data-online="true"]': { backgroundColor: vars.color.successBright },
    '&[data-online="false"]': { backgroundColor: vars.color.textMuted },
  },
});
