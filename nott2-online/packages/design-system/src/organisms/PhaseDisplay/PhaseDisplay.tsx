/**
 * PhaseDisplay (Organism)
 *
 * Philosophical:
 * The phase display is the game's narrator — it speaks the current moment
 * of the horror story in full-screen voice. Each phase has its own visual
 * register: setup phases are editorial, action phases are urgent,
 * resolution phases are revelatory.
 *
 * Technical:
 * A phase-aware full-content renderer. Given a `phase` string, it renders
 * the appropriate informational content for that phase. Accepts optional
 * `title`, `subtitle`, and `body` overrides for content-driven rendering.
 * Always wraps in a styled container with phase-specific accent.
 *
 * Props:
 * - phase: Current game phase string.
 * - title: Override title text.
 * - subtitle: Override subtitle text.
 * - body: Override body text.
 * - children: Additional content slot (e.g. ActionFooter).
 */

import React from 'react';
import * as styles from './PhaseDisplay.css';

type Phase = string;

const PHASE_DEFAULTS: Record<Phase, { title: string; subtitle: string; accent: boolean }> = {
  'welcome':             { title: 'Night of the Thirteenth', subtitle: 'A director-less horror TTRPG. You are the victims — the script is already written.', accent: true },
  'game-setup':          { title: 'The Setup', subtitle: 'Name your characters, choose your aptitudes, and configure the rules modules.', accent: false },
  'act-setup':           { title: 'Act Begins', subtitle: 'The story escalates. Review the new rules and prepare for what comes next.', accent: true },
  'trophy-setup':        { title: 'The Trophy', subtitle: 'Draw the top card of the Number Reserve — it sets the starting difficulty for the Killer.', accent: false },
  'scene-setup':         { title: 'Scene', subtitle: 'Choose the Active Player and draw threat cards from the deck.', accent: false },
  'conversation-stakes': { title: 'Conversation & Stakes', subtitle: 'Frame the scene, define the sacrifice, and decide what you stand to lose.', accent: true },
  'resolution':          { title: 'Resolution', subtitle: 'Roll the d13 — d10 for luck, d4 for effort. Beat the difficulty to survive.', accent: true },
  'resolve-scene':       { title: 'Scene Resolved', subtitle: 'Narrate the outcome. The effort die determines how much it costs you.', accent: false },
  'fallout':             { title: 'Fallout', subtitle: 'Resolve deck changes, assign strikes, and award Genre Points before the next scene.', accent: true },
  'win':                 { title: 'You Survived', subtitle: 'The nightmare ends — this time.', accent: false },
  'lose':                { title: 'All Is Lost', subtitle: 'The darkness wins.', accent: true },
};

interface PhaseDisplayProps {
  phase: Phase;
  title?: string;
  subtitle?: string;
  body?: string;
  children?: React.ReactNode;
  id?: string;
}

export function PhaseDisplay({
  phase,
  title,
  subtitle,
  body,
  children,
  id,
}: PhaseDisplayProps) {
  const defaults = PHASE_DEFAULTS[phase] ?? { title: phase, subtitle: '', accent: false };
  const resolvedTitle = title ?? defaults.title;
  const resolvedSubtitle = subtitle ?? defaults.subtitle;
  const isAccent = defaults.accent;

  return (
    <div id={id} className={`${styles.phaseRoot} ${isAccent ? styles.phaseAccent : ''}`}>
      <div className={styles.phaseContent}>
        <h1 className={styles.phaseTitle}>{resolvedTitle}</h1>
        {resolvedSubtitle && (
          <p className={styles.phaseSubtitle}>{resolvedSubtitle}</p>
        )}
        {body && <p className={styles.phaseBody}>{body}</p>}
        {children && <div className={styles.phaseSlot}>{children}</div>}
      </div>
    </div>
  );
}
