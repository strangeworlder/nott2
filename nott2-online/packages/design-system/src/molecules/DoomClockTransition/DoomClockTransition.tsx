/**
 * DoomClockTransition (Molecule)
 *
 * Philosophical:
 * The tick of the clock. Each time a reserve card is added to the threat deck,
 * the hour hand creeps forward toward midnight — toward the 13th hour that a
 * clock was never meant to show. This component dramatises that single tick:
 * a full-screen, large-scale clock where the hand visibly sweeps from one
 * position to the next, the new segment flares to life, and the countdown
 * number drops by one. When the clock breaks, the face shatters in a burst
 * of cracks, bleeding red through the broken metal texture.
 *
 * Technical:
 * Renders the same SVG clock geometry as DoomClock but at 240px scale, with:
 * - A texture-filled circular background (weathered iron) via <pattern>
 * - Two decorative ornamental rings (outer border, inner border)
 * - All 12 Roman numerals at their hour positions (legible at this size)
 * - An animated clock hand (sword silhouette) driven by CSS rotate transform
 * - The newly-filled segment flares with a glow animation on entry
 * - Broken state: the face texture swaps to a cracked/bleeding variant,
 *   cracks overlay the face, and a shake + pulsing glow animation plays
 *
 * Props:
 * - from: Clock position before the tick (0–12).
 * - to: Clock position after the tick (1–13).
 * - isBroken: If true, plays the break animation instead of a tick.
 * - onComplete: Called when the animation finishes.
 * - onClockArrived: Called when the hand settles at the new position (~1800ms).
 * - id: Optional HTML id.
 *
 * Events: onComplete (fired after animation duration), onClockArrived
 * Slots: none
 */

'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  TOTAL_SEGMENTS,
  TRIGGER,
  CX as BASE_CX,
  CY as BASE_CY,
  OUTER_R as BASE_OUTER_R,
  INNER_R as BASE_INNER_R,
  ARC_MID_R as BASE_ARC_MID_R,
  STROKE_W as BASE_STROKE_W,
  MARKER_R_INNER as BASE_MARKER_R_INNER,
  MARKER_R_OUTER as BASE_MARKER_R_OUTER,
  HAND_LENGTH as BASE_HAND_LENGTH,
  HAND_WIDTH as BASE_HAND_WIDTH,
  PIN_R as BASE_PIN_R,
  DECO_RING_R as BASE_DECO_RING_R,
  DECO_INNER_RING_R as BASE_DECO_INNER_RING_R,
  NUMERAL_R as BASE_NUMERAL_R,
  ROMAN_NUMERALS,
  GAP_DEG,
  SEGMENT_DEG,
  CLOCK_OFFSET_DEG,
  segmentColor,
  polarToXY,
  arcPath,
  handAngleDeg,
} from '../DoomClock/doom-clock-geometry';
import * as styles from './DoomClockTransition.css';
import clockFaceTexture from '../../assets/textures/clock_face_texture.png';
import clockBrokenTexture from '../../assets/textures/clock_broken_texture.png';

// Handle both string URLs (Vite/Rollup) and StaticImageData objects (Next.js)
const getImageUrl = (image: any) => (typeof image === 'string' ? image : image?.src);

// ── Scaled constants (3× the compact clock) ─────────────────────────────────

const SCALE = 3;
const SIZE = 80 * SCALE; // 240px
const CX = BASE_CX * SCALE;
const CY = BASE_CY * SCALE;
const OUTER_R = BASE_OUTER_R * SCALE;
const INNER_R = BASE_INNER_R * SCALE;
const ARC_MID_R = BASE_ARC_MID_R * SCALE;
const STROKE_W = BASE_STROKE_W * SCALE;
const MARKER_R_INNER = BASE_MARKER_R_INNER * SCALE;
const MARKER_R_OUTER = BASE_MARKER_R_OUTER * SCALE;
const HAND_LENGTH = BASE_HAND_LENGTH * SCALE;
const HAND_WIDTH = BASE_HAND_WIDTH * SCALE;
const PIN_R = BASE_PIN_R * SCALE;
const DECO_RING_R = BASE_DECO_RING_R * SCALE;
const DECO_INNER_RING_R = BASE_DECO_INNER_RING_R * SCALE;
const NUMERAL_R = BASE_NUMERAL_R * SCALE;
const NUMERAL_FONT_SIZE = 11; // px — legible at 240px scale

