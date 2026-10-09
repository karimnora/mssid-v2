import { PrimaryGrade, UserProfile } from '../types';
import { COMPETENCES, getCompetence, getLessonCompetences, getLessonsForCompetence } from '../data/competences';

export const MAX_LESSON_SESSIONS = 40;
export const MAX_NOTEBOOK_RECENT = 8;

export type LessonOutcome = 'success' | 'fail';

export interface CompetenceStat {
  attempts: number;
  successes: number;
  failures: number;
  lastAt: string;
  lastLessonId: string;
  lastOutcome: LessonOutcome;
}

export interface LessonSession {
  at: string;
  lessonId: string;
  competenceIds: string[];
  outcome: LessonOutcome;
}

function emptyStat(at: string, lessonId: string, outcome: LessonOutcome): CompetenceStat {
  return { attempts: 0, successes: 0, failures: 0, lastAt: at, lastLessonId: lessonId, lastOutcome: outcome };
}

function mappedIdsForLesson(lessonId: string): string[] {
  return getLessonCompetences(lessonId).map((competence) => competence.id);
}

/** A miss updates only the named competence, or the first mapped one — never every competence of the lesson. */
export function competenceIdsForOutcome(
  lessonId: string,
  outcome: LessonOutcome,
  competenceId?: string,
): string[] {
  const mapped = mappedIdsForLesson(lessonId);
  if (mapped.length === 0) return [];
  if (competenceId && mapped.includes(competenceId)) return [competenceId];
  if (outcome === 'fail') return [mapped[0]];
  return mapped;
}

function applyMappedOutcome(
  prev: UserProfile,
  lessonId: string,
  outcome: LessonOutcome,
  at: string,
  competenceId?: string,
): UserProfile {
  const competenceIds = competenceIdsForOutcome(lessonId, outcome, competenceId);
  if (competenceIds.length === 0) return prev;

  const competenceStats = { ...(prev.competenceStats ?? {}) };
  for (const id of competenceIds) {
    const current = competenceStats[id] ?? emptyStat(at, lessonId, outcome);
    competenceStats[id] = {
      attempts: current.attempts + 1,
      successes: current.successes + (outcome === 'success' ? 1 : 0),
      failures: (current.failures ?? 0) + (outcome === 'fail' ? 1 : 0),
      lastAt: at,
      lastLessonId: lessonId,
      lastOutcome: outcome,
    };
  }

  const sessions = [...(prev.lessonSessions ?? [])];
  const last = sessions[sessions.length - 1];
  const sameTargets =
    last?.competenceIds.length === competenceIds.length &&
    last.competenceIds.every((id, index) => id === competenceIds[index]);
  const collapseFail = outcome === 'fail' && last?.lessonId === lessonId && last.outcome === 'fail' && sameTargets;
  if (!collapseFail) {
    sessions.push({ at, lessonId, competenceIds, outcome });
  }

  return { ...prev, competenceStats, lessonSessions: sessions.slice(-MAX_LESSON_SESSIONS) };
}

/** First full quiz success (or a replay) for a mapped lesson. Unmapped lessons are left unchanged. */
export function recordLessonSuccess(
  prev: UserProfile,
  lessonId: string,
  at = new Date().toISOString(),
  competenceId?: string,
): UserProfile {
  return applyMappedOutcome(prev, lessonId, 'success', at, competenceId);
}

/** First miss on a mapped question. Extra misses in the same sitting still raise the failure count. */
export function recordLessonFailure(
  prev: UserProfile,
  lessonId: string,
  at = new Date().toISOString(),
  competenceId?: string,
): UserProfile {
  return applyMappedOutcome(prev, lessonId, 'fail', at, competenceId);
}

export type NotebookRowStatus = 'review' | 'observed' | 'worked' | 'todo';

export interface ParentNotebookRow {
  competenceId: string;
  labelAr: string;
  labelFr: string;
  domainAr: string;
  status: NotebookRowStatus;
  successes: number;
  failures: number;
  lastAt?: string;
  reviewLessonId?: string;
}

export interface ParentNotebookSession {
  at: string;
  lessonId: string;
  competenceIds: string[];
  labelsAr: string[];
  labelsFr: string[];
  outcome: LessonOutcome;
}

export interface ParentNotebook {
  childName: string;
  grade: PrimaryGrade;
  review: ParentNotebookRow[];
  observed: ParentNotebookRow[];
  worked: ParentNotebookRow[];
  todo: ParentNotebookRow[];
  recentSessions: ParentNotebookSession[];
  historySessions: ParentNotebookSession[];
}

export function reviewLessonForCompetence(competenceId: string, lastLessonId?: string): string | undefined {
  if (lastLessonId) return lastLessonId;
  return getLessonsForCompetence(competenceId)[0];
}

