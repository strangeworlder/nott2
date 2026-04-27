/**
 * PeerManager (`peer-manager.ts`)
 *
 * Manages the full mesh of RTCPeerConnections for a 4-player game.
 * 4 players = 6 bidirectional peer connections.
 *
 * Responsibilities:
 *   - Maintain a Map<remotePlayerId, RTCPeerConnection>
 *   - Add local media tracks to each connection
 *   - Run the offer/answer/ICE exchange via signaling.ts
 *   - Expose remote streams via onRemoteStream callback
 *   - Report connection state changes
 *   - Handle track replacement (e.g. switching camera)
 *   - Graceful full cleanup on leave
 *
 * ICE configuration:
 *   Google STUN servers (dev). TURN credentials injected via config for prod.
 *
 * Caller determination:
 *   isCaller(localId, remoteId) — lower UID creates the offer.
 *   This prevents offer glare when both sides join simultaneously.
 */

import {
  writeOffer,
  writeAnswer,
  writeCandidate,
  subscribeToOffer,
  subscribeToAnswer,
  subscribeToCandidates,
  clearSignalingChannel,
  isCaller,
} from './signaling';
import type { Unsubscribe } from 'firebase/database';

// ── ICE Config ────────────────────────────────────────────────────────────────

export const DEFAULT_RTC_CONFIG: RTCConfiguration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
  ],
  iceCandidatePoolSize: 10,
};

// ── Types ─────────────────────────────────────────────────────────────────────

export type PeerStateCallback = (playerId: string, state: RTCPeerConnectionState) => void;
export type RemoteStreamCallback = (playerId: string, stream: MediaStream) => void;
export type PeerDisconnectedCallback = (playerId: string) => void;

export interface PeerManagerOptions {
  playerId: string;
  roomCode: string;
  config?: RTCConfiguration;
  onRemoteStream?: RemoteStreamCallback;
  onPeerStateChange?: PeerStateCallback;
  onPeerDisconnected?: PeerDisconnectedCallback;
}

// ── PeerManager class ─────────────────────────────────────────────────────────

export class PeerManager {
  private peers = new Map<string, RTCPeerConnection>();
  private remoteStreams = new Map<string, MediaStream>();
  private unsubscribers = new Map<string, Unsubscribe[]>();
  private localStream: MediaStream | null = null;

  readonly playerId: string;
  readonly roomCode: string;
  private readonly config: RTCConfiguration;

  onRemoteStream?: RemoteStreamCallback;
  onPeerStateChange?: PeerStateCallback;
  onPeerDisconnected?: PeerDisconnectedCallback;

  constructor(opts: PeerManagerOptions) {
    this.playerId = opts.playerId;
    this.roomCode = opts.roomCode;
    this.config = opts.config ?? DEFAULT_RTC_CONFIG;
    this.onRemoteStream = opts.onRemoteStream;
    this.onPeerStateChange = opts.onPeerStateChange;
    this.onPeerDisconnected = opts.onPeerDisconnected;
  }

  // ── Local media ──────────────────────────────────────────────────────────

  /**
   * Set the local media stream. Call this before connectToPeer().
   * Replaces tracks on all existing peers if already connected.
   */
  setLocalStream(stream: MediaStream): void {
    this.localStream = stream;

    // Replace tracks on all existing connections
    this.peers.forEach((pc, remoteId) => {
      stream.getTracks().forEach(track => {
        const sender = pc.getSenders().find(s => s.track?.kind === track.kind);
        if (sender) {
          sender.replaceTrack(track).catch(console.error);
        } else {
          pc.addTrack(track, stream);
        }
      });
    });
  }

  // ── Connection management ─────────────────────────────────────────────────

