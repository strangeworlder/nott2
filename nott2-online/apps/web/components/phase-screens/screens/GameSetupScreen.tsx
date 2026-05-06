/**
 * GameSetupScreen — Character names and rules modules.
 *
 * Operational phase — uses PhasePanel.
 */

'use client';

import React, { useState } from 'react';
import {
  PhasePanel, Card, ActionFooter, Icon, suitToIconName, Text, Toggle,
} from '@nott2/design-system';
import { useGameStore } from '../../../store/game-store';
import type { Suit } from '@nott2/game-engine';

export function GameSetupScreen() {
  const { gameState, initGame, nextPhase } = useGameStore();
  const [classicSetup, setClassicSetup] = useState(false);
  const [finalGirl, setFinalGirl] = useState(false);
  const [names, setNames] = useState<Record<Suit, string>>({
    Spades:   gameState.characters.find(c => c.id === 'Spades')?.name ?? '',
    Hearts:   gameState.characters.find(c => c.id === 'Hearts')?.name ?? '',
    Clubs:    gameState.characters.find(c => c.id === 'Clubs')?.name ?? '',
    Diamonds: gameState.characters.find(c => c.id === 'Diamonds')?.name ?? '',
  });

  const handleStart = () => {
    initGame('default', { classicSetup, finalGirl }, names);
    nextPhase();
  };

  return (
    <PhasePanel
      title="Game Setup"
      subtitle="Name your characters and choose your rules modules."
      step={{ current: 1, total: 2 }}
    >
      <Card title="Character Names (Optional)">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {(['Spades', 'Hearts', 'Clubs', 'Diamonds'] as Suit[]).map(suit => (
            <div key={suit}>
              <Text variant="label" as="label" className="field-label" htmlFor={`name-${suit}`}>
                <Icon name={suitToIconName(suit)} size={16} /> {suit}
              </Text>
              <input
                id={`name-${suit}`}
                type="text"
                className="field-select"
                value={names[suit]}
                onChange={e => setNames(n => ({ ...n, [suit]: e.target.value }))}
                placeholder={`The ${suit === 'Spades' ? 'Power' : suit === 'Hearts' ? 'Resolve' : suit === 'Clubs' ? 'Intellect' : 'Finesse'}`}
              />
            </div>
          ))}
        </div>
      </Card>

      <Card title="Rules Modules">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <Toggle variant="switch" value={classicSetup} onChange={setClassicSetup} labelOn="On" labelOff="Off" />
            <div>
              <Text variant="label" as="div">Classic Setup</Text>
              <Text variant="caption" color="muted" as="div" style={{ marginTop: 2 }}>
                Curated deck: 2s, 3s, 4s in threat deck. Ordered reserve: 5–10. Starts with a random 10 as trophy.
              </Text>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <Toggle variant="switch" value={finalGirl} onChange={setFinalGirl} labelOn="On" labelOff="Off" />
            <div>
              <Text variant="label" as="div">Final Girl</Text>
              <Text variant="caption" color="muted" as="div" style={{ marginTop: 2 }}>
                Increased lethality. Any face card encounter earns a Strike. Solo survivor triggers Act 3.
              </Text>
            </div>
          </div>
        </div>
      </Card>

      <ActionFooter label="Initialize Decks →" onClick={handleStart} />
    </PhasePanel>
  );
}
