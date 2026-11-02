import { style, keyframes } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { vars } from '../../tokens/theme.css';

const bleedPulse = keyframes({
  '0%, 100%': { opacity: 0.65 },
  '50%': { opacity: 1 },
});

const stageFadeIn = keyframes({
  from: { opacity: 0, transform: 'translateY(6px)' },
  to: { opacity: 1, transform: 'translateY(0)' },
});

const stampSlam = keyframes({
  '0%': { opacity: 0, transform: 'rotate(-1.5deg) scale(1.12)' },
  '70%': { opacity: 1, transform: 'rotate(-1.5deg) scale(0.98)' },
  '100%': { opacity: 1, transform: 'rotate(-1.5deg) scale(1)' },
});

/* ── Root Container (Bleeding Component Stack) ────────────────────────────── */

export const dossierRecipe = recipe({
  base: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    backgroundColor: vars.color.surface,
    background: `linear-gradient(90deg, rgba(138, 0, 0, 0.12) 0%, ${vars.color.surface} 55%)`,
    border: `1px solid ${vars.color.border}`,
    borderRadius: vars.radius.md,
    boxShadow: `inset 0 -1px 0 ${vars.color.accent}, 0 4px 24px rgba(138, 0, 0, 0.25)`,
    overflow: 'hidden',

    '::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      width: 3,
      background: `linear-gradient(180deg, transparent, ${vars.color.accent}, transparent)`,
      borderRadius: `${vars.radius.md} 0 0 ${vars.radius.md}`,
      animationName: bleedPulse,
      animationDuration: '3s',
      animationIterationCount: 'infinite',
      animationTimingFunction: 'ease-in-out',
      pointerEvents: 'none',
    },

    '@media': {
      '(prefers-reduced-motion: reduce)': {
        '::before': {
          animation: 'none',
          opacity: 0.85,
        },
      },
    },
  },
  variants: {
    escalated: {
      true: {
        borderColor: vars.color.borderActive,
        background: `linear-gradient(90deg, rgba(180, 0, 0, 0.2) 0%, ${vars.color.surface} 65%)`,
        boxShadow: `inset 0 -1px 0 ${vars.color.accentBright}, ${vars.shadow.glow}`,
        '::before': {
          width: 4,
          background: `linear-gradient(180deg, transparent, ${vars.color.accentBright}, transparent)`,
          animationDuration: '2s',
        },
      },
      false: {},
    },
  },
  defaultVariants: {
    escalated: false,
  },
});

/* ── Dossier Header Strip (Photo + Meta + Difficulty) ─────────────────────── */

export const headerBar = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.md,
  padding: `${vars.space.md} ${vars.space.lg}`,
  borderBottom: `1px solid ${vars.color.border}`,
  backgroundColor: 'rgba(10, 10, 10, 0.45)',
  flexWrap: 'wrap',
});

export const photoFrame = style({
  position: 'relative',
  flexShrink: 0,
  width: 84,
  padding: '4px 4px 12px 4px',
  backgroundColor: '#a89d90',
  transform: 'rotate(-1.5deg)',
  boxShadow: [
    '0 4px 16px rgba(0, 0, 0, 0.75)',
    '0 0 0 1px rgba(138, 0, 0, 0.4)',
    'inset 0 0 8px rgba(80, 0, 0, 0.25)',
  ].join(', '),
  userSelect: 'none',

  '@media': {
    '(max-width: 520px)': {
      width: 68,
      padding: '3px 3px 9px 3px',
    },
  },
});

export const photoImg = style({
  display: 'block',
  width: '100%',
  aspectRatio: '4/3',
  objectFit: 'cover',
  filter: 'saturate(0.6) contrast(1.1) brightness(0.85)',
});

export const photoGrain = style({
  position: 'absolute',
  inset: '4px 4px 12px 4px',
  backgroundImage: 'url(/textures/vhs-grain.png)',
  backgroundSize: '96px 96px',
  opacity: 0.25,
  mixBlendMode: 'overlay',
  pointerEvents: 'none',
});