  /**
   * Establish a peer connection with another player.
   * Safe to call multiple times for the same peer (idempotent).
   */
  async connectToPeer(remotePlayerId: string): Promise<void> {
    if (this.peers.has(remotePlayerId)) {
      console.warn(`[PeerManager] Already connected to ${remotePlayerId}`);
      return;
    }

    const pc = new RTCPeerConnection(this.config);
    this.peers.set(remotePlayerId, pc);

    // Add local tracks
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => {
        pc.addTrack(track, this.localStream!);
      });
    }

    // Handle remote tracks
    pc.ontrack = (event) => {
      const [stream] = event.streams;
      if (stream) {
        this.remoteStreams.set(remotePlayerId, stream);
        this.onRemoteStream?.(remotePlayerId, stream);
      }
    };

    // Connection state
    pc.onconnectionstatechange = () => {
      const state = pc.connectionState;
      this.onPeerStateChange?.(remotePlayerId, state);

      if (state === 'disconnected' || state === 'failed' || state === 'closed') {
        this.onPeerDisconnected?.(remotePlayerId);
        // Attempt reconnect on failure
        if (state === 'failed') {
          console.warn(`[PeerManager] Connection to ${remotePlayerId} failed. Reconnecting...`);
          this.disconnectFromPeer(remotePlayerId).then(() => {
            this.connectToPeer(remotePlayerId);
          });
        }
      }
    };

    // ICE candidates — send ours to signaling
    pc.onicecandidate = async (event) => {
      if (event.candidate) {
        await writeCandidate(
          this.roomCode,
          this.playerId,
          remotePlayerId,
          event.candidate.toJSON(),
        );
      }
    };

    // Subscribe to their ICE candidates
    const unsubCandidates = subscribeToCandidates(
      this.roomCode,
      this.playerId,
      remotePlayerId,
      async (candidateData) => {
        try {
          await pc.addIceCandidate(new RTCIceCandidate(candidateData));
        } catch (e) {
          console.error('[PeerManager] Failed to add ICE candidate:', e);
        }
      },
    );

    const unsubs: Unsubscribe[] = [unsubCandidates];
    this.unsubscribers.set(remotePlayerId, unsubs);

    // Offer/answer exchange
    if (isCaller(this.playerId, remotePlayerId)) {
      await this._doOffer(pc, remotePlayerId, unsubs);
    } else {
      await this._doAnswer(pc, remotePlayerId, unsubs);
    }
  }

  private async _doOffer(
    pc: RTCPeerConnection,
    remotePlayerId: string,
    unsubs: Unsubscribe[],
  ): Promise<void> {
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    await writeOffer(this.roomCode, this.playerId, remotePlayerId, offer.sdp!);

    // Wait for answer
    const unsubAnswer = subscribeToAnswer(
      this.roomCode,
      this.playerId,
      remotePlayerId,
      async (answer) => {
        if (pc.signalingState === 'have-local-offer') {
          await pc.setRemoteDescription(
            new RTCSessionDescription({ type: 'answer', sdp: answer.sdp }),
          );
        }
      },
    );
    unsubs.push(unsubAnswer);
  }

  private async _doAnswer(
    pc: RTCPeerConnection,
    remotePlayerId: string,
    unsubs: Unsubscribe[],
  ): Promise<void> {
    // Wait for offer from caller
    const unsubOffer = subscribeToOffer(
      this.roomCode,
      this.playerId,
      remotePlayerId,
      async (offer) => {
        if (pc.signalingState !== 'stable') return;

        await pc.setRemoteDescription(
          new RTCSessionDescription({ type: 'offer', sdp: offer.sdp }),
        );
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        await writeAnswer(this.roomCode, this.playerId, remotePlayerId, answer.sdp!);
      },
    );
    unsubs.push(unsubOffer);
  }

  /**
   * Disconnect from a specific peer and clean up signaling.
   */
  async disconnectFromPeer(remotePlayerId: string): Promise<void> {
    // Close connection
    const pc = this.peers.get(remotePlayerId);
    if (pc) {
      pc.close();
      this.peers.delete(remotePlayerId);
    }

    // Stop subscriptions
    const unsubs = this.unsubscribers.get(remotePlayerId) ?? [];
    unsubs.forEach(fn => fn());
    this.unsubscribers.delete(remotePlayerId);

    // Remove remote stream
    this.remoteStreams.delete(remotePlayerId);

    // Clear signaling channel
    await clearSignalingChannel(this.roomCode, this.playerId, remotePlayerId);
  }

  /**
   * Disconnect from all peers and stop local media.
   * Call when leaving the room or at game end.
   */
  disconnectAll(): void {
    // Close all peer connections
    this.peers.forEach((pc) => pc.close());
    this.peers.clear();

    // Stop all subscriptions
    this.unsubscribers.forEach(unsubs => unsubs.forEach(fn => fn()));
    this.unsubscribers.clear();

    // Clear remote streams
    this.remoteStreams.clear();

    // Stop local media tracks
    if (this.localStream) {
      this.localStream.getTracks().forEach(t => t.stop());
      this.localStream = null;
    }
  }

  // ── Media controls ────────────────────────────────────────────────────────

  /** Mute/unmute local audio */
  toggleAudio(muted: boolean): void {
    this.localStream?.getAudioTracks().forEach(t => { t.enabled = !muted; });
  }

  /** Enable/disable local video */
  toggleVideo(enabled: boolean): void {
    this.localStream?.getVideoTracks().forEach(t => { t.enabled = enabled; });
  }

  /** Replace the video track on all peer connections (e.g. camera switch) */
  async replaceVideoTrack(newTrack: MediaStreamTrack): Promise<void> {
    const replacements = Array.from(this.peers.values()).map(pc => {
      const sender = pc.getSenders().find(s => s.track?.kind === 'video');
      return sender ? sender.replaceTrack(newTrack) : Promise.resolve();
    });
    await Promise.all(replacements);
  }

  // ── Accessors ─────────────────────────────────────────────────────────────

  getLocalStream(): MediaStream | null {
    return this.localStream;
  }

  getRemoteStream(remotePlayerId: string): MediaStream | undefined {
    return this.remoteStreams.get(remotePlayerId);
  }

  getAllRemoteStreams(): Map<string, MediaStream> {
    return new Map(this.remoteStreams);
  }

  getPeerState(remotePlayerId: string): RTCPeerConnectionState | undefined {
    return this.peers.get(remotePlayerId)?.connectionState;
  }

  getConnectedPeerIds(): string[] {
    return Array.from(this.peers.keys()).filter(
      id => this.peers.get(id)?.connectionState === 'connected',
    );
  }
}
