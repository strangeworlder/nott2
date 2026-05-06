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
 * - Always visible — there is no phase where this zone should be hidden.
 * - Lives in GameShell's `game-main` area, above the phase router.
 */

'use client';

import { useCallback } from 'react';
import { CardMatt, Deck, DoomClock } from '@nott2/design-system';
import { useGameStore } from '../store/game-store';
import { useCardDealContext } from '../contexts/CardDealContext';
import type { Suit, Rank } from '@nott2/design-system';



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

  // DoomClock: visible once the prologue is truly over — no aces on the deck
  // AND no ace currently being resolved on the table. This prevents the clock
  // from appearing during the last ace's scene.
  const aceInPlay = visibleCards.some(c => c.rank === 1);
  const showDoomClock = currentAct >= 2 || (!computed.isPrologue && !aceInPlay);

  // CardMatt glow: signal to the player that they should select a card.
  // Mirrors SceneSetupScreen's readyToChallenge / mustChallengeImmediately logic.
  // Glow stays on during scene-setup even after a card is selected, so the
  // player can see they can still change their mind before advancing.
  const canSelectCard = (() => {
    if (phase !== 'scene-setup') return false;
    const apSelected = gameState.scene.activePlayerId !== null;
    if (!apSelected) return false;
    const nonJokerCards = visibleCards.filter(c => !c.id.startsWith('Joker-'));
    const hasSpecialCard = nonJokerCards.some(
      (c) => (c as { rank: number }).rank >= 11 || (c as { rank: number }).rank === 1,
    );
    const mustChallengeImmediately = hasSpecialCard
      || (gameState.isEndgame && gameState.jokersAdded);
    return visibleCards.length >= 2 || mustChallengeImmediately;
  })();

  return (
    <div className="visible-threats-zone">
      {/* Left: Threat Deck — glows and clicks when drawable */}
      <div ref={deckCallbackRef} className="visible-threats-zone__deck">
        <Deck
          count={threatDeck.length}
          label="Threat Deck"
          glow={canDraw}
          showCount={false}
          onClick={canDraw && canControl ? autoDeal : undefined}
        />
      </div>

      {/* Center: Card Matt — the 3D card landing zone */}
      <CardMatt
        ref={tableCallbackRef}
        title="Visible Threats"
        count={cardCount}
        emptyHint={canDraw ? "Draw from deck" : ""}
        glow={canSelectCard}
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
