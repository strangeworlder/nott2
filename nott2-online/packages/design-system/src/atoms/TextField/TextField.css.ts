import { recipe } from '@vanilla-extract/recipes';
import { style, keyframes } from '@vanilla-extract/css';
import { vars } from '../../tokens/theme.css';

/* ── Shared base styles for both TextField and TextArea ────────────────────── */

const sharedInputBase = {
  fontFamily: vars.font.body,
  color: vars.color.text,
  backgroundColor: vars.color.surface,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.md,
  outline: 'none',
  transition: `all ${vars.transition.normal}`,
  width: '100%',
  boxSizing: 'border-box' as const,

  '::placeholder': {
    color: vars.color.textMuted,
    opacity: 0.6,
  },

  ':hover': {
    borderColor: vars.color.textMuted,
    backgroundColor: vars.color.surfaceElevated,
  },

  ':focus': {
    borderColor: vars.color.accentBright,
    backgroundColor: vars.color.surfaceElevated,
    boxShadow: `0 0 0 2px rgba(220, 38, 38, 0.15), ${vars.shadow.glow}`,
  },

  ':disabled': {
    opacity: 0.4,
    cursor: 'not-allowed',
    pointerEvents: 'none' as const,
  },
} as const;

/* ── TextField recipe ──────────────────────────────────────────────────────── */

export const textFieldRecipe = recipe({
  base: {
    ...sharedInputBase,
    display: 'block',
  },

  variants: {
    variant: {
      default: {},
      ghost: {
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        ':hover': {
          backgroundColor: 'rgba(255, 255, 255, 0.03)',
          borderColor: vars.color.border,
        },
        ':focus': {
          backgroundColor: vars.color.surface,
          borderColor: vars.color.accentBright,
          boxShadow: `0 0 0 2px rgba(220, 38, 38, 0.15), ${vars.shadow.glow}`,
        },
      },
    },

    size: {
      sm: { padding: `${vars.space.xs} ${vars.space.sm}`, fontSize: vars.fontSize.label },
      md: { padding: `${vars.space.sm} ${vars.space.md}`, fontSize: vars.fontSize.body },
      lg: { padding: `${vars.space.md} ${vars.space.md}`, fontSize: '1.125rem' },
    },

    hasError: {
      true: {
        borderColor: vars.color.accentBright,
        boxShadow: '0 0 0 1px rgba(220, 38, 38, 0.2)',
        ':hover': {
          borderColor: vars.color.accentBright,
        },
        ':focus': {
          borderColor: vars.color.accentBright,
          boxShadow: `0 0 0 2px rgba(220, 38, 38, 0.25), ${vars.shadow.glow}`,
        },
      },
      false: {},
    },
  },

  defaultVariants: {
    variant: 'default',
    size: 'md',
    hasError: false,
  },
});

/* ── TextArea recipe ───────────────────────────────────────────────────────── */

export const textAreaRecipe = recipe({
  base: {
    ...sharedInputBase,
    display: 'block',
    resize: 'vertical',
    lineHeight: 1.6,
    minHeight: '80px',
  },

  variants: {
    variant: {
      default: {},
      ghost: {
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        ':hover': {
          backgroundColor: 'rgba(255, 255, 255, 0.03)',
          borderColor: vars.color.border,
        },
        ':focus': {
          backgroundColor: vars.color.surface,
          borderColor: vars.color.accentBright,
          boxShadow: `0 0 0 2px rgba(220, 38, 38, 0.15), ${vars.shadow.glow}`,
        },
      },
    },

    size: {
      sm: { padding: `${vars.space.xs} ${vars.space.sm}`, fontSize: vars.fontSize.label },
      md: { padding: `${vars.space.sm} ${vars.space.md}`, fontSize: vars.fontSize.body },
      lg: { padding: `${vars.space.md} ${vars.space.md}`, fontSize: '1.125rem' },
    },

    resize: {
      none: { resize: 'none' },
      vertical: { resize: 'vertical' },
      horizontal: { resize: 'horizontal' },
      both: { resize: 'both' },
    },

    hasError: {
      true: {
        borderColor: vars.color.accentBright,
        boxShadow: '0 0 0 1px rgba(220, 38, 38, 0.2)',
        ':hover': {
          borderColor: vars.color.accentBright,
        },
        ':focus': {
          borderColor: vars.color.accentBright,
          boxShadow: `0 0 0 2px rgba(220, 38, 38, 0.25), ${vars.shadow.glow}`,
        },
      },
      false: {},
    },
  },

  defaultVariants: {
    variant: 'default',
    size: 'md',
    resize: 'vertical',
    hasError: false,
  },
});

/* ── Wrapper / label / helper text styles ──────────────────────────────────── */

export const fieldWrapper = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.xs,
  width: '100%',
});

export const labelStyle = style({
  fontFamily: vars.font.display,
  fontSize: vars.fontSize.label,
  fontWeight: 600,
  color: vars.color.text,
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
  userSelect: 'none',
});

export const requiredIndicator = style({
  color: vars.color.accentBright,
  marginLeft: '2px',
});

export const helperTextStyle = style({
  fontFamily: vars.font.body,
  fontSize: vars.fontSize.micro,
  color: vars.color.textMuted,
  lineHeight: 1.4,
  minHeight: '1em',
});

export const errorTextStyle = style({
  fontFamily: vars.font.body,
  fontSize: vars.fontSize.micro,
  color: vars.color.accentBright,
  lineHeight: 1.4,
  minHeight: '1em',
});

const pulseGlow = keyframes({
  '0%, 100%': { boxShadow: `0 0 0 1px rgba(220, 38, 38, 0.2)` },
  '50%': { boxShadow: `0 0 0 2px rgba(220, 38, 38, 0.35)` },
});

export const charCountStyle = style({
  fontFamily: vars.font.body,
  fontSize: vars.fontSize.micro,
  color: vars.color.textMuted,
  textAlign: 'right',
  fontVariantNumeric: 'tabular-nums',
  transition: `color ${vars.transition.fast}`,
});

export const charCountWarning = style({
  color: vars.color.accentBright,
});
