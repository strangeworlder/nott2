/**
 * @nott2/game-engine — Character & Genre Point Management
 *
 * Strike assignment, genre point economy, and character death logic.
 * Extracted from phases.ts to keep the phase FSM focused on
 * state machine transitions.
 *
 * Source of truth: docs/01-game-rules.md §6, §10
 */

import type { GameState, Suit } from './types';
import { removeFromTurnOrder } from './turn-order';

// ── Character Management ─────────────────────────────────────────────────────

/**
 * Assign a strike to a character. If they reach 3 strikes, they die.
 * When a character dies, they are also removed from the turn order.
 */
export function assignStrike(state: GameState, characterId: Suit): GameState {
  const characters = state.characters.map(c => {
    if (c.id !== characterId) return c;
    const newStrikes = Math.min(3, c.strikes + 1) as 0 | 1 | 2 | 3;
    return {
      ...c,
      strikes: newStrikes,
      isDead: newStrikes >= 3,
    };
  });

  const living = characters.filter(c => !c.isDead);
  const diedThisStrike = characters.find(c => c.id === characterId)?.isDead
    && !state.characters.find(c => c.id === characterId)?.isDead;
  const newStrikesToAssign = Math.max(0, state.strikesToAssign - 1);

  let newState = { ...state, characters, strikesToAssign: newStrikesToAssign };

  // Remove dead character from turn order so they don't block round completion
  if (diedThisStrike) {
    newState = {
      ...newState,
      turnOrder: removeFromTurnOrder(newState.turnOrder, characterId),
    };
  }

  // Final Girl: if one character left, trigger Act 3 immediately (§12.2)
  if (state.rulesModules.finalGirl && living.length === 1 && state.currentAct < 3) {
    newState = {
      ...newState,
      pendingActSetups: [...newState.pendingActSetups, 'act3', 'finale'],
    };
  }

  // TPK check
  if (living.length === 0) {
    newState = { ...newState, phase: 'lose' };
  }

  return newState;
}

// ── Genre Points ─────────────────────────────────────────────────────────────

/**
 * Award a genre point from the table pool to a player. §6.1
 */
export function awardGenrePoint(state: GameState, playerId: string): GameState {
  if (state.tableGenrePoints <= 0) return state;
  const current = state.playerGenrePoints[playerId] ?? 0;
  return {
    ...state,
    tableGenrePoints: state.tableGenrePoints - 1,
    playerGenrePoints: { ...state.playerGenrePoints, [playerId]: current + 1 },
    scene: { ...state.scene, isGenrePointAwarded: true },
  };
}

/**
 * Spend a genre point (reroll). Genre point is removed from game. §6.2
 */
export function spendGenrePoint(state: GameState, playerId: string): GameState {
  const current = state.playerGenrePoints[playerId] ?? 0;
  if (current <= 0) return state;
  return {
    ...state,
    playerGenrePoints: { ...state.playerGenrePoints, [playerId]: current - 1 },
    scene: { ...state.scene, isGenrePointUsed: true },
  };
}
