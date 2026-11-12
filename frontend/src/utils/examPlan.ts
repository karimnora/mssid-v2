import type { CourseLesson, OfficialExam, PrimaryGrade } from '../types';
import type { ParentNotebook, ParentNotebookRow } from './competenceProgress';
import { getExamKind } from './examKind';

/**
 * « 10 jours avant la composition »: a day-by-day revision plan for the parent, built from the
 * mistake notebook (most missed competences first), the lessons of the trimester and the mock
 * papers of the exam bank. Pure functions — the panel stores only the date and the ticked days.
 */

export const EXAM_PLAN_MAX_DAYS = 10;
export const EXAM_PLAN_FREE_DAYS = 2;
const DAY_MS = 24 * 60 * 60 * 1000;

export type ExamPlanSubject = 'math' | 'arabic';
export type ExamPlanDayKind = 'focus' | 'mock' | 'full-mock';

export interface ExamPlanDay {
  index: number;
  /** YYYY-MM-DD (local day). */
  date: string;
  kind: ExamPlanDayKind;
  subject: ExamPlanSubject;
  minutes: number;
  titleAr: string;
  titleFr: string;
  competenceId?: string;
  lessonId?: string;
  /** Mock paper(s) of the trimester to do in real conditions. */
  examIds: string[];
  /** Why this day: the competence was missed, worked with help, or not started. */
  reason: 'missed' | 'helped' | 'todo' | 'lesson' | 'mock';
}

export interface ExamPlan {
  examDate: string;
  trimester: 1 | 2 | 3;
  daysLeft: number;
  days: ExamPlanDay[];
  unavailableReason?: 'invalid_date' | 'no_resources';
}

const SUBJECT_AR: Record<ExamPlanSubject, string> = { math: 'الرِّيَاضِيَّاتُ', arabic: 'اللُّغَةُ العَرَبِيَّةُ' };
const SUBJECT_FR: Record<ExamPlanSubject, string> = { math: 'Maths', arabic: 'Arabe' };

export function toDay(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function parseDay(day: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) return null;
  const [y, m, d] = day.split('-').map(Number);
  const date = new Date(0);
  date.setFullYear(y, m - 1, d);
  date.setHours(0, 0, 0, 0);
  return date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d ? date : null;
}

export function isValidExamDate(day: string): boolean {
  return parseDay(day) !== null;
}

export function daysBetween(from: Date, toDayString: string): number {
  const end = parseDay(toDayString);
  if (!end || !Number.isFinite(from.getTime())) return 0;
  const ordinal = (date: Date) => Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  return Math.round((ordinal(end) - ordinal(from)) / DAY_MS);
}

/**
 * Usual windows of the Algerian primary compositions (MEN calendar varies a little every year and
 * by wilaya): a suggestion only, the parent sets the real date given by the school.
 */
export function suggestExamDate(now: Date): { date: string; trimester: 1 | 2 | 3 } {
  const year = now.getMonth() >= 8 ? now.getFullYear() : now.getFullYear() - 1;
  const windows: { date: Date; trimester: 1 | 2 | 3 }[] = [
    { date: new Date(year, 11, 1), trimester: 1 },
    { date: new Date(year + 1, 2, 8), trimester: 2 },
    { date: new Date(year + 1, 4, 17), trimester: 3 },
    { date: new Date(year + 1, 11, 1), trimester: 1 },
  ];
  const next = windows.find((w) => daysBetween(now, toDay(w.date)) >= 1) ?? windows[0];
  return { date: toDay(next.date), trimester: next.trimester };
}

export function trimesterForDate(day: string): 1 | 2 | 3 {
  const month = parseDay(day)?.getMonth() ?? 8;
  if (month >= 8 && month <= 11) return 1;
  if (month <= 2) return 2;
  return 3;
}

interface Target {
  subject: ExamPlanSubject;
  competenceId?: string;
  lessonId?: string;
  labelAr: string;
  labelFr: string;
  reason: ExamPlanDay['reason'];
}

