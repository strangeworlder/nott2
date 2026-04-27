/**
 * WaitingIndicator
 *
 * Philosophical:
 * The camera lingers. In multiplayer, not everyone acts at once — some players
 * wait while the host takes control. This indicator is the held breath between
 * cuts: atmospheric, not anxious. It pulses slowly, like something alive in
 * the dark, reminding the waiting player that the scene is still running.
 *
 * Technical:
 * A pulsing status indicator with a configurable message. Uses CSS animation
 * that respects prefers-reduced-motion. Can also be used for full-page loading
 * states (e.g. in loading.tsx).
 *
 * Props:
 * - message: Text to display. Defaults to 'Waiting…'.
 * - id: Optional id attribute.
 */

import React from 'react';
import { waitingRoot, waitingDot } from './WaitingIndicator.css';

interface WaitingIndicatorProps {
  message?: string;
  id?: string;
}

export function WaitingIndicator({ message = 'Waiting…', id }: WaitingIndicatorProps) {
  return (
    <div id={id} className={waitingRoot} role="status" aria-live="polite">
      <div className={waitingDot} aria-hidden="true" />
      <span>{message}</span>
    </div>
  );
}
