/**
 * TrophySetupScreen — Initial trophy card entry.
 *
 * Operational phase — uses PhasePanel.
 */

'use client';

import React, { useState } from 'react';
import { PhasePanel, Card, ActionFooter, Text } from '@nott2/design-system';
import { useGameStore } from '../../../store/game-store';
import CardEntry from '../CardEntry';
import type { Suit, Rank } from '@nott2/game-engine';

export function TrophySetupScreen() {
  const { gameState, setTrophyTop, nextPhase } = useGameStore();
  const [suit, setSuit] = useState<Suit>('Spades');
  const [rank, setRank] = useState<Rank>(10);

  return (
    <PhasePanel
      title="Trophy Pile Setup"
      subtitle="The Trophy Pile starts with one Number Card drawn face-up from the reserve. Enter the card you drew."
    >
      <Card>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <Text variant="label" as="span">Trophy Card</Text>
            <CardEntry
              onCard={(s, r) => { setSuit(s); setRank(r); setTrophyTop(s, r); }}
              includeFaceCards={false}
            />
          </div>

        </div>
      </Card>
      <ActionFooter label="Continue →" onClick={nextPhase} />
    </PhasePanel>
  );
}
