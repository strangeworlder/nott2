/**
 * Demo Page — /demo
 *
 * Single-player solo mode. Uses the exact same GameShell layout as the
 * multiplayer /game/[roomCode] route — same game board, same phase screens,
 * same character bar. The only difference: no Firebase, no video, and the
 * sidebar shows the DebugPanel instead of video + chat.
 *
 * This ensures the demo is a faithful representation of the real game
 * surface, making it viable for development and testing.
 */

'use client';

import '../game/[roomCode]/game.css';
import './demo.css';
import { GameShell } from '../../components/GameShell';

export default function DemoPage() {
  return <GameShell mode="solo" />;
}
