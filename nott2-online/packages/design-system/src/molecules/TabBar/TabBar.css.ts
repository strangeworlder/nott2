import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { vars } from '../../tokens/theme.css';

/* ─── Root container ─────────────────────────────────────────────────────────
 * A contained segment bar that sits on the card surface. Tabs fill
 * the space equally inside a bordered, rounded container.
 * ──────────────────────────────────────────────────────────────────────────── */
export const tabBarRoot = style({
  display: 'flex',
  background: vars.color.surface,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.md,
  padding: vars.space.xs,
  gap: vars.space.xs,
});

/* ─── Tab button recipe ──────────────────────────────────────────────────────
 * Each tab is a commanding, display-font label that follows the glow
 * escalation pattern on activation:
 *   rest     → transparent, muted text
 *   hover    → brand hover tint, white text
 *   active   → glowSubtle halo, accentBright text, bottom-edge indicator
 * ──────────────────────────────────────────────────────────────────────────── */
export const tabRecipe = recipe({
  base: {
    position: 'relative',
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: vars.space.xs,
    padding: `${vars.space.sm} ${vars.space.md}`,
    background: 'transparent',
    border: 'none',
    borderRadius: vars.radius.sm,
    cursor: 'pointer',
    overflow: 'hidden',

    /* Typography — commanding voice */
    fontFamily: vars.font.display,
    fontSize: vars.fontSize.label,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: vars.letterSpacing.normal,
    color: vars.color.textMuted,
    lineHeight: 1,

    transition: `color ${vars.transition.fast}, background ${vars.transition.fast}, box-shadow ${vars.transition.fast}`,

    /* Bottom-edge indicator slot (inactive = hidden) */
    '::after': {
      content: '""',
      position: 'absolute',
      bottom: 0,
      left: '20%',
      right: '20%',
      height: 2,
      borderRadius: '1px',
      background: 'transparent',
      transition: `all ${vars.transition.fast}`,
    },

    ':hover': {
      color: vars.color.text,
      background: 'rgba(138, 0, 0, 0.05)',
    },

    ':focus-visible': {
      outline: `2px solid ${vars.color.accentBright}`,
      outlineOffset: '-2px',
      borderRadius: vars.radius.sm,
    },

    '@media': {
      '(prefers-reduced-motion: reduce)': {
        transition: 'none',
      },
    },
  },
  variants: {
    active: {
      true: {
        color: vars.color.accentBright,
        background: 'rgba(138, 0, 0, 0.08)',
        boxShadow: vars.shadow.glowSubtle,

        /* Bottom-edge glow line — gradient from transparent → accent → transparent */
        '::after': {
          left: '10%',
          right: '10%',
          background: `linear-gradient(90deg, transparent, ${vars.color.accent}, transparent)`,
        },

        ':hover': {
          color: vars.color.accentBright,
          background: 'rgba(138, 0, 0, 0.1)',
          boxShadow: vars.shadow.glow,
        },
      },
      false: {},
    },
  },
  defaultVariants: { active: false },
});

/* ─── Icon inside tab ────────────────────────────────────────────────────── */
export const tabIcon = style({
  fontSize: '1.125rem',
  lineHeight: 1,
  flexShrink: 0,
});
