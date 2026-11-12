import type { PrimaryGrade, SubjectId, UserProfile } from '../types';
import type { DiagnosticQuestion, DiagnosticSet } from '../data/diagnostic';
import { getCompetence, getLessonsForCompetence } from '../data/competences';
import { recordLessonFailure, recordLessonSuccess } from './competenceProgress';
import { progressStorage } from './ownerStorage';
import { PLAY_STORE_URL } from './appPlatform';

/**
 * Free level check (« تشخيص المستوى »): a short quiz the child takes alone, then a report for the
 * parent — what is secure, what is fragile, the three competences to work on first. The result is
 * written to the same competence stats as the lessons, so the parent notebook, the weekly report
 * and the plan before the composition start from it.
 *
 * Honest by construction: one or two questions per competence give an indication, never a grade.
 */
export type DiagnosticScope = 1 | 2 | 3;
/** A child stays focused about a quarter of an hour: never more questions than this. */
export const MAX_DIAGNOSTIC_QUESTIONS = 16;
export const MAX_PRIORITIES = 3;
/** The child said « I have not learned this yet »: not counted as a mistake in the notebook. */
export const SKIPPED = 'skip';

export type DiagnosticAnswers = Record<string, string>;
export type DiagnosticStatus = 'secure' | 'fragile' | 'review' | 'unseen';

export interface DiagnosticMiss {
  questionAr: string;
  correctAr: string;
  explanationAr: string;
}

export interface DiagnosticRow {
  competenceId: string;
  labelAr: string;
  labelFr: string;
  domainAr: string;
  asked: number;
  correct: number;
  skipped: number;
  status: DiagnosticStatus;
  /** Lesson to open for « revoir la leçon ». */
  lessonId?: string;
  misses: DiagnosticMiss[];
}

export interface DiagnosticResult {
  at: string;
  grade: PrimaryGrade;
  subject: SubjectId;
  scope: DiagnosticScope;
  /** Which of the two questions was used when only one per competence fits. */
  round: number;
  total: number;
  correct: number;
  rows: DiagnosticRow[];
  /** Competence ids to work on first: missed ones, then fragile ones. */
  priorities: string[];
}

/** Trimester reached in the Algerian school year: September–December, January–March, April onwards. */
export function suggestedScope(now: Date = new Date()): DiagnosticScope {
  const month = now.getMonth();
  if (month >= 8) return 1;
  if (month <= 2) return 2;
  return 3;
}

/**
 * Questions of the competences taught up to `scope`. Two per competence while that fits in
 * MAX_DIAGNOSTIC_QUESTIONS, otherwise one — alternating with `round`, so a second check is not the same.
 */
export function selectDiagnosticQuestions(set: DiagnosticSet, scope: DiagnosticScope, round = 0): DiagnosticQuestion[] {
  const byCompetence = new Map<string, DiagnosticQuestion[]>();
  for (const question of set.questions) {
    if (question.trimester > scope) continue;
    byCompetence.set(question.competenceId, [...(byCompetence.get(question.competenceId) ?? []), question]);
  }
  const groups = [...byCompetence.values()];
  const all = groups.flat();
  if (all.length <= MAX_DIAGNOSTIC_QUESTIONS) return all;
  return groups.map((group) => group[round % group.length]);
}

/** About 50 seconds per question, rounded up to a multiple of 5 minutes for the parent. */
export function estimatedMinutes(questionCount: number): number {
  return Math.max(5, Math.ceil((questionCount * 50) / 60 / 5) * 5);
}

function statusOf(asked: number, correct: number, skipped: number): DiagnosticStatus {
  if (skipped === asked) return 'unseen';
  if (correct === asked) return 'secure';
  if (correct === 0) return 'review';
  return 'fragile';
}

export function scoreDiagnostic(
  set: DiagnosticSet,
  questions: DiagnosticQuestion[],
  answers: DiagnosticAnswers,
  scope: DiagnosticScope,
  round = 0,
  at: string = new Date().toISOString(),
): DiagnosticResult {
  const rows: DiagnosticRow[] = [];
  for (const question of questions) {
    let row = rows.find((item) => item.competenceId === question.competenceId);
    if (!row) {
      const competence = getCompetence(question.competenceId);
      row = {
        competenceId: question.competenceId,
        labelAr: competence?.labelAr ?? question.competenceId,
        labelFr: competence?.labelFr ?? question.competenceId,
        domainAr: competence?.domainAr ?? '',
        asked: 0,
        correct: 0,
        skipped: 0,
        status: 'unseen',
        lessonId: getLessonsForCompetence(question.competenceId)[0],
        misses: [],
      };
      rows.push(row);
    }
    const answer = answers[question.id];
    row.asked += 1;
    if (answer === question.correctId) {
      row.correct += 1;
    } else {
      if (!answer || answer === SKIPPED) row.skipped += 1;
      row.misses.push({
        questionAr: question.questionAr,
        correctAr: question.options.find((option) => option.id === question.correctId)?.textAr ?? '',
        explanationAr: question.explanationAr,
      });
    }
  }
  for (const row of rows) row.status = statusOf(row.asked, row.correct, row.skipped);

  const rank: Record<DiagnosticStatus, number> = { review: 0, fragile: 1, unseen: 2, secure: 3 };
  const priorities = rows
    .filter((row) => row.status === 'review' || row.status === 'fragile')
    .sort((a, b) => rank[a.status] - rank[b.status])
    .slice(0, MAX_PRIORITIES)
    .map((row) => row.competenceId);

  return {
    at,
    grade: set.grade,
    subject: set.subject,
    scope,
    round,
    total: questions.length,
    correct: rows.reduce((sum, row) => sum + row.correct, 0),
    rows,
    priorities,
  };
}

