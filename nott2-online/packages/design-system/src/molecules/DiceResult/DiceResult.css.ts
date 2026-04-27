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

export const dieLabel = style({
  fontSize: '0.65rem',
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  color: vars.color.textMuted,
  fontWeight: 600,
  // Row 1 — label track
  gridRow: 1,
});

export const dieValue = style({
  fontFamily: vars.font.display,
  fontSize: vars.fontSize.h3,
  fontWeight: 700,
  color: vars.color.text,
  lineHeight: 1,
  // Row 2 — value track
  gridRow: 2,
});

export const dieValueTotal = style({
  fontSize: vars.fontSize.h2,
  color: vars.color.text,
});

export const dieValueModified = style({
  color: vars.color.accentBright,
});

export const dieOriginal = style({
  fontSize: '0.6rem',
  color: vars.color.textMuted,
  textDecoration: 'line-through',
  // Row 3 — original track (empty for unmodified cells)
  gridRow: 3,
});

// Operators span all 3 row tracks so they stay vertically centred
export const operatorStyle = style({
  fontFamily: vars.font.display,
  fontSize: vars.fontSize.h3,
  color: vars.color.textMuted,
  fontWeight: 300,
  lineHeight: 1,
  gridRow: '1 / 4',
  alignSelf: 'center',
});
