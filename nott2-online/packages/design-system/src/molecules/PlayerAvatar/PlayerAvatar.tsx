/**
 * PlayerAvatar
 *
 * Philosophical:
 * This is the player's face at the table — their identity, their suit, their
 * connection to the horror unfolding. The active-player glow is an accusation.
 *
 * Technical:
 * Displays a character's suit symbol, name, online indicator, and active state.
 * Three sizes for use in the character bar (sm), player panels (md), and the
 * full lobby (lg).
 *
 * Props:
 * - name: Player display name.
 * - suitSymbol: Single character suit symbol (♠ ♥ ♣ ♦).
 * - characterName: The character's archetype name.
 * - isActivePlayer: Red glow highlight. Defaults to false.
 * - isConnected: Online indicator. Defaults to true.
 * - size: Scale variant. Defaults to 'md'.
 */

import React from 'react';
import { avatarRecipe, avatarSymbol, avatarName, avatarMeta, onlineIndicator } from './PlayerAvatar.css';

export type AvatarSize = 'sm' | 'md' | 'lg';

interface PlayerAvatarProps {
  name: string;
  suitSymbol: string;
  characterName?: string;
  isActivePlayer?: boolean;
  isConnected?: boolean;
  size?: AvatarSize;
  id?: string;
}

export function PlayerAvatar({
  name,
  suitSymbol,
  characterName,
  isActivePlayer = false,
  isConnected = true,
  size = 'md',
  id,
}: PlayerAvatarProps) {
  return (
    <div id={id} className={avatarRecipe({ size, active: isActivePlayer })}>
      <div className={avatarSymbol}>{suitSymbol}</div>
      <div className={avatarMeta}>
        <span className={avatarName}>{name}</span>
        {characterName && <span style={{ fontSize: '0.625rem', color: 'var(--color-text-muted, #6a6a6a)' }}>{characterName}</span>}
      </div>
      <div className={onlineIndicator} data-online={isConnected} aria-label={isConnected ? 'Online' : 'Offline'} />
    </div>
  );
}
