import { separateVillageHistory, mergeVillageSummaries, type VillageSessionSummary } from './villageSession';
import { PrimaryGrade, UserProfile } from '../types';
import { COMPETENCES, getCompetence, getLessonCompetences, getLessonsForCompetence } from '../data/competences';

export const MAX_LESSON_SESSIONS = 40;
export const MAX_NOTEBOOK_RECENT = 8;
/** Exercises kept per competence for the catch-up sheet (newest first). */
export const MAX_MISSED_EXERCISES = 6;

export type LessonOutcome = 'success' | 'fail';

export interface CompetenceStat {
  attempts: number;
  successes: number;
  failures: number;
  lastAt: string;
  lastLessonId: string;
  lastOutcome: LessonOutcome;
  /** Exercise successes on the first try with no hint (« réussi seul »). */
  alone?: number;
  /** Exercise successes after a hint or a second try (« réussi avec aide »). */
  helped?: number;
  /** Exercises missed and not yet redone alone, newest first — they fill the catch-up sheet. */
  missedExerciseIds?: string[];
}

export interface LessonSession {
  at: string;
  lessonId: string;
  competenceIds: string[];
  outcome: LessonOutcome;
  /** Success obtained with a hint or after a miss. */
  helped?: boolean;
  /** Same lesson, same outcome, in a row: one line in the notebook (exercise successes). */
  count?: number;
}

/** What an exercise check tells the notebook. */
export interface PracticeResult {
  outcome: LessonOutcome;
  /** Success only: a hint was opened or the exercise had been missed before. */
  helped?: boolean;
  exerciseId?: string;
  villageSummary?: VillageSessionSummary;
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
  practice?: PracticeResult,
): UserProfile {
  const competenceIds = competenceIdsForOutcome(lessonId, outcome, competenceId);
  if (competenceIds.length === 0) return prev;

  const competenceStats = { ...(prev.competenceStats ?? {}) };
  for (const id of competenceIds) {
    const current: CompetenceStat = { ...emptyStat(at, lessonId, outcome), ...(competenceStats[id] ?? {}) } as CompetenceStat;
    const next: CompetenceStat = {
      ...current,
      attempts: current.attempts + 1,
      successes: current.successes + (outcome === 'success' ? 1 : 0),
      failures: (current.failures ?? 0) + (outcome === 'fail' ? 1 : 0),
      lastAt: at,
      lastLessonId: lessonId,
      lastOutcome: outcome,
    };
    if (practice) {
      const missed = (current.missedExerciseIds ?? []).filter((exId) => exId !== practice.exerciseId);
      if (outcome === 'fail' && practice.exerciseId) missed.unshift(practice.exerciseId);
      // A success with help keeps the exercise on the sheet: only redoing it alone clears it.
      if (outcome === 'success' && practice.helped && practice.exerciseId && current.missedExerciseIds?.includes(practice.exerciseId)) {
        missed.unshift(practice.exerciseId);
      }
      next.missedExerciseIds = missed.slice(0, MAX_MISSED_EXERCISES);
      if (outcome === 'success') {
        if (practice.helped) next.helped = (current.helped ?? 0) + 1;
        else next.alone = (current.alone ?? 0) + 1;
      }
    }
    competenceStats[id] = next;
  }

  const sessions = [...(prev.lessonSessions ?? [])];
  const last = sessions[sessions.length - 1];
  const sameTargets =
    last?.competenceIds.length === competenceIds.length &&
    last.competenceIds.every((id, index) => id === competenceIds[index]);
  const collapseFail = outcome === 'fail' && last?.lessonId === lessonId && last.outcome === 'fail' && sameTargets;
  const helped = outcome === 'success' && practice ? Boolean(practice.helped) : undefined;
  const collapseSuccess =
    outcome === 'success' && practice !== undefined && last?.lessonId === lessonId && last.outcome === 'success' &&
    sameTargets && Boolean(last.helped) === helped;
  if (collapseSuccess) {
    sessions[sessions.length - 1] = { ...last, at, count: (last.count ?? 1) + 1 };
  } else if (!collapseFail) {
    sessions.push(helped === undefined ? { at, lessonId, competenceIds, outcome } : { at, lessonId, competenceIds, outcome, helped });
  }

  return { ...prev, competenceStats, lessonSessions: sessions.slice(-MAX_LESSON_SESSIONS) };
}

