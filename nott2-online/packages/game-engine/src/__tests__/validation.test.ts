/**
 * Tests for validation.ts
 *
 * Covers: all GameAction types, AP enforcement, host enforcement,
 * genre point constraints, escalation once-per-scene.
 */

import { describe, it, expect } from 'vitest';
import { validateAction } from '../validation';
import { createInitialGameState } from '../phases';
import { makeCard } from '../deck';
import type { GameState, Player } from '../types';

const hostPlayer: Player = {
  id: 'host',
  name: 'Host',
  characterId: 'Spades',
  isHost: true,
  isConnected: true,
  seatIndex: 0,
};

const guestPlayer: Player = {
  id: 'guest',
  name: 'Guest',
  characterId: 'Hearts',
  isHost: false,
  isConnected: true,
  seatIndex: 1,
};

function stateWithPlayers(phase: GameState['phase'] = 'scene-setup'): GameState {
  return {
    ...createInitialGameState(),
    phase,
    players: [hostPlayer, guestPlayer],
    scene: {
      ...createInitialGameState().scene,
      activePlayerId: 'host',
    },
  };
}

// ── Unknown player ───────────────────────────────────────────────────────────

describe('validateAction — unknown player', () => {
  it('rejects actions from unknown player IDs', () => {
    const state = stateWithPlayers();
    const result = validateAction(state, { type: 'draw_card', playerId: 'nobody' });
    expect(result.valid).toBe(false);
  });
});

// ── draw_card ────────────────────────────────────────────────────────────────

describe('validateAction — draw_card', () => {
  it('valid: AP draws during scene-setup', () => {
    const state = stateWithPlayers('scene-setup');
    const result = validateAction(state, { type: 'draw_card', playerId: 'host' });
    expect(result.valid).toBe(true);
  });

  it('invalid: non-AP tries to draw', () => {
    const state = stateWithPlayers('scene-setup');
    const result = validateAction(state, { type: 'draw_card', playerId: 'guest' });
    expect(result.valid).toBe(false);
  });

  it('invalid: wrong phase', () => {
    const state = stateWithPlayers('resolution');
    const result = validateAction(state, { type: 'draw_card', playerId: 'host' });
    expect(result.valid).toBe(false);
  });
});

// ── roll_dice ─────────────────────────────────────────────────────────────────

describe('validateAction — roll_dice', () => {
  it('valid: AP rolls during resolution', () => {
    const state = stateWithPlayers('resolution');
    const result = validateAction(state, { type: 'roll_dice', playerId: 'host' });
    expect(result.valid).toBe(true);
  });

  it('invalid: non-AP tries to roll', () => {
    const state = stateWithPlayers('resolution');
    const result = validateAction(state, { type: 'roll_dice', playerId: 'guest' });
    expect(result.valid).toBe(false);
  });

  it('invalid: dice already rolled (no genre point)', () => {
    const state = {
      ...stateWithPlayers('resolution'),
      scene: { ...stateWithPlayers('resolution').scene, rollMain: 5 as 5 },
    };
    const result = validateAction(state, { type: 'roll_dice', playerId: 'host' });
    expect(result.valid).toBe(false);
  });
});

// ── advance_phase ─────────────────────────────────────────────────────────────

describe('validateAction — advance_phase', () => {
  it('valid: host advances phase', () => {
    const state = stateWithPlayers('scene-setup');
    const result = validateAction(state, { type: 'advance_phase', playerId: 'host' });
    expect(result.valid).toBe(true);
  });

  it('invalid: guest advances phase', () => {
    const state = stateWithPlayers('scene-setup');
    const result = validateAction(state, { type: 'advance_phase', playerId: 'guest' });
    expect(result.valid).toBe(false);
  });

  it('invalid: game has ended (win)', () => {
    const state = { ...stateWithPlayers('win') };
    const result = validateAction(state, { type: 'advance_phase', playerId: 'host' });
    expect(result.valid).toBe(false);
  });
});

// ── assign_strike ─────────────────────────────────────────────────────────────

