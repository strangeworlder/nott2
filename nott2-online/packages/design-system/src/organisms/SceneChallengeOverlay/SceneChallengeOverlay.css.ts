import { style, keyframes, globalStyle } from '@vanilla-extract/css';
import { vars } from '../../tokens/theme.css';

/* ── Entry animations ────────────────────────────────────────────────────── */

const backdropIn = keyframes({
  '0%': { opacity: 0 },
  '100%': { opacity: 1 },
});

const backdropOut = keyframes({
  '0%': { opacity: 1 },
  '100%': { opacity: 0 },
});

/* Jump scare: instant white flash → dark */
const jumpScareFlash = keyframes({
  '0%': { opacity: 0, backgroundColor: '#ffffff' },
  '8%': { opacity: 1, backgroundColor: '#ffffff' },
  '20%': { opacity: 1, backgroundColor: '#1a0000' },
  '100%': { opacity: 1, backgroundColor: '#0d0000' },
});

/* Jump scare: panel slams in from top */
const slamIn = keyframes({
  '0%': { opacity: 0, transform: 'translateY(-60px) scale(0.94)' },
  '60%': { opacity: 1, transform: 'translateY(4px) scale(1.01)' },
  '100%': { opacity: 1, transform: 'translateY(0) scale(1)' },
});

/* Normal: gentle fade-up */
const fadeUp = keyframes({
  '0%': { opacity: 0, transform: 'translateY(16px)' },
  '100%': { opacity: 1, transform: 'translateY(0)' },
});

/* Photo: polaroid drop-in */
const photoIn = keyframes({
  '0%': { opacity: 0, transform: 'rotate(-2deg) translateY(24px) scale(0.92)' },
  '100%': { opacity: 1, transform: 'rotate(-2deg) translateY(0) scale(1)' },
});

/* Jump scare photo: no rotation, scale punch */
const photoInJumpScare = keyframes({
  '0%': { opacity: 0, transform: 'scale(1.15) translateY(-8px)' },
  '60%': { opacity: 1, transform: 'scale(0.97)' },
  '100%': { opacity: 1, transform: 'scale(1)' },
});

/* Hint text: delayed pulse */
const hintFade = keyframes({
  '0%': { opacity: 0 },
  '100%': { opacity: 0.5 },
});

/* Jump scare screen shake on parent */
const shake = keyframes({
  '0%': { transform: 'translate(0, 0)' },
  '10%': { transform: 'translate(-4px, -2px)' },
  '20%': { transform: 'translate(4px, 2px)' },
  '30%': { transform: 'translate(-3px, 1px)' },
  '40%': { transform: 'translate(3px, -1px)' },
  '50%': { transform: 'translate(-2px, 2px)' },
  '60%': { transform: 'translate(2px, -2px)' },
  '70%': { transform: 'translate(-1px, 1px)' },
  '80%': { transform: 'translate(1px, -1px)' },
  '90%': { transform: 'translate(-1px, 0)' },
  '100%': { transform: 'translate(0, 0)' },
});

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/* Backdrop — covers the phase-panel area                                     */
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export const sceneChallengeBackdrop = style({
  position: 'absolute',
  inset: 0,
  zIndex: 5000,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  overflow: 'hidden',

  backgroundColor: '#0d0000',
  backgroundImage: [
    'radial-gradient(ellipse at 50% 30%, rgba(80,0,0,0.3) 0%, rgba(0,0,0,0.9) 70%)',
    'url(/textures/peeling-paint-bg.png)',
  ].join(', '),
  backgroundSize: ['100% 100%', 'cover'].join(', '),
  backgroundBlendMode: ['normal', 'multiply'].join(', '),

  animationName: backdropIn,
  animationDuration: '500ms',
  animationFillMode: 'forwards',
  animationTimingFunction: 'ease-out',

  '@media': {
    '(prefers-reduced-motion: reduce)': {
      animation: 'none',
      opacity: 1,
    },
  },
});

export const sceneChallengeBackdropJumpScare = style({
  animationName: jumpScareFlash,
  animationDuration: '600ms',
  animationFillMode: 'forwards',
  animationTimingFunction: 'ease-out',

  '@media': {
    '(prefers-reduced-motion: reduce)': {
      animation: 'none',
      opacity: 1,
      backgroundColor: '#0d0000',
    },
  },
});

