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

import { useEffect, useRef, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useGameStore } from '../../store/game-store';
import { useWebRTCStore, getLocalStreamRef } from '../../store/webrtc-store';
import {
  darkTheme, PlayerAvatar, Card, Button, ActionFooter, TextField, TabBar,
  Icon, suitToIconName,
} from '@nott2/design-system';
import '../demo/demo.css';
import './lobby.css';


const SUIT_LABEL: Record<string, string> = {
  Spades: 'The Power', Hearts: 'The Resolve', Clubs: 'The Intellect', Diamonds: 'The Finesse',
};

// ── Sub-components ──────────────────────────────────────────────

function CreateForm({ onCreated }: { onCreated: () => void }) {
  const { createRoom, multiplayerError } = useGameStore() as any;
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  // Check if user has a Discord session (for host gating)
  const [session, setSession] = useState<any>(null);
  const [sessionChecked, setSessionChecked] = useState(false);
  const [authRequired, setAuthRequired] = useState(false);

  useEffect(() => {
    // Probe the session endpoint — if it returns a discordId, user is authed.
    // If it returns empty or fails, check if Discord auth is even configured.
    fetch('/api/auth/session')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        setSession(data?.user?.discordId ? data : null);
        // If we got a valid response but no Discord session, auth may be required.
        // The server will set a header or we infer from the providers endpoint.
        setSessionChecked(true);
      })
      .catch(() => {
        setSessionChecked(true); // No session endpoint = dev mode, proceed
      });

    // Check if Discord auth is configured by probing providers
    fetch('/api/auth/providers')
      .then(r => r.ok ? r.json() : null)
      .then(providers => {
        if (providers?.discord) {
          setAuthRequired(true);
        }
      })
      .catch(() => {}); // No providers = dev mode
  }, []);

  const handleCreate = async () => {
    if (!name.trim()) return;
    setLoading(true);
    try {
      await createRoom(name.trim());
      onCreated();
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while checking session
  if (!sessionChecked) {
    return (
      <Card title="Create a Game">
        <div className="lobby-form">
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', textAlign: 'center' }}>
            Checking authentication…
          </p>
        </div>
      </Card>
    );
  }

  // Discord auth is configured but user hasn't signed in → show sign-in prompt
  if (authRequired && !session) {
    return (
      <Card title="Create a Game">
        <div className="lobby-form" style={{ gap: 16 }}>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', lineHeight: 1.6 }}>
            To host a game, you need to verify your subscription by signing in with Discord.
          </p>
          <Button
            variant="primary"
            onClick={() => window.location.href = '/auth/signin'}
          >
            <Icon name="login" size={20} />
            Sign in with Discord
          </Button>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', textAlign: 'center' }}>
            Players joining a game don't need to sign in — use the "Join Game" tab.
          </p>
        </div>
      </Card>
    );
  }

  // Authenticated (Discord or dev mode) → show the create form
  return (
    <Card title="Create a Game">
      <div className="lobby-form">
        {session && (
          <div style={{
            padding: '8px 12px', borderRadius: 6, marginBottom: 8,
            background: 'rgba(88, 101, 242, 0.08)',
            border: '1px solid rgba(88, 101, 242, 0.2)',
            fontSize: '0.8rem', color: 'var(--color-text-muted)',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <Icon name="check_circle" size={16} />
            Signed in as <strong style={{ color: 'var(--color-text)' }}>{session.user.discordName ?? session.user.name}</strong>
          </div>
        )}
        <TextField
          id="create-name"
          label="Your Name"
          value={name}
          onChange={setName}
          onKeyDown={e => e.key === 'Enter' && handleCreate()}
          placeholder="Enter your name"
          maxLength={24}
          autoFocus
          error={multiplayerError || undefined}
          helperText="A 6-character room code will be generated. Share it with your players."
        />
        <Button
          variant="primary"
          onClick={handleCreate}
          disabled={!name.trim() || loading}
        >
          {loading ? 'Creating…' : 'Create Game →'}
        </Button>
      </div>
    </Card>
  );
}

function JoinForm({ onJoined }: { onJoined: () => void }) {
  const { joinRoom, multiplayerError } = useGameStore() as any;
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleJoin = async () => {
    if (!name.trim() || code.length < 4) return;
    setLoading(true);
    try {
      await joinRoom(code.toUpperCase().trim(), name.trim());
      onJoined();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Join a Game">
      <div className="lobby-form">
        <TextField
          id="join-code"
          label="Room Code"
          value={code}
          onChange={v => setCode(v.toUpperCase().slice(0, 6))}
          placeholder="XXXXXX"
          maxLength={6}
          autoFocus
        />
        <TextField
          id="join-name"
          label="Your Name"
          value={name}
          onChange={setName}
          onKeyDown={e => e.key === 'Enter' && handleJoin()}
          placeholder="Enter your name"
          maxLength={24}
          error={multiplayerError || undefined}
        />
        <Button
          variant="primary"
          onClick={handleJoin}
          disabled={!name.trim() || code.length < 4 || loading}
        >
          {loading ? 'Joining…' : 'Join Game →'}
        </Button>
      </div>
    </Card>
  );
}

function WaitingRoom() {
  const store = useGameStore() as any;
  const router = useRouter();
  const { roomCode, isHost, remotePlayers = [], playerName, leaveRoom } = store;
  const webrtc = useWebRTCStore();
  const localVideoRef = useRef<HTMLVideoElement>(null);

  // Start local media for video preview
  useEffect(() => {
    if (!webrtc.hasLocalMedia) {
      webrtc.initMedia({ audio: true, video: true });
    }
  }, []);

  // Attach local stream to preview video element
  useEffect(() => {
    const el = localVideoRef.current;
    if (!el || !webrtc.hasLocalMedia) return;
    const stream = getLocalStreamRef();
    if (stream) {
      el.srcObject = stream;
      el.play().catch(() => {});
    }
    return () => { if (el) el.srcObject = null; };
  }, [webrtc.hasLocalMedia]);

  const copyCode = () => {
    navigator.clipboard.writeText(roomCode ?? '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStart = () => {
    router.push(`/game/${roomCode}`);
  };

  const handleLeave = async () => {
    await leaveRoom?.();
    router.push('/lobby');
  };

  const seats = [0, 1, 2, 3];
  const suitOrder = ['Spades', 'Hearts', 'Clubs', 'Diamonds'];
  const [copied, setCopied] = useState(false);

  return (
    <div className="waiting-room">
      {/* Room code banner */}
      <div className="room-code-banner">
        <div className="room-code-banner__label">Room Code</div>
        <div className="room-code-banner__code">{roomCode}</div>
        <button className="room-code-banner__copy" onClick={copyCode}>
          {copied ? '✔ Copied' : 'Copy'}
        </button>
      </div>

      <div className="waiting-layout">
        {/* Player seats */}
        <div className="waiting-left">
          <Card title={`Players (${remotePlayers.length}/4)`}>
            <div className="seat-list">
              {seats.map(i => {
                const suit = suitOrder[i];
                const player = remotePlayers[i];
                return (
                  <div key={i} className={`seat ${player ? 'seat--filled' : 'seat--empty'}`}>
                    {player ? (
                      <div className="seat__player">
                        <PlayerAvatar
                          name={player.name ?? '???'}
                          suit={suit}
                          characterName={SUIT_LABEL[suit]}
                          isConnected={true}
                          isActivePlayer={player.name === playerName}
                          size="sm"
                        />
                        <div className="seat__meta">
                          {player.isHost && <span className="seat__badge seat__badge--host">Host</span>}
                          {player.ready
                            ? <span className="seat__badge seat__badge--ready">Ready</span>
                            : <span className="seat__badge seat__badge--waiting">Waiting</span>}
                        </div>
                      </div>
                    ) : (
                      <div className="seat__empty-label"><Icon name={suitToIconName(suit)} size={16} /> Empty</div>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Video preview */}
        <div className="waiting-right">
          <Card title="Your Preview">
            <div className="video-preview">
              {webrtc.hasLocalMedia && webrtc.videoEnabled ? (
                <video
                  ref={localVideoRef}
                  className="video-preview__feed"
                  autoPlay
                  playsInline
                  muted
                />
              ) : (
                <div className="video-preview__placeholder">
                  <span style={{ fontSize: '2rem' }}><Icon name="videocam" size={32} /></span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                    {webrtc.mediaError ? 'Camera unavailable' : 'Starting camera…'}
                  </span>
                </div>
              )}
            </div>
            <div className="video-controls">
              <button
                className={`video-ctrl-btn ${webrtc.audioMuted ? 'video-ctrl-btn--off' : ''}`}
                onClick={webrtc.toggleAudio}
              >
                {webrtc.audioMuted ? <Icon name="mic_off" size={20} /> : <Icon name="mic" size={20} />}
              </button>
              <button
                className={`video-ctrl-btn ${!webrtc.videoEnabled ? 'video-ctrl-btn--off' : ''}`}
                onClick={webrtc.toggleVideo}
              >
                {webrtc.videoEnabled ? <Icon name="videocam" size={20} /> : <Icon name="videocam_off" size={20} />}
              </button>
            </div>
            <div style={{ marginTop: 12 }}>
              <TextField
                label="Your Name"
                value={playerName ?? ''}
                onChange={() => {}}
                disabled
              />
            </div>
          </Card>
        </div>
      </div>

      {/* Actions */}
      <div className="waiting-actions">
        {isHost ? (
          <ActionFooter
            label={`Start Game ${remotePlayers.length < 2 ? '(need ≥ 2 players)' : '→'}`}
            disabled={remotePlayers.length < 2}
            hint={remotePlayers.length < 2 ? 'Share the room code to invite players' : 'All players will be sent to the game'}
            onClick={handleStart}
          />
        ) : (
          <p className="text-muted" style={{ textAlign: 'center', fontSize: '0.875rem' }}>
            Waiting for the host to start the game…
          </p>
        )}
        <Button variant="ghost" size="sm" onClick={handleLeave}>
          Leave Room
        </Button>
      </div>
    </div>
  );
}

// ── Main Page ───────────────────────────────────────────────────

export default function LobbyPage() {
  const searchParams = useSearchParams();
  const isJoining = searchParams.get('join') === 'true';
  const store = useGameStore() as any;
  const { roomCode, initMultiplayer } = store;

  const [activeTab, setActiveTab] = useState<'create' | 'join'>(isJoining ? 'join' : 'create');
  const [inRoom, setInRoom] = useState(!!roomCode);

  useEffect(() => {
    // Initialize Firebase if not already done
    initMultiplayer?.();
  }, []);

  useEffect(() => {
    if (roomCode) setInRoom(true);
  }, [roomCode]);

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
          <h1 className="lobby-title">Night of the Thirteenth 2</h1>
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

        <p className="lobby-demo-link">
          Want to play solo? <a href="/demo">Try the demo mode</a>
        </p>
      </div>
    </div>
  );
}
