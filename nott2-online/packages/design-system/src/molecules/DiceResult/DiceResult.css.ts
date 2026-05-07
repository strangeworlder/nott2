import { style } from '@vanilla-extract/css';
import { vars } from '../../tokens/theme.css';

// Grid rows: [label] [value] [original] — auto-sized to content
// Grid columns: [d10] [op] [d4] [op] [total] — 1fr die cells stay equal-width regardless of label text
export const resultRoot = style({
  display: 'grid',
  gridTemplateColumns: '1fr auto 1fr auto 1fr',
  // Row 3 reserves space for the struck-through original value so
  // height stays stable whether the modifier is active or not.
  gridTemplateRows: 'auto auto minmax(0.75rem, auto)',
  alignItems: 'center',
  justifyItems: 'center',
  columnGap: vars.space.md,
  rowGap: 0,
  padding: vars.space.md,
  borderRadius: vars.radius.lg,
  backgroundColor: vars.color.surface,
  border: `1px solid ${vars.color.border}`,
});

// Each die cell spans all 3 row tracks and uses subgrid so its children
// (label / value / original) align to the shared row tracks.
export const dieCell = style({
  display: 'grid',
  gridRow: '1 / 4',
  gridTemplateRows: 'subgrid',
  alignItems: 'center',
  justifyItems: 'center',
  minWidth: 56,
  rowGap: vars.space.xs,
});

export const dieCellTotal = style({
  minWidth: 72,
});


