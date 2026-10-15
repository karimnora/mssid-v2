import { GARDEN_PLANS, type GardenBand } from '../data/garden/gardenMission';
import type { PreschoolLanguage } from '../data/preschool/types';
import type { FamilyResults, TaskOutcome } from './familyLearning';
export const gardenStorageKey = (owner: string, band: GardenBand, language: PreschoolLanguage) => 'mssid_garden_mission_v1:' + owner + ':' + band + ':' + language;
export function readGardenResults(key: string, band: GardenBand): FamilyResults {
    try {
        const raw: unknown = JSON.parse(localStorage.getItem(key) ?? '{}');
        if (!raw || typeof raw !== 'object' || Array.isArray(raw))
            return {};
        const known = new Set(GARDEN_PLANS[band].tasks.map(task => task.id));
        return Object.fromEntries(Object.entries(raw).flatMap(([id, v]) => {
            if (!known.has(id) || !v || typeof v !== 'object' || !['independent', 'helped', 'review'].includes(v.outcome) || typeof v.at !== 'string' || !Number.isFinite(Date.parse(v.at)))
                return [];
            const completedAt = typeof v.completedAt === 'string' && Number.isFinite(Date.parse(v.completedAt)) ? v.completedAt : v.outcome !== 'review' ? v.at : undefined;
            return [[id, { outcome: v.outcome, at: v.at, ...(completedAt ? { completedAt } : {}) }]];
        }));
    }
    catch {
        return {};
    }
}
export function recordGardenResult(results: FamilyResults, id: string, outcome: TaskOutcome, at = new Date().toISOString()): FamilyResults {
    const previous = results[id];
    const completedAt = previous?.completedAt ?? (previous && previous.outcome !== 'review' ? previous.at : outcome !== 'review' ? at : undefined);
    return { ...results, [id]: { outcome, at, ...(completedAt ? { completedAt } : {}) } };
}
