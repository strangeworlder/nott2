/**
 * Game Route Loading Skeleton — /game/[roomCode]
 *
 * Two-column layout matching GameShell structure, so there's
 * no layout shift when the real component hydrates.
 */
export default function GameLoading() {
  return (
    <div style={{
      minHeight: '100dvh', background: '#080808', display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Header skeleton */}
      <div style={{
        height: 52, background: '#0f0f0f', borderBottom: '1px solid #1a1a1a',
        display: 'flex', alignItems: 'center', gap: 16, padding: '0 20px',
      }}>
        <div className="skel" style={{ width: 180, height: 18, borderRadius: 4 }} />
        <div className="skel" style={{ width: 80, height: 18, borderRadius: 4, marginLeft: 'auto' }} />
      </div>

      {/* Two-column body */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 320px', gap: 0, overflow: 'hidden' }}>
        {/* Main column */}
        <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Game board placeholder */}
          <div className="skel" style={{ height: 110, borderRadius: 8 }} />
          {/* Phase panel placeholder */}
          <div className="skel" style={{ flex: 1, borderRadius: 8, minHeight: 300 }} />
        </div>
        {/* Sidebar */}
        <div style={{ borderLeft: '1px solid #1a1a1a', padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="skel" style={{ height: 200, borderRadius: 8 }} />
          <div className="skel" style={{ flex: 1, borderRadius: 8 }} />
        </div>
      </div>

      {/* Character bar skeleton */}
      <div style={{
        height: 80, background: '#0f0f0f', borderTop: '1px solid #1a1a1a',
        display: 'flex', alignItems: 'center', gap: 12, padding: '0 16px',
      }}>
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="skel" style={{ width: 90, height: 54, borderRadius: 8 }} />
        ))}
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
