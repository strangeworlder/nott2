/**
 * @nott2/game-engine — Validation
 *
 * Host-authority action validation. All player actions are validated before
 * being applied to ensure rule integrity in a multiplayer environment.
 *
 * Source of truth: docs/implementation-plan/02-game-engine.md §2.6
 */

import type { GameState, GameAction, ValidationResult } from './types';

/**
 * Validate a player action against the current game state.
 * Returns { valid: true } or { valid: false, reason: string }.
 */
export function validateAction(
  state: GameState,
  action: GameAction,
): ValidationResult {
  const player = state.players.find(p => p.id === action.playerId);

  if (!player) {
    return { valid: false, reason: 'Player not found' };
  }

  switch (action.type) {
    case 'draw_card':
      return validateDrawCard(state, action);

    case 'select_card':
      return validateSelectCard(state, action);

    case 'roll_dice':
      return validateRollDice(state, action);

    case 'advance_phase':
      return validateAdvancePhase(state, action);

    case 'assign_strike':
      return validateAssignStrike(state, action);

    case 'award_genre_point':
      return validateAwardGenrePoint(state, action);

    case 'use_genre_point':
      return validateUseGenrePoint(state, action);

    case 'apply_aptitude':
      return validateApplyAptitude(state, action);

    case 'confirm_sacrifice':
      return validateConfirmSacrifice(state, action);

    case 'escalate':
      return validateEscalate(state, action);

    case 'modify_effort':
      return validateModifyEffort(state, action);

    default:
      return { valid: false, reason: 'Unknown action type' };
  }
}

function validateDrawCard(state: GameState, action: GameAction): ValidationResult {
  // Only the Active Player (AP) can draw cards
  if (state.scene.activePlayerId !== action.playerId) {
    return { valid: false, reason: 'Only the Active Player can draw cards' };
  }
  if (state.phase !== 'scene-setup') {
    return { valid: false, reason: 'Cards can only be drawn during scene setup' };
  }
  return { valid: true };
}

function validateSelectCard(state: GameState, action: GameAction): ValidationResult {
  if (state.scene.activePlayerId !== action.playerId) {
    return { valid: false, reason: 'Only the Active Player can select cards' };
  }
  if (state.phase !== 'scene-setup') {
    return { valid: false, reason: 'Cards can only be selected during scene setup' };
  }
  // If a face card is visible, it must be selected
  const hasFaceCard = state.deck.visibleCards.some(c => c.rank >= 11);
  const payload = action.payload as { cardId: string };
  if (hasFaceCard) {
    const selectedCard = state.deck.visibleCards.find(c => c.id === payload?.cardId);
    if (!selectedCard || selectedCard.rank < 11) {
      return { valid: false, reason: 'A Face Card is visible — it must be selected' };
    }
  }
  return { valid: true };
}

function validateRollDice(state: GameState, action: GameAction): ValidationResult {
  if (state.scene.activePlayerId !== action.playerId) {
    return { valid: false, reason: 'Only the Active Player can roll dice' };
  }
  if (state.phase !== 'resolution') {
    return { valid: false, reason: 'Dice can only be rolled during the Resolution phase' };
  }
  if (state.scene.rollMain !== null && !state.scene.isGenrePointUsed) {
    return { valid: false, reason: 'Dice have already been rolled this scene' };
  }
  return { valid: true };
}

function validateAdvancePhase(state: GameState, action: GameAction): ValidationResult {
  const player = state.players.find(p => p.id === action.playerId);
  if (!player?.isHost) {
    return { valid: false, reason: 'Only the host can advance the phase' };
  }
  if (state.phase === 'win' || state.phase === 'lose') {
    return { valid: false, reason: 'Game has ended' };
  }
  return { valid: true };
}

function validateAssignStrike(state: GameState, action: GameAction): ValidationResult {
  const player = state.players.find(p => p.id === action.playerId);
  if (!player?.isHost) {
    return { valid: false, reason: 'Only the host can assign strikes' };
  }
  if (state.strikesToAssign <= 0) {
    return { valid: false, reason: 'No strikes pending assignment' };
  }
  const payload = action.payload as { characterId: string };
  const character = state.characters.find(c => c.id === payload?.characterId);
  if (!character) {
    return { valid: false, reason: 'Character not found' };
  }
  if (character.isDead) {
    return { valid: false, reason: 'Character is already dead' };
  }
  return { valid: true };
}

function validateAwardGenrePoint(state: GameState, action: GameAction): ValidationResult {
  if (state.tableGenrePoints <= 0) {
    return { valid: false, reason: 'No Genre Points in the table pool' };
  }
  if (state.scene.isGenrePointAwarded) {
    return { valid: false, reason: 'A Genre Point has already been awarded this scene' };
  }
  return { valid: true };
}

function validateUseGenrePoint(state: GameState, action: GameAction): ValidationResult {
  if (state.scene.isGenrePointUsed) {
    return { valid: false, reason: 'A Genre Point has already been used this scene' };
  }
  if (state.scene.rollMain === null) {
    return { valid: false, reason: 'You must roll before spending a Genre Point' };
  }
  const playerPoints = state.playerGenrePoints[action.playerId] ?? 0;
  if (playerPoints <= 0) {
    return { valid: false, reason: 'No Genre Points available' };
  }
  return { valid: true };
}

function validateApplyAptitude(state: GameState, action: GameAction): ValidationResult {
  if (state.scene.activePlayerId !== action.playerId) {
    return { valid: false, reason: 'Only the Active Player can apply Aptitude' };
  }
  if (state.scene.rollMain === null) {
    return { valid: false, reason: 'Must roll before applying Aptitude' };
  }
  if (state.scene.modifiedEffort !== null) {
    return { valid: false, reason: 'Aptitude has already been applied' };
  }
  const payload = action.payload as { modifier: 1 | -1 };
  if (payload?.modifier !== 1 && payload?.modifier !== -1) {
    return { valid: false, reason: 'Modifier must be +1 or -1' };
  }
  return { valid: true };
}

function validateConfirmSacrifice(state: GameState, action: GameAction): ValidationResult {
  if (state.scene.activePlayerId !== action.playerId) {
    return { valid: false, reason: 'Only the Active Player can confirm the sacrifice' };
  }
  if (state.phase !== 'conversation-stakes') {
    return { valid: false, reason: 'Sacrifice can only be confirmed during Conversation/Stakes' };
  }
  return { valid: true };
}

function validateEscalate(state: GameState, action: GameAction): ValidationResult {
  // Any non-AP player can escalate, but only once per scene
  if (state.scene.activePlayerId === action.playerId) {
    return { valid: false, reason: 'The Active Player cannot escalate (must be a different player)' };
  }
  if (state.scene.escalationUsed) {
    return { valid: false, reason: '"Something\'s Not Right" has already been used this scene' };
  }
  if (state.phase !== 'conversation-stakes') {
    return { valid: false, reason: 'Escalation only possible during Conversation/Stakes' };
  }
  return { valid: true };
}

function validateModifyEffort(state: GameState, action: GameAction): ValidationResult {
  return validateApplyAptitude(state, action);
}
