/**
 * Lobby Page — /lobby
 *
 * Client-side. Two flows share this page:
 * - ?join=true  → show Join form first (enter room code)
 * - (default)   → show Create form first (host creates room)
 *
 * After joining/creating the player waits in a shared waiting room
 * that shows all connected players. Host sees a "Start Game" button
 * when all players are ready (or can force-start).
 */

'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useGameStore } from '../../store/game-store';
import { darkTheme, TabBar, Text } from '@nott2/design-system';
import '../demo/demo.css';
import './lobby.css';

import { CreateForm } from './CreateForm';
import { JoinForm } from './JoinForm';
import { WaitingRoom } from './WaitingRoom';

export default function LobbyPage() {
  const searchParams = useSearchParams();
  const isJoining = searchParams.get('join') === 'true';
  const store = useGameStore() as any;
  const { roomCode, initMultiplayer } = store;

  const [activeTab, setActiveTab] = useState<'create' | 'join'>(isJoining ? 'join' : 'create');
  const [inRoom, setInRoom] = useState(!!roomCode);

  useEffect(() => { initMultiplayer?.(); }, []);

  useEffect(() => { if (roomCode) setInRoom(true); }, [roomCode]);

  if (inRoom && roomCode) {
    return (
      <div className={`lobby-page ${darkTheme}`}>
        <WaitingRoom />
      </div>
    );
  }

  return (
    <div className={`lobby-page ${darkTheme}`}>
      <div className="lobby-inner">
        <div className="lobby-header">
          <a href="/" className="lobby-back">← Back</a>
          <Text variant="h1" className="lobby-title">Night of the Thirteenth 2</Text>
        </div>

        <TabBar
          tabs={[
            { id: 'create', label: 'Create Game' },
            { id: 'join',   label: 'Join Game' },
          ]}
          activeTab={activeTab}
          onTabChange={(id) => setActiveTab(id as 'create' | 'join')}
        />

        {activeTab === 'create' ? (
          <CreateForm onCreated={() => setInRoom(true)} />
        ) : (
          <JoinForm onJoined={() => setInRoom(true)} />
        )}

        <Text variant="caption" color="muted" className="lobby-demo-link">
          Want to play solo? <a href="/demo">Try the demo mode</a>
        </Text>
      </div>
    </div>
  );
}
