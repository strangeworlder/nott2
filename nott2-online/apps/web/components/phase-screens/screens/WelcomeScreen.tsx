/**
 * WelcomeScreen — Cinematic entry point.
 *
 * Uses PhaseDisplay as the full-bleed screen.
 */

'use client';

import { PhaseDisplay, ActionFooter } from '@nott2/design-system';
import { useGameStore } from '../../../store/game-store';

export function WelcomeScreen() {
  const { nextPhase, gameState } = useGameStore();

  /** lobby and welcome both render this screen — skip the invisible
   *  lobby→welcome transition so a single click reaches game-setup. */
  const handleBeginSetup = () => {
    if (gameState.phase === 'lobby') {
      nextPhase(); // lobby → welcome
    }
    nextPhase(); // welcome → game-setup
  };

  return (
    <PhaseDisplay
      phase="welcome"
      subtitle="A director-less horror TTRPG for 4 players. You are not heroes — you are victims in a slasher movie, and the script is already written."
    >
      <ActionFooter label="Begin Setup →" onClick={handleBeginSetup} />
    </PhaseDisplay>
  );
}
