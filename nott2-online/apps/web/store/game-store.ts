/**
 * Game Store
 *
 * Zustand store that wraps @nott2/game-engine pure functions.
 *
 * Supports three modes:
 *   Demo    — no Firebase, fully offline, single-player controls all 4 characters
 *   Host    — applies actions locally + pushes state to Firebase RTDB
 *   Client  — sends actions to host via action queue, receives state from Firebase
 *
 * Architecture: engine functions take state in → return new state out.
 * The store is a thin wrapper; Firebase sync is a side-effect in setAndSync().
 */

'use client';

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import * as engine from '@nott2/game-engine';
import {
  initFirebase,
  ensureAuth,
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

interface GameStore {
  // ── State ─────────────────────────────────────────────────────────────────
  gameState: engine.GameState;
  computed: ReturnType<typeof engine.computeGameState>;

  // ── Phase Control ────────────────────────────────────────────────────────
  nextPhase: () => void;
  prevPhase: () => void;

  // ── Game Setup ────────────────────────────────────────────────────────────
  initGame: (
    playset?: string,
    modules?: Partial<engine.RulesModules>,
    characterNames?: Partial<Record<engine.Suit, string>>,
  ) => void;
  fullReset: () => void;
  updateCharacterName: (suit: engine.Suit, name: string) => void;

  // ── Card Management ───────────────────────────────────────────────────────
  /** Draw a specific card from the threat deck (player reveals what they physically drew) */
  drawCard: (suit: engine.Suit, rank: engine.Rank) => void;
  /** Auto-deal: pick a random available card from the engine probability model */
  autoDeal: () => void;
  /** Select a card as the active threat for this scene */
  selectCard: (cardId: string) => void;
  /** Select a Joker as the active threat */
  selectJoker: (color: engine.JokerColor) => void;
  /** Set the trophy top card explicitly (after a randomised shuffle) */
  setTrophyTop: (suit: engine.Suit, rank: engine.Rank) => void;

  // ── Dice & Resolution ────────────────────────────────────────────────────
  rollDice: (d10: engine.D10Result, d4: engine.D4Result) => void;
  applyAptitude: (modifier: 1 | -1) => void;
  useGenrePoint: (newD10: engine.D10Result) => void;

  // ── Scene Management ──────────────────────────────────────────────────────
  confirmSacrifice: () => void;
  applyFallout: () => void;
  escalate: () => void;

  // ── Character & Strikes ───────────────────────────────────────────────────
  assignStrike: (characterId: engine.Suit) => void;
  awardGenrePoint: (playerId: string) => void;
  setActivePlayer: (characterId: engine.Suit) => void;

  // ── Act Transitions ───────────────────────────────────────────────────────
  applyAct2: () => void;
  applyAct3: () => void;
  applyFinale: () => void;

  // ── Debug ─────────────────────────────────────────────────────────────────
  skipToAct3: () => void;
  addWeakness: (suit: engine.Suit) => void;
  killCharacter: (suit: engine.Suit) => void;

  // ── Multiplayer ───────────────────────────────────────────────────────────
  /** Firebase UID of the local player. Null in demo mode. */
  playerId: string | null;
  /** Display name chosen by the local player */
  playerName: string;
  /** Current room code. Null = demo mode (offline). */
  roomCode: string | null;
  /** True if this client is the room host */
  isHost: boolean;
  /** Firebase connection status */
  isConnected: boolean;
  /** True while a remote state update is being applied (prevents echo push) */
  _isRemoteUpdate: boolean;
  /** Error message from the last multiplayer operation */
  multiplayerError: string | null;

  /** Initialize Firebase + sign in anonymously. Must be called before createRoom/joinRoom. */
  initMultiplayer: () => Promise<void>;
  /** Create a new room and become the host */
  createRoom: (playerName: string) => Promise<string>;
  /** Join an existing room by code */
  joinRoom: (roomCode: string, playerName: string) => Promise<void>;
  /** Leave the current room (host closes it, client removes themselves) */
  leaveRoom: () => Promise<void>;
  /** Set multiplayer error (used internally) */
  setMultiplayerError: (err: string | null) => void;

  // ── Chat ─────────────────────────────────────────────────────────────────
  /** In-game chat messages (for ChatPanel DS component) */
  chatLog: Array<{ id: string; playerId: string; name: string; text: string; timestamp: number }>;
  /** Send a chat message (in multiplayer: pushes action; in demo: appends locally) */
  sendChatMessage: (text: string) => void;

  // ── Live Player Roster ────────────────────────────────────────────────────
  /** Players currently in the Firebase room (for lobby seat list) */
  remotePlayers: Array<{ id: string; name: string; seatIndex: number; characterId: string; isHost: boolean; ready: boolean }>;
}

function recompute(gs: engine.GameState) {
  return engine.computeGameState(gs);
}

/** The demo player ID — single player controls everything */
export const DEMO_PLAYER_ID = 'demo-player';

function makeDemoPlayers(characters: engine.Character[]): engine.Player[] {
  return characters.map((c, i) => ({
    id: `${DEMO_PLAYER_ID}-${c.id}`,
    name: `Player (${c.id})`,
    characterId: c.id,
    isHost: i === 0,
    isConnected: true,
    seatIndex: i as 0 | 1 | 2 | 3,
  }));
}

function initialState(): engine.GameState {
  const gs = engine.createInitialGameState();
  return {
    ...gs,
    players: makeDemoPlayers(gs.characters),
    scene: {
      ...gs.scene,
      activePlayerId: `${DEMO_PLAYER_ID}-Spades`,
    },
  };
}

export const useGameStore = create<GameStore>()(
  devtools(
    (set, get) => ({
      gameState: initialState(),
      computed: recompute(initialState()),
      chatLog: [],
      remotePlayers: [],

      // ── Phase Control ────────────────────────────────────────────────────

      nextPhase: () => {
        const gs = engine.nextPhase(get().gameState);
        set({ gameState: gs, computed: recompute(gs) }, false, 'nextPhase');
      },

      prevPhase: () => {
        const gs = engine.prevPhase(get().gameState);
        set({ gameState: gs, computed: recompute(gs) }, false, 'prevPhase');
      },

      // ── Game Setup ───────────────────────────────────────────────────────

      initGame: (playset = 'default', modules = {}, characterNames = {}) => {
        const merged: engine.RulesModules = {
          classicSetup: false,
          finalGirl: false,
          ...modules,
        };
        const base = engine.createInitialGameState(playset);
        // Apply character names if provided
        const characters = base.characters.map(c => ({
          ...c,
          name: characterNames[c.id] || c.name,
        }));
        const gs: engine.GameState = {
          ...base,
          // Preserve current phase so nextPhase() works correctly
          // (createInitialGameState resets to 'lobby', but we're in 'game-setup')
          phase: get().gameState.phase,
          characters,
          rulesModules: merged,
          deck: engine.createDeck(merged),
          players: makeDemoPlayers(characters),
          scene: {
            ...base.scene,
            activePlayerId: `${DEMO_PLAYER_ID}-Spades`,
          },
        };
        set({ gameState: gs, computed: recompute(gs) }, false, 'initGame');
      },

      fullReset: () => {
        const gs = initialState();
        set({ gameState: gs, computed: recompute(gs) }, false, 'fullReset');
      },

      updateCharacterName: (suit, name) => {
        const gs = get().gameState;
        const chars = gs.characters.map(c =>
          c.id === suit ? { ...c, name } : c,
        );
        const newGs = { ...gs, characters: chars };
        set({ gameState: newGs, computed: recompute(newGs) }, false, 'updateCharacterName');
      },

      // ── Card Management ──────────────────────────────────────────────────

      drawCard: (suit, rank) => {
        // Manual entry: find the specified card in the threat deck and draw it
        const gs = get().gameState;
        const { deck } = gs;
        const cardId = `${rank}-${suit}`;
        const idx = deck.threatDeck.findIndex(c => c.id === cardId);
        if (idx < 0) return; // Card not in deck

        // Splice the card out and add to visibleCards
        const card = deck.threatDeck[idx];
        const newThreatDeck = [
          ...deck.threatDeck.slice(0, idx),
          ...deck.threatDeck.slice(idx + 1),
        ];
        const newDeck = {
          ...deck,
          threatDeck: newThreatDeck,
          visibleCards: [...deck.visibleCards, card],
        };
        const newGS = { ...gs, deck: newDeck };
        set({ gameState: newGS, computed: recompute(newGS) }, false, 'drawCard');
      },

      autoDeal: () => {
        // Simply draw the top card from the threat deck.
        // The deck is already ordered correctly:
        //   - During Prologue: Aces on top
        //   - During Main Game: shuffled number + face cards
        const gs = get().gameState;
        const [newDeck, drawn] = engine.drawCard(gs.deck);
        if (!drawn) return; // Empty deck

        const newGS = { ...gs, deck: newDeck };
        set({ gameState: newGS, computed: recompute(newGS) }, false, 'autoDeal');
      },

      selectCard: (cardId) => {
        const gs = get().gameState;
        const newGS = {
          ...gs,
          scene: { ...gs.scene, selectedCardId: cardId, activeJoker: null },
        };
        set({ gameState: newGS, computed: recompute(newGS) }, false, 'selectCard');
      },

      selectJoker: (color) => {
        const gs = get().gameState;
        // Shuffle trophy pile before joker resolution (§11.1)
        const newDeck = engine.shuffleTrophyPile(gs.deck);
        const newGS = {
          ...gs,
          deck: newDeck,
          scene: { ...gs.scene, selectedCardId: null, activeJoker: color },
        };
        set({ gameState: newGS, computed: recompute(newGS) }, false, 'selectJoker');
      },

      setTrophyTop: (suit, rank) => {
        const card = engine.makeCard(rank, suit);
        const newDeck = engine.setTrophyTop(get().gameState.deck, card);
        const newGS = { ...get().gameState, deck: newDeck };
        set({ gameState: newGS, computed: recompute(newGS) }, false, 'setTrophyTop');
      },

      // ── Dice & Resolution ────────────────────────────────────────────────

      rollDice: (d10, d4) => {
        const gs = get().gameState;
        const newGS = {
          ...gs,
          scene: { ...gs.scene, rollMain: d10, rollEffort: d4, modifiedEffort: null },
        };
        set({ gameState: newGS, computed: recompute(newGS) }, false, 'rollDice');
      },

      applyAptitude: (modifier) => {
        const gs = get().gameState;
        if (gs.scene.rollEffort === null) return;
        const newD4 = engine.applyAptitudeModifier(gs.scene.rollEffort, modifier);
        const newGS = {
          ...gs,
          scene: { ...gs.scene, modifiedEffort: newD4 },
        };
        set({ gameState: newGS, computed: recompute(newGS) }, false, 'applyAptitude');
      },

      useGenrePoint: (newD10) => {
        const gs = get().gameState;
        const activePlayerId = gs.scene.activePlayerId ?? '';
        // Spend from player pool: removed from game (§6.2)
        const afterSpend = engine.spendGenrePoint(gs, activePlayerId);
        const d4 = afterSpend.scene.modifiedEffort ?? afterSpend.scene.rollEffort ?? (1 as engine.D4Result);
        const newTotal = engine.applyGenrePointReroll(newD10, d4);
        const newGS: engine.GameState = {
          ...afterSpend,
          scene: {
            ...afterSpend.scene,
            rollMain: newD10,
            isGenrePointUsed: true,
          },
        };
        set({ gameState: newGS, computed: recompute(newGS) }, false, 'useGenrePoint');
      },

      // ── Scene Management ──────────────────────────────────────────────────

      confirmSacrifice: () => {
        const gs = get().gameState;
        const newGS = { ...gs, scene: { ...gs.scene, sacrificeConfirmed: true } };
        set({ gameState: newGS, computed: recompute(newGS) }, false, 'confirmSacrifice');
      },

      escalate: () => {
        const gs = get().gameState;
        const newGS = { ...gs, scene: { ...gs.scene, escalationUsed: true } };
        set({ gameState: newGS, computed: recompute(newGS) }, false, 'escalate');
      },

      applyFallout: () => {
        const gs = get().gameState;
        const { scene, deck } = gs;

        // Determine card being resolved
        const joker = scene.activeJoker;
        let card: engine.Card | engine.JokerCard | null = null;
        if (joker) {
          card = { id: `Joker-${joker}`, color: joker, isJoker: true };
        } else if (scene.selectedCardId) {
          card = deck.visibleCards.find(c => c.id === scene.selectedCardId) ?? null;
        }

        if (!card) return;

        const d4 = (scene.modifiedEffort ?? scene.rollEffort) as engine.D4Result;
        if (!d4 || scene.rollMain === null) return;

        const total = engine.calculateTotal(scene.rollMain, d4);
        const difficulty = engine.calculateDifficulty(card, deck.trophyTop);
        const isSuccess = engine.isSuccessful(total, difficulty);

        const result = engine.applyFallout(gs, card, isSuccess, d4);

        // Apply act transitions
        let newGs: engine.GameState = {
          ...gs,
          deck: result.newDeck,
          strikesToAssign: result.newStrikesToAssign,
          weaknessesFound: result.newDeck.weaknessesBySuit.size > gs.weaknessesFound.length
            ? [...gs.weaknessesFound, ...Array.from(result.newDeck.weaknessesBySuit).filter(s => !gs.weaknessesFound.includes(s))]
            : gs.weaknessesFound,
          isGameWon: result.isGameWon,
          pendingActSetups: result.pendingActSetups,
        };

        // Handle act1 → act2
        if (result.actTransition === 'act2' && newGs.currentAct === 1) {
          newGs = engine.startAct2(newGs);
        }

        // Handle black joker
        if (joker === 'Black') {
          newGs = { ...newGs, isBlackJokerRemoved: true };
        }

        set({ gameState: newGs, computed: recompute(newGs) }, false, 'applyFallout');
      },

      // ── Character & Strikes ───────────────────────────────────────────────

      assignStrike: (characterId) => {
        const gs = engine.assignStrike(get().gameState, characterId);
        set({ gameState: gs, computed: recompute(gs) }, false, 'assignStrike');
      },

      awardGenrePoint: (playerId) => {
        const gs = engine.awardGenrePoint(get().gameState, playerId);
        set({ gameState: gs, computed: recompute(gs) }, false, 'awardGenrePoint');
      },

      setActivePlayer: (characterId) => {
        const gs = get().gameState;
        const playerId = `${DEMO_PLAYER_ID}-${characterId}`;
        const newGS = {
          ...gs,
          scene: { ...gs.scene, activePlayerId: playerId },
        };
        set({ gameState: newGS, computed: recompute(newGS) }, false, 'setActivePlayer');
      },

      // ── Act Transitions ───────────────────────────────────────────────────

      applyAct2: () => {
        const gs = engine.startAct2(get().gameState);
        set({ gameState: gs, computed: recompute(gs) }, false, 'applyAct2');
      },

      applyAct3: () => {
        const gs = engine.startAct3(get().gameState);
        set({ gameState: gs, computed: recompute(gs) }, false, 'applyAct3');
      },

      applyFinale: () => {
        const gs = engine.startEndgame(get().gameState);
        set({ gameState: gs, computed: recompute(gs) }, false, 'applyFinale');
      },

      // ── Debug ─────────────────────────────────────────────────────────────

      skipToAct3: () => {
        let gs = get().gameState;
        gs = engine.startAct2(gs);
        gs = engine.startAct3(gs);
        set({ gameState: gs, computed: recompute(gs) }, false, 'skipToAct3');
      },

      addWeakness: (suit) => {
        const gs = get().gameState;
        const newDeck = engine.recordWeakness(gs.deck, suit);
        const weaknesses = Array.from(newDeck.weaknessesBySuit) as engine.Suit[];
        const newGs = {
          ...gs,
          deck: newDeck,
          weaknessesFound: weaknesses,
          isEndgame: weaknesses.length >= 4,
        };
        set({ gameState: newGs, computed: recompute(newGs) }, false, 'addWeakness');
      },

      killCharacter: (suit) => {
        const gs = get().gameState;
        const chars = gs.characters.map(c =>
          c.id === suit ? { ...c, strikes: 3 as const, isDead: true } : c,
        );
        const newGs = { ...gs, characters: chars };
        set({ gameState: newGs, computed: recompute(newGs) }, false, 'killCharacter');
      },

      // ── Multiplayer State Defaults ─────────────────────────────────────────

      playerId: null,
      playerName: 'Player',
      roomCode: null,
      isHost: false,
      isConnected: false,
      _isRemoteUpdate: false,
      multiplayerError: null,

      // ── Multiplayer Actions ───────────────────────────────────────────────

      setMultiplayerError: (err) => {
        set({ multiplayerError: err }, false, 'setMultiplayerError');
      },

      /**
       * Initialize Firebase + sign in anonymously.
       * Safe to call multiple times — returns immediately if already initialized.
       */
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

      /**
       * Create a room and become the host.
       * Registers presence + subscribes to action queue.
       * Returns the room code.
       */
      createRoom: async (playerName) => {
        const { playerId } = get();
        if (!playerId) throw new Error('Call initMultiplayer() first.');

        set({ playerName, multiplayerError: null }, false, 'createRoom/start');

        try {
          const code = await createRoom(playerId, playerName);
          set({ roomCode: code, isHost: true }, false, 'createRoom/created');

          // Register presence
          registerPresence(code, playerId);

          // Host: subscribe to incoming client actions
          const unsubActions = subscribeToActionQueue(code, {
            onAction: async (action, actionRef: DatabaseReference) => {
              const { gameState: currentGs } = get();
              const validation = engine.validateAction(currentGs, action);
              if (validation.valid) {
                // Apply the action locally (same as if the host triggered it)
                // For now: nextPhase is the only validated action clients can send
                const newGs = validation.valid
                  ? engine.nextPhase(currentGs) // TODO: route by action.type
                  : currentGs;
                const computed = recompute(newGs);
                set({ gameState: newGs, computed }, false, `host/applyAction/${action.type}`);
                pushState(code, newGs);
              }
              await removeAction(actionRef);
            },
          });

          // Subscribe to player list for lobby seat display
          subscribeToPlayers(code, (players) => {
            set({ remotePlayers: players as any }, false, 'createRoom/players');
          });

          // Push initial state
          pushState(code, get().gameState);

          return code;
        } catch (err) {
          const msg = err instanceof Error ? err.message : 'Failed to create room.';
          set({ multiplayerError: msg }, false, 'createRoom/error');
          throw err;
        }
      },

      /**
       * Join an existing room as a client.
       * Subscribes to the host's state stream.
       */
      joinRoom: async (roomCode, playerName) => {
        const { playerId } = get();
        if (!playerId) throw new Error('Call initMultiplayer() first.');

        set({ playerName, multiplayerError: null }, false, 'joinRoom/start');

        try {
          await joinRoom(roomCode, playerId, playerName);
          set({ roomCode, isHost: false }, false, 'joinRoom/joined');

          // Register presence
          registerPresence(roomCode, playerId);

          // Subscribe to host state
          subscribeToGameState(roomCode, (remoteGs) => {
            if (!remoteGs) return;
            const computed = recompute(remoteGs);
            set(
              { gameState: remoteGs, computed, _isRemoteUpdate: true },
              false,
              'joinRoom/stateUpdate',
            );
            requestAnimationFrame(() => {
              set({ _isRemoteUpdate: false }, false, 'joinRoom/clearRemoteFlag');
            });
          });

          // Subscribe to player list for lobby seat display
          subscribeToPlayers(roomCode, (players) => {
            set({ remotePlayers: players as any }, false, 'joinRoom/players');
          });
        } catch (err) {
          const msg = err instanceof Error ? err.message : 'Failed to join room.';
          set({ multiplayerError: msg }, false, 'joinRoom/error');
          throw err;
        }
      },

      /**
       * Leave the current room.
       * Host: closes the room. Client: removes themselves.
       */
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
        // Append locally immediately (optimistic)
        set({ chatLog: [...chatLog, msg] }, false, 'sendChatMessage');
        // In multiplayer, broadcast via action queue
        if (roomCode && playerId) {
          sendAction(roomCode, {
            type: 'escalate', // reuse escalate action type for chat for now
            playerId,
            payload: msg,
          }).catch(() => {/* non-critical */});
        }
      },
    }),
    { name: 'NottGame' },
  ),
);

