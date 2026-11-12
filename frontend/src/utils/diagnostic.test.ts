import { describe, expect, it } from 'vitest';
import { COURSES_DATA } from '../data/coursesData';
import { COMPETENCES, getCompetence, getLessonsForCompetence } from '../data/competences';
import { DIAGNOSTIC_SETS, getDiagnosticSet } from '../data/diagnostic';
import { buildParentNotebook } from './competenceProgress';
import {
  MAX_DIAGNOSTIC_QUESTIONS,
  SKIPPED,
  applyDiagnosticToProfile,
  estimatedMinutes,
  formatDiagnosticText,
  scoreDiagnostic,
  selectDiagnosticQuestions,
  suggestedScope,
  type DiagnosticAnswers,
} from './diagnostic';
import type { UserProfile } from '../types';

const set = getDiagnosticSet('5AP')!;
const profile = { name: 'أمين', grade: '5AP' } as UserProfile;

const answerAll = (questions: ReturnType<typeof selectDiagnosticQuestions>, pick: (index: number) => 'right' | 'wrong' | 'skip'): DiagnosticAnswers =>
  Object.fromEntries(questions.map((question, index) => {
    const choice = pick(index);
    if (choice === 'skip') return [question.id, SKIPPED];
    if (choice === 'right') return [question.id, question.correctId];
    return [question.id, question.options.find((option) => option.id !== question.correctId)!.id];
  }));

describe('diagnostic question bank', () => {
  it('exists for 5AP maths only for now', () => {
    expect(getDiagnosticSet('5AP')).toBeDefined();
    expect(getDiagnosticSet('3AP')).toBeUndefined();
  });

  it('asks two real questions per competence of the grade, each with one correct answer among four', () => {
    for (const bank of DIAGNOSTIC_SETS) {
      const ids = new Set<string>();
      const perCompetence = new Map<string, number>();
      for (const question of bank.questions) {
        expect(ids.has(question.id), question.id).toBe(false);
        ids.add(question.id);
        expect(question.questionAr.trim().length, question.id).toBeGreaterThan(8);
        expect(question.explanationAr.trim().length, question.id).toBeGreaterThan(8);
        expect(question.options, question.id).toHaveLength(4);
        expect(new Set(question.options.map((option) => option.textAr)).size, question.id).toBe(4);
        expect(question.options.some((option) => option.id === question.correctId), question.id).toBe(true);
        const competence = getCompetence(question.competenceId);
        expect(competence?.grade, question.id).toBe(bank.grade);
        expect(competence?.subject, question.id).toBe(bank.subject);
        perCompetence.set(question.competenceId, (perCompetence.get(question.competenceId) ?? 0) + 1);
      }
      const expected = COMPETENCES.filter((competence) => competence.grade === bank.grade && competence.subject === bank.subject);
      expect([...perCompetence.keys()].sort()).toEqual(expected.map((competence) => competence.id).sort());
      for (const [id, count] of perCompetence) expect(count, id).toBe(2);
    }
  });

  it('files each question under the trimester of the catalogue lesson that teaches it', () => {
    for (const question of set.questions) {
      const trimesters = getLessonsForCompetence(question.competenceId)
        .map((lessonId) => COURSES_DATA.find((lesson) => lesson.id === lessonId))
        .filter((lesson) => lesson?.grade === set.grade)
        .map((lesson) => lesson!.trimester);
      expect(trimesters, question.id).toContain(question.trimester);
    }
  });

  it('does not always put the right answer in the same place', () => {
    const positions = new Set(set.questions.map((question) => question.correctId));
    expect(positions.size).toBe(4);
  });
});

describe('diagnostic selection', () => {
  it('follows the school year: T1 until December, T2 until March, then the whole year', () => {
    expect(suggestedScope(new Date(2026, 10, 12))).toBe(1);
    expect(suggestedScope(new Date(2027, 1, 1))).toBe(2);
    expect(suggestedScope(new Date(2027, 4, 1))).toBe(3);
  });

  it('never asks more than the cap, and only what was taught so far', () => {
    for (const scope of [1, 2, 3] as const) {
      const questions = selectDiagnosticQuestions(set, scope);
      expect(questions.length).toBeGreaterThan(0);
      expect(questions.length).toBeLessThanOrEqual(MAX_DIAGNOSTIC_QUESTIONS);
      expect(questions.every((question) => question.trimester <= scope)).toBe(true);
    }
    expect(selectDiagnosticQuestions(set, 1)).toHaveLength(8);
    expect(selectDiagnosticQuestions(set, 2)).toHaveLength(16);
  });

  it('uses the other question of each competence on a second whole-year check', () => {
    const first = selectDiagnosticQuestions(set, 3, 0).map((question) => question.id);
    const second = selectDiagnosticQuestions(set, 3, 1).map((question) => question.id);
    expect(first).toHaveLength(16);
    expect(second.some((id) => first.includes(id))).toBe(false);
  });

  it('announces a duration a parent can plan', () => {
    expect(estimatedMinutes(8)).toBe(10);
    expect(estimatedMinutes(16)).toBe(15);
  });
});

describe('diagnostic report', () => {
  const questions = selectDiagnosticQuestions(set, 1);

  it('sorts competences into secure, fragile, to review and not seen yet', () => {
    // 4 competences × 2 questions: right+right, right+wrong, wrong+wrong, skip+skip.
    const answers = answerAll(questions, (index) => (index < 3 ? 'right' : index < 6 ? 'wrong' : 'skip'));
    const result = scoreDiagnostic(set, questions, answers, 1, 0, '2026-11-12T10:00:00.000Z');
    expect(result.total).toBe(8);
    expect(result.correct).toBe(3);
    expect(result.rows.map((row) => row.status)).toEqual(['secure', 'fragile', 'review', 'unseen']);
    // Missed competences come before fragile ones; unseen ones are not a priority.
    expect(result.priorities).toEqual([result.rows[2].competenceId, result.rows[1].competenceId]);
    expect(result.rows[2].misses).toHaveLength(2);
    expect(result.rows[2].misses[0].correctAr).not.toBe('');
  });

  it('feeds the parent notebook once per competence and leaves unseen ones untouched', () => {
    const answers = answerAll(questions, (index) => (index < 3 ? 'right' : index < 6 ? 'wrong' : 'skip'));
    const result = scoreDiagnostic(set, questions, answers, 1, 0, '2026-11-12T10:00:00.000Z');
    const next = applyDiagnosticToProfile(profile, result);
    const stats = next.competenceStats!;
    expect(stats[result.rows[0].competenceId].lastOutcome).toBe('success');
    expect(stats[result.rows[1].competenceId].lastOutcome).toBe('fail');
    expect(stats[result.rows[2].competenceId].attempts).toBe(1);
    expect(stats[result.rows[3].competenceId]).toBeUndefined();
    const notebook = buildParentNotebook(next, '5AP');
    expect(notebook.review.map((row) => row.competenceId).sort()).toEqual([result.rows[1].competenceId, result.rows[2].competenceId].sort());
    expect(notebook.observed.map((row) => row.competenceId)).toEqual([result.rows[0].competenceId]);
  });

  it('shares a text without any price or payment word (it is sent from the Android app too)', () => {
    const result = scoreDiagnostic(set, questions, answerAll(questions, (index) => (index % 2 ? 'wrong' : 'right')), 1);
    for (const locale of ['ar', 'fr'] as const) {
      const text = formatDiagnosticText(result, 'أمين', locale);
      expect(text).toContain('أمين');
      expect(text).not.toMatch(/DA\b|دج|Premium|abonn|اشتراك|payer|ادفع|prix|سعر/i);
    }
  });
});
