/**
 * cardMapper — Engine ↔ react-ttrpg-cards type bridge.
 *
 * Philosophical:
 * The game engine speaks in its own language — capitalized suits, numeric ranks,
 * a distinct JokerCard shape. The 3D card library speaks another — lowercase
 * suits, string ranks, a discriminated 'joker' union. This module is the
 * translator that lets both worlds understand each other without either needing
 * to know the other exists.
 *
 * Technical:
 * Pure mapping functions. Zero side effects.
 *
 * - engineCardToTtrpg()  — EngineCard → CardOrInput (with meta.engineId)
 * - engineJokerToTtrpg() — EngineJokerCard → CardOrInput
 * - getEngineId()        — Extract engineId from a library Card's meta
 */

import type { CardOrInput, Card as TtrpgCard, Rank as TtrpgRank, Suit as TtrpgSuit } from 'react-ttrpg-cards';
import type { Card as EngineCard, JokerCard as EngineJoker } from '@nott2/game-engine';

// ── Rank mapping (numeric → string) ──────────────────────────────────────────

const RANK_MAP: Record<number, TtrpgRank> = {
  1: 'A', 2: '2', 3: '3', 4: '4', 5: '5', 6: '6', 7: '7',
  8: '8', 9: '9', 10: '10', 11: 'J', 12: 'Q', 13: 'K',
};

// ── Suit mapping (capitalized → lowercase) ───────────────────────────────────

function mapSuit(suit: string): TtrpgSuit {
  return suit.toLowerCase() as TtrpgSuit;
}

// ── Label helpers ────────────────────────────────────────────────────────────

function getCardLabel(card: EngineCard): string | undefined {
  if (card.rank === 1) return 'Prologue';
  if (card.rank >= 11) return '⚠ Face Card';
  return undefined;
}

// ── Public API ───────────────────────────────────────────────────────────────

/**
 * Convert a game-engine Card to a react-ttrpg-cards CardOrInput.
 * Embeds the engine's card ID in `meta.engineId` for round-trip lookup.
 */
export function engineCardToTtrpg(card: EngineCard): CardOrInput {
  return {
    card: {
      suit: mapSuit(card.suit),
      rank: RANK_MAP[card.rank] ?? 'A',
      meta: { engineId: card.id },
    },
    label: getCardLabel(card),
  };
}

/**
 * Convert a game-engine JokerCard to a react-ttrpg-cards CardOrInput.
 */
export function engineJokerToTtrpg(joker: EngineJoker): CardOrInput {
  return {
    card: {
      type: 'joker' as const,
      variant: joker.color.toLowerCase() as 'red' | 'black',
      meta: { engineId: joker.id },
    },
    label: `${joker.color} Joker`,
  };
}

/**
 * Extract the game-engine card ID from a react-ttrpg-cards Card's meta.
 */
export function getEngineId(card: TtrpgCard): string | undefined {
  return (card.meta?.engineId as string) ?? undefined;
}
