/**
 * VisibleThreatsZone — Persistent card matt with deck + clock, shown across all scene phases.
 *
 * Philosophical:
 * This is the game table made whole. The Threat Deck looms on the left — a
 * physical stack of fate, glowing when it demands to be drawn from. The
 * CardMatt fills the center: red velvet, the landing zone for all things
 * terrible. On the right, the Trophy Pile remembers the fallen, and the Doom
 * Clock counts the minutes until midnight. Everything the players need to
 * understand the danger is right here, in one place.
 *
 * Technical:
 * - Left column:  Full `Deck` (deckRef registered as card deal source).
 *                 Glows + clickable when a draw is required.
 * - Center:       `CardMatt` (tableRef registered as 3D card landing zone).
 * - Right column: `Deck` as Trophy Pile (trophyRef registered for fly-to
 *                 animation) + `DoomClock` (shown after Prologue, Act 2+).
 *
 * - Visible during the scene loop phases: scene-setup, conversation-stakes,
 *   resolution, resolve-scene, fallout.
 * - Lives in GameShell's `game-main` area, above the phase router.
 */

'use client';

import { useCallback } from 'react';
import { CardMatt, Deck, DoomClock } from '@nott2/design-system';
import { useGameStore } from '../store/game-store';
import { useCardDealContext } from '../contexts/CardDealContext';
import type { Suit, Rank } from '@nott2/design-system';

/** Phases during which the card matt should be visible */
const SCENE_LOOP_PHASES = new Set([
  'scene-setup',
  'conversation-stakes',
  'resolution',
  'resolve-scene',
  'fallout',
]);

export function VisibleThreatsZone() {
  const { gameState, computed, autoDeal } = useGameStore();
  const { visibleCards, threatDeck, trophyTop, trophyPile, cardsAddedFromReserve } = gameState.deck;
  const { phase, currentAct } = gameState;

  // Multiplayer guard — only the host (or demo player) can deal cards
  const { isHost, roomCode } = useGameStore() as any;
  const canControl = !roomCode || isHost;

  const { registerTableRef, registerDeckRef, registerTrophyRef } = useCardDealContext();

  const tableCallbackRef = useCallback((el: HTMLDivElement | null) => {
    registerTableRef(el);
  }, [registerTableRef]);

  const deckCallbackRef = useCallback((el: HTMLDivElement | null) => {
    registerDeckRef(el);
  }, [registerDeckRef]);

  const trophyCallbackRef = useCallback((el: HTMLDivElement | null) => {
    registerTrophyRef(el);
  }, [registerTrophyRef]);

  // Count non-joker visible cards (jokers are rendered separately)
  const cardCount = visibleCards.filter(c => !c.id.startsWith('Joker-')).length;

  // Mirror the draw-eligibility logic from SceneSetupScreen:
  //   needsFirstDraw  — table is empty
  //   needsSecondDraw — AP selected, only 1 card, no special card, not endgame
  const hasSpecialCard = visibleCards.some(c => c.rank >= 11 || c.rank === 1);
  const apSelected = gameState.scene.activePlayerId !== null;
  const needsFirstDraw = visibleCards.length === 0;
  const needsSecondDraw = apSelected && visibleCards.length < 2 && !hasSpecialCard && !gameState.isEndgame;
  const canDraw = phase === 'scene-setup' && threatDeck.length > 0 && (needsFirstDraw || needsSecondDraw);

  // DoomClock: only visible once the prologue is over (Act 2+)
  const showDoomClock = currentAct >= 2 || !computed.isPrologue;

  // Always render — never unmount. The 3D CardMatt physics scene must stay in
  // the DOM so that tableRef / deckRef / trophyRef remain valid across phase
  // transitions (including act breaks). During non-scene-loop phases the zone
  // is hidden via CSS (invisible + non-interactive) but the refs and the 3D
  // overlay portal continue to exist.
  const isVisible = SCENE_LOOP_PHASES.has(phase);

  return (
    <div
      className="visible-threats-zone"
      aria-hidden={!isVisible}
      style={!isVisible ? { visibility: 'hidden', pointerEvents: 'none' } : undefined}
    >
      {/* Left: Threat Deck — glows and clicks when drawable */}
      <div ref={deckCallbackRef} className="visible-threats-zone__deck">
        <Deck
          count={threatDeck.length}
          label="Threat Deck"
          glow={canDraw}
          onClick={canDraw && canControl ? autoDeal : undefined}
        />
      </div>

      {/* Center: Card Matt — the 3D card landing zone */}
      <CardMatt
        ref={tableCallbackRef}
        title="Visible Threats"
        count={cardCount}
        emptyHint="Draw from deck"
      />

      {/* Right: Trophy pile + Doom Clock */}
      <div className="visible-threats-zone__right">
        <div ref={trophyCallbackRef}>
          <Deck
            count={trophyPile.length}
            label="Trophy"
            topCard={trophyTop ? { suit: trophyTop.suit as Suit, rank: trophyTop.rank as Rank } : null}
          />
        </div>
        {showDoomClock && (
          <DoomClock current={cardsAddedFromReserve} />
        )}
      </div>
    </div>
  );
}
