// @nott2/design-system — Public API barrel
// The definitive list of everything exported from this package.

// Tokens
export { vars, darkTheme } from './tokens/theme.css';

// ── Atoms ─────────────────────────────────────────────────────────────────────
export { Text } from './atoms/Text/Text';
export { Button } from './atoms/Button/Button';
export { Icon } from './atoms/Icon/Icon';
export type { IconName } from './atoms/Icon/Icon';
export { Badge } from './atoms/Badge/Badge';
export { Toggle } from './atoms/Toggle/Toggle';
export { Separator } from './atoms/Separator/Separator';

// ── Molecules ─────────────────────────────────────────────────────────────────
export { PlayingCard } from './molecules/PlayingCard/PlayingCard';
export type { Suit, Rank } from './molecules/PlayingCard/PlayingCard';

export { Card } from './molecules/Card/Card';
export type { CardVariant } from './molecules/Card/Card';

export { ActionFooter } from './molecules/ActionFooter/ActionFooter';

export { PlayerAvatar } from './molecules/PlayerAvatar/PlayerAvatar';
export type { AvatarSize } from './molecules/PlayerAvatar/PlayerAvatar';

export { StrikeIndicator } from './molecules/StrikeIndicator/StrikeIndicator';

export { DieSelector } from './molecules/DieSelector/DieSelector';

// ── Organisms ─────────────────────────────────────────────────────────────────
export { GameBoard } from './organisms/GameBoard/GameBoard';

export { ChatPanel } from './organisms/ChatPanel/ChatPanel';
export type { ChatMessage, MessageType } from './organisms/ChatPanel/ChatPanel';

export { Header } from './organisms/Header/Header';

export { PlayerPanel } from './organisms/PlayerPanel/PlayerPanel';

export { PhaseDisplay } from './organisms/PhaseDisplay/PhaseDisplay';

// Version
export const DESIGN_SYSTEM_VERSION = '0.0.0';
