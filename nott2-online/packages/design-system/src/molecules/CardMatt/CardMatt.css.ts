import { style, keyframes } from '@vanilla-extract/css';
import { vars } from '../../tokens/theme.css';

// ── Glow pulse — gold/crimson box-shadow that breathes, signals card selectability ──
// Dimensions are proportional to CardMatt's large surface area.
// Colors reference tokens; blur/spread are component-specific.
const cardMattGlowPulse = keyframes({
  '0%, 100%': { boxShadow: `0 0 10px 3px color-mix(in srgb, ${vars.color.gold} 40%, transparent), 0 0 30px 6px color-mix(in srgb, ${vars.color.gold} 20%, transparent)` },
  '50%': { boxShadow: `0 0 20px 8px color-mix(in srgb, ${vars.color.goldBright} 70%, transparent), 0 0 50px 14px color-mix(in srgb, ${vars.color.goldBright} 35%, transparent)` },
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
  border: `2px dashed color-mix(in srgb, ${vars.color.gold} 45%, transparent)`,
  position: 'relative',
  overflow: 'hidden',

  // Red velvet surface — photographic texture with woven pattern overlay
  backgroundColor: vars.color.diegeticSurface,
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

  '@media': {
    '(prefers-reduced-motion: reduce)': {
      borderColor: `color-mix(in srgb, ${vars.color.gold} 55%, transparent)`,
    },
  },
});

// ── Glow variant — pulsing amber/crimson halo signalling card selectability ───
// Applied on top of cardMattSurface. The more dramatic box-shadow beacon.
export const cardMattSurfaceGlow = style({
  animation: `${cardMattGlowPulse} 2.5s ease-in-out infinite`,
  borderColor: `color-mix(in srgb, ${vars.color.goldBright} 80%, transparent)`,

  '@media': {
    '(prefers-reduced-motion: reduce)': {
      animation: 'none',
      boxShadow: vars.shadow.beacon,
    },
  },
});

// ── Empty state hint text ────────────────────────────────────────────────────
export const cardMattEmpty = style({
  position: 'absolute',
  inset: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  userSelect: 'none',
  pointerEvents: 'none',
});

export const cardMattEmptyText = style({
  color: vars.color.goldBright,
});

// ── Card count badge ─────────────────────────────────────────────────────────
export const cardMattCount = style({
  position: 'absolute',
  top: vars.space.sm,
  right: vars.space.sm,
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
