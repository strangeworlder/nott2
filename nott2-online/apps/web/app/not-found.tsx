export default function NotFound() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontFamily: 'sans-serif', color: '#e8e8e8', background: '#0a0a0a', gap: 16 }}>
      <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '3rem', color: '#dc2626', margin: 0 }}>404</h1>
      <p style={{ color: '#6a6a6a' }}>You shouldn&apos;t be here.</p>
      <a href="/demo" style={{ color: '#dc2626', textDecoration: 'none', fontSize: '0.875rem' }}>→ Go to Demo</a>
    </div>
  );
}
