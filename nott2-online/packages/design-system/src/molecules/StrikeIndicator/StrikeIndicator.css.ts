import { style } from '@vanilla-extract/css';
import { vars } from '../../tokens/theme.css';

export const indicatorRoot = style({
  display: 'flex',
  gap: vars.space.xs,
  alignItems: 'center',
});

export const strikeMark = style({
  color: vars.color.accentBright,
  fontWeight: 700,
  fontSize: '1.25rem',
  lineHeight: 1,
  transition: `all ${vars.transition.fast}`,
  selectors: {
    '&[data-animated="true"]': {
      animation: 'strikeIn 0.3s ease-out',
    },
  },
});

export const strikeEmpty = style({
  color: vars.color.border,
  fontWeight: 400,
  fontSize: '1.25rem',
  lineHeight: 1,
});

export const skullMark = style({
  color: vars.color.textMuted,
  fontSize: '1.5rem',
  lineHeight: 1,
  selectors: {
    '&[data-animated="true"]': {
      animation: 'strikeIn 0.3s ease-out',
    },
  },
});
