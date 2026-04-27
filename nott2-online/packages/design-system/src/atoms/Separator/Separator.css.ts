import { style } from '@vanilla-extract/css';
import { vars } from '../../tokens/theme.css';

export const separatorStyle = style({
  display: 'block',
  width: '100%',
  height: '1px',
  backgroundColor: vars.color.border,
  border: 'none',
  margin: `${vars.space.md} 0`,
});
