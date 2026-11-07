import { expect, it } from 'vitest';
import { recordPracticeResult, buildParentNotebook } from './competenceProgress';
import { mergeNotebookProgress } from './mergeNotebookProgress';
import { normalizeUserProfile } from '../hooks/useUserProgress';
import { missionDoneToday } from './dailyMission';
import type { UserProfile } from '../types';
import type { VillageSessionSummary } from './villageSession';
const summary: VillageSessionSummary = { id: 'session-1', title: 'Fractions', grade: '5AP', learn: {}, transfer: {}, alone: 0, helped: 0, needs: 0, quizCorrect: 0, quizTotal: 2, next: 'interactive' };
const profile = () => ({ name: 'Test', grade: '5AP', competenceStats: {}, lessonSessions: Array.from({ length: 40 }, (_, i) => ({ at: new Date(Date.UTC(2026, 9, 1, 10, i)).toISOString(), lessonId: 'math-5ap-fractions', competenceIds: ['math-5ap-c-fractions'], outcome: 'success' as const })) }) as unknown as UserProfile;
it('preserves all forty scored sessions after a hundred workshop openings', () => {
  const original = profile(); let next = original;
  for (let i = 0; i < 100; i++) next = recordPracticeResult(next, 'math-5ap-fractions', { outcome: 'success', villageSummary: { ...summary, id: 'opening-' + i } }, new Date(Date.UTC(2026, 10, 7, 10, 0, i)).toISOString());
  expect(next.lessonSessions).toEqual(original.lessonSessions);
  expect(next.villageSummaries).toHaveLength(1);
  expect(next.villageSummaries![0].villageSummary.id).toBe('opening-99');
  expect(next.competenceStats).toEqual({});
  expect(buildParentNotebook(next).historySessions).toHaveLength(40);
  expect(missionDoneToday(next, 'math-5ap-fractions', false, new Date('2026-11-07T12:00:00Z'))).toBe(false);
});
it('limits only the separate summaries to six and merges the latest Algerian day', () => {
  let next = profile();
  for (let day = 1; day <= 10; day++) next = recordPracticeResult(next, 'math-5ap-fractions', { outcome: 'success', villageSummary: summary }, new Date(Date.UTC(2026, 9, day, 10)).toISOString());
  expect(next.villageSummaries).toHaveLength(6);
  const early = recordPracticeResult(profile(), 'math-5ap-fractions', { outcome: 'success', villageSummary: summary }, '2026-11-06T23:30:00Z');
  const late = recordPracticeResult(profile(), 'math-5ap-fractions', { outcome: 'success', villageSummary: { ...summary, helped: 2 } }, '2026-11-07T10:00:00Z');
  const merged = mergeNotebookProgress(late, early);
  expect(merged.villageSummaries).toHaveLength(1);
  expect(merged.villageSummaries![0].villageSummary.helped).toBe(2);
});
it('migrates legacy embedded observations without removing real history', () => {
  const original = profile();
  const raw = { ...original, lessonSessions: [...original.lessonSessions!, { at: '2026-11-07T10:00:00Z', lessonId: 'math-5ap-fractions', competenceIds: [], outcome: 'success' as const, villageSummary: summary }] };
  const restored = normalizeUserProfile(JSON.parse(JSON.stringify(raw)), '5AP');
  expect(restored.lessonSessions).toEqual(original.lessonSessions);
  expect(restored.villageSummaries).toHaveLength(1);
  expect(mergeNotebookProgress(restored, raw).villageSummaries).toHaveLength(1);
});
