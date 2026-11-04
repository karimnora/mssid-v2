import { beforeEach, describe, expect, it } from 'vitest';
import { familyStorageKey, readFamilyResults } from './familyLearning';
import { familyParentSummary } from './familyParentSummary';
import { immersiveResultIds, labResultId, recordLabOutcome } from './labTrace';
import { cleanLearningResults } from './learningSnapshot';

const owner = 'user:7';
const key = familyStorageKey(owner, '2AP');

describe('immersive labs leave a trace in the parent summary', () => {
  beforeEach(() => window.localStorage.clear());

  it('declares one id per lab activity, all accepted by the sync (server pattern included)', () => {
    const ids = immersiveResultIds();
    expect(ids).toContain('immersive:wudu_lab:order');
    expect(ids).toContain('immersive:souk_lab:street');
    for (const id of ids) expect(id).toMatch(/^[A-Za-z0-9:_-]{1,160}$/);
  });

  it('a miss is « to review », then the success after it is « with help », keeping the first completion', () => {
    const id = labResultId('wudu_lab', 'order');
    recordLabOutcome(owner, '2AP', id, 'review', '2026-11-04T10:00:00.000Z');
    expect(readFamilyResults(key)[id]).toEqual({ outcome: 'review', at: '2026-11-04T10:00:00.000Z' });
    recordLabOutcome(owner, '2AP', id, 'helped', '2026-11-04T10:01:00.000Z');
    recordLabOutcome(owner, '2AP', id, 'independent', '2026-11-05T09:00:00.000Z');
    const stored = readFamilyResults(key)[id];
    expect(stored).toEqual({ outcome: 'independent', at: '2026-11-05T09:00:00.000Z', completedAt: '2026-11-04T10:01:00.000Z' });
    expect(cleanLearningResults({ [id]: stored })[id]).toEqual(stored);
  });

  it('keeps the other workshop observations of the family scope', () => {
    window.localStorage.setItem(key, JSON.stringify({ 'readiness-count': { outcome: 'helped', at: '2026-11-03T10:00:00.000Z' } }));
    recordLabOutcome(owner, '2AP', labResultId('road_code_lab', 'cross'), 'independent');
    expect(JSON.parse(window.localStorage.getItem(key)!)).toHaveProperty('readiness-count');
  });

  it('shows in « the last 7 days » and suggests reopening the lab to review', () => {
    const now = Date.parse('2026-11-05T12:00:00.000Z');
    recordLabOutcome(owner, '2AP', labResultId('salat_lab', 'rakah'), 'review', '2026-11-05T10:00:00.000Z');
    recordLabOutcome(owner, '2AP', labResultId('mosque_adab_lab', 'adab'), 'independent', '2026-11-05T11:00:00.000Z');
    const summary = familyParentSummary('2AP', readFamilyResults(key), now);
    expect(summary.review).toBe(1);
    expect(summary.independent).toBe(1);
    expect(summary.next[0]).toMatchObject({ moduleId: 'immersive:salat_lab', title: { ar: 'الصلاة: حركات الركعة' } });
  });
});
