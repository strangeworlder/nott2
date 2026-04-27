/**
 * Player Presence (`presence.ts`)
 *
 * Uses Firebase RTDB's built-in `.info/connected` to track player
 * online/offline status via onDisconnect() hooks.
 *
 * On connect:   writes `serverTimestamp()` to lastSeen
 * On disconnect: Firebase writes `serverTimestamp()` automatically
 *
 * Reconnection:
 *   When a player reconnects, they call registerPresence() again.
 *   Firebase sends the latest state snapshot automatically, so the
 *   store is re-hydrated without any extra effort.
 *
 * Stale detection:
 *   A player is considered stale if lastSeen > STALE_THRESHOLD_MS ago.
 *   The host UI can show a "Player disconnected" indicator.
 */

import {
  ref,
  onValue,
  onDisconnect,
  serverTimestamp,
  set,
  type Unsubscribe,
} from 'firebase/database';
import { getDb } from './firebase';

/** Players not seen within 30s are considered disconnected */
export const STALE_THRESHOLD_MS = 30_000;

/**
 * Register presence for the current player.
 * Call this after joining a room.
 *
 * - Writes `lastSeen = serverTimestamp()` on connect
 * - Registers `onDisconnect` to write `lastSeen = serverTimestamp()` on disconnect
 *
 * @returns Unsubscribe function to stop presence tracking
 */
export function registerPresence(
  roomCode: string,
  playerId: string,
): Unsubscribe {
  const db = getDb();
  const presenceRef = ref(db, `games/${roomCode}/players/${playerId}/lastSeen`);
  const connectedRef = ref(db, '.info/connected');

  const unsubscribe = onValue(connectedRef, async (snap) => {
    if (snap.val() === true) {
      // Register disconnect handler first (race condition prevention)
      await onDisconnect(presenceRef).set(serverTimestamp());
      // Mark as online
      await set(presenceRef, serverTimestamp());
    }
  });

  return unsubscribe;
}

/**
 * Check if a player's lastSeen timestamp is within the stale threshold.
 */
export function isPlayerOnline(lastSeen: number): boolean {
  return Date.now() - lastSeen < STALE_THRESHOLD_MS;
}

/**
 * Subscribe to a specific player's presence.
 */
export function subscribeToPlayerPresence(
  roomCode: string,
  playerId: string,
  callback: (lastSeen: number | null) => void,
): Unsubscribe {
  const db = getDb();
  return onValue(
    ref(db, `games/${roomCode}/players/${playerId}/lastSeen`),
    (snap) => callback(snap.val() as number | null),
  );
}
