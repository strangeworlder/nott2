/**
 * Custom Discord Sign-In Page — /auth/signin
 *
 * Philosophical:
 * This replaces NextAuth's generic sign-in page with something that matches
 * the game's dark, premium aesthetic. It makes the Discord requirement clear
 * and reassures joining players that they don't need to sign in.
 *
 * Technical:
 * A simple page with a "Sign in with Discord" button that triggers the
 * NextAuth Discord OAuth flow via the /api/auth/signin/discord redirect.
 */

'use client';

import { darkTheme, Card, Button, Text, Icon } from '@nott2/design-system';
import './signin.css';

export default function SignInPage() {
  const handleDiscordSignIn = () => {
    // Redirect to NextAuth's Discord provider endpoint
    window.location.href = '/api/auth/signin/discord';
  };

  return (
    <div className={`signin-page ${darkTheme}`}>
      <div className="signin-container">
        <Card>
          <div className="signin-inner">
            {/* Discord-style logo area */}
            <div className="signin-discord-logo">
              <Icon name="login" size={36} />
            </div>

            <Text variant="h2">Host Authentication</Text>
            <div className="signin-description">
              <Text variant="body" color="muted">
                Sign in with Discord to verify your subscription and host a game session.
                Your Discord role proves your access — no passwords, no accounts to manage.
              </Text>
            </div>

            <Button
              variant="primary"
              onClick={handleDiscordSignIn}
            >
              Sign in with Discord
            </Button>

            <div className="signin-info-box">
              <Text variant="label" color="muted">
                Only game hosts need to sign in. Players joining a game can go
                directly to the <a href="/lobby?join=true" className="signin-link">lobby</a> and
                enter a room code.
              </Text>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.location.href = '/'}
            >
              ← Back to Home
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
