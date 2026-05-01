import { style, keyframes } from '@vanilla-extract/css';
import { vars } from '../../tokens/theme.css';

/* ── Backdrop entry / exit ───────────────────────────────────────────────── */

const backdropIn = keyframes({
  '0%': { opacity: 0 },
  '100%': { opacity: 1 },
});

const backdropOut = keyframes({
  '0%': { opacity: 1 },
  '100%': { opacity: 0 },
});

/* ── Center panel slam-in / drift-out ────────────────────────────────────── */

const panelSlam = keyframes({
  '0%': { opacity: 0, transform: 'translateY(-48px) scale(0.96)' },
  '100%': { opacity: 1, transform: 'translateY(0) scale(1)' },
});

const panelExit = keyframes({
  '0%': { opacity: 1, transform: 'translateY(0) scale(1)' },
  '100%': { opacity: 0, transform: 'translateY(-24px) scale(0.97)' },
});

/* ── Act numeral flicker — VHS power-on effect ───────────────────────────── */

const numeralFlicker = keyframes({
  '0%': { opacity: 0, textShadow: 'none' },
  '15%': { opacity: 0.9, textShadow: `0 0 40px rgba(220, 38, 38, 0.9), 0 0 80px rgba(220, 38, 38, 0.5)` },
  '20%': { opacity: 0.4 },
  '25%': { opacity: 1, textShadow: `0 0 20px rgba(220, 38, 38, 0.7), 0 0 60px rgba(220, 38, 38, 0.4)` },
  '30%': { opacity: 0.6 },
  '40%': { opacity: 1, textShadow: `0 0 24px rgba(220, 38, 38, 0.8), 0 0 60px rgba(220, 38, 38, 0.4)` },
  '100%': { opacity: 1, textShadow: `0 0 24px rgba(220, 38, 38, 0.8), 0 0 60px rgba(220, 38, 38, 0.4)` },
});

/* ── Sub-content fade up ─────────────────────────────────────────────────── */

const fadeUp = keyframes({
  '0%': { opacity: 0, transform: 'translateY(12px)' },
  '100%': { opacity: 1, transform: 'translateY(0)' },
});

/* ── Dismiss hint pulse ──────────────────────────────────────────────────── */

const hintFade = keyframes({
  '0%': { opacity: 0 },
  '100%': { opacity: 0.55 },
});



/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/* Backdrop — full-screen peeling-wall texture, nearly opaque                */
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export const actBreakBackdrop = style({
  position: 'fixed',
  inset: 0,
  zIndex: 15000,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',

  // Peeling-paint wall texture — same as game page, feels like walls closing in
  backgroundColor: '#1a0505',
  backgroundImage: [
    // Radial vignette — deepen corners, focus center
    'radial-gradient(ellipse at 50% 50%, rgba(30,0,0,0.0) 30%, rgba(0,0,0,0.75) 100%)',
    'url(/textures/peeling-paint-bg.png)',
  ].join(', '),
  backgroundSize: ['100% 100%', 'cover'].join(', '),
  backgroundBlendMode: ['normal', 'multiply'].join(', '),

  animationName: backdropIn,
  animationDuration: '300ms',
  animationFillMode: 'forwards',
  animationTimingFunction: 'ease-out',
});

export const actBreakBackdropExiting = style({
  animationName: backdropOut,
  animationDuration: '350ms',
  animationFillMode: 'forwards',
  animationTimingFunction: 'ease-in',
});

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/* Center panel — VHS title-card surface                                     */
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export const actBreakPanel = style({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: vars.space.lg,
  width: 'min(680px, 90vw)',
  padding: `${vars.space['3xl']} ${vars.space['2xl']}`,
  overflow: 'hidden',

  // VHS tape surface — dark, scratched, degraded
  backgroundColor: '#5a0595',
  backgroundImage: [
    // Scanlines — thin horizontal repeat
    'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.18) 2px, rgba(0,0,0,0.18) 4px)',
    // VHS grain texture tile
    'url(/textures/vhs-grain.png)',
  ].join(', '),
  backgroundSize: ['100% 4px', '512px 512px'].join(', '),
  backgroundBlendMode: ['normal', 'multiply'].join(', '),
  animationName: panelSlam,
  animationDuration: '600ms',
  animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
  animationFillMode: 'forwards',

  // Blood-red top and bottom borders — slasher title card framing
  borderTop: `3px solid ${vars.color.accentBright}`,
  borderBottom: `3px solid ${vars.color.accentBright}`,
  borderLeft: 'none',
  borderRight: 'none',

  // Crimson inner glow
  boxShadow: [
    `inset 0 0 60px rgba(138, 0, 0, 0.25)`,
    `0 0 80px rgba(138, 0, 0, 0.35)`,
    `0 0 160px rgba(138, 0, 0, 0.15)`,
  ].join(', '),
});