// ── Pattern IDs (scoped to avoid collisions with compact clock) ──────────────
const FACE_PATTERN_ID = 'dct-face';
const BROKEN_PATTERN_ID = 'dct-broken';

// ── Sub-components ───────────────────────────────────────────────────────────

function ClockDefs() {
  const faceUrl = getImageUrl(clockFaceTexture);
  const brokenUrl = getImageUrl(clockBrokenTexture);
  return (
    <defs>
      <pattern id={FACE_PATTERN_ID} x="0" y="0" width={SIZE} height={SIZE} patternUnits="userSpaceOnUse">
        <image href={faceUrl} x="0" y="0" width={SIZE} height={SIZE} preserveAspectRatio="xMidYMid slice" />
      </pattern>
      <pattern id={BROKEN_PATTERN_ID} x="0" y="0" width={SIZE} height={SIZE} patternUnits="userSpaceOnUse">
        <image href={brokenUrl} x="0" y="0" width={SIZE} height={SIZE} preserveAspectRatio="xMidYMid slice" />
      </pattern>
    </defs>
  );
}

function ClockFaceBackground() {
  return (
    <circle
      cx={CX} cy={CY} r={DECO_RING_R}
      fill={`url(#${FACE_PATTERN_ID})`}
      opacity={0.6}
    />
  );
}

function DecoRings() {
  return (
    <>
      <circle cx={CX} cy={CY} r={DECO_RING_R} className={styles.decoRingOuter} />
      <circle cx={CX} cy={CY} r={DECO_INNER_RING_R} className={styles.decoRingInner} />
    </>
  );
}

function RomanNumerals() {
  return (
    <>
      {ROMAN_NUMERALS.map((label, i) => {
        const angleDeg = CLOCK_OFFSET_DEG + i * (360 / TOTAL_SEGMENTS);
        const pos = polarToXY(CX, CY, angleDeg, NUMERAL_R);
        return (
          <text
            key={i}
            x={pos.x}
            y={pos.y}
            className={styles.romanNumeral}
            style={{ fontSize: `${NUMERAL_FONT_SIZE}px` }}
          >
            {label}
          </text>
        );
      })}
    </>
  );
}

function ClockSegments({ filledCount, newSegmentIndex }: { filledCount: number; newSegmentIndex: number }) {
  return (
    <>
      {Array.from({ length: TOTAL_SEGMENTS }, (_, i) => {
        const startDeg = CLOCK_OFFSET_DEG + i * (360 / TOTAL_SEGMENTS) + GAP_DEG / 2;
        const endDeg   = startDeg + SEGMENT_DEG;
        const isFilled = i < filledCount;
        const isNew    = i === newSegmentIndex;
        const d = arcPath(CX, CY, startDeg, endDeg, ARC_MID_R);

        if (isNew) {
          // Two stacked paths: warm-dark base + colored overlay that flares in
          return (
            <React.Fragment key={i}>
              <path d={d} className={styles.segmentEmpty} strokeWidth={STROKE_W} stroke="rgba(80,70,60,0.4)" />
              <path d={d} className={styles.segmentNew} strokeWidth={STROKE_W} stroke={segmentColor(i)} />
            </React.Fragment>
          );
        }

        return (
          <path
            key={i}
            d={d}
            className={isFilled ? styles.segmentFilled : styles.segmentEmpty}
            strokeWidth={STROKE_W}
            stroke={isFilled ? segmentColor(i) : 'rgba(80,70,60,0.4)'}
          />
        );
      })}
    </>
  );
}

function HourMarkers() {
  return (
    <>
      {Array.from({ length: TOTAL_SEGMENTS }, (_, i) => {
        const angleDeg = CLOCK_OFFSET_DEG + i * (360 / TOTAL_SEGMENTS);
        const inner = polarToXY(CX, CY, angleDeg, MARKER_R_INNER);
        const outer = polarToXY(CX, CY, angleDeg, MARKER_R_OUTER);
        return (
          <line
            key={i}
            x1={inner.x} y1={inner.y}
            x2={outer.x} y2={outer.y}
            strokeWidth={i === 0 ? 3 : 1.5}
            className={styles.hourMarker}
          />
        );
      })}
    </>
  );
}

