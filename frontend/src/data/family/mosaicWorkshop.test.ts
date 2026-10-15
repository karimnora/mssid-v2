import { describe, expect, it } from 'vitest';
import { checkMosaic, MOSAIC_TASKS } from './mosaicWorkshop';
import { familyStorageKey, readFamilyResults } from '../../utils/familyLearning';
describe('original mosaic curriculum', () => {
    it('has 15 valid tasks with grade-specific rules and a constructible solution', () => {
        const tasks = Object.values(MOSAIC_TASKS).flat();
        expect(tasks).toHaveLength(15);
        expect(new Set(tasks.map(t => t.id)).size).toBe(15);
        for (const t of tasks) {
            expect(t.target).toBeGreaterThan(0);
            expect(t.target).toBeLessThanOrEqual(t.rows * t.columns);
            expect(Number.isInteger(t.target)).toBe(true);
            const solution = t.rule === 'rows' ? Array.from({ length: t.rows }, (_, r) => Array.from({ length: t.target / t.rows }, (_, c) => r * t.columns + c)).flat()
                : t.rule === 'rectangle' ? Array.from({ length: t.target / (t.target === 6 ? 3 : t.target === 9 ? 3 : 4) }, (_, r) => Array.from({ length: t.target === 12 ? 4 : 3 }, (_, c) => r * t.columns + c)).flat()
                    : Array.from({ length: t.target }, (_, i) => i);
            expect(checkMosaic(t, solution), t.id).toBe(true);
            expect(checkMosaic(t, solution.slice(1)), t.id).toBe(false);
            expect(checkMosaic(t, [...solution.slice(1), solution[1]]), t.id).toBe(false);
            expect(checkMosaic(t, [...solution.slice(1), 999]), t.id).toBe(false);
            for (const lang of ['fr', 'ar'] as const) {
                expect(t.prompt[lang]).toBeTruthy();
                expect(t.hint[lang]).toBeTruthy();
                expect(t.explanation[lang]).toBeTruthy();
            }
        }
    });
    it('rejects the right count in unequal groups or a disconnected rectangle', () => {
        expect(checkMosaic(MOSAIC_TASKS['2AP'][0], [0, 1, 2, 3, 4, 5])).toBe(false);
        expect(checkMosaic(MOSAIC_TASKS['3AP'][0], [0, 1, 2, 4, 5, 15])).toBe(false);
        expect(checkMosaic(MOSAIC_TASKS['3AP'][0], [5, 6, 9, 10, 13, 14])).toBe(true);
    });
    it('accepts equivalent areas for fractions without prescribing an arbitrary shape', () => {
        expect(checkMosaic(MOSAIC_TASKS['4AP'][0], [0, 2, 4, 6, 8, 10])).toBe(true);
        expect(MOSAIC_TASKS['5AP'].map(t => t.target)).toEqual([4, 15, 4]);
    });
    it('persists only real task ids and isolates observations by child', () => {
        localStorage.clear();
        const key = familyStorageKey('user:8:child:2', '4AP');
        localStorage.setItem(key, JSON.stringify({ 'mosaic:4AP:0': { outcome: 'helped', at: '2026-10-15T12:00:00Z' }, 'mosaic:4AP:5': { outcome: 'independent', at: '2026-10-15T12:00:00Z' } }));
        expect(Object.keys(readFamilyResults(key))).toEqual(['mosaic:4AP:0']);
        expect(readFamilyResults(familyStorageKey('user:8:child:3', '4AP'))).toEqual({});
    });
});