export const actBreakPanelExiting = style({
  animation: `${panelExit} 300ms ease-in forwards`,
});

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/* ACT label — small uppercase tracking above the numeral                    */
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export const actBreakLabel = style({
  fontFamily: vars.font.body,
  fontSize: vars.fontSize.label,
  fontWeight: 700,
  letterSpacing: '0.35em',
  textTransform: 'uppercase',
  color: vars.color.accentBright,
  opacity: 0,
  animationName: fadeUp,
  animationDuration: '500ms',
  animationDelay: '200ms',
  animationFillMode: 'forwards',
  animationTimingFunction: 'ease-out',
  userSelect: 'none',
});

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/* Roman numeral / "FINALE" — hero element                                   */
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export const actBreakNumeral = style({
  fontFamily: vars.font.display,
  fontSize: 'clamp(5rem, 14vw, 9rem)',
  fontWeight: 900,
  lineHeight: 1,
  color: vars.color.accentBright,
  opacity: 0,
  animationName: numeralFlicker,
  animationDuration: '1.2s',
  animationDelay: '350ms',
  animationFillMode: 'forwards',
  animationTimingFunction: 'ease-out',
  userSelect: 'none',
});

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/* Divider rule — thin horizontal separator                                  */
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export const actBreakDivider = style({
  width: '60%',
  height: '1px',
  backgroundColor: vars.color.accent,
  opacity: 0,
  animationName: fadeUp,
  animationDuration: '400ms',
  animationDelay: '800ms',
  animationFillMode: 'forwards',
  animationTimingFunction: 'ease-out',
});

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/* Title — act name in display font                                          */
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export const actBreakTitle = style({
  fontFamily: vars.font.display,
  fontSize: vars.fontSize.h1,
  color: vars.color.text,
  textAlign: 'center',
  margin: 0,
  lineHeight: 1.15,
  opacity: 0,
  animationName: fadeUp,
  animationDuration: '500ms',
  animationDelay: '900ms',
  animationFillMode: 'forwards',
  animationTimingFunction: 'ease-out',
  userSelect: 'none',
});

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/* Subtitle — flavour text / key rule summary                                */
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export const actBreakSubtitle = style({
  fontFamily: vars.font.body,
  fontSize: vars.fontSize.h3,
  color: vars.color.textMuted,
  textAlign: 'center',
  fontStyle: 'italic',
  lineHeight: 1.5,
  maxWidth: '520px',
  margin: 0,
  opacity: 0,
  animationName: fadeUp,
  animationDuration: '500ms',
  animationDelay: '1050ms',
  animationFillMode: 'forwards',
  animationTimingFunction: 'ease-out',
  userSelect: 'none',
});

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/* Rules callout — key mechanical change for this act                        */
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export const actBreakRules = style({
  fontFamily: vars.font.body,
  fontSize: vars.fontSize.label,
  color: vars.color.textMuted,
  textAlign: 'center',
  lineHeight: 1.6,
  padding: `${vars.space.sm} ${vars.space.lg}`,
  borderLeft: `2px solid ${vars.color.accent}`,
  borderRight: `2px solid ${vars.color.accent}`,
  maxWidth: '460px',
  opacity: 0,
  animationName: fadeUp,
  animationDuration: '500ms',
  animationDelay: '1200ms',
  animationFillMode: 'forwards',
  animationTimingFunction: 'ease-out',
});

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/* Begin button                                                              */
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export const actBreakButton = style({
  marginTop: vars.space.sm,
  padding: `${vars.space.sm} ${vars.space.xl}`,
  fontFamily: vars.font.body,
  fontSize: vars.fontSize.label,
  fontWeight: 700,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: vars.color.text,
  backgroundColor: vars.color.accent,
  border: `1px solid ${vars.color.accentBright}`,
  borderRadius: vars.radius.sm,
  cursor: 'pointer',
  opacity: 0,
  animationName: hintFade,
  animationDuration: '500ms',
  animationDelay: '1500ms',
  animationFillMode: 'forwards',
  animationTimingFunction: 'ease-out',
  transition: `background-color ${vars.transition.fast}, box-shadow ${vars.transition.fast}`,

  ':hover': {
    backgroundColor: vars.color.accentBright,
    boxShadow: vars.shadow.glowIntense,
  },
  ':focus-visible': {
    outline: `2px solid ${vars.color.accentBright}`,
    outlineOffset: '3px',
  },
});
