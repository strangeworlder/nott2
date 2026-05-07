import { style } from '@vanilla-extract/css';
import { vars } from '../../tokens/theme.css';

export const dieSelectorRoot = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.sm,
});


