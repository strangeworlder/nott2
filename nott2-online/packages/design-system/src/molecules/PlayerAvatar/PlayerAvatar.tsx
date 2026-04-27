/**
 * PlayerAvatar
 *
 * Philosophical:
 * This is the player's face at the table — their identity, their suit, their
 * connection to the horror unfolding. The active-player glow is an accusation.
 *
 * Technical:
 * Displays a character's suit icon, name, online indicator, and active state.
 * Three sizes for use in the character bar (sm), player panels (md), and the
 * full lobby (lg). The suit is rendered via the Icon component for consistent
 * visual treatment across the application.
 *
 * Props:
 * - name: Player display name.
 * - suit: Suit identifier ('Spades' | 'Hearts' | 'Clubs' | 'Diamonds').
 * - characterName: The character's archetype name.
 * - isActivePlayer: Red glow highlight. Defaults to false.
 * - isConnected: Online indicator. Defaults to true.
 * - size: Scale variant. Defaults to 'md'.
 */

import React from 'react';
import { avatarRecipe, avatarSymbol, avatarName, avatarMeta, onlineIndicator } from './PlayerAvatar.css';
import { Icon, suitToIconName } from '../../atoms/Icon/Icon';

export type AvatarSize = 'sm' | 'md' | 'lg';

const SUIT_ICON_SIZE: Record<AvatarSize, number> = { sm: 18, md: 24, lg: 32 };

interface PlayerAvatarProps {
  name: string;
  /** @deprecated Use `suit` instead. Kept for backward compatibility. */
  suitSymbol?: string;
  /** Suit identifier — renders as an Icon internally. */
  suit?: string;
  characterName?: string;
  isActivePlayer?: boolean;
  isConnected?: boolean;
  size?: AvatarSize;
  id?: string;
}

export function PlayerAvatar({
  name,
  suitSymbol,
  suit,
  characterName,
  isActivePlayer = false,
  isConnected = true,
  size = 'md',
  id,
}: PlayerAvatarProps) {
  // Resolve suit: prefer `suit` prop, fall back to suitSymbol reverse-lookup
  const resolvedSuit = suit ?? suitSymbolToSuit(suitSymbol);

  return (
    <div id={id} className={avatarRecipe({ size, active: isActivePlayer })}>
      <div className={avatarSymbol}>
        {resolvedSuit ? (
          <Icon name={suitToIconName(resolvedSuit)} size={SUIT_ICON_SIZE[size]} />
        ) : (
          '?'
        )}
      </div>
      <div className={avatarMeta}>
        <span className={avatarName}>{name}</span>
        {characterName && <span style={{ fontSize: '0.625rem', color: 'var(--color-text-muted, #6a6a6a)' }}>{characterName}</span>}
      </div>
      <div className={onlineIndicator} data-online={isConnected} aria-label={isConnected ? 'Online' : 'Offline'} />
    </div>
  );
}

/** Reverse-map a text suit symbol back to a suit name (backward compat). */
function suitSymbolToSuit(symbol?: string): string | undefined {
  if (!symbol) return undefined;
  const map: Record<string, string> = { '♠': 'Spades', '♥': 'Hearts', '♣': 'Clubs', '♦': 'Diamonds' };
  return map[symbol];
}
