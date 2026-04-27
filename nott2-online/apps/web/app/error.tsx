'use client';

import { useEffect } from 'react';

/**
 * Root Error Boundary — catches unhandled errors across all routes.
 *
 * Next.js renders this when any Server Component or Client Component
 * in the tree throws. The `reset` function re-renders the segment,
 * giving the player a chance to recover without a full page reload.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to console in dev; swap for a monitoring service in production.
    console.error('[GlobalError]', error);
  }, [error]);

  return (
    <html lang="en">
      <body style={{ margin: 0, background: '#080808', color: '#e8e8e8', fontFamily: 'system-ui, sans-serif' }}>
        <div style={{
          minHeight: '100dvh', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 24, padding: 32,
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '2rem' }}>⚠</div>
          <div>
            <h1 style={{ margin: '0 0 8px', fontSize: '1.25rem', fontWeight: 600, color: '#e8e8e8' }}>
              Something went wrong
            </h1>
            <p style={{ margin: 0, fontSize: '0.875rem', color: '#6a6a6a', maxWidth: 360 }}>
              An unexpected error occurred. Your game state may still be intact.
            </p>
            {error.digest && (
              <p style={{ margin: '8px 0 0', fontSize: '0.7rem', color: '#3a3a3a', fontFamily: 'monospace' }}>
                Error ID: {error.digest}
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
      </body>
    </html>
  );
}
