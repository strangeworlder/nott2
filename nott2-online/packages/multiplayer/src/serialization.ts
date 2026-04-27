/**
 * State Serialization (`serialization.ts`)
 *
 * Firebase RTDB cannot store: Set, Map, undefined, or class instances.
 * This module converts between GameState and the plain-object form
 * stored in Firebase.
 *
 * Rules:
 *   Set<T>         → T[]         (via Array.from)
 *   Map<K,V>       → Record      (via Object.fromEntries)
 *   undefined      → (omitted) — Firebase drops undefined automatically
 *   null           → null        — preserved
 */

import type { GameState } from '@nott2/game-engine';

/** The Firebase-safe representation of GameState */
export type SerializedGameState = ReturnType<typeof serializeGameState>;

/**
 * Serialize a GameState to a plain object safe for Firebase RTDB.
 * Called by the host before every push.
 */
export function serializeGameState(gs: GameState): object {
  return {
    ...gs,
    deck: {
      ...gs.deck,
      // Set<Suit> → string[]
      weaknessesBySuit: Array.from(gs.deck.weaknessesBySuit),
      // Card[] arrays are already Firebase-safe plain objects:
      // threatDeck, reserve, faceCardReserve, trophyPile, visibleCards, removedCards
    },
    // TurnOrder { available: Suit[], acted: Suit[] } is already plain
  };
}

/**
 * Deserialize a Firebase snapshot back to a fully-typed GameState.
 * Called by clients when they receive a state snapshot.
 */
export function deserializeGameState(raw: Record<string, unknown>): GameState {
  const rawDeck = raw.deck as Record<string, unknown>;
  return {
    ...(raw as unknown as GameState),
    deck: {
      ...(rawDeck as unknown as GameState['deck']),
      // string[] → Set<Suit>
      weaknessesBySuit: new Set(
        (rawDeck.weaknessesBySuit as string[] | null) ?? [],
      ) as GameState['deck']['weaknessesBySuit'],
      // Firebase returns null for empty arrays — normalise to []
      threatDeck: (rawDeck.threatDeck as GameState['deck']['threatDeck']) ?? [],
      reserve: (rawDeck.reserve as GameState['deck']['reserve']) ?? [],
      faceCardReserve: (rawDeck.faceCardReserve as GameState['deck']['faceCardReserve']) ?? [],
      trophyPile: (rawDeck.trophyPile as GameState['deck']['trophyPile']) ?? [],
      visibleCards: (rawDeck.visibleCards as GameState['deck']['visibleCards']) ?? [],
      removedCards: (rawDeck.removedCards as GameState['deck']['removedCards']) ?? [],
    },
    // TurnOrder — normalise null → empty arrays
    turnOrder: {
      available: ((raw.turnOrder as Record<string, unknown>)?.available as string[] | null) ?? [],
      acted: ((raw.turnOrder as Record<string, unknown>)?.acted as string[] | null) ?? [],
    } as GameState['turnOrder'],
  };
}
