import { describe, it, expect } from 'vitest';
import {
  getScenePrompt,
  getJokerPrompt,
  getFaceCardPrefix,
  getSuitTheme,
  getDefaultPrompts,
} from '../scene-prompts';

describe('Scene Prompts', () => {
  // ── getScenePrompt ───────────────────────────────────────────────────────

  describe('getScenePrompt', () => {
    it('returns an establishing shot for Aces (rank 1)', () => {
      const prompt = getScenePrompt('Spades', 1);
      expect(prompt).toContain('ESTABLISHING SHOT');
    });

    it('returns a string prompt for number cards (2-10)', () => {
      const prompt = getScenePrompt('Hearts', 5);
      expect(prompt).toBe('You feel watched. Where is the gaze coming from?');
    });

    it('returns firstTime variant for face card on first encounter', () => {
      const prompt = getScenePrompt('Clubs', 11, true);
      expect(prompt).toBe('What are they wearing that looks out of place?');
    });

    it('returns recurring variant for face card on subsequent encounter', () => {
      const prompt = getScenePrompt('Clubs', 11, false);
      expect(prompt).toBe('How is that clothing stained or torn?');
    });

    it('handles all four suits', () => {
      expect(getScenePrompt('Spades', 2)).toBeTruthy();
      expect(getScenePrompt('Hearts', 2)).toBeTruthy();
      expect(getScenePrompt('Clubs', 2)).toBeTruthy();
      expect(getScenePrompt('Diamonds', 2)).toBeTruthy();
    });

    it('returns null for invalid suit (if data is corrupted)', () => {
      // @ts-expect-error — testing invalid input
      expect(getScenePrompt('Invalid', 5)).toBeNull();
    });

    it('returns prompts for all ranks 1-13', () => {
      for (let rank = 1; rank <= 13; rank++) {
        const prompt = getScenePrompt('Spades', rank as any);
        expect(prompt).toBeTruthy();
      }
    });

    it('face card King (13) has firstTime and recurring', () => {
      const first = getScenePrompt('Diamonds', 13, true);
      const recurring = getScenePrompt('Diamonds', 13, false);
      expect(first).not.toBe(recurring);
      expect(first).toBeTruthy();
      expect(recurring).toBeTruthy();
    });

    it('defaults isFirstEncounter to true', () => {
      const prompt = getScenePrompt('Hearts', 12);
      const firstTime = getScenePrompt('Hearts', 12, true);
      expect(prompt).toBe(firstTime);
    });
  });

  // ── getJokerPrompt ─────────────────────────────────────────────────────

  describe('getJokerPrompt', () => {
    it('returns the Red Joker prompt', () => {
      const prompt = getJokerPrompt('Red');
      expect(prompt).toContain('FINAL TEST');
    });

    it('returns the Black Joker prompt', () => {
      const prompt = getJokerPrompt('Black');
      expect(prompt).toContain('TWIST');
    });
  });

  // ── getFaceCardPrefix ──────────────────────────────────────────────────

  describe('getFaceCardPrefix', () => {
    it('returns the face card prefix text', () => {
      const prefix = getFaceCardPrefix();
      expect(prefix).toContain('Killer');
    });
  });

  // ── getSuitTheme ───────────────────────────────────────────────────────

  describe('getSuitTheme', () => {
    it('returns the theme for Spades', () => {
      expect(getSuitTheme('Spades')).toBe('Power (Physical threat)');
    });

    it('returns the theme for Hearts', () => {
      expect(getSuitTheme('Hearts')).toBe('Resolve (Fear/Paranoia)');
    });

    it('returns the theme for Clubs', () => {
      expect(getSuitTheme('Clubs')).toBe('Intellect (The Truth)');
    });

    it('returns the theme for Diamonds', () => {
      expect(getSuitTheme('Diamonds')).toBe('Finesse (Mistakes/Social)');
    });

    it('returns null for an unknown suit', () => {
      // @ts-expect-error — testing invalid input
      expect(getSuitTheme('Invalid')).toBeNull();
    });
  });

  // ── getDefaultPrompts ──────────────────────────────────────────────────

  describe('getDefaultPrompts', () => {
    it('returns the complete default prompt data', () => {
      const data = getDefaultPrompts();
      expect(data.faceCardPrefix).toBeTruthy();
      expect(data.suits).toHaveLength(4);
      expect(data.joker.Red).toBeTruthy();
      expect(data.joker.Black).toBeTruthy();
    });

    it('each suit has prompts for ranks 1-13', () => {
      const data = getDefaultPrompts();
      for (const suit of data.suits) {
        for (let rank = 1; rank <= 13; rank++) {
          expect(suit.prompts[String(rank)]).toBeDefined();
        }
      }
    });
  });

  // ── Custom prompt data ─────────────────────────────────────────────────

  describe('playset overrides', () => {
    it('accepts custom prompt data', () => {
      const custom = {
        faceCardPrefix: 'Custom prefix',
        suits: [
          {
            suit: 'Spades' as const,
            theme: 'Custom theme',
            prompts: { '2': 'Custom prompt for 2 of Spades' },
          },
        ],
        joker: { Red: 'Custom Red', Black: 'Custom Black' },
      };

      expect(getScenePrompt('Spades', 2, true, custom)).toBe('Custom prompt for 2 of Spades');
      expect(getJokerPrompt('Red', custom)).toBe('Custom Red');
      expect(getFaceCardPrefix(custom)).toBe('Custom prefix');
      expect(getSuitTheme('Spades', custom)).toBe('Custom theme');
    });
  });
});
