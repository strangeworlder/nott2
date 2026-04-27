import type { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Lobby — Night of the Thirteenth 2',
  description: 'Create or join a multiplayer game session.',
  robots: { index: false, follow: false },
};

/** Skeleton matching the lobby two-column layout */
function LobbySkeleton() {
  return (
    <div style={{ minHeight: '100dvh', background: '#080808', display: 'flex', flexDirection: 'column' }}>
      {/* Header bar */}
      <div style={{
        height: 52, background: '#0f0f0f', borderBottom: '1px solid #1a1a1a',
        display: 'flex', alignItems: 'center', padding: '0 24px', gap: 16,
      }}>
        <div className="skel" style={{ width: 160, height: 16, borderRadius: 4 }} />
      </div>
      {/* Body */}
      <div style={{ flex: 1, maxWidth: 760, margin: '40px auto', width: '100%', padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div className="skel" style={{ height: 56, borderRadius: 8 }} />
        <div className="skel" style={{ height: 200, borderRadius: 8 }} />
        <div className="skel" style={{ height: 120, borderRadius: 8 }} />
      </div>
      <style>{`
        .skel {
          background: linear-gradient(90deg, #1a1a1a 25%, #222 50%, #1a1a1a 75%);
          background-size: 200% 100%;
          animation: skel-shimmer 1.4s ease-in-out infinite;
        }
        @keyframes skel-shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .skel { animation: none; background: #1a1a1a; }
        }
      `}</style>
    </div>
  );
}

// useSearchParams() requires Suspense in Next.js 13+ App Router
export default function LobbyLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<LobbySkeleton />}>
      {children}
    </Suspense>
  );
}
