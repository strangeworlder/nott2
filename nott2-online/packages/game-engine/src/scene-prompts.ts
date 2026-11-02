/**
 * @nott2/game-engine — Scene Prompts Facade
 *
 * Provides suit × rank → narrative prompt lookup, combining:
 *   1. The universal "Platonic Ideal" two-part prompt (Active Player + Camera Crew)
 *   2. The Playset-coupled "Practical" `<ScriptSparks>` (3 concrete beats per card)
 *
 * Maintains backward-compatible string lookup (`getScenePrompt`, `getJokerPrompt`)
 * alongside full structured lookup (`getDetailedScenePrompt`, `getDetailedJokerPrompt`).
 */

import type { Suit, Rank, JokerColor } from './types';
import {
  PLATONIC_SUIT_PROMPTS,
  PLATONIC_JOKER_PROMPTS,
  FACE_CARD_PREFIX,
  type TwoPartPrompt,
} from './prompts/platonic-prompts';
import { DEFAULT_CARD_SPARKS, DEFAULT_JOKER_SPARKS } from './prompts/sparks-default';
import { SUMMERCAMP_CARD_SPARKS, SUMMERCAMP_JOKER_SPARKS } from './prompts/sparks-summercamp';
import { getExtendedCardSparks, getExtendedJokerSparks } from './prompts/sparks-extended';

export * from './prompts/platonic-prompts';
export * from './prompts/facilitation-prompts';
export * from './prompts/sparks-extended';
export * from './prompts/spark-fragments';

// ── Types ────────────────────────────────────────────────────────────────────

export interface FaceCardPrompt {
  firstTime: string;
  recurring: string;
}

export type CardPrompt = string | FaceCardPrompt;

export interface SuitPrompts {
  suit: Suit;
  theme: string;
  prompts: Record<string, CardPrompt>;
}

export interface JokerPrompts {
  Red: string;
  Black: string;
}

export interface PromptData {
  faceCardPrefix: string;
  suits: SuitPrompts[];
  joker: JokerPrompts;
}

export interface DetailedScenePrompt {
  activePlayer: string;
  cameraCrew: string;
  sparks: readonly string[];
}

// ── Suit Themes ──────────────────────────────────────────────────────────────

const SUIT_THEMES: Record<Suit, string> = {
  Spades: 'Power (Physical threat)',
  Hearts: 'Resolve (Fear/Paranoia)',
  Clubs: 'Intellect (The Truth)',
  Diamonds: 'Finesse (Mistakes/Social)',
};

// ── Build Default PromptData (Active Player hooks) ───────────────────────────

function buildDefaultPromptData(): PromptData {
  const suits: SuitPrompts[] = (['Spades', 'Hearts', 'Clubs', 'Diamonds'] as const).map(suit => {
    const raw = PLATONIC_SUIT_PROMPTS[suit];
    const prompts: Record<string, CardPrompt> = {};
    for (const [rankStr, entry] of Object.entries(raw)) {
      if ('firstTime' in entry) {
        prompts[rankStr] = {
          firstTime: entry.firstTime.activePlayer,
          recurring: entry.recurring.activePlayer,
        };
      } else {
        prompts[rankStr] = entry.activePlayer;
      }
    }
    return {
      suit,
      theme: SUIT_THEMES[suit],
      prompts,
    };
  });

  return {
    faceCardPrefix: FACE_CARD_PREFIX,
    suits,
    joker: {
      Red: PLATONIC_JOKER_PROMPTS.Red.activePlayer,
      Black: PLATONIC_JOKER_PROMPTS.Black.activePlayer,
    },
  };
}

const DEFAULT_PROMPTS: PromptData = buildDefaultPromptData();

// ── Lookup Functions ─────────────────────────────────────────────────────────

/**
 * Get the primary (Active Player) narrative prompt for a standard card.
 * Used by SceneChallengeOverlay and legacy callers.
 */
export function getScenePrompt(
  suit: Suit,
  rank: Rank,
  isFirstEncounter: boolean = true,
  data: PromptData = DEFAULT_PROMPTS,
): string | null {
  const suitData = data.suits.find(s => s.suit === suit);
  if (!suitData) return null;

  const prompt = suitData.prompts[String(rank)];
  if (!prompt) return null;

  if (typeof prompt === 'string') {
    return prompt;
  }

  return isFirstEncounter ? prompt.firstTime : prompt.recurring;
}

/**
 * Get the full two-part Platonic prompt (`activePlayer` + `cameraCrew`)
 * coupled with the 3 practical Playset `<ScriptSparks>` for a standard card.
 */
export function getDetailedScenePrompt(
  suit: Suit,
  rank: Rank,
  isFirstEncounter: boolean = true,
  playsetId: string = 'default',
): DetailedScenePrompt | null {
  const suitPrompts = PLATONIC_SUIT_PROMPTS[suit];
  if (!suitPrompts) return null;

  const entry = suitPrompts[String(rank)];
  if (!entry) return null;

  const twoPart: TwoPartPrompt =
    'firstTime' in entry
      ? isFirstEncounter
        ? entry.firstTime
        : entry.recurring
      : entry;

  const sparksMap = playsetId === 'summercamp' ? SUMMERCAMP_CARD_SPARKS : DEFAULT_CARD_SPARKS;
  const baseSparks = sparksMap[suit]?.[String(rank)] ?? DEFAULT_CARD_SPARKS[suit][String(rank)];
  const extraSparks = getExtendedCardSparks(suit, rank, playsetId);
  const sparks = [...baseSparks, ...extraSparks];

  const activePlayerText =
    rank >= 11 ? `${FACE_CARD_PREFIX} — ${twoPart.activePlayer}` : twoPart.activePlayer;

  return {
    activePlayer: activePlayerText,
    cameraCrew: twoPart.cameraCrew,
    sparks,
  };
}

/**
 * Get the primary (Active Player) narrative prompt for a Joker card.
 */
export function getJokerPrompt(
  color: JokerColor,
  data: PromptData = DEFAULT_PROMPTS,
): string {
  return data.joker[color];
}

/**
 * Get the full two-part Platonic prompt + Playset `<ScriptSparks>` for a Joker card.
 */
export function getDetailedJokerPrompt(
  color: JokerColor,
  playsetId: string = 'default',
): DetailedScenePrompt {
  const twoPart = PLATONIC_JOKER_PROMPTS[color];
  const sparksMap = playsetId === 'summercamp' ? SUMMERCAMP_JOKER_SPARKS : DEFAULT_JOKER_SPARKS;
  const extraSparks = getExtendedJokerSparks(color, playsetId);
  return {
    activePlayer: twoPart.activePlayer,
    cameraCrew: twoPart.cameraCrew,
    sparks: [...sparksMap[color], ...extraSparks],
  };
}

/**
 * Get the face card prefix text (shown before the face card prompt).
 */
export function getFaceCardPrefix(data: PromptData = DEFAULT_PROMPTS): string {
  return data.faceCardPrefix;
}

/**
 * Get the thematic label for a suit.
 */
export function getSuitTheme(
  suit: Suit,
  data: PromptData = DEFAULT_PROMPTS,
): string | null {
  const suitData = data.suits.find(s => s.suit === suit);
  return suitData?.theme ?? null;
}

/**
 * Returns the default prompt data. Useful for playset merging.
 */
export function getDefaultPrompts(): PromptData {
  return DEFAULT_PROMPTS;
}
