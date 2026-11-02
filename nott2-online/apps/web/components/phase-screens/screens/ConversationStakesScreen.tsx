/**
 * ConversationStakesScreen — Step 2 / 4: Conversation & Stakes.
 *
 * Uses `<SceneDossier>` as a persistent diegetic stage:
 *   - Beat 1 ('scene'): Side-by-side Director (Active Player) & Camera Crew prompts
 *     with role-gated 9-word `<ScriptSparks>` drawers and an ambient
 *     "Something's Not Right..." escalation interjection bar.
 *   - Beat 2 ('stakes'): Swaps the stage to the Overexertion sacrifice commitment
 *     with a single-click "Sacrifice Agreed — Proceed to Roll →" CTA (skipped for
 *     Prologue Aces, which advance directly from Beat 1 to Step 3).
 */

'use client';

import React, { useState, useEffect } from 'react';
import {
  PhasePanel,
  ActionFooter,
  suitToIconName,
  ScriptSparks,
  SceneDossier,
} from '@nott2/design-system';
import { useGameStore } from '../../../store/game-store';
import {
  getDetailedScenePrompt,
  getDetailedJokerPrompt,
  getFaceCardPrefix,
  getPlaysetInfo,
  getStakesGuidance,
  getCombinedFragmentPool,
  getSuitTheme,
  type Rank,
} from '@nott2/game-engine';

const SCENE_IMAGES: Record<string, string> = {
  Spades: '/textures/scenes/spades.png',
  Hearts: '/textures/scenes/hearts.png',
  Clubs: '/textures/scenes/clubs.png',
  Diamonds: '/textures/scenes/diamonds.png',
  Joker: '/textures/scenes/spades.png',
};

