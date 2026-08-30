import { describe, expect, it } from 'vitest';
import { OFFICIAL_EXAMS_DATA } from './examsData';
import { DEVOIR_EXAM_PAPERS } from './exams/devoirPapers';
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

  it('adds english compositions from 3AP and islamic/civics on 2APâ5AP T1', () => {
    expect(OFFICIAL_EXAMS_DATA.some((e) => e.grade === '3AP' && e.subject === 'english')).toBe(true);
    expect(OFFICIAL_EXAMS_DATA.some((e) => e.grade === '5AP' && e.subject === 'english')).toBe(true);
    ['2AP', '3AP', '4AP', '5AP'].forEach((grade) => {
      expect(OFFICIAL_EXAMS_DATA.some((e) => e.grade === grade && e.subject === 'islamic')).toBe(true);
      expect(OFFICIAL_EXAMS_DATA.some((e) => e.grade === grade && e.subject === 'civics')).toBe(true);
    });
  });

  it('ships islamic and civics compositions in T2 and T3 on 2APâ5AP', () => {
    (['2AP', '3AP', '4AP', '5AP'] as const).forEach((grade) => {
      (['islamic', 'civics'] as const).forEach((subject) => {
        ([2, 3] as const).forEach((trimester) => {
          const n = OFFICIAL_EXAMS_DATA.filter(
            (exam) =>
              exam.grade === grade &&
              exam.subject === subject &&
              exam.trimester === trimester &&
              getExamKind(exam) === 'composition'
          ).length;
          expect(n, `${grade} ${subject} T${trimester}`).toBeGreaterThanOrEqual(1);
        });
      });
    });
  });

  it('ships english compositions in T2 and T3 on 3APâ5AP', () => {
    (['3AP', '4AP', '5AP'] as const).forEach((grade) => {
      ([2, 3] as const).forEach((trimester) => {
        const n = OFFICIAL_EXAMS_DATA.filter(
          (exam) =>
            exam.grade === grade &&
            exam.subject === 'english' &&
            exam.trimester === trimester &&
            getExamKind(exam) === 'composition'
        ).length;
        expect(n, `${grade} english T${trimester}`).toBeGreaterThanOrEqual(1);
      });
    });
  });

  it('points relatedLessonIds at real course lessons', () => {
    const lessonIds = new Set(COURSES_DATA.map((lesson) => lesson.id));
    OFFICIAL_EXAMS_DATA.forEach((exam) => {
      (exam.relatedLessonIds || []).forEach((id) => {
        expect(lessonIds.has(id), `${exam.id} â ${id}`).toBe(true);
      });
    });
  });

  it('points per-exercise relatedLessonId at real course lessons', () => {
    const lessonIds = new Set(COURSES_DATA.map((lesson) => lesson.id));
    OFFICIAL_EXAMS_DATA.forEach((exam) => {
      [...exam.exercises, exam.problemExercise].forEach((ex) => {
        if (!ex.relatedLessonId) return;
        expect(lessonIds.has(ex.relatedLessonId), `${exam.id} / ${ex.titleAr} â ${ex.relatedLessonId}`).toBe(true);
      });
    });
  });

  it('links the retouched 4APâ5AP compositions on every exercise', () => {
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

  it('ships 2AP composition matrix T1-T3 for core subjects', () => {
    (['math', 'arabic', 'science', 'islamic', 'civics'] as const).forEach((subject) => {
      ([1, 2, 3] as const).forEach((trimester) => {
        expect(
          OFFICIAL_EXAMS_DATA.some(
            (e) =>
              e.grade === '2AP' &&
              e.subject === subject &&
              e.trimester === trimester &&
              getExamKind(e) === 'composition'
          ),
          `2AP ${subject} T${trimester}`
        ).toBe(true);
      });
    });
  });

  it('links every exercise on 2AP gap-fill compositions', () => {
    const gapFill = [
      'exam-2ap-math-t1-2026',
      'exam-2ap-math-t2-2026',
      'exam-2ap-math-t3-2026',
      'exam-2ap-arabic-t1-2026',
      'exam-2ap-arabic-t2-2026',
      'exam-2ap-arabic-t3-2026',
      'exam-2ap-science-t1-2026',
      'exam-2ap-science-t2-2026',
      'exam-2ap-science-t3-2026',
      'exam-2ap-islamic-t1-2026',
      'exam-2ap-civics-t1-2026',
      'exam-2ap-islamic-t2-2026',
      'exam-2ap-islamic-t3-2026',
      'exam-2ap-civics-t2-2026',
      'exam-2ap-civics-t3-2026',
    ];
    gapFill.forEach((id) => {
      const exam = OFFICIAL_EXAMS_DATA.find((item) => item.id === id);
      expect(exam, id).toBeTruthy();
      expect(exam!.relatedLessonIds?.length, `${id} relatedLessonIds`).toBeGreaterThan(0);
      [...exam!.exercises, exam!.problemExercise].forEach((ex) => {
        expect(ex.relatedLessonId, `${id} / ${ex.titleAr}`).toBeTruthy();
      });
    });
  });

  it('adds math homework T2/T3 for 3APâ5AP', () => {
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

  it('ships a 5AP Ã©valuation des acquis pack for maths, arabic and science', () => {
    (['exam-5ap-math-acquis-2026', 'exam-5ap-arabic-acquis-2026', 'exam-5ap-science-acquis-2026'] as const).forEach((id) => {
      const exam = OFFICIAL_EXAMS_DATA.find((item) => item.id === id);
      expect(exam, id).toBeTruthy();
      expect(getExamKind(exam!)).toBe('acquis');
      expect(exam!.grade).toBe('5AP');
    });
  });

  it('restricts Ã©valuation des acquis papers to 5AP', () => {
    OFFICIAL_EXAMS_DATA.filter((exam) => getExamKind(exam) === 'acquis').forEach((exam) => {
      expect(exam.grade).toBe('5AP');
    });
  });

  it('ships at least one arabic and science devoir per trimester on 2APâ5AP', () => {
    (['2AP', '3AP', '4AP', '5AP'] as const).forEach((grade) => {
      (['arabic', 'science'] as const).forEach((subject) => {
        ([1, 2, 3] as const).forEach((trimester) => {
          const n = OFFICIAL_EXAMS_DATA.filter(
            (exam) =>
              exam.grade === grade &&
              exam.subject === subject &&
              exam.trimester === trimester &&
              getExamKind(exam) === 'devoir'
          ).length;
          expect(n, `${grade} ${subject} T${trimester}`).toBeGreaterThanOrEqual(1);
        });
      });
    });
  });

  it('ships islamic and civics devoirs each term on 2APâ5AP', () => {
    (['2AP', '3AP', '4AP', '5AP'] as const).forEach((grade) => {
      (['islamic', 'civics'] as const).forEach((subject) => {
        ([1, 2, 3] as const).forEach((trimester) => {
          const n = OFFICIAL_EXAMS_DATA.filter(
            (exam) =>
              exam.grade === grade &&
              exam.subject === subject &&
              exam.trimester === trimester &&
              getExamKind(exam) === 'devoir'
          ).length;
          expect(n, `${grade} ${subject} T${trimester}`).toBeGreaterThanOrEqual(1);
        });
      });
    });
  });

  it('ships french and english devoirs each term on 3APâ5AP', () => {
    (['3AP', '4AP', '5AP'] as const).forEach((grade) => {
      (['french', 'english'] as const).forEach((subject) => {
        ([1, 2, 3] as const).forEach((trimester) => {
          const n = OFFICIAL_EXAMS_DATA.filter(
            (exam) =>
              exam.grade === grade &&
              exam.subject === subject &&
              exam.trimester === trimester &&
              getExamKind(exam) === 'devoir'
          ).length;
          expect(n, `${grade} ${subject} T${trimester}`).toBeGreaterThanOrEqual(1);
        });
      });
    });
  });

  it('deepens lessons linked from the arabic/science homework pack', () => {
    const ids = [...new Set(DEVOIR_EXAM_PAPERS.flatMap((exam) => exam.relatedLessonIds || []))];
    const byId = new Map(COURSES_DATA.map((lesson) => [lesson.id, lesson]));
    ids.forEach((id) => {
      const lesson = byId.get(id);
      expect(lesson, id).toBeTruthy();
      const quizN = lesson!.quiz?.length || 0;
      const evalN = lesson!.evaluationExercises?.length || 0;
      expect(quizN >= 6 || evalN >= 6, `${id} quiz=${quizN} eval=${evalN}`).toBe(true);
      const levels = new Set((lesson!.progressiveExercises || []).map((ex) => ex.level));
      expect(levels.has(1) && levels.has(2) && levels.has(3), `${id} missing palier 1-2-3`).toBe(true);
    });
  });

  it('ships at least 3 math and arabic compositions per trimester on 3AP–5AP', () => {
    (['3AP', '4AP', '5AP'] as const).forEach((grade) => {
      (['math', 'arabic'] as const).forEach((subject) => {
        ([1, 2, 3] as const).forEach((trimester) => {
          const n = OFFICIAL_EXAMS_DATA.filter(
            (exam) =>
              exam.grade === grade &&
              exam.subject === subject &&
              exam.trimester === trimester &&
              getExamKind(exam) === 'composition'
          ).length;
          expect(n, `${grade} ${subject} T${trimester}`).toBeGreaterThanOrEqual(3);
        });
      });
    });
  });

  it('ships P2 tamazight and art compositions on 3AP–5AP T1–T3', () => {
    (['3AP', '4AP', '5AP'] as const).forEach((grade) => {
      (['tamazight', 'art'] as const).forEach((subject) => {
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

  it('never puts tamazight or art before 3AP', () => {
    const tooEarly = OFFICIAL_EXAMS_DATA.filter(
      (exam) =>
        (exam.grade === '1AP' || exam.grade === '2AP') &&
        (exam.subject === 'tamazight' || exam.subject === 'art')
    );
    expect(tooEarly).toEqual([]);
  });

  it('fills operationsAr whenever an exercise instructs a posed vertical calculation', () => {
    // "عمود…" also appears in geometry (perpendicular lines/angles) — those are excluded via مستقيم/زاوي.
    OFFICIAL_EXAMS_DATA.forEach((exam) => {
      [...exam.exercises, exam.problemExercise].forEach((ex) => {
        const asksForPosedOperation = /عمود/.test(ex.contentAr) && /\d/.test(ex.contentAr) && !/مستقيم|زاوي|زوايا/.test(ex.contentAr);
        if (asksForPosedOperation) {
          expect(ex.operationsAr, `${exam.id} — ${ex.titleAr}`).toBeTruthy();
        }
      });
    });
  });

  it('ships history_geo, tamazight and art devoirs each term on 3AP–5AP', () => {
    (['3AP', '4AP', '5AP'] as const).forEach((grade) => {
      (['history_geo', 'tamazight', 'art'] as const).forEach((subject) => {
        ([1, 2, 3] as const).forEach((trimester) => {
          const n = OFFICIAL_EXAMS_DATA.filter(
            (exam) =>
              exam.grade === grade &&
              exam.subject === subject &&
              exam.trimester === trimester &&
              getExamKind(exam) === 'devoir'
          ).length;
          expect(n, `${grade} ${subject} T${trimester}`).toBeGreaterThanOrEqual(1);
        });
      });
    });
  });

  it('gives every 4AP/5AP arabic composition at least one إعراب exercise with irabTableAr', () => {
    const compositions = OFFICIAL_EXAMS_DATA.filter(
      (exam) => exam.subject === 'arabic' && (exam.grade === '4AP' || exam.grade === '5AP') && getExamKind(exam) === 'composition'
    );
    expect(compositions.length).toBeGreaterThan(0);
    compositions.forEach((exam) => {
      const hasIrabTable = exam.exercises.some((ex) => (ex.irabTableAr?.length || 0) > 0);
      expect(hasIrabTable, exam.id).toBe(true);
    });
  });
});
