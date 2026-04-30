/**
 * useCardDealBridge — Reactive bridge between Zustand game store and
 * react-ttrpg-cards' useCardDeal hook.
 *
 * Philosophical:
 * This hook is the nervous system connecting the game engine's state-driven
 * world (immutable snapshots, pure functions) to the library's imperative
 * 3D world (deal, dealMore, remove, flip). When the engine says "a card
 * appeared", this hook makes it fly across the table. When the engine says
 * "that card went to the trophy pile", this hook animates the exit.
 *
 * Technical:
 * - Reads target refs from CardDealContext (registered by phase screens).
 * - Watches `gameState.deck.visibleCards` diffs (added/removed cards).
 * - Maps engine cards to library cards via `cardMapper.ts`.
 * - Calls `deal()` for the first batch, `dealMore()` for subsequent draws.
 * - Calls `remove()` with context-appropriate animations:
 *     → trophy success: 'fly-to-target' to the trophy zone
 *     → deck return:    'slide-off'
 *     → permanent:      'shrink-fade'
 * - Syncs `selectedIndices` from `scene.selectedCardId`.
 * - Locks the selected card via `lockedIndices` once a selection is made,
 *   preventing re-click deselection (v0.3.0 feature).
 * - Provides `onCardSelect` callback that routes back to the store.
 */

'use client';

import { useRef, useEffect, useMemo, useCallback } from 'react';
import { useCardDeal } from 'react-ttrpg-cards';
import type { Card as TtrpgCard } from 'react-ttrpg-cards';
import { useGameStore } from '../store/game-store';
import { useCardDealContext } from '../contexts/CardDealContext';
import { engineCardToTtrpg, engineJokerToTtrpg, getEngineId } from '../lib/cardMapper';
import { CARD_DEAL_CONFIG } from '../lib/cardDealConfig';
import type { GameCard } from '@nott2/game-engine';
import { isJoker } from '@nott2/game-engine';

// ── Helpers ──────────────────────────────────────────────────────────────────

function engineToTtrpg(card: GameCard) {
  return isJoker(card) ? engineJokerToTtrpg(card) : engineCardToTtrpg(card);
}

// ── Hook ─────────────────────────────────────────────────────────────────────

export function useCardDealBridge() {
  const { tableRef, deckRef, trophyRef } = useCardDealContext();
  const { gameState, selectCard, selectJoker } = useGameStore();
  const { deck, scene } = gameState;
  const { visibleCards } = deck;

  // ── Track previous visible card IDs for diffing ──────────────────────────
  const prevIdsRef = useRef<string[]>([]);

  // ── Compute selected index from engine state ─────────────────────────────
  const selectedIndices = useMemo(() => {
    const selectedId = scene.selectedCardId ?? (
      scene.activeJoker === 'Black' ? 'Joker-Black'
      : scene.activeJoker === 'Red' ? 'Joker-Red'
      : null
    );
    if (!selectedId) return [];
    // Non-joker visible cards only (jokers are filtered out from visible list)
    const idx = visibleCards
      .filter(c => !c.id.startsWith('Joker-'))
      .findIndex(c => c.id === selectedId);
    return idx >= 0 ? [idx] : [];
  }, [scene.selectedCardId, scene.activeJoker, visibleCards]);

  // ── Card select callback → routes to store ───────────────────────────────
  // The library passes `selected: boolean` as the third arg (v0.3.0+).
  // We ignore deselects here — the locked-indices mechanism prevents them
  // visually, but this guard is a belt-and-braces safety net.
  const handleCardSelect = useCallback((_index: number, card: TtrpgCard, selected: boolean) => {
    if (!selected) return;
    const engineId = getEngineId(card);
    if (!engineId) return;

    if (engineId.startsWith('Joker-')) {
      const color = engineId === 'Joker-Black' ? 'Black' : 'Red';
      selectJoker(color as 'Black' | 'Red');
    } else {
      selectCard(engineId);
    }
  }, [selectCard, selectJoker]);

  // ── Lock selected indices once a card has been chosen ────────────────────
  // `lockedIndices` uses the v0.3.0 API: the card's 3D glow is locked on and
  // clicks on it are silently ignored, preventing the one-frame flicker that
  // would occur if the library tried to toggle the selection off.
  const lockedIndices = useMemo(() => {
    const hasSelection = scene.selectedCardId !== null || scene.activeJoker !== null;
    return hasSelection ? selectedIndices : [];
  }, [scene.selectedCardId, scene.activeJoker, selectedIndices]);

  // ── Initialize useCardDeal ───────────────────────────────────────────────
  const {
    deal, dealMore, remove, flip, clear,
    isDealing, result, CardOverlayPortal,
  } = useCardDeal({
    targetRef: tableRef as React.RefObject<HTMLElement>,
    targets: {
      trophy: trophyRef as React.RefObject<HTMLElement>,
    },
    ...CARD_DEAL_CONFIG,
    interactionMode: 'select',
    selectedIndices,
    lockedIndices,
    onCardSelect: handleCardSelect,
  });

  // ── React to visibleCards changes ────────────────────────────────────────
  useEffect(() => {
    // Don't deal if the table ref isn't registered yet
    if (!tableRef.current) return;

    // Filter out jokers (rendered separately in SceneSetupScreen)
    const currentCards = visibleCards.filter(c => !c.id.startsWith('Joker-'));
    const currentIds = currentCards.map(c => c.id);
    const prevIds = prevIdsRef.current;

    // Diff: what was added / removed
    const addedIds = currentIds.filter(id => !prevIds.includes(id));
    const removedIds = prevIds.filter(id => !currentIds.includes(id));

    // ── Handle additions ─────────────────────────────────────────────────
    if (addedIds.length > 0) {
      const addedCards = addedIds
        .map(id => currentCards.find(c => c.id === id))
        .filter(Boolean)
        .map(c => engineToTtrpg(c!));

      if (prevIds.length === 0) {
        // First deal — mount the scene
        deal(addedCards, {
          pattern: 'row',
          faceUp: false,
          autoFlipDelay: 800,
          sourceRef: deckRef as React.RefObject<HTMLElement>,
        });
      } else {
        // Incremental addition
        dealMore(addedCards, {
          faceUp: false,
          autoFlipDelay: 800,
        });
      }
    }

    // ── Handle removals ──────────────────────────────────────────────────
    if (removedIds.length > 0) {
      for (const removedId of removedIds) {
        const indexInPrev = prevIds.indexOf(removedId);
        if (indexInPrev < 0) continue;

        // Determine where the card went
        const wentToTrophy = deck.trophyPile.some(c => c.id === removedId);

        remove([indexInPrev], {
          animation: wentToTrophy ? 'fly-to-target' : 'slide-off',
          target: wentToTrophy ? 'trophy' : undefined,
          duration: 600,
        });
      }
    }

    // ── Update ref for next diff ─────────────────────────────────────────
    prevIdsRef.current = currentIds;
  }, [visibleCards, deck.trophyPile, deal, dealMore, remove, deckRef, tableRef]);

  // ── Clear on game reset ────────────────────────────────────────────────
  useEffect(() => {
    if (gameState.phase === 'lobby' || gameState.phase === 'welcome') {
      clear();
      prevIdsRef.current = [];
    }
  }, [gameState.phase, clear]);

  return {
    CardOverlayPortal,
    isDealing,
    result,
  };
}
