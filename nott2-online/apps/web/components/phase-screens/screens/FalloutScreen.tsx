/**
 * FalloutScreen — Post-roll unified screen.
 * Handles both 'resolve-scene' and 'fallout' phases.
 * Auto-applies fallout on mount so the user lands on a fully populated screen.
 */

'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  PhasePanel,
  Card,
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
  Separator,
  ScriptSparks,
} from '@nott2/design-system';
import { useGameStore } from '../../../store/game-store';
import {
  calculateDifficulty,
  calculateTotal,
  isSuccessful,
  getEffortLevel,
  getOutcomeFacilitation,
  getOutcomeWordPool,
  type Suit,
  type EffortLevel,
} from '@nott2/game-engine';
import { getRankLabel } from '../helpers';
import { useTransitionContext } from '../../../contexts/TransitionContext';

// ── Types ────────────────────────────────────────────────────────────────────

type FalloutEventVariant = 'info' | 'success' | 'warning' | 'danger' | 'highlight';
type FalloutEvent = {
  text: string;
  variant: FalloutEventVariant;
  icon: 'emoji_events' | 'arrow_downward' | 'input' | 'bolt' | 'auto_awesome' | 'key' | 'delete' | 'dangerous' | 'military_tech' | 'shuffle' | 'warning';
};

// ── Fallout Event Builder ────────────────────────────────────────────────────

