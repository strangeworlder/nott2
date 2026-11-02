/**
 * ConversationStakesScreen — Two-part Platonic scene prompt (Director + Camera Crew),
 * two read-only 9-word <ScriptSparks> drawers (Active Player + Camera Crew with
 * official "Focus the Camera" questions), Escalation, and Stakes.
 *
 * Operational phase — uses PhasePanel and Design System primitives.
 */

'use client';

import React from 'react';
import {
  PhasePanel,
  Card,
  Button,
  ActionFooter,
  DifficultyBadge,
  Text,
  Icon,
  suitToIconName,
  Stack,
  Row,
  Separator,
  Badge,
  ScriptSparks,
} from '@nott2/design-system';
import { useGameStore } from '../../../store/game-store';
import {
  getDetailedScenePrompt,
  getDetailedJokerPrompt,
  getFaceCardPrefix,
  getPlaysetInfo,
  getStakesGuidance,
  getCombinedFragmentPool,
  type Rank,
} from '@nott2/game-engine';

export function ConversationStakesScreen() {
  const {
    gameState,
    confirmSacrifice,
    escalate,
    nextPhase,
  } = useGameStore();
  const { scene, deck, currentAct, playset, characters, players } = gameState;

  const selectedCard = scene.selectedCardId
    ? deck.visibleCards.find(c => c.id === scene.selectedCardId) ?? null
    : null;

  const activePlayer = players.find(p => p.id === scene.activePlayerId);
  const activeChar = activePlayer
    ? characters.find(c => c.id === activePlayer.characterId) ?? null
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
    : scene.activeJoker
    ? trophyRank
    : null;

  const suit = selectedCard?.suit ?? null;
  const rank = (selectedCard?.rank as Rank | undefined) ?? null;
  const isPrologueAce = rank === 1;

  // ── Resolve Platonic two-part prompt ───────────────────────────────────────
  const detailedPrompt = scene.activeJoker
    ? getDetailedJokerPrompt(scene.activeJoker, playset)
    : suit && rank
    ? getDetailedScenePrompt(
        suit,
        rank,
        !gameState.weaknessesFound.includes(suit),
        playset,
      )
    : null;

  const activePlayerPrompt = detailedPrompt?.activePlayer ?? getFaceCardPrefix();
  const cameraCrewPrompt =
    detailedPrompt?.cameraCrew ??
    'Describe the surrounding shadows, the tension in the air, and who else is in the frame.';

  const playsetInfo = getPlaysetInfo(playset);
  const stakesGuidance = getStakesGuidance(currentAct);

  // Combined multi-axis word pools (Universal/Playset + Suit + Act + RankGroup)
  const fragmentPool = getCombinedFragmentPool({
    suit,
    act: currentAct,
    rank,
    isJoker: Boolean(scene.activeJoker),
    playsetId: playset,
  });

  const canProceed = isPrologueAce || scene.sacrificeConfirmed;

  return (
    <PhasePanel
      title={isPrologueAce ? 'Prologue — Establishing Shot' : 'Conversation & Stakes'}
      subtitle={
        isPrologueAce
          ? 'Introduce your character, answer the Camera Crew, and set the tone before the nightmare begins.'
          : 'Start the conversation, focus the camera, escalate the danger, and agree on the sacrifice.'
      }
      step={{ current: 2, total: 4 }}
    >
      {/* Card 1: Two-Part Scene Prompt (Active Player + Camera Crew) */}
      <Card variant="instruction" title="The Scene — Start the Conversation">
        <Stack gap="md">
          {/* Part 1: Active Player (Director) */}
          <Stack gap="xs">
            <Row gap="xs" align="center">
              <Badge variant="red">Active Player — Director</Badge>
              {activeChar && (
                <Text variant="label">
                  <Icon name={suitToIconName(activeChar.id)} size={14} /> {activeChar.name}
                </Text>
              )}
            </Row>

            {isPrologueAce && suit && (
              <Row gap="xs" wrap>
                {playsetInfo.archetypes[suit].map(arch => (
                  <Badge key={arch} variant="outline">
                    {arch}
                  </Badge>
                ))}
              </Row>
            )}

            <Text variant="flavor">&ldquo;{activePlayerPrompt}&rdquo;</Text>

            <ScriptSparks
              words={fragmentPool.activePlayerWords}
              triggerLabel="Need a Spark? — 9 Narration Words"
              trayHint="9 evocative words to spark your narration (grab one or two):"
            />
          </Stack>

          <Separator />

          {/* Part 2: Camera Crew (The Table) */}
          <Stack gap="xs">
            <Row gap="xs" align="center">
              <Badge variant="outline">Camera Crew — The Table</Badge>
              <Text variant="caption" color="muted">
                Focus the lens &amp; pull the scene into a conversation
              </Text>
            </Row>
            <Text variant="body">{cameraCrewPrompt}</Text>
            <ScriptSparks
              words={fragmentPool.cameraCrewWords}
              questions={fragmentPool.cameraQuestions}
              questionsLabel={`Act ${currentAct} — Focus the Camera (ask one):`}
              triggerLabel="Need a Spark? — Atmosphere &amp; Camera Questions"
              trayHint="9 sensory &amp; atmospheric words to paint the shot:"
            />
          </Stack>
        </Stack>
      </Card>

      {difficulty !== null && (
        <DifficultyBadge
          value={difficulty}
          breakdown={
            selectedCard && selectedCard.rank === 1
              ? 'Prologue Ace = 1 (Always succeeds, but Effort 4 still triggers a Breaking Point Strike)'
              : selectedCard && selectedCard.rank <= 10
              ? `Number card rank = ${selectedCard.rank}`
              : selectedCard && selectedCard.rank >= 11
              ? `Trophy (${trophyRank}) + ${selectedCard.rank - 10} = ${difficulty}`
              : scene.activeJoker
              ? `Trophy (${trophyRank}) + 0 = ${difficulty}`
              : undefined
          }
        />
      )}

      {/* Card 2: Escalation ("Something's Not Right...") */}
      <Card
        title="Escalation — &ldquo;Something&rsquo;s Not Right...&rdquo;"
        complete={scene.escalationUsed}
        completionLabel="Escalation used this scene."
      >
        <Stack gap="sm">
          <Text variant="caption" color="muted">
            Once per scene, any player in the Camera Crew can interject: &ldquo;Something&rsquo;s not right...&rdquo; and add one terrifying detail that makes the situation worse. The Active Player must accept this truth (no veto).
          </Text>
          {!scene.escalationUsed && (
            <Row>
              <Button variant="secondary" size="sm" onClick={escalate}>
                Escalation Used
              </Button>
            </Row>
          )}
        </Stack>
      </Card>

      {/* Card 3: The Stakes (Define the Overexertion Sacrifice) */}
      <Card
        title="The Stakes — Commit to the Effort"
        complete={scene.sacrificeConfirmed}
        completionLabel="Sacrifice agreed for Overexertion (3+)."
      >
        <Stack gap="sm">
          <Text variant="body">
            &ldquo;If you end up pushing yourself to reach your goal, what are you willing to risk?&rdquo;
          </Text>
          <Text variant="caption" color="muted">
            {stakesGuidance}
          </Text>
          {!scene.sacrificeConfirmed && (
            <Row>
              <Button variant="secondary" size="sm" onClick={confirmSacrifice}>
                Sacrifice Agreed
              </Button>
            </Row>
          )}
        </Stack>
      </Card>

      <ActionFooter
        label="Proceed to Roll →"
        disabled={!canProceed}
        hint={canProceed ? undefined : 'Agree on the Overexertion Sacrifice with the table first'}
        onClick={nextPhase}
      />
    </PhasePanel>
  );
}
