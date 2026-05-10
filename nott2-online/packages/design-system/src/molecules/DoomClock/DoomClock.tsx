/**
 * DoomClock
 *
 * Philosophical:
 * The Night of the Thirteenth has an impossible hour — the 13th. A real clock
 * only has 12. This component is that clock. As reserve cards are added to the
 * threat deck, the hour hand advances through 12 segments of dread. When the
 * 13th card arrives, the clock cannot cope: it shatters, its face cracking
 * under the weight of what it was never meant to show. This is Act 3. Time is
 * broken. The night is truly here.
 *
 * Technical:
 * Renders an SVG clock face with:
 * - A texture-filled circular background (weathered iron) via a <pattern>
 * - Two decorative ornamental rings (outer border, inner border)
 * - 12 arc segments that fill as reserve cards are added, color-escalating
 *   from dark grey through amber to blood red
 * - Roman numerals at each of the 12 hour positions (subtle at 80px)
 * - An hour hand that sweeps from 12 o'clock as `current` climbs
 * - Crack lines + broken-texture overlay in the broken state (current ≥ 13)
 *
 * The countdown number and sublabel are rendered as HTML below the SVG for
 * legibility at small sizes. Compact sizing (~80px) suits sidebar use.
 *
 * Props:
 * - current: Number of reserve cards added (0–13). Required.
 * - id: Optional HTML id attribute.
 *
 * Events: none
 * Slots: none
 */

import React from 'react';
import {
  clockRoot,
  clockSvg,
  segmentEmpty,
  segmentFilled,
  hourMarker,
  clockHand,
  clockHandPin,
  clockTextArea,
  clockCountText,
  clockSubLabel,
  pulseRing,
  brokenSegment,
  crackLine,
  romanNumeral,
  decoRingOuter,
  decoRingInner,
  brokenTextureOverlay,
} from './DoomClock.css';
import {
  TOTAL_SEGMENTS,
  TRIGGER,
  SIZE,
  CX,
  CY,
  OUTER_R,
  ARC_MID_R,
  STROKE_W,
  MARKER_R_INNER,
  MARKER_R_OUTER,
  HAND_LENGTH,
  HAND_WIDTH,
  PIN_R,
  GAP_DEG,
  SEGMENT_DEG,
  CLOCK_OFFSET_DEG,
  DECO_RING_R,
  DECO_INNER_RING_R,
  NUMERAL_R,
  ROMAN_NUMERALS,
  segmentColor,
  polarToXY as _polarToXY,
  arcPath as _arcPath,
  handAngleDeg,
} from './doom-clock-geometry';
import clockFaceTexture from '../../assets/textures/clock_face_texture.png';
import clockBrokenTexture from '../../assets/textures/clock_broken_texture.png';

// Handle both string URLs (Vite/Rollup) and StaticImageData objects (Next.js)
const getImageUrl = (image: any) => (typeof image === 'string' ? image : image?.src);

// ── Local wrappers (bind to default CX/CY) ─────────────────────────────────

function polarToXY(angleDeg: number, r: number) {
  return _polarToXY(CX, CY, angleDeg, r);
}

function arcPath(startDeg: number, endDeg: number, r: number): string {
  return _arcPath(CX, CY, startDeg, endDeg, r);
}

// ── Texture pattern ID (unique per-instance via prop, or default) ───────────
const FACE_PATTERN_ID = 'doom-clock-face';
const BROKEN_PATTERN_ID = 'doom-clock-broken';

// ── Sub-components ───────────────────────────────────────────────────────────

function ClockDefs() {
  const faceUrl = getImageUrl(clockFaceTexture);
  const brokenUrl = getImageUrl(clockBrokenTexture);
  return (
    <defs>
      {/* Clock face background texture */}
      <pattern id={FACE_PATTERN_ID} x="0" y="0" width={SIZE} height={SIZE} patternUnits="userSpaceOnUse">
        <image href={faceUrl} x="0" y="0" width={SIZE} height={SIZE} preserveAspectRatio="xMidYMid slice" />
      </pattern>
      {/* Broken clock overlay texture */}
      <pattern id={BROKEN_PATTERN_ID} x="0" y="0" width={SIZE} height={SIZE} patternUnits="userSpaceOnUse">
        <image href={brokenUrl} x="0" y="0" width={SIZE} height={SIZE} preserveAspectRatio="xMidYMid slice" />
      </pattern>
      {/* Circular clip mask for textures */}
      <clipPath id="doom-clock-face-clip">
        <circle cx={CX} cy={CY} r={DECO_RING_R} />
      </clipPath>
    </defs>
  );
}

function ClockFaceBackground() {
  return (
    <circle
      cx={CX} cy={CY} r={DECO_RING_R}
      fill={`url(#${FACE_PATTERN_ID})`}
      opacity={0.55}
    />
  );
}

function DecoRings() {
  return (
    <>
      <circle cx={CX} cy={CY} r={DECO_RING_R} className={decoRingOuter} />
      <circle cx={CX} cy={CY} r={DECO_INNER_RING_R} className={decoRingInner} />
    </>
  );
}

