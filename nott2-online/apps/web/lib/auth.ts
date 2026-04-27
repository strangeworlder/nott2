/**
 * NextAuth.js (Auth.js v5) — Discord SSO Configuration
 *
 * Philosophical:
 * This is the Gatekeeper. Only game hosts need to prove their identity and
 * subscription status. We use Discord as the Identity Provider because
 * our community lives there, and Patreon roles (synced via a bot) give us
 * a zero-maintenance billing gate — no Stripe, no webhook, no database.
 *
 * Technical:
 * 1. Discord OAuth2 with `identify` + `guilds.members.read` scopes
 * 2. In the signIn callback, we hit Discord's Guild Member API to check
 *    if the user has the PREMIUM_ROLE_ID in our GUILD_ID
 * 3. If yes → JWT with discordId/discordName is issued
 * 4. If no → redirect to /auth/denied with a reason query param
 *
 * The JWT is then used to mint a Firebase Custom Token (see firebase-admin.ts)
 * so the host can authenticate as themselves in Firebase RTDB.
 *
 * Dev bypass: When AUTH_DISCORD_ID is not set, the entire Discord flow is
 * disabled and the lobby falls back to anonymous auth. This keeps local
 * development frictionless.
 */

import NextAuth from 'next-auth';
import Discord from 'next-auth/providers/discord';

/** True when Discord SSO env vars are configured */
export const isDiscordAuthEnabled =
  !!process.env.AUTH_DISCORD_ID && !!process.env.AUTH_DISCORD_SECRET;

const nextAuth = NextAuth({
  providers: isDiscordAuthEnabled
    ? [
        Discord({
          clientId: process.env.AUTH_DISCORD_ID!,
          clientSecret: process.env.AUTH_DISCORD_SECRET!,
          authorization: {
            params: {
              scope: 'identify guilds.members.read',
            },
          },
        }),
      ]
    : [],

  callbacks: {
    async signIn({ account }) {
      if (!account?.access_token) return false;

      const guildId = process.env.DISCORD_GUILD_ID;
      const roleId = process.env.DISCORD_PREMIUM_ROLE_ID;

      // If guild/role env vars are missing, skip role validation (dev mode)
      if (!guildId || !roleId) return true;

      // The Gatekeeper API Call — check guild membership + role
      try {
        const res = await fetch(
          `https://discord.com/api/v10/users/@me/guilds/${guildId}/member`,
          { headers: { Authorization: `Bearer ${account.access_token}` } },
        );

        if (res.status === 404) {
          // User is not a member of the guild
          return '/auth/denied?reason=not-member';
        }

        if (!res.ok) {
          // Unexpected Discord API error
          return '/auth/denied?reason=error';
        }

        const member = await res.json();
        if (!member.roles?.includes(roleId)) {
          // Member exists but doesn't have the premium role
          return '/auth/denied?reason=no-role';
        }

        return true;
      } catch {
        return '/auth/denied?reason=error';
      }
    },

    async jwt({ token, account, profile }) {
      // On initial sign-in, persist Discord ID and username into the JWT
      if (account && profile) {
        token.discordId = (profile as any).id;
        token.discordName = (profile as any).username;
      }
      return token;
    },

    async session({ session, token }) {
      // Expose Discord fields on the client-visible session object
      session.user.discordId = token.discordId as string;
      session.user.discordName = token.discordName as string;
      return session;
    },
  },

  pages: {
    signIn: '/auth/signin',
    error: '/auth/denied',
  },

  session: {
    // 24-hour session — host must re-authenticate daily
    maxAge: 24 * 60 * 60,
  },

  // Required for Vercel reverse-proxy (x-forwarded-host differs from host)
  trustHost: true,
});

// Explicit exports to avoid TS "inferred type cannot be named" error.
// The complex overloaded `auth` type references internal next-auth/lib types
// that aren't re-exported, so destructuring doesn't work with strict TS.
export const handlers = nextAuth.handlers;
export const signIn = nextAuth.signIn;
export const signOut = nextAuth.signOut;

/**
 * Get the current session. Call from server components, API routes, or middleware.
 * We narrow the type to just the () => Session|null overload since that's all we use.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const auth = nextAuth.auth as (...args: any[]) => Promise<any>;
