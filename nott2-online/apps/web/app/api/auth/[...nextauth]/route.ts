/**
 * NextAuth.js catch-all API route.
 *
 * Handles all /api/auth/* requests: sign-in, sign-out, callback, session, etc.
 * This is the standard Auth.js v5 pattern for Next.js App Router.
 */

import { handlers } from '../../../../lib/auth';
export const { GET, POST } = handlers;
