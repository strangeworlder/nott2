/**
 * DebugPanel — collapsible dev panel for testing engine state.
 *
 * Full deck state visibility + debug controls (skip to Act 3,
 * add weakness, kill character, manual trophy override).
 */

'use client';

import { useState } from 'react';
import { useGameStore } from '../store/game-store';
import type { Suit } from '@nott2/game-engine';

const SUITS: Suit[] = ['Spades', 'Hearts', 'Clubs', 'Diamonds'];
const SUIT_SYMBOL: Record<string, string> = { Spades: '♠', Hearts: '♥', Clubs: '♣', Diamonds: '♦' };

function cardLabel(c: { id: string; rank: number; suit: string }): string {
  const rankNames: Record<number, string> = { 1: 'A', 11: 'J', 12: 'Q', 13: 'K', 14: '🃏R', 15: '🃏B' };
  const rankStr = rankNames[c.rank] ?? `${c.rank}`;
  return `${SUIT_SYMBOL[c.suit] ?? ''}${rankStr}`;
}

export default function DebugPanel() {
  const [open, setOpen] = useState(false);
  const { gameState, computed, skipToAct3, addWeakness, killCharacter, applyFinale } = useGameStore();
  const { deck } = gameState;

  return (
    <div className="debug-panel">
      <button
        className="debug-panel__header"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
      >
        <span className="debug-panel__title">🔧 Debug Panel</span>
        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="debug-panel__body">
          {/* Stats grid */}
          <div className="debug-grid">
            <div className="debug-stat">
              <div className="debug-stat__key">Phase</div>
              <div className="debug-stat__val">{gameState.phase}</div>
            </div>
            <div className="debug-stat">
              <div className="debug-stat__key">Act</div>
              <div className="debug-stat__val">{gameState.currentAct}</div>
            </div>
            <div className="debug-stat">
              <div className="debug-stat__key">Reserve Added</div>
              <div className="debug-stat__val">{deck.cardsAddedFromReserve}/13</div>
            </div>
            <div className="debug-stat">
              <div className="debug-stat__key">Act 3 Countdown</div>
              <div className="debug-stat__val">{computed.act3Countdown}</div>
            </div>
            <div className="debug-stat">
              <div className="debug-stat__key">Threat Deck</div>
              <div className="debug-stat__val">{deck.threatDeck.length} cards</div>
            </div>
            <div className="debug-stat">
              <div className="debug-stat__key">Reserve</div>
              <div className="debug-stat__val">{deck.reserve.length} cards</div>
            </div>
            <div className="debug-stat">
              <div className="debug-stat__key">Face Reserve</div>
              <div className="debug-stat__val">
                J:{deck.faceCardReserve.filter(c => c.rank === 11).length}{' '}
                Q:{deck.faceCardReserve.filter(c => c.rank === 12).length}{' '}
                K:{deck.faceCardReserve.filter(c => c.rank === 13).length}
              </div>
            </div>
            <div className="debug-stat">
              <div className="debug-stat__key">Visible</div>
              <div className="debug-stat__val">
                {deck.visibleCards.map(c => cardLabel(c)).join(', ') || '—'}
              </div>
            </div>
            <div className="debug-stat">
              <div className="debug-stat__key">Prologue</div>
              <div className="debug-stat__val">{computed.isPrologue ? 'Yes' : 'No'}</div>
            </div>
            <div className="debug-stat">
              <div className="debug-stat__key">Trophy Top</div>
              <div className="debug-stat__val">
                {deck.trophyTop
                  ? cardLabel(deck.trophyTop)
                  : '—'}
              </div>
            </div>
            <div className="debug-stat">
              <div className="debug-stat__key">Weaknesses</div>
              <div className="debug-stat__val">{deck.weaknessesBySuit.size}/4</div>
            </div>
            <div className="debug-stat">
              <div className="debug-stat__key">Removed</div>
              <div className="debug-stat__val">{deck.removedCards.length} cards</div>
            </div>
            <div className="debug-stat">
              <div className="debug-stat__key">Strikes Pending</div>
              <div className="debug-stat__val">{gameState.strikesToAssign}</div>
            </div>
            <div className="debug-stat">
              <div className="debug-stat__key">Jokers Added</div>
              <div className="debug-stat__val">{gameState.jokersAdded ? 'Yes' : 'No'}</div>
            </div>
            <div className="debug-stat">
              <div className="debug-stat__key">Turn Order</div>
              <div className="debug-stat__val">
                ✅{gameState.turnOrder.available.map(s => SUIT_SYMBOL[s]).join('')}
                {gameState.turnOrder.acted.length > 0 && (
                  <> 🔽{gameState.turnOrder.acted.map(s => SUIT_SYMBOL[s]).join('')}</>
                )}
              </div>
            </div>
          </div>

          <hr className="divider" />

          {/* Weaknesses */}
          <div>
            <div className="label-sm" style={{ marginBottom: 8 }}>Weaknesses Found</div>
            <div className="weakness-row">
              {SUITS.map(s => (
                <div
                  key={s}
                  className={`weakness-pip ${deck.weaknessesBySuit.has(s) ? 'weakness-pip--found' : ''}`}
                >
                  {SUIT_SYMBOL[s]} {s}
                </div>
              ))}
            </div>
          </div>

          <hr className="divider" />

          {/* Debug actions */}
          <div>
            <div className="label-sm" style={{ marginBottom: 8 }}>Quick Controls</div>
            <div className="debug-actions">
              <button className="btn btn--ghost btn--sm" onClick={skipToAct3}>
                ⏩ Skip to Act 3
              </button>
              <button className="btn btn--ghost btn--sm" onClick={applyFinale}>
                ☠️ Trigger Finale
              </button>
              {SUITS.filter(s => !deck.weaknessesBySuit.has(s)).map(s => (
                <button
                  key={s}
                  className="btn btn--ghost btn--sm"
                  onClick={() => addWeakness(s)}
                >
                  + {SUIT_SYMBOL[s]} Weakness
                </button>
              ))}
              {gameState.characters.filter(c => !c.isDead).map(c => (
                <button
                  key={c.id}
                  className="btn btn--ghost btn--sm"
                  style={{ borderColor: 'var(--color-accent)' }}
                  onClick={() => killCharacter(c.id)}
                >
                  ☠ Kill {SUIT_SYMBOL[c.id]}
                </button>
              ))}
            </div>
          </div>

          {/* Threat deck breakdown */}
          <div>
            <div className="label-sm" style={{ marginBottom: 6 }}>Threat Deck (top → bottom)</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>
              {deck.threatDeck.map(c => cardLabel(c)).join(' → ') || 'Empty'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
