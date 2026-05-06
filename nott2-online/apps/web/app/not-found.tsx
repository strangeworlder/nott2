'use client';

import { Text } from '@nott2/design-system';

export default function NotFound() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontFamily: 'sans-serif', color: '#e8e8e8', background: '#0a0a0a', gap: 16 }}>
      <Text variant="h1" color="red" style={{ margin: 0 }}>404</Text>
      <Text variant="body" color="muted">You shouldn&apos;t be here.</Text>
      <Text as="a" href="/demo" variant="body" color="red" style={{ textDecoration: 'none' }}>→ Go to Demo</Text>
    </div>
  );
}
