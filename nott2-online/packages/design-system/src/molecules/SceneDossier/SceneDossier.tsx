/**
 * SceneDossier (Molecule)
 *
 * Philosophical:
 * Where SceneChallengeOverlay is the jump-cut title card that slams the player
 * into a room, SceneDossier is the open case file and director's monitor on the
 * table while the scene unfolds. Rather than burying a horror film in a stack of
 * generic web cards, the dossier keeps the crime-scene evidence photo, suit
 * threat, active spotlight, and target difficulty anchored at the top while the
 * stage below shifts through the scene's dramatic beats.
 *
 * In `'script'` mode, the stage splits like a two-column screenplay: the
 * Director (Active Player) on the left and the Camera Crew (The Table) on the
 * right, separated by a vertical crimson gradient divider. Each side houses its
 * own prompt and role-gated `<ScriptSparks>` drawer. When the Camera Crew
 * interjects "Something's not right...", a crimson slash stamp brands the
 * dossier header and heats the left-edge bleed.
 *
 * In `'stakes'` mode, the lower stage focuses on the single pre-roll commitment:
 * what the Active Player is willing to sacrifice on Overexertion (Effort 3+).
 *
 * In `'aftermath'` mode (post-roll Beat 2), the dossier becomes the Fate &
 * Fallout ledger — compact single-line fate records, Blood Price strike
 * assignment, and a Genre Point toss row without a wall of callout boxes.
 *
 * Technical:
 * A multi-beat diegetic stage molecule built on the Bleeding Component pattern
 * (left-edge bleed + inset bottom wound + directional crimson wash).
 *
 * Props:
 * - mode:                'script' | 'stakes' | 'aftermath' — Active stage layout (default: 'script').
 * - imageSrc:            string | undefined       — Path to the suit-themed evidence photo.
 * - suitIcon:            IconName | undefined     — Suit or threat icon for the header.
 * - suitTheme:           string | undefined       — Uppercase suit theme or encounter heading.
 * - activeCharacterName: string | undefined       — Spotlight character's display name.
 * - activeCharacterSuit: IconName | undefined     — Spotlight character's suit icon.
 * - archetypes:          readonly string[]        — Optional Prologue archetype tags.
 * - difficulty:          number | null            — Target difficulty number in the header.
 * - difficultyBreakdown: string | undefined       — Short formula breakdown under the difficulty.
 * - escalated:           boolean                  — Whether "Something's Not Right..." was triggered.
 * - onEscalate:          (() => void) | undefined — Callback to trigger Escalation.
 * - escalationSparks:    React.ReactNode          — Optional inline `<ScriptSparks>` in the escalation strip.
 * - sacrificeTriggered:  boolean                  — Shows the Overexertion sacrifice reminder banner.
 * - directorLabel:       string | undefined       — Left column role header (default: 'Director — Active Player').
 * - directorPrompt:      string | undefined       — Active Player prompt text.
 * - directorSubtext:     string | undefined       — Optional secondary instruction under the Director prompt.
 * - directorSparks:      React.ReactNode          — Slot for the Director's `<ScriptSparks>`.
 * - cameraLabel:         string | undefined       — Right column role header (default: 'Camera Crew — The Table').
 * - cameraPrompt:        string | undefined       — Camera Crew prompt text.
 * - cameraSubtext:       string | undefined       — Optional secondary instruction under the Camera Crew prompt.
 * - cameraSparks:        React.ReactNode          — Slot for the Camera Crew's `<ScriptSparks>`.
 * - stakesQuestion:      string | undefined       — Core Overexertion question in `'stakes'` mode.
 * - stakesGuidance:      string | undefined       — Act-scaled stakes guidance in `'stakes'` mode.
 * - stakesSparks:        React.ReactNode          — Slot for `<ScriptSparks>` in `'stakes'` mode.
 * - fateItems:           readonly SceneDossierFateItem[] — Compact 1-line fate/deck records in `'aftermath'` mode.
 * - weaknessSlot:        React.ReactNode          — Optional inline `<WeaknessTracker>` in `'aftermath'` mode.
 * - strikesSlot:         React.ReactNode          — Optional Blood Price strike assignment controls in `'aftermath'` mode.
 * - strikesTitle:        string | undefined       — Header for the strikes section.
 * - genrePointSlot:      React.ReactNode          — Optional inline Genre Point award row in `'aftermath'` mode.
 * - genrePointTitle:     string | undefined       — Header for the Genre Point section.
 * - onBackToScene:       (() => void) | undefined — Callback for the back link in `'stakes'` or `'aftermath'` mode.
 * - backLabel:           string | undefined       — Label for the back link (default: 'Back to Scene').
 * - id:                  string | undefined       — Optional DOM id.
 *
 * Events:
 * - onEscalate: Fired when the user clicks the `"Something's Not Right..."` interjection button.
 * - onBackToScene: Fired when the user clicks the back navigation button in `'stakes'` or `'aftermath'` mode.
 *
 * Slots:
 * - directorSparks, cameraSparks, escalationSparks, stakesSparks, weaknessSlot, strikesSlot, genrePointSlot.
 */

