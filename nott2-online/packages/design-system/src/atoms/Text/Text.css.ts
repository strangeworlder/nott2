import { recipe } from '@vanilla-extract/recipes';
import { style, keyframes } from '@vanilla-extract/css';
import { vars } from '../../tokens/theme.css';

// ── Keyframes ─────────────────────────────────────────────────────────────────
const pulseAnimation = keyframes({
  '0%, 100%': { opacity: 1 },
  '50%': { opacity: 0.5 },
});

// ── Glow helpers ──────────────────────────────────────────────────────────────
export const glowRed = style({
  textShadow: `0 0 8px ${vars.color.accentBright}, 0 0 20px ${vars.color.accent}`,
});

export const glowGreen = style({
  textShadow: `0 0 8px ${vars.color.successBright}, 0 0 20px ${vars.color.success}`,
});

export const borderLeft = style({
  borderLeft: `4px solid ${vars.color.accent}`,
  paddingLeft: vars.space.md,
});

export const borderBottom = style({
  borderBottom: `1px solid ${vars.color.borderSubtle}`,
  paddingBottom: vars.space.xs,
});

export const animatePulse = style({
  animation: `${pulseAnimation} 2s ease-in-out infinite`,

  '@media': {
    '(prefers-reduced-motion: reduce)': {
      animation: 'none',
      opacity: 0.7,
    },
  },
});

// ── Text Recipe ───────────────────────────────────────────────────────────────
export const textRecipe = recipe({
  base: {
    display: 'block',
    margin: 0,
    padding: 0,
  },

  variants: {
    variant: {
      hero: {
        fontFamily: vars.font.display,
        fontSize: vars.fontSize.hero,
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: vars.letterSpacing.normal,
        lineHeight: 1.1,
      },
      h1: {
        fontFamily: vars.font.display,
        fontSize: vars.fontSize.h1,
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: vars.letterSpacing.normal,
        lineHeight: 1.15,
      },
      h2: {
        fontFamily: vars.font.display,
        fontSize: vars.fontSize.h2,
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        lineHeight: 1.2,
      },
      h3: {
        fontFamily: vars.font.display,
        fontSize: vars.fontSize.h3,
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        lineHeight: 1.3,
      },
      lead: {
        fontFamily: vars.font.body,
        fontSize: vars.fontSize.lead,
        fontWeight: 400,
        lineHeight: 1.7,
      },
      body: {
        fontFamily: vars.font.body,
        fontSize: vars.fontSize.body,
        fontWeight: 400,
        lineHeight: 1.65,
      },
      label: {
        fontFamily: vars.font.display,
        fontSize: vars.fontSize.label,
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: vars.letterSpacing.normal,
      },
      caption: {
        fontFamily: vars.font.body,
        fontSize: vars.fontSize.label,
        fontStyle: 'italic',
        lineHeight: 1.5,
      },
      quote: {
        fontFamily: vars.font.body,
        fontSize: vars.fontSize.quote,
        fontStyle: 'italic',
        lineHeight: 1.6,
      },
      flavor: {
        fontFamily: vars.font.display,
        fontSize: vars.fontSize.body,
        fontStyle: 'italic',
        lineHeight: 1.6,
      },
      micro: {
        fontFamily: vars.font.display,
        fontSize: vars.fontSize.micro,
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: vars.letterSpacing.wide,
      },
    },

    color: {
      white: { color: vars.color.text },
      red: { color: vars.color.accentBright },
      muted: { color: vars.color.textMuted },
      success: { color: vars.color.successBright },
    },

    align: {
      left: { textAlign: 'left' },
      center: { textAlign: 'center' },
      right: { textAlign: 'right' },
      justify: { textAlign: 'justify' },
    },

    leading: {
      none: { lineHeight: 1 },
      tight: { lineHeight: 1.25 },
      snug: { lineHeight: 1.375 },
      normal: { lineHeight: 1.5 },
      relaxed: { lineHeight: 1.625 },
      loose: { lineHeight: 2 },
    },
  },

  defaultVariants: {
    variant: 'body',
    color: 'white',
  },
});
