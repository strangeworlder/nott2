/**
 * CharacterBar — always-visible strip at the bottom of the game surface.
 *
 * Shows all four characters with their strikes, active player indicator,
 * and genre point counters. Clicking a character sets them as the AP.
 *
 * Shared between solo demo and multiplayer game routes.
 * Uses design system PlayerAvatar + StrikeIndicator molecules.
 */

'use client';

import { useGameStore } from '../store/game-store';
import { PlayerAvatar, StrikeIndicator } from '@nott2/design-system';
import type { Character } from '@nott2/game-engine';

const SUIT_SYMBOL: Record<string, string> = {
  Spades: '♠', Hearts: '♥', Clubs: '♣', Diamonds: '♦',
};

function CharCard({ character }: { character: Character }) {
  const { gameState, setActivePlayer } = useGameStore();
  const { players, scene, playerGenrePoints } = gameState;

  const playerId = players.find(p => p.characterId === character.id)?.id ?? '';
  const isActive = scene.activePlayerId === playerId;
  const gp = playerGenrePoints[playerId] ?? 0;

  return (
    <button
      className={[
        'char-card',
        isActive ? 'char-card--active' : '',
        character.isDead ? 'char-card--dead' : '',
      ].join(' ')}
      onClick={() => !character.isDead && setActivePlayer(character.id)}
      disabled={character.isDead}
      aria-pressed={isActive}
      aria-label={`${character.name} — ${character.strikes} strikes${character.isDead ? ' — dead' : ''}`}
    >
      <PlayerAvatar
        name={character.isDead ? `☠ ${character.name}` : character.name}
        suitSymbol={SUIT_SYMBOL[character.id]}
        isActivePlayer={isActive}
        isConnected={!character.isDead}
        size="sm"
      />
      <div style={{ marginTop: 4 }}>
        <StrikeIndicator
          strikes={character.strikes as 0 | 1 | 2 | 3}
          isDead={character.isDead}
        />
      </div>
      {gp > 0 && (
        <div style={{ fontSize: '0.6rem', marginTop: 4, color: 'var(--color-warning)' }}>
          {gp} GP
        </div>
      )}
    </button>
  );
}

export default function CharacterBar() {
  const { gameState } = useGameStore();
  const { characters, tableGenrePoints } = gameState;

  return (
    <footer className="char-bar">
      <div className="char-bar__inner">
        {characters.map(c => (
          <CharCard key={c.id} character={c} />
        ))}
      </div>
      <div className="gp-bar">
        <span className="gp-label">Genre Pool</span>
        <span className="gp-count">{tableGenrePoints}</span>
        <span className="gp-label" style={{ marginLeft: 16 }}>tokens remaining</span>
      </div>
    </footer>
  );
}
