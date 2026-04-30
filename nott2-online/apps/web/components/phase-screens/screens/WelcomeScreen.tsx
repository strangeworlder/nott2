/**
 * WelcomeScreen — Cinematic entry point.
 *
 * Uses PhaseDisplay as the full-bleed screen.
 */

'use client';

import { PhaseDisplay, ActionFooter } from '@nott2/design-system';
import { useGameStore } from '../../../store/game-store';

export function WelcomeScreen() {
  const { nextPhase } = useGameStore();
  return (
    <PhaseDisplay
      phase="welcome"
      subtitle="A director-less horror TTRPG for 4 players. You are not heroes — you are victims in a slasher movie, and the script is already written."
    >
      <ActionFooter label="Begin Setup →" onClick={nextPhase} />
    </PhaseDisplay>
  );
}
