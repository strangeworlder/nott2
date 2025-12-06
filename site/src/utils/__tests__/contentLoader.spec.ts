import { describe, it, expect } from 'vitest';
import { getAvailablePlaysets } from '../contentLoader';

describe('contentLoader', () => {
    it('should load available playsets', () => {
        const playsets = getAvailablePlaysets();

        expect(playsets.length).toBeGreaterThanOrEqual(2);

        const generic = playsets.find(p => p.id === 'default');
        expect(generic).toBeDefined();
        expect(generic?.name).toBe('Generic Slasher');

        const summercamp = playsets.find(p => p.id === 'summercamp');
        expect(summercamp).toBeDefined();
        expect(summercamp?.name).toBe('Summer Camp Massacre');
    });

    it('should sort playsets with default first', () => {
        const playsets = getAvailablePlaysets();
        expect(playsets[0].id).toBe('default');
    });
});