/**
 * SwordHand — a more detailed hand than a simple line.
 * The "blade" tapers from pivot to tip (narrow at pivot, slightly wider near tip).
 * The "pommel" extends slightly past the pivot in the opposite direction.
 *
 * Rendered as a filled polygon rotated around (CX, CY) via a CSS class on the
 * wrapping <g>. The polygon is defined in "pointing up" (12 o'clock) orientation
 * and the <g> rotation handles direction.
 */
function SwordHand() {
  // All coords relative to CX/CY in "12 o'clock" orientation.
  // Tip at top (negative Y), pommel below center.
  const tipY    = CY - HAND_LENGTH;       // tip of blade
  const sideW   = HAND_WIDTH * 1.6;       // max half-width of blade near guard
  const guardY  = CY - PIN_R * 2;         // top of crossguard
  const pommelY = CY + PIN_R * 2.5;       // bottom of pommel

  // Blade: tapers to a point at the tip, widens slightly at the guard
  const bladePoints = [
    `${CX},${tipY}`,                           // tip
    `${CX + sideW},${guardY}`,                 // right guard
    `${CX + sideW * 0.6},${CY}`,              // right at pivot
    `${CX + sideW * 0.4},${pommelY}`,          // right pommel
    `${CX},${pommelY + PIN_R}`,                // pommel tip
    `${CX - sideW * 0.4},${pommelY}`,          // left pommel
    `${CX - sideW * 0.6},${CY}`,              // left at pivot
    `${CX - sideW},${guardY}`,                 // left guard
  ].join(' ');

  return (
    <polygon
      points={bladePoints}
      fill="#c8b89a"
      fillOpacity={0.92}
      stroke="rgba(240, 220, 180, 0.3)"
      strokeWidth={0.8}
    />
  );
}

function BrokenFace() {
  const cracks = [
    `M ${CX - 6} ${CY - 9} L ${CX - 36} ${CY - 66} L ${CX - 24} ${CY - 90}`,
    `M ${CX + 3} ${CY + 6} L ${CX + 54} ${CY + 24} L ${CX + 66} ${CY + 54}`,
    `M ${CX - 3} ${CY + 9} L ${CX - 30} ${CY + 45} L ${CX - 18} ${CY + 78}`,
    `M ${CX + 5} ${CY - 8} L ${CX + 30} ${CY - 50} L ${CX + 15} ${CY - 85}`,
    `M ${CX - 4} ${CY + 5} L ${CX - 22} ${CY + 35} L ${CX + 8} ${CY + 70}`,
  ];
  return (
    <>
      {Array.from({ length: TOTAL_SEGMENTS }, (_, i) => {
        const startDeg = CLOCK_OFFSET_DEG + i * (360 / TOTAL_SEGMENTS) + GAP_DEG / 2;
        const endDeg   = startDeg + SEGMENT_DEG;
        return (
          <path
            key={i}
            d={arcPath(CX, CY, startDeg, endDeg, ARC_MID_R)}
            className={styles.brokenSegment}
            strokeWidth={STROKE_W}
            stroke="#dc2626"
            strokeOpacity={0.65}
          />
        );
      })}
      {/* Broken texture overlay — fades in to reveal shattered metal */}
      <circle
        cx={CX} cy={CY} r={DECO_RING_R}
        fill={`url(#${BROKEN_PATTERN_ID})`}
        className={styles.brokenTextureOverlay}
      />
      {cracks.map((d, i) => (
        <path key={i} d={d} strokeWidth={2.5} className={styles.crackLine} />
      ))}
      {/* Broken hand — pointing straight down */}
      <line
        x1={CX} y1={CY}
        x2={CX} y2={CY + HAND_LENGTH}
        strokeWidth={HAND_WIDTH}
        stroke="#dc2626"
        strokeOpacity={0.85}
        strokeLinecap="round"
      />
      <circle cx={CX} cy={CY} r={PIN_R} fill="#dc2626" />
    </>
  );
}

