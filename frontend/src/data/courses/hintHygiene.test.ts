import { describe, expect, it } from 'vitest';
import { COURSES_DATA } from '../coursesData';
import { givesAnswer } from './hintHygiene';

describe('hints never give the answer', () => {
  it('recognises a hint that hands over the solution', () => {
    expect(givesAnswer('La réponse est « arrivées ».', 'arrivées')).toBe(true);
    expect(givesAnswer('246 × 3 = 738.', '738')).toBe(true);
    expect(givesAnswer('اجمع الوحدات أولاً.', '738')).toBe(false);
    // A one-letter or two-letter answer (« a », « un ») appears in ordinary sentences: not a leak.
    expect(givesAnswer('Essaie avec « avait ».', 'a')).toBe(false);
  });

  it('leaves no such hint in any exercise of the catalogue', () => {
    const offenders: string[] = [];
    for (const lesson of COURSES_DATA) {
      for (const ex of [...lesson.progressiveExercises ?? [], ...lesson.evaluationExercises ?? []]) {
        if (/-m2?-(guided|solo\d+|transfer)$/.test(ex.id)) continue; // missions have their own hint tests
        const hints = [...ex.hintsAr ?? [], ...(ex.progressiveHints ?? []).map(hint => hint.contentAr)];
        if (hints.some(hint => givesAnswer(hint, String(ex.solutionAr ?? '')))) offenders.push(ex.id);
      }
    }
    expect(offenders).toEqual([]);
  });

  it('keeps at least one hint on most exercises that had some', () => {
    const exercises = COURSES_DATA.flatMap(lesson => [...lesson.progressiveExercises ?? [], ...lesson.evaluationExercises ?? []]);
    const withHint = exercises.filter(ex => (ex.hintsAr?.length ?? 0) > 0 || (ex.progressiveHints?.length ?? 0) > 0).length;
    expect(withHint / exercises.length).toBeGreaterThan(0.8);
  });
});
