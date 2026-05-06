/**
 * Root Loading Skeleton
 *
 * Shown by Next.js during initial server-render streaming.
 * Dark background matching the game's aesthetic — no flash of white.
 */
'use client';
import { Text } from '@nott2/design-system';

export default function RootLoading() {
  return (
    <div
      style={{
        minHeight: '100dvh',
        background: '#080808',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      aria-label="Loading…"
      role="status"
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        {/* Pulsing logo placeholder */}
        <div style={{
          width: 64, height: 64, borderRadius: '50%',
          background: 'rgba(220, 38, 38, 0.15)',
          border: '1px solid rgba(220, 38, 38, 0.3)',
          animation: 'nott-pulse 1.5s ease-in-out infinite',
        }} />
        <Text variant="micro" color="muted" as="span">
          LOADING
        </Text>
      </div>
      <style>{`
        @keyframes nott-pulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.08); }
        }
        @media (prefers-reduced-motion: reduce) {
          @keyframes nott-pulse { 0%, 100% { opacity: 0.6; } }
        }
      `}</style>
    </div>
  );
}
