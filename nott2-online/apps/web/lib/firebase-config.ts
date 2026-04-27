/**
 * Firebase configuration for the web app.
 *
 * Reads from NEXT_PUBLIC_FIREBASE_* environment variables.
 * Copy .env.example to .env.local and populate with your project values.
 *
 * To get these values:
 *   1. Go to https://console.firebase.google.com
 *   2. Create/select project → Project Settings → Your apps → Web
 *   3. Copy the firebaseConfig object values
 */

import type { FirebaseConfig } from '@nott2/multiplayer';

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${key}\n` +
      `Copy .env.example to .env.local and fill in your Firebase project values.`,
    );
  }
  return value;
}

/**
 * Get the Firebase config from environment variables.
 * Throws clearly if any required variable is missing.
 */
export function getFirebaseConfig(): FirebaseConfig {
  return {
    apiKey:            requireEnv('NEXT_PUBLIC_FIREBASE_API_KEY'),
    authDomain:        requireEnv('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN'),
    databaseURL:       requireEnv('NEXT_PUBLIC_FIREBASE_DATABASE_URL'),
    projectId:         requireEnv('NEXT_PUBLIC_FIREBASE_PROJECT_ID'),
    storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId:             requireEnv('NEXT_PUBLIC_FIREBASE_APP_ID'),
  };
}

/**
 * Whether Firebase is configured. Use this to guard multiplayer features
 * in demo mode when env vars aren't set.
 */
export function isFirebaseConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
    process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL
  );
}