export const headerMeta = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.xs,
  flex: 1,
  minWidth: 180,
});

export const suitLabel = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: vars.space.xs,
  fontFamily: vars.font.body,
  fontSize: vars.fontSize.micro,
  fontWeight: 700,
  letterSpacing: vars.letterSpacing.widest,
  textTransform: 'uppercase',
  color: vars.color.accentBright,
});

export const spotlightRow = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.sm,
  flexWrap: 'wrap',
});

export const activeCharacterBadge = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '4px',
  fontFamily: vars.font.display,
  fontSize: vars.fontSize.body,
  fontWeight: 700,
  color: vars.color.text,
});

export const archetypesRow = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '4px',
  flexWrap: 'wrap',
});

export const archetypeTag = style({
  display: 'inline-flex',
  alignItems: 'center',
  padding: '1px 6px',
  fontFamily: vars.font.body,
  fontSize: vars.fontSize.nano,
  textTransform: 'uppercase',
  letterSpacing: vars.letterSpacing.wider,
  color: vars.color.textMuted,
  backgroundColor: vars.color.surfaceElevated,
  border: `1px solid ${vars.color.borderSubtle}`,
  borderRadius: vars.radius.sm,
});

export const headerDivider = style({
  width: 1,
  alignSelf: 'stretch',
  background: `linear-gradient(180deg, transparent 0%, ${vars.color.accent} 25%, ${vars.color.accent} 75%, transparent 100%)`,
  flexShrink: 0,
  margin: `${vars.space.xs} 0`,
});

export const difficultyBlock = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  justifyContent: 'center',
  flexShrink: 0,
  minWidth: 68,
});

export const difficultyLabel = style({
  fontFamily: vars.font.body,
  fontSize: vars.fontSize.nano,
  fontWeight: 700,
  letterSpacing: vars.letterSpacing.widest,
  textTransform: 'uppercase',
  color: vars.color.textMuted,
  lineHeight: 1,
  marginBottom: '2px',
});

export const difficultyNumber = style({
  fontFamily: vars.font.display,
  fontSize: 'clamp(1.75rem, 3.5vw, 2.35rem)',
  fontWeight: 900,
  lineHeight: 1,
  color: vars.color.accentBright,
  textShadow: '0 0 18px rgba(220, 38, 38, 0.55), 0 2px 4px rgba(0, 0, 0, 0.8)',
});

export const difficultyBreakdown = style({
  fontFamily: vars.font.body,
  fontSize: vars.fontSize.nano,
  color: vars.color.textMuted,
  marginTop: '2px',
  textAlign: 'right',
  maxWidth: 160,
  lineHeight: 1.25,
});

/* ── Escalation Interjection Strip & Crimson Stamp ────────────────────────── */

export const escalationStrip = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: vars.space.sm,
  padding: `${vars.space.xs} ${vars.space.lg}`,
  backgroundColor: 'rgba(138, 0, 0, 0.08)',
  borderBottom: `1px solid ${vars.color.border}`,
  flexWrap: 'wrap',
});

export const escalationTriggerBtn = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: vars.space.xs,
  padding: `${vars.space.xs} ${vars.space.sm}`,
  backgroundColor: 'rgba(138, 0, 0, 0.18)',
  border: `1px solid ${vars.color.borderActive}`,
  borderRadius: vars.radius.sm,
  color: vars.color.text,
  fontFamily: vars.font.display,
  fontStyle: 'italic',
  fontSize: vars.fontSize.label,
  cursor: 'pointer',
  transition: `all ${vars.transition.fast}`,
  ':hover': {
    backgroundColor: 'rgba(220, 38, 38, 0.26)',
    borderColor: vars.color.accentBright,
    boxShadow: vars.shadow.glowSubtle,
  },
  ':focus-visible': {
    outline: `2px solid ${vars.color.accentBright}`,
    outlineOffset: '2px',
  },
});

