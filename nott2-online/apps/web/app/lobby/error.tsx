'use client';

import { useEffect } from 'react';

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
      <div style={{ fontSize: '2rem' }}>🚪</div>
      <div>
        <h2 style={{ margin: '0 0 8px', fontSize: '1.125rem', fontWeight: 600 }}>
          Couldn't connect to the lobby
        </h2>
        <p style={{ margin: 0, fontSize: '0.875rem', color: '#6a6a6a', maxWidth: 360 }}>
          This is usually a network or Firebase configuration issue.
          Check your connection and try again.
        </p>
        {error.message && (
          <p style={{ margin: '8px 0 0', fontSize: '0.75rem', color: '#3a3a3a', fontFamily: 'monospace' }}>
            {error.message}
          </p>
        )}
      </div>
      <div style={{ display: 'flex', gap: 12 }}>
        <button
          onClick={reset}
          style={{
            padding: '10px 20px', borderRadius: 6, border: 'none',
            background: '#dc2626', color: '#fff', fontWeight: 600,
            fontSize: '0.875rem', cursor: 'pointer',
          }}
        >
          Try Again
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
          Back to Home
        </a>
      </div>
    </div>
  );
}
