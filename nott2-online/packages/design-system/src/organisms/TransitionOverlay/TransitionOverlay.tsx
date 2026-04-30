/**
 * TransitionOverlay (Organism)
 *
 * Philosophical:
 * The blackout between scenes. In a horror film, the cut to black is where the
 * dread lives — the audience knows something has changed, but they can't see
 * what yet. This overlay is that darkness: a full-screen curtain that drops
 * over the game surface while a transition moment plays out. It separates
 * what was from what will be.
 *
 * Technical:
 * Renders a full-screen fixed overlay via React portal to document.body.
 * Manages enter/exit animations with CSS keyframes. Clicking the backdrop
 * triggers early dismissal. Calls `onExited` after the exit animation
 * completes so the parent can advance game state.
 *
 * Props:
 * - visible: boolean — controls whether the overlay is mounted.
 * - onDismiss: () => void — called when the user clicks to dismiss early.
 * - onExited: () => void — called after exit animation finishes.
 * - children: ReactNode — the transition content to display.
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  overlayBackdrop,
  overlayBackdropExiting,
  overlayContent,
} from './TransitionOverlay.css';

export interface TransitionOverlayProps {
  /** Whether the overlay is visible */
  visible: boolean;
  /** Called when the user clicks to dismiss early */
  onDismiss: () => void;
  /** Called after the exit animation completes */
  onExited: () => void;
  /** The transition content to render */
  children: React.ReactNode;
  /** Theme class to apply (needed because portal escapes the app's theme scope) */
  themeClass?: string;
}

export function TransitionOverlay({ visible, onDismiss, onExited, children, themeClass }: TransitionOverlayProps) {
  const [mounted, setMounted] = useState(false);
  const [exiting, setExiting] = useState(false);
  const exitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (visible) {
      setMounted(true);
      setExiting(false);
    } else if (mounted) {
      // Begin exit animation
      setExiting(true);
      exitTimerRef.current = setTimeout(() => {
        setMounted(false);
        setExiting(false);
        onExited();
      }, 400); // matches fadeOut duration
    }

    return () => {
      if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
    };
  }, [visible]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleClick = useCallback(() => {
    if (!exiting) {
      onDismiss();
    }
  }, [exiting, onDismiss]);

  if (!mounted) return null;

  const classNames = [
    overlayBackdrop,
    exiting ? overlayBackdropExiting : '',
    themeClass ?? '',
  ].filter(Boolean).join(' ');

  const backdrop = (
    <div
      className={classNames}
      onClick={handleClick}
      role="dialog"
      aria-modal="true"
      aria-label="Game transition"
    >
      <div className={overlayContent} onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );

  if (typeof document === 'undefined') return null;
  return createPortal(backdrop, document.body);
}
