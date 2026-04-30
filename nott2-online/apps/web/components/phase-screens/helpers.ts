/**
 * PhaseScreens — Shared helpers.
 *
 * Utilities used across multiple phase screen components.
 */

export const FACE_LABEL: Record<number, string> = { 11: 'Jack', 12: 'Queen', 13: 'King' };

export function getRankLabel(rank: number) {
  if (rank === 1) return 'Ace';
  return FACE_LABEL[rank] ?? String(rank);
}
