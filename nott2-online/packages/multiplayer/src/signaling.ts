/**
 * WebRTC Signaling (`signaling.ts`)
 *
 * Manages the Firebase RTDB signaling channel for WebRTC offer/answer/ICE
 * exchange between pairs of players.
 *
 * Signaling path: games/{roomCode}/signaling/{callerId}_{calleeId}/
 *
 * Deterministic caller selection:
 *   The player with the lexicographically LOWER UID is always the caller.
 *   This prevents both sides from creating offers simultaneously (glare).
 *
 * Lifecycle:
 *   1. Caller creates offer → writes to signaling/offer
 *   2. Callee listens to signaling/offer → creates answer → writes to signaling/answer
 *   3. Both listen to signaling/candidates/ for ICE candidates
 *   4. After connection established, optionally clean up signaling data
 */

import {
  ref,
  set,
  onValue,
  onChildAdded,
  remove,
  push,
  type Unsubscribe,
} from 'firebase/database';
import { getDb } from './firebase';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface SignalingOffer {
  type: 'offer';
  sdp: string;
  timestamp: number;
}

export interface SignalingAnswer {
  type: 'answer';
  sdp: string;
  timestamp: number;
}

export interface SignalingCandidate {
  candidate: string;
  sdpMid: string | null;
  sdpMLineIndex: number | null;
  from: string; // playerId who sent this candidate
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Returns the deterministic signaling channel key for a pair.
 * Lower UID is always first (caller side).
 */
export function getChannelKey(uidA: string, uidB: string): string {
  return uidA < uidB ? `${uidA}_${uidB}` : `${uidB}_${uidA}`;
}

/** Whether this player is the caller for a given pair */
export function isCaller(localUid: string, remoteUid: string): boolean {
  return localUid < remoteUid;
}

function channelRef(roomCode: string, localUid: string, remoteUid: string) {
  return `games/${roomCode}/signaling/${getChannelKey(localUid, remoteUid)}`;
}

// ── Offer / Answer ────────────────────────────────────────────────────────────

export async function writeOffer(
  roomCode: string,
  localUid: string,
  remoteUid: string,
  sdp: string,
): Promise<void> {
  const path = `${channelRef(roomCode, localUid, remoteUid)}/offer`;
  await set(ref(getDb(), path), {
    type: 'offer',
    sdp,
    timestamp: Date.now(),
  } satisfies SignalingOffer);
}

export async function writeAnswer(
  roomCode: string,
  localUid: string,
  remoteUid: string,
  sdp: string,
): Promise<void> {
  const path = `${channelRef(roomCode, localUid, remoteUid)}/answer`;
  await set(ref(getDb(), path), {
    type: 'answer',
    sdp,
    timestamp: Date.now(),
  } satisfies SignalingAnswer);
}

export function subscribeToOffer(
  roomCode: string,
  localUid: string,
  remoteUid: string,
  callback: (offer: SignalingOffer) => void,
): Unsubscribe {
  const path = `${channelRef(roomCode, localUid, remoteUid)}/offer`;
  return onValue(ref(getDb(), path), (snap) => {
    if (snap.exists()) callback(snap.val() as SignalingOffer);
  });
}

export function subscribeToAnswer(
  roomCode: string,
  localUid: string,
  remoteUid: string,
  callback: (answer: SignalingAnswer) => void,
): Unsubscribe {
  const path = `${channelRef(roomCode, localUid, remoteUid)}/answer`;
  return onValue(ref(getDb(), path), (snap) => {
    if (snap.exists()) callback(snap.val() as SignalingAnswer);
  });
}

// ── ICE Candidates ────────────────────────────────────────────────────────────

export async function writeCandidate(
  roomCode: string,
  localUid: string,
  remoteUid: string,
  candidate: RTCIceCandidateInit,
): Promise<void> {
  const path = `${channelRef(roomCode, localUid, remoteUid)}/candidates`;
  const candidatesRef = ref(getDb(), path);
  await set(push(candidatesRef), {
    candidate: candidate.candidate ?? '',
    sdpMid: candidate.sdpMid ?? null,
    sdpMLineIndex: candidate.sdpMLineIndex ?? null,
    from: localUid,
  } satisfies SignalingCandidate);
}

export function subscribeToCandidates(
  roomCode: string,
  localUid: string,
  remoteUid: string,
  callback: (candidate: SignalingCandidate) => void,
): Unsubscribe {
  const path = `${channelRef(roomCode, localUid, remoteUid)}/candidates`;
  return onChildAdded(ref(getDb(), path), (snap) => {
    const data = snap.val() as SignalingCandidate;
    // Only process candidates sent BY the other player (not our own echoed back)
    if (data && data.from !== localUid) {
      callback(data);
    }
  });
}

// ── Cleanup ───────────────────────────────────────────────────────────────────

/** Remove the entire signaling channel for a pair after connection is established */
export async function clearSignalingChannel(
  roomCode: string,
  localUid: string,
  remoteUid: string,
): Promise<void> {
  const path = channelRef(roomCode, localUid, remoteUid);
  await remove(ref(getDb(), path));
}

/** Remove all signaling data for a room (called when room closes) */
export async function clearAllSignaling(roomCode: string): Promise<void> {
  await remove(ref(getDb(), `games/${roomCode}/signaling`));
}
