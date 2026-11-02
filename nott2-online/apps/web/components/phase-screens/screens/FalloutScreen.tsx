/**
 * FalloutScreen — Step 4 / 4: The Result.
 *
 * Handles both 'resolve-scene' and 'fallout' phases in a progressive two-beat flow:
 *   - Beat 1 ('narration'): The Verdict & Narration — shows `<ResultBanner>`,
 *     `<EffortBand>`, and `<SceneDossier mode="script">` with side-by-side
 *     Director & Camera Crew outcome prompts and role-gated 9-word `<ScriptSparks>`.
 *   - Beat 2 ('aftermath'): The Aftermath Ledger — shows `<SceneDossier mode="aftermath">`
 *     with compact single-line Fate/Deck outcomes, tactile Strike assignment
 *     (pre-staging the Active Player by default), and an inline Genre Point toss row.
 */

'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  PhasePanel,
  Button,
  ActionFooter,
  StatusCallout,
  ResultBanner,
  EffortBand,
  WeaknessTracker,
  Icon,
  suitToIconName,
  Text,
  Stack,
  Row,
  Badge,
  ScriptSparks,
  SceneDossier,
  type SceneDossierFateItem,
  type SceneDossierFateTone,
} from '@nott2/design-system';
import { useGameStore } from '../../../store/game-store';
import {
  calculateDifficulty,
  calculateTotal,
  isSuccessful,
  getEffortLevel,
  getOutcomeFacilitation,
  getCombinedFragmentPool,
  getSuitTheme,
  type Suit,
  type Rank,
  type EffortLevel,
} from '@nott2/game-engine';
import { getRankLabel } from '../helpers';
import { useTransitionContext } from '../../../contexts/TransitionContext';

const SCENE_IMAGES: Record<string, string> = {
  Spades: '/textures/scenes/spades.png',
  Hearts: '/textures/scenes/hearts.png',
  Clubs: '/textures/scenes/clubs.png',
  Diamonds: '/textures/scenes/diamonds.png',
  Joker: '/textures/scenes/spades.png',
};

// ── Fallout Ledger Item Builder ──────────────────────────────────────────────