'use client';

import React from 'react';
import { Icon } from '../../atoms/Icon/Icon';
import type { IconName, IconColor } from '../../atoms/Icon/Icon';
import * as styles from './SceneDossier.css';

export type SceneDossierMode = 'script' | 'stakes' | 'aftermath';

export type SceneDossierFateTone = 'info' | 'success' | 'warning' | 'danger' | 'highlight';

export interface SceneDossierFateItem {
  icon: IconName;
  text: string;
  tone?: SceneDossierFateTone;
}

export interface SceneDossierProps {
  /** Active stage beat inside the dossier */
  mode?: SceneDossierMode;
  /** Optional crime-scene evidence photo URL */
  imageSrc?: string;
  /** Suit or threat icon in the dossier header */
  suitIcon?: IconName;
  /** Suit theme or encounter heading (e.g., 'Power (Physical threat)') */
  suitTheme?: string;
  /** Active Player's character name */
  activeCharacterName?: string;
  /** Active Player's suit icon name */
  activeCharacterSuit?: IconName;
  /** Optional Prologue archetype tags for the Active Player */
  archetypes?: readonly string[];
  /** Target difficulty displayed in the header */
  difficulty?: number | null;
  /** Optional short breakdown of how difficulty was calculated */
  difficultyBreakdown?: string;
  /** Whether "Something's Not Right..." escalation has been triggered */
  escalated?: boolean;
  /** Callback to trigger "Something's Not Right..." escalation */
  onEscalate?: () => void;
  /** Optional inline spark drawer alongside the escalation interjection */
  escalationSparks?: React.ReactNode;
  /** Whether the agreed Overexertion sacrifice was triggered by Effort 3+ */
  sacrificeTriggered?: boolean;
  /** Role header for the Director column */
  directorLabel?: string;
  /** Primary prompt for the Active Player (Director) */
  directorPrompt?: string;
  /** Optional secondary guidance under the Director prompt */
  directorSubtext?: string;
  /** Role-gated `<ScriptSparks>` for the Director column */
  directorSparks?: React.ReactNode;
  /** Role header for the Camera Crew column */
  cameraLabel?: string;
  /** Primary prompt for the Camera Crew (The Table) */
  cameraPrompt?: string;
  /** Optional secondary guidance under the Camera Crew prompt */
  cameraSubtext?: string;
  /** Role-gated `<ScriptSparks>` for the Camera Crew column */
  cameraSparks?: React.ReactNode;
  /** Core Overexertion sacrifice question in `'stakes'` mode */
  stakesQuestion?: string;
  /** Act-scaled sacrifice guidance in `'stakes'` mode */
  stakesGuidance?: string;
  /** Optional `<ScriptSparks>` for `'stakes'` mode */
  stakesSparks?: React.ReactNode;
  /** Compact 1-line fate & deck outcomes for `'aftermath'` mode */
  fateItems?: readonly SceneDossierFateItem[];
  /** Optional inline WeaknessTracker slot for `'aftermath'` mode */
  weaknessSlot?: React.ReactNode;
  /** Optional strike assignment controls for `'aftermath'` mode */
  strikesSlot?: React.ReactNode;
  /** Section header for strikes in `'aftermath'` mode */
  strikesTitle?: string;
  /** Optional inline Genre Point award controls for `'aftermath'` mode */
  genrePointSlot?: React.ReactNode;
  /** Section header for Genre Point award in `'aftermath'` mode */
  genrePointTitle?: string;
  /** Optional callback to return to Beat 1 (`'script'` mode) */
  onBackToScene?: () => void;
  /** Label for the back button in `'stakes'` or `'aftermath'` mode */
  backLabel?: string;
  /** Optional HTML id attribute */
  id?: string;
}

function toneToIconColor(tone: SceneDossierFateTone = 'info'): IconColor {
  switch (tone) {
    case 'success':
      return 'success';
    case 'danger':
    case 'warning':
    case 'highlight':
      return 'red';
    case 'info':
    default:
      return 'muted';
  }
}

