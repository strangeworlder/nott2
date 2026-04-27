import { style } from '@vanilla-extract/css';
import { vars } from '../../tokens/theme.css';

export const panelRoot = style({
  display: 'flex',
  flexDirection: 'column',
  padding: vars.space.md,
  gap: vars.space.md,
  flex: 1,
  overflowY: 'auto',
  maxWidth: '640px',
  width: '100%',
  alignSelf: 'center',
});

export const panelStack = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.md,
});
