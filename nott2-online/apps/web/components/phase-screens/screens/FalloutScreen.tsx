/**
 * FalloutScreen — Post-roll unified screen.
 * Handles both 'resolve-scene' and 'fallout' phases.
 * Auto-applies fallout on mount so the user lands on a fully populated screen.
 */

'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  PhasePanel, Card, Button, ActionFooter,
  StatusCallout, ResultBanner, EffortBand, WeaknessTracker,
  Icon, suitToIconName,
} from '@nott2/design-system';
import { useGameStore } from '../../../store/game-store';
import { calculateDifficulty, calculateTotal, isSuccessful, getEffortLevel } from '@nott2/game-engine';
import { getRankLabel } from '../helpers';
import { useTransitionContext } from '../../../contexts/TransitionContext';

// ── Types ────────────────────────────────────────────────────────────────────

type FalloutEventVariant = 'info' | 'success' | 'warning' | 'danger' | 'highlight';
type FalloutEvent = {
  text: string;
  variant: FalloutEventVariant;
  icon: 'emoji_events' | 'arrow_downward' | 'inventory_2' | 'bolt' | 'auto_awesome' | 'delete' | 'undo' | 'dangerous' | 'star' | 'shuffle' | 'warning';
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
      ? { text: 'The Red Joker is defeated — you survived the Night!', variant: 'highlight', icon: 'star' }
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
    events.push({ text: 'Next card drawn from the Number Reserve → added to bottom of the Threat Deck.', variant: 'info', icon: 'inventory_2' });
    if (d4 === 4) events.push({ text: 'Breaking Point (d4 = 4) — the Active Player earns a Strike.', variant: 'danger', icon: 'bolt' });
    return events;
  }

  // Face Card
  const faceLabel = getRankLabel(card.rank);
  const alreadyDefeated = weaknessesBefore.includes(card.suit);
  if (isSuccess) {
    if (!alreadyDefeated) {
      events.push({ text: `First defeat of a ${card.suit} Face Card — a Weakness has been found!`, variant: 'highlight', icon: 'auto_awesome' });
      events.push({ text: `${faceLabel} permanently removed from the game.`, variant: 'success', icon: 'delete' });
    } else {
      events.push({ text: `${faceLabel} of ${card.suit} — already defeated this suit. Card returned to the Threat Deck.`, variant: 'warning', icon: 'undo' });
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
  const { gameState, applyFallout, assignStrike, awardGenrePoint, nextPhase } = useGameStore();
  const { scene, deck, characters, players } = gameState;

  const [applied, setApplied] = useState(false);
  const [events, setEvents] = useState<FalloutEvent[]>([]);
  const [pendingStrikes, setPendingStrikes] = useState<Record<string, number>>({});

  const snapshot = useRef<{
    selectedCard: { rank: number; suit: string; id: string } | null;
    joker: string | null; d4: number; d10: number;
    total: number; difficulty: number; success: boolean; effortLevel: string | null;
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

    // 2. Check for Act 3 break transition
    const hasAct3Transition = gameState.pendingActSetups.includes('act3');
    if (hasAct3Transition) {
      const reserveBefore = snapshot.current?.reserveBefore ?? 0;
      showTransition({ type: 'doom-clock-break', from: reserveBefore, to: 13 });
      advancePhase();
      return;
    }

    // 3. Check if the doom clock ticked (reserve count increased)
    const reserveBefore = snapshot.current?.reserveBefore ?? 0;
    const reserveAfter = gameState.deck.cardsAddedFromReserve;
    const clockTicked = reserveAfter > reserveBefore;

    if (clockTicked) {
      showTransition({ type: 'doom-clock-tick', from: reserveBefore, to: reserveAfter });
      advancePhase();
      return;
    }

    // 4. No transition needed — advance immediately
    advancePhase();
  };

  if (!applied || !snapshot.current) return null;

  const { total, difficulty, success, effortLevel } = snapshot.current;

  return (
    <PhasePanel title="The Result" subtitle="Narrate the outcome, then resolve deck changes and proceed to the next scene.">
      <ResultBanner outcome={success ? 'success' : 'failure'} total={total} difficulty={difficulty ?? undefined} />

      {scene.modifiedEffort !== null && (
        <StatusCallout variant="highlight" icon="auto_awesome">
          Aptitude applied — Effort modified from <strong>{scene.rollEffort}</strong> to <strong>{scene.modifiedEffort}</strong>
        </StatusCallout>
      )}

      {effortLevel && <EffortBand level={effortLevel as any} />}

      <Card title="Narrate the Outcome">
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
          {success ? 'Describe how your character overcomes the challenge. The table frames the shot.'
            : 'Describe how the challenge overcomes your character. Make it hurt, make it matter.'}
        </p>
      </Card>

      {events.length > 0 && (
        <Card title="Deck Changes">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {events.map((evt, i) => (
              <StatusCallout key={i} variant={evt.variant} icon={evt.icon}>{evt.text}</StatusCallout>
            ))}
          </div>
        </Card>
      )}

      {isFace && deck.weaknessesBySuit.size > 0 && (
        <Card variant="success" title="Weaknesses Found"><WeaknessTracker found={deck.weaknessesBySuit} /></Card>
      )}

      {strikesToAssign > 0 && (
        <Card variant="failure" title={`Assign ${strikesToAssign} Strike${strikesToAssign > 1 ? 's' : ''}`}>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', marginBottom: 12 }}>
            {remainingToStage > 0
              ? `${remainingToStage} strike${remainingToStage > 1 ? 's' : ''} left to assign. Strikes are committed when you click Next Scene.`
              : 'All strikes assigned — proceed when ready.'}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {characters.filter(c => !c.isDead).map(c => {
              const staged = pendingStrikes[c.id] ?? 0;
              const totalAfter = c.strikes + staged;
              return (
                <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1 }}>
                    <Icon name={suitToIconName(c.id)} size={16} />
                    <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{c.name}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{c.strikes}/3{staged > 0 ? ` → ${totalAfter}` : ''}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <Button variant="ghost" size="sm" onClick={() => handleRemovePendingStrike(c.id)} disabled={staged <= 0}>−</Button>
                    <Button variant={staged > 0 ? 'primary' : 'secondary'} size="sm"
                      onClick={() => handleAddPendingStrike(c.id)} disabled={remainingToStage <= 0 || totalAfter >= 3}>+{staged > 0 ? ` ${staged}` : ''}</Button>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {!scene.isGenrePointAwarded && gameState.tableGenrePoints > 0 && (
        <Card title="Award Genre Point?">
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {players.map(p => {
              const char = characters.find(c => c.id === p.characterId);
              if (!char || char.isDead) return null;
              return (
                <Button key={p.id} variant="secondary" size="sm" onClick={() => awardGenrePoint(p.id)}>
                  To <Icon name={suitToIconName(p.characterId)} size={16} /> {char.name}
                </Button>
              );
            })}
          </div>
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
