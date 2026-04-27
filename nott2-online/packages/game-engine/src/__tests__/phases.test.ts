/**
 * Tests for phases.ts
 *
 * Covers: phase transitions, act management, character strikes (including
 * Final Girl module), genre points, TPK, and the initial state factory.
 */

import { describe, it, expect } from 'vitest';
import {
  createInitialGameState,
  nextPhase,
  prevPhase,
  startAct2,
  startAct3,
  startEndgame,
  startNextScene,
  assignStrike,
  awardGenrePoint,
  spendGenrePoint,
} from '../phases';
import type { GameState } from '../types';

// ── createInitialGameState ──────────────────────────────────────────────────

describe('createInitialGameState', () => {
  it('starts in lobby phase', () => {
    const state = createInitialGameState();
    expect(state.phase).toBe('lobby');
  });

  it('starts in Act 1', () => {
    const state = createInitialGameState();
    expect(state.currentAct).toBe(1);
  });

  it('has 4 default characters', () => {
    const state = createInitialGameState();
    expect(state.characters).toHaveLength(4);
  });

  it('all characters start with 0 strikes and not dead', () => {
    const state = createInitialGameState();
    state.characters.forEach(c => {
      expect(c.strikes).toBe(0);
      expect(c.isDead).toBe(false);
    });
  });

  it('starts with 13 table genre points', () => {
    const state = createInitialGameState();
    expect(state.tableGenrePoints).toBe(13);
  });

  it('has no weaknesses found', () => {
    const state = createInitialGameState();
    expect(state.weaknessesFound).toHaveLength(0);
  });
});

// ── nextPhase ───────────────────────────────────────────────────────────────

describe('nextPhase', () => {
  it('lobby → welcome', () => {
    const state = createInitialGameState();
    expect(nextPhase(state).phase).toBe('welcome');
  });

  it('welcome → game-setup', () => {
    const state = { ...createInitialGameState(), phase: 'welcome' as const };
    expect(nextPhase(state).phase).toBe('game-setup');
  });

  it('game-setup → act-setup', () => {
    const state = { ...createInitialGameState(), phase: 'game-setup' as const };
    expect(nextPhase(state).phase).toBe('act-setup');
  });

  it('act-setup → scene-setup (random mode, no trophy setup)', () => {
    const state = { ...createInitialGameState(), phase: 'act-setup' as const };
    expect(nextPhase(state).phase).toBe('scene-setup');
  });

  it('act-setup → trophy-setup (classic mode)', () => {
    const state = {
      ...createInitialGameState(),
      phase: 'act-setup' as const,
      rulesModules: { classicSetup: true, finalGirl: false },
    };
    expect(nextPhase(state).phase).toBe('trophy-setup');
  });

  it('trophy-setup → scene-setup', () => {
    const state = { ...createInitialGameState(), phase: 'trophy-setup' as const };
    expect(nextPhase(state).phase).toBe('scene-setup');
  });

  it('scene-setup → conversation-stakes', () => {
    const state = { ...createInitialGameState(), phase: 'scene-setup' as const };
    expect(nextPhase(state).phase).toBe('conversation-stakes');
  });

  it('conversation-stakes → resolution', () => {
    const state = { ...createInitialGameState(), phase: 'conversation-stakes' as const };
    expect(nextPhase(state).phase).toBe('resolution');
  });

  it('resolution → resolve-scene', () => {
    const state = { ...createInitialGameState(), phase: 'resolution' as const };
    expect(nextPhase(state).phase).toBe('resolve-scene');
  });

  it('resolve-scene → fallout', () => {
    const state = { ...createInitialGameState(), phase: 'resolve-scene' as const };
    expect(nextPhase(state).phase).toBe('fallout');
  });

  it('fallout → scene-setup (no pending setups, living characters)', () => {
    const state = { ...createInitialGameState(), phase: 'fallout' as const };
    expect(nextPhase(state).phase).toBe('scene-setup');
  });

  it('fallout → act-setup when pending setups exist', () => {
    const state = {
      ...createInitialGameState(),
      phase: 'fallout' as const,
      pendingActSetups: ['act3'],
    };
    expect(nextPhase(state).phase).toBe('act-setup');
  });

  it('win phase is terminal', () => {
    const state = { ...createInitialGameState(), phase: 'win' as const };
    expect(nextPhase(state).phase).toBe('win');
  });

  it('lose phase is terminal', () => {
    const state = { ...createInitialGameState(), phase: 'lose' as const };
    expect(nextPhase(state).phase).toBe('lose');
  });
});

describe('prevPhase', () => {
  it('resolve-scene → resolution', () => {
    const state = { ...createInitialGameState(), phase: 'resolve-scene' as const };
    expect(prevPhase(state).phase).toBe('resolution');
  });

  it('resolution → conversation-stakes', () => {
    const state = { ...createInitialGameState(), phase: 'resolution' as const };
    expect(prevPhase(state).phase).toBe('conversation-stakes');
  });
});

// ── Act Transitions ──────────────────────────────────────────────────────────

describe('startAct2', () => {
  it('sets currentAct to 2', () => {
    const state = createInitialGameState();
    expect(startAct2(state).currentAct).toBe(2);
  });

  it('transitions to Act 2 without modifying deck structure', () => {
    const state = createInitialGameState();
    const act2State = startAct2(state);
    // With card-array model, the deck is unchanged — Aces are still in the deck
    // and will be drawn/resolved naturally
    expect(act2State.deck.threatDeck).toEqual(state.deck.threatDeck);
  });
});

