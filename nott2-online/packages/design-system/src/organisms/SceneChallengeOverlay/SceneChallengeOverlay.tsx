/**
 * SceneChallengeOverlay (Organism)
 *
 * Philosophical:
 * This is the moment between choosing to act and having to live with that
 * choice. The player has selected their card — committed to the challenge —
 * and now the game shows them exactly what they're walking into. Like a film
 * cutting to a location title card before a scene, this overlay forces a
 * beat of dread: here is the place, here is the threat, here is the number
 * standing between survival and ruin.
 *
 * The "evidence photo" framing is deliberate. It looks like something pulled
 * from a crime scene file, from a detective's wall of leads — grainy,
 * blood-edged, slightly wrong. The selected card is still visible on the
 * game table above (VisibleThreatsZone stays mounted), so the players can
 * see exactly which card they're looking at while the overlay fills in the
 * narrative meaning.
 *
 * The jump scare variant exists because some encounters deserve to arrive
 * violently. First Killer appearances, Jokers, and random recurring
 * encounters hit like a door slamming open — a white flash, a screen shake,
 * a sudden slam of content that doesn't give you time to breathe.
 *
 * Technical:
 * Renders `position: absolute` within the `.game-main` container (which must
 * have `position: relative`). This means it covers only the phase panel and
 * sidebar area — the VisibleThreatsZone and Header above it remain visible.
 *
 * Does NOT use a React portal. No z-index warfare. The overlay is a sibling
 * of `.game-phase-panel` in the flex flow, absolutely positioned to cover it.
 *
 * Props:
 * - visible:             boolean              — controls mount/unmount lifecycle.
 * - prompt:              string               — scene prompt text (may contain markdown).
 * - suitTheme:           string               — e.g. "Power (Physical threat)".
 * - suitIcon:            string               — Material icon name for the suit.
 * - difficulty:          number               — numeric difficulty value.
 * - difficultyBreakdown: string | undefined   — short explanation text.
 * - isFaceCard:          boolean              — Killer encounter framing.
 * - isJoker:             boolean              — Finale / Joker framing.
 * - imageSrc:            string               — path to suit-themed image.
 * - jumpScare:           boolean              — triggers flash/slam variant.
 * - onDismiss:           () => void           — called on click (or keyboard Enter).
 * - onExited:            () => void           — called after exit animation.
 * - themeClass:          string | undefined   — applied to root for theming.
 */

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Icon } from '../../atoms/Icon/Icon';
import * as styles from './SceneChallengeOverlay.css';

// ── Props ─────────────────────────────────────────────────────────────────────

