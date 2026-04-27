import { style, keyframes } from '@vanilla-extract/css';
import { vars } from '../../tokens/theme.css';

// ── Animations ──────────────────────────────────────────────────────────────

const fadeInScale = keyframes({
  '0%': { opacity: 0, transform: 'scale(0.85)' },
  '100%': { opacity: 1, transform: 'scale(1)' },
});

// ── Root ────────────────────────────────────────────────────────────────────

export const deckRoot = style({
  display: 'inline-flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: vars.space.xs,
});

// ── Label ───────────────────────────────────────────────────────────────────

export const deckLabel = style({
  position: 'relative',
  zIndex: 15,
  fontFamily: vars.font.body,
  fontSize: vars.fontSize.micro,
  color: vars.color.textMuted,
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  lineHeight: 1,
});

// ── Stack container ─────────────────────────────────────────────────────────

export const deckStack = style({
  position: 'relative',
  width: '52px',
  height: '72px',
  marginTop: '14px',
  transition: `transform ${vars.transition.fast}`,
});

// compact prop no longer changes stack size — PlayingCard compact is always 52×72px
export const deckStackCompact = style({});

export const deckStackInteractive = style({
  cursor: 'pointer',
  ':hover': { transform: 'scale(1.05)' },
  ':focus-visible': {
    outline: `2px solid ${vars.color.accentBright}`,
    outlineOffset: '2px',
    borderRadius: vars.radius.md,
  },
});

// ── Count overlay ───────────────────────────────────────────────────────────

export const deckCount = style({
  position: 'absolute',
  inset: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontFamily: vars.font.display,
  fontSize: '1.25rem',
  fontWeight: 700,
  color: vars.color.text,
  zIndex: 10,
  pointerEvents: 'none',
});

export const deckCountCompact = style({
  fontSize: '0.875rem',
});

// ── Status badge ────────────────────────────────────────────────────────────

export const deckStatusBadge = style({
  position: 'absolute',
  bottom: '-6px',
  left: '50%',
  transform: 'translateX(-50%)',
  zIndex: 20,
  fontFamily: vars.font.body,
  fontSize: '0.5rem',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  padding: '1px 6px',
  borderRadius: vars.radius.full,
  whiteSpace: 'nowrap',
  animation: `${fadeInScale} 300ms ease-out both`,
  pointerEvents: 'none',
});

export const deckStatusShuffled = style({
  backgroundColor: vars.color.accent,
  color: vars.color.text,
  boxShadow: vars.shadow.glow,
});

export const deckStatusEmpty = style({
  backgroundColor: vars.color.surface,
  color: vars.color.textMuted,
  border: `1px solid ${vars.color.border}`,
});

// ── Hover/Focus status reveal ───────────────────────────────────────────────

export const deckStatusHover = style({
  position: 'absolute',
  bottom: '-6px',
  left: '50%',
  transform: 'translateX(-50%)',
  zIndex: 20,
  fontFamily: vars.font.body,
  fontSize: '0.5rem',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  padding: '1px 6px',
  borderRadius: vars.radius.full,
  whiteSpace: 'nowrap',
  backgroundColor: vars.color.surfaceElevated,
  color: vars.color.textMuted,
  border: `1px solid ${vars.color.border}`,
  opacity: 0,
  transition: `opacity ${vars.transition.fast}`,
  pointerEvents: 'none',
  selectors: {
    [`${deckStack}:hover &, ${deckStack}:focus-visible &`]: {
      opacity: 1,
    },
  },
});

// ── Empty state ─────────────────────────────────────────────────────────────

export const deckEmpty = style({
  position: 'absolute',
  width: '100%',
  height: '100%',
  border: `1px dashed ${vars.color.border}`,
  borderRadius: vars.radius.md,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: vars.color.textMuted,
  fontSize: '1.25rem',
});

export const deckEmptyCompact = style({
  fontSize: '0.875rem',
});
