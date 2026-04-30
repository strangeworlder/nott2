/**
 * WinScreen & LoseScreen — Cinematic endings.
 * Uses PhaseDisplay for full-bleed layout.
 */

'use client';

import { PhaseDisplay, ActionFooter } from '@nott2/design-system';
import { useGameStore } from '../../../store/game-store';

export function WinScreen() {
  const { fullReset } = useGameStore();
  return (
    <PhaseDisplay
      phase="win"
      body="You see the dawn. The Killer falls. Against every horrible script, you survived the Night of the Thirteenth."
    >
      <ActionFooter label="Play Again" variant="secondary" onClick={fullReset} />
    </PhaseDisplay>
  );
}

export function LoseScreen() {
  const { fullReset } = useGameStore();
  return (
    <PhaseDisplay
      phase="lose"
      body="The Killer wins. Every character is dead. This was always how the script ended. Somewhere, the credits roll over your bodies."
    >
      <ActionFooter label="Start Over" onClick={fullReset} />
    </PhaseDisplay>
  );
}
