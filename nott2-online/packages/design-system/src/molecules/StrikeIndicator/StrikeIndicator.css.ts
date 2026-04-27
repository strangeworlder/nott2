import { style } from '@vanilla-extract/css';
import { vars } from '../../tokens/theme.css';

export const indicatorRoot = style({
  display: 'flex',
  gap: vars.space.xs,
  alignItems: 'center',
});

/** Shared fixed container — keeps every slot the same footprint. */
const strikeSlot = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '1.5rem',
  height: '1.5rem',
  flexShrink: 0,
});

export const strikeMark = style([strikeSlot, {
  color: vars.color.accentBright,
  fontWeight: 800,
  fontSize: '1.25rem',
  lineHeight: 1,
  textShadow: '0 0 8px rgba(220, 38, 38, 0.6)',
  transition: `all ${vars.transition.fast}`,
  selectors: {
    '&[data-animated="true"]': {
      animation: 'strikeIn 0.3s ease-out',
    },
  },
}]);

export const strikeEmpty = style([strikeSlot, {
  color: vars.color.textMuted,
  fontWeight: 300,
  fontSize: '1rem',
  lineHeight: 1,
  opacity: 0.55,
}]);

export const skullMark = style({
  color: vars.color.text,
  fontSize: '1.5rem',
  lineHeight: 1,
  selectors: {
    '&[data-animated="true"]': {
      animation: 'strikeIn 0.3s ease-out',
    },
  },
});
