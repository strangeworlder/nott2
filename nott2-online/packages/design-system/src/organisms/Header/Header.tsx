/**
 * Header (Organism)
 *
 * Philosophical:
 * The Header orients the player within the nightmare — what act they're in,
 * what phase is currently active, whether the Finale looms. It is always
 * present, grounding even the most chaotic scenes.
 *
 * Technical:
 * Application header displaying game title, act/phase status, optional
 * room code, and slot for action buttons. Sticky top with backdrop blur.
 *
 * Props:
 * - title: Game title. Defaults to 'Night of the Thirteenth 2'.
 * - act: Current act number (1|2|3).
 * - phase: Current phase string.
 * - isEndgame: Show Finale indicator. Defaults to false.
 * - roomCode: Multiplayer room code (null = demo mode).
 * - onReset: Reset handler.
 * - children: Slot for action buttons.
 */

import React from 'react';
import * as styles from './Header.css';

interface HeaderProps {
  title?: string;
  act?: 1 | 2 | 3;
  phase?: string;
  isEndgame?: boolean;
  roomCode?: string | null;
  onReset?: () => void;
  children?: React.ReactNode;
  id?: string;
}

function formatPhase(phase: string): string {
  return phase.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

export function Header({
  title = 'Night of the Thirteenth 2',
  act = 1,
  phase = 'lobby',
  isEndgame = false,
  roomCode,
  onReset,
  children,
  id,
}: HeaderProps) {
  return (
    <header id={id} className={styles.headerRoot}>
      <span className={styles.headerTitle}>{title}</span>

      <div className={styles.headerMeta}>
        <span className={`${styles.pill} ${styles[`pillAct${act}`]}`} aria-label={`Act ${act}`}>
          Act {act}
        </span>
        <span className={styles.pill}>{formatPhase(phase)}</span>
        {isEndgame && (
          <span className={`${styles.pill} ${styles.pillDanger}`}>☠ Finale</span>
        )}
        {roomCode && (
          <span className={`${styles.pill} ${styles.pillCode}`} title="Room code">
            {roomCode}
          </span>
        )}
        {children}
        {onReset && (
          <button className={styles.resetBtn} onClick={onReset} aria-label="Reset game">
            Reset
          </button>
        )}
      </div>
    </header>
  );
}
