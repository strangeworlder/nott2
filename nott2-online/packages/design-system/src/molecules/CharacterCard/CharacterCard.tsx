/**
 * CharacterCard
 *
 * Philosophical:
 * A single player's status on the stage. It shows their identity, their suffering
 * (strikes), their luck (genre points), and their readiness (Ace token). It is a
 * presentational container, not an interactive button — the game's flow dictates
 * who is in the spotlight, not the player's clicks.
 *
 * Technical:
 * A molecule encapsulating PlayerAvatar, StrikeIndicator, PlayingCard (for Ace token),
 * and Badge (for genre points).
 *
 * Props:
 * - name: Player display name.
 * - suit: Player's assigned suit ('Spades' | 'Hearts' | 'Clubs' | 'Diamonds').
 * - strikes: Strike count (0-3).
 * - genrePoints: Number of GP to display. Defaults to 0.
 * - isActive: Red glow highlight. Defaults to false.
 * - isDead: Greyed out state. Defaults to false.
 * - hasAceToken: Whether to show the Ace token. Defaults to false.
 * - hasActed: Whether the Ace token is flipped face-down. Defaults to false.
 */

import React from 'react';
import { PlayerAvatar } from '../PlayerAvatar/PlayerAvatar';
import { StrikeIndicator } from '../StrikeIndicator/StrikeIndicator';
import { PlayingCard } from '../PlayingCard/PlayingCard';
import { Icon } from '../../atoms/Icon/Icon';
import { Badge } from '../../atoms/Badge/Badge';
import {
  charCard, charCardInner, charCardActive, charCardDead,
  aceToken, aceTokenAvailable, aceTokenActed,
} from './CharacterCard.css';

export interface CharacterCardProps {
  name: string;
  suit: string;
  strikes: 0 | 1 | 2 | 3;
  genrePoints?: number;
  isActive?: boolean;
  isDead?: boolean;
  hasAceToken?: boolean;
  hasActed?: boolean;
  id?: string;
}

export function CharacterCard({
  name,
  suit,
  strikes,
  genrePoints = 0,
  isActive = false,
  isDead = false,
  hasAceToken = false,
  hasActed = false,
  id,
}: CharacterCardProps) {
  const cardClass = [
    charCard,
    isActive ? charCardActive : '',
    isDead ? charCardDead : '',
  ].filter(Boolean).join(' ');

  return (
    <div
      id={id}
      className={cardClass}
      aria-current={isActive ? 'true' : undefined}
      aria-label={`${name} — ${strikes} strikes${isDead ? ' — dead' : ''}`}
    >
      {hasAceToken && (
        <div className={[
          aceToken,
          !hasActed && !isDead ? aceTokenAvailable : '',
          hasActed || isDead ? aceTokenActed : '',
        ].filter(Boolean).join(' ')}>
          <PlayingCard
            suit={suit as 'Spades' | 'Hearts' | 'Clubs' | 'Diamonds'}
            rank={1}
            micro
            faceDown={hasActed || isDead}
          />
        </div>
      )}
      <div className={charCardInner}>
        {isDead && <Icon name="strike_dead" size={14} color="red" />}
        <PlayerAvatar
          name={name}
          suit={suit}
          isActivePlayer={isActive}
          isConnected={!isDead}
          size="sm"
        />
        <StrikeIndicator strikes={strikes} isDead={isDead} />
        {genrePoints > 0 ? <Badge variant="warning">{genrePoints} GP</Badge> : null}
      </div>
    </div>
  );
}