function describeFalloutEvents(
  card: { rank: number; suit: string; id: string } | null,
  joker: string | null, isSuccess: boolean, d4: number,
  trophyTop: { rank: number; suit: string } | null,
  weaknessesBefore: readonly string[],
): FalloutEvent[] {
  const events: FalloutEvent[] = [];
  const rankLabel = card ? getRankLabel(card.rank) : null;
  const cardLabel = card ? `${rankLabel} of ${card.suit}` : null;

  if (joker === 'Red') {
    events.push(isSuccess
      ? { text: 'The Red Joker is defeated — you survived the Night!', variant: 'highlight', icon: 'military_tech' }
      : { text: 'The Red Joker kills the Active Player. The Red Joker is shuffled back into the Threat Deck.', variant: 'danger', icon: 'dangerous' });
    return events;
  }
  if (joker === 'Black') {
    events.push(isSuccess
      ? { text: 'Black Joker defeated — the highest face card is removed from the Threat Deck.', variant: 'success', icon: 'delete' }
      : { text: 'Black Joker failed — a random King is added from the Face Card Reserves to the Threat Deck.', variant: 'danger', icon: 'dangerous' });
    events.push({ text: 'The Black Joker is permanently removed from the game.', variant: 'info', icon: 'delete' });
    events.push({ text: 'Threat Deck and Trophy Pile shuffled.', variant: 'info', icon: 'shuffle' });
    return events;
  }

  if (!card) return events;

  if (card.rank === 1) {
    events.push({ text: `${cardLabel} — Prologue card permanently retired (becomes turn-order token).`, variant: 'info', icon: 'delete' });
    if (d4 === 4) events.push({ text: 'Breaking Point (d4 = 4) — the Active Player earns a Strike.', variant: 'danger', icon: 'bolt' });
    return events;
  }

  if (card.rank <= 10) {
    events.push(isSuccess
      ? { text: `${cardLabel} placed on the Trophy Pile. New base difficulty for Face Cards: ${card.rank}.`, variant: 'success', icon: 'emoji_events' }
      : { text: `${cardLabel} returned to the bottom of the Threat Deck.`, variant: 'warning', icon: 'arrow_downward' });
    events.push({ text: 'Next card drawn from the Number Reserve → added to bottom of the Threat Deck.', variant: 'info', icon: 'input' });
    if (d4 === 4) events.push({ text: 'Breaking Point (d4 = 4) — the Active Player earns a Strike.', variant: 'danger', icon: 'bolt' });
    return events;
  }

  // Face Card
  const faceLabel = getRankLabel(card.rank);
  const alreadyDefeated = weaknessesBefore.includes(card.suit);
  if (isSuccess) {
    if (!alreadyDefeated) {
      events.push({ text: `First defeat of a ${card.suit} Face Card — a Weakness has been found!`, variant: 'highlight', icon: 'key' });
      events.push({ text: `${faceLabel} permanently removed from the game.`, variant: 'success', icon: 'delete' });
    } else {
      events.push({ text: `${faceLabel} of ${card.suit} — already defeated this suit. Card returned to the Threat Deck.`, variant: 'warning', icon: 'arrow_downward' });
    }
    const targetRank = d4 <= 2 ? 'Jack' : 'Queen';
    events.push({ text: `A random ${targetRank} added from Face Card Reserves to the Threat Deck (effort: ${d4}).`, variant: 'warning', icon: 'dangerous' });
    if (d4 === 4) events.push({ text: 'Breaking Point (d4 = 4) — the Active Player earns a Strike.', variant: 'danger', icon: 'bolt' });
  } else {
    events.push({ text: `Failed against the ${faceLabel} of ${card.suit}.`, variant: 'danger', icon: 'dangerous' });
    events.push({ text: 'Failure against the Killer — the Active Player earns a Strike.', variant: 'danger', icon: 'bolt' });
    events.push({ text: 'A random King added from Face Card Reserves to the Threat Deck.', variant: 'danger', icon: 'dangerous' });
    if (d4 === 4) events.push({ text: 'Breaking Point (d4 = 4) — an additional Strike is earned.', variant: 'danger', icon: 'bolt' });
  }
  events.push({ text: 'Threat Deck and Trophy Pile shuffled. New visible cards and trophy top will be drawn.', variant: 'info', icon: 'shuffle' });
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
  const { scene, deck, characters, players, currentAct, playset } = gameState;

  const [applied, setApplied] = useState(false);
  const [events, setEvents] = useState<FalloutEvent[]>([]);
  const [pendingStrikes, setPendingStrikes] = useState<Record<string, number>>({});

  const snapshot = useRef<{
    selectedCard: { rank: number; suit: string; id: string } | null;
    joker: string | null; d4: number; d10: number;
    total: number; difficulty: number; success: boolean; effortLevel: EffortLevel | null;
    /** cardsAddedFromReserve BEFORE applyFallout ran */
    reserveBefore: number;
  } | null>(null);

  useEffect(() => {
    const card = scene.selectedCardId ? deck.visibleCards.find(c => c.id === scene.selectedCardId) ?? null : null;
    const joker = scene.activeJoker ?? null;
    const d4 = (scene.modifiedEffort ?? scene.rollEffort) as number;
    const d10 = scene.rollMain as number;
    if (d4 == null || d10 == null) return;

    const threatCard = joker ? { id: `Joker-${joker}`, color: joker, isJoker: true as const } : (card as any);
    const difficulty = threatCard ? calculateDifficulty(threatCard, deck.trophyTop) : 0;
    const total = calculateTotal(d10 as any, d4 as any);
    const success = isSuccessful(total, difficulty);
    const effortLevel = getEffortLevel(d4 as any);

    // Capture reserve count BEFORE fallout so we can detect ticks
    const reserveBefore = deck.cardsAddedFromReserve;

    snapshot.current = { selectedCard: card, joker, d4, d10, total, difficulty, success, effortLevel, reserveBefore };
    const evts = describeFalloutEvents(card, joker, success, d4, deck.trophyTop, gameState.weaknessesFound);
    applyFallout();
    setEvents(evts);
    setApplied(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

    // Read the deferred clock value from the store. applyFallout wrote the
    // original counter to gameState.deck.cardsAddedFromReserve and stashed
    // the real (incremented) value in pendingClockValue.
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

    // 3. Check if the doom clock ticked (reserve count increased).
    const DOOM_TRIGGER = 13;
    const clockTicked = pendingClock !== null && pendingClock > reserveBefore && reserveBefore < DOOM_TRIGGER;

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

  const { total, difficulty, success, effortLevel, selectedCard } = snapshot.current;
  const suit = (selectedCard?.suit as Suit | undefined) ?? null;

  const outcomeFacilitation = getOutcomeFacilitation({
    success,
    effortLevel,
    suit,
    act: currentAct,
    playsetId: playset,
  });

  const outcomeWords = getOutcomeWordPool({
    effortLevel,
    suit,
    act: currentAct,
    playsetId: playset,
  });

  const isSacrificeTriggered =
    effortLevel === 'overexertion' || effortLevel === 'breaking-point';

  return (
    <PhasePanel
      title="The Result"
      subtitle="Narrate the outcome together, then resolve deck changes and proceed to the next scene."
      step={{ current: 4, total: 4 }}
    >
      <ResultBanner outcome={success ? 'success' : 'failure'} total={total} difficulty={difficulty ?? undefined} />

      {scene.modifiedEffort !== null && (
        <StatusCallout variant="highlight" icon="auto_awesome">
          Aptitude applied — Effort modified from <strong>{scene.rollEffort}</strong> to <strong>{scene.modifiedEffort}</strong>
        </StatusCallout>
      )}

      {effortLevel && <EffortBand level={effortLevel} />}

      <Card title="Narrate the Outcome">
        <Stack gap="md">
          {/* Sacrifice reminder when Effort is 3 or 4 */}
          {isSacrificeTriggered && (
            <StatusCallout variant="warning" icon="local_fire_department">
              <strong>Agreed Sacrifice Triggered:</strong> The Overexertion sacrifice you agreed upon before rolling happens now.
            </StatusCallout>
          )}

          {/* Active Player Narration Prompt */}
          <Stack gap="xs">
            <Row gap="xs" align="center">
              <Badge variant="red">Active Player — Director</Badge>
            </Row>
            <Text variant="body">{outcomeFacilitation.activePlayerPrompt}</Text>
          </Stack>

          <Separator />

          {/* Camera Crew / Table Prompt + Optional 9-Word Spark Drawer */}
          <Stack gap="xs">
            <Row gap="xs" align="center">
              <Badge variant="outline">Camera Crew — The Table</Badge>
            </Row>
            <Text variant="caption" color="muted">
              {outcomeFacilitation.tablePrompt}
            </Text>
            <ScriptSparks
              words={outcomeWords}
              triggerLabel={outcomeFacilitation.sparkTriggerLabel ?? 'Need a Spark? — 9 Outcome Words'}
              trayHint="9 evocative words to inspire the outcome description (optional):"
            />
          </Stack>
        </Stack>
      </Card>

      {events.length > 0 && (
        <Card title="Deck Changes">
          <Stack gap="sm">
            {events.map((evt, i) => (
              <StatusCallout key={i} variant={evt.variant} icon={evt.icon}>{evt.text}</StatusCallout>
            ))}
          </Stack>
        </Card>
      )}

      {isFace && deck.weaknessesBySuit.size > 0 && (
        <Card variant="success" title="Weaknesses Found"><WeaknessTracker found={deck.weaknessesBySuit} /></Card>
      )}

      {strikesToAssign > 0 && (
        <Card
          variant="failure"
          title={`Assign ${strikesToAssign} Strike${strikesToAssign > 1 ? 's' : ''}`}
          complete={remainingToStage <= 0}
          completionLabel="All strikes assigned."
        >
          <Stack gap="sm">
            <Text variant="caption" color="muted">
              {remainingToStage > 0
                ? `${remainingToStage} strike${remainingToStage > 1 ? 's' : ''} left to assign. Strikes are committed when you click Next Scene.`
                : 'All strikes assigned — proceed when ready.'}
            </Text>
            <Stack gap="sm">
              {characters.filter(c => !c.isDead).map(c => {
                const staged = pendingStrikes[c.id] ?? 0;
                const totalAfter = c.strikes + staged;
                return (
                  <Row key={c.id} justify="between" align="center">
                    <Row gap="xs" align="center">
                      <Icon name={suitToIconName(c.id)} size={16} />
                      <Text variant="label" as="span">{c.name}</Text>
                      <Text variant="micro" color="muted" as="span">{c.strikes}/3{staged > 0 ? ` → ${totalAfter}` : ''}</Text>
                    </Row>
                    <Row gap="xs">
                      <Button variant="ghost" size="sm" onClick={() => handleRemovePendingStrike(c.id)} disabled={staged <= 0}>−</Button>
                      <Button variant={staged > 0 ? 'primary' : 'secondary'} size="sm"
                        onClick={() => handleAddPendingStrike(c.id)} disabled={remainingToStage <= 0 || totalAfter >= 3}>+{staged > 0 ? ` ${staged}` : ''}</Button>
                    </Row>
                  </Row>
                );
              })}
            </Stack>
          </Stack>
        </Card>
      )}

      {gameState.tableGenrePoints > 0 && (
        <Card
          title="Award Genre Point?"
          complete={scene.isGenrePointAwarded}
          completionLabel="Genre point awarded."
        >
          <Stack gap="sm">
            <Text variant="caption" color="muted">
              Did someone lean into a slasher trope (&ldquo;I&rsquo;ll be right back!&rdquo;), make a doomed roleplay choice, or genuinely terrify the table?
            </Text>
            {!scene.isGenrePointAwarded && (
              <Row gap="sm" wrap>
                {players.map(p => {
                  const char = characters.find(c => c.id === p.characterId);
                  if (!char || char.isDead) return null;
                  return (
                    <Button key={p.id} variant="secondary" size="sm" onClick={() => awardGenrePoint(p.id)}>
                      To <Icon name={suitToIconName(p.characterId)} size={16} /> {char.name}
                    </Button>
                  );
                })}
              </Row>
            )}
          </Stack>
        </Card>
      )}

      {gameState.pendingActSetups.length > 0 && (
        <StatusCallout variant="warning" icon="warning">
          Act transition pending: {gameState.pendingActSetups.join(' → ')}
        </StatusCallout>
      )}

      <ActionFooter
        label={!strikesReady ? `Assign ${remainingToStage} Strike${remainingToStage > 1 ? 's' : ''} first` : 'Next Scene →'}
        disabled={!strikesReady} onClick={handleNextScene} />
    </PhasePanel>
  );
}