export const escalationHint = style({
  fontFamily: vars.font.body,
  fontSize: vars.fontSize.micro,
  color: vars.color.textMuted,
});

export const escalationStamp = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: vars.space.xs,
  padding: `4px ${vars.space.sm}`,
  backgroundColor: vars.color.accent,
  color: vars.color.text,
  fontFamily: vars.font.display,
  fontSize: vars.fontSize.small,
  fontWeight: 700,
  letterSpacing: vars.letterSpacing.wide,
  textTransform: 'uppercase',
  clipPath: 'polygon(1% 3%, 99% 0%, 100% 97%, 0% 100%)',
  transform: 'rotate(-1.5deg)',
  boxShadow: vars.shadow.glowSubtle,
  animation: `${stampSlam} ${vars.transition.normal}`,

  '@media': {
    '(prefers-reduced-motion: reduce)': {
      animation: 'none',
    },
  },
});

/* ── Sacrifice Triggered Banner (Post-Roll Effort 3+) ─────────────────────── */

export const sacrificeBanner = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.sm,
  padding: `${vars.space.sm} ${vars.space.lg}`,
  background: 'linear-gradient(90deg, rgba(251, 146, 60, 0.16) 0%, rgba(138, 0, 0, 0.12) 65%, transparent 100%)',
  borderBottom: `1px solid ${vars.color.caution}`,
  color: vars.color.cautionBright,
  fontFamily: vars.font.body,
  fontSize: vars.fontSize.small,
  lineHeight: 1.4,
});

/* ── Mode 1: Dual-Role Script Stage ('script') ────────────────────────────── */

export const scriptGrid = style({
  display: 'grid',
  gridTemplateColumns: '1fr 1px 1fr',
  gap: vars.space.lg,
  padding: vars.space.lg,
  animation: `${stageFadeIn} ${vars.transition.normal}`,

  '@media': {
    '(max-width: 640px)': {
      gridTemplateColumns: '1fr',
      gap: vars.space.md,
    },
    '(prefers-reduced-motion: reduce)': {
      animation: 'none',
    },
  },
});

export const scriptDivider = style({
  width: 1,
  alignSelf: 'stretch',
  background: `linear-gradient(180deg, transparent 0%, ${vars.color.borderActive} 20%, ${vars.color.borderActive} 80%, transparent 100%)`,

  '@media': {
    '(max-width: 640px)': {
      width: '100%',
      height: 1,
      background: `linear-gradient(90deg, transparent 0%, ${vars.color.borderActive} 20%, ${vars.color.borderActive} 80%, transparent 100%)`,
    },
  },
});

export const roleColumn = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.sm,
  minWidth: 0,
});

export const roleHeader = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.xs,
  fontFamily: vars.font.body,
  fontSize: vars.fontSize.micro,
  fontWeight: 700,
  letterSpacing: vars.letterSpacing.wider,
  textTransform: 'uppercase',
  color: vars.color.textMuted,
});

export const roleHeaderDirector = style([
  roleHeader,
  {
    color: vars.color.accentBright,
  },
]);

export const directorPromptText = style({
  fontFamily: vars.font.display,
  fontStyle: 'italic',
  fontSize: vars.fontSize.bodyLg,
  lineHeight: 1.6,
  color: vars.color.text,
  margin: 0,
});

export const cameraPromptText = style({
  fontFamily: vars.font.body,
  fontSize: vars.fontSize.body,
  lineHeight: 1.55,
  color: vars.color.text,
  margin: 0,
});

export const roleSubtext = style({
  fontFamily: vars.font.body,
  fontSize: vars.fontSize.small,
  lineHeight: 1.45,
  color: vars.color.textMuted,
  margin: 0,
});

/* ── Mode 2: Stakes Stage ('stakes') & Mode 3: Aftermath Stage ('aftermath') ─ */

