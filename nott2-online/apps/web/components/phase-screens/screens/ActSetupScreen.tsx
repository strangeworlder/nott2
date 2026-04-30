/**
 * ActSetupScreen — Cinematic act transition.
 *
 * Uses PhaseDisplay for full-bleed layout.
 */

'use client';

import { PhaseDisplay, Card, ActionFooter } from '@nott2/design-system';
import { useGameStore } from '../../../store/game-store';

const ACT_COPY = {
  1: {
    title: 'Act I — The Setup',
    sub: 'The Killer is only a shadow. Four Aces sit on top of the Threat Deck — establishing shots for each character.',
    rules: 'Only Jacks can appear. Resolving a Face Card ends Act 1.',
  },
  2: {
    title: 'Act II — The Horror Story',
    sub: 'The Killer is active. People will die. Queens enter the mix when Face Cards are defeated.',
    rules: 'Act 2 ends when 4 weaknesses are found OR 13 reserve cards have been added.',
  },
  3: {
    title: 'Act III — The Climax',
    sub: 'The mask comes off. All Number Cards are removed from the Threat Deck. Every encounter is with the Killer.',
    rules: 'Only Face Cards remain. Every scene is a confrontation.',
  },
};

const FINALE_COPY = {
  title: 'The Finale',
  sub: 'All four weaknesses have been found. Both Jokers have been shuffled into the Threat Deck. This is the true ending.',
  rules: 'Red Joker: one character makes a final Test — success ends the night, failure kills them and reshuffles it. Black Joker: success removes the highest face card; failure adds a King. Then the Black Joker is removed permanently.',
};

export function ActSetupScreen() {
  const { gameState, nextPhase } = useGameStore() as any;
  const act = gameState.currentAct as 1 | 2 | 3;
  const isFinale = gameState.isEndgame;
  const copy = isFinale ? FINALE_COPY : (ACT_COPY[act] ?? ACT_COPY[1]);
  const finaleNext = !isFinale && gameState.pendingActSetups?.includes('finale');

  const label = finaleNext
    ? 'Continue to Finale →'
    : isFinale
    ? 'Begin the Finale →'
    : 'Begin Act →';

  return (
    <PhaseDisplay phase="act-setup" title={copy.title} subtitle={copy.sub}>
      <div className="stack" style={{ maxWidth: 480, margin: '0 auto', width: '100%' }}>
        <Card variant="instruction" title="Key Rule">
          <p className="text-muted">{copy.rules}</p>
        </Card>
        <ActionFooter label={label} onClick={nextPhase} />
      </div>
    </PhaseDisplay>
  );
}
