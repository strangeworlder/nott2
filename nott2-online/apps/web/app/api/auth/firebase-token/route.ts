/**
 * Firebase Custom Token API route.
 *
 * Protected endpoint: only authenticated Discord hosts can request a token.
 * The client uses this token to call `signInWithCustomToken()` on the
 * Firebase client SDK, giving them an auth.uid = `discord:<discordId>`
 * that RTDB security rules can validate.
 *
 * Flow:
 *   1. Client calls GET /api/auth/firebase-token
 *   2. Server checks NextAuth session (encrypted JWT cookie)
 *   3. If valid → mint a Firebase Custom Token using the Discord ID
 *   4. Return { token } → client signs in to Firebase with it
 */

import { auth } from '../../../../lib/auth';
import { mintFirebaseToken } from '../../../../lib/firebase-admin';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const session = await auth() as { user?: { discordId?: string; name?: string } } | null;

    const discordId = session?.user?.discordId;
    if (!discordId) {
      return NextResponse.json(
        { error: 'Unauthorized — Discord session required' },
        { status: 401 },
      );
    }

    const token = await mintFirebaseToken(discordId);
    return NextResponse.json({ token });
  } catch (error) {
    console.error('[firebase-token] Error minting token:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
