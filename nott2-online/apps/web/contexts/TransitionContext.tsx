/**
 * TransitionContext — React context for game transition overlays.
 *
 * Provides a shared channel between phase screens (which trigger transitions)
 * and the GameShell (which renders the TransitionOverlay portal).
 *
 * Usage:
 *   // In GameShell (provider):
 *   <TransitionProvider>
 *     <GamePhaseRouter />
 *     <TransitionOverlay ... />
 *   </TransitionProvider>
 *
 *   // In FalloutScreen (consumer):
 *   const { showTransition } = useTransitionContext();
 *   showTransition({ type: 'doom-clock-tick', from: 5, to: 6 }, commitClockTick);
 */

'use client';

import React, { createContext, useContext } from 'react';
import { useTransition, type TransitionState } from '../hooks/useTransition';

interface TransitionContextValue {
  transition: TransitionState | null;
  showTransition: (state: TransitionState, onMidpoint?: () => void) => void;
  clearTransition: () => void;
  /** Fire the midpoint callback — called by the transition component when the visual midpoint is reached. */
  fireMidpoint: () => void;
}

const TransitionContext = createContext<TransitionContextValue>({
  transition: null,
  showTransition: () => {},
  clearTransition: () => {},
  fireMidpoint: () => {},
});

export function TransitionProvider({ children }: { children: React.ReactNode }) {
  const value = useTransition();
  return (
    <TransitionContext.Provider value={value}>
      {children}
    </TransitionContext.Provider>
  );
}

export function useTransitionContext() {
  return useContext(TransitionContext);
}
