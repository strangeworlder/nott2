/**
 * Access Denied Page — /auth/denied
 *
 * Philosophical:
 * This is the bouncer at the door. When the Gatekeeper (Discord role check)
 * rejects a host, they land here with a clear explanation of WHY and HOW to
 * fix it. The two most common scenarios are:
 *   1. "Unlinked" — paid on Patreon but forgot to link Discord
 *   2. "Server Leaver" — left the Discord server, losing all roles
 *
 * Technical:
 * Reads `?reason=` from the URL to determine which error message to show.
 * Provides a "Try Again" button that re-initiates the Discord OAuth flow.
 */

'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { darkTheme, Card, Button, Text, Icon } from '@nott2/design-system';
import './denied.css';

const REASONS: Record<string, { title: string; message: string; icon: string }> = {
  'no-role': {
    title: 'Subscription Not Found',
    message:
      'We couldn\'t find a premium role on your Discord account. ' +
      'If you\'ve subscribed on Patreon, make sure your Discord account is linked ' +
      'in your Patreon settings so we can verify your roles. ' +
      'It may take a few minutes for roles to sync after linking.',
    icon: 'link_off',
  },
  'not-member': {
    title: 'Server Membership Required',
    message:
      'You must be a member of our official Discord server to authenticate. ' +
      'Please join the server via the invite link on your Patreon dashboard. ' +
      'Your premium role will be assigned automatically once you join.',
    icon: 'group_off',
  },
  error: {
    title: 'Something Went Wrong',
    message:
      'An unexpected error occurred during authentication. ' +
      'Please try again in a moment. If the problem persists, contact support on Discord.',
    icon: 'error_outline',
  },
};

const DEFAULT_REASON = {
  title: 'Access Denied',
  message: 'You don\'t have permission to host a game. Please sign in with a valid subscription.',
  icon: 'lock',
};

function DeniedContent() {
  const searchParams = useSearchParams();
  const reasonKey = searchParams.get('reason') ?? '';
  const reason = REASONS[reasonKey] ?? DEFAULT_REASON;

  return (
    <div className={`denied-page ${darkTheme}`}>
      <div className="denied-container">
        <Card>
          <div className="denied-inner">
            <div className="denied-icon-ring">
              <Icon name={reason.icon as any} size={32} />
            </div>

            <Text variant="h2">{reason.title}</Text>
            <div className="denied-message">
              <Text variant="body" color="muted">
                {reason.message}
              </Text>
            </div>

            <div className="denied-actions">
              <Button
                variant="primary"
                onClick={() => window.location.href = '/api/auth/signin'}
              >
                Try Again
              </Button>
              <Button
                variant="ghost"
                onClick={() => window.location.href = '/'}
              >
                Back to Home
              </Button>
            </div>

            <Text variant="label" color="muted">
              Players joining a game don't need to sign in — just enter the room code.
            </Text>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default function DeniedPage() {
  return (
    <Suspense fallback={null}>
      <DeniedContent />
    </Suspense>
  );
}