function describeFalloutEvents(
  card: { rank: number; suit: string; id: string } | null,
  joker: string | null,
  isSuccess: boolean,
  d4: number,
  weaknessesBefore: readonly string[],
): SceneDossierFateItem[] {
  const events: SceneDossierFateItem[] = [];
  const rankLabel = card ? getRankLabel(card.rank) : null;
  const cardLabel = card ? `${rankLabel} of ${card.suit}` : null;

  if (joker === 'Red') {
    events.push(
      isSuccess
        ? {
            text: 'The Red Joker is defeated — you survived the Night!',
            tone: 'highlight',
            icon: 'military_tech',
          }
        : {
            text: 'The Red Joker kills the Active Player and is shuffled back into the Threat Deck.',
            tone: 'danger',
            icon: 'dangerous',
          },
    );
    return events;
  }
  if (joker === 'Black') {
    events.push(
      isSuccess
        ? {
            text: 'Black Joker defeated — highest Face Card removed from the Threat Deck.',
            tone: 'success',
            icon: 'delete',
          }
        : {
            text: 'Black Joker failed — a random King added from Reserves to the Threat Deck.',
            tone: 'danger',
            icon: 'dangerous',
          },
    );
    events.push({
      text: 'Black Joker permanently removed; Threat Deck and Trophy Pile shuffled.',
      tone: 'info',
      icon: 'shuffle',
    });
    return events;
  }

  if (!card) return events;

  if (card.rank === 1) {
    events.push({
      text: `${cardLabel} — Prologue card retired as turn-order token.`,
      tone: 'info',
      icon: 'delete',
    });
    if (d4 === 4) {
      events.push({
        text: 'Breaking Point (d4 = 4) — the Active Player earns a Strike.',
        tone: 'danger',
        icon: 'bolt',
      });
    }
    return events;
  }

  if (card.rank <= 10) {
    events.push(
      isSuccess
        ? {
            text: `${cardLabel} placed on Trophy Pile (New Face Card base difficulty: ${card.rank}).`,
            tone: 'success',
            icon: 'emoji_events',
          }
        : {
            text: `${cardLabel} returned to the bottom of the Threat Deck.`,
            tone: 'warning',
            icon: 'arrow_downward',
          },
    );
    events.push({
      text: 'Next card drawn from Number Reserve → bottom of Threat Deck.',
      tone: 'info',
      icon: 'input',
    });
    if (d4 === 4) {
      events.push({
        text: 'Breaking Point (d4 = 4) — the Active Player earns a Strike.',
        tone: 'danger',
        icon: 'bolt',
      });
    }
    return events;
  }

  // Face Card
  const faceLabel = getRankLabel(card.rank);
  const alreadyDefeated = weaknessesBefore.includes(card.suit);
  if (isSuccess) {
    if (!alreadyDefeated) {
      events.push({
        text: `First defeat of a ${card.suit} Face Card — Weakness found! ${faceLabel} removed from game.`,
        tone: 'highlight',
        icon: 'key',
      });
    } else {
      events.push({
        text: `${faceLabel} of ${card.suit} — suit weakness already known; returned to Threat Deck.`,
        tone: 'warning',
        icon: 'arrow_downward',
      });
    }
    const targetRank = d4 <= 2 ? 'Jack' : 'Queen';
    events.push({
      text: `A random ${targetRank} added from Face Card Reserves to Threat Deck (Effort ${d4}).`,
      tone: 'warning',
      icon: 'dangerous',
    });
    if (d4 === 4) {
      events.push({
        text: 'Breaking Point (d4 = 4) — the Active Player earns a Strike.',
        tone: 'danger',
        icon: 'bolt',
      });
    }
  } else {
    events.push({
      text: `Failed against the ${faceLabel} of ${card.suit} — Active Player earns a Strike.`,
      tone: 'danger',
      icon: 'bolt',
    });
    events.push({
      text: 'A random King added from Face Card Reserves to the Threat Deck.',
      tone: 'danger',
      icon: 'dangerous',
    });
    if (d4 === 4) {
      events.push({
        text: 'Breaking Point (d4 = 4) — an additional Strike is earned.',
        tone: 'danger',
        icon: 'bolt',
      });
    }
  }
  events.push({
    text: 'Threat Deck and Trophy Pile shuffled.',
    tone: 'info',
    icon: 'shuffle',
  });
  return events;
}

// ── Component ────────────────────────────────────────────────────────────────

