import { describe, expect, it } from 'vitest';
import { OFFICIAL_EXAMS_DATA } from './examsData';
import { getExamKind } from '../utils/examKind';
import { COURSES_DATA } from './coursesData';

describe('exam bank integrity', () => {
  it('has unique ids', () => {
    const ids = OFFICIAL_EXAMS_DATA.map((exam) => exam.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('keeps 1AP without formal papers', () => {
    expect(OFFICIAL_EXAMS_DATA.filter((exam) => exam.grade === '1AP')).toEqual([]);
  });

  it('never puts French or English before 3AP', () => {
    const tooEarly = OFFICIAL_EXAMS_DATA.filter(
      (exam) => (exam.grade === '1AP' || exam.grade === '2AP') && (exam.subject === 'french' || exam.subject === 'english')
    );
    expect(tooEarly).toEqual([]);
  });

  it('matches declared totalPoints with exercise + integration scores', () => {
    OFFICIAL_EXAMS_DATA.forEach((exam) => {
      const sum = exam.exercises.reduce((n, ex) => n + ex.points, 0) + exam.problemExercise.points;
      expect(sum, exam.id).toBe(exam.totalPoints);
    });
  });

  it('restricts BEP papers to 5AP', () => {
    OFFICIAL_EXAMS_DATA.filter((exam) => getExamKind(exam) === 'bep').forEach((exam) => {
      expect(exam.grade).toBe('5AP');
    });
  });

  it('covers 2AP arabic T3 and science all three terms', () => {
    expect(OFFICIAL_EXAMS_DATA.some((e) => e.id === 'exam-2ap-arabic-t3-2026')).toBe(true);
    [1, 2, 3].forEach((trim) => {
      expect(
        OFFICIAL_EXAMS_DATA.some((e) => e.grade === '2AP' && e.subject === 'science' && e.trimester === trim && getExamKind(e) === 'composition')
      ).toBe(true);
    });
  });

  it('adds english compositions from 3AP and islamic/civics on 2AP–5AP T1', () => {
    expect(OFFICIAL_EXAMS_DATA.some((e) => e.grade === '3AP' && e.subject === 'english')).toBe(true);
    expect(OFFICIAL_EXAMS_DATA.some((e) => e.grade === '5AP' && e.subject === 'english')).toBe(true);
    ['2AP', '3AP', '4AP', '5AP'].forEach((grade) => {
      expect(OFFICIAL_EXAMS_DATA.some((e) => e.grade === grade && e.subject === 'islamic')).toBe(true);
      expect(OFFICIAL_EXAMS_DATA.some((e) => e.grade === grade && e.subject === 'civics')).toBe(true);
    });
  });

  it('points relatedLessonIds at real course lessons', () => {
    const lessonIds = new Set(COURSES_DATA.map((lesson) => lesson.id));
    OFFICIAL_EXAMS_DATA.forEach((exam) => {
      (exam.relatedLessonIds || []).forEach((id) => {
        expect(lessonIds.has(id), `${exam.id} → ${id}`).toBe(true);
      });
    });
  });

  it('points per-exercise relatedLessonId at real course lessons', () => {
    const lessonIds = new Set(COURSES_DATA.map((lesson) => lesson.id));
    OFFICIAL_EXAMS_DATA.forEach((exam) => {
      [...exam.exercises, exam.problemExercise].forEach((ex) => {
        if (!ex.relatedLessonId) return;
        expect(lessonIds.has(ex.relatedLessonId), `${exam.id} / ${ex.titleAr} → ${ex.relatedLessonId}`).toBe(true);
      });
    });
  });

  it('links the retouched 4AP–5AP compositions on every exercise', () => {
    const retouched = [
      'exam-5ap-math-t1-2026',
      'exam-5ap-math-t2-2026',
      'exam-5ap-math-t3-2026',
      'exam-5ap-arabic-t1-2026',
      'exam-5ap-arabic-t2-2026',
      'exam-5ap-french-t1-2026',
      'exam-5ap-french-t2-2026',
      'exam-5ap-french-t3-2026',
      'exam-4ap-math-t1-2026',
      'exam-4ap-math-t2-2026',
      'exam-4ap-arabic-t1-2026',
      'exam-4ap-french-t1-2026',
    ];
    retouched.forEach((id) => {
      const exam = OFFICIAL_EXAMS_DATA.find((item) => item.id === id);
      expect(exam, id).toBeTruthy();
      [...exam!.exercises, exam!.problemExercise].forEach((ex) => {
        expect(ex.relatedLessonId, `${id} / ${ex.titleAr}`).toBeTruthy();
      });
    });
  });

  it('adds math homework T2/T3 for 3AP–5AP', () => {
    [
      'homework-3ap-math-t3-2026',
      'homework-4ap-math-t3-2026',
      'homework-5ap-math-t2-2026',
      'homework-5ap-math-t3-2026',
    ].forEach((id) => {
      const exam = OFFICIAL_EXAMS_DATA.find((item) => item.id === id);
      expect(exam, id).toBeTruthy();
      expect(getExamKind(exam!)).toBe('devoir');
    });
  });

  it('has devoirs on more than T1 math only', () => {
    const devoirs = OFFICIAL_EXAMS_DATA.filter((e) => getExamKind(e) === 'devoir');
    expect(devoirs.some((e) => e.trimester === 2)).toBe(true);
    expect(devoirs.some((e) => e.trimester === 3)).toBe(true);
    expect(devoirs.some((e) => e.subject === 'arabic')).toBe(true);
    expect(devoirs.some((e) => e.subject === 'science')).toBe(true);
  });

  it('ships P2 tamazight, art and technology compositions on 3AP–5AP T1–T3', () => {
    (['3AP', '4AP', '5AP'] as const).forEach((grade) => {
      (['tamazight', 'art', 'technology'] as const).forEach((subject) => {
        ([1, 2, 3] as const).forEach((trimester) => {
          expect(
            OFFICIAL_EXAMS_DATA.some(
              (exam) =>
                exam.grade === grade &&
                exam.subject === subject &&
                exam.trimester === trimester &&
                getExamKind(exam) === 'composition'
            ),
            `${grade} ${subject} T${trimester}`
          ).toBe(true);
        });
      });
    });
  });

  it('never puts tamazight, art or technology before 3AP', () => {
    const tooEarly = OFFICIAL_EXAMS_DATA.filter(
      (exam) =>
        (exam.grade === '1AP' || exam.grade === '2AP') &&
        (exam.subject === 'tamazight' || exam.subject === 'art' || exam.subject === 'technology')
    );
    expect(tooEarly).toEqual([]);
  });
});
