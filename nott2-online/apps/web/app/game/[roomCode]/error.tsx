'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Text, Button } from '@nott2/design-system';

/**
 * Game Route Error Boundary — /game/[roomCode]
 *
 * Catches errors inside the live multiplayer game surface.
 * Offers two recovery paths: reconnect (re-render in-place)
 * or leave (navigate back to home and reset).
 */
export default function GameError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[GameError]', error);
  }, [error]);

  return (
    <div style={{
      minHeight: '100dvh', background: '#080808', color: '#e8e8e8',
      fontFamily: 'var(--font-body, system-ui, sans-serif)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      gap: 24, padding: 32, textAlign: 'center',
    }}>
      <div style={{ fontSize: '2.5rem', lineHeight: 1 }}>💀</div>
      <div>
        <Text variant="h3" style={{ margin: '0 0 8px' }}>
          The game encountered an error
        </Text>
        <Text variant="caption" color="muted" style={{ maxWidth: 380 }}>
          Your game state is stored in Firebase and may still be intact.
          Try reconnecting first — if that fails, return to the lobby.
        </Text>
        {error.digest && (
          <Text variant="micro" color="muted" style={{ margin: '8px 0 0', fontFamily: 'monospace' }}>
            {error.digest}
          </Text>
        )}
      </div>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
        <Button variant="primary" onClick={reset}>Reconnect</Button>
        <a
          href="/"
          style={{
            padding: '10px 20px', borderRadius: 6,
            border: '1px solid #2a2a2a', background: 'transparent',
            color: '#e8e8e8', fontWeight: 500, fontSize: '0.875rem',
            textDecoration: 'none', display: 'inline-flex', alignItems: 'center',
          }}
        >
          Leave Game
        </a>
      </div>
    </div>
  );
}