function RomanNumerals() {
  return (
    <>
      {ROMAN_NUMERALS.map((label, i) => {
        const angleDeg = CLOCK_OFFSET_DEG + i * (360 / TOTAL_SEGMENTS);
        const pos = polarToXY(angleDeg, NUMERAL_R);
        return (
          <text
            key={i}
            x={pos.x}
            y={pos.y}
            className={romanNumeral}
          >
            {label}
          </text>
        );
      })}
    </>
  );
}

function ClockSegments({ filledCount }: { filledCount: number }) {
  const isNearFull = filledCount >= 10;
  return (
    <>
      {isNearFull && (
        <circle cx={CX} cy={CY} r={OUTER_R + 2} strokeWidth={1} className={pulseRing} />
      )}
      {Array.from({ length: TOTAL_SEGMENTS }, (_, i) => {
        const startDeg = CLOCK_OFFSET_DEG + i * (360 / TOTAL_SEGMENTS) + GAP_DEG / 2;
        const endDeg   = startDeg + SEGMENT_DEG;
        const isFilled = i < filledCount;
        return (
          <path
            key={i}
            d={arcPath(startDeg, endDeg, ARC_MID_R)}
            className={isFilled ? segmentFilled : segmentEmpty}
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
        const inner = polarToXY(angleDeg, MARKER_R_INNER);
        const outer = polarToXY(angleDeg, MARKER_R_OUTER);
        return (
          <line
            key={i}
            x1={inner.x} y1={inner.y}
            x2={outer.x} y2={outer.y}
            strokeWidth={i === 0 ? 2 : 1}
            className={hourMarker}
          />
        );
      })}
    </>
  );
}

function ClockHand({ angleDeg }: { angleDeg: number }) {
  const tip = polarToXY(angleDeg, HAND_LENGTH);
  const tail = polarToXY(angleDeg + 180, PIN_R + 2);
  return (
    <>
      <line
        x1={tail.x} y1={tail.y}
        x2={tip.x}  y2={tip.y}
        strokeWidth={HAND_WIDTH}
        className={clockHand}
      />
      {/* centre pivot */}
      <circle cx={CX} cy={CY} r={PIN_R} className={clockHandPin} />
    </>
  );
}

function BrokenFace() {
  const cracks = [
    `M ${CX - 2} ${CY - 3} L ${CX - 12} ${CY - 22} L ${CX - 8} ${CY - 30}`,
    `M ${CX + 1} ${CY + 2} L ${CX + 18} ${CY + 8}  L ${CX + 22} ${CY + 18}`,
    `M ${CX - 1} ${CY + 3} L ${CX - 10} ${CY + 15} L ${CX - 6}  ${CY + 26}`,
  ];
  return (
    <>
      {Array.from({ length: TOTAL_SEGMENTS }, (_, i) => {
        const startDeg = CLOCK_OFFSET_DEG + i * (360 / TOTAL_SEGMENTS) + GAP_DEG / 2;
        const endDeg   = startDeg + SEGMENT_DEG;
        return (
          <path
            key={i}
            d={arcPath(startDeg, endDeg, ARC_MID_R)}
            className={brokenSegment}
            strokeWidth={STROKE_W}
            stroke="#dc2626"
            strokeOpacity={0.65}
          />
        );
      })}
      {/* Broken texture overlay — fades in to show shattered face */}
      <circle
        cx={CX} cy={CY} r={DECO_RING_R}
        fill={`url(#${BROKEN_PATTERN_ID})`}
        className={brokenTextureOverlay}
      />
      {cracks.map((d, i) => (
        <path key={i} d={d} strokeWidth={1.2} className={crackLine} />
      ))}
      {/* Broken hand — pointing straight down (the clock stopped) */}
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

export interface DoomClockProps {
  /** Number of reserve cards added so far (0–13). At 13 the clock breaks. */
  current: number;
  id?: string;
}

export function DoomClock({ current, id }: DoomClockProps) {
  const isBroken   = current >= TRIGGER;
  const filledCount = Math.min(current, TOTAL_SEGMENTS);
  const countdown  = Math.max(0, TRIGGER - current);
  const angleDeg   = handAngleDeg(current);

  return (
    <div
      id={id}
      className={clockRoot}
      role="meter"
      aria-valuemin={0}
      aria-valuemax={TRIGGER}
      aria-valuenow={current}
      aria-label={
        isBroken
          ? 'Act 3 triggered — the clock has broken'
          : `Act 3 countdown: ${countdown} reserve cards remaining`
      }
    >
      <svg
        className={clockSvg}
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
        {isBroken ? (
          <BrokenFace />
        ) : (
          <>
            <ClockSegments filledCount={filledCount} />
            <ClockHand angleDeg={angleDeg} />
          </>
        )}
      </svg>

      {/* Text rendered as HTML below the SVG for legibility */}
      <div className={clockTextArea} aria-hidden="true">
        {isBroken ? (
          <>
            <span className={clockCountText} style={{ color: '#dc2626' }}>XIII</span>
            <span className={clockSubLabel}>broken</span>
          </>
        ) : (
          <>
            <span className={clockCountText}>{countdown}</span>
            <span className={clockSubLabel}>to go</span>
          </>
        )}
      </div>
    </div>
  );
}
