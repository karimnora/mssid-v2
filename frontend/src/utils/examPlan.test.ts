import { describe, expect, it } from 'vitest';
import { createFreshGuestProfile } from '../hooks/useUserProgress';
import { COURSES_DATA } from '../data/coursesData';
import { OFFICIAL_EXAMS_DATA } from '../data/examsData';
import { buildParentNotebook, recordPracticeResult } from './competenceProgress';
import { EXAM_PLAN_MAX_DAYS, buildExamPlan, daysBetween, suggestExamDate, todayIndex, trimesterForDate } from './examPlan';

const NOW = new Date(2026, 10, 4, 18, 0); // 4 novembre 2026, soir
const notebookWith = (misses: [string, number][]) => {
  let profile = { ...createFreshGuestProfile('5AP'), name: 'أمين' };
  let minute = 0;
  for (const [lessonId, count] of misses) {
    for (let i = 0; i < count; i++) {
      profile = recordPracticeResult(profile, lessonId, { outcome: 'fail', exerciseId: `${lessonId}-x${i}` }, new Date(2026, 10, 3, 17, minute++).toISOString());
    }
  }
  return buildParentNotebook(profile, '5AP');
};

describe('plan « 10 jours avant la composition »', () => {
  it('suggests the next composition window and its trimester', () => {
    expect(suggestExamDate(NOW)).toEqual({ date: '2026-12-01', trimester: 1 });
    expect(suggestExamDate(new Date(2027, 0, 10)).trimester).toBe(2);
    expect(trimesterForDate('2027-05-17')).toBe(3);
  });

  it('plans at most 10 days, ending with a full mock composition the day before', () => {
    const plan = buildExamPlan({ notebook: notebookWith([]), lessons: COURSES_DATA, exams: OFFICIAL_EXAMS_DATA, examDate: '2026-12-01', now: NOW });
    expect(plan.days).toHaveLength(EXAM_PLAN_MAX_DAYS);
    expect(plan.days[0].date).toBe('2026-11-21');
    const last = plan.days[plan.days.length - 1];
    expect(last.date).toBe('2026-11-30');
    expect(last.kind).toBe('full-mock');
    expect(last.examIds).toHaveLength(2);
    // A mock paper every third day, from the 5AP bank of the right trimester.
    const mocks = plan.days.filter((day) => day.kind === 'mock');
    expect(mocks.length).toBe(3);
    for (const id of mocks.flatMap((day) => day.examIds)) {
      const exam = OFFICIAL_EXAMS_DATA.find((e) => e.id === id)!;
      expect(exam.grade).toBe('5AP');
      expect(exam.trimester).toBe(1);
    }
    expect(new Set(plan.days.flatMap((d) => d.examIds)).size).toBe(plan.days.flatMap((d) => d.examIds).length);
  });

  it('starts with the most missed competence and alternates maths and Arabic', () => {
    const notebook = notebookWith([['math-5ap-division', 1], ['arabic-5ap-tamyiz', 3], ['math-5ap-fractions', 2]]);
    const plan = buildExamPlan({ notebook, lessons: COURSES_DATA, exams: OFFICIAL_EXAMS_DATA, examDate: '2026-12-01', now: NOW });
    const focus = plan.days.filter((day) => day.kind === 'focus');
    // 3 misses on التمييز, 2 on fractions, 1 on division.
    expect(focus[0].competenceId).toBe('ar-5ap-c-tamyiz');
    expect(focus[0].reason).toBe('missed');
    expect(focus[1].competenceId).toBe('math-5ap-c-fractions');
    expect(focus[3].competenceId).toBe('math-5ap-c-division');
    expect(focus.map((day) => day.subject).slice(0, 4)).toEqual(['arabic', 'math', 'arabic', 'math']);
    expect(focus.every((day) => day.lessonId)).toBe(true);
  });

  it('shortens the plan when the composition is close, and is empty once it has passed', () => {
    const close = buildExamPlan({ notebook: notebookWith([]), lessons: COURSES_DATA, exams: OFFICIAL_EXAMS_DATA, examDate: '2026-11-08', now: NOW });
    expect(close.days).toHaveLength(4);
    expect(todayIndex(close, NOW)).toBe(0);
    expect(daysBetween(NOW, '2026-11-08')).toBe(4);
    const past = buildExamPlan({ notebook: notebookWith([]), lessons: COURSES_DATA, exams: OFFICIAL_EXAMS_DATA, examDate: '2026-11-01', now: NOW });
    expect(past.days).toEqual([]);
  });

  it('falls back on the lessons of the trimester for a grade without competences', () => {
    const notebook = buildParentNotebook(createFreshGuestProfile('4AP'), '4AP');
    const plan = buildExamPlan({ notebook, lessons: COURSES_DATA, exams: OFFICIAL_EXAMS_DATA, examDate: '2026-12-01', now: NOW });
    const focus = plan.days.filter((day) => day.kind === 'focus');
    expect(focus.length).toBeGreaterThan(0);
    for (const day of focus) {
      const lesson = COURSES_DATA.find((l) => l.id === day.lessonId)!;
      expect(lesson.grade).toBe('4AP');
      expect(lesson.trimester).toBe(1);
    }
  });
});
