import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createFreshGuestProfile } from '../hooks/useUserProgress';
import { COURSES_DATA } from '../data/coursesData';
import { OFFICIAL_EXAMS_DATA } from '../data/examsData';
import { buildParentNotebook, buildWeeklyPlan, recordLessonFailure, type ParentNotebook, type ParentNotebookSession } from './competenceProgress';
import { buildExamPlan, suggestExamDate } from './examPlan';
import { buildWeeklyReport, drawWeeklyReportCard } from './weeklyReport';
import { ExamPlanPanel } from '../components/examPlan/ExamPlanPanel';

vi.mock('../components/PremiumOffer', () => ({ PremiumOffer: () => null }));
const NOW = new Date('2026-11-12T10:00:00Z');
const notebook = () => buildParentNotebook(createFreshGuestProfile('5AP'), '5AP');
const input = () => ({ notebook: notebook(), lessons: COURSES_DATA, exams: OFFICIAL_EXAMS_DATA, examDate: '2026-12-01', now: NOW });
const session = (at: string, extra: Partial<ParentNotebookSession> = {}): ParentNotebookSession => ({
  at, lessonId: 'math-5ap-division', competenceIds: ['math-5ap-c-division'], labelsAr: ['القسمة'], labelsFr: ['Division'], outcome: 'success', helped: false, count: 1, ...extra,
});

beforeEach(() => localStorage.clear());
afterEach(() => { vi.useRealTimers(); vi.restoreAllMocks(); vi.unstubAllEnvs(); });

describe('safe family revision plan', () => {
  it('suggests an upcoming composition after the summer rather than the previous December', () => {
    expect(suggestExamDate(new Date(2027, 6, 15))).toEqual({ date: '2027-12-01', trimester: 1 });
  });

  it.each(['2027-02-30', '2026-13-01', 'not-a-date'])('does not build a plan for invalid date %s', examDate => {
    const plan = buildExamPlan({ ...input(), examDate });
    expect(plan.days).toEqual([]);
    expect(Number.isFinite(plan.daysLeft)).toBe(true);
  });

  it('keeps calendar days contiguous across the spring clock change', () => {
    vi.stubEnv('TZ', 'Europe/Paris');
    const plan = buildExamPlan({ ...input(), now: new Date(2027, 2, 20, 12), examDate: '2027-03-31' });
    expect(plan.days.map(d => d.date)).toEqual(Array.from({ length: 10 }, (_, i) => `2027-03-${21 + i}`));
  });

  it('does not recommend a 1AP lesson in a 5AP plan when old statistics are retained', () => {
    const profile = recordLessonFailure(createFreshGuestProfile('1AP'), 'math-1ap-t1-spatial-relations', NOW.toISOString());
    const plan = buildExamPlan({ ...input(), notebook: buildParentNotebook(profile, '5AP') });
    for (const day of plan.days.filter(d => d.kind === 'focus')) {
      expect(COURSES_DATA.find(l => l.id === day.lessonId)?.grade).toBe('5AP');
    }
  });

  it('uses available lessons instead of announcing mock exams when the exam bank is empty', () => {
    const plan = buildExamPlan({ ...input(), exams: [] });
    expect(plan.days).toHaveLength(10);
    expect(plan.days.every(d => d.kind === 'focus' && !!d.lessonId)).toBe(true);
  });

  it('returns an empty plan when neither lessons nor mock papers exist', () => {
    const nb = { ...notebook(), review: [], observed: [], worked: [], todo: [] };
    expect(buildExamPlan({ ...input(), notebook: nb, lessons: [], exams: [] }).days).toEqual([]);
  });

  it('ignores a corrupt stored date instead of normalising it into another month', async () => {
    localStorage.setItem('bad-date', JSON.stringify({ examDate: '2026-02-31', done: [] }));
    render(<ExamPlanPanel notebook={notebook()} storageKey="bad-date" locale="fr" premium now={NOW} onReviewLesson={vi.fn()} onPrint={vi.fn()} />);
    expect(screen.getByLabelText(/Date de la composition/)).toHaveValue(suggestExamDate(NOW).date);
    await screen.findAllByText(/Jour \d+/, undefined, { timeout: 20000 });
  });

  it('deduplicates stored completed days and drops invalid entries', async () => {
    localStorage.setItem('done', JSON.stringify({ examDate: '2026-11-20', done: ['2026-11-12', '2026-11-12', {}, 'bad'] }));
    render(<ExamPlanPanel notebook={notebook()} storageKey="done" locale="fr" premium now={NOW} onReviewLesson={vi.fn()} onPrint={vi.fn()} />);
    expect(await screen.findByText('1/8 jour(s) faits', undefined, { timeout: 20000 })).toBeInTheDocument();
  });

  it('does not describe an empty history as a plan based on observed mistakes', async () => {
    render(<ExamPlanPanel notebook={notebook()} storageKey="general" locale="fr" premium now={NOW} onReviewLesson={vi.fn()} onPrint={vi.fn()} />);
    await screen.findAllByText(/Jour \d+/, undefined, { timeout: 20000 });
    expect(screen.queryByText(/construites sur les erreurs/)).not.toBeInTheDocument();
    expect(screen.getByText(/programme général/i)).toBeInTheDocument();
  });
});

describe('reliable weekly parent summary', () => {
  function withHistory(): ParentNotebook {
    return { ...notebook(), historySessions: [
      session('2026-11-11T13:00:00+02:00', { count: 2 }),
      session('2026-11-13T10:00:00Z', { count: 9 }),
      session('not-a-date', { count: 8 }),
      session('2026-11-01T10:00:00Z', { count: 7 }),
    ] };
  }
  it('counts only finite timestamps inside the past week, never future sessions', () => {
    const nb = withHistory();
    const plan = buildWeeklyPlan(nb, NOW);
    expect(plan.weekSessions).toBe(2);
    expect(plan.weekSuccesses).toBe(2);
    expect(plan.weekAlone).toBe(2);
  });

  it('derives report counters from the same window as its displayed history', () => {
    const nb = withHistory();
    const stalePlan = { ...buildWeeklyPlan(nb, NOW), weekSessions: 999, weekSuccesses: 999, weekAlone: 999 };
    const report = buildWeeklyReport(nb, stalePlan, NOW);
    expect(report.weekSessions).toBe(2);
    expect(report.weekSuccesses).toBe(2);
    expect(report.weekAlone).toBe(2);
    expect(report.successes).toEqual([{ ar: 'القسمة', fr: 'Division' }]);
  });

  it('does not mutate the child history while generating a report or plan', () => {
    const nb = withHistory();
    const before = JSON.stringify(nb);
    const plan = buildWeeklyPlan(nb, NOW);
    buildWeeklyReport(nb, plan, NOW);
    buildExamPlan({ ...input(), notebook: nb });
    expect(JSON.stringify(nb)).toBe(before);
  });

  it('falls back to text when the browser never finishes image export', async () => {
    vi.useFakeTimers();
    const ctx = { fillRect: vi.fn(), fillText: vi.fn(), measureText: (text: string) => ({ width: text.length * 15 }) };
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(ctx as unknown as CanvasRenderingContext2D);
    vi.spyOn(HTMLCanvasElement.prototype, 'toBlob').mockImplementation(() => undefined);
    const nb = notebook();
    let settled = false;
    let image: Blob | null | undefined;
    void drawWeeklyReportCard(buildWeeklyReport(nb, buildWeeklyPlan(nb, NOW), NOW), 'fr').then(result => { settled = true; image = result; });
    await vi.advanceTimersByTimeAsync(5000);
    expect(settled).toBe(true);
    expect(image).toBeNull();
  });
});