export function SceneDossier({
  mode = 'script',
  imageSrc,
  suitIcon,
  suitTheme,
  activeCharacterName,
  activeCharacterSuit,
  archetypes,
  difficulty,
  difficultyBreakdown,
  escalated = false,
  onEscalate,
  escalationSparks,
  sacrificeTriggered = false,
  directorLabel = 'Director — Active Player',
  directorPrompt,
  directorSubtext,
  directorSparks,
  cameraLabel = 'Camera Crew — The Table',
  cameraPrompt,
  cameraSubtext,
  cameraSparks,
  stakesQuestion = 'If you end up pushing yourself to reach your goal, what are you willing to risk?',
  stakesGuidance,
  stakesSparks,
  fateItems = [],
  weaknessSlot,
  strikesSlot,
  strikesTitle = 'Blood Price — Assign Strikes',
  genrePointSlot,
  genrePointTitle = 'Award Genre Point?',
  onBackToScene,
  backLabel = 'Back to Scene',
  id,
}: SceneDossierProps) {
  const showHeader =
    Boolean(imageSrc) ||
    Boolean(suitTheme) ||
    Boolean(activeCharacterName) ||
    (difficulty !== undefined && difficulty !== null);

  const showEscalationBar = Boolean(onEscalate) || escalated || Boolean(escalationSparks);

  return (
    <section
      id={id}
      className={styles.dossierRecipe({ escalated })}
      aria-label={suitTheme ? `Scene Dossier: ${suitTheme}` : 'Scene Dossier'}
    >
      {/* ── Persistent Crime-Scene Dossier Header ─────────────────────────── */}
      {showHeader && (
        <div className={styles.headerBar} data-testid="dossier-header">
          {imageSrc && (
            <div className={styles.photoFrame} aria-hidden="true">
              <img
                src={imageSrc}
                alt=""
                className={styles.photoImg}
                draggable={false}
              />
              <div className={styles.photoGrain} />
            </div>
          )}

          <div className={styles.headerMeta}>
            {suitTheme && (
              <div className={styles.suitLabel}>
                {suitIcon && <Icon name={suitIcon} size={14} color="red" />}
                <span>{suitTheme}</span>
              </div>
            )}

            {(activeCharacterName || (archetypes && archetypes.length > 0)) && (
              <div className={styles.spotlightRow}>
                {activeCharacterName && (
                  <span className={styles.activeCharacterBadge}>
                    {activeCharacterSuit && (
                      <Icon name={activeCharacterSuit} size={15} color="red" />
                    )}
                    <span>{activeCharacterName}</span>
                  </span>
                )}
                {archetypes && archetypes.length > 0 && (
                  <div className={styles.archetypesRow} data-testid="dossier-archetypes">
                    {archetypes.map(arch => (
                      <span key={arch} className={styles.archetypeTag}>
                        {arch}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {difficulty !== undefined && difficulty !== null && (
            <>
              <div className={styles.headerDivider} aria-hidden="true" />
              <div
                className={styles.difficultyBlock}
                aria-label={`Target Difficulty ${difficulty}`}
                data-testid="dossier-difficulty"
              >
                <span className={styles.difficultyLabel}>Target</span>
                <span className={styles.difficultyNumber}>{difficulty}</span>
                {difficultyBreakdown && (
                  <span className={styles.difficultyBreakdown}>
                    {difficultyBreakdown}
                  </span>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {/* ── Ambient Escalation Strip ("Something's Not Right...") ────────── */}
      {showEscalationBar && (
        <div className={styles.escalationStrip} data-testid="dossier-escalation">
          {escalated ? (
            <div className={styles.escalationStamp} role="status">
              <Icon name="bolt" size={14} />
              <span>&ldquo;Something&rsquo;s Not Right...&rdquo; — Scene Escalated</span>
            </div>
          ) : (
            onEscalate && (
              <button
                type="button"
                className={styles.escalationTriggerBtn}
                onClick={onEscalate}
              >
                <Icon name="warning" size={15} color="red" />
                <span>&ldquo;Something&rsquo;s not right...&rdquo;</span>
                <span className={styles.escalationHint}>(Escalate Once)</span>
              </button>
            )
          )}
          {escalationSparks}
        </div>
      )}

      {/* ── Sacrifice Triggered Reminder (Post-Roll Effort 3+) ───────────── */}
      {sacrificeTriggered && (
        <div
          className={styles.sacrificeBanner}
          role="status"
          data-testid="dossier-sacrifice-banner"
        >
          <Icon name="local_fire_department" size={18} color="red" />
          <span>
            <strong>Agreed Sacrifice Triggered:</strong> The Overexertion price you
            agreed upon before rolling happens now.
          </span>
        </div>
      )}

      {/* ── Mode 1: Side-by-Side Script Stage ('script') ─────────────────── */}
      {mode === 'script' && (
        <div className={styles.scriptGrid} data-testid="dossier-script-stage">
          {/* Left Column: Active Player (Director) */}
          <div className={styles.roleColumn} data-testid="dossier-director-col">
            <div className={styles.roleHeaderDirector}>
              <Icon name="movie" size={14} color="red" />
              <span>{directorLabel}</span>
            </div>
            {directorPrompt && (
              <p className={styles.directorPromptText}>
                &ldquo;{directorPrompt}&rdquo;
              </p>
            )}
            {directorSubtext && (
              <p className={styles.roleSubtext}>{directorSubtext}</p>
            )}
            {directorSparks}
          </div>

          <div className={styles.scriptDivider} aria-hidden="true" />

          {/* Right Column: Camera Crew (The Table) */}
          <div className={styles.roleColumn} data-testid="dossier-camera-col">
            <div className={styles.roleHeader}>
              <Icon name="videocam" size={14} color="muted" />
              <span>{cameraLabel}</span>
            </div>
            {cameraPrompt && (
              <p className={styles.cameraPromptText}>{cameraPrompt}</p>
            )}
            {cameraSubtext && (
              <p className={styles.roleSubtext}>{cameraSubtext}</p>
            )}
            {cameraSparks}
          </div>
        </div>
      )}

      {/* ── Mode 2: Commit to the Effort Stage ('stakes') ────────────────── */}
      {mode === 'stakes' && (
        <div className={styles.singleStage} data-testid="dossier-stakes-stage">
          <div className={styles.stageHeaderRow}>
            <span className={styles.stageHeaderLabel}>
              <Icon name="local_fire_department" size={14} color="red" />
              <span>The Stakes — Commit to the Effort (Overexertion 3+)</span>
            </span>
            {onBackToScene && (
              <button
                type="button"
                className={styles.backLinkBtn}
                onClick={onBackToScene}
              >
                <Icon name="chevron_left" size={14} />
                <span>{backLabel}</span>
              </button>
            )}
          </div>

          <p className={styles.stakesQuote}>&ldquo;{stakesQuestion}&rdquo;</p>

          {stakesGuidance && (
            <p className={styles.stakesGuidanceText}>{stakesGuidance}</p>
          )}

          {stakesSparks}
        </div>
      )}

      {/* ── Mode 3: Aftermath Ledger Stage ('aftermath') ─────────────────── */}
      {mode === 'aftermath' && (
        <div className={styles.singleStage} data-testid="dossier-aftermath-stage">
          <div className={styles.stageHeaderRow}>
            <span className={styles.stageHeaderLabel}>
              <Icon name="assignment" size={14} color="red" />
              <span>The Aftermath — Fate &amp; Fallout</span>
            </span>
            {onBackToScene && (
              <button
                type="button"
                className={styles.backLinkBtn}
                onClick={onBackToScene}
              >
                <Icon name="chevron_left" size={14} />
                <span>{backLabel}</span>
              </button>
            )}
          </div>

          {fateItems.length > 0 && (
            <div className={styles.fateList} data-testid="dossier-fate-list">
              {fateItems.map((item, idx) => (
                <div
                  key={`${item.icon}-${idx}`}
                  className={styles.fateRowRecipe({ tone: item.tone ?? 'info' })}
                >
                  <Icon
                    name={item.icon}
                    size={16}
                    color={toneToIconColor(item.tone)}
                  />
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          )}

          {weaknessSlot && (
            <div className={styles.ledgerSection} data-testid="dossier-weakness-slot">
              {weaknessSlot}
            </div>
          )}

          {strikesSlot && (
            <div
              className={styles.ledgerSectionDanger}
              data-testid="dossier-strikes-slot"
            >
              <span className={styles.ledgerSectionTitleDanger}>
                <Icon name="bolt" size={14} color="red" />
                <span>{strikesTitle}</span>
              </span>
              {strikesSlot}
            </div>
          )}

          {genrePointSlot && (
            <div
              className={styles.ledgerSection}
              data-testid="dossier-genre-point-slot"
            >
              <span className={styles.ledgerSectionTitle}>
                <Icon name="theater_comedy" size={14} color="muted" />
                <span>{genrePointTitle}</span>
              </span>
              {genrePointSlot}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
