/**
 * @nott2/game-engine — Scene Prompts
 *
 * Provides suit × rank → narrative prompt lookup.
 *
 * Each card in the game corresponds to a scene prompt that the Active Player
 * narrates. The prompt is determined by the card's suit (theme) and rank.
 *
 * - Number cards (2–10): simple string prompt
 * - Face cards (11–13): have firstTime / recurring variants depending on
 *   whether this is the first encounter with the Killer in this suit
 * - Aces (1): "Establishing Shot" — character introduction
 * - Jokers: special finale prompts
 *
 * The prompt data itself is playset-specific. This module provides the
 * default prompts and a lookup function. Playsets can override the data
 * by providing their own prompts JSON.
 */

import type { Suit, Rank, JokerColor } from './types';

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

// ── Default Prompts ──────────────────────────────────────────────────────────

const DEFAULT_PROMPTS: PromptData = {
  faceCardPrefix:
    'The Killer is here. How do they corner you, and what makes them look unstoppable?',
  suits: [
    {
      suit: 'Spades',
      theme: 'Power (Physical threat)',
      prompts: {
        '1': '**ESTABLISHING SHOT.**\n\nWe see you handling a physical task with ease. What is it?',
        '2': 'A heavy door slams shut behind you. What mechanism locks it?',
        '3': 'The path is blocked by debris. What makes it too heavy to move alone?',
        '4': 'You are forced to squeeze through a tight space. What scratches you?',
        '5': 'A structure collapses nearby. What path does it cut off?',
        '6': 'Something grabs your ankle. How do you shake it loose, and what mark does it leave?',
        '7': 'You are thrown against a wall. What breaks?',
        '8': 'A trap triggers. What physical pain do you suffer immediately?',
        '9': 'You are pinned down. What weight is crushing you?',
        '10': 'The environment itself attacks. How does the room try to kill you?',
        '11': {
          firstTime: 'What is the first thing you notice about their silhouette?',
          recurring: 'How does that silhouette loom over you right now?',
        },
        '12': {
          firstTime: 'What weapon are they dragging or carrying?',
          recurring: 'How do they use that weapon to block your path?',
        },
        '13': {
          firstTime: "What wound should have killed them, but didn't?",
          recurring: 'How does that wound look even worse now?',
        },
      },
    },
    {
      suit: 'Hearts',
      theme: 'Resolve (Fear/Paranoia)',
      prompts: {
        '1': '**ESTABLISHING SHOT.**\n\nWe see you caring for someone or something. Who is it?',
        '2': "The lights flicker. What shadow moves when it shouldn't?",
        '3': "You hear a familiar voice. Who is it, and why can't they be here?",
        '4': 'You find a personal item belonging to a victim. Why does it terrify you?',
        '5': 'You feel watched. Where is the gaze coming from?',
        '6': 'You are separated from the group for a moment. What whispers to you?',
        '7': 'You see something impossible. Why do you doubt your own sanity?',
        '8': 'A friend acts strangely. Why do you suddenly fear them?',
        '9': 'You are paralyzed by a memory. What trauma resurfaces?',
        '10': 'You realize you are alone, even if others are here. Why does no one help you?',
        '11': {
          firstTime: 'What is wrong with their face (or mask)?',
          recurring: 'How does that face stare at you?',
        },
        '12': {
          firstTime: "What sound do they make that isn't human?",
          recurring: 'How close is that sound now?',
        },
        '13': {
          firstTime: 'What part of their body is moving wrong?',
          recurring: 'How does it twist or snap as they move?',
        },
      },
    },
    {
      suit: 'Clubs',
      theme: 'Intellect (The Truth)',
      prompts: {
        '1': "**ESTABLISHING SHOT.**\n\nWe see you preparing for what's to come. What supply or exit are you checking?",
        '2': 'You find a note. What cryptic warning does it give?',
        '3': 'A device is broken. What part is missing?',
        '4': 'You recognize a symbol. What dark history does it represent?',
        '5': 'You find a map. What location is circled in blood?',
        '6': 'You realize the plan is flawed. What critical detail did you miss?',
        '7': 'You find a corpse. What clue reveals how they died?',
        '8': 'A puzzle blocks the way. What terrible price must be paid to solve it?',
        '9': 'You uncover a secret about the Killer. Why does it make things worse?',
        '10': 'The truth is revealed. Why is there no escape?',
        '11': {
          firstTime: 'What are they wearing that looks out of place?',
          recurring: 'How is that clothing stained or torn?',
        },
        '12': {
          firstTime: 'How do they know exactly where you are hiding?',
          recurring: 'What gave you away this time?',
        },
        '13': {
          firstTime: 'They speak. What do they say that reveals they know your secrets?',
          recurring: 'Why does that voice paralyze you?',
        },
      },
    },
    {
      suit: 'Diamonds',
      theme: 'Finesse (Mistakes/Social)',
      prompts: {
        '1': '**ESTABLISHING SHOT.**\n\nWe see you at the center of attention. What are you saying or doing?',
        '2': 'You trip over something. What noise echoes too loudly?',
        '3': 'You drop a crucial item. Where does it fall?',
        '4': 'You say the wrong thing. Who looks at you with suspicion?',
        '5': 'You hesitate. What opportunity slips away?',
        '6': 'Your hand slips. What do you accidentally activate?',
        '7': 'You try to be quiet, but fail. What gives you away?',
        '8': 'Your ego leads you into danger. What warning did you ignore?',
        '9': 'You try to save someone, but make it worse. How?',
        '10': 'You make a fatal mistake. Who pays the price for your error?',
        '11': {
          firstTime: 'How do they move silently?',
          recurring: "Why didn't you hear them approach?",
        },
        '12': {
          firstTime: 'They are toying with you. What do they do to show they are in control?',
          recurring: 'How do they humiliate you before striking?',
        },
        '13': {
          firstTime: "They appear where they shouldn't be. How did they get there?",
          recurring: 'Why is there no escape?',
        },
      },
    },
  ],
  joker: {
    Red: 'THE FINAL TEST. The Killer has you dead to rights. How do you escape death?',
    Black: 'THE TWIST. One last desperate attempt. What do you sacrifice to survive?',
  },
};

// ── Lookup Functions ─────────────────────────────────────────────────────────

/**
 * Get the narrative prompt for a standard card.
 *
 * @param suit      Card suit
 * @param rank      Card rank (1–13)
 * @param isFirstEncounter  For face cards: true if this is the first time this
 *                          suit's face card has appeared. Determines which
 *                          variant text to use.
 * @param data      Optional custom prompt data (for playset overrides)
 * @returns         The prompt string, or null if no prompt is defined
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

  // Face card with firstTime / recurring variants
  return isFirstEncounter ? prompt.firstTime : prompt.recurring;
}

/**
 * Get the narrative prompt for a Joker card.
 */
export function getJokerPrompt(
  color: JokerColor,
  data: PromptData = DEFAULT_PROMPTS,
): string {
  return data.joker[color];
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
