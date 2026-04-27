/**
 * GameShell — Shared layout component for the game surface.
 *
 * Philosophical: The GameShell is the "theater" — the physical space where the
 * horror unfolds. Whether you're playing solo or with three friends online, the
 * stage is identical: a game board sidebar on the left showing the physical card
 * state, the phase-driven narrative panel in the center, a sidebar for context
 * (debug tools in solo, video + chat in multiplayer) on the right, and the
 * ever-present character bar at the bottom reminding you who's still alive.
 *
 * Technical: Accepts a `mode` prop ('solo' | 'multiplayer') to control which
 * sidebar content is rendered and whether multiplayer-specific features (video,
 * chat) are shown. Both /demo and /game/[roomCode] routes render this as their
 * primary layout, ensuring pixel-perfect parity.
 *
 * Props:
 *   mode       'solo' | 'multiplayer' — controls sidebar content
 *   roomCode   string | undefined — room code for multiplayer header display
 *   sidebar    ReactNode | undefined — custom sidebar content (multiplayer injects VideoGrid + ChatPanel)
 *   onReset    () => void — reset handler for the header
 */

'use client';

import { darkTheme, Header } from '@nott2/design-system';
import { useGameStore } from '../store/game-store';
import { GameBoardPanel } from './GameBoardPanel';
import { GamePhaseRouter } from './GamePhaseRouter';
import CharacterBar from './CharacterBar';
import DebugPanel from './DebugPanel';

interface GameShellProps {
  mode: 'solo' | 'multiplayer';
  roomCode?: string;
  /** Optional sidebar content — multiplayer passes VideoGrid + ChatPanel here */
  sidebar?: React.ReactNode;
  /** Reset handler — defaults to store's fullReset */
  onReset?: () => void;
}

export function GameShell({ mode, roomCode, sidebar, onReset }: GameShellProps) {
  const { gameState, fullReset } = useGameStore();
  const { phase, currentAct, isEndgame } = gameState;

  const handleReset = onReset ?? fullReset;

  return (
    <div className={`game-page ${darkTheme}`}>
      {/* Sticky header */}
      <Header
        act={currentAct as 1 | 2 | 3}
        phase={phase}
        isEndgame={isEndgame}
        roomCode={roomCode}
        onReset={handleReset}
      />

      {/* Main game surface — three-column layout */}
      <div className="game-layout" role="main" aria-label="Game surface">
        {/* Left sidebar: persistent game board (table state) */}
        <aside className="game-board-sidebar" aria-label="Game board">
          <GameBoardPanel />
        </aside>

        {/* Center: phase panel (actions & decisions) */}
        <div className="game-main">
          <div
            className="game-phase-panel"
            aria-live="polite"
            aria-atomic="false"
            aria-label="Current phase"
          >
            <GamePhaseRouter />
          </div>
        </div>

        {/* Right sidebar */}
        <aside className="game-sidebar" aria-label={mode === 'multiplayer' ? 'Video and chat' : 'Debug panel'}>
          {sidebar ?? (
            /* Solo mode: debug panel fills the sidebar */
            <div className="game-sidebar__debug">
              <DebugPanel />
            </div>
          )}
        </aside>
      </div>

      {/* Persistent character bar */}
      <CharacterBar />
    </div>
  );
}
