import { Suspense } from 'react';
import LobbyPageInner from './page';

// useSearchParams() requires Suspense in Next.js 13+ App Router
export default function LobbyLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div style={{ minHeight: '100dvh', background: '#080808' }} />}>
      {children}
    </Suspense>
  );
}