describe('validateAction — assign_strike', () => {
  it('valid: host assigns pending strike', () => {
    const state = { ...stateWithPlayers(), strikesToAssign: 1 };
    const result = validateAction(state, {
      type: 'assign_strike',
      playerId: 'host',
      payload: { characterId: 'Spades' },
    });
    expect(result.valid).toBe(true);
  });

  it('invalid: no strikes pending', () => {
    const state = { ...stateWithPlayers(), strikesToAssign: 0 };
    const result = validateAction(state, {
      type: 'assign_strike',
      playerId: 'host',
      payload: { characterId: 'Spades' },
    });
    expect(result.valid).toBe(false);
  });

  it('invalid: character already dead', () => {
    const state = {
      ...stateWithPlayers(),
      strikesToAssign: 1,
      characters: createInitialGameState().characters.map(c =>
        c.id === 'Spades' ? { ...c, isDead: true } : c
      ),
    };
    const result = validateAction(state, {
      type: 'assign_strike',
      playerId: 'host',
      payload: { characterId: 'Spades' },
    });
    expect(result.valid).toBe(false);
  });

  it('invalid: guest tries to assign', () => {
    const state = { ...stateWithPlayers(), strikesToAssign: 1 };
    const result = validateAction(state, {
      type: 'assign_strike',
      playerId: 'guest',
      payload: { characterId: 'Spades' },
    });
    expect(result.valid).toBe(false);
  });
});

// ── use_genre_point ───────────────────────────────────────────────────────────

describe('validateAction — use_genre_point', () => {
  it('valid: player has point and has rolled', () => {
    const state = {
      ...stateWithPlayers('resolution'),
      playerGenrePoints: { host: 1 },
      scene: { ...stateWithPlayers('resolution').scene, rollMain: 3 as 3 },
    };
    const result = validateAction(state, { type: 'use_genre_point', playerId: 'host' });
    expect(result.valid).toBe(true);
  });

  it('invalid: already used this scene', () => {
    const state = {
      ...stateWithPlayers('resolution'),
      playerGenrePoints: { host: 1 },
      scene: {
        ...stateWithPlayers('resolution').scene,
        rollMain: 3 as 3,
        isGenrePointUsed: true,
      },
    };
    const result = validateAction(state, { type: 'use_genre_point', playerId: 'host' });
    expect(result.valid).toBe(false);
  });

  it('invalid: must roll before spending (§6.3)', () => {
    const state = {
      ...stateWithPlayers('resolution'),
      playerGenrePoints: { host: 1 },
    };
    const result = validateAction(state, { type: 'use_genre_point', playerId: 'host' });
    expect(result.valid).toBe(false);
  });

  it('invalid: no genre points available', () => {
    const state = {
      ...stateWithPlayers('resolution'),
      playerGenrePoints: { host: 0 },
      scene: { ...stateWithPlayers('resolution').scene, rollMain: 3 as 3 },
    };
    const result = validateAction(state, { type: 'use_genre_point', playerId: 'host' });
    expect(result.valid).toBe(false);
  });
});

// ── escalate ──────────────────────────────────────────────────────────────────

describe('validateAction — escalate', () => {
  it('valid: non-AP escalates during conversation-stakes', () => {
    const state = stateWithPlayers('conversation-stakes');
    const result = validateAction(state, { type: 'escalate', playerId: 'guest' });
    expect(result.valid).toBe(true);
  });

  it('invalid: AP cannot escalate their own scene', () => {
    const state = stateWithPlayers('conversation-stakes');
    const result = validateAction(state, { type: 'escalate', playerId: 'host' });
    expect(result.valid).toBe(false);
  });

  it('invalid: escalation already used this scene', () => {
    const state = {
      ...stateWithPlayers('conversation-stakes'),
      scene: { ...stateWithPlayers('conversation-stakes').scene, escalationUsed: true },
    };
    const result = validateAction(state, { type: 'escalate', playerId: 'guest' });
    expect(result.valid).toBe(false);
  });

  it('invalid: wrong phase', () => {
    const state = stateWithPlayers('resolution');
    const result = validateAction(state, { type: 'escalate', playerId: 'guest' });
    expect(result.valid).toBe(false);
  });
});
