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
 * - onSelectCharacter: Called with characterId when a card is clicked.
 * - id: Optional id attribute.
 *
 * Events:
 * - onSelectCharacter(characterId: string): fired when a living character is selected.
 */

import React from 'react';
import { PlayerAvatar } from '../../molecules/PlayerAvatar/PlayerAvatar';
import { StrikeIndicator } from '../../molecules/StrikeIndicator/StrikeIndicator';
import { PlayingCard } from '../../molecules/PlayingCard/PlayingCard';
import { Icon } from '../../atoms/Icon/Icon';
import {
  barRoot, barInner, charCard, charCardInner, charCardActive, charCardDead,
  gpBadge, genrePool, genrePoolLabel, genrePoolCount,
  aceToken, aceTokenAvailable, aceTokenActed,
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
  onSelectCharacter: (characterId: string) => void;
  id?: string;
}

export function CharacterBar({
  characters,
  activeCharacterId,
  genrePoints,
  tableGenrePoints,
  onSelectCharacter,
  id,
}: CharacterBarProps) {
  return (
    <footer id={id} className={barRoot}>
      <div className={barInner}>
        {characters.map(c => {
          const isActive = activeCharacterId === c.id;
          const gp = genrePoints[c.id] ?? 0;
          const cardClass = [
            charCard,
            isActive ? charCardActive : '',
            c.isDead ? charCardDead : '',
          ].filter(Boolean).join(' ');

          return (
            <button
              key={c.id}
              className={cardClass}
              onClick={() => !c.isDead && onSelectCharacter(c.id)}
              disabled={c.isDead}
              aria-pressed={isActive}
              aria-label={`${c.name} — ${c.strikes} strikes${c.isDead ? ' — dead' : ''}`}
            >
              {c.hasAceToken && (
                <div className={[
                  aceToken,
                  !c.hasActed && !c.isDead ? aceTokenAvailable : '',
                  c.hasActed || c.isDead ? aceTokenActed : '',
                ].filter(Boolean).join(' ')}>
                  <PlayingCard
                    suit={c.id as 'Spades' | 'Hearts' | 'Clubs' | 'Diamonds'}
                    rank={1}
                    micro
                    faceDown={c.hasActed || c.isDead}
                  />
                </div>
              )}
              <div className={charCardInner}>
                <PlayerAvatar
                  name={c.isDead ? `☠ ${c.name}` : c.name}
                  suit={c.id}
                  isActivePlayer={isActive}
                  isConnected={!c.isDead}
                  size="sm"
                />
                <StrikeIndicator strikes={c.strikes} isDead={c.isDead} />
                <div className={gpBadge}>{gp > 0 ? `${gp} GP` : '\u00a0'}</div>
              </div>
            </button>
          );
        })}
      </div>

      <div className={genrePool} aria-label={`Genre Pool: ${tableGenrePoints} tokens`}>
        <span className={genrePoolLabel}>Genre Pool</span>
        <span className={genrePoolCount}>{tableGenrePoints}</span>
        <span className={genrePoolLabel}>tokens</span>
      </div>
    </footer>
  );
}