describe('startAct3', () => {
  it('sets currentAct to 3', () => {
    const state = createInitialGameState();
    expect(startAct3(state).currentAct).toBe(3);
  });

  it('removes number cards from threat deck', () => {
    const state = createInitialGameState();
    const act3State = startAct3(state);
    // No number cards (rank 1-10) should remain
    const numberCards = act3State.deck.threatDeck.filter(c => c.rank <= 10);
    expect(numberCards).toHaveLength(0);
    // Only face cards remain
    expect(act3State.deck.threatDeck.every(c => c.rank >= 11)).toBe(true);
  });
});

describe('startEndgame', () => {
  it('marks isEndgame true', () => {
    const state = createInitialGameState();
    expect(startEndgame(state).isEndgame).toBe(true);
  });

  it('marks jokersAdded true', () => {
    const state = createInitialGameState();
    expect(startEndgame(state).jokersAdded).toBe(true);
  });

  it('does not add jokers twice if called again', () => {
    const state = createInitialGameState();
    const once = startEndgame(state);
    const twice = startEndgame(once);
    // Count Joker entries in the deck
    const jokerCount = twice.deck.threatDeck.filter(c => c.id.startsWith('Joker-')).length;
    expect(jokerCount).toBe(2); // Still only 2 jokers
  });
});

// ── assignStrike ─────────────────────────────────────────────────────────────

describe('assignStrike', () => {
  it('increments a character\'s strikes', () => {
    const state = { ...createInitialGameState(), strikesToAssign: 1 };
    const result = assignStrike(state, 'Spades');
    const spades = result.characters.find(c => c.id === 'Spades')!;
    expect(spades.strikes).toBe(1);
  });

  it('marks character dead at 3 strikes', () => {
    const state = createInitialGameState();
    const twoStrikes = state.characters.map(c =>
      c.id === 'Hearts' ? { ...c, strikes: 2 as 0|1|2|3 } : c
    );
    const nearDeath = { ...state, characters: twoStrikes, strikesToAssign: 1 };
    const result = assignStrike(nearDeath, 'Hearts');
    const hearts = result.characters.find(c => c.id === 'Hearts')!;
    expect(hearts.isDead).toBe(true);
    expect(hearts.strikes).toBe(3);
  });

  it('decrements strikesToAssign', () => {
    const state = { ...createInitialGameState(), strikesToAssign: 2 };
    const result = assignStrike(state, 'Clubs');
    expect(result.strikesToAssign).toBe(1);
  });

  it('transitions to lose when all characters die (TPK)', () => {
    const state = createInitialGameState();
    // Kill all characters except Clubs (2 strikes)
    const chars = state.characters.map(c => ({
      ...c,
      isDead: c.id !== 'Clubs',
      strikes: c.id !== 'Clubs' ? 3 : 2 as 0|1|2|3,
    }));
    const nearTPK = { ...state, characters: chars, strikesToAssign: 1 };
    const result = assignStrike(nearTPK, 'Clubs');
    expect(result.phase).toBe('lose');
  });
});

describe('assignStrike — Final Girl Module', () => {
  it('queues act3+finale when 1 character left alive', () => {
    const state = createInitialGameState();
    const chars = state.characters.map(c => ({
      ...c,
      isDead: c.id !== 'Spades' && c.id !== 'Hearts',
    }));
    // One alive (Spades), Hearts has 2 strikes
    const hearts2 = chars.map(c =>
      c.id === 'Hearts' ? { ...c, isDead: false, strikes: 2 as 0|1|2|3 } : c
    );
    const state2 = {
      ...state,
      characters: hearts2,
      strikesToAssign: 1,
      rulesModules: { classicSetup: false, finalGirl: true },
      currentAct: 1 as 1,
    };
    const result = assignStrike(state2, 'Hearts');
    expect(result.pendingActSetups).toContain('act3');
    expect(result.pendingActSetups).toContain('finale');
  });
});

// ── Genre Points ──────────────────────────────────────────────────────────────

describe('awardGenrePoint', () => {
  it('moves point from table to player pool', () => {
    const state = { ...createInitialGameState(), players: [
      { id: 'p1', name: 'Alice', characterId: 'Spades' as const, isHost: true, isConnected: true, seatIndex: 0 as const },
    ]};
    const result = awardGenrePoint(state, 'p1');
    expect(result.tableGenrePoints).toBe(12);
    expect(result.playerGenrePoints['p1']).toBe(1);
  });

  it('does nothing when table pool is empty', () => {
    const state = { ...createInitialGameState(), tableGenrePoints: 0 };
    const result = awardGenrePoint(state, 'p1');
    expect(result.tableGenrePoints).toBe(0);
  });
});

describe('spendGenrePoint', () => {
  it('removes point from player pool (not returned to table)', () => {
    const state = {
      ...createInitialGameState(),
      playerGenrePoints: { p1: 2 },
      scene: { ...createInitialGameState().scene, rollMain: 5 as 5 },
    };
    const result = spendGenrePoint(state, 'p1');
    expect(result.playerGenrePoints['p1']).toBe(1);
    expect(result.tableGenrePoints).toBe(13); // Table pool unchanged
  });

  it('does nothing when player has no points', () => {
    const state = {
      ...createInitialGameState(),
      playerGenrePoints: { p1: 0 },
    };
    const result = spendGenrePoint(state, 'p1');
    expect(result.playerGenrePoints['p1']).toBe(0);
  });
});
