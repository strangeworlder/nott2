/**
 * WebRTC Store Slice (`webrtc-store.ts`)
 *
 * Manages: local media stream, remote streams, peer connection states,
 * audio/video toggle, and the PeerManager lifecycle.
 *
 * Usage:
 *   1. Call initMedia() when entering lobby (prompts for camera/mic)
 *   2. Call connectToPeers(playerIds) when game starts
 *   3. toggleAudio() / toggleVideo() for mute controls
 *   4. disconnectAll() when leaving the room
 *
 * All MediaStream objects are stored as refs/state OUTSIDE Zustand proper
 * (MediaStream is not serializable and causes React issues if stored directly).
 * Zustand stores a WeakRef-compatible reference; components use the shared
 * PeerManager singleton to access streams.
 */

'use client';

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { PeerManager, DEFAULT_RTC_CONFIG } from '@nott2/multiplayer';
import { getLocalMedia, setAudioMuted, setVideoEnabled, stopStream } from '@nott2/multiplayer';
import type { PeerStateCallback, RemoteStreamCallback } from '@nott2/multiplayer';

// ── The PeerManager singleton (lives outside React/Zustand) ──────────────────
// MediaStream objects can't be stored directly in Zustand (not serializable).
// We keep the PeerManager instance here and expose only primitive status to store.

let _peerManager: PeerManager | null = null;
let _localStreamRef: MediaStream | null = null;
// Map<playerId, MediaStream> — consumers read via getPeerManager()
const _remoteStreamsRef = new Map<string, MediaStream>();

export function getPeerManager(): PeerManager | null {
  return _peerManager;
}

export function getLocalStreamRef(): MediaStream | null {
  return _localStreamRef;
}

export function getRemoteStreamRef(playerId: string): MediaStream | undefined {
  return _remoteStreamsRef.get(playerId);
}

// ── Store interface ───────────────────────────────────────────────────────────

export interface WebRTCState {
  // Status flags (primitive — safe to store in Zustand)
  hasLocalMedia: boolean;
  hasVideo: boolean;
  hasAudio: boolean;
  audioMuted: boolean;
  videoEnabled: boolean;
  mediaError: string | null;

  /** Map of remotePlayerId → connection state  */
  peerStates: Record<string, RTCPeerConnectionState>;

  /** Set of remote player IDs that have a live stream */
  activeRemoteIds: string[];

  // Actions
  initMedia: (constraints?: { audio: boolean; video: boolean }) => Promise<void>;
  initPeerManager: (playerId: string, roomCode: string) => void;
  connectToPeers: (playerIds: string[]) => Promise<void>;
  disconnectFromPeer: (playerId: string) => Promise<void>;
  toggleAudio: () => void;
  toggleVideo: () => void;
  disconnectAll: () => void;
}

// ── Store ─────────────────────────────────────────────────────────────────────

export const useWebRTCStore = create<WebRTCState>()(
  devtools(
    (set, get) => ({
      hasLocalMedia: false,
      hasVideo: false,
      hasAudio: false,
      audioMuted: false,
      videoEnabled: true,
      mediaError: null,
      peerStates: {},
      activeRemoteIds: [],

      /**
       * Acquire local camera + microphone.
       * Falls back to audio-only if camera fails.
       */
      initMedia: async (constraints = { audio: true, video: true }) => {
        set({ mediaError: null }, false, 'initMedia/start');
        try {
          const result = await getLocalMedia(constraints);
          _localStreamRef = result.stream;
          set({
            hasLocalMedia: true,
            hasAudio: result.hasAudio,
            hasVideo: result.hasVideo,
          }, false, 'initMedia/success');

          // Give stream to peer manager if already initialized
          _peerManager?.setLocalStream(result.stream);
        } catch (err) {
          const msg = err instanceof Error ? err.message : 'Failed to access camera/mic.';
          set({ mediaError: msg, hasLocalMedia: false }, false, 'initMedia/error');
        }
      },

      /**
       * Initialize (or reinitialize) the PeerManager for a room.
       * Call this after joinRoom() / createRoom().
       */
      initPeerManager: (playerId, roomCode) => {
        // Clean up any existing manager
        _peerManager?.disconnectAll();

        _peerManager = new PeerManager({
          playerId,
          roomCode,
          config: DEFAULT_RTC_CONFIG,

          onRemoteStream: (pid, stream) => {
            _remoteStreamsRef.set(pid, stream);
            set(s => ({
              activeRemoteIds: [...new Set([...s.activeRemoteIds, pid])],
            }), false, `peerManager/remoteStream/${pid}`);
          },

          onPeerStateChange: (pid, state) => {
            set(s => ({
              peerStates: { ...s.peerStates, [pid]: state },
            }), false, `peerManager/stateChange/${pid}`);
          },

          onPeerDisconnected: (pid) => {
            _remoteStreamsRef.delete(pid);
            set(s => ({
              activeRemoteIds: s.activeRemoteIds.filter(id => id !== pid),
              peerStates: { ...s.peerStates, [pid]: 'disconnected' as RTCPeerConnectionState },
            }), false, `peerManager/disconnected/${pid}`);
          },
        });

        // Attach local stream if already acquired
        if (_localStreamRef) {
          _peerManager.setLocalStream(_localStreamRef);
        }
      },

      /**
       * Connect to a list of remote peer IDs.
       * Typically called once all players have joined the room.
       */
      connectToPeers: async (playerIds) => {
        if (!_peerManager) {
          console.warn('[WebRTC] connectToPeers called before initPeerManager');
          return;
        }
        await Promise.allSettled(playerIds.map(id => _peerManager!.connectToPeer(id)));
      },

      disconnectFromPeer: async (playerId) => {
        await _peerManager?.disconnectFromPeer(playerId);
      },

      /** Mute/unmute local audio */
      toggleAudio: () => {
        const muted = !get().audioMuted;
        if (_localStreamRef) setAudioMuted(_localStreamRef, muted);
        _peerManager?.toggleAudio(muted);
        set({ audioMuted: muted }, false, 'toggleAudio');
      },

      /** Enable/disable local video */
      toggleVideo: () => {
        const enabled = !get().videoEnabled;
        if (_localStreamRef) setVideoEnabled(_localStreamRef, enabled);
        _peerManager?.toggleVideo(enabled);
        set({ videoEnabled: enabled }, false, 'toggleVideo');
      },

      /** Disconnect from all peers and stop local media */
      disconnectAll: () => {
        _peerManager?.disconnectAll();
        _peerManager = null;

        if (_localStreamRef) {
          stopStream(_localStreamRef);
          _localStreamRef = null;
        }

        _remoteStreamsRef.clear();

        set({
          hasLocalMedia: false,
          hasAudio: false,
          hasVideo: false,
          peerStates: {},
          activeRemoteIds: [],
          mediaError: null,
        }, false, 'disconnectAll');
      },
    }),
    { name: 'NottWebRTC' },
  ),
);
