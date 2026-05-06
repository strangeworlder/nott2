/**
 * SceneSetupScreen — Multi-step scene preparation.
 *
 * Sub-flow (§8.1):
 *   1. Ensure ≥1 card visible (draw if table empty)
 *   2. Select Active Player (auto during Prologue, manual otherwise — half-blind)
 *   3. If only number cards visible and <2 cards: draw second card
 *   4. Select card to challenge
 *
 * Operational phase — uses PhasePanel.
 */

'use client';

import React from 'react';
import {
  PhasePanel, Card, Button, ActionFooter,
  StatusCallout, WaitingIndicator, Icon, suitToIconName, Text, Badge,
} from '@nott2/design-system';
import { useGameStore } from '../../../store/game-store';
import { getRankLabel } from '../helpers';

export function SceneSetupScreen() {
  const {
    gameState, computed,
    selectCard, selectJoker, setActivePlayer, showSceneChallenge,
  } = useGameStore();
  // Multiplayer control — separate cast to avoid losing engine types above
  const { isHost, roomCode } = useGameStore() as any;
  const { deck, scene, characters } = gameState;
  // In multiplayer mode only the host controls scene setup.
  // In demo mode (no roomCode) the local player controls everything.
  const canControl = !roomCode || isHost;
  const { visibleCards } = deck;

  // ── Derive sub-state ──────────────────────────────────────────────────────

  const hasSpecialCard = visibleCards.some(c => c.rank >= 11 || c.rank === 1);
  // A Joker is only "on the table" when it is actually in visibleCards,
  // not merely because jokersAdded is true (they start in the threat deck).
  const hasJokerOnTable = deck.visibleCards.some(c => 'isJoker' in c && c.isJoker);
  const mustChallengeImmediately = hasSpecialCard || (gameState.isEndgame && hasJokerOnTable);

  const needsFirstDraw = visibleCards.length === 0;
  const apSelected = scene.activePlayerId !== null;
  const needsApSelection = visibleCards.length >= 1 && !apSelected;
  const needsSecondDraw = apSelected && visibleCards.length < 2 && !mustChallengeImmediately && !gameState.isEndgame;
  // readyToChallenge requires at least one card on the mat — mustChallengeImmediately
  // cannot override an empty table, it only skips the second draw step.
  const readyToChallenge = apSelected && visibleCards.length >= 1 && (visibleCards.length >= 2 || mustChallengeImmediately);
  const canAdvance = readyToChallenge && (scene.selectedCardId !== null || scene.activeJoker !== null);

  // ── Prologue auto-AP ──────────────────────────────────────────────────────
  // When an Ace is drawn, the matching Aptitude character is auto-selected.
  const firstCard = visibleCards[0] ?? null;
  const isPrologueAce = firstCard?.rank === 1;

  // Auto-set AP during Prologue (Ace suit → character with matching aptitude)
  // Using a check inside render to avoid flicker — setActivePlayer is idempotent
  if (isPrologueAce && needsApSelection) {
    // Find the character whose aptitude matches the Ace's suit
    const matchingChar = characters.find(c => c.aptitude === firstCard.suit && !c.isDead);
    if (matchingChar) {
      // Schedule for next microtask to avoid setState-during-render
      setTimeout(() => setActivePlayer(matchingChar.id), 0);
    }
  }

  // ── Active player info ────────────────────────────────────────────────────
  const activePlayer = gameState.players.find(p => p.id === scene.activePlayerId);
  const activeChar = activePlayer
    ? characters.find(c => c.id === activePlayer.characterId)
    : null;

  const livingCharacters = characters.filter(c => !c.isDead);

  return (
    <PhasePanel
      title="Scene Setup"
      subtitle={
        computed.isPrologue
          ? 'Prologue — Aces on top. The matching Aptitude player takes the spotlight.'
          : needsFirstDraw
          ? gameState.isEndgame
            ? 'The Finale begins. Draw from the Threat Deck — only Jokers remain.'
            : 'Draw the first card from the Threat Deck.'
          : needsApSelection
          ? 'Choose who rises to the challenge. You can only see one card — choose wisely.'
          : needsSecondDraw
          ? 'Draw a second card to give the Active Player a choice.'
          : 'Select a card to challenge, then proceed.'
      }
    >



        {/* Step 1: Draw first card (table empty) */}
        {needsFirstDraw && canControl && (
          <StatusCallout variant="highlight" icon="playing_cards">
            Click the <strong>Threat Deck</strong> on the table to draw the first card and begin the scene.
          </StatusCallout>
        )}
        {needsFirstDraw && !canControl && (
          <WaitingIndicator message="Waiting for host to draw the first card…" />
        )}

        {/* Step 2: AP Selection (after first card visible, not during Prologue) */}
        {needsApSelection && !isPrologueAce && canControl && (() => {
          const available = gameState.turnOrder.available;
          const acted = gameState.turnOrder.acted;
          const roundInfo = acted.length > 0
            ? `Round progress: ${acted.length} of ${acted.length + available.length} have acted this round.`
            : '';
          return (
            <Card title="Who Rises to the Challenge?">
              <Text variant="caption" color="muted" style={{ marginBottom: 12 }}>
                Choose the Active Player for this scene. This is a half-blind decision — you can only see one threat card.
                {firstCard && (
                  <> The visible card is <Icon name={suitToIconName(firstCard.suit)} size={14} />{getRankLabel(firstCard.rank)}.</>
                )}
              </Text>
              {roundInfo && (
                <StatusCallout variant="info" icon="movie">{roundInfo}</StatusCallout>
              )}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
                {livingCharacters.map(c => {
                  const hasActed = acted.includes(c.id);
                  return (
                    <Button
                      key={c.id}
                      variant={hasActed ? 'ghost' : 'secondary'}
                      size="sm"
                      onClick={() => setActivePlayer(c.id)}
                      disabled={hasActed}
                    >
                      <Icon name={suitToIconName(c.id)} size={20} />
                      <Text variant="label" as="span">{c.name}</Text>
                      {c.strikes > 0 && (
                        <Text variant="micro" color="red" as="span">
                          {Array.from({ length: c.strikes }, (_, i) => (
                            <Icon key={i} name="strike_filled" size={12} />
                          ))}
                        </Text>
                      )}
                      {hasActed && (
                        <Badge variant="outline">Done</Badge>
                      )}
                    </Button>
                  );
                })}
              </div>
            </Card>
          );
        })()}
        {needsApSelection && !isPrologueAce && !canControl && (
          <WaitingIndicator message="Waiting for host to choose the Active Player…" />
        )}

        {/* Prologue auto-AP indicator */}
        {isPrologueAce && apSelected && activeChar && (
          <StatusCallout variant="highlight" icon="person_raised_hand">
            <Icon name={suitToIconName(activeChar.id)} size={16} /> <strong>{activeChar.name}</strong> must rise to the challenge — the Ace of {firstCard?.suit} demands it.
          </StatusCallout>
        )}

        {/* Active Player badge (non-prologue, after selection) */}
        {apSelected && activeChar && !isPrologueAce && (
          <StatusCallout variant="info" icon="movie">
            Active Player: <Icon name={suitToIconName(activeChar.id)} size={16} /> <strong>{activeChar.name}</strong>
            {activeChar.aptitude && scene.selectedCardId && (() => {
              const challengedCard = visibleCards.find(c => c.id === scene.selectedCardId);
              return challengedCard && activeChar.aptitude === challengedCard.suit ? (
                <Text variant="caption" color="success" as="span" style={{ marginLeft: 8 }}><Icon name="auto_awesome" size={14} /> Aptitude match!</Text>
              ) : null;
            })()}
          </StatusCallout>
        )}

        {/* Step 3: Draw second card (AP selected, only number cards on table) */}
        {needsSecondDraw && canControl && (
          <StatusCallout variant="highlight" icon="playing_cards">
            Click the <strong>Threat Deck</strong> on the table to draw a second card and give {activeChar?.name ?? 'the Active Player'} a choice.
          </StatusCallout>
        )}
        {needsSecondDraw && !canControl && (
          <WaitingIndicator message="Waiting for host to draw a second card…" />
        )}

        {/* Step 4: Challenge button — host only in multiplayer */}
        {readyToChallenge && canControl && (
          <ActionFooter
            label="Challenge Selected Card →"
            disabled={!canAdvance}
            onClick={showSceneChallenge}
            hint={canAdvance ? undefined : 'Select a card first'}
          />
        )}
        {readyToChallenge && !canControl && (
          <WaitingIndicator message="Waiting for host to start the challenge…" />
        )}
    </PhasePanel>
  );
}
