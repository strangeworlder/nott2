/**
 * Room Management (`lobby.ts`)
 *
 * Handles room creation, joining, and leaving.
 *
 * Room code format: [A-HJ-NP-Z2-9]{6}
 * (No I, O, 0, 1 — avoids visual ambiguity)
 *
 * RTDB structure per room:
 *   games/{roomCode}/meta      — host, playset, status, timestamps
 *   games/{roomCode}/players   — all connected players
 *   games/{roomCode}/state     — serialized GameState (host-owned)
 *   games/{roomCode}/actions   — client → host action queue
 */

import {
  ref,
  get,
  set,
  remove,
  push,
  serverTimestamp,
  onValue,
  type Unsubscribe,
} from 'firebase/database';
import { getDb } from './firebase';

// ── Types ────────────────────────────────────────────────────────────────────

export type RoomStatus = 'lobby' | 'playing' | 'finished';

export interface RoomMeta {
  hostId: string;
  playset: string;
  createdAt: number | object; // object = ServerTimestamp before resolution
  status: RoomStatus;
  roomCode: string;
}

export interface RoomPlayer {
  name: string;
  seatIndex: 0 | 1 | 2 | 3;
  characterId: string;
  ready: boolean;
  lastSeen: number | object;
}

export interface RoomSnapshot {
  meta: RoomMeta;
  players: Record<string, RoomPlayer>;
}

// ── Room Code Generation ──────────────────────────────────────────────────────

// Unambiguous character set: no I, O, 0, 1
const ROOM_CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

export function generateRoomCode(): string {
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += ROOM_CODE_CHARS[Math.floor(Math.random() * ROOM_CODE_CHARS.length)];
  }
  return code;
}

/**
 * Generate a unique room code, retrying on collision (extremely rare).
 */
async function generateUniqueRoomCode(): Promise<string> {
  const db = getDb();
  for (let attempt = 0; attempt < 10; attempt++) {
    const code = generateRoomCode();
    const snap = await get(ref(db, `games/${code}/meta`));
    if (!snap.exists()) return code;
  }
  throw new Error('Failed to generate unique room code after 10 attempts.');
}

// ── Room CRUD ─────────────────────────────────────────────────────────────────

/**
 * Create a new room and register the host player.
 * Returns the generated 6-char room code.
 */
export async function createRoom(
  hostId: string,
  playerName: string,
  playset = 'default',
): Promise<string> {
  const db = getDb();
  const roomCode = await generateUniqueRoomCode();

  // Write meta
  await set(ref(db, `games/${roomCode}/meta`), {
    hostId,
    playset,
    createdAt: serverTimestamp(),
    status: 'lobby' as RoomStatus,
    roomCode,
  } satisfies Omit<RoomMeta, 'createdAt'> & { createdAt: object });

  // Write host player entry (seat 0)
  await set(ref(db, `games/${roomCode}/players/${hostId}`), {
    name: playerName,
    seatIndex: 0,
    characterId: 'Spades',
    ready: false,
    lastSeen: serverTimestamp(),
  } satisfies Omit<RoomPlayer, 'lastSeen'> & { lastSeen: object });

  return roomCode;
}

/**
 * Join an existing room.
 * Validates room exists, is in lobby status, and has a free seat.
 */
export async function joinRoom(
  roomCode: string,
  playerId: string,
  playerName: string,
): Promise<void> {
  const db = getDb();
  const normalized = roomCode.toUpperCase().trim();

  // Verify room exists
  const metaSnap = await get(ref(db, `games/${normalized}/meta`));
  if (!metaSnap.exists()) {
    throw new Error(`Room "${normalized}" not found.`);
  }

  const meta = metaSnap.val() as RoomMeta;
  if (meta.status !== 'lobby') {
    throw new Error(`Room "${normalized}" is already ${meta.status}.`);
  }

  // Check player count
  const playersSnap = await get(ref(db, `games/${normalized}/players`));
  const players: Record<string, RoomPlayer> = playersSnap.val() ?? {};
  const existingSeats = Object.values(players).map(p => p.seatIndex);

  if (existingSeats.length >= 4) {
    throw new Error(`Room "${normalized}" is full.`);
  }

  // Assign next available seat (0-3) and character
  const CHARACTERS = ['Spades', 'Hearts', 'Clubs', 'Diamonds'] as const;
  let seatIndex: 0 | 1 | 2 | 3 = 0;
  for (let i = 0 as 0 | 1 | 2 | 3; i < 4; i++) {
    if (!existingSeats.includes(i)) {
      seatIndex = i;
      break;
    }
  }

  await set(ref(db, `games/${normalized}/players/${playerId}`), {
    name: playerName,
    seatIndex,
    characterId: CHARACTERS[seatIndex],
    ready: false,
    lastSeen: serverTimestamp(),
  });
}

/**
 * Leave a room. If the leaving player is the host, the room is closed
 * (all players removed, status set to 'finished').
 */
export async function leaveRoom(
  roomCode: string,
  playerId: string,
): Promise<void> {
  const db = getDb();

  // Check if leaving player is the host
  const metaSnap = await get(ref(db, `games/${roomCode}/meta`));
  if (!metaSnap.exists()) return; // Room already gone

  const meta = metaSnap.val() as RoomMeta;
  const isHost = meta.hostId === playerId;

  if (isHost) {
    // Host leaving → close the room
    await set(ref(db, `games/${roomCode}/meta/status`), 'finished' as RoomStatus);
    await remove(ref(db, `games/${roomCode}/players`));
  } else {
    // Non-host leaving → just remove their entry
    await remove(ref(db, `games/${roomCode}/players/${playerId}`));
  }
}

/**
 * Update the room status (e.g. 'lobby' → 'playing').
 * Only the host should call this.
 */
export async function setRoomStatus(
  roomCode: string,
  status: RoomStatus,
): Promise<void> {
  await set(ref(getDb(), `games/${roomCode}/meta/status`), status);
}

// ── Subscriptions ─────────────────────────────────────────────────────────────

/**
 * Subscribe to the room's player list.
 * Fires immediately with current state, then on every change.
 */
export function subscribeToPlayers(
  roomCode: string,
  callback: (players: Record<string, RoomPlayer>) => void,
): Unsubscribe {
  const db = getDb();
  return onValue(ref(db, `games/${roomCode}/players`), (snap) => {
    callback(snap.val() ?? {});
  });
}

/**
 * Subscribe to the room meta (e.g. status changes).
 */
export function subscribeToRoomMeta(
  roomCode: string,
  callback: (meta: RoomMeta | null) => void,
): Unsubscribe {
  const db = getDb();
  return onValue(ref(db, `games/${roomCode}/meta`), (snap) => {
    callback(snap.val() as RoomMeta | null);
  });
}
