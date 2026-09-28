import { describe, it, expect } from 'vitest';
import { createFreshGuestProfile } from '../hooks/useUserProgress';
import { MAX_LESSON_SESSIONS, recordLessonSuccess } from './competenceProgress';

describe('recordLessonSuccess', () => {
  it('credits every competence mapped to a 1AP math lesson', () => {
    const at = '2026-09-28T21:00:00.000Z';
    const next = recordLessonSuccess(createFreshGuestProfile('1AP'), 'math-1ap-t1-spatial-relations', at);

    expect(next.competenceStats['math-1ap-c-spatial-position']).toEqual({
      attempts: 1,
      successes: 1,
      lastAt: at,
      lastLessonId: 'math-1ap-t1-spatial-relations',
    });
    expect(next.lessonSessions).toEqual([
      {
        at,
        lessonId: 'math-1ap-t1-spatial-relations',
        competenceIds: ['math-1ap-c-spatial-position'],
        outcome: 'success',
      },
    ]);
  });

  it('leaves unmapped lessons unchanged', () => {
    const prev = createFreshGuestProfile('5AP');
    expect(recordLessonSuccess(prev, 'math-5ap-division')).toBe(prev);
  });

  it('caps the session log so the child profile stays small', () => {
    let profile = createFreshGuestProfile('1AP');
    for (let i = 0; i < MAX_LESSON_SESSIONS + 5; i += 1) {
      profile = recordLessonSuccess(profile, 'math-1ap-t1-spatial-relations', `2026-09-28T21:00:${String(i).padStart(2, '0')}.000Z`);
    }
    expect(profile.lessonSessions).toHaveLength(MAX_LESSON_SESSIONS);
    expect(profile.competenceStats['math-1ap-c-spatial-position'].successes).toBe(MAX_LESSON_SESSIONS + 5);
  });
});
