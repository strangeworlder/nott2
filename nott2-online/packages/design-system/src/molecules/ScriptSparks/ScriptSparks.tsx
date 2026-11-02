/**
 * ScriptSparks (Molecule)
 *
 * Philosophical:
 * "They should never be the answer, only the starting point for the answer."
 * Pre-written full sentences fight the scene the table has already imagined.
 * Instead, ScriptSparks is a purely read-only 9-word inspiration drawer.
 *
 * When opened by the Active Player, it displays 9 evocative words (mixing
 * abstract concepts and visceral nouns/verbs like "Meat", "Wound",
 * "Electronics", "Clanking", "Leverage", "Paranoia") drawn from a multi-axis
 * pool (Universal/Playset + Suit + Act + Rank Group) with zero overlap.
 *
 * When opened by the Camera Crew, it displays 9 sensory/atmospheric words
 * ("Dripping", "Copper", "Flicker", "Rot", "Echo", "Shadow") alongside the
 * Act's official "Focus the Camera" questions from `NotT_2.md`.
 *
 * Clicking "Shuffle Words" deals 9 fresh words without repeating the ones just
 * shown. Nothing inside the drawer is a selectable choice, and it never
 * completes a game step.
 *
 * Technical:
 * A read-only disclosure + uniform-shuffle molecule for displaying 9 evocative
 * words and optional "Focus the Camera" questions.
 *
 * Props:
 * - words:          readonly string[]         — Pool of evocative words (9 shown at a time).
 * - sparks:         readonly string[]         — Alias for `words` (backward compatibility).
 * - questions:      readonly string[]         — Optional "Focus the Camera" questions (for Camera Crew).
 * - questionsLabel: string | undefined        — Header above the questions list.
 * - triggerLabel:   string | undefined        — Button label when closed (default: "Need a Spark?").
 * - trayHint:       string | undefined        — Header hint inside the open tray.
 * - reloadLabel:    string | undefined        — Label on the shuffle button (default: "Shuffle Words").
 * - onReload:       (() => void) | undefined  — Optional callback fired when shuffling.
 * - defaultOpen:    boolean | undefined       — Whether the tray starts expanded (default: false).
 * - id:             string | undefined        — Optional DOM id.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Icon } from '../../atoms/Icon/Icon';
import * as styles from './ScriptSparks.css';

const WORD_COUNT = 9;

function drawUniqueWords(
  pool: readonly string[],
  exclude: readonly string[],
  count: number = WORD_COUNT,
): string[] {
  const uniquePool: string[] = [];
  const seen = new Set<string>();
  for (const item of pool) {
    const key = item.trim().toLowerCase();
    if (key && !seen.has(key)) {
      seen.add(key);
      uniquePool.push(item);
    }
  }

  if (uniquePool.length <= count) {
    return uniquePool;
  }

  const excludeSet = new Set(exclude.map(s => s.trim().toLowerCase()));
  const candidates = uniquePool.filter(item => !excludeSet.has(item.trim().toLowerCase()));
  const source = candidates.length >= count ? [...candidates] : [...uniquePool];

  // Uniform Fisher-Yates shuffle on a copy
  for (let i = source.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = source[i];
    source[i] = source[j];
    source[j] = tmp;
  }

  return source.slice(0, count);
}

export interface ScriptSparksProps {
  /** Pool of evocative words (9 drawn at a time with zero overlap) */
  words?: readonly string[];
  /** Alias for `words` */
  sparks?: readonly string[];
  /** Optional Act-specific "Focus the Camera" questions for the Camera Crew */
  questions?: readonly string[];
  /** Label above the optional camera questions section */
  questionsLabel?: string;
  /** Label on the disclosure trigger button */
  triggerLabel?: string;
  /** Header text inside the revealed tray */
  trayHint?: string;
  /** Label shown on the shuffle button */
  reloadLabel?: string;
  /** Optional callback fired when the user clicks the shuffle button */
  onReload?: () => void;
  /** Whether the tray starts expanded on mount */
  defaultOpen?: boolean;
  /** Optional id attribute */
  id?: string;
}

export function ScriptSparks({
  words,
  sparks,
  questions,
  questionsLabel = 'Focus the Camera (ask one):',
  triggerLabel = 'Need a Spark?',
  trayHint = '9 evocative words to spark your narration (grab one or two):',
  reloadLabel = 'Shuffle Words',
  onReload,
  defaultOpen = false,
  id,
}: ScriptSparksProps) {
  const pool = words ?? sparks ?? [];
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [displayedWords, setDisplayedWords] = useState<string[]>(() =>
    pool.slice(0, WORD_COUNT),
  );

  useEffect(() => {
    setDisplayedWords(drawUniqueWords(pool, []));
  }, [pool]);

  if (pool.length === 0 && (!questions || questions.length === 0)) {
    return null;
  }

  const handleReload = () => {
    setDisplayedWords(prev => drawUniqueWords(pool, prev));
    onReload?.();
  };

  return (
    <div id={id} className={styles.root}>
      {/* Trigger button when tray is closed */}
      {!isOpen && (
        <button
          type="button"
          className={styles.triggerButton}
          onClick={() => setIsOpen(true)}
          aria-expanded={false}
        >
          <Icon name="lightbulb" size={15} color="red" />
          <span>{triggerLabel}</span>
        </button>
      )}

      {/* Read-only 9-word inspiration tray */}
      {isOpen && (
        <div className={styles.tray} role="region" aria-label={triggerLabel}>
          <div className={styles.trayHeader}>
            <span className={styles.trayLabel}>{trayHint}</span>
            <div className={styles.trayActions}>
              {pool.length > WORD_COUNT && (
                <button
                  type="button"
                  className={styles.reloadButton}
                  onClick={handleReload}
                  aria-label="Shuffle nine new spark words"
                >
                  <Icon name="refresh" size={13} color="red" />
                  {reloadLabel}
                </button>
              )}
              <button
                type="button"
                className={styles.closeButton}
                onClick={() => setIsOpen(false)}
                aria-label="Close script ideas"
              >
                <Icon name="expand_less" size={14} />
                Close
              </button>
            </div>
          </div>

          {/* 9 Evocative Words */}
          {displayedWords.length > 0 && (
            <div className={styles.wordsGrid} data-testid="spark-words">
              {displayedWords.map((word, idx) => (
                <span key={`word-${idx}-${word}`} className={styles.wordChip}>
                  {word}
                </span>
              ))}
            </div>
          )}

          {/* Optional "Focus the Camera" questions for Camera Crew */}
          {questions && questions.length > 0 && (
            <div className={styles.questionsSection} data-testid="camera-questions">
              <span className={styles.questionsLabel}>{questionsLabel}</span>
              <div className={styles.questionsList}>
                {questions.map((q, idx) => (
                  <span key={`q-${idx}`} className={styles.questionChip}>
                    &ldquo;{q}&rdquo;
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
