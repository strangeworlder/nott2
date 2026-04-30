/**
 * Multiplayer Slice
 *
 * Firebase lifecycle, room management, and chat functionality.
 * Extracted from game-store.ts to keep the store focused on game logic.
 *
 * This module exports a factory function that returns the multiplayer
 * portion of the Zustand store state + actions.
 */

'use client';

import * as engine from '@nott2/game-engine';
import {
  initFirebase,
  ensureAuth,
  signInAsHost,
  createRoom,
  joinRoom,
  leaveRoom,
  pushState,
  subscribeToGameState,
  subscribeToActionQueue,
  subscribeToPlayers,
  removeAction,
  registerPresence,
  sendAction,
} from '@nott2/multiplayer';
import { getFirebaseConfig, isFirebaseConfigured } from '../lib/firebase-config';
import type { DatabaseReference } from 'firebase/database';

// ── Types ────────────────────────────────────────────────────────────────────

export interface MultiplayerSlice {
  playerId: string | null;
  playerName: string;
  roomCode: string | null;
  isHost: boolean;
  isConnected: boolean;
  _isRemoteUpdate: boolean;
  multiplayerError: string | null;
  chatLog: Array<{ id: string; playerId: string; name: string; text: string; timestamp: number }>;
  remotePlayers: Array<{ id: string; name: string; seatIndex: number; characterId: string; isHost: boolean; ready: boolean }>;

  initMultiplayer: () => Promise<void>;
  createRoom: (playerName: string) => Promise<string>;
  joinRoom: (roomCode: string, playerName: string) => Promise<void>;
  leaveRoom: () => Promise<void>;
  setMultiplayerError: (err: string | null) => void;
  sendChatMessage: (text: string) => void;
}

// ── Recompute helper (imported by the main store; passed in here to avoid circular deps) ──

type RecomputeFn = (gs: engine.GameState) => ReturnType<typeof engine.computeGameState>;

// ── Factory ──────────────────────────────────────────────────────────────────

export function createMultiplayerSlice(
  set: any,
  get: any,
  recompute: RecomputeFn,
): MultiplayerSlice {
  return {
    // ── State Defaults ─────────────────────────────────────────────────────
    playerId: null,
    playerName: 'Player',
    roomCode: null,
    isHost: false,
    isConnected: false,
    _isRemoteUpdate: false,
    multiplayerError: null,
    chatLog: [],
    remotePlayers: [],

    // ── Actions ────────────────────────────────────────────────────────────

    setMultiplayerError: (err) => {
      set({ multiplayerError: err }, false, 'setMultiplayerError');
    },

    initMultiplayer: async () => {
      if (!isFirebaseConfigured()) {
        set({ multiplayerError: 'Firebase not configured. Check .env.local.' }, false, 'initMultiplayer/noConfig');
        return;
      }
      try {
        initFirebase(getFirebaseConfig());
        const { uid } = await ensureAuth();
        set({ playerId: uid, isConnected: true, multiplayerError: null }, false, 'initMultiplayer');
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Firebase init failed.';
        set({ multiplayerError: msg, isConnected: false }, false, 'initMultiplayer/error');
      }
    },

    createRoom: async (playerName) => {
      let { playerId } = get();

      // ── Hybrid auth: attempt Discord host auth first ──────────────
      try {
        const sessionRes = await fetch('/api/auth/session');
        const session = sessionRes.ok ? await sessionRes.json() : null;
        if (session?.user?.discordId) {
          const tokenRes = await fetch('/api/auth/firebase-token');
          if (tokenRes.ok) {
            const { token } = await tokenRes.json();
            const { uid } = await signInAsHost(token);
            playerId = uid;
            set({ playerId, isConnected: true }, false, 'createRoom/discordAuth');
          }
        }
      } catch {
        // Discord auth failed — fall through to anonymous
      }

      if (!playerId) {
        const { uid } = await ensureAuth();
        playerId = uid;
        set({ playerId, isConnected: true }, false, 'createRoom/anonAuth');
      }

      set({ playerName, multiplayerError: null }, false, 'createRoom/start');

      try {
        const code = await createRoom(playerId, playerName);
        set({ roomCode: code, isHost: true }, false, 'createRoom/created');

        registerPresence(code, playerId);

        const unsubActions = subscribeToActionQueue(code, {
          onAction: async (action, actionRef: DatabaseReference) => {
            const { gameState: currentGs } = get();
            const validation = engine.validateAction(currentGs, action);
            if (validation.valid) {
              const newGs = validation.valid ? engine.nextPhase(currentGs) : currentGs;
              const computed = recompute(newGs);
              set({ gameState: newGs, computed }, false, `host/applyAction/${action.type}`);
              pushState(code, newGs);
            }
            await removeAction(actionRef);
          },
        });

        subscribeToPlayers(code, (players) => {
          set({ remotePlayers: players as any }, false, 'createRoom/players');
        });

        pushState(code, get().gameState);
        return code;
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Failed to create room.';
        set({ multiplayerError: msg }, false, 'createRoom/error');
        throw err;
      }
    },

    joinRoom: async (roomCode, playerName) => {
      const { playerId } = get();
      if (!playerId) throw new Error('Call initMultiplayer() first.');

      set({ playerName, multiplayerError: null }, false, 'joinRoom/start');

      try {
        await joinRoom(roomCode, playerId, playerName);
        set({ roomCode, isHost: false }, false, 'joinRoom/joined');

        registerPresence(roomCode, playerId);

        subscribeToGameState(roomCode, (remoteGs) => {
          if (!remoteGs) return;
          const computed = recompute(remoteGs);
          set(
            { gameState: remoteGs, computed, _isRemoteUpdate: true },
            false, 'joinRoom/stateUpdate',
          );
          requestAnimationFrame(() => {
            set({ _isRemoteUpdate: false }, false, 'joinRoom/clearRemoteFlag');
          });
        });

        subscribeToPlayers(roomCode, (players) => {
          set({ remotePlayers: players as any }, false, 'joinRoom/players');
        });
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Failed to join room.';
        set({ multiplayerError: msg }, false, 'joinRoom/error');
        throw err;
      }
    },

    leaveRoom: async () => {
      const { roomCode, playerId } = get();
      if (!roomCode || !playerId) return;

      try {
        await leaveRoom(roomCode, playerId);
        set({ roomCode: null, isHost: false, isConnected: false }, false, 'leaveRoom');
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Failed to leave room.';
        set({ multiplayerError: msg }, false, 'leaveRoom/error');
      }
    },

    sendChatMessage: (text: string) => {
      const { playerId, playerName, roomCode, chatLog } = get();
      const msg = {
        id: `msg-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        playerId: playerId ?? 'demo',
        name: playerName || 'Player',
        text,
        timestamp: Date.now(),
      };
      set({ chatLog: [...chatLog, msg] }, false, 'sendChatMessage');
      if (roomCode && playerId) {
        sendAction(roomCode, {
          type: 'escalate',
          playerId,
          payload: msg,
        }).catch(() => {/* non-critical */});
      }
    },
  };
}
