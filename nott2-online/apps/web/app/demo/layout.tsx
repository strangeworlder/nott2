/**
 * Demo Page — /demo
 *
 * The main layout for the single-player demo mode. Orchestrates all phase
 * screens and the persistent character bar at the bottom.
 */

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Demo Mode — Night of the Thirteenth 2',
  description: 'Single-player demo for Night of the Thirteenth 2. Test the full game loop offline.',
};

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return children;
}
