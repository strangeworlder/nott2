/**
 * ActBreakOverlay (Organism)
 *
 * Philosophical:
 * This is the film cut between acts — the moment where the horror story shifts
 * gears and announces itself to the table. Unlike a quiet phase transition, an
 * act break is an EVENT: it commands attention, breaks the established rhythm,
 * and forces everyone to reckon with what is coming. It should feel like the
 * opening title card of a VHS slasher tape flickering to life.
 *
 * The overlay renders at z-index 15000 — above the game board, above the
 * 3D card overlay, above everything — because it IS everything, for this moment.
 * When it dismisses, the game is changed. There is no going back.
 *
 * Technical:
 * Full-screen fixed portal to document.body. Manages enter/exit animation state
 * internally (mounted + exiting flags). The backdrop uses the game's wall texture
 * to create the "walls closing in" effect. The center panel uses the VHS grain
 * texture for an analog horror title-card aesthetic. The content (act numeral,
 * title, subtitle, rules) is derived entirely from the `act` prop — no content
 * props are needed. A visible "Begin Act" button triggers dismissal.
 *
 * Props:
 * - visible:    boolean     — controls mount/unmount with animation lifecycle.
 * - act:        1|2|3|'prologue'|'finale' — determines all rendered copy. Use 'prologue' for the very first act-setup.
 * - onDismiss:  () => void  — called when the user clicks the begin button.
 * - onExited:   () => void  — called after exit animation completes.
 * - themeClass: string?     — applied to the portal root (portal escapes theme scope).
 *
 * Events: none (uses callback props).
 * Slots: none (fully self-contained; content is data-driven from `act`).
 */

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import * as styles from './ActBreakOverlay.css';

// ── Copy matrix ─────────────────────────────────────────────────────────────

type ActKey = 1 | 2 | 3 | 'prologue' | 'finale';

interface ActCopy {
  label: string;
  numeral: string;
  title: string;
  subtitle: string;
  rules: string;
  buttonLabel: string;
}

const ACT_COPY: Record<ActKey, ActCopy> = {
  prologue: {
    label: 'Night of the Thirteenth',
    numeral: 'I',
    title: 'The Setup',
    subtitle: 'The Killer moves unseen. Establish your characters before the darkness finds them.',
    rules: 'Four Aces sit atop the Threat Deck — one for each character. Only Jacks can appear. Resolving a Face Card ends Act I.',
    buttonLabel: 'Begin the Night',
  },
  1: {
    label: 'Act',
    numeral: 'I',
    title: 'The Setup',
    subtitle: 'The Killer is only a shadow. Four Aces sit atop the Threat Deck — establishing shots for each character.',
    rules: 'Only Jacks can appear. Resolving a Face Card ends Act I.',
    buttonLabel: 'Begin Act I',
  },
  2: {
    label: 'Act',
    numeral: 'II',
    title: 'The Horror Story',
    subtitle: 'The Killer is active. People will die. Queens enter the mix when Face Cards are defeated.',
    rules: 'Act II ends when 4 weaknesses are found or 13 reserve cards have been added.',
    buttonLabel: 'Begin Act II',
  },
  3: {
    label: 'Act',
    numeral: 'III',
    title: 'The Climax',
    subtitle: 'The mask comes off. All Number Cards are removed from the Threat Deck. Every encounter is with the Killer.',
    rules: 'Only Face Cards remain. Every scene is a direct confrontation.',
    buttonLabel: 'Begin Act III',
  },
  finale: {
    label: '',
    numeral: 'FINALE',
    title: 'The Night Ends Here',
    subtitle: 'All four weaknesses have been found. Both Jokers are in the deck. This is the true ending.',
    rules: 'Red Joker: one character makes a final Test — success ends the night, failure kills them and reshuffles it. Black Joker: success removes the highest face card; failure adds a King.',
    buttonLabel: 'Begin the Finale',
  },
};

// ── Props ────────────────────────────────────────────────────────────────────

export interface ActBreakOverlayProps {
  /** Whether the overlay is currently visible */
  visible: boolean;
  /** Which act this break announces */
  act: ActKey;
  /** Called when the player clicks "Begin Act" */
  onDismiss: () => void;
  /** Called after the exit animation fully completes */
  onExited: () => void;
  /** Theme class — needed because the portal escapes the app theme scope */
  themeClass?: string;
}

// ── Component ────────────────────────────────────────────────────────────────

export function ActBreakOverlay({
  visible,
  act,
  onDismiss,
  onExited,
  themeClass,
}: ActBreakOverlayProps) {
  const [mounted, setMounted] = useState(false);
  const [exiting, setExiting] = useState(false);
  const exitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (visible) {
      setMounted(true);
      setExiting(false);
    } else if (mounted) {
      setExiting(true);
      exitTimerRef.current = setTimeout(() => {
        setMounted(false);
        setExiting(false);
        onExited();
      }, 400); // matches backdropOut + panelExit duration
    }

    return () => {
      if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
    };
  }, [visible]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDismiss = useCallback(() => {
    if (!exiting) onDismiss();
  }, [exiting, onDismiss]);

  if (!mounted || typeof document === 'undefined') return null;

  const copy = ACT_COPY[act] ?? ACT_COPY[1];

  const backdropClass = [
    styles.actBreakBackdrop,
    exiting ? styles.actBreakBackdropExiting : '',
    themeClass ?? '',
  ].filter(Boolean).join(' ');

  const panelClass = [
    styles.actBreakPanel,
    exiting ? styles.actBreakPanelExiting : '',
  ].filter(Boolean).join(' ');

  const overlay = (
    <div
      className={backdropClass}
      role="dialog"
      aria-modal="true"
      aria-label={`Act break: ${copy.title}`}
    >
      <div className={panelClass}>
        {copy.label && (
          <span className={styles.actBreakLabel}>{copy.label}</span>
        )}

        <span className={styles.actBreakNumeral} aria-hidden="true">
          {copy.numeral}
        </span>

        <div className={styles.actBreakDivider} role="separator" />

        <h1 className={styles.actBreakTitle}>{copy.title}</h1>

        <p className={styles.actBreakSubtitle}>{copy.subtitle}</p>

        <p className={styles.actBreakRules}>{copy.rules}</p>

        <button
          className={styles.actBreakButton}
          onClick={handleDismiss}
          type="button"
          aria-label={copy.buttonLabel}
        >
          {copy.buttonLabel}
        </button>
      </div>
    </div>
  );

  return createPortal(overlay, document.body);
}
