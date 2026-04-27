/**
 * GamePhaseRouter — renders the correct phase screen based on gameState.phase.
 *
 * Shared between the solo demo (/demo) and multiplayer game (/game/[roomCode]).
 * Both routes render this inside their respective layout shells. Phase screens
 * are pure UI components that read from the Zustand game store; they don't care
 * whether the state is local-only (demo) or synced via Firebase (multiplayer).
 */

'use client';

import { useGameStore } from '../store/game-store';
import {
  WelcomeScreen,
  GameSetupScreen,
  ActSetupScreen,
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

  const Screen = (() => {
    switch (phase) {
      case 'lobby':
      case 'welcome':             return WelcomeScreen;
      case 'game-setup':          return GameSetupScreen;
      case 'act-setup':           return ActSetupScreen;
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

  return <Screen />;
}