export const sceneChallengeBackdropExiting = style({
  animationName: backdropOut,
  animationDuration: '350ms',
  animationFillMode: 'forwards',
  animationTimingFunction: 'ease-in',
  pointerEvents: 'none',
});

export const sceneChallengeBackdropShake = style({
  animationName: shake,
  animationDuration: '400ms',
  animationFillMode: 'forwards',
  animationTimingFunction: 'ease-out',

  '@media': {
    '(prefers-reduced-motion: reduce)': {
      animation: 'none',
    },
  },
});

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/* Inner panel — the content layout                                           */
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export const sceneChallengePanel = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  gap: vars.space['2xl'],
  width: 'min(800px, 92vw)',
  padding: `${vars.space.xl} ${vars.space['2xl']}`,
  opacity: 0,
  animationName: fadeUp,
  animationDuration: '500ms',
  animationDelay: '200ms',
  animationFillMode: 'forwards',
  animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',

  '@media': {
    '(prefers-reduced-motion: reduce)': {
      animation: 'none',
      opacity: 1,
    },
  },
});

export const sceneChallengePanelJumpScare = style({
  animationName: slamIn,
  animationDuration: '400ms',
  animationDelay: '100ms',
  animationFillMode: 'forwards',
  animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
});

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/* Evidence photo (polaroid frame)                                            */
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export const sceneChallengePhotoFrame = style({
  flexShrink: 0,
  position: 'relative',
  width: 220,
  opacity: 0,
  animationName: photoIn,
  animationDuration: '600ms',
  animationDelay: '400ms',
  animationFillMode: 'forwards',
  animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',

  // Polaroid: thick bottom to hold caption area, narrow sides & top
  padding: '8px 8px 28px 8px',
  backgroundColor: '#a89d90',
  backgroundImage: 'url(/textures/vhs-grain.png)',
  backgroundSize: '256px 256px',
  backgroundBlendMode: 'screen',

  // Blood-stained corners — deep red shadow
  boxShadow: [
    '0 8px 32px rgba(0,0,0,0.7)',
    '0 0 0 1px rgba(100,0,0,0.4)',
    'inset 0 0 12px rgba(80,0,0,0.25)',
    '-2px -2px 8px rgba(120,0,0,0.3)',
    '2px 2px 8px rgba(80,0,0,0.2)',
  ].join(', '),

  '@media': {
    '(prefers-reduced-motion: reduce)': {
      animation: 'none',
      opacity: 1,
    },
  },
});

export const sceneChallengePhotoFrameJumpScare = style({
  animationName: photoInJumpScare,
  animationDuration: '400ms',
  animationDelay: '80ms',
  animationFillMode: 'forwards',
  // No rotation for jump scare
  transform: 'rotate(0deg)',
  boxShadow: [
    '0 8px 48px rgba(0,0,0,0.9)',
    '0 0 0 2px rgba(180,0,0,0.6)',
    '0 0 40px rgba(180,0,0,0.4)',
    'inset 0 0 20px rgba(120,0,0,0.4)',
  ].join(', '),
});

export const sceneChallengePhoto = style({
  display: 'block',
  width: '100%',
  aspectRatio: '4/3',
  objectFit: 'cover',
  filter: 'saturate(0.6) contrast(1.1) brightness(0.85)',
});

export const sceneChallengePhotoJumpScare = style({
  filter: 'saturate(0.4) contrast(1.3) brightness(0.7)',
});

export const sceneChallengePhotoGrain = style({
  position: 'absolute',
  inset: '8px 8px 28px 8px',
  backgroundImage: 'url(/textures/vhs-grain.png)',
  backgroundSize: '128px 128px',
  opacity: 0.25,
  mixBlendMode: 'overlay',
  pointerEvents: 'none',
});

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/* Right panel — text content                                                 */
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export const sceneChallengeContent = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.lg,
  flex: 1,
  maxWidth: 380,
});

export const sceneChallengeLabel = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.sm,
  fontFamily: vars.font.body,
  fontSize: vars.fontSize.label,
  fontWeight: 700,
  letterSpacing: vars.letterSpacing.widest,
  textTransform: 'uppercase',
  color: vars.color.accentBright,
  opacity: 0,
  animationName: fadeUp,
  animationDuration: '400ms',
  animationDelay: '350ms',
  animationFillMode: 'forwards',
  animationTimingFunction: 'ease-out',
  userSelect: 'none',

  '@media': {
    '(prefers-reduced-motion: reduce)': {
      animation: 'none',
      opacity: 1,
    },
  },
});

