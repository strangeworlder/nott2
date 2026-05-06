'use client';

import { useEffect } from 'react';
import { Text, Button } from '@nott2/design-system';

/**
 * Lobby Route Error Boundary — /lobby
 *
 * Catches errors during room creation, joining, or Firebase init.
 * Two recovery paths: try again (reset) or go home.
 */
export default function LobbyError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[LobbyError]', error);
  }, [error]);

  return (
    <div style={{
      minHeight: '100dvh', background: '#080808', color: '#e8e8e8',
      fontFamily: 'var(--font-body, system-ui, sans-serif)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      gap: 24, padding: 32, textAlign: 'center',
    }}>
      <div style={{ fontSize: '2rem' }}>🚶</div>
      <div>
        <Text variant="h3" style={{ margin: '0 0 8px' }}>
          Couldn't connect to the lobby
        </Text>
        <Text variant="caption" color="muted" style={{ maxWidth: 360 }}>
          This is usually a network or Firebase configuration issue.
          Check your connection and try again.
        </Text>
        {error.message && (
          <Text variant="micro" color="muted" style={{ margin: '8px 0 0', fontFamily: 'monospace' }}>
            {error.message}
          </Text>
        )}
      </div>
      <div style={{ display: 'flex', gap: 12 }}>
        <Button variant="primary" onClick={reset}>Try Again</Button>
        <a
          href="/"
          style={{
            padding: '10px 20px', borderRadius: 6,
            border: '1px solid #2a2a2a', background: 'transparent',
            color: '#e8e8e8', fontWeight: 500, fontSize: '0.875rem',
            textDecoration: 'none', display: 'inline-flex', alignItems: 'center',
          }}
        >
          Back to Home
        </a>
      </div>
    </div>
  );
}
