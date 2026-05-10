/**
 * GamePhaseRouter — renders the correct phase screen based on gameState.phase.
 *
 * Shared between the solo demo (/demo) and multiplayer game (/game/[roomCode]).
 * Both routes render this inside their respective layout shells. Phase screens
 * are pure UI components that read from the Zustand game store; they don't care
 * whether the state is local-only (demo) or synced via Firebase (multiplayer).
 */

'use client';

import { useEffect } from 'react';
import { useGameStore } from '../store/game-store';
import {
  WelcomeScreen,
  GameSetupScreen,
  TrophySetupScreen,
  SceneSetupScreen,
  ConversationStakesScreen,
  ResolutionScreen,
  FalloutScreen,
  WinScreen,
  LoseScreen,
} from './phase-screens/PhaseScreens';

export function GamePhaseRouter() {
  const { gameState } = useGameStore();
  const { phase } = gameState;

  /* Scroll the phase panel to the top whenever the phase changes so the
     phase headline is always visible on entry. */
  useEffect(() => {
    const container = document.querySelector('.game-phase-panel');
    if (container) {
      container.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [phase]);

  const Screen = (() => {
    switch (phase) {
      case 'lobby':
      case 'welcome':             return WelcomeScreen;
      case 'game-setup':          return GameSetupScreen;
      case 'act-setup':           return null; // handled by ActBreakOverlay in GameShell
      case 'trophy-setup':        return TrophySetupScreen;
      case 'scene-setup':         return SceneSetupScreen;
      case 'conversation-stakes': return ConversationStakesScreen;
      case 'resolution':          return ResolutionScreen;
      case 'resolve-scene':       return FalloutScreen;
      case 'fallout':             return FalloutScreen;
      case 'win':                 return WinScreen;
      case 'lose':                return LoseScreen;
      default:                    return WelcomeScreen;
    }
  })();

  if (!Screen) return null;
  return <Screen />;
}