function subjectOfCompetence(row: ParentNotebookRow): ExamPlanSubject | null {
  if (row.competenceId.startsWith('math-')) return 'math';
  if (row.competenceId.startsWith('ar-')) return 'arabic';
  return null;
}

/** Most useful first: missed and not redone alone, then « avec aide » more than « seul », then not started this trimester. */
function targetsFrom(notebook: ParentNotebook, lessons: CourseLesson[], trimester: 1 | 2 | 3): Target[] {
  const availableLessons = new Set(lessons.map(l => l.id));
  const inTrimester = new Set(lessons.filter((l) => l.trimester === trimester).map((l) => l.id));
  const fromRow = (row: ParentNotebookRow, reason: Target['reason']): Target | null => {
    const subject = subjectOfCompetence(row);
    if (!subject || !row.reviewLessonId || !availableLessons.has(row.reviewLessonId)) return null;
    return { subject, competenceId: row.competenceId, lessonId: row.reviewLessonId, labelAr: row.labelAr, labelFr: row.labelFr, reason };
  };
  const missed = [...notebook.review]
    .sort((a, b) => (b.missedExerciseIds?.length ?? 0) - (a.missedExerciseIds?.length ?? 0) || b.failures - a.failures)
    .map((row) => fromRow(row, 'missed'));
  const helped = [...notebook.worked, ...notebook.observed]
    .filter((row) => (row.helped ?? 0) > (row.alone ?? 0))
    .map((row) => fromRow(row, 'helped'));
  const todo = notebook.todo
    .filter((row) => row.reviewLessonId && inTrimester.has(row.reviewLessonId))
    .map((row) => fromRow(row, 'todo'));
  const targets = [...missed, ...helped, ...todo].filter((t): t is Target => t !== null);
  // Grades without a competence map yet: the lessons of the trimester, maths then Arabic.
  if (targets.length === 0) {
    for (const lesson of lessons.filter((l) => l.trimester === trimester && (l.subject === 'math' || l.subject === 'arabic'))) {
      targets.push({ subject: lesson.subject as ExamPlanSubject, lessonId: lesson.id, labelAr: lesson.titleAr, labelFr: lesson.titleAr, reason: 'lesson' });
    }
  }
  return targets;
}

/** Alternate maths and Arabic so that no subject is left for the last days. */
function interleave(targets: Target[]): Target[] {
  const math = targets.filter((t) => t.subject === 'math');
  const arabic = targets.filter((t) => t.subject === 'arabic');
  const out: Target[] = [];
  // Start with the subject of the most urgent target, so that it is always day 1.
  const lead = targets[0]?.subject === 'arabic' ? arabic : math;
  const other = lead === math ? arabic : math;
  while (math.length || arabic.length) {
    const first = out.length % 2 === 0 ? lead : other;
    const second = first === lead ? other : lead;
    const next = first.shift() ?? second.shift();
    if (next) out.push(next);
  }
  return out;
}

function papersFor(exams: OfficialExam[], grade: PrimaryGrade, subject: ExamPlanSubject, trimester: 1 | 2 | 3) {
  const own = exams.filter((e) => e.grade === grade && e.subject === subject && e.trimester === trimester);
  return {
    devoirs: own.filter((e) => getExamKind(e) === 'devoir'),
    compositions: own.filter((e) => getExamKind(e) === 'composition'),
  };
}

