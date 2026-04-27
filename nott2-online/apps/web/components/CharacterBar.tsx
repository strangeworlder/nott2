/**
 * CharacterBar (App-Level Store Wrapper)
 *
 * This is the thin store-connected wrapper around the Design System's
 * `CharacterBar` organism. It binds the game state to the presentational
 * component via props, keeping the DS component fully decoupled from the
 * Zustand store and app-level concerns.
 *
 * The DS CharacterBar in @nott2/design-system/CharacterBar owns all
 * presentation logic. This file owns only the store binding.
 */

'use client';

import { useGameStore } from '../store/game-store';
import { CharacterBar as DSCharacterBar } from '@nott2/design-system';
import type { Suit } from '@nott2/game-engine';

export default function CharacterBar() {
  const { gameState, setActivePlayer } = useGameStore();
  const { characters, players, scene, playerGenrePoints, tableGenrePoints, turnOrder, deck } = gameState;

  // A character earns their Ace token when their Ace (rank 1) has been
  // resolved and removed from the game — i.e. it appears in removedCards.
  const resolvedAceSuits = new Set(
    deck.removedCards
      .filter(card => card.rank === 1)
      .map(card => card.suit),
  );

  const mappedCharacters = characters.map(c => ({
    id: c.id,
    name: c.name,
    strikes: c.strikes as 0 | 1 | 2 | 3,
    isDead: c.isDead,
    hasAceToken: resolvedAceSuits.has(c.id as Suit),
    hasActed: turnOrder.acted.includes(c.id as Suit),
  }));

  // Map player genre points by characterId (DS expects charId → gp)
  const genrePoints: Record<string, number> = {};
  players.forEach(p => {
    genrePoints[p.characterId] = playerGenrePoints[p.id] ?? 0;
  });

  // Resolve activeCharacterId from activePlayerId
  const activePlayer = players.find(p => p.id === scene.activePlayerId);
  const activeCharacterId = activePlayer?.characterId ?? null;

  return (
    <DSCharacterBar
      characters={mappedCharacters}
      activeCharacterId={activeCharacterId}
      genrePoints={genrePoints}
      tableGenrePoints={tableGenrePoints}
      onSelectCharacter={(characterId) => setActivePlayer(characterId as Suit)}
    />
  );
}
