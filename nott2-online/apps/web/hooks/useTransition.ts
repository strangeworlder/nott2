/**
 * useTransition — lightweight hook for managing game transition overlays.
 *
 * Tracks what type of transition is active and provides show/clear methods.
 * The GameShell reads this state to render the TransitionOverlay, and
 * individual phase screens (e.g. FalloutScreen) call showTransition()
 * to trigger it.
 */

'use client';

import { useState, useCallback } from 'react';

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

  const showTransition = useCallback((state: TransitionState) => {
    setTransition(state);
  }, []);

  const clearTransition = useCallback(() => {
    setTransition(null);
  }, []);

  return { transition, showTransition, clearTransition } as const;
}
