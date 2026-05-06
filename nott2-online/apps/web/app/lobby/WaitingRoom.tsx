/**
 * WaitingRoom — Shared waiting room with player seats and video preview.
 */

'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGameStore } from '../../store/game-store';
import { useWebRTCStore, getLocalStreamRef } from '../../store/webrtc-store';
import {
  PlayerAvatar, Card, Button, ActionFooter, TextField, Icon, suitToIconName, Text, Badge,
} from '@nott2/design-system';

const SUIT_LABEL: Record<string, string> = {
  Spades: 'The Power', Hearts: 'The Resolve', Clubs: 'The Intellect', Diamonds: 'The Finesse',
};

export function WaitingRoom() {
  const store = useGameStore() as any;
  const router = useRouter();
  const { roomCode, isHost, remotePlayers = [], playerName, leaveRoom } = store;
  const webrtc = useWebRTCStore();
  const localVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => { if (!webrtc.hasLocalMedia) webrtc.initMedia({ audio: true, video: true }); }, []);

  useEffect(() => {
    const el = localVideoRef.current;
    if (!el || !webrtc.hasLocalMedia) return;
    const stream = getLocalStreamRef();
    if (stream) { el.srcObject = stream; el.play().catch(() => {}); }
    return () => { if (el) el.srcObject = null; };
  }, [webrtc.hasLocalMedia]);

  const copyCode = () => { navigator.clipboard.writeText(roomCode ?? ''); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  const handleStart = () => { router.push(`/game/${roomCode}`); };
  const handleLeave = async () => { await leaveRoom?.(); router.push('/lobby'); };
  const seats = [0, 1, 2, 3];
  const suitOrder = ['Spades', 'Hearts', 'Clubs', 'Diamonds'];
  const [copied, setCopied] = useState(false);

  return (
    <div className="waiting-room">
      <div className="room-code-banner">
        <Text variant="label" as="div" className="room-code-banner__label" color="muted">Room Code</Text>
        <Text variant="h2" as="div" className="room-code-banner__code">{roomCode}</Text>
        <button className="room-code-banner__copy" onClick={copyCode}>{copied ? <><Icon name="check" size={14} /> Copied</> : 'Copy'}</button>
      </div>

      <div className="waiting-layout">
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
                        <PlayerAvatar name={player.name ?? '???'} suit={suit} characterName={SUIT_LABEL[suit]}
                          isConnected={true} isActivePlayer={player.name === playerName} size="sm" />
                        <div className="seat__meta">
                          {player.isHost && <Badge variant="red">Host</Badge>}
                          {player.ready
                            ? <Badge variant="success">Ready</Badge>
                            : <Badge variant="outline">Waiting</Badge>}
                        </div>
                      </div>
                    ) : (
                      <Text variant="label" as="div" color="muted" className="seat__empty-label"><Icon name={suitToIconName(suit)} size={16} /> Empty</Text>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        <div className="waiting-right">
          <Card title="Your Preview">
            <div className="video-preview">
              {webrtc.hasLocalMedia && webrtc.videoEnabled ? (
                <video ref={localVideoRef} className="video-preview__feed" autoPlay playsInline muted />
              ) : (
                <div className="video-preview__placeholder">
                  <span style={{ fontSize: '2rem' }}><Icon name="videocam" size={32} /></span>
                  <Text variant="caption" color="muted" as="span">
                    {webrtc.mediaError ? 'Camera unavailable' : 'Starting camera…'}
                  </Text>
                </div>
              )}
            </div>
            <div className="video-controls">
              <button className={`video-ctrl-btn ${webrtc.audioMuted ? 'video-ctrl-btn--off' : ''}`} onClick={webrtc.toggleAudio}>
                {webrtc.audioMuted ? <Icon name="mic_off" size={20} /> : <Icon name="mic" size={20} />}
              </button>
              <button className={`video-ctrl-btn ${!webrtc.videoEnabled ? 'video-ctrl-btn--off' : ''}`} onClick={webrtc.toggleVideo}>
                {webrtc.videoEnabled ? <Icon name="videocam" size={20} /> : <Icon name="videocam_off" size={20} />}
              </button>
            </div>
            <div style={{ marginTop: 12 }}>
              <TextField label="Your Name" value={playerName ?? ''} onChange={() => {}} disabled />
            </div>
          </Card>
        </div>
      </div>

      <div className="waiting-actions">
        {isHost ? (
          <ActionFooter
            label={`Start Game ${remotePlayers.length < 2 ? '(need ≥ 2 players)' : '→'}`}
            disabled={remotePlayers.length < 2}
            hint={remotePlayers.length < 2 ? 'Share the room code to invite players' : 'All players will be sent to the game'}
            onClick={handleStart} />
        ) : (
          <Text variant="caption" color="muted" align="center">Waiting for the host to start the game…</Text>
        )}
        <Button variant="ghost" size="sm" onClick={handleLeave}>Leave Room</Button>
      </div>
    </div>
  );
}
