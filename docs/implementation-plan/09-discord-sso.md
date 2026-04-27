# Phase 9: Discord SSO & Hybrid Auth

> **Goal**: Migrate the host authentication system from Anonymous Auth to a Discord-Gated Single Sign-On (SSO) architecture. Implement a Decoupled Billing ecosystem using Patreon Roles via Discord, while keeping the frictionless Anonymous Auth for joining players.  
> **Skills**: `next-auth-v5`, `firebase-basics`  
> **Estimated Effort**: 2 sessions  
> **Depends on**: Phase 7 (Game Assembly)

---

## Deliverables

- [ ] Discord OAuth2 flow — NextAuth.js integration
- [ ] Role Validation — Gate game hosting behind a Patreon `PREMIUM_ROLE_ID`
- [ ] Hybrid Firebase Auth — Mint Custom Tokens for Discord Hosts while retaining Anonymous Auth for Clients
- [ ] UI/UX Edge Cases — Gracefully handle Unlinked users and Server Leaver 404s
- [ ] Session Management — Issue encrypted JWTs (valid for 12-24 hours)

---

## 9.1 Hybrid Authentication Model

We use a **Hybrid Authentication Model** that pairs a Decoupled Billing and Single Sign-On (SSO) ecosystem for Game Hosts, with frictionless Anonymous Auth for joining players.

### Game Hosts (Discord-Gated SSO)

Only the player who **creates** the game session needs to be authenticated. We use Discord as our Identity Provider (IdP) to gate access based on subscription status (e.g., via a Patreon bot), keeping our app completely stateless regarding billing.

We use NextAuth.js (Auth.js v5) for the OAuth2 Authorization Code flow:

1. **OAuth2 Initiation**: The host clicks "Host Game" and is redirected to Discord's OAuth2 authorization URL, requesting the `identify` and `guilds.members.read` scopes.
2. **Token Exchange**: Discord redirects back with an authorization code. NextAuth POSTs this to Discord to get a user `access_token`.
3. **The Gatekeeper API Call**: The backend uses the `access_token` to fetch membership details for our specific Discord Server:
   `GET https://discord.com/api/v10/users/@me/guilds/{OUR_GUILD_ID}/member`
4. **Role Validation**: 
   - The backend checks if our `PREMIUM_ROLE_ID` is in the returned `roles` array.
   - **If Yes**: The user receives an encrypted JWT session (valid for 12-24 hours). We also mint a **Firebase Custom Token** using their Discord ID so the client can authenticate as the Host in RTDB.
   - **If No**: Access is denied (HTTP 403), and the user is redirected to an "Access Denied" page.

### Joining Players (Anonymous Auth)

Players joining an existing game via a room code do **not** need to go through the Discord SSO flow.

1. Client enters Room Code.
2. App checks `onAuthStateChanged`.
3. If no user → calls `signInAnonymously()`.
4. The generated `user.uid` is used as their `playerId` in the game.
5. They can write to the `actions/` queue for that specific game, but cannot overwrite the `state/`.

---

## 9.2 Security Rules Update

Once Hybrid Auth is implemented, the Firebase Realtime Database rules must be updated to securely distinguish between Hosts and Clients. 

```json
{
  "rules": {
    "games": {
      "$roomCode": {
        ".read": true,
        ".write": true,
        "state": {
          // Only the Host (who authenticated via Custom Token using their Discord ID) can write state
          ".write": "auth != null && data.child('../meta/hostId').val() === auth.uid"
        },
        "actions": {
          // Anyone authenticated (Anonymous or Host) can submit actions
          ".write": "auth != null"
        }
      }
    }
  }
}
```

> [!NOTE]
> With our Hybrid Auth model, the `auth.uid` of the host will be their Discord ID (from the Custom Token), while clients will have random Anonymous UIDs.

---

## 9.3 UI/UX Edge Cases (Hosts Only)

We must handle two specific "human error" scenarios where the API will deny access during the Host login flow:

1. **The "Unlinked" User** (Missing Role): User pays on Patreon but forgets to link their Discord account.
   - *UI Fix*: The "Access Denied" page must state: "Did you subscribe? Ensure your Discord account is linked in your Patreon settings so we can verify your roles."
2. **The "Server Leaver"** (API 404): User leaves the Discord server, stripping all roles.
   - *UI Fix*: The error handler must prompt: "You must be a member of our official Discord server to authenticate. Please join the server via your Patreon dashboard to regain access."

---

## Verification

- [ ] Discord OAuth flow: Host can log in via Discord
- [ ] Unauthorized edge cases: Host without role or who left server sees correct error UI
- [ ] JWT session persists across page reloads without pinging Discord API
- [ ] Firebase Custom Token successfully mints and authenticates RTDB for Host
- [ ] Anonymous auth: Client persists across page reloads
- [ ] Create room → gets 6-char code as Discord Host
- [ ] Host updates `state/` successfully
- [ ] Client cannot overwrite `state/` but can push to `actions/`