export function buildExamPlan(input: {
  notebook: ParentNotebook;
  lessons: CourseLesson[];
  exams: OfficialExam[];
  examDate: string;
  trimester?: 1 | 2 | 3;
  now?: Date;
}): ExamPlan {
  const now = input.now ?? new Date();
  const grade = input.notebook.grade;
  const trimester = input.trimester ?? trimesterForDate(input.examDate);
  const examDay = parseDay(input.examDate);
  if (!examDay || !Number.isFinite(now.getTime())) {
    return { examDate: input.examDate, trimester, daysLeft: 0, days: [], unavailableReason: 'invalid_date' };
  }
  const daysLeft = daysBetween(now, input.examDate);
  const count = Math.max(0, Math.min(EXAM_PLAN_MAX_DAYS, daysLeft));
  const start = new Date(examDay);
  start.setDate(start.getDate() - count);
  const gradeLessons = input.lessons.filter((l) => l.grade === grade);
  const queue = interleave(targetsFrom(input.notebook, gradeLessons, trimester));
  if (!queue.length && !input.exams.some(e => e.grade === grade && e.trimester === trimester && (e.subject === 'math' || e.subject === 'arabic'))) {
    return { examDate: input.examDate, trimester, daysLeft, days: [], unavailableReason: 'no_resources' };
  }
  const usedPapers = new Set<string>();
  const pickPaper = (subject: ExamPlanSubject, prefer: 'devoir' | 'composition') => {
    const { devoirs, compositions } = papersFor(input.exams, grade, subject, trimester);
    const order = prefer === 'devoir' ? [...devoirs, ...compositions] : [...compositions, ...devoirs];
    const paper = order.find((e) => !usedPapers.has(e.id)) ?? order[0];
    if (paper) usedPapers.add(paper.id);
    return paper;
  };

  const days: ExamPlanDay[] = [];
  let focusIndex = 0;
  let mockSubject: ExamPlanSubject = 'math';
  for (let i = 0; i < count; i++) {
    const calendarDay = new Date(start);
    calendarDay.setDate(start.getDate() + i);
    const date = toDay(calendarDay);
    const isLast = i === count - 1;
    if (isLast && count >= 2) {
      const papers = (['math', 'arabic'] as ExamPlanSubject[]).map((s) => pickPaper(s, 'composition')).filter((p): p is OfficialExam => Boolean(p));
      if (papers.length) {
        days.push({
          index: i, date, kind: 'full-mock', subject: 'math', minutes: 60, examIds: papers.map((p) => p.id), reason: 'mock',
          titleAr: 'اخْتِبَارٌ تَجْرِيبِيٌّ كَامِلٌ فِي ظُرُوفِ القِسْمِ، ثُمَّ نَوْمٌ مُبَكِّرٌ',
          titleFr: 'Composition blanche complète en conditions réelles, puis coucher tôt',
        });
        continue;
      }
    }
    if (i % 3 === 2) {
      const paper = pickPaper(mockSubject, 'devoir');
      if (paper) {
        days.push({
          index: i, date, kind: 'mock', subject: mockSubject, minutes: 30, examIds: [paper.id], reason: 'mock',
          titleAr: `فَرْضٌ تَجْرِيبِيٌّ فِي ${SUBJECT_AR[mockSubject]} (30 دَقِيقَةً)`,
          titleFr: `Devoir blanc de ${SUBJECT_FR[mockSubject]} (30 min)`,
        });
        mockSubject = mockSubject === 'math' ? 'arabic' : 'math';
        continue;
      }
    }
    const target = queue.length ? queue[focusIndex % queue.length] : undefined;
    focusIndex++;
    const subject = target?.subject ?? (i % 2 === 0 ? 'math' : 'arabic');
    if (!target) {
      const paper = pickPaper(subject, 'devoir');
      if (paper) days.push({ index: i, date, kind: 'mock', subject, minutes: 30, examIds: [paper.id], reason: 'mock', titleAr: paper.titleAr, titleFr: paper.titleAr });
      continue;
    }
    days.push({
      index: i, date, kind: 'focus', subject, minutes: 20, examIds: [],
      competenceId: target?.competenceId, lessonId: target?.lessonId, reason: target?.reason ?? 'lesson',
      titleAr: target ? target.labelAr : `مُرَاجَعَةُ دُرُوسِ ${SUBJECT_AR[subject]}`,
      titleFr: target ? target.labelFr : `Révision des leçons de ${SUBJECT_FR[subject]}`,
    });
  }
  return { examDate: input.examDate, trimester, daysLeft, days };
}

/** Index of today's day in the plan, or -1 when today is before the plan or after the exam. */
export function todayIndex(plan: ExamPlan, now = new Date()): number {
  const today = toDay(now);
  return plan.days.findIndex((day) => day.date === today);
}