/**
 * One notebook entry per competence, not per question: a competence answered fully right is a
 * success, a missed or fragile one goes « à revoir ». Competences the child skipped entirely
 * (« not learned yet ») leave the notebook untouched.
 */
export function applyDiagnosticToProfile(profile: UserProfile, result: DiagnosticResult): UserProfile {
  let next = profile;
  for (const row of result.rows) {
    if (row.status === 'unseen' || !row.lessonId) continue;
    next = row.status === 'secure'
      ? recordLessonSuccess(next, row.lessonId, result.at, row.competenceId)
      : recordLessonFailure(next, row.lessonId, result.at, row.competenceId);
  }
  return next;
}

const storageKey = (grade: PrimaryGrade, subject: SubjectId) => `mssid_diagnostic_v1:${grade}:${subject}`;

/** Last report of the active child, kept on the device (the competence stats themselves are synced). */
export function saveDiagnosticResult(result: DiagnosticResult): void {
  try {
    progressStorage().setItem(storageKey(result.grade, result.subject), JSON.stringify(result));
  } catch {
    /* storage full or blocked: the report is still on screen */
  }
}

export function loadDiagnosticResult(grade: PrimaryGrade, subject: SubjectId = 'math'): DiagnosticResult | null {
  try {
    const raw = progressStorage().getItem(storageKey(grade, subject));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as DiagnosticResult;
    return Array.isArray(parsed?.rows) && typeof parsed.at === 'string' ? parsed : null;
  } catch {
    return null;
  }
}

export function rowsByStatus(result: DiagnosticResult, status: DiagnosticStatus): DiagnosticRow[] {
  return result.rows.filter((row) => row.status === status);
}

/** Text the parent can send on WhatsApp. No price and no payment wording: it is also sent from Android. */
export function formatDiagnosticText(result: DiagnosticResult, childName: string, locale: 'ar' | 'fr'): string {
  const fr = locale === 'fr';
  const label = (row: DiagnosticRow) => (fr ? row.labelFr : row.labelAr);
  const list = (rows: DiagnosticRow[]) => rows.map((row) => `• ${label(row)} (${row.correct}/${row.asked})`);
  const secure = rowsByStatus(result, 'secure');
  const fragile = rowsByStatus(result, 'fragile');
  const review = rowsByStatus(result, 'review');
  const unseen = rowsByStatus(result, 'unseen');
  const priorities = result.priorities
    .map((id) => result.rows.find((row) => row.competenceId === id))
    .filter((row): row is DiagnosticRow => Boolean(row));
  const lines: string[] = [];
  if (fr) {
    lines.push(`🧭 Diagnostic de maths — ${childName} (${result.grade})`, `${result.correct} bonne(s) réponse(s) sur ${result.total}`, '');
    if (secure.length) lines.push('✅ Réussi :', ...list(secure), '');
    if (fragile.length) lines.push('🟡 À consolider :', ...list(fragile), '');
    if (review.length) lines.push('🔁 À travailler :', ...list(review), '');
    if (unseen.length) lines.push('⏳ Pas encore vu en classe :', ...unseen.map((row) => `• ${label(row)}`), '');
    if (priorities.length) lines.push(`👉 À commencer par : ${priorities.map(label).join(' · ')}`, '');
    lines.push('Indication sur quelques questions, pas une note.', `مَسِيد DZ — ${PLAY_STORE_URL}`);
  } else {
    lines.push(`🧭 تشخيص الرياضيات — ${childName} (${result.grade})`, `${result.correct} إجابة صحيحة من ${result.total}`, '');
    if (secure.length) lines.push('✅ نجح في:', ...list(secure), '');
    if (fragile.length) lines.push('🟡 يحتاج إلى تثبيت:', ...list(fragile), '');
    if (review.length) lines.push('🔁 للمراجعة:', ...list(review), '');
    if (unseen.length) lines.push('⏳ لم يدرسه بعد في القسم:', ...unseen.map((row) => `• ${label(row)}`), '');
    if (priorities.length) lines.push(`👉 نبدأ بـ: ${priorities.map(label).join(' · ')}`, '');
    lines.push('مؤشر مبني على أسئلة قليلة، وليس علامة.', `مَسِيد DZ — ${PLAY_STORE_URL}`);
  }
  return lines.join('\n');
}
