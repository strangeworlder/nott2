import { describe, it, expect } from 'vitest';
import {
  getScenePrompt,
  getDetailedScenePrompt,
  getJokerPrompt,
  getDetailedJokerPrompt,
  getFaceCardPrefix,
  getSuitTheme,
  getDefaultPrompts,
  getPlaysetInfo,
  getAvailablePlaysets,
  getCameraSparks,
  getEscalationSparks,
  getStakesGuidance,
  getSacrificeSparks,
  getOutcomeFacilitation,
  getCombinedFragmentPool,
  getRankGroup,
  getFocusCameraQuestions,
  getOutcomeWordPool,
} from '../scene-prompts';

describe('Scene Prompts', () => {
  // ── getScenePrompt ───────────────────────────────────────────────────────

  describe('getScenePrompt', () => {
    it('returns an establishing shot for Aces (rank 1)', () => {
      const prompt = getScenePrompt('Spades', 1);
      expect(prompt).toContain('ESTABLISHING SHOT');
    });

    it('returns an evocative Platonic prompt for number cards (2-10)', () => {
      const prompt = getScenePrompt('Hearts', 5);
      expect(prompt).toContain('watched');
    });

    it('returns firstTime variant for face card on first encounter', () => {
      const prompt = getScenePrompt('Clubs', 11, true);
      expect(prompt).toContain('wearing that looks deeply out of place');
    });

    it('returns recurring variant for face card on subsequent encounter', () => {
      const prompt = getScenePrompt('Clubs', 11, false);
      expect(prompt).toContain('stained or torn');
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

  // ── getDetailedScenePrompt & Playset Coupling ───────────────────────────

  describe('getDetailedScenePrompt', () => {
    it('returns activePlayer, cameraCrew, and 9 sparks (3 pages of 3) for every suit and rank', () => {
      const suits = ['Spades', 'Hearts', 'Clubs', 'Diamonds'] as const;
      for (const suit of suits) {
        for (let rank = 1; rank <= 13; rank++) {
          const defaultDetail = getDetailedScenePrompt(suit, rank as any, true, 'default');
          const campDetail = getDetailedScenePrompt(suit, rank as any, true, 'summercamp');
          expect(defaultDetail).toBeTruthy();
          expect(defaultDetail!.activePlayer.length).toBeGreaterThan(20);
          expect(defaultDetail!.cameraCrew.length).toBeGreaterThan(15);
          expect(defaultDetail!.sparks).toHaveLength(9);
          expect(new Set(defaultDetail!.sparks).size).toBe(9);

          expect(campDetail).toBeTruthy();
          expect(campDetail!.sparks).toHaveLength(9);
          expect(new Set(campDetail!.sparks).size).toBe(9);
          // Practical sparks differ between Generic Slasher and Summer Camp Massacre
          expect(campDetail!.sparks[0]).not.toBe(defaultDetail!.sparks[0]);
        }
      }
    });

    it('prefixes face card activePlayer prompts with FACE_CARD_PREFIX', () => {
      const detail = getDetailedScenePrompt('Spades', 11, true, 'default');
      expect(detail?.activePlayer).toContain('The Killer is here.');
    });
  });

  // ── getJokerPrompt & getDetailedJokerPrompt ──────────────────────────────

  describe('getJokerPrompt', () => {
    it('returns the Red Joker prompt', () => {
      const prompt = getJokerPrompt('Red');
      expect(prompt).toContain('FINAL TEST');
    });

    it('returns the Black Joker prompt', () => {
      const prompt = getJokerPrompt('Black');
      expect(prompt).toContain('TWIST');
    });

    it('returns detailed Joker prompts with 9 playset-coupled sparks', () => {
      const redDefault = getDetailedJokerPrompt('Red', 'default');
      const redCamp = getDetailedJokerPrompt('Red', 'summercamp');
      expect(redDefault.cameraCrew).toBeTruthy();
      expect(redDefault.sparks).toHaveLength(9);
      expect(redCamp.sparks).toHaveLength(9);
      expect(redCamp.sparks[0]).not.toBe(redDefault.sparks[0]);
    });
  });

  // ── getFaceCardPrefix & getSuitTheme ─────────────────────────────────────

  describe('getFaceCardPrefix & getSuitTheme', () => {
    it('returns the face card prefix text', () => {
      expect(getFaceCardPrefix()).toContain('Killer');
    });

    it('returns themes for all suits', () => {
      expect(getSuitTheme('Spades')).toBe('Power (Physical threat)');
      expect(getSuitTheme('Hearts')).toBe('Resolve (Fear/Paranoia)');
      expect(getSuitTheme('Clubs')).toBe('Intellect (The Truth)');
      expect(getSuitTheme('Diamonds')).toBe('Finesse (Mistakes/Social)');
    });
  });

  // ── getDefaultPrompts & custom overrides ─────────────────────────────────

  describe('getDefaultPrompts & playset overrides', () => {
    it('each suit has prompts for ranks 1-13', () => {
      const data = getDefaultPrompts();
      for (const suit of data.suits) {
        for (let rank = 1; rank <= 13; rank++) {
          expect(suit.prompts[String(rank)]).toBeDefined();
        }
      }
    });

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

  // ── Facilitation & Playsets ──────────────────────────────────────────────

  describe('Facilitation Prompts & Playsets', () => {
    it('exposes Generic Slasher and Summer Camp Massacre playsets', () => {
      const playsets = getAvailablePlaysets();
      expect(playsets.map(p => p.id)).toEqual(['default', 'summercamp']);
      expect(getPlaysetInfo('summercamp').defaultModules.finalGirl).toBe(true);
    });

    it('returns 9 camera, escalation, and sacrifice sparks across acts and playsets', () => {
      expect(getCameraSparks('Spades', 1, 'summercamp')).toHaveLength(9);
      expect(getEscalationSparks('Hearts', 2, 'default')).toHaveLength(9);
      expect(getSacrificeSparks('Clubs', 3, 'summercamp')).toHaveLength(9);
      expect(getStakesGuidance(2)).toContain('Act 2');
    });

    it('returns Effort-specific outcome facilitation with 9 sparks across all Effort levels', () => {
      const eff1 = getOutcomeFacilitation({
        success: true,
        effortLevel: 'controlled',
        suit: 'Spades',
        act: 1,
      });
      expect(eff1.sparks).toHaveLength(9);

      const eff2 = getOutcomeFacilitation({
        success: true,
        effortLevel: 'pushing-it',
        suit: 'Spades',
        act: 1,
      });
      expect(eff2.sparks).toHaveLength(9);

      const eff3 = getOutcomeFacilitation({
        success: false,
        effortLevel: 'overexertion',
        suit: 'Hearts',
        act: 2,
      });
      expect(eff3.sparks).toHaveLength(9);

      const eff4 = getOutcomeFacilitation({
        success: false,
        effortLevel: 'breaking-point',
        suit: 'Clubs',
        act: 3,
        playsetId: 'summercamp',
      });
      expect(eff4.sparks).toHaveLength(9);
    });

    it('builds large deduplicated activePlayerWords, cameraCrewWords, and cameraQuestions from Universal, Suit, Act, and RankGroup', () => {
      expect(getRankGroup(1)).toBe('ace');
      expect(getRankGroup(3)).toBe('low');
      expect(getRankGroup(6)).toBe('mid');
      expect(getRankGroup(9)).toBe('high');
      expect(getRankGroup(12)).toBe('face');
      expect(getRankGroup(null, true)).toBe('joker');

      const poolDefault = getCombinedFragmentPool({
        suit: 'Spades',
        act: 2,
        rank: 6,
        playsetId: 'default',
      });
      const poolCamp = getCombinedFragmentPool({
        suit: 'Spades',
        act: 2,
        rank: 6,
        playsetId: 'summercamp',
      });

      expect(poolDefault.activePlayerWords.length).toBeGreaterThanOrEqual(45);
      expect(poolDefault.cameraCrewWords.length).toBeGreaterThanOrEqual(45);
      expect(poolDefault.cameraQuestions.length).toBeGreaterThanOrEqual(3);
      expect(getFocusCameraQuestions(1)).toContain('What does it smell like?');
      expect(getFocusCameraQuestions(2)).toContain('Where is the blood coming from?');
      expect(getFocusCameraQuestions(3)).toContain('Why is there no hope?');

      // Deduplicated
      expect(
        new Set(poolDefault.activePlayerWords.map(s => s.toLowerCase())).size,
      ).toBe(poolDefault.activePlayerWords.length);
      expect(
        new Set(poolDefault.cameraCrewWords.map(s => s.toLowerCase())).size,
      ).toBe(poolDefault.cameraCrewWords.length);
      // Playset-aware universal layer
      expect(poolCamp.activePlayerWords[0]).not.toBe(
        poolDefault.activePlayerWords[0],
      );

      // Outcome word pool
      const outcomeWords = getOutcomeWordPool({
        effortLevel: 'overexertion',
        suit: 'Spades',
        act: 2,
        playsetId: 'default',
      });
      expect(outcomeWords.length).toBeGreaterThanOrEqual(30);
    });
  });
});