/** à confirmer / travaillé / réussite observée / pas commencé — a single success is never mastery. */
export function notebookStatusForStat(stat?: NonNullable<UserProfile['competenceStats']>[string]): NotebookRowStatus {
  if (!stat || stat.attempts === 0) return 'todo';
  if (stat.lastOutcome === 'fail' || ((stat.failures ?? 0) > 0 && stat.successes === 0)) return 'review';
  if (stat.successes > 0 && (stat.failures ?? 0) === 0) return 'observed';
  if (stat.successes > 0) return 'worked';
  return 'todo';
}

function toNotebookSession(session: LessonSession): ParentNotebookSession {
  return {
    at: session.at,
    lessonId: session.lessonId,
    competenceIds: session.competenceIds,
    labelsAr: session.competenceIds.map((id) => getCompetence(id)?.labelAr ?? id),
    labelsFr: session.competenceIds.map((id) => getCompetence(id)?.labelFr ?? id),
    outcome: session.outcome,
  };
}

/** Parent-facing snapshot. Unmapped grades show an empty catalogue — not a full-subject tracker. */
export function buildParentNotebook(profile: UserProfile, viewingGrade: PrimaryGrade = profile.grade): ParentNotebook {
  const stats = profile.competenceStats ?? {};
  const catalogue = COMPETENCES.filter((competence) => competence.grade === viewingGrade);
  const seen = new Set(catalogue.map((competence) => competence.id));
  const extras = Object.keys(stats)
    .map((id) => getCompetence(id))
    .filter((competence): competence is NonNullable<typeof competence> => Boolean(competence) && !seen.has(competence.id));

  const rows: ParentNotebookRow[] = [...catalogue, ...extras].map((competence) => {
    const stat = stats[competence.id];
    return {
      competenceId: competence.id,
      labelAr: competence.labelAr,
      labelFr: competence.labelFr,
      domainAr: competence.domainAr,
      status: notebookStatusForStat(stat),
      successes: stat?.successes ?? 0,
      failures: stat?.failures ?? 0,
      lastAt: stat?.lastAt,
      reviewLessonId: reviewLessonForCompetence(competence.id, stat?.lastLessonId),
    };
  });

  const historySessions = [...(profile.lessonSessions ?? [])].reverse().map(toNotebookSession);

  return {
    childName: profile.name,
    grade: viewingGrade,
    review: rows
      .filter((row) => row.status === 'review')
      .sort((a, b) => (b.lastAt ?? '').localeCompare(a.lastAt ?? '')),
    observed: rows
      .filter((row) => row.status === 'observed')
      .sort((a, b) => (b.lastAt ?? '').localeCompare(a.lastAt ?? '')),
    worked: rows
      .filter((row) => row.status === 'worked')
      .sort((a, b) => (b.lastAt ?? '').localeCompare(a.lastAt ?? '')),
    todo: rows.filter((row) => row.status === 'todo'),
    recentSessions: historySessions.slice(0, MAX_NOTEBOOK_RECENT),
    historySessions,
  };
}

export const WEEKLY_SESSION_MINUTES = 12;
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

export interface WeeklyPlan {
  next?: ParentNotebookRow;
  minutes: number;
  reviewCount: number;
  weekSuccesses: number;
  weekSessions: number;
}

/** Week counts use the full history. reviewCount is the current carnet state, not this week only. */
export function buildWeeklyPlan(notebook: ParentNotebook, now = new Date()): WeeklyPlan {
  const weekAgo = new Date(now.getTime() - WEEK_MS).toISOString();
  const weekSessions = notebook.historySessions.filter((session) => session.at >= weekAgo);
  return {
    next: notebook.review[0] ?? notebook.todo[0],
    minutes: WEEKLY_SESSION_MINUTES,
    reviewCount: notebook.review.length,
    weekSuccesses: weekSessions.filter((session) => session.outcome === 'success').length,
    weekSessions: weekSessions.length,
  };
}

export function formatWeeklyRecap(
  notebook: ParentNotebook,
  plan: WeeklyPlan,
  locale: 'ar' | 'fr',
): string {
  const nextLabel = plan.next ? (locale === 'fr' ? plan.next.labelFr : plan.next.labelAr) : '';
  if (locale === 'fr') {
    const nextLine = plan.next
      ? `Demain (${plan.minutes} min) : ${nextLabel}`
      : 'Demain : aucune séance à lancer pour l’instant.';
    return [
      `Carnet Mssid — ${notebook.childName} (${notebook.grade})`,
      `Cette semaine : ${plan.weekSuccesses} réussite(s) observée(s). À confirmer (carnet) : ${plan.reviewCount}.`,
      nextLine,
    ].join('\n');
  }
  const nextLine = plan.next
    ? `غداً (${plan.minutes} دقيقة) : ${nextLabel}`
    : 'غداً : لا توجد حصة للبدء الآن.';
  return [
    `دفتر مسيد — ${notebook.childName} (${notebook.grade})`,
    `هذا الأسبوع: ${plan.weekSuccesses} نجاح مُلاحَظ. للتأكيد (الدفتر): ${plan.reviewCount}.`,
    nextLine,
  ].join('\n');
}
