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

function applyMappedOutcome(prev: UserProfile, lessonId: string, outcome: LessonOutcome, at: string): UserProfile {
  const competenceIds = getLessonCompetences(lessonId).map((c) => c.id);
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
  const collapseFail = outcome === 'fail' && last?.lessonId === lessonId && last.outcome === 'fail';
  if (!collapseFail) {
    sessions.push({ at, lessonId, competenceIds, outcome });
  }

  return { ...prev, competenceStats, lessonSessions: sessions.slice(-MAX_LESSON_SESSIONS) };
}

/** First full quiz success (or a replay) for a mapped lesson. Unmapped lessons are left unchanged. */
export function recordLessonSuccess(prev: UserProfile, lessonId: string, at = new Date().toISOString()): UserProfile {
  return applyMappedOutcome(prev, lessonId, 'success', at);
}

/** First miss on a mapped question/exercise. Extra misses in the same sitting still raise the failure count. */
export function recordLessonFailure(prev: UserProfile, lessonId: string, at = new Date().toISOString()): UserProfile {
  return applyMappedOutcome(prev, lessonId, 'fail', at);
}

export type NotebookRowStatus = 'review' | 'worked' | 'todo';

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
  worked: ParentNotebookRow[];
  todo: ParentNotebookRow[];
  recentSessions: ParentNotebookSession[];
}

export function reviewLessonForCompetence(competenceId: string, lastLessonId?: string): string | undefined {
  if (lastLessonId) return lastLessonId;
  return getLessonsForCompetence(competenceId)[0];
}

export function notebookStatusForStat(stat?: CompetenceStat): NotebookRowStatus {
  if (!stat) return 'todo';
  if (stat.lastOutcome === 'fail' || ((stat.failures ?? 0) > 0 && stat.successes === 0)) return 'review';
  if (stat.successes > 0) return 'worked';
  return 'todo';
}

/** Parent-facing snapshot of the child's competence stats. Unmapped grades show an empty catalogue. */
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

  const recentSessions: ParentNotebookSession[] = [...(profile.lessonSessions ?? [])]
    .reverse()
    .slice(0, MAX_NOTEBOOK_RECENT)
    .map((session) => ({
      at: session.at,
      lessonId: session.lessonId,
      competenceIds: session.competenceIds,
      labelsAr: session.competenceIds.map((id) => getCompetence(id)?.labelAr ?? id),
      labelsFr: session.competenceIds.map((id) => getCompetence(id)?.labelFr ?? id),
      outcome: session.outcome,
    }));

  return {
    childName: profile.name,
    grade: viewingGrade,
    review: rows
      .filter((row) => row.status === 'review')
      .sort((a, b) => (b.lastAt ?? '').localeCompare(a.lastAt ?? '')),
    worked: rows
      .filter((row) => row.status === 'worked')
      .sort((a, b) => (b.lastAt ?? '').localeCompare(a.lastAt ?? '')),
    todo: rows.filter((row) => row.status === 'todo'),
    recentSessions,
  };
}
