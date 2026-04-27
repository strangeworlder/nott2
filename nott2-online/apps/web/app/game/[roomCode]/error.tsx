'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

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
        <h2 style={{ margin: '0 0 8px', fontSize: '1.125rem', fontWeight: 600 }}>
          The game encountered an error
        </h2>
        <p style={{ margin: 0, fontSize: '0.875rem', color: '#6a6a6a', maxWidth: 380 }}>
          Your game state is stored in Firebase and may still be intact.
          Try reconnecting first — if that fails, return to the lobby.
        </p>
        {error.digest && (
          <p style={{ margin: '8px 0 0', fontSize: '0.7rem', color: '#3a3a3a', fontFamily: 'monospace' }}>
            {error.digest}
          </p>
        )}
      </div>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
        <button
          onClick={reset}
          style={{
            padding: '10px 20px', borderRadius: 6, border: 'none',
            background: '#dc2626', color: '#fff', fontWeight: 600,
            fontSize: '0.875rem', cursor: 'pointer',
          }}
        >
          Reconnect
        </button>
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
