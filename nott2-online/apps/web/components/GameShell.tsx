/**
 * GameShell — Shared layout component for the game surface.
 *
 * Philosophical: The GameShell is the "theater" — the physical space where the
 * horror unfolds. The game board sidebar has been absorbed into the CardMatt
 * area (VisibleThreatsZone), so the layout is now simpler: a phase-driven
 * narrative panel in the center, a sidebar for context (debug tools in solo,
 * video + chat in multiplayer) on the right, and the ever-present character
 * bar at the bottom.
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

import { darkTheme, Header, TransitionOverlay, DoomClockTransition, ActBreakOverlay } from '@nott2/design-system';
import { useGameStore } from '../store/game-store';
import { GamePhaseRouter } from './GamePhaseRouter';
import CharacterBar from './CharacterBar';
import DebugPanel from './DebugPanel';
import { TransitionProvider, useTransitionContext } from '../contexts/TransitionContext';
import { CardDealProvider } from '../contexts/CardDealContext';
import { useCardDealBridge } from '../hooks/useCardDealBridge';
import { VisibleThreatsZone } from './VisibleThreatsZone';

interface GameShellProps {
  mode: 'solo' | 'multiplayer';
  roomCode?: string;
  /** Optional sidebar content — multiplayer passes VideoGrid + ChatPanel here */
  sidebar?: React.ReactNode;
  /** Reset handler — defaults to store's fullReset */
  onReset?: () => void;
}

export function GameShell({ mode, roomCode, sidebar, onReset }: GameShellProps) {
  return (
    <TransitionProvider>
      <CardDealProvider>
        <GameShellInner mode={mode} roomCode={roomCode} sidebar={sidebar} onReset={onReset} />
      </CardDealProvider>
    </TransitionProvider>
  );
}

function GameShellInner({ mode, roomCode, sidebar, onReset }: GameShellProps) {
  const { gameState, fullReset, nextPhase } = useGameStore() as any;
  const { phase, currentAct, isEndgame } = gameState;
  const { transition, clearTransition, fireMidpoint } = useTransitionContext();
  const { CardOverlayPortal } = useCardDealBridge();

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

      {/* Main game surface — two-column layout */}
      <div className="game-layout" role="main" aria-label="Game surface">
        {/* Center: persistent card matt + phase panel */}
        <div className="game-main">
          {/* Persistent card matt — survives phase transitions */}
          <VisibleThreatsZone />

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

      {/* 3D card deal overlay — above game surface, below transitions */}
      {CardOverlayPortal}

      {/* Transition overlay — rendered via portal above everything */}
      <TransitionOverlay
        visible={transition !== null}
        onDismiss={clearTransition}
        onExited={clearTransition}
        themeClass={darkTheme}
      >
        {transition?.type === 'doom-clock-tick' && (
          <DoomClockTransition
            from={transition.from}
            to={transition.to}
            onClockArrived={fireMidpoint}
            onComplete={clearTransition}
          />
        )}
        {transition?.type === 'doom-clock-break' && (
          <DoomClockTransition
            from={transition.from}
            to={transition.to}
            isBroken
            onClockArrived={fireMidpoint}
            onComplete={clearTransition}
          />
        )}
      </TransitionOverlay>

      {/* Act break overlay — z-index 15000, fires above everything */}
      <ActBreakOverlay
        visible={phase === 'act-setup'}
        act={isEndgame ? 'finale' : currentAct === 1 ? 'prologue' : (currentAct as 2 | 3)}
        onDismiss={nextPhase}
        onExited={() => {}}
        themeClass={darkTheme}
      />
    </div>
  );
}
