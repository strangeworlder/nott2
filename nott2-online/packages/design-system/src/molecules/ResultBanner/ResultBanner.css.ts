import { recipe } from '@vanilla-extract/recipes';
import { style } from '@vanilla-extract/css';
import { vars } from '../../tokens/theme.css';

export const bannerRecipe = recipe({
  base: {
    borderRadius: vars.radius.lg,
    border: '1px solid',
    padding: vars.space.md,
    textAlign: 'center',
  },
  variants: {
    outcome: {
      success: {
        borderColor: vars.color.success,
        backgroundColor: 'rgba(74, 222, 128, 0.06)',
      },
      failure: {
        borderColor: vars.color.accentBright,
        backgroundColor: 'rgba(220, 38, 38, 0.06)',
      },
    },
  },
  defaultVariants: { outcome: 'success' },
});

export const bannerWord = style({
  fontFamily: vars.font.display,
  fontSize: vars.fontSize.h2,
  fontWeight: 700,
  marginBottom: vars.space.xs,
  lineHeight: 1,
});

export const bannerWordSuccess = style({ color: '#4ade80' });
export const bannerWordFailure = style({ color: vars.color.accentBright });

export const bannerDetail = style({
  fontSize: vars.fontSize.label,
  color: vars.color.textMuted,
});
