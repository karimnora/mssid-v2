import { UserProfile } from '../types';
import { getLessonCompetences } from '../data/competences';

export const MAX_LESSON_SESSIONS = 40;

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
