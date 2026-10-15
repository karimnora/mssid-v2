import {it,expect} from 'vitest';
import {mergeNotebookProgress} from './mergeNotebookProgress';
it('retains newer local observations and deduplicates replayed sessions',()=>{
 const local={competenceStats:{a:{attempts:2,successes:1,failures:1,lastAt:'2026-10-15T10:00:00Z',lastLessonId:'new',lastOutcome:'fail' as const}},lessonSessions:[{at:'2026-10-15T10:00:00Z',lessonId:'new',outcome:'fail' as const,competenceIds:['a']}]};
 const remote={competenceStats:{a:{attempts:3,successes:2,lastAt:'2026-10-14T10:00:00Z',lastLessonId:'old',lastOutcome:'success' as const}},lessonSessions:local.lessonSessions};
 const merged=mergeNotebookProgress(local,remote);expect(merged.competenceStats?.a.lastOutcome).toBe('fail');expect(merged.competenceStats?.a.attempts).toBe(3);expect(merged.lessonSessions).toHaveLength(1);
});
