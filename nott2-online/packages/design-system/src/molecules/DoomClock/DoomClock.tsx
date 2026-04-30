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
 * Renders an SVG clock face with 12 arc segments, an hour hand that sweeps
 * from 12 o'clock toward midnight as `current` climbs, and crack lines that
 * overlay the face in the broken state. The countdown number and sublabel are
 * rendered as HTML below the SVG for legibility at small sizes. Compact sizing
 * (~80px) suits sidebar use.
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
  segmentColor,
  polarToXY as _polarToXY,
  arcPath as _arcPath,
  handAngleDeg,
} from './doom-clock-geometry';

// ── Local wrappers (bind to default CX/CY) ─────────────────────────────────

function polarToXY(angleDeg: number, r: number) {
  return _polarToXY(CX, CY, angleDeg, r);
}

function arcPath(startDeg: number, endDeg: number, r: number): string {
  return _arcPath(CX, CY, startDeg, endDeg, r);
}

// ── Sub-components ───────────────────────────────────────────────────────────

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
            stroke={isFilled ? segmentColor(i) : undefined}
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
  // Tail is short, pointing opposite direction
  const tail = polarToXY(angleDeg + 180, PIN_R + 2);
  return (
    <>
      <line
        x1={tail.x} y1={tail.y}
        x2={tip.x}  y2={tip.y}
        strokeWidth={HAND_WIDTH}
        className={clockHand}
      />
      {/* centre pivot pin */}
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
            strokeOpacity={0.6}
          />
        );
      })}
      {cracks.map((d, i) => (
        <path key={i} d={d} strokeWidth={1.2} className={crackLine} />
      ))}
      {/* Broken hand — pointing straight down (the clock stopped) */}
      <line
        x1={CX} y1={CY}
        x2={CX} y2={CY + HAND_LENGTH}
        strokeWidth={HAND_WIDTH}
        stroke="#dc2626"
        strokeOpacity={0.8}
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
        <HourMarkers />
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
