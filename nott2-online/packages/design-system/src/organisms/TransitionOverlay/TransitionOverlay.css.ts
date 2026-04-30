import { style, keyframes } from '@vanilla-extract/css';
import { vars } from '../../tokens/theme.css';

/* ── Backdrop ────────────────────────────────────────────────────────────── */

const fadeIn = keyframes({
  '0%':   { opacity: 0 },
  '100%': { opacity: 1 },
});

const fadeOut = keyframes({
  '0%':   { opacity: 1 },
  '100%': { opacity: 0 },
});

export const overlayBackdrop = style({
  position: 'fixed',
  inset: 0,
  zIndex: 9999,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'rgba(0, 0, 0, 0.85)',
  cursor: 'pointer',
  animationName: fadeIn,
  animationDuration: '400ms',
  animationFillMode: 'forwards',
  animationTimingFunction: 'ease-out',
});

export const overlayBackdropExiting = style({
  animationName: fadeOut,
  animationDuration: '400ms',
  animationFillMode: 'forwards',
  animationTimingFunction: 'ease-in',
});

/* ── Content container ───────────────────────────────────────────────────── */

const scaleIn = keyframes({
  '0%':   { opacity: 0, transform: 'scale(0.85)' },
  '100%': { opacity: 1, transform: 'scale(1)' },
});

export const overlayContent = style({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: vars.space.lg,
  animationName: scaleIn,
  animationDuration: '500ms',
  animationFillMode: 'forwards',
  animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
});
