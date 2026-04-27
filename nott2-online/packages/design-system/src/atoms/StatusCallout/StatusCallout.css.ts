import { recipe } from '@vanilla-extract/recipes';
import { style } from '@vanilla-extract/css';
import { vars } from '../../tokens/theme.css';

export const statusCalloutRecipe = recipe({
  base: {
    padding: `${vars.space.sm} ${vars.space.md}`,
    borderRadius: vars.radius.md,
    border: '1px solid',
    fontSize: vars.fontSize.label,
    lineHeight: 1.5,
    display: 'flex',
    alignItems: 'flex-start',
    gap: vars.space.sm,
  },
  variants: {
    variant: {
      info: {
        backgroundColor: 'rgba(59, 130, 246, 0.06)',
        borderColor: 'rgba(59, 130, 246, 0.25)',
        color: 'rgba(147, 197, 253, 0.9)',
      },
      warning: {
        backgroundColor: 'rgba(234, 179, 8, 0.06)',
        borderColor: 'rgba(234, 179, 8, 0.3)',
        color: '#fbbf24',
      },
      danger: {
        backgroundColor: 'rgba(220, 38, 38, 0.08)',
        borderColor: vars.color.accentBright,
        color: vars.color.accentBright,
      },
      success: {
        backgroundColor: 'rgba(45, 90, 45, 0.1)',
        borderColor: vars.color.success,
        color: '#4ade80',
      },
      highlight: {
        backgroundColor: 'rgba(139, 92, 246, 0.08)',
        borderColor: 'rgba(139, 92, 246, 0.35)',
        color: 'rgba(196, 181, 253, 0.9)',
      },
    },
  },
  defaultVariants: {
    variant: 'info',
  },
});

export const calloutContent = style({
  flex: 1,
});
