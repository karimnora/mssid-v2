import { describe, it, expect } from 'vitest';
import { createFreshGuestProfile } from '../hooks/useUserProgress';
import { MATH_1AP_COMPETENCES } from '../data/competences/math1ap';
import { MAX_LESSON_SESSIONS, buildParentNotebook, recordLessonSuccess } from './competenceProgress';

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

describe('buildParentNotebook', () => {
  it('lists every 1AP math competence as not started on a fresh profile', () => {
    const notebook = buildParentNotebook(createFreshGuestProfile('1AP'));
    expect(notebook.worked).toHaveLength(0);
    expect(notebook.todo).toHaveLength(MATH_1AP_COMPETENCES.length);
    expect(notebook.todo[0].reviewLessonId).toBe('math-1ap-t1-spatial-relations');
  });

  it('moves a mapped competence to worked and keeps the last lesson as the review target', () => {
    const at = '2026-09-28T21:00:00.000Z';
    const profile = recordLessonSuccess(createFreshGuestProfile('1AP'), 'math-1ap-t1-spatial-relations', at);
    const notebook = buildParentNotebook(profile);

    expect(notebook.worked).toEqual([
      expect.objectContaining({
        competenceId: 'math-1ap-c-spatial-position',
        status: 'worked',
        successes: 1,
        lastAt: at,
        reviewLessonId: 'math-1ap-t1-spatial-relations',
      }),
    ]);
    expect(notebook.todo).toHaveLength(MATH_1AP_COMPETENCES.length - 1);
    expect(notebook.recentSessions[0]).toEqual(
      expect.objectContaining({
        lessonId: 'math-1ap-t1-spatial-relations',
        competenceIds: ['math-1ap-c-spatial-position'],
      }),
    );
  });

  it('shows an empty catalogue for a grade that has no competence map yet', () => {
    const notebook = buildParentNotebook(createFreshGuestProfile('5AP'));
    expect(notebook.worked).toHaveLength(0);
    expect(notebook.todo).toHaveLength(0);
    expect(notebook.recentSessions).toHaveLength(0);
  });

  it('uses the year currently on screen when it differs from the stored profile grade', () => {
    const notebook = buildParentNotebook(createFreshGuestProfile('5AP'), '1AP');
    expect(notebook.grade).toBe('1AP');
    expect(notebook.todo).toHaveLength(MATH_1AP_COMPETENCES.length);
  });

  it('still shows leftover 1AP stats if the child later switches grade', () => {
    const profile = {
      ...recordLessonSuccess(createFreshGuestProfile('1AP'), 'math-1ap-t1-spatial-relations', '2026-09-28T21:00:00.000Z'),
      grade: '5AP' as const,
    };
    const notebook = buildParentNotebook(profile, '5AP');
    expect(notebook.worked.map((row) => row.competenceId)).toEqual(['math-1ap-c-spatial-position']);
  });
});
