/**
 * Game Page — /game/[roomCode]
 *
 * The main multiplayer gameplay surface. Joins the room specified in the
 * URL and renders the shared GameShell with the video + chat sidebar.
 *
 * Layout is identical to /demo — same GameShell, same game board, same
 * phase screens, same character bar. The only differences:
 * - Firebase room joining + presence
 * - VideoGrid + ChatPanel in the sidebar
 * - Room code displayed in the header
 */

'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ChatPanel } from '@nott2/design-system';
import { useGameStore } from '../../../store/game-store';
import { useWebRTCStore } from '../../../store/webrtc-store';
import VideoGrid from '../../../components/VideoGrid';
import { GameShell } from '../../../components/GameShell';
import type { ChatMessage } from '@nott2/design-system';
import '../../demo/demo.css';
import './game.css';

// ── Chat Bridge ─────────────────────────────────────────────────
// Converts game log entries to ChatMessage[] for the DS ChatPanel.

function useChatMessages() {
  const { gameState } = useGameStore();
  const chatLog: ChatMessage[] = (gameState as any).chatLog ?? [];
  return chatLog;
}

// ── Multiplayer Sidebar ─────────────────────────────────────────

function MultiplayerSidebar() {
  const store = useGameStore() as any;
  const messages = useChatMessages();

  const handleSendChat = (text: string) => {
    store.sendChatMessage?.(text);
  };

  return (
    <>
      <div className="game-sidebar__video">
        <VideoGrid />
      </div>
      <div className="game-sidebar__chat">
        <ChatPanel
          messages={messages}
          currentPlayerId={store.playerId ?? ''}
          onSend={handleSendChat}
        />
      </div>
    </>
  );
}

// ── Main Page ───────────────────────────────────────────────────

export default function GamePage() {
  const params = useParams<{ roomCode: string }>();
  const router = useRouter();
  const { roomCode } = params;

  const store = useGameStore() as any;
  const {
    fullReset,
    playerId, roomCode: storeRoomCode,
    initMultiplayer, joinRoom,
  } = store;

  // Auto-join the room from URL if we're not already in it
  useEffect(() => {
    if (storeRoomCode === roomCode) return; // already in this room
    const join = async () => {
      await initMultiplayer?.();
      // If we have no name, redirect to lobby
      if (!store.playerName) {
        router.replace(`/lobby?join=true&code=${roomCode}`);
        return;
      }
      await joinRoom?.(roomCode, store.playerName);
    };
    join();
  }, [roomCode]);

  const handleReset = () => {
    fullReset();
    router.push('/');
  };

  return (
    <GameShell
      mode="multiplayer"
      roomCode={roomCode}
      onReset={handleReset}
      sidebar={<MultiplayerSidebar />}
    />
  );
}
