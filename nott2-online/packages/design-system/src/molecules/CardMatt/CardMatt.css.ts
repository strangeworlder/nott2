import { style, keyframes } from '@vanilla-extract/css';
import { vars } from '../../tokens/theme.css';

// ── Gold-crimson shimmer on the dashed border — evokes casino table trim ──────
const borderPulse = keyframes({
  '0%, 100%': { borderColor: 'rgba(180, 100, 40, 0.45)' },
  '50%': { borderColor: 'rgba(220, 160, 60, 0.70)' },
});

// ── Root container: rotated title on left + matt on right ────────────────────
export const cardMattRoot = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'stretch',
  gap: vars.space.md,
  width: '100%',
});

// ── Title — rotated 90° CCW, positioned on the left edge ─────────────────────
export const cardMattTitle = style({
  writingMode: 'vertical-rl',
  transform: 'rotate(180deg)',
  fontFamily: vars.font.display,
  fontSize: vars.fontSize.micro,
  fontWeight: 700,
  letterSpacing: '0.2em',
  textTransform: 'uppercase',
  color: vars.color.textMuted,
  whiteSpace: 'nowrap',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  padding: `${vars.space.sm} 0`,
  userSelect: 'none',
});

// ── The matt itself — dashed border, textured background ─────────────────────
export const cardMattSurface = style({
  flex: 1,
  minHeight: '180px',
  borderRadius: vars.radius.lg,
  border: '2px dashed rgba(180, 100, 40, 0.45)',
  animation: `${borderPulse} 4s ease-in-out infinite`,
  position: 'relative',
  overflow: 'hidden',

  // Red velvet surface — photographic texture with woven pattern overlay
  backgroundColor: '#3a0505',
  backgroundImage: [
    // Damask-style diamond weave overlay — adds elegant, fabric-like depth
    'repeating-linear-gradient(45deg,  transparent, transparent 10px, rgba(0,0,0,0.06) 10px, rgba(0,0,0,0.06) 11px)',
    'repeating-linear-gradient(-45deg, transparent, transparent 10px, rgba(255,255,255,0.03) 10px, rgba(255,255,255,0.03) 11px)',
    // Radial vignette to deepen the edges and focus the eye on card area
    'radial-gradient(ellipse at 60% 50%, rgba(90,0,0,0.0) 30%, rgba(10,0,0,0.55) 100%)',
    // Photographic velvet texture tile
    'url(/textures/red-velvet-matt.png)',
  ].join(', '),
  backgroundSize: ['auto', 'auto', '100% 100%', '320px 320px'].join(', '),
  backgroundBlendMode: ['multiply', 'screen', 'normal', 'normal'].join(', '),

  transition: `border-color ${vars.transition.slow}`,
});

// ── Empty state hint text ────────────────────────────────────────────────────
export const cardMattEmpty = style({
  position: 'absolute',
  inset: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'rgba(220, 160, 80, 0.28)',
  fontFamily: vars.font.display,
  fontSize: vars.fontSize.label,
  fontWeight: 700,
  letterSpacing: '0.15em',
  textTransform: 'uppercase',
  userSelect: 'none',
  pointerEvents: 'none',
});

// ── Card count badge ─────────────────────────────────────────────────────────
export const cardMattCount = style({
  position: 'absolute',
  top: vars.space.sm,
  right: vars.space.sm,
  fontFamily: vars.font.body,
  fontSize: vars.fontSize.micro,
  color: vars.color.textMuted,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  pointerEvents: 'none',
  userSelect: 'none',
});

// ── Card target area — invisible precision landing zone for 3D cards ─────────
// 75% wide, 33% tall, centered vertically, right-aligned horizontally.
// The ref is forwarded here so react-ttrpg-cards measures this rect instead
// of the full surface, resulting in tighter, better-positioned card drops.
export const cardMattTargetArea = style({
  position: 'absolute',
  width: '80%',
  height: '33%',
  top: '50%',
  right: 0,
  transform: 'translateY(-50%) translateX(-12%)',
  pointerEvents: 'none',
});
