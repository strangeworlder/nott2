import type { Metadata } from 'next';

/**
 * Game route layout.
 * Private page — no indexing by search engines.
 */
export const metadata: Metadata = {
  title: 'Game — Night of the Thirteenth 2',
  robots: { index: false, follow: false },
};

export default function GameLayout({ children }: { children: React.ReactNode }) {
  return children;
}
