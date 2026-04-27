/**
 * @nott2/game-engine — Turn Order Logic
 *
 * Implements the Ace-token round system (§8.1.1).
 *
 * After the Prologue, each player's resolved Ace becomes a turn-order token.
 * Players with face-up Aces can be selected as Active Player; when they act,
 * their Ace flips face-down. Once all living players have acted, the round
 * resets and all Aces flip face-up again.
 *
 * During the Prologue, the top Ace's suit determines the Active Player
 * automatically (no player choice).
 *
 * Source of truth: docs/01-game-rules.md §8.1.1
 */

import type { Suit, Character, DeckState, TurnOrder } from './types';

// ── Initialization ──────────────────────────────────────────────────────────

/**
 * Create the initial turn order for the start of a game.
 * All living characters start with Aces face-up (available).
 */
export function initTurnOrder(characters: Character[]): TurnOrder {
  return {
    available: characters.filter(c => !c.isDead).map(c => c.id),
    acted: [],
  };
}

// ── Mutations (return new state) ────────────────────────────────────────────

/**
 * Mark a player as having acted this round (flip Ace face-down).
 * Moves the suit from `available` to `acted`.
 */
export function markActed(turnOrder: TurnOrder, suit: Suit): TurnOrder {
  return {
    available: turnOrder.available.filter(s => s !== suit),
    acted: [...turnOrder.acted, suit],
  };
}

/**
 * Reset the round — all acted players become available again (flip all Aces face-up).
 * Only includes living characters.
 */
export function resetRound(turnOrder: TurnOrder, livingCharacters: Character[]): TurnOrder {
  const livingSuits = livingCharacters.filter(c => !c.isDead).map(c => c.id);
  return {
    available: livingSuits,
    acted: [],
  };
}

/**
 * Remove a player from the turn order entirely (character died).
 * If they were in `available`, they're removed. If in `acted`, they're removed.
 */
export function removeFromTurnOrder(turnOrder: TurnOrder, suit: Suit): TurnOrder {
  return {
    available: turnOrder.available.filter(s => s !== suit),
    acted: turnOrder.acted.filter(s => s !== suit),
  };
}

// ── Queries ─────────────────────────────────────────────────────────────────

/**
 * Is the round complete? (All living players have acted)
 */
export function isRoundComplete(turnOrder: TurnOrder): boolean {
  return turnOrder.available.length === 0;
}

/**
 * Get the list of players who can be selected as Active Player.
 */
export function getAvailablePlayers(turnOrder: TurnOrder): Suit[] {
  return turnOrder.available;
}

/**
 * During the Prologue, auto-select the AP based on the top Ace's suit.
 * Returns the suit of the character who must act, or null if not in Prologue.
 */
export function autoSelectPrologueAP(
  deck: DeckState,
  characters: Character[],
): Suit | null {
  const topCard = deck.threatDeck[0];
  if (!topCard || topCard.rank !== 1) return null; // Not in Prologue

  // The Ace's suit determines the AP
  const matchingCharacter = characters.find(c => c.aptitude === topCard.suit && !c.isDead);
  return matchingCharacter?.id ?? null;
}
