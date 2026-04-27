/**
 * Authentication Module (`auth.ts`)
 *
 * Handles Firebase auth for both authentication paths:
 *
 * 1. Anonymous Auth (clients / dev mode):
 *    App loads → ensureAuth() → signInAnonymously() if needed
 *
 * 2. Discord Host Auth (production):
 *    Host authenticates via Discord SSO → server mints Firebase Custom Token
 *    → client calls signInAsHost(token) → signInWithCustomToken()
 *
 * The UID is used as playerId throughout the multiplayer system.
 * For anonymous users it's a random Firebase UID.
 * For Discord hosts it's `discord:<discordId>`.
 */

import {
  signInAnonymously,
  signInWithCustomToken,
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
 * Sign in as a Discord-authenticated host using a Firebase Custom Token.
 *
 * The token is minted server-side by the `/api/auth/firebase-token` endpoint
 * using the Firebase Admin SDK. The resulting auth.uid will be `discord:<id>`.
 *
 * @param firebaseToken - Custom Token from the server
 * @returns AuthState with the host's Firebase UID
 */
export async function signInAsHost(firebaseToken: string): Promise<AuthState> {
  const auth = getFirebaseAuth();
  const cred = await signInWithCustomToken(auth, firebaseToken);
  return { uid: cred.user.uid, displayName: cred.user.displayName };
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

