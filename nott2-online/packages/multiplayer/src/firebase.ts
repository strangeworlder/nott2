/**
 * Firebase App Singleton
 *
 * Initializes the Firebase app once. Safe to call from multiple modules.
 * Config is read from environment variables (Next.js NEXT_PUBLIC_* prefix).
 *
 * In the multiplayer package, config is injected at call-time via initFirebase().
 * This avoids coupling the package to any specific env var naming convention.
 */

import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getDatabase, type Database } from 'firebase/database';
import { getAuth, type Auth } from 'firebase/auth';

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  databaseURL: string;
  projectId: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId: string;
}

let _app: FirebaseApp | null = null;
let _db: Database | null = null;
let _auth: Auth | null = null;

export function initFirebase(config: FirebaseConfig): {
  app: FirebaseApp;
  db: Database;
  auth: Auth;
} {
  if (_app) {
    return { app: _app, db: _db!, auth: _auth! };
  }

  _app = getApps().length === 0 ? initializeApp(config) : getApps()[0];
  _db = getDatabase(_app);
  _auth = getAuth(_app);

  return { app: _app, db: _db, auth: _auth };
}

export function getDb(): Database {
  if (!_db) throw new Error('Firebase not initialized. Call initFirebase() first.');
  return _db;
}

export function getFirebaseAuth(): Auth {
  if (!_auth) throw new Error('Firebase not initialized. Call initFirebase() first.');
  return _auth;
}
