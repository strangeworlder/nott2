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
 *
 * Multiplayer lifecycle (Firebase, rooms, chat) is extracted to multiplayer-slice.ts.
 */

'use client';

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import * as engine from '@nott2/game-engine';
import { createMultiplayerSlice, type MultiplayerSlice } from './multiplayer-slice';

interface GameStore extends MultiplayerSlice {
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
  drawCard: (suit: engine.Suit, rank: engine.Rank) => void;
  autoDeal: () => void;
  selectCard: (cardId: string) => void;
  selectJoker: (color: engine.JokerColor) => void;
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
        const merged: engine.RulesModules = { classicSetup: false, finalGirl: false, ...modules };
        const base = engine.createInitialGameState(playset);
        const characters = base.characters.map(c => ({
          ...c,
          name: characterNames[c.id] || c.name,
        }));
        const gs: engine.GameState = {
          ...base,
          phase: get().gameState.phase,
          characters,
          rulesModules: merged,
          deck: engine.createDeck(merged),
          players: makeDemoPlayers(characters),
          turnOrder: engine.initTurnOrder(characters),
          scene: { ...base.scene, activePlayerId: `${DEMO_PLAYER_ID}-Spades` },
        };
        set({ gameState: gs, computed: recompute(gs) }, false, 'initGame');
      },

      fullReset: () => {
        const gs = initialState();
        set({ gameState: gs, computed: recompute(gs) }, false, 'fullReset');
      },

      updateCharacterName: (suit, name) => {
        const gs = get().gameState;
        const chars = gs.characters.map(c => c.id === suit ? { ...c, name } : c);
        const newGs = { ...gs, characters: chars };
        set({ gameState: newGs, computed: recompute(newGs) }, false, 'updateCharacterName');
      },

      // ── Card Management ──────────────────────────────────────────────────

      drawCard: (suit, rank) => {
        const gs = get().gameState;
        const { deck } = gs;
        const cardId = `${rank}-${suit}`;
        const idx = deck.threatDeck.findIndex(c => c.id === cardId);
        if (idx < 0) return;
        const card = deck.threatDeck[idx];
        const newThreatDeck = [...deck.threatDeck.slice(0, idx), ...deck.threatDeck.slice(idx + 1)];
        const newDeck = { ...deck, threatDeck: newThreatDeck, visibleCards: [...deck.visibleCards, card] };
        const newGS = { ...gs, deck: newDeck };
        set({ gameState: newGS, computed: recompute(newGS) }, false, 'drawCard');
      },

      autoDeal: () => {
        const gs = get().gameState;
        const [newDeck, drawn] = engine.drawCard(gs.deck);
        if (!drawn) return;
        const newGS = { ...gs, deck: newDeck };
        set({ gameState: newGS, computed: recompute(newGS) }, false, 'autoDeal');
      },

      selectCard: (cardId) => {
        const gs = get().gameState;
        const newGS = { ...gs, scene: { ...gs.scene, selectedCardId: cardId, activeJoker: null } };
        set({ gameState: newGS, computed: recompute(newGS) }, false, 'selectCard');
      },

      selectJoker: (color) => {
        const gs = get().gameState;
        const newDeck = engine.shuffleTrophyPile(gs.deck);
        const newGS = { ...gs, deck: newDeck, scene: { ...gs.scene, selectedCardId: null, activeJoker: color } };
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
        const newGS = { ...gs, scene: { ...gs.scene, rollMain: d10, rollEffort: d4, modifiedEffort: null } };
        set({ gameState: newGS, computed: recompute(newGS) }, false, 'rollDice');
      },

      applyAptitude: (modifier) => {
        const gs = get().gameState;
        if (gs.scene.rollEffort === null) return;
        const newD4 = engine.applyAptitudeModifier(gs.scene.rollEffort, modifier);
        const newGS = { ...gs, scene: { ...gs.scene, modifiedEffort: newD4 } };
        set({ gameState: newGS, computed: recompute(newGS) }, false, 'applyAptitude');
      },

      useGenrePoint: (newD10) => {
        const gs = get().gameState;
        const activePlayerId = gs.scene.activePlayerId ?? '';
        const afterSpend = engine.spendGenrePoint(gs, activePlayerId);
        const d4 = afterSpend.scene.modifiedEffort ?? afterSpend.scene.rollEffort ?? (1 as engine.D4Result);
        const newTotal = engine.applyGenrePointReroll(newD10, d4);
        const newGS: engine.GameState = {
          ...afterSpend,
          scene: { ...afterSpend.scene, rollMain: newD10, isGenrePointUsed: true },
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

        let newGs: engine.GameState = {
          ...gs, deck: result.newDeck, strikesToAssign: result.newStrikesToAssign,
          weaknessesFound: result.newDeck.weaknessesBySuit.size > gs.weaknessesFound.length
            ? [...gs.weaknessesFound, ...Array.from(result.newDeck.weaknessesBySuit).filter(s => !gs.weaknessesFound.includes(s))]
            : gs.weaknessesFound,
          isGameWon: result.isGameWon, pendingActSetups: result.pendingActSetups,
        };
        if (joker === 'Black') newGs = { ...newGs, isBlackJokerRemoved: true };
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
          turnOrder: engine.markActed(gs.turnOrder, characterId),
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
        const newGs = { ...gs, deck: newDeck, weaknessesFound: weaknesses, isEndgame: weaknesses.length >= 4 };
        set({ gameState: newGs, computed: recompute(newGs) }, false, 'addWeakness');
      },

      killCharacter: (suit) => {
        const gs = get().gameState;
        const chars = gs.characters.map(c => c.id === suit ? { ...c, strikes: 3 as const, isDead: true } : c);
        const newGs = { ...gs, characters: chars, turnOrder: engine.removeFromTurnOrder(gs.turnOrder, suit) };
        set({ gameState: newGs, computed: recompute(newGs) }, false, 'killCharacter');
      },

      // ── Multiplayer (from slice) ──────────────────────────────────────────
      ...createMultiplayerSlice(set, get, recompute),
    }),
    { name: 'NottGame' },
  ),
);
