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
 * of cracks and red glow.
 *
 * Technical:
 * Renders the same SVG clock geometry as DoomClock but at 240px scale.
 * The hand position is driven by CSS transform (rotate), transitioning from
 * `from` angle to `to` angle on mount via a CSS transition with easing.
 * The newly-filled segment uses a delayed glow animation. A countdown
 * number and sublabel update after the hand arrives.
 *
 * For the "break" variant (transition to Act 3), the clock renders all
 * segments red, crack overlays appear, and a shake + glow animation plays.
 *
 * Props:
 * - from: Clock position before the tick (0–12).
 * - to: Clock position after the tick (1–13).
 * - isBroken: If true, plays the break animation instead of a tick.
 * - onComplete: Called when the animation finishes.
 * - id: Optional HTML id.
 *
 * Events: onComplete (fired after animation duration)
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
  GAP_DEG,
  SEGMENT_DEG,
  CLOCK_OFFSET_DEG,
  segmentColor,
  polarToXY,
  arcPath,
  handAngleDeg,
} from '../DoomClock/doom-clock-geometry';
import * as styles from './DoomClockTransition.css';

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

// ── Sub-components ───────────────────────────────────────────────────────────

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
          // Two stacked paths: grey base + colored overlay that fades in
          return (
            <React.Fragment key={i}>
              <path d={d} className={styles.segmentEmpty} strokeWidth={STROKE_W} />
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

function BrokenFace() {
  const cracks = [
    `M ${CX - 6} ${CY - 9} L ${CX - 36} ${CY - 66} L ${CX - 24} ${CY - 90}`,
    `M ${CX + 3} ${CY + 6} L ${CX + 54} ${CY + 24} L ${CX + 66} ${CY + 54}`,
    `M ${CX - 3} ${CY + 9} L ${CX - 30} ${CY + 45} L ${CX - 18} ${CY + 78}`,
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
            strokeOpacity={0.6}
          />
        );
      })}
      {cracks.map((d, i) => (
        <path key={i} d={d} strokeWidth={2.5} className={styles.crackLine} />
      ))}
      {/* Broken hand — pointing straight down */}
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
      // Fire the deferred state commit — this is the moment the clock
      // “really” moves. The DoomClock in the sidebar updates now.
      onClockArrived?.();

      setIsUpdating(true);
      // After the fade-out phase (~200ms), swap the value and fade back in.
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
          <HourMarkers />
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
  const tip  = polarToXY(CX, CY, fromAngle, HAND_LENGTH);
  const tail = polarToXY(CX, CY, fromAngle + 180, PIN_R + 2 * SCALE);

  return (
    <div id={id} className={styles.transitionRoot} role="status" aria-label={`Doom clock ticking to ${displayCountdown}`}>
      <svg
        className={styles.transitionSvg}
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        aria-hidden="true"
      >
        <HourMarkers />
        <ClockSegments filledCount={filledCount} newSegmentIndex={newSegmentIndex} />
        {/* Hand — animate via CSS transition on the <g> rotation */}
        <g
          className={styles.clockHand}
          style={{
            transform: `rotate(${sweepDeg}deg)`,
            transformOrigin: `${CX}px ${CY}px`,
          }}
        >
          <line
            x1={tail.x} y1={tail.y}
            x2={tip.x}  y2={tip.y}
            strokeWidth={HAND_WIDTH}
            stroke="currentColor"
            strokeLinecap="round"
          />
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
