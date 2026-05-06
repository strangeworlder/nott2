/**
 * useSceneChallengeProps — Derives all props needed for SceneChallengeOverlay
 * from the current game state.
 *
 * Jump scare rules:
 *   - Jokers always trigger jump scare.
 *   - First Killer encounter for each suit (face card where weakness not yet found).
 *   - Recurring Killer encounters: 1/8 random chance.
 *   - Number cards: never jump scare.
 *
 * The random roll for recurring encounters is captured once per scene selection
 * (stored in a ref) so it doesn't re-roll on re-render.
 */

'use client';

import { useMemo, useRef, useEffect } from 'react';
import { getScenePrompt, getJokerPrompt, getFaceCardPrefix, getSuitTheme } from '@nott2/game-engine';
import type { Rank } from '@nott2/game-engine';
import { suitToIconName } from '@nott2/design-system';
import { useGameStore } from '../store/game-store';

const SCENE_IMAGES: Record<string, string> = {
  Spades:   '/textures/scenes/spades.png',
  Hearts:   '/textures/scenes/hearts.png',
  Clubs:    '/textures/scenes/clubs.png',
  Diamonds: '/textures/scenes/diamonds.png',
  // Joker fallback — use spades (most ominous)
  Joker: '/textures/scenes/spades.png',
};

export function useSceneChallengeProps() {
  const { gameState } = useGameStore();
  const { scene, deck, weaknessesFound } = gameState;

  // ── Card identity ──────────────────────────────────────────────────────────
  const selectedCard = scene.selectedCardId
    ? deck.visibleCards.find(c => c.id === scene.selectedCardId) ?? null
    : null;

  const isJoker = scene.activeJoker !== null;
  const isFaceCard = selectedCard ? selectedCard.rank >= 11 : false;
  const suit = selectedCard?.suit ?? null;
  const rank = selectedCard?.rank ?? null;

  // ── Difficulty ─────────────────────────────────────────────────────────────
  const trophyRank = deck.trophyTop?.rank ?? 1;
  const difficulty = isJoker
    ? trophyRank
    : selectedCard
    ? (() => {
        const r = selectedCard.rank;
        if (r === 1) return 1;
        if (r <= 10) return r;
        if (r === 11) return trophyRank + 1;
        if (r === 12) return trophyRank + 2;
        return trophyRank + 3;
      })()
    : 0;

  const difficultyBreakdown = isJoker
    ? `Trophy (${trophyRank}) + 0 = ${trophyRank}`
    : selectedCard && selectedCard.rank <= 10
    ? `Number card rank = ${selectedCard.rank}`
    : selectedCard && selectedCard.rank >= 11
    ? `Trophy (${trophyRank}) + ${selectedCard.rank - 10} = ${difficulty}`
    : undefined;

  // ── Scene prompt ───────────────────────────────────────────────────────────
  let prompt: string;
  if (isJoker && scene.activeJoker) {
    prompt = getJokerPrompt(scene.activeJoker);
  } else if (isFaceCard && suit && rank) {
    const isFirstEncounter = !weaknessesFound.includes(suit);
    const fp = getScenePrompt(suit, rank as Rank, isFirstEncounter);
    prompt = fp ? `${getFaceCardPrefix()} — ${fp}` : getFaceCardPrefix();
  } else if (suit && rank) {
    prompt = getScenePrompt(suit, rank as Rank) ?? getFaceCardPrefix();
  } else {
    prompt = getFaceCardPrefix();
  }

  // ── Suit theme & image ────────────────────────────────────────────────────
  const suitTheme = isJoker
    ? 'The Finale'
    : suit
    ? getSuitTheme(suit) ?? suit
    : '';

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

  // ── Jump scare determination ───────────────────────────────────────────────
  // The random roll is captured once per card selection change.
  const recurringRollRef = useRef(Math.random());
  const prevSelectedIdRef = useRef<string | null>(null);

  const selectionKey = scene.selectedCardId ?? (scene.activeJoker ? `Joker-${scene.activeJoker}` : null);

  useEffect(() => {
    if (selectionKey !== prevSelectedIdRef.current) {
      recurringRollRef.current = Math.random();
      prevSelectedIdRef.current = selectionKey;
    }
  }, [selectionKey]);

  const jumpScare = useMemo(() => {
    // Jokers always
    if (isJoker) return true;
    if (!isFaceCard || !suit) return false;
    // First encounter with this Killer (weakness not yet found for this suit)
    const isFirstEncounter = !weaknessesFound.includes(suit);
    if (isFirstEncounter) return true;
    // Recurring: 1/8 chance
    return recurringRollRef.current < 0.125;
  }, [isJoker, isFaceCard, suit, weaknessesFound]);

  return {
    prompt,
    suitTheme,
    suitIcon,
    difficulty,
    difficultyBreakdown,
    isFaceCard,
    isJoker,
    imageSrc,
    jumpScare,
  };
}
