import { describe, it, expect } from 'vitest';
import { createFreshGuestProfile } from '../hooks/useUserProgress';
import { MATH_1AP_COMPETENCES } from '../data/competences/math1ap';
import { ARABIC_1AP_COMPETENCES } from '../data/competences/arabic1ap';
import { MATH_5AP_COMPETENCES } from '../data/competences/math5ap';
import { ARABIC_5AP_COMPETENCES } from '../data/competences/arabic5ap';

const GRADE_1AP_COUNT = MATH_1AP_COMPETENCES.length + ARABIC_1AP_COMPETENCES.length;
const GRADE_5AP_COUNT = MATH_5AP_COMPETENCES.length + ARABIC_5AP_COMPETENCES.length;
import {
  MAX_LESSON_SESSIONS,
  WEEKLY_SESSION_MINUTES,
  buildParentNotebook,
  buildWeeklyPlan,
  formatWeeklyRecap,
  recordLessonFailure,
  recordLessonSuccess,
} from './competenceProgress';

describe('recordLessonSuccess', () => {
  it('credits every competence mapped to a 1AP math lesson', () => {
    const at = '2026-09-28T21:00:00.000Z';
    const next = recordLessonSuccess(createFreshGuestProfile('1AP'), 'math-1ap-t1-spatial-relations', at);

    expect(next.competenceStats['math-1ap-c-spatial-position']).toEqual({
      attempts: 1,
      successes: 1,
      failures: 0,
      lastAt: at,
      lastLessonId: 'math-1ap-t1-spatial-relations',
      lastOutcome: 'success',
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
    expect(recordLessonSuccess(prev, 'french-5ap-not-mapped-yet')).toBe(prev);
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
    expect(notebook.todo).toHaveLength(GRADE_1AP_COUNT);
    expect(notebook.todo.every((row) => Boolean(row.reviewLessonId))).toBe(true);
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
    expect(notebook.todo).toHaveLength(GRADE_1AP_COUNT - 1);
    expect(notebook.recentSessions[0]).toEqual(
      expect.objectContaining({
        lessonId: 'math-1ap-t1-spatial-relations',
        competenceIds: ['math-1ap-c-spatial-position'],
      }),
    );
  });

  it('shows an empty catalogue for a grade that has no competence map yet', () => {
    const notebook = buildParentNotebook(createFreshGuestProfile('3AP'));
    expect(notebook.worked).toHaveLength(0);
    expect(notebook.todo).toHaveLength(0);
    expect(notebook.recentSessions).toHaveLength(0);
  });

  it('lists the 5AP catalogue once the child reaches the last primary year', () => {
    const notebook = buildParentNotebook(createFreshGuestProfile('5AP'));
    expect(notebook.todo).toHaveLength(GRADE_5AP_COUNT);
  });

  it('uses the year currently on screen when it differs from the stored profile grade', () => {
    const notebook = buildParentNotebook(createFreshGuestProfile('5AP'), '1AP');
    expect(notebook.grade).toBe('1AP');
    expect(notebook.todo).toHaveLength(GRADE_1AP_COUNT);
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

describe('recordLessonFailure', () => {
  it('puts a missed 1AP math lesson in the review list without counting a success', () => {
    const at = '2026-09-28T22:00:00.000Z';
    const next = recordLessonFailure(createFreshGuestProfile('1AP'), 'math-1ap-t1-spatial-relations', at);
    expect(next.competenceStats['math-1ap-c-spatial-position']).toEqual({
      attempts: 1,
      successes: 0,
      failures: 1,
      lastAt: at,
      lastLessonId: 'math-1ap-t1-spatial-relations',
      lastOutcome: 'fail',
    });
    const notebook = buildParentNotebook(next);
    expect(notebook.review.map((row) => row.competenceId)).toEqual(['math-1ap-c-spatial-position']);
    expect(notebook.worked).toHaveLength(0);
  });

  it('keeps a single fail session when the child misses again on the same lesson', () => {
    let profile = recordLessonFailure(createFreshGuestProfile('1AP'), 'math-1ap-t1-spatial-relations', '2026-09-28T22:00:00.000Z');
    profile = recordLessonFailure(profile, 'math-1ap-t1-spatial-relations', '2026-09-28T22:01:00.000Z');
    expect(profile.lessonSessions).toHaveLength(1);
    expect(profile.competenceStats['math-1ap-c-spatial-position'].failures).toBe(2);
  });

  it('clears review after a later full success', () => {
    const missed = recordLessonFailure(createFreshGuestProfile('1AP'), 'math-1ap-t1-spatial-relations', '2026-09-28T22:00:00.000Z');
    const recovered = recordLessonSuccess(missed, 'math-1ap-t1-spatial-relations', '2026-09-28T22:10:00.000Z');
    const notebook = buildParentNotebook(recovered);
    expect(notebook.review).toHaveLength(0);
    expect(notebook.worked.map((row) => row.competenceId)).toEqual(['math-1ap-c-spatial-position']);
  });
});

describe('buildWeeklyPlan', () => {
  const now = new Date('2026-10-03T10:00:00.000Z');

  it('picks the first unstarted competence when nothing is in review', () => {
    const notebook = buildParentNotebook(createFreshGuestProfile('1AP'));
    const plan = buildWeeklyPlan(notebook, now);

    expect(plan.next?.reviewLessonId).toBe('math-1ap-t1-spatial-relations');
    expect(plan.next?.status).toBe('todo');
    expect(plan.minutes).toBe(WEEKLY_SESSION_MINUTES);
    expect(plan.reviewCount).toBe(0);
    expect(plan.weekSuccesses).toBe(0);
  });

  it('prefers a missed competence over the next todo', () => {
    const profile = recordLessonFailure(
      createFreshGuestProfile('1AP'),
      'math-1ap-t1-spatial-relations',
      '2026-09-28T22:00:00.000Z',
    );
    const plan = buildWeeklyPlan(buildParentNotebook(profile), now);

    expect(plan.next?.competenceId).toBe('math-1ap-c-spatial-position');
    expect(plan.next?.status).toBe('review');
    expect(plan.reviewCount).toBe(1);
  });

  it('counts only successes from the last seven days', () => {
    const thisWeek = recordLessonSuccess(
      createFreshGuestProfile('1AP'),
      'math-1ap-t1-spatial-relations',
      '2026-09-28T21:00:00.000Z',
    );
    expect(buildWeeklyPlan(buildParentNotebook(thisWeek), now).weekSuccesses).toBe(1);

    const older = recordLessonSuccess(
      createFreshGuestProfile('1AP'),
      'math-1ap-t1-spatial-relations',
      '2026-09-20T21:00:00.000Z',
    );
    expect(buildWeeklyPlan(buildParentNotebook(older), now).weekSuccesses).toBe(0);
  });
});

describe('formatWeeklyRecap', () => {
  it('includes the child name, grade and tomorrow label', () => {
    const notebook = buildParentNotebook(createFreshGuestProfile('1AP'));
    const plan = buildWeeklyPlan(notebook, new Date('2026-10-03T10:00:00.000Z'));
    const recap = formatWeeklyRecap(notebook, plan, 'fr');

    expect(recap).toContain('تلميذ مَسِيد');
    expect(recap).toContain('1AP');
    expect(recap).toContain(plan.next!.labelFr);
    expect(recap).toContain(`${WEEKLY_SESSION_MINUTES} min`);
  });
});
