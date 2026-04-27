/**
 * CardEntry — Suit + Rank selector for manually entering a physical card.
 *
 * Includes both manual entry mode and auto-deal mode.
 * Suit buttons are always available; rank pips reflect what's still drawable.
 */

'use client';

import { useState } from 'react';
import { useGameStore } from '../../store/game-store';
import type { Suit, Rank } from '@nott2/game-engine';

const SUITS: { id: Suit; symbol: string; className: string }[] = [
  { id: 'Spades',   symbol: '♠', className: 'suit-btn--spades' },
  { id: 'Hearts',   symbol: '♥', className: 'suit-btn--hearts' },
  { id: 'Clubs',    symbol: '♣', className: 'suit-btn--clubs' },
  { id: 'Diamonds', symbol: '♦', className: 'suit-btn--diamonds' },
];

const RANK_LABELS: Record<number, string> = {
  1: 'A', 11: 'J', 12: 'Q', 13: 'K',
};

const getRankLabel = (r: number) => RANK_LABELS[r] ?? String(r);

interface CardEntryProps {
  /** Called once a full card is confirmed */
  onCard: (suit: Suit, rank: Rank) => void;
  /** Which ranks are selectable (from deck state) */
  availableRanks?: number[];
  /** Show face card ranks (11-13) */
  includeFaceCards?: boolean;
  /** Show number card ranks (2-10) */
  includeNumbers?: boolean;
  /** Show aces (rank 1) */
  includeAces?: boolean;
}

export default function CardEntry({
  onCard,
  availableRanks,
  includeFaceCards = true,
  includeNumbers = true,
  includeAces = true,
}: CardEntryProps) {
  const { gameState, autoDeal } = useGameStore();
  const [suit, setSuit] = useState<Suit | null>(null);
  const [rank, setRank] = useState<Rank | null>(null);
  const [mode, setMode] = useState<'manual' | 'auto'>('auto');

  const ranks: number[] = [
    ...(includeAces ? [1] : []),
    ...(includeNumbers ? [2, 3, 4, 5, 6, 7, 8, 9, 10] : []),
    ...(includeFaceCards ? [11, 12, 13] : []),
  ];

  const isRankAvailable = (r: number) => {
    if (availableRanks) return availableRanks.includes(r);
    return true;
  };

  const isSuitRankAvailable = (s: Suit, r: number) => {
    // Card is available if it exists in the threat deck (not yet drawn/removed)
    const cardId = `${r}-${s}`;
    return gameState.deck.threatDeck.some(c => c.id === cardId);
  };

  const handleConfirm = () => {
    if (suit && rank) {
      onCard(suit, rank);
      setSuit(null);
      setRank(null);
    }
  };

  return (
    <div className="stack">
      {/* Mode toggle */}
      <div className="row">
        <button
          className={`btn btn--sm ${mode === 'auto' ? 'btn--primary' : 'btn--secondary'}`}
          onClick={() => setMode('auto')}
        >Auto-Deal</button>
        <button
          className={`btn btn--sm ${mode === 'manual' ? 'btn--primary' : 'btn--secondary'}`}
          onClick={() => setMode('manual')}
        >Manual Entry</button>
      </div>

      {mode === 'auto' ? (
        <button className="btn btn--primary btn--block" onClick={autoDeal}>
          🎴 Deal Random Card
        </button>
      ) : (
        <>
          {/* Suit selection */}
          <div>
            <span className="field-label">Suit</span>
            <div className="row" style={{ gap: 8 }}>
              {SUITS.map(s => (
                <button
                  key={s.id}
                  className={`suit-btn ${s.className} ${suit === s.id ? 'suit-btn--selected' : ''}`}
                  onClick={() => setSuit(s.id)}
                  aria-pressed={suit === s.id}
                >
                  {s.symbol}
                </button>
              ))}
            </div>
          </div>

          {/* Rank selection */}
          <div>
            <span className="field-label">Rank</span>
            <div className="card-grid">
              {ranks.map(r => {
                const disabled = !isRankAvailable(r) || (!!suit && !isSuitRankAvailable(suit, r));
                return (
                  <button
                    key={r}
                    className={`card-pip ${rank === r ? 'card-pip--selected' : ''} ${disabled ? 'card-pip--disabled' : ''}`}
                    onClick={() => !disabled && setRank(r as Rank)}
                    disabled={disabled}
                    aria-pressed={rank === r}
                  >
                    {getRankLabel(r)}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Confirm */}
          <button
            className="btn btn--primary btn--block"
            onClick={handleConfirm}
            disabled={!suit || !rank}
          >
            Draw {suit ? `${SUITS.find(s => s.id === suit)?.symbol}` : ''} {rank ? getRankLabel(rank) : '—'}
          </button>
        </>
      )}
    </div>
  );
}
