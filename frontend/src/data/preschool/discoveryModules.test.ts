import { describe, expect, it } from 'vitest';
import { DISCOVERY_MODULES } from './discoveryModules';
import { PRESCHOOL_MODULES } from './index';
describe('preschool thematic transfers', () => {
    it('exposes all 12 original activities in the main catalog with coherent localized instructions', () => {
        expect(DISCOVERY_MODULES).toHaveLength(3);
        expect(DISCOVERY_MODULES.flatMap(m => m.activities)).toHaveLength(12);
        for (const m of DISCOVERY_MODULES) {
            expect(PRESCHOOL_MODULES).toContain(m);
            expect(m.activities.map(a => a.stepNumber)).toEqual([1, 2, 3, 4]);
            for (const a of m.activities) {
                for (const l of ['fr', 'en', 'ar'] as const) {
                    expect(a.i18n[l].promptAudio.length).toBeGreaterThan(10);
                    if (l !== 'ar')
                        expect(a.i18n[l].promptAudio).not.toMatch(/[\u0600-\u06ff]/);
                }
            }
            const count = m.activities[0];
            expect(count.visualAssets.choices!.find(c => c.isCorrect)!.asset).toBe(String(count.targetValue));
            const story = m.activities[3];
            expect(story.visualAssets.storyFrames!.map(f => f.order)).toEqual([1, 2, 3]);
            expect(new Set(story.visualAssets.storyFrames!.map(f => f.asset)).size).toBe(3);
        }
    });
});
