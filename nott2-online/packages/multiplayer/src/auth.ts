/**
 * Anonymous Authentication (`auth.ts`)
 *
 * Handles Firebase Anonymous Auth flow.
 * Anonymous accounts persist across sessions (same browser/device).
 *
 * Flow:
 *   1. App loads → call ensureAuth()
 *   2. If already signed in → returns existing user
 *   3. If not signed in → signInAnonymously()
 *   4. Returns { uid, displayName }
 *
 * The UID is used as playerId throughout the multiplayer system.
 */

import {
  signInAnonymously,
  onAuthStateChanged,
  type User,
} from 'firebase/auth';
import { getFirebaseAuth } from './firebase';

export interface AuthState {
  uid: string;
  /** Null until the player sets a display name in the lobby */
  displayName: string | null;
}

/**
 * Ensure the user is signed in anonymously.
 * Returns immediately if already authenticated.
 * Creates a new anonymous account if not.
 */
export async function ensureAuth(): Promise<AuthState> {
  const auth = getFirebaseAuth();

  return new Promise((resolve, reject) => {
    // onAuthStateChanged fires immediately with the current user (or null)
    const unsubscribe = onAuthStateChanged(
      auth,
      async (user) => {
        unsubscribe(); // We only need the first emission

        if (user) {
          resolve({ uid: user.uid, displayName: user.displayName });
        } else {
          try {
            const cred = await signInAnonymously(auth);
            resolve({ uid: cred.user.uid, displayName: null });
          } catch (err) {
            reject(err);
          }
        }
      },
      reject,
    );
  });
}

/**
 * Subscribe to auth state changes.
 * Use this to reactively update the Zustand store when auth changes.
 *
 * @returns Unsubscribe function
 */
export function subscribeToAuth(
  callback: (user: User | null) => void,
): () => void {
  return onAuthStateChanged(getFirebaseAuth(), callback);
}

/**
 * Get the current signed-in user synchronously.
 * Returns null if not signed in.
 */
export function getCurrentUser(): User | null {
  return getFirebaseAuth().currentUser;
}
