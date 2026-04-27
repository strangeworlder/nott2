/**
 * PlayerPanel (Organism)
 *
 * Philosophical:
 * This is the active player's cockpit — a phase-aware control surface
 * that presents precisely what the player needs at each moment of the
 * scene. It shrinks and expands with the drama, never overwhelming,
 * always presenting the next choice clearly.
 *
 * Technical:
 * A phase-aware panel that renders different content per phase.
 * Accepts all the scene data + computed state needed and delegates
 * to phase-specific sub-views. The `onAction` callback surfaces
 * structured actions back to the parent.
 *
 * Props:
 * - phase: Current game phase (determines sub-view).
 * - difficulty: Resolved difficulty number (or null).
 * - rollMain: Current d10 roll result (or null).
 * - rollEffort: Current d4 roll result (or null).
 * - total: Computed total (or null).
 * - isSuccess: Whether the current roll succeeds.
 * - strikesToAssign: Number of strikes waiting to assign.
 * - onRollDice: Called with (d10, d4) when dice are selected.
 * - onNextPhase: Called to advance the phase.
 */

'use client';

import React from 'react';
import { DieSelector } from '../../molecules/DieSelector/DieSelector';
import { ActionFooter } from '../../molecules/ActionFooter/ActionFooter';
import * as styles from './PlayerPanel.css';

type Phase = string;

interface PlayerPanelProps {
  phase: Phase;
  difficulty?: number | null;
  rollMain?: number | null;
  rollEffort?: number | null;
  total?: number | null;
  isSuccess?: boolean | null;
  strikesToAssign?: number;
  onRollDice?: (d10: number, d4: number) => void;
  onNextPhase?: () => void;
  id?: string;
}

function ResolutionView({
  difficulty, rollMain, rollEffort, total, isSuccess, onRollDice, onNextPhase,
}: PlayerPanelProps) {
  const ready = rollMain !== null && rollMain !== undefined && rollEffort !== null && rollEffort !== undefined;

  return (
    <div className={styles.panelBody}>
      {difficulty != null && (
        <div className={styles.difficultyBadge}>
          Difficulty: <strong>{difficulty}</strong>
        </div>
      )}
      <div className={styles.diceRow}>
        <DieSelector
          sides={10}
          value={rollMain ?? null}
          onChange={d10 => onRollDice?.(d10, rollEffort ?? 1)}
          label="Threat Die (d10)"
          color="red"
        />
        <DieSelector
          sides={4}
          value={rollEffort ?? null}
          onChange={d4 => onRollDice?.(rollMain ?? 1, d4)}
          label="Effort Die (d4)"
          color="white"
        />
      </div>
      {ready && total != null && (
        <div className={`${styles.resultBanner} ${isSuccess ? styles.success : styles.failure}`}>
          Total: {total} — {isSuccess ? 'SUCCESS' : 'FAILURE'}
        </div>
      )}
      <ActionFooter
        label={ready ? 'Apply Fallout' : 'Select dice first'}
        disabled={!ready}
        onClick={onNextPhase}
      />
    </div>
  );
}

function FalloutView({ strikesToAssign, onNextPhase }: PlayerPanelProps) {
  return (
    <div className={styles.panelBody}>
      {(strikesToAssign ?? 0) > 0 && (
        <div className={styles.infoBanner}>
          {strikesToAssign} strike{(strikesToAssign ?? 0) > 1 ? 's' : ''} to assign
        </div>
      )}
      <ActionFooter label="Continue" onClick={onNextPhase} />
    </div>
  );
}

function GenericView({ phase, onNextPhase }: { phase: string; onNextPhase?: () => void }) {
  const label = phase === 'scene-setup' ? 'Draw Card'
    : phase === 'conversation-stakes' ? 'Proceed to Dice'
    : phase === 'resolve-scene' ? 'Apply Fallout'
    : 'Next';
  return (
    <div className={styles.panelBody}>
      <ActionFooter label={label} onClick={onNextPhase} />
    </div>
  );
}

export function PlayerPanel(props: PlayerPanelProps) {
  const { phase, id } = props;

  const content = (() => {
    if (phase === 'resolution') return <ResolutionView {...props} />;
    if (phase === 'fallout')    return <FalloutView {...props} />;
    return <GenericView phase={phase} onNextPhase={props.onNextPhase} />;
  })();

  return (
    <div id={id} className={styles.panelRoot}>
      <div className={styles.panelHeader}>
        <span className={styles.panelTitle}>
          {phase.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
        </span>
      </div>
      {content}
    </div>
  );
}
