/**
 * GameSetupScreen — Playset selection, character names/archetypes, and rules modules.
 *
 * Operational phase — uses PhasePanel and Design System primitives.
 */

'use client';

import React, { useState } from 'react';
import {
  PhasePanel,
  Card,
  ActionFooter,
  Text,
  Toggle,
  TextField,
  SegmentedControl,
  Grid,
  Stack,
  Row,
  Badge,
} from '@nott2/design-system';
import { useGameStore } from '../../../store/game-store';
import {
  getAvailablePlaysets,
  getPlaysetInfo,
  getSuitTheme,
  type Suit,
} from '@nott2/game-engine';

const SUITS: readonly Suit[] = ['Spades', 'Hearts', 'Clubs', 'Diamonds'];

export function GameSetupScreen() {
  const { gameState, initGame, nextPhase } = useGameStore();
  const playsets = getAvailablePlaysets();

  const [selectedPlayset, setSelectedPlayset] = useState<string>(gameState.playset || 'default');
  const [classicSetup, setClassicSetup] = useState(gameState.rulesModules.classicSetup);
  const [finalGirl, setFinalGirl] = useState(gameState.rulesModules.finalGirl);
  const [names, setNames] = useState<Record<Suit, string>>({
    Spades:   gameState.characters.find(c => c.id === 'Spades')?.name ?? '',
    Hearts:   gameState.characters.find(c => c.id === 'Hearts')?.name ?? '',
    Clubs:    gameState.characters.find(c => c.id === 'Clubs')?.name ?? '',
    Diamonds: gameState.characters.find(c => c.id === 'Diamonds')?.name ?? '',
  });

  const activePlayset = getPlaysetInfo(selectedPlayset);

  const handlePlaysetChange = (playsetId: string) => {
    setSelectedPlayset(playsetId);
    const info = getPlaysetInfo(playsetId);
    setClassicSetup(info.defaultModules.classicSetup);
    setFinalGirl(info.defaultModules.finalGirl);
  };

  const handleStart = () => {
    initGame(selectedPlayset, { classicSetup, finalGirl }, names);
    nextPhase();
  };

  return (
    <PhasePanel
      title="Game Setup"
      subtitle="Choose your horror movie, name your cast, and configure the deck rules."
      step={{ current: 1, total: 2 }}
    >
      <Card title="Choose the Playset">
        <Stack gap="sm">
          <SegmentedControl
            options={playsets.map(p => ({ value: p.id, label: p.name }))}
            value={selectedPlayset}
            onChange={handlePlaysetChange}
          />
          <Text variant="flavor">{activePlayset.tagline}</Text>
          <Text variant="caption" color="muted">
            {activePlayset.description}
          </Text>
          <Row gap="xs" wrap>
            {activePlayset.touchstones.map(film => (
              <Badge key={film} variant="outline">
                {film}
              </Badge>
            ))}
          </Row>
        </Stack>
      </Card>

      <Card title="Creating the Cast (Now or During the 4 Prologue Aces)">
        <Stack gap="sm">
          <Text variant="caption" color="muted">
            You are no heroes—just victims in the wrong place at the wrong time. Pick a movie-character name and an archetype for each Aptitude, or discover them on the fly during the four Prologue Aces.
          </Text>
          <Grid columns={2} gap="md">
            {SUITS.map(suit => {
              const suitTheme = getSuitTheme(suit) ?? suit;
              const archetypes = activePlayset.archetypes[suit].join(', ');
              return (
                <TextField
                  key={suit}
                  id={`name-${suit}`}
                  label={`${suit} — ${suitTheme}`}
                  value={names[suit]}
                  onChange={val => setNames(n => ({ ...n, [suit]: val }))}
                  placeholder={`The ${suit === 'Spades' ? 'Power' : suit === 'Hearts' ? 'Resolve' : suit === 'Clubs' ? 'Intellect' : 'Finesse'}`}
                  helperText={`Archetype ideas: ${archetypes}`}
                />
              );
            })}
          </Grid>
        </Stack>
      </Card>

      <Card title="Rules Modules">
        <Stack gap="md">
          <Row align="start" gap="md">
            <Toggle variant="switch" value={classicSetup} onChange={setClassicSetup} labelOn="On" labelOff="Off" />
            <Stack gap="xs">
              <Text variant="label">Classic Setup</Text>
              <Text variant="caption" color="muted">
                Curated deck: 2s, 3s, 4s in threat deck. Ordered reserve: 5–10. Starts with a random 10 as trophy.
              </Text>
            </Stack>
          </Row>
          <Row align="start" gap="md">
            <Toggle variant="switch" value={finalGirl} onChange={setFinalGirl} labelOn="On" labelOff="Off" />
            <Stack gap="xs">
              <Text variant="label">Final Girl</Text>
              <Text variant="caption" color="muted">
                Increased lethality. Any face card encounter earns a Strike. Solo survivor triggers Act 3.
              </Text>
            </Stack>
          </Row>
        </Stack>
      </Card>

      <ActionFooter label="Initialize Decks →" onClick={handleStart} />
    </PhasePanel>
  );
}