export function FalloutScreen() {
  const {
    gameState,
    applyFallout,
    commitClockTick,
    assignStrike,
    awardGenrePoint,
    nextPhase,
  } = useGameStore();
  const { playerId, roomCode } = useGameStore() as any;
  const { scene, deck, characters, players, currentAct, playset } = gameState;

  const [applied, setApplied] = useState(false);
  const [beat, setBeat] = useState<'narration' | 'aftermath'>('narration');
  const [events, setEvents] = useState<SceneDossierFateItem[]>([]);
  const [pendingStrikes, setPendingStrikes] = useState<Record<string, number>>({});

  const snapshot = useRef<{
    selectedCard: { rank: number; suit: string; id: string } | null;
    joker: string | null;
    d4: number;
    d10: number;
    total: number;
    difficulty: number;
    success: boolean;
    effortLevel: EffortLevel | null;
    /** cardsAddedFromReserve BEFORE applyFallout ran */
    reserveBefore: number;
  } | null>(null);

  useEffect(() => {
    const card = scene.selectedCardId
      ? deck.visibleCards.find(c => c.id === scene.selectedCardId) ?? null
      : null;
    const joker = scene.activeJoker ?? null;
    const d4 = (scene.modifiedEffort ?? scene.rollEffort) as number;
    const d10 = scene.rollMain as number;
    if (d4 == null || d10 == null) return;

    const threatCard = joker
      ? { id: `Joker-${joker}`, color: joker, isJoker: true as const }
      : (card as any);
    const difficulty = threatCard ? calculateDifficulty(threatCard, deck.trophyTop) : 0;
    const total = calculateTotal(d10 as any, d4 as any);
    const success = isSuccessful(total, difficulty);
    const effortLevel = getEffortLevel(d4 as any);

    // Capture reserve count BEFORE fallout so we can detect ticks
    const reserveBefore = deck.cardsAddedFromReserve;

    snapshot.current = {
      selectedCard: card,
      joker,
      d4,
      d10,
      total,
      difficulty,
      success,
      effortLevel,
      reserveBefore,
    };
    const evts = describeFalloutEvents(
      card,
      joker,
      success,
      d4,
      gameState.weaknessesFound,
    );
    applyFallout();

    // Auto-stage earned strikes on the Active Player by default when eligible
    const updatedState = useGameStore.getState().gameState;
    const earnedStrikes = updatedState.strikesToAssign;
    if (earnedStrikes > 0) {
      const ap = updatedState.players.find(
        p => p.id === updatedState.scene.activePlayerId,
      );
      const apChar = ap
        ? updatedState.characters.find(c => c.id === ap.characterId)
        : null;
      if (apChar && !apChar.isDead) {
        const capacity = Math.max(0, 3 - apChar.strikes);
        const autoCount = Math.min(earnedStrikes, capacity);
        if (autoCount > 0) {
          setPendingStrikes({ [apChar.id]: autoCount });
        }
      }
    }

    setEvents(evts);
    setApplied(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const activePlayer = players.find(p => p.id === scene.activePlayerId);
  const activeChar = activePlayer
    ? characters.find(c => c.id === activePlayer.characterId) ?? null
    : null;

  const isMultiplayer = Boolean(roomCode);
  const isDirector = !isMultiplayer || playerId === scene.activePlayerId;
  const isCameraCrew = !isMultiplayer || playerId !== scene.activePlayerId;

  const strikesToAssign = gameState.strikesToAssign;
  const pendingTotal = Object.values(pendingStrikes).reduce((a, b) => a + b, 0);
  const remainingToStage = strikesToAssign - pendingTotal;
  const strikesReady = strikesToAssign === 0 || pendingTotal === strikesToAssign;
  const isFace = (snapshot.current?.selectedCard?.rank ?? 0) >= 11;

  const handleAddPendingStrike = (charId: string) => {
    if (remainingToStage <= 0) return;
    const char = characters.find(c => c.id === charId);
    if (!char) return;
    const current = pendingStrikes[charId] ?? 0;
    if (char.strikes + current >= 3) return;
    setPendingStrikes(p => ({ ...p, [charId]: current + 1 }));
  };

  const handleRemovePendingStrike = (charId: string) => {
    const current = pendingStrikes[charId] ?? 0;
    if (current <= 0) return;
    setPendingStrikes(p => ({ ...p, [charId]: current - 1 }));
  };

  const { showTransition } = useTransitionContext();

  const advancePhase = useCallback(() => {
    if (gameState.phase === 'resolve-scene') nextPhase();
    nextPhase();
  }, [gameState.phase, nextPhase]);

  const handleNextScene = () => {
    // 1. Commit pending strikes
    for (const [charId, count] of Object.entries(pendingStrikes)) {
      for (let i = 0; i < count; i++) assignStrike(charId as any);
    }

    const pendingClock = useGameStore.getState().pendingClockValue;
    const reserveBefore = snapshot.current?.reserveBefore ?? 0;

    // 2. Check for Act 3 break transition
    const hasAct3Transition = gameState.pendingActSetups.includes('act3');
    if (hasAct3Transition) {
      showTransition(
        { type: 'doom-clock-break', from: reserveBefore, to: pendingClock ?? 13 },
        commitClockTick,
      );
      advancePhase();
      return;
    }

    // 3. Check if the doom clock ticked (reserve count increased)
    const DOOM_TRIGGER = 13;
    const clockTicked =
      pendingClock !== null &&
      pendingClock > reserveBefore &&
      reserveBefore < DOOM_TRIGGER;

    if (clockTicked) {
      showTransition(
        { type: 'doom-clock-tick', from: reserveBefore, to: pendingClock },
        commitClockTick,
      );
      advancePhase();
      return;
    }

    // 4. No visual transition — commit any pending clock value immediately
    commitClockTick();
    advancePhase();
  };

  if (!applied || !snapshot.current) return null;

  const { total, difficulty, success, effortLevel, selectedCard, joker } =
    snapshot.current;
  const suit = (selectedCard?.suit as Suit | undefined) ?? null;
  const rank = (selectedCard?.rank as Rank | undefined) ?? null;

  const outcomeFacilitation = getOutcomeFacilitation({
    success,
    effortLevel,
    suit,
    act: currentAct,
    playsetId: playset,
  });

  const fragmentPool = getCombinedFragmentPool({
    suit,
    act: currentAct,
    rank,
    isJoker: Boolean(joker),
    playsetId: playset,
  });

  const isSacrificeTriggered =
    effortLevel === 'overexertion' || effortLevel === 'breaking-point';

  const suitTheme = joker
    ? 'The Finale'
    : isFace
    ? 'The Killer is Here'
    : suit
    ? getSuitTheme(suit) ?? suit
    : 'The Scene';

  const suitIcon = joker
    ? 'warning'
    : suit
    ? suitToIconName(suit)
    : 'playing_cards';

  const imageSrc = joker
    ? SCENE_IMAGES.Joker
    : suit
    ? SCENE_IMAGES[suit] ?? SCENE_IMAGES.Spades
    : SCENE_IMAGES.Spades;

  const allFateItems: SceneDossierFateItem[] = [
    ...events,
    ...(gameState.pendingActSetups.length > 0
      ? [
          {
            icon: 'warning' as const,
            text: `Act transition pending: ${gameState.pendingActSetups.join(' → ')}`,
            tone: 'warning' as SceneDossierFateTone,
          },
        ]
      : []),
  ];

  return (
    <PhasePanel
      title={beat === 'narration' ? 'The Result' : 'The Aftermath'}
      subtitle={
        beat === 'narration'
          ? 'Narrate how the scene resolves — the Director leads the outcome while the Camera Crew frames the reaction.'
          : 'Review fate changes, assign any earned Strikes, and award a Genre Point before the next scene.'
      }
      step={{ current: 4, total: 4 }}
    >
      <ResultBanner
        outcome={success ? 'success' : 'failure'}
        total={total}
        difficulty={difficulty ?? undefined}
      />

      {scene.modifiedEffort !== null && (
        <StatusCallout variant="highlight" icon="auto_awesome">
          Aptitude applied — Effort modified from{' '}
          <strong>{scene.rollEffort}</strong> to{' '}
          <strong>{scene.modifiedEffort}</strong>
        </StatusCallout>
      )}

      {effortLevel && <EffortBand level={effortLevel} />}

      <SceneDossier
        mode={beat === 'narration' ? 'script' : 'aftermath'}
        imageSrc={imageSrc}
        suitIcon={suitIcon}
        suitTheme={suitTheme}
        activeCharacterName={activeChar?.name}
        activeCharacterSuit={activeChar ? suitToIconName(activeChar.id) : undefined}
        difficulty={difficulty}
        sacrificeTriggered={beat === 'narration' && isSacrificeTriggered}
        directorPrompt={outcomeFacilitation.activePlayerPrompt}
        directorSparks={
          isDirector ? (
            <ScriptSparks
              words={fragmentPool.activePlayerWords}
              triggerLabel={
                outcomeFacilitation.sparkTriggerLabel ??
                'Need a Spark? — 9 Outcome Words'
              }
            />
          ) : undefined
        }
        cameraPrompt={outcomeFacilitation.tablePrompt}
        cameraSparks={
          isCameraCrew ? (
            <ScriptSparks
              words={fragmentPool.cameraCrewWords}
              triggerLabel="Need a Spark? — 9 Reaction Words"
              trayHint="9 sensory & atmospheric reaction words:"
            />
          ) : undefined
        }
        fateItems={allFateItems}
        weaknessSlot={
          isFace && deck.weaknessesBySuit.size > 0 ? (
            <WeaknessTracker found={deck.weaknessesBySuit} />
          ) : undefined
        }
        strikesTitle={`Blood Price — Assign ${strikesToAssign} Strike${
          strikesToAssign > 1 ? 's' : ''
        }`}
        strikesSlot={
          strikesToAssign > 0 ? (
            <Stack gap="sm">
              <Text variant="caption" color="muted">
                {remainingToStage > 0
                  ? `${remainingToStage} strike${
                      remainingToStage > 1 ? 's' : ''
                    } left to assign.`
                  : 'Strikes staged — click Next Scene to commit.'}
              </Text>
              <Stack gap="xs">
                {characters
                  .filter(c => !c.isDead)
                  .map(c => {
                    const staged = pendingStrikes[c.id] ?? 0;
                    const totalAfter = c.strikes + staged;
                    const isActiveChar = activeChar?.id === c.id;
                    return (
                      <Row key={c.id} justify="between" align="center">
                        <Row gap="xs" align="center">
                          <Icon name={suitToIconName(c.id)} size={16} />
                          <Text variant="label" as="span">
                            {c.name}
                          </Text>
                          {isActiveChar && (
                            <Badge variant="red">Active</Badge>
                          )}
                          <Text variant="micro" color="muted" as="span">
                            {c.strikes}/3{staged > 0 ? ` → ${totalAfter}` : ''}
                          </Text>
                        </Row>
                        <Row gap="xs">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemovePendingStrike(c.id)}
                            disabled={staged <= 0}
                          >
                            −
                          </Button>
                          <Button
                            variant={staged > 0 ? 'primary' : 'secondary'}
                            size="sm"
                            onClick={() => handleAddPendingStrike(c.id)}
                            disabled={remainingToStage <= 0 || totalAfter >= 3}
                          >
                            +{staged > 0 ? ` ${staged}` : ''}
                          </Button>
                        </Row>
                      </Row>
                    );
                  })}
              </Stack>
            </Stack>
          ) : undefined
        }
        genrePointTitle="Award Genre Point? (Leaned into a slasher trope or terrified the table)"
        genrePointSlot={
          gameState.tableGenrePoints > 0 || scene.isGenrePointAwarded ? (
            scene.isGenrePointAwarded ? (
              <Row gap="xs" align="center">
                <Icon name="check_circle" size={16} color="success" />
                <Text variant="caption" color="success" as="span">
                  Genre Point awarded this scene.
                </Text>
              </Row>
            ) : (
              <Row gap="xs" wrap>
                {players.map(p => {
                  const char = characters.find(c => c.id === p.characterId);
                  if (!char || char.isDead) return null;
                  return (
                    <Button
                      key={p.id}
                      variant="secondary"
                      size="sm"
                      onClick={() => awardGenrePoint(p.id)}
                    >
                      To <Icon name={suitToIconName(p.characterId)} size={15} />{' '}
                      {char.name}
                    </Button>
                  );
                })}
              </Row>
            )
          ) : undefined
        }
        onBackToScene={beat === 'aftermath' ? () => setBeat('narration') : undefined}
        backLabel="Back to Narration"
      />

      {beat === 'narration' ? (
        <ActionFooter
          label="Continue to Aftermath →"
          onClick={() => setBeat('aftermath')}
        />
      ) : (
        <ActionFooter
          label={
            !strikesReady
              ? `Assign ${remainingToStage} Strike${
                  remainingToStage > 1 ? 's' : ''
                } first`
              : 'Next Scene →'
          }
          disabled={!strikesReady}
          onClick={handleNextScene}
        />
      )}
    </PhasePanel>
  );
}
