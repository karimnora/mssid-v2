import { PrimaryGrade, UserProfile } from '../types';
import { COMPETENCES, getCompetence, getLessonCompetences, getLessonsForCompetence } from '../data/competences';

export const MAX_LESSON_SESSIONS = 40;
export const MAX_NOTEBOOK_RECENT = 8;

export interface CompetenceStat {
  attempts: number;
  successes: number;
  lastAt: string;
  lastLessonId: string;
}

export interface LessonSession {
  at: string;
  lessonId: string;
  competenceIds: string[];
  outcome: 'success';
}

/** First full quiz success (or a replay) for a mapped lesson. Unmapped lessons are left unchanged. */
export function recordLessonSuccess(prev: UserProfile, lessonId: string, at = new Date().toISOString()): UserProfile {
  const competenceIds = getLessonCompetences(lessonId).map((c) => c.id);
  if (competenceIds.length === 0) return prev;

  const competenceStats = { ...(prev.competenceStats ?? {}) };
  for (const id of competenceIds) {
    const current = competenceStats[id] ?? { attempts: 0, successes: 0, lastAt: at, lastLessonId: lessonId };
    competenceStats[id] = {
      attempts: current.attempts + 1,
      successes: current.successes + 1,
      lastAt: at,
      lastLessonId: lessonId,
    };
  }

  const session: LessonSession = { at, lessonId, competenceIds, outcome: 'success' };
  const lessonSessions = [...(prev.lessonSessions ?? []), session].slice(-MAX_LESSON_SESSIONS);

  return { ...prev, competenceStats, lessonSessions };
}

export type NotebookRowStatus = 'worked' | 'todo';

export interface ParentNotebookRow {
  competenceId: string;
  labelAr: string;
  labelFr: string;
  domainAr: string;
  status: NotebookRowStatus;
  successes: number;
  lastAt?: string;
  reviewLessonId?: string;
}

export interface ParentNotebookSession {
  at: string;
  lessonId: string;
  competenceIds: string[];
  labelsAr: string[];
  labelsFr: string[];
}

export interface ParentNotebook {
  childName: string;
  grade: PrimaryGrade;
  worked: ParentNotebookRow[];
  todo: ParentNotebookRow[];
  recentSessions: ParentNotebookSession[];
}

export function reviewLessonForCompetence(competenceId: string, lastLessonId?: string): string | undefined {
  if (lastLessonId) return lastLessonId;
  return getLessonsForCompetence(competenceId)[0];
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
    const worked = Boolean(stat && stat.successes > 0);
    return {
      competenceId: competence.id,
      labelAr: competence.labelAr,
      labelFr: competence.labelFr,
      domainAr: competence.domainAr,
      status: worked ? 'worked' : 'todo',
      successes: stat?.successes ?? 0,
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
    }));

  return {
    childName: profile.name,
    grade: viewingGrade,
    worked: rows
      .filter((row) => row.status === 'worked')
      .sort((a, b) => (b.lastAt ?? '').localeCompare(a.lastAt ?? '')),
    todo: rows.filter((row) => row.status === 'todo'),
    recentSessions,
  };
}
