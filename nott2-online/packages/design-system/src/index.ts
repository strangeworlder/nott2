// @nott2/design-system — Public API barrel
// The definitive list of everything exported from this package.

// Tokens
export { vars, darkTheme } from './tokens/theme.css';

// ── Atoms ─────────────────────────────────────────────────────────────────────
export { Text } from './atoms/Text/Text';
export { Button } from './atoms/Button/Button';
export { Icon, suitToIconName } from './atoms/Icon/Icon';
export type { IconName, IconColor } from './atoms/Icon/Icon';
export { Badge } from './atoms/Badge/Badge';
export { Toggle } from './atoms/Toggle/Toggle';
export { SegmentedControl } from './atoms/SegmentedControl/SegmentedControl';
export type { SegmentOption } from './atoms/SegmentedControl/SegmentedControl';
export { Separator } from './atoms/Separator/Separator';
export { TextField } from './atoms/TextField/TextField';
export type { TextFieldProps } from './atoms/TextField/TextField';
export { TextArea } from './atoms/TextField/TextArea';
export type { TextAreaProps } from './atoms/TextField/TextArea';
export { Stack } from './atoms/Stack/Stack';
export { Row } from './atoms/Row/Row';
export { StatusCallout } from './atoms/StatusCallout/StatusCallout';
export { PhaseHeader } from './atoms/PhaseHeader/PhaseHeader';

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

export { ResultBanner } from './molecules/ResultBanner/ResultBanner';
export { EffortBand } from './molecules/EffortBand/EffortBand';
export type { EffortLevel } from './molecules/EffortBand/EffortBand';
export { DifficultyBadge } from './molecules/DifficultyBadge/DifficultyBadge';
export { DiceResult } from './molecules/DiceResult/DiceResult';
export { TrophyIndicator } from './molecules/TrophyIndicator/TrophyIndicator';
export { WeaknessTracker } from './molecules/WeaknessTracker/WeaknessTracker';
export { WaitingIndicator } from './molecules/WaitingIndicator/WaitingIndicator';
export { TabBar } from './molecules/TabBar/TabBar';

export { CardMatt } from './molecules/CardMatt/CardMatt';
export type { CardMattProps } from './molecules/CardMatt/CardMatt';

export { Deck } from './molecules/Deck/Deck';
export type { DeckStatus, TopCardInfo } from './molecules/Deck/Deck';

export { DoomClock } from './molecules/DoomClock/DoomClock';
export type { DoomClockProps } from './molecules/DoomClock/DoomClock';

export { DoomClockTransition } from './molecules/DoomClockTransition/DoomClockTransition';
export type { DoomClockTransitionProps } from './molecules/DoomClockTransition/DoomClockTransition';

// ── Organisms ─────────────────────────────────────────────────────────────────
export { GameBoard } from './organisms/GameBoard/GameBoard';

export { ChatPanel } from './organisms/ChatPanel/ChatPanel';
export type { ChatMessage, MessageType } from './organisms/ChatPanel/ChatPanel';

export { Header } from './organisms/Header/Header';

export { PlayerPanel } from './organisms/PlayerPanel/PlayerPanel';

export { PhaseDisplay } from './organisms/PhaseDisplay/PhaseDisplay';

export { CharacterBar } from './organisms/CharacterBar/CharacterBar';
export type { CharacterBarCharacter } from './organisms/CharacterBar/CharacterBar';

export { PhasePanel } from './organisms/PhasePanel/PhasePanel';

export { TransitionOverlay } from './organisms/TransitionOverlay/TransitionOverlay';
export type { TransitionOverlayProps } from './organisms/TransitionOverlay/TransitionOverlay';

export { ActBreakOverlay } from './organisms/ActBreakOverlay/ActBreakOverlay';
export type { ActBreakOverlayProps } from './organisms/ActBreakOverlay/ActBreakOverlay';

export { SceneChallengeOverlay } from './organisms/SceneChallengeOverlay/SceneChallengeOverlay';
export type { SceneChallengeOverlayProps } from './organisms/SceneChallengeOverlay/SceneChallengeOverlay';

// Version
export const DESIGN_SYSTEM_VERSION = '0.0.0';
