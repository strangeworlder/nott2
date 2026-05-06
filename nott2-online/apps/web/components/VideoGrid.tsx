/**
 * VideoGrid (`VideoGrid.tsx`)
 *
 * 2×2 grid showing all 4 players' video feeds.
 * Each cell shows: video feed (or avatar), player name + character,
 * mute/camera status icons, connection state indicator,
 * active-player glow border, and strike count overlay.
 *
 * MediaStream objects come from getLocalStreamRef() / getRemoteStreamRef()
 * because they cannot be stored in React state (they're live objects).
 * The component re-renders when Zustand state changes (activeRemoteIds, peerStates)
 * but assigns streams to <video> elements via refs.
 */

'use client';

import { useEffect, useRef } from 'react';
import { useWebRTCStore, getLocalStreamRef, getRemoteStreamRef } from '../store/webrtc-store';
import { useGameStore } from '../store/game-store';
import type { Character } from '@nott2/game-engine';
import { Icon, suitToIconName, Text, Badge } from '@nott2/design-system';

// ── Constants ─────────────────────────────────────────────────────────────────



const CONNECTION_STATE_LABEL: Partial<Record<RTCPeerConnectionState, string>> = {
  connecting: 'Connecting…',
  connected: 'Connected',
  disconnected: 'Disconnected',
  failed: 'Failed',
  closed: 'Closed',
};

const CONNECTION_STATE_VARIANT: Partial<Record<RTCPeerConnectionState, 'success' | 'outline' | 'red'>> = {
  connecting: 'outline',
  connected: 'success',
  disconnected: 'red',
  failed: 'red',
  closed: 'red',
};

// ── VideoCell ─────────────────────────────────────────────────────────────────

interface VideoCellProps {
  playerId: string | null;   // null = this slot is empty
  isLocal: boolean;
  character: Character | null;
  stream: MediaStream | null;
  peerState?: RTCPeerConnectionState;
  isActivePlayer: boolean;
  audioMuted: boolean;
  videoEnabled: boolean;
}

function VideoCell({
  isLocal,
  character,
  stream,
  peerState,
  isActivePlayer,
  audioMuted,
  videoEnabled,
}: VideoCellProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = videoRef.current;
    if (!el || !stream) return;
    el.srcObject = stream;
    el.play().catch(() => {/* autoplay may be blocked — user interaction needed */});
    return () => { el.srcObject = null; };
  }, [stream]);

  const isConnected = peerState === 'connected' || isLocal;
  const stateLabel = isLocal ? null : CONNECTION_STATE_LABEL[peerState ?? 'new'];

  return (
    <div
      className="video-cell"
      data-active={isActivePlayer}
      data-local={isLocal}
      data-connected={isConnected}
    >
      {/* Video / avatar */}
      {stream && videoEnabled ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={isLocal} // local video is always muted in own view (no echo)
          className="video-cell__feed"
        />
      ) : (
        <div className="video-cell__avatar">
          <span className="video-cell__suit">{character ? <Icon name={suitToIconName(character.id)} size={32} /> : '?'}</span>
        </div>
      )}

      {/* Strike overlay */}
      {character && character.strikes > 0 && (
        <div className="video-cell__strikes">
          {Array.from({ length: character.strikes }, (_, i) => (
            <Icon key={i} name="strike_filled" size={14} color="red" />
          ))}
        </div>
      )}

      {/* Connection state badge (non-local only) */}
      {!isLocal && stateLabel && (
        <Badge variant={CONNECTION_STATE_VARIANT[peerState ?? 'new'] ?? 'outline'}>
          {stateLabel}
        </Badge>
      )}

      {/* Footer: name + icons */}
      <div className="video-cell__footer">
        <Text variant="label" as="span" className="video-cell__name">
          {character?.name ?? 'Empty'}
        </Text>
        <div className="video-cell__icons">
          {audioMuted  && <span title="Muted"><Icon name="mic_off" size={16} /></span>}
          {!audioMuted && <span title="Audio on"><Icon name="mic" size={16} /></span>}
          {videoEnabled  ? <span title="Camera on"><Icon name="videocam" size={16} /></span> : <span title="Camera off"><Icon name="videocam_off" size={16} /></span>}
        </div>
      </div>

      {/* Connection dot */}
      <div className={`video-cell__dot ${isConnected ? 'video-cell__dot--on' : 'video-cell__dot--off'}`} />
    </div>
  );
}

// ── VideoGrid ─────────────────────────────────────────────────────────────────

export default function VideoGrid() {
  const { hasLocalMedia, peerStates, activeRemoteIds, audioMuted, videoEnabled } = useWebRTCStore();
  const { gameState, playerId: localPlayerId } = useGameStore();

  const { characters, scene } = gameState;
  const activePlayerId = scene.activePlayerId;

  // Slot ordering: Spades, Hearts, Clubs, Diamonds
  const slots = characters.map(char => {
    const player = gameState.players.find(p => p.characterId === char.id);
    const isLocal = player?.id === localPlayerId;
    const isActivePlayer = player?.id === activePlayerId;

    let stream: MediaStream | null = null;
    if (isLocal) {
      stream = hasLocalMedia ? getLocalStreamRef() : null;
    } else if (player && activeRemoteIds.includes(player.id)) {
      stream = getRemoteStreamRef(player.id) ?? null;
    }

    const peerState = player && !isLocal ? peerStates[player.id] : undefined;

    return {
      playerId: player?.id ?? null,
      isLocal,
      character: char,
      stream,
      peerState,
      isActivePlayer,
    };
  });

  return (
    <div className="video-grid">
      {slots.map((slot, i) => (
        <VideoCell
          key={slot.character.id}
          {...slot}
          audioMuted={slot.isLocal ? audioMuted : false /* remote mute tracked separately */}
          videoEnabled={slot.isLocal ? videoEnabled : !!slot.stream}
        />
      ))}
    </div>
  );
}