export const sceneChallengeLabelJumpScare = style({
  color: '#ff2020',
  animationDelay: '120ms',
  textShadow: '0 0 12px rgba(255,32,32,0.8)',
});

export const sceneChallengePromptWrapper = style({
  opacity: 0,
  animationName: fadeUp,
  animationDuration: '500ms',
  animationDelay: '500ms',
  animationFillMode: 'forwards',
  animationTimingFunction: 'ease-out',

  '@media': {
    '(prefers-reduced-motion: reduce)': {
      animation: 'none',
      opacity: 1,
    },
  },
});

export const sceneChallengePromptWrapperJumpScare = style({
  animationDelay: '180ms',
});

export const sceneChallengePrompt = style({
  fontFamily: vars.font.display,
  fontSize: vars.fontSize.body,
  fontStyle: 'italic',
  lineHeight: 1.65,
  color: vars.color.text,
});

export const sceneChallengePromptJumpScare = style({
  color: '#ffdddd',
  textShadow: '0 0 8px rgba(200,0,0,0.4)',
});

export const sceneChallengeDivider = style({
  width: '80%',
  height: '1px',
  backgroundColor: vars.color.accent,
  opacity: 0,
  animationName: fadeUp,
  animationDuration: '300ms',
  animationDelay: '650ms',
  animationFillMode: 'forwards',

  '@media': {
    '(prefers-reduced-motion: reduce)': {
      animation: 'none',
      opacity: 1,
    },
  },
});
export const sceneChallengeDividerJumpScare = style({
  backgroundColor: '#cc0000',
  animationDelay: '250ms',
  boxShadow: '0 0 6px rgba(200,0,0,0.6)',
});

export const sceneChallengeDifficultyWrapper = style({
  opacity: 0,
  animationName: fadeUp,
  animationDuration: '400ms',
  animationDelay: '750ms',
  animationFillMode: 'forwards',
  animationTimingFunction: 'ease-out',

  '@media': {
    '(prefers-reduced-motion: reduce)': {
      animation: 'none',
      opacity: 1,
    },
  },
});

export const sceneChallengeDifficultyWrapperJumpScare = style({
  animationDelay: '300ms',
});

export const sceneChallengeDifficultyLabel = style({
  fontFamily: vars.font.body,
  fontSize: vars.fontSize.micro,
  fontWeight: 700,
  letterSpacing: vars.letterSpacing.wider,
  textTransform: 'uppercase',
  color: vars.color.textMuted,
  marginBottom: vars.space.xs,
  userSelect: 'none',
});

export const sceneChallengeDifficultyNumber = style({
  fontFamily: vars.font.display,
  fontSize: 'clamp(2.5rem, 6vw, 4rem)',
  fontWeight: 900,
  lineHeight: 1,
  color: vars.color.accentBright,
  textShadow: [
    '0 0 20px rgba(220,38,38,0.7)',
    '0 0 60px rgba(220,38,38,0.35)',
  ].join(', '),
  userSelect: 'none',
});

export const sceneChallengeDifficultyNumberJumpScare = style({
  color: '#ff2020',
  textShadow: [
    '0 0 30px rgba(255,32,32,0.9)',
    '0 0 80px rgba(255,32,32,0.5)',
  ].join(', '),
});

export const sceneChallengeDifficultyBreakdown = style({
  fontFamily: vars.font.body,
  fontSize: vars.fontSize.micro,
  color: vars.color.textMuted,
  marginTop: vars.space.xs,
});

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/* Click hint                                                                 */
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export const sceneChallengeHint = style({
  position: 'absolute',
  bottom: vars.space.xl,
  left: '50%',
  transform: 'translateX(-50%)',
  fontFamily: vars.font.body,
  fontSize: vars.fontSize.micro,
  letterSpacing: vars.letterSpacing.wider,
  textTransform: 'uppercase',
  color: vars.color.textMuted,
  opacity: 0,
  animationName: hintFade,
  animationDuration: '600ms',
  animationDelay: '1200ms',
  animationFillMode: 'forwards',
  userSelect: 'none',
  whiteSpace: 'nowrap',

  '@media': {
    '(prefers-reduced-motion: reduce)': {
      animation: 'none',
      opacity: 0.5,
    },
  },
});

export const sceneChallengeHintJumpScare = style({
  animationDelay: '700ms',
});