export const singleStage = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.md,
  padding: vars.space.lg,
  animation: `${stageFadeIn} ${vars.transition.normal}`,

  '@media': {
    '(prefers-reduced-motion: reduce)': {
      animation: 'none',
    },
  },
});

export const stageHeaderRow = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: vars.space.sm,
  flexWrap: 'wrap',
});

export const stageHeaderLabel = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: vars.space.xs,
  fontFamily: vars.font.body,
  fontSize: vars.fontSize.micro,
  fontWeight: 700,
  letterSpacing: vars.letterSpacing.widest,
  textTransform: 'uppercase',
  color: vars.color.cautionBright,
});

export const backLinkBtn = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '4px',
  background: 'none',
  border: 'none',
  padding: `${vars.space.xs} ${vars.space.sm}`,
  borderRadius: vars.radius.sm,
  color: vars.color.textMuted,
  fontFamily: vars.font.body,
  fontSize: vars.fontSize.micro,
  letterSpacing: vars.letterSpacing.wide,
  textTransform: 'uppercase',
  cursor: 'pointer',
  transition: `color ${vars.transition.fast}`,
  ':hover': {
    color: vars.color.text,
  },
  ':focus-visible': {
    outline: `2px solid ${vars.color.accentBright}`,
    outlineOffset: '2px',
  },
});

export const stakesQuote = style({
  fontFamily: vars.font.display,
  fontStyle: 'italic',
  fontSize: vars.fontSize.quote,
  lineHeight: 1.45,
  color: vars.color.text,
  margin: 0,
});

export const stakesGuidanceText = style({
  fontFamily: vars.font.body,
  fontSize: vars.fontSize.small,
  lineHeight: 1.5,
  color: vars.color.textMuted,
  margin: 0,
  paddingLeft: vars.space.sm,
  borderLeft: `2px solid ${vars.color.caution}`,
});

/* ── Aftermath Ledger Rows ────────────────────────────────────────────────── */

export const fateList = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.xs,
});

export const fateRowRecipe = recipe({
  base: {
    display: 'flex',
    alignItems: 'center',
    gap: vars.space.sm,
    padding: `${vars.space.xs} ${vars.space.sm}`,
    backgroundColor: vars.color.surfaceElevated,
    borderRadius: vars.radius.sm,
    borderLeft: `2px solid ${vars.color.border}`,
    fontFamily: vars.font.body,
    fontSize: vars.fontSize.small,
    color: vars.color.text,
    lineHeight: 1.4,
  },
  variants: {
    tone: {
      info: { borderLeftColor: vars.color.borderSubtle, color: vars.color.textMuted },
      success: { borderLeftColor: vars.color.successBright },
      warning: { borderLeftColor: vars.color.warning },
      danger: { borderLeftColor: vars.color.accentBright, backgroundColor: 'rgba(138, 0, 0, 0.14)' },
      highlight: { borderLeftColor: vars.color.goldBright, backgroundColor: 'rgba(180, 100, 40, 0.12)' },
    },
  },
  defaultVariants: {
    tone: 'info',
  },
});

export const ledgerSection = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.sm,
  paddingTop: vars.space.sm,
  borderTop: `1px solid ${vars.color.borderSubtle}`,
});

export const ledgerSectionDanger = style([
  ledgerSection,
  {
    padding: vars.space.md,
    backgroundColor: 'rgba(138, 0, 0, 0.1)',
    border: `1px solid ${vars.color.borderActive}`,
    borderRadius: vars.radius.sm,
  },
]);

export const ledgerSectionTitle = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: vars.space.xs,
  fontFamily: vars.font.body,
  fontSize: vars.fontSize.micro,
  fontWeight: 700,
  letterSpacing: vars.letterSpacing.wider,
  textTransform: 'uppercase',
  color: vars.color.textMuted,
});

export const ledgerSectionTitleDanger = style([
  ledgerSectionTitle,
  {
    color: vars.color.accentBright,
  },
]);
