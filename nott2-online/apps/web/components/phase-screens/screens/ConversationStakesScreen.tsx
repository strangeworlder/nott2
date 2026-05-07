/**
 * ConversationStakesScreen — Scene prompt, difficulty, escalation, sacrifice.
 * Operational phase — uses PhasePanel.
 */

'use client';

import React from 'react';
import {
  PhasePanel, Card, Button, ActionFooter,
  StatusCallout, DifficultyBadge, Text, Icon,
} from '@nott2/design-system';
import { useGameStore } from '../../../store/game-store';
import type { Rank } from '@nott2/game-engine';
import { getScenePrompt, getJokerPrompt, getFaceCardPrefix } from '@nott2/game-engine';

export function ConversationStakesScreen() {
  const { gameState, confirmSacrifice, escalate, nextPhase } = useGameStore();
  const { scene, deck } = gameState;

  const selectedCard = scene.selectedCardId
    ? deck.visibleCards.find(c => c.id === scene.selectedCardId) ?? null
    : null;

  const trophyRank = deck.trophyTop?.rank ?? 1;
  const difficulty = selectedCard
    ? (() => {
        const r = selectedCard.rank;
        if (r === 1) return 1;
        if (r <= 10) return r;
        if (r === 11) return trophyRank + 1;
        if (r === 12) return trophyRank + 2;
        return trophyRank + 3;
      })()
    : scene.activeJoker ? trophyRank : null;

  const isFace = selectedCard ? selectedCard.rank >= 11 : false;
  const suit   = selectedCard?.suit;
  const rank   = selectedCard?.rank;

  let prompt: string;
  if (scene.activeJoker) {
    prompt = getJokerPrompt(scene.activeJoker);
  } else if (isFace) {
    prompt = getFaceCardPrefix();
    if (suit && rank) {
      const fp = getScenePrompt(suit, rank as Rank, !gameState.weaknessesFound.includes(suit));
      if (fp) prompt = `${getFaceCardPrefix()} — ${fp}`;
    }
  } else if (suit && rank) {
    prompt = getScenePrompt(suit, rank as Rank) ?? getFaceCardPrefix();
  } else {
    prompt = getFaceCardPrefix();
  }

  return (
    <PhasePanel
      title="Conversation & Stakes"
      subtitle="Focus the camera. Define the sacrifice. Then proceed to roll."
      step={{ current: 2, total: 4 }}
    >
      <Card variant="instruction" title="Scene Prompt">
        <Text variant="flavor">
          &ldquo;{prompt}&rdquo;
        </Text>
      </Card>

      {difficulty !== null && (
        <DifficultyBadge
          value={difficulty}
          breakdown={
            selectedCard && selectedCard.rank <= 10
              ? `Number card rank = ${selectedCard.rank}`
              : selectedCard && selectedCard.rank >= 11
              ? `Trophy (${trophyRank}) + ${selectedCard.rank - 10} = ${difficulty}`
              : scene.activeJoker ? `Trophy (${trophyRank}) + 0 = ${difficulty}` : undefined
          }
        />
      )}

      <Card
        title="Escalation — Something Not Right"
        complete={scene.escalationUsed}
        completionLabel="Escalation used this scene."
      >
        <Text variant="caption" color="muted" style={{ marginBottom: 12 }}>
          Any non-AP player can add a terrifying detail. Once per scene.
        </Text>
        {!scene.escalationUsed && (
          <Button variant="secondary" size="sm" onClick={escalate}>Use Escalation</Button>
        )}
      </Card>

      <Card
        title="The Stakes — Define the Sacrifice"
        complete={scene.sacrificeConfirmed}
        completionLabel="Sacrifice confirmed."
      >
        <Text variant="caption" color="muted" style={{ marginBottom: 12 }}>
          &ldquo;If you push yourself, what are you willing to sacrifice?&rdquo; Define the Overexertion result — specific and a genuine loss.
        </Text>
        {!scene.sacrificeConfirmed && (
          <Button variant="secondary" size="sm" onClick={confirmSacrifice}>Sacrifice Defined</Button>
        )}
      </Card>

      <ActionFooter label="Proceed to Roll →" onClick={nextPhase} />
    </PhasePanel>
  );
}
