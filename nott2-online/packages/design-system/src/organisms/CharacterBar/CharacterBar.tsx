/**
 * CharacterBar (Organism — Presentational)
 *
 * Philosophical:
 * The playbill at the bottom of the stage. Four characters, always visible,
 * always watching. The active player glows red — the camera is on them.
 * The dead are greyed out and silent. Genre points shimmer amber, a reminder
 * that even victims can spend their luck. This bar is the emotional register
 * of who is still alive, and who you might be about to lose.
 *
 * Technical:
 * A fully presentational organism — no store connections. Receives characters,
 * genre points, the active player id, and a click handler via props.
 * Store binding lives in the app layer (CharacterBar.tsx wrapper).
 * Uses DS PlayerAvatar and StrikeIndicator molecules internally.
 *
 * Props:
 * - characters: Array of character display data.
 * - activeCharacterId: The id of the currently active player's character.
 * - genrePoints: Record<charId, number> of per-player genre points.
 * - tableGenrePoints: The shared genre pool count.
 * - id: Optional id attribute.
 */

import React from 'react';
import { CharacterCard } from '../../molecules/CharacterCard/CharacterCard';
import {
  barRoot, barInner,
  genrePool, genrePoolLabel, genrePoolCount,
} from './CharacterBar.css';

export interface CharacterBarCharacter {
  id: string;
  name: string;
  strikes: 0 | 1 | 2 | 3;
  isDead: boolean;
  /** Whether this character's Ace has been resolved into a turn token (false during Prologue). */
  hasAceToken?: boolean;
  /** Whether this player has acted this round (Ace flipped face-down). */
  hasActed?: boolean;
}

interface CharacterBarProps {
  characters: CharacterBarCharacter[];
  activeCharacterId: string | null;
  genrePoints: Record<string, number>;
  tableGenrePoints: number;
  id?: string;
}

export function CharacterBar({
  characters,
  activeCharacterId,
  genrePoints,
  tableGenrePoints,
  id,
}: CharacterBarProps) {
  return (
    <footer id={id} className={barRoot}>
      <div className={barInner}>
        {characters.map(c => (
          <CharacterCard
            key={c.id}
            id={`character-card-${c.id}`}
            name={c.name}
            suit={c.id}
            strikes={c.strikes}
            isDead={c.isDead}
            isActive={activeCharacterId === c.id}
            hasAceToken={c.hasAceToken}
            hasActed={c.hasActed}
            genrePoints={genrePoints[c.id]}
          />
        ))}
      </div>

      <div className={genrePool} aria-label={`Genre Pool: ${tableGenrePoints} tokens`}>
        <span className={genrePoolLabel}>Genre Pool</span>
        <span className={genrePoolCount}>{tableGenrePoints}</span>
        <span className={genrePoolLabel}>tokens</span>
      </div>
    </footer>
  );
}