/**
 * An exercise of the lesson was checked. A success says whether the child needed help (hint or
 * second try); a miss keeps the exercise for the catch-up sheet. Unmapped lessons are unchanged.
 */
export function recordPracticeResult(
  prev: UserProfile,
  lessonId: string,
  result: PracticeResult,
  at = new Date().toISOString(),
): UserProfile {
  const separated = separateVillageHistory(prev);
  if (result.villageSummary) {
    return {
      ...prev, ...separated,
      villageSummaries: mergeVillageSummaries(separated.villageSummaries, [{ at, lessonId, villageSummary: result.villageSummary }]),
    };
  }
  return applyMappedOutcome({ ...prev, ...separated }, lessonId, result.outcome, at, undefined, result);
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
  /** Exercise successes alone / with help (absent before V2 recorded them). */
  alone?: number;
  helped?: number;
  missedExerciseIds?: string[];
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
  helped?: boolean;
  count: number;
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
  // A missed exercise not yet redone alone: the skill is not secure yet.
  if ((stat.missedExerciseIds?.length ?? 0) > 0) return 'review';
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
    helped: session.helped,
    count: session.count ?? 1,
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
      alone: stat?.alone ?? 0,
      helped: stat?.helped ?? 0,
      missedExerciseIds: stat?.missedExerciseIds ?? [],
      lastAt: stat?.lastAt,
      reviewLessonId: reviewLessonForCompetence(competence.id, stat?.lastLessonId),
    };
  });

  const historySessions = [...(profile.lessonSessions ?? [])].filter(s => !s.villageSummary).reverse().map(toNotebookSession);

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
  /** Exercise successes this week on the first try with no hint. */
  weekAlone: number;
  /** Exercise successes this week after a hint or a second try. */
  weekHelped: number;
}

/** Week counts use the full history. reviewCount is the current carnet state, not this week only. */
export function buildWeeklyPlan(notebook: ParentNotebook, now = new Date()): WeeklyPlan {
  const weekAgo = new Date(now.getTime() - WEEK_MS).toISOString();
  const weekSessions = notebook.historySessions.filter((session) => session.at >= weekAgo);
  const successes = weekSessions.filter((session) => session.outcome === 'success');
  const sum = (list: ParentNotebookSession[]) => list.reduce((total, session) => total + (session.count ?? 1), 0);
  // The most missed competence first: that is where tomorrow's 12 minutes help most.
  const review = [...notebook.review].sort((a, b) => (b.missedExerciseIds?.length ?? 0) - (a.missedExerciseIds?.length ?? 0) || b.failures - a.failures);
  return {
    next: review[0] ?? notebook.todo[0],
    minutes: WEEKLY_SESSION_MINUTES,
    reviewCount: notebook.review.length,
    weekSuccesses: sum(successes),
    weekSessions: sum(weekSessions),
    weekAlone: sum(successes.filter((session) => session.helped === false)),
    weekHelped: sum(successes.filter((session) => session.helped === true)),
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
      ...(plan.weekAlone + plan.weekHelped > 0 ? [`Exercices : ${plan.weekAlone} réussi(s) seul, ${plan.weekHelped} avec un indice.`] : []),
      nextLine,
    ].join('\n');
  }
  const nextLine = plan.next
    ? `غداً (${plan.minutes} دقيقة) : ${nextLabel}`
    : 'غداً : لا توجد حصة للبدء الآن.';
  return [
    `دفتر مسيد — ${notebook.childName} (${notebook.grade})`,
    `هذا الأسبوع: ${plan.weekSuccesses} نجاح مُلاحَظ. للتأكيد (الدفتر): ${plan.reviewCount}.`,
    ...(plan.weekAlone + plan.weekHelped > 0 ? [`التمارين: ${plan.weekAlone} بمفرده، ${plan.weekHelped} بمساعدة تلميح.`] : []),
    nextLine,
  ].join('\n');
}
