import { style, keyframes } from '@vanilla-extract/css';
import { vars } from '../../tokens/theme.css';

// ── Animations ──────────────────────────────────────────────────────────────

const fadeInScale = keyframes({
  '0%': { opacity: 0, transform: 'scale(0.85)' },
  '100%': { opacity: 1, transform: 'scale(1)' },
});

// ── Glow pulse — gold/crimson box-shadow that breathes, matching CardMatt ───
// Dimensions are proportional to Deck's smaller size.
// Colors reference tokens; blur/spread are component-specific.
const glowPulse = keyframes({
  '0%, 100%': { boxShadow: `0 0 8px 2px color-mix(in srgb, ${vars.color.gold} 40%, transparent), 0 0 24px 4px color-mix(in srgb, ${vars.color.gold} 20%, transparent)` },
  '50%':      { boxShadow: `0 0 16px 6px color-mix(in srgb, ${vars.color.goldBright} 70%, transparent), 0 0 40px 10px color-mix(in srgb, ${vars.color.goldBright} 35%, transparent)` },
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
  fontWeight: 600,
  color: vars.color.textMuted,
  textTransform: 'uppercase',
  letterSpacing: vars.letterSpacing.wide,
  lineHeight: 1,
});

// ── Stack container ─────────────────────────────────────────────────────────

export const deckStack = style({
  position: 'relative',
  width: '52px',
  height: '72px',
  marginTop: vars.space.md,
  transition: `transform ${vars.transition.fast}`,
});

// compact prop no longer changes stack size — PlayingCard compact is always 52×72px
export const deckStackCompact = style({});

export const deckStackInteractive = style({
  cursor: 'pointer',
  ':hover': {
    transform: 'scale(1.05)',
    boxShadow: vars.shadow.glow,
  },
  ':focus-visible': {
    outline: `2px solid ${vars.color.accentBright}`,
    outlineOffset: '2px',
    borderRadius: vars.radius.md,
  },
});

// ── Glow variant — pulsing amber/crimson halo signalling drawability ─────────
export const deckStackGlow = style({
  borderRadius: vars.radius.md,
  animation: `${glowPulse} 2.5s ease-in-out infinite`,

  '@media': {
    '(prefers-reduced-motion: reduce)': {
      animation: 'none',
      boxShadow: vars.shadow.beacon,
    },
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
  fontSize: vars.fontSize.h3,
  fontWeight: 700,
  color: vars.color.text,
  zIndex: 10,
  pointerEvents: 'none',
});

export const deckCountCompact = style({
  fontSize: vars.fontSize.label,
});

// ── Status badge wrapper ────────────────────────────────────────────────────
// Positions the Badge atom at the bottom-centre of the deck stack.
// Visual styling (colors, font, border) lives in the Badge component.

export const deckStatusBadgeWrapper = style({
  position: 'absolute',
  bottom: '-6px',
  left: '50%',
  transform: 'translateX(-50%)',
  zIndex: 20,
  whiteSpace: 'nowrap',
  animation: `${fadeInScale} 300ms ease-out both`,
  pointerEvents: 'none',
});

// ── Hover/Focus status reveal ───────────────────────────────────────────────

export const deckStatusHover = style({
  position: 'absolute',
  bottom: '-6px',
  left: '50%',
  transform: 'translateX(-50%)',
  zIndex: 20,
  fontFamily: vars.font.body,
  fontSize: vars.fontSize.nano,
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: vars.letterSpacing.normal,
  padding: '2px 8px',
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
  fontSize: vars.fontSize.h3,
});

export const deckEmptyCompact = style({
  fontSize: vars.fontSize.label,
});