export interface SceneChallengeOverlayProps {
  /** Controls mount/unmount with animation lifecycle */
  visible: boolean;
  /** Scene prompt text */
  prompt: string;
  /** Suit theme label, e.g. "Power (Physical threat)" */
  suitTheme: string;
  /** Material icon name for the suit symbol */
  suitIcon: string;
  /** Numeric difficulty to display */
  difficulty: number;
  /** Optional difficulty breakdown text */
  difficultyBreakdown?: string;
  /** Whether this is a face card (Killer encounter) */
  isFaceCard?: boolean;
  /** Whether this is a Joker encounter */
  isJoker?: boolean;
  /** Path to the suit-themed evidence photo */
  imageSrc: string;
  /** Jump scare variant — triggers flash + slam entry */
  jumpScare?: boolean;
  /** Called when the user clicks to proceed */
  onDismiss: () => void;
  /** Called after exit animation completes */
  onExited: () => void;
  /** Optional theme class */
  themeClass?: string;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function SceneChallengeOverlay({
  visible,
  prompt,
  suitTheme,
  suitIcon,
  difficulty,
  difficultyBreakdown,
  isFaceCard = false,
  isJoker = false,
  imageSrc,
  jumpScare = false,
  onDismiss,
  onExited,
  themeClass,
}: SceneChallengeOverlayProps) {
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
      }, 400);
    }

    return () => {
      if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
    };
  }, [visible]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleClick = useCallback(() => {
    if (!exiting) onDismiss();
  }, [exiting, onDismiss]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ' ') && !exiting) onDismiss();
  }, [exiting, onDismiss]);

  if (!mounted) return null;

  // ── Class composition ─────────────────────────────────────────────────────

  const backdropClass = [
    styles.sceneChallengeBackdrop,
    jumpScare ? styles.sceneChallengeBackdropJumpScare : '',
    exiting ? styles.sceneChallengeBackdropExiting : '',
    // Jump scare shakes the backdrop (only on entry, not on exit)
    jumpScare && !exiting ? styles.sceneChallengeBackdropShake : '',
    themeClass ?? '',
  ].filter(Boolean).join(' ');

  const panelClass = [
    styles.sceneChallengePanel,
    jumpScare ? styles.sceneChallengePanelJumpScare : '',
  ].filter(Boolean).join(' ');

  const photoFrameClass = [
    styles.sceneChallengePhotoFrame,
    jumpScare ? styles.sceneChallengePhotoFrameJumpScare : '',
  ].filter(Boolean).join(' ');

  const photoClass = [
    styles.sceneChallengePhoto,
    jumpScare ? styles.sceneChallengePhotoJumpScare : '',
  ].filter(Boolean).join(' ');

  const labelClass = [
    styles.sceneChallengeLabel,
    jumpScare ? styles.sceneChallengeLabelJumpScare : '',
  ].filter(Boolean).join(' ');

  const promptWrapperClass = [
    styles.sceneChallengePromptWrapper,
    jumpScare ? styles.sceneChallengePromptWrapperJumpScare : '',
  ].filter(Boolean).join(' ');

  const promptClass = [
    styles.sceneChallengePrompt,
    jumpScare ? styles.sceneChallengePromptJumpScare : '',
  ].filter(Boolean).join(' ');

  const dividerClass = [
    styles.sceneChallengeDivider,
    jumpScare ? styles.sceneChallengeDividerJumpScare : '',
  ].filter(Boolean).join(' ');

  const difficultyWrapperClass = [
    styles.sceneChallengeDifficultyWrapper,
    jumpScare ? styles.sceneChallengeDifficultyWrapperJumpScare : '',
  ].filter(Boolean).join(' ');

  const difficultyNumClass = [
    styles.sceneChallengeDifficultyNumber,
    jumpScare ? styles.sceneChallengeDifficultyNumberJumpScare : '',
  ].filter(Boolean).join(' ');

  const hintClass = [
    styles.sceneChallengeHint,
    jumpScare ? styles.sceneChallengeHintJumpScare : '',
  ].filter(Boolean).join(' ');

  // ── Heading text ──────────────────────────────────────────────────────────

  const heading = isJoker
    ? 'The Finale'
    : isFaceCard
    ? 'The Killer is Here'
    : suitTheme;

  return (
    <div
      className={backdropClass}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-label="Scene challenge"
      tabIndex={0}
    >
      <div className={panelClass}>
        {/* Left: evidence photo */}
        <div className={photoFrameClass}>
          <img
            src={imageSrc}
            alt=""
            aria-hidden="true"
            className={photoClass}
            draggable={false}
          />
          {/* Film grain overlay */}
          <div className={styles.sceneChallengePhotoGrain} aria-hidden="true" />
        </div>

        {/* Right: text content */}
        <div className={styles.sceneChallengeContent}>
          {/* Suit theme / encounter label */}
          <div className={labelClass}>
            <Icon name={suitIcon as any} size={16} />
            <span>{heading}</span>
          </div>

          {/* Scene prompt */}
          <div className={promptWrapperClass}>
            <p className={promptClass}>
              &ldquo;{prompt}&rdquo;
            </p>
          </div>

          {/* Divider */}
          <div className={dividerClass} role="separator" />

          {/* Difficulty */}
          <div className={difficultyWrapperClass}>
            <div className={styles.sceneChallengeDifficultyLabel}>
              Target Difficulty
            </div>
            <div className={difficultyNumClass} aria-label={`Difficulty ${difficulty}`}>
              {difficulty}
            </div>
            {difficultyBreakdown && (
              <div className={styles.sceneChallengeDifficultyBreakdown}>
                {difficultyBreakdown}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Click hint */}
      <div className={hintClass} aria-hidden="true">
        click to begin
      </div>
    </div>
  );
}
