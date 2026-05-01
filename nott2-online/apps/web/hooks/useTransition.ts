/**
 * useTransition — lightweight hook for managing game transition overlays.
 *
 * Tracks what type of transition is active and provides show/clear methods.
 * The GameShell reads this state to render the TransitionOverlay, and
 * individual phase screens (e.g. FalloutScreen) call showTransition()
 * to trigger it.
 *
 * Supports an optional `onMidpoint` callback — called when the transition
 * overlay reaches its visual midpoint (e.g. clock hand arrives). This is
 * how deferred state changes (like `commitClockTick`) are coordinated.
 * If the user dismisses the overlay early, `clearTransition` fires the
 * midpoint callback automatically so state is never left in limbo.
 */

'use client';

import { useState, useCallback, useRef } from 'react';

export type TransitionType = 'doom-clock-tick' | 'doom-clock-break';

export interface TransitionState {
  type: TransitionType;
  /** Clock position before the tick */
  from: number;
  /** Clock position after the tick */
  to: number;
}

export function useTransition() {
  const [transition, setTransition] = useState<TransitionState | null>(null);

  // Store the midpoint callback in a ref so it survives across renders
  // and doesn't cause re-renders when set.
  const midpointRef = useRef<(() => void) | null>(null);
  const firedRef = useRef(false);

  const showTransition = useCallback((state: TransitionState, onMidpoint?: () => void) => {
    midpointRef.current = onMidpoint ?? null;
    firedRef.current = false;
    setTransition(state);
  }, []);

  /** Fire the midpoint callback (idempotent — safe to call multiple times). */
  const fireMidpoint = useCallback(() => {
    if (!firedRef.current && midpointRef.current) {
      firedRef.current = true;
      midpointRef.current();
    }
  }, []);

  const clearTransition = useCallback(() => {
    // Ensure midpoint fires before clearing — handles early dismiss so
    // deferred state (e.g. pendingClockValue) is never left in limbo.
    fireMidpoint();
    midpointRef.current = null;
    setTransition(null);
  }, [fireMidpoint]);

  return { transition, showTransition, clearTransition, fireMidpoint } as const;
}
