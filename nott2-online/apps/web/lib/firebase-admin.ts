/**
 * Firebase Admin SDK — Server-only singleton.
 *
 * Philosophical:
 * This is the bridge between our Discord identity and Firebase's auth system.
 * When a host authenticates via Discord, we mint a Firebase Custom Token using
 * their Discord ID as the UID. This token lets the client-side Firebase SDK
 * authenticate as the host, so RTDB security rules can enforce "only the host
 * can write to state/".
 *
 * Technical:
 * - Initialized lazily from FIREBASE_SERVICE_ACCOUNT_JSON env var
 * - The UID format is `discord:<discordId>` to namespace it clearly
 * - Only imported in API routes (server-side) — never in client components
 * - next.config.ts has `serverExternalPackages: ['firebase-admin']` to prevent
 *   webpack from bundling it into client chunks
 *
 * SECURITY:
 * - FIREBASE_SERVICE_ACCOUNT_JSON is a server-only env var (no NEXT_PUBLIC_ prefix)
 * - Never import this file from client components or pages
 */

import { initializeApp, getApps, cert, type App } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

let _adminApp: App | null = null;

function getAdminApp(): App {
  if (_adminApp) return _adminApp;

  const existing = getApps();
  if (existing.length > 0) {
    _adminApp = existing[0];
    return _adminApp;
  }

  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!raw) {
    throw new Error(
      'FIREBASE_SERVICE_ACCOUNT_JSON is not set. ' +
      'Download it from Firebase Console > Project Settings > Service Accounts.',
    );
  }

  const serviceAccount = JSON.parse(raw);
  _adminApp = initializeApp({
    credential: cert(serviceAccount),
  });

  return _adminApp;
}

/**
 * Mint a Firebase Custom Token for a Discord-authenticated host.
 *
 * The UID is `discord:<discordId>` — this is the value that appears as
 * `auth.uid` in Firebase security rules, matched against `meta/hostId`.
 *
 * @param discordId - The Discord user's snowflake ID
 * @returns A Firebase Custom Token string (valid for 1 hour)
 */
export async function mintFirebaseToken(discordId: string): Promise<string> {
  const adminAuth = getAuth(getAdminApp());
  return adminAuth.createCustomToken(`discord:${discordId}`);
}