export function ConversationStakesScreen() {
  const {
    gameState,
    confirmSacrifice,
    escalate,
    nextPhase,
  } = useGameStore();
  const { playerId, roomCode } = useGameStore() as any;
  const { scene, deck, currentAct, playset, characters, players } = gameState;

  const [beat, setBeat] = useState<'scene' | 'stakes'>('scene');

  // Reset to Beat 1 whenever the active card or joker changes
  useEffect(() => {
    setBeat('scene');
  }, [scene.selectedCardId, scene.activeJoker]);

  const selectedCard = scene.selectedCardId
    ? deck.visibleCards.find(c => c.id === scene.selectedCardId) ?? null
    : null;

  const activePlayer = players.find(p => p.id === scene.activePlayerId);
  const activeChar = activePlayer
    ? characters.find(c => c.id === activePlayer.characterId) ?? null
    : null;

  // Role-gating: in multiplayer, each player only sees their own role's ScriptSparks.
  // In solo Demo mode (!roomCode), both are accessible in their respective columns.
  const isMultiplayer = Boolean(roomCode);
  const isDirector = !isMultiplayer || playerId === scene.activePlayerId;
  const isCameraCrew = !isMultiplayer || playerId !== scene.activePlayerId;

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

  const difficultyBreakdown =
    selectedCard && selectedCard.rank === 1
      ? 'Prologue Ace = 1'
      : selectedCard && selectedCard.rank <= 10
      ? `Number card rank = ${selectedCard.rank}`
      : selectedCard && selectedCard.rank >= 11
      ? `Trophy (${trophyRank}) + ${selectedCard.rank - 10} = ${difficulty}`
      : scene.activeJoker
      ? `Trophy (${trophyRank}) + 0 = ${difficulty}`
      : undefined;

  const suit = selectedCard?.suit ?? null;
  const rank = (selectedCard?.rank as Rank | undefined) ?? null;
  const isPrologueAce = rank === 1;
  const isFaceCard = selectedCard ? selectedCard.rank >= 11 : false;
  const isJoker = Boolean(scene.activeJoker);

  // ── Resolve Platonic two-part prompt + multi-axis word pools ───────────────
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

  const fragmentPool = getCombinedFragmentPool({
    suit,
    act: currentAct,
    rank,
    isJoker,
    playsetId: playset,
  });

  // ── Dossier Header metadata ────────────────────────────────────────────────
  const suitTheme = isJoker
    ? 'The Finale'
    : isFaceCard
    ? 'The Killer is Here'
    : suit
    ? getSuitTheme(suit) ?? suit
    : 'The Scene';

  const suitIcon = isJoker
    ? 'warning'
    : suit
    ? suitToIconName(suit)
    : 'playing_cards';

  const imageSrc = isJoker
    ? SCENE_IMAGES.Joker
    : suit
    ? SCENE_IMAGES[suit] ?? SCENE_IMAGES.Spades
    : SCENE_IMAGES.Spades;

  const handleConfirmAndRoll = () => {
    if (!scene.sacrificeConfirmed) {
      confirmSacrifice();
    }
    nextPhase();
  };

  return (
    <PhasePanel
      title={
        isPrologueAce
          ? 'Prologue — Establishing Shot'
          : beat === 'scene'
          ? 'Conversation & Stakes'
          : 'Commit to the Effort'
      }
      subtitle={
        isPrologueAce
          ? 'Introduce your character, answer the Camera Crew, and set the tone before the nightmare begins.'
          : beat === 'scene'
          ? 'Frame the scene together — the Director leads the action while the Camera Crew focuses the lens.'
          : 'Agree on what the Active Player risks if they push into Overexertion (Effort 3+).'
      }
      step={{ current: 2, total: 4 }}
    >
      <SceneDossier
        mode={beat === 'stakes' ? 'stakes' : 'script'}
        imageSrc={imageSrc}
        suitIcon={suitIcon}
        suitTheme={suitTheme}
        activeCharacterName={activeChar?.name}
        activeCharacterSuit={activeChar ? suitToIconName(activeChar.id) : undefined}
        archetypes={isPrologueAce && suit ? playsetInfo.archetypes[suit] : undefined}
        difficulty={difficulty}
        difficultyBreakdown={difficultyBreakdown}
        escalated={scene.escalationUsed}
        onEscalate={!isPrologueAce ? escalate : undefined}
        escalationSparks={
          !isPrologueAce && !scene.escalationUsed && isCameraCrew ? (
            <ScriptSparks
              words={fragmentPool.cameraCrewWords}
              triggerLabel="Need a Spark? — Escalation Words"
              trayHint="9 sensory & atmospheric words to spark your escalation:"
            />
          ) : undefined
        }
        directorPrompt={activePlayerPrompt}
        directorSubtext={
          isPrologueAce
            ? 'Tell the table your name, your archetype in the group, and why you didn’t stay home tonight.'
            : undefined
        }
        directorSparks={
          isDirector ? (
            <ScriptSparks
              words={fragmentPool.activePlayerWords}
              triggerLabel="Need a Spark? — 9 Director Words"
            />
          ) : undefined
        }
        cameraPrompt={cameraCrewPrompt}
        cameraSubtext="Focus the lens & pull the scene into a conversation."
        cameraSparks={
          isCameraCrew ? (
            <ScriptSparks
              words={fragmentPool.cameraCrewWords}
              questions={fragmentPool.cameraQuestions}
              triggerLabel="Need a Spark? — 9 Sensory Words & Camera Questions"
              trayHint="9 sensory & atmospheric words (grab one or two):"
              questionsLabel={`Act ${currentAct} — Focus the Camera (ask one):`}
            />
          ) : undefined
        }
        stakesGuidance={stakesGuidance}
        stakesSparks={
          <ScriptSparks
            words={
              isDirector
                ? fragmentPool.activePlayerWords
                : fragmentPool.cameraCrewWords
            }
            triggerLabel="Need a Spark? — 9 Sacrifice Words"
          />
        }
        onBackToScene={beat === 'stakes' ? () => setBeat('scene') : undefined}
      />

      {isPrologueAce ? (
        <ActionFooter
          label="Proceed to Roll →"
          onClick={nextPhase}
        />
      ) : beat === 'scene' ? (
        <ActionFooter
          label="Set the Stakes →"
          onClick={() => setBeat('stakes')}
        />
      ) : (
        <ActionFooter
          label="Sacrifice Agreed — Proceed to Roll →"
          onClick={handleConfirmAndRoll}
        />
      )}
    </PhasePanel>
  );
}
