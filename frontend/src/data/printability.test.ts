import { describe, expect, it } from 'vitest';
import { COURSES_DATA } from './coursesData';
import { OFFICIAL_EXAMS_DATA } from './examsData';

/** A lesson can produce a non-blank revision fiche if it has at least one of these fields. */
function lessonHasPrintableContent(lesson: (typeof COURSES_DATA)[number]): boolean {
  return Boolean(
    lesson.summaryAr?.trim()
    || (lesson.rulesAr && lesson.rulesAr.length > 0)
    || (lesson.keyFormulas && lesson.keyFormulas.length > 0)
    || (lesson.detailedCourse?.vocabulary && lesson.detailedCourse.vocabulary.length > 0)
    || lesson.detailedCourse?.takeawayAr?.trim()
  );
}

function examHasPrintableContent(exam: (typeof OFFICIAL_EXAMS_DATA)[number]): boolean {
  return Boolean(
    exam.titleAr?.trim()
    && exam.exercises.length > 0
    && exam.exercises.every((ex) => ex.titleAr?.trim() && ex.contentAr?.trim())
    && exam.problemExercise?.titleAr?.trim()
    && exam.problemExercise?.contentAr?.trim()
  );
}

describe('Printability — courses (fiches de révision)', () => {
  it('has at least one printable field on every lesson (1AP–5AP)', () => {
    const thin = COURSES_DATA.filter((lesson) => !lessonHasPrintableContent(lesson));
    expect(thin.map((l) => l.id)).toEqual([]);
  });

  it('covers all primary grades with courses', () => {
    for (const grade of ['1AP', '2AP', '3AP', '4AP', '5AP'] as const) {
      expect(COURSES_DATA.some((l) => l.grade === grade)).toBe(true);
    }
  });
});

describe('Printability — official exams', () => {
  it('has complete subject content on every exam paper (2AP–5AP)', () => {
    const empty = OFFICIAL_EXAMS_DATA.filter((exam) => !examHasPrintableContent(exam));
    expect(empty.map((e) => e.id)).toEqual([]);
  });

  it('has no 1AP exams (bank starts at 2AP)', () => {
    expect(OFFICIAL_EXAMS_DATA.filter((e) => e.grade === '1AP')).toEqual([]);
  });

  it('covers 2AP–5AP with at least one paper each', () => {
    for (const grade of ['2AP', '3AP', '4AP', '5AP'] as const) {
      expect(OFFICIAL_EXAMS_DATA.some((e) => e.grade === grade)).toBe(true);
    }
  });
});