// ── Main Component ───────────────────────────────────────────────────────────

export interface DoomClockTransitionProps {
  /** Clock position BEFORE the tick (0–12) */
  from: number;
  /** Clock position AFTER the tick (1–13) */
  to: number;
  /** If true, plays the break animation instead of a tick */
  isBroken?: boolean;
  /** Callback fired when the animation completes */
  onComplete: () => void;
  /** Callback fired when the clock hand arrives at the new position (~1800ms).
   *  Used to commit deferred state changes (e.g. cardsAddedFromReserve). */
  onClockArrived?: () => void;
  /** Optional HTML id */
  id?: string;
}

export function DoomClockTransition({ from, to, isBroken = false, onComplete, onClockArrived, id }: DoomClockTransitionProps) {
  const [hasAnimated, setHasAnimated] = useState(false);
  // Start displaying the OLD countdown; flip to the new one after the hand arrives.
  const [displayCountdown, setDisplayCountdown] = useState(Math.max(0, TRIGGER - from));
  const [isUpdating, setIsUpdating] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Trigger hand animation after mount (next frame)
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      setHasAnimated(true);
    });

    // Hand delay (600ms) + sweep duration (1200ms) = 1800ms. Flip the number
    // just as the hand settles into its new position.
    const flipTimer = setTimeout(() => {
      onClockArrived?.();
      setIsUpdating(true);
      setTimeout(() => {
        setDisplayCountdown(Math.max(0, TRIGGER - to));
        setIsUpdating(false);
      }, 200);
    }, 1800);

    // Auto-complete timer
    const duration = isBroken ? 3000 : 2500;
    timerRef.current = setTimeout(() => {
      onComplete();
    }, duration);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(flipTimer);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fromAngle = handAngleDeg(from);
  const toAngle   = handAngleDeg(to);
  const filledCount = Math.min(from, TOTAL_SEGMENTS); // only pre-existing segments
  const newSegmentIndex = to - 1; // the segment that animates in

  if (isBroken) {
    return (
      <div id={id} className={styles.transitionRoot} role="status" aria-label="The clock has broken">
        <svg
          className={`${styles.transitionSvg} ${styles.brokenShake} ${styles.brokenGlow}`}
          width={SIZE}
          height={SIZE}
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          aria-hidden="true"
        >
          <ClockDefs />
          <ClockFaceBackground />
          <DecoRings />
          <HourMarkers />
          <RomanNumerals />
          <BrokenFace />
        </svg>

        <div className={styles.clockTextArea} aria-hidden="true">
          <span className={styles.clockCountText} style={{ color: '#dc2626' }}>XIII</span>
          <span className={styles.clockSubLabel}>broken</span>
        </div>
        <span className={styles.dismissHint}>click to continue</span>
      </div>
    );
  }

  // Hand is drawn at `from` position; CSS rotation sweeps it to `to`.
  const sweepDeg = hasAnimated ? (toAngle - fromAngle) : 0;

  return (
    <div id={id} className={styles.transitionRoot} role="status" aria-label={`Doom clock ticking to ${displayCountdown}`}>
      <svg
        className={styles.transitionSvg}
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        aria-hidden="true"
      >
        <ClockDefs />
        <ClockFaceBackground />
        <DecoRings />
        <HourMarkers />
        <RomanNumerals />
        <ClockSegments filledCount={filledCount} newSegmentIndex={newSegmentIndex} />
        {/* Sword hand — animated via CSS transition on the <g> rotation */}
        <g
          className={styles.clockHand}
          style={{
            transform: `rotate(${fromAngle + 90 + sweepDeg}deg)`,
            transformOrigin: `${CX}px ${CY}px`,
          }}
        >
          <SwordHand />
        </g>
        <circle cx={CX} cy={CY} r={PIN_R} className={styles.clockHandPin} />
      </svg>

      <div className={styles.clockTextArea} aria-hidden="true">
        <span
          className={`${styles.clockCountText} ${isUpdating ? styles.clockCountUpdating : ''}`}
        >
          {displayCountdown}
        </span>
        <span className={styles.clockSubLabel}>to go</span>
      </div>
      <span className={styles.dismissHint}>click to continue</span>
    </div>
  );
}
