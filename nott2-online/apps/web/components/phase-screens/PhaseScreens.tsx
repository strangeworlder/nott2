/**
 * PhaseScreens — barrel re-export.
 *
 * Each screen lives in its own file under ./screens/.
 * This file re-exports them all so existing imports continue to work.
 */

export { WelcomeScreen } from './screens/WelcomeScreen';
export { GameSetupScreen } from './screens/GameSetupScreen';
export { ActSetupScreen } from './screens/ActSetupScreen';
export { TrophySetupScreen } from './screens/TrophySetupScreen';
export { SceneSetupScreen } from './screens/SceneSetupScreen';
export { ConversationStakesScreen } from './screens/ConversationStakesScreen';
export { ResolutionScreen } from './screens/ResolutionScreen';
export { FalloutScreen } from './screens/FalloutScreen';
export { WinScreen, LoseScreen } from './screens/WinLoseScreens';
