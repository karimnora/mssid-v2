import { describe, it, expect } from 'vitest';
import { GARDEN_PLANS, gardenCellsCorrect, type GardenTask } from './gardenMission';
import { gardenStorageKey, readGardenResults, recordGardenResult } from '../../utils/gardenMissionProgress';
import { readFamilyResults } from '../../utils/familyLearning';
describe('Didou garden curriculum', () => {
    it('provides six challenges per band with playable constructions and complete isolated translations', () => {
        const plans = Object.values(GARDEN_PLANS);
        expect(plans).toHaveLength(6);
        expect(new Set(plans.flatMap(p => p.tasks.map(t => t.id))).size).toBe(36);
        for (const p of plans) {
            expect(p.tasks.map(t => t.kind)).toEqual(['sow', 'number', 'water', 'read', 'share', 'observe']);
            for (const task of p.tasks) {
                for (const lang of ['fr', 'ar', 'en'] as const) {
                    for (const field of ['title', 'prompt', 'hint', 'explain', 'practice'] as const) {
                        expect(task[field][lang], task.id).toBeTruthy();
                        if (lang !== 'ar')
                            expect(task[field][lang]).not.toMatch(/[\u0600-\u06ff]/);
                    }
                }
                if (task.kind === 'sow') {
                    const solution=task.layout==='equal'?Array.from({length:task.rows},(_,r)=>Array.from({length:task.target/task.rows},(_,c)=>r*task.columns+c)).flat():Array.from({length:task.target},(_,i)=>i);
                    expect(gardenCellsCorrect(task, solution)).toBe(true);
                    expect(gardenCellsCorrect(task, [])).toBe(false);
                    expect(gardenCellsCorrect(task, Array(task.target).fill(0))).toBe(false);
                }
                if (task.kind === 'share')
                    expect(task.targets.reduce((a, b) => a + b, 0)).toBe(task.total);
                if (task.kind === 'water')
                    expect(task.targets.every(n => Number.isInteger(n) && n > 0 && n <= 6)).toBe(true);
                if (task.kind === 'read') {
                    expect(task.options.filter(o => o.id === task.correct)).toHaveLength(1);
                    expect(new Set(task.options.map(o => o.label.fr)).size).toBe(3);
                }
            }
        }
    });
    it('rejects incorrect layouts even with a correct number of seeds', () => {
        const equal = GARDEN_PLANS['2AP'].tasks[0] as Extract<GardenTask, {
            kind: 'sow';
        }>;
        expect(gardenCellsCorrect({ ...equal, columns: 5 }, Array.from({ length: 12 }, (_, i) => i))).toBe(false);
        const rectangle = GARDEN_PLANS['3AP'].tasks[0] as Extract<GardenTask, {
            kind: 'sow';
        }>;
        expect(gardenCellsCorrect(rectangle, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15])).toBe(false);
    });
    it('checks the mathematical quantities independently', () => {
        expect(Object.values(GARDEN_PLANS).map(p => (p.tasks[1] as Extract<GardenTask, {
            kind: 'number';
        }>).accepted)).toEqual(['4', '2', '3', String(3 * 25), String(200 - 3 * 40), String(15 * 12)]);
        expect((GARDEN_PLANS['4AP'].tasks[0] as Extract<GardenTask, {
            kind: 'sow';
        }>).target).toBe(12 / 2);
        expect((GARDEN_PLANS['5AP'].tasks[0] as Extract<GardenTask, {
            kind: 'sow';
        }>).target).toBe(20 * 3 / 4);
        expect((GARDEN_PLANS['4AP'].tasks[4] as Extract<GardenTask, {
            kind: 'share';
        }>).targets).toEqual([12 / 2, 12 / 4, 12 / 4]);
        expect((GARDEN_PLANS['5AP'].tasks[4] as Extract<GardenTask, {
            kind: 'share';
        }>).targets).toEqual([20 * .25, (20 - 20 * .25) / 3, (20 - 20 * .25) / 3, (20 - 20 * .25) / 3]);
    });
    it('retains historical success after a later failed try and sanitizes stored results', () => {
        localStorage.clear();
        const id = GARDEN_PLANS.preschool.tasks[0].id;
        const key = gardenStorageKey('user:9:child:1', 'preschool', 'en');
        let results = recordGardenResult({}, id, 'independent', '2026-10-15T11:00:00Z');
        results = recordGardenResult(results, id, 'review', '2026-10-15T12:00:00Z');
        localStorage.setItem(key, JSON.stringify({ ...results, 'garden-mission:preschool:99': { outcome: 'independent', at: '2026-10-15T11:00:00Z' }, [GARDEN_PLANS.preschool.tasks[1].id]: { outcome: 'independent', at: 'bad' } }));
        expect(readGardenResults(key, 'preschool')).toEqual(results);
        expect(results[id].completedAt).toBe('2026-10-15T11:00:00Z');
        expect(readGardenResults(gardenStorageKey('user:9:child:2', 'preschool', 'en'), 'preschool')).toEqual({});
        expect(readGardenResults(gardenStorageKey('user:9:child:1', 'preschool', 'fr'), 'preschool')).toEqual({});
    });
    it('keeps the primary mission results in the existing family notebook whitelist', () => {
        const id = GARDEN_PLANS['5AP'].tasks[0].id;
        localStorage.setItem('garden-test', JSON.stringify({ [id]: { outcome: 'helped', at: '2026-10-15T11:00:00Z' } }));
        expect(readFamilyResults('garden-test')[id].outcome).toBe('helped');
    });
});
