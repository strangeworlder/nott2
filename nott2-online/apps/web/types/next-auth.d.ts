/**
 * NextAuth type augmentation — Discord SSO fields.
 *
 * Extends the default NextAuth Session and JWT types to include
 * the Discord-specific fields we inject during the OAuth flow.
 */

import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      /** Discord user ID (snowflake) — e.g. "123456789012345678" */
      discordId: string;
      /** Discord username — e.g. "nightowl" */
      discordName: string;
    } & import('next-auth').DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    discordId?: string;
    discordName?: string;
  }
}
