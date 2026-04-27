/**
 * State Sync (`sync.ts`)
 *
 * Bidirectional state synchronisation between the host's Zustand store
 * and Firebase RTDB. Implements the host-authority model:
 *
 *   Host mutations → serialize → push to Firebase
 *   Firebase changes → deserialize → hydrate client stores
 *
 * Echo prevention: a `_isRemoteUpdate` flag is set while applying
 * a remote snapshot. The host middleware checks this flag and suppresses
 * the Firebase push when it's true.
 *
 * Action Queue (Client → Host):
 *   Clients push validated GameActions to `games/{roomCode}/actions`.
 *   The host runs validateAction() and applyAction() on each.
 *   Processed actions are removed from the queue.
 */

import {
  ref,
  set,
  onValue,
  onChildAdded,
  remove,
  push,
  serverTimestamp,
  type Unsubscribe,
  type DatabaseReference,
} from 'firebase/database';
import type { GameState, GameAction } from '@nott2/game-engine';
import { getDb } from './firebase';
import { serializeGameState, deserializeGameState } from './serialization';

// ── Debounce ─────────────────────────────────────────────────────────────────

function debounce<A extends unknown[]>(
  fn: (...args: A) => unknown,
  ms: number,
): (...args: A) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: A) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}

// ── Host → Firebase ───────────────────────────────────────────────────────────

/**
 * Push the current GameState to Firebase. Debounced at 150ms to batch
 * rapid successive state changes (e.g. drawing a card then selecting it).
 */
export const pushState = debounce(
  async (roomCode: string, gs: GameState): Promise<void> => {
    const db = getDb();
    const serialized = serializeGameState(gs);
    await set(ref(db, `games/${roomCode}/state`), serialized);
  },
  150,
);

// ── Client ← Firebase ─────────────────────────────────────────────────────────

/**
 * Subscribe to remote game state changes.
 * Fires immediately with the current state (or null if no state yet),
 * then on every change.
 *
 * @param onState Called with the deserialized GameState (or null on first load)
 * @returns Unsubscribe function
 */
export function subscribeToGameState(
  roomCode: string,
  onState: (gs: GameState | null) => void,
): Unsubscribe {
  const db = getDb();
  return onValue(ref(db, `games/${roomCode}/state`), (snap) => {
    const raw = snap.val();
    if (raw) {
      onState(deserializeGameState(raw as Record<string, unknown>));
    } else {
      onState(null);
    }
  });
}

// ── Client → Host Action Queue ────────────────────────────────────────────────

/**
 * Send a GameAction to the host via the action queue.
 * Returns a promise that resolves once the action is written to Firebase.
 */
export async function sendAction(
  roomCode: string,
  action: GameAction,
): Promise<void> {
  const db = getDb();
  const actionsRef = ref(db, `games/${roomCode}/actions`);
  const newActionRef = push(actionsRef);
  await set(newActionRef, {
    ...action,
    timestamp: serverTimestamp(),
  });
}

// ── Host Action Queue Listener ────────────────────────────────────────────────

export interface ActionQueueCallbacks {
  /** Called with each incoming action. Host validates and applies (or rejects). */
  onAction: (action: GameAction, actionRef: DatabaseReference) => void;
}

/**
 * Host subscribes to incoming client actions.
 * Each new action triggers `onAction`. The host is responsible for:
 *   1. Running validateAction(currentState, action)
 *   2. If valid: applyAction then calling remove(actionRef)
 *   3. If invalid: calling remove(actionRef) (silently discard)
 *
 * @returns Unsubscribe function
 */
export function subscribeToActionQueue(
  roomCode: string,
  callbacks: ActionQueueCallbacks,
): Unsubscribe {
  const db = getDb();
  return onChildAdded(
    ref(db, `games/${roomCode}/actions`),
    (snap) => {
      const action = snap.val() as GameAction;
      if (action) {
        callbacks.onAction(action, snap.ref);
      }
    },
  );
}

/**
 * Remove a processed action from the queue.
 */
export async function removeAction(actionRef: DatabaseReference): Promise<void> {
  await remove(actionRef);
}
