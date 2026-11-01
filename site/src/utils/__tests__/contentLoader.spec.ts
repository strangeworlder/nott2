import { describe, expect, it } from 'vitest';
import { getAvailablePlaysets, getRulesContent } from '../contentLoader';

describe('contentLoader', () => {
  it('should load available playsets', () => {
    const playsets = getAvailablePlaysets();

    expect(playsets.length).toBeGreaterThanOrEqual(2);

    const generic = playsets.find((p) => p.id === 'default');
    expect(generic).toBeDefined();
    expect(generic?.name).toBe('Generic Slasher');

    const summercamp = playsets.find((p) => p.id === 'summercamp');
    expect(summercamp).toBeDefined();
    expect(summercamp?.name).toBe('Summer Camp Massacre');
  });

  it('should sort playsets with default first', () => {
    const playsets = getAvailablePlaysets();
    expect(playsets[0].id).toBe('default');
  });

  it('should load rules content from rules.json', () => {
    const rules = getRulesContent();
    expect(rules.effortScale).toHaveLength(4);
    expect(rules.basicRules.d13.title).toBe('The d13');
    expect(rules.basicRules.deckRules.title).toBe('The Decks (Standard Setup)');
    expect(rules.basicRules.endgame.acts).toHaveLength(4);
    expect(rules.characterRules.archetypes).toHaveLength(4);
  });
});
