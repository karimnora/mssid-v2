import type { CourseLesson, PrimaryGrade, UserProfile } from '../types';
import { buildParentNotebook } from './competenceProgress';
import type { LastActivity } from './lastActivity';

/**
 * « مهمة اليوم » (V2, planet home): ONE thing for the child to do first, instead of a screen of
 * choices. Priority: a skill to review (a recent mistake) › the lesson left half-way › the next
 * lesson not done yet. The choice is kept for the day (see DAILY_MISSION_KEY) so it does not jump
 * to something else as soon as the child finishes it; « done » then says well done and offers the
 * next one.
 */
export type DailyMissionKind = 'review' | 'resume' | 'next';

export interface DailyMission {
  kind: DailyMissionKind;
  lesson: CourseLesson;
  /** Skill label for a review mission. */
  competenceAr?: string;
  competenceFr?: string;
}

/** Core subjects first: they carry the compositions. */
const SUBJECT_PRIORITY = ['math', 'arabic', 'french', 'science', 'islamic', 'history_geo', 'civics', 'english'];

function dayNumber(now: Date): number {
  return Math.floor(new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime() / 86_400_000);
}

export function pickDailyMission(input: {
  grade: PrimaryGrade;
  profile: UserProfile;
  /** Published lessons (any grade: they are filtered here). */
  lessons: readonly CourseLesson[];
  resume?: LastActivity | null;
  /** Lessons not to propose (today's mission once it is done). */
  exclude?: readonly string[];
  now?: Date;
}): DailyMission | null {
  const now = input.now ?? new Date();
  const exclude = new Set(input.exclude ?? []);
  const lessons = input.lessons.filter((l) => l.grade === input.grade && !exclude.has(l.id));
  const byId = new Map(lessons.map((l) => [l.id, l]));
  const completed = new Set(input.profile.completedLessonIds ?? []);

  // 1. A skill to review: the most missed one, like the parent notebook's « next ».
  const notebook = buildParentNotebook(input.profile, input.grade);
  const review = [...notebook.review].sort(
    (a, b) => (b.missedExerciseIds?.length ?? 0) - (a.missedExerciseIds?.length ?? 0) || b.failures - a.failures,
  );
  for (const row of review) {
    const lesson = row.reviewLessonId ? byId.get(row.reviewLessonId) : undefined;
    if (lesson) return { kind: 'review', lesson, competenceAr: row.labelAr, competenceFr: row.labelFr };
  }

  // 2. The lesson left half-way.
  if (input.resume?.kind === 'lesson' && input.resume.grade === input.grade) {
    const lesson = byId.get(input.resume.lessonId);
    if (lesson && !completed.has(lesson.id)) return { kind: 'resume', lesson };
  }

  // 3. The next lesson not done: the first of each subject in programme order (trimester, then
  // catalogue order), one subject per day so maths and Arabic take turns.
  const firstPerSubject = new Map<string, CourseLesson>();
  const ordered = lessons
    .map((lesson, index) => ({ lesson, index }))
    .sort((a, b) => (a.lesson.trimester ?? 1) - (b.lesson.trimester ?? 1) || a.index - b.index);
  for (const { lesson } of ordered) {
    if (!completed.has(lesson.id) && !firstPerSubject.has(lesson.subject)) firstPerSubject.set(lesson.subject, lesson);
  }
  const candidates = [...firstPerSubject.values()].sort(
    (a, b) => rank(a.subject) - rank(b.subject),
  );
  const core = candidates.filter((l) => l.subject === 'math' || l.subject === 'arabic');
  const pool = core.length > 0 ? core : candidates;
  if (pool.length === 0) return null;
  return { kind: 'next', lesson: pool[dayNumber(now) % pool.length] };
}

function rank(subject: string): number {
  const i = SUBJECT_PRIORITY.indexOf(subject);
  return i === -1 ? SUBJECT_PRIORITY.length : i;
}

/** Did the child work on this lesson today (a session today, or newly completed since the pick)? */
export function missionDoneToday(profile: UserProfile, lessonId: string, completedAtPick: boolean, now: Date = new Date()): boolean {
  if (!completedAtPick && (profile.completedLessonIds ?? []).includes(lessonId)) return true;
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  return (profile.lessonSessions ?? []).some(
    (s) => s.lessonId === lessonId && s.outcome === 'success' && new Date(s.at).getTime() >= start,
  );
}

/** What the planet shows: today's mission (kept for the day), whether it is done, and the next one. */
export interface DailyMissionState {
  mission: DailyMission | null;
  done: boolean;
  next: DailyMission | null;
}

interface StoredMission {
  lessonId: string;
  kind: DailyMissionKind;
  completedAtPick: boolean;
  competenceAr?: string;
  competenceFr?: string;
}

export function dailyMissionKey(owner: string, grade: PrimaryGrade, now: Date = new Date()): string {
  const day = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  return `mssid_daily_mission_v1:${owner}:${grade}:${day}`;
}

function readStored(key: string): StoredMission | null {
  try {
    const raw = window.localStorage.getItem(key);
    const parsed = raw ? (JSON.parse(raw) as StoredMission) : null;
    return parsed && typeof parsed.lessonId === 'string' ? parsed : null;
  } catch {
    return null;
  }
}

function writeStored(key: string, value: StoredMission) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* private mode: the mission is picked again, same inputs give the same pick */
  }
}

export function resolveDailyMission(input: Parameters<typeof pickDailyMission>[0] & { storageKey: string }): DailyMissionState {
  const now = input.now ?? new Date();
  const stored = readStored(input.storageKey);
  let mission: DailyMission | null = null;
  let completedAtPick = false;
  if (stored) {
    const lesson = input.lessons.find((l) => l.id === stored.lessonId && l.grade === input.grade);
    if (lesson) {
      mission = { kind: stored.kind, lesson, competenceAr: stored.competenceAr, competenceFr: stored.competenceFr };
      completedAtPick = stored.completedAtPick;
    }
  }
  if (!mission) {
    mission = pickDailyMission(input);
    if (!mission) return { mission: null, done: false, next: null };
    completedAtPick = (input.profile.completedLessonIds ?? []).includes(mission.lesson.id);
    writeStored(input.storageKey, {
      lessonId: mission.lesson.id,
      kind: mission.kind,
      completedAtPick,
      competenceAr: mission.competenceAr,
      competenceFr: mission.competenceFr,
    });
  }
  const done = missionDoneToday(input.profile, mission.lesson.id, completedAtPick, now);
  const next = done ? pickDailyMission({ ...input, exclude: [...(input.exclude ?? []), mission.lesson.id] }) : null;
  return { mission, done, next };
}

/** Didou's sentence and the button label, in the child's language. */
export function dailyMissionCopy(
  state: DailyMissionState,
  locale: string,
  subjectName: (subject: string) => string,
  countdownPrefix = '',
): { say: string; cta: string | null; target: DailyMission | null } | null {
  const ar = locale === 'ar';
  const { mission, done, next } = state;
  if (!mission) return null;
  // Lesson titles can be long (« …: القراءة، التفكيك… »): Didou says the part before the colon.
  const title = (m: DailyMission) => m.lesson.titleAr.split(/[:：]/)[0].trim();
  if (done) {
    const say = ar
      ? `أحسنت! أنجزت مهمة اليوم. ${next ? `هل نواصل مع «${title(next)}»؟` : 'استرح قليلاً، أنت بطل!'}`
      : `Bravo ! Mission du jour accomplie. ${next ? `On continue avec « ${title(next)} » ?` : 'Repose-toi un peu, champion !'}`;
    return { say: countdownPrefix + say, cta: next ? (ar ? 'مهمة أخرى' : 'Une autre mission') : null, target: next };
  }
  let say: string;
  if (mission.kind === 'review') {
    const skill = (ar ? mission.competenceAr : mission.competenceFr) ?? title(mission);
    say = ar ? `مهمة اليوم: نراجع «${skill}» معاً لنثبّتها.` : `Mission du jour : on revoit « ${skill} » ensemble pour bien l'ancrer.`;
  } else if (mission.kind === 'resume') {
    say = ar ? `مهمة اليوم: نكمل درس «${title(mission)}» من حيث توقفنا.` : `Mission du jour : on finit la leçon « ${title(mission)} ».`;
  } else {
    say = ar
      ? `مهمة اليوم في ${subjectName(mission.lesson.subject)}: «${title(mission)}».`
      : `Mission du jour en ${subjectName(mission.lesson.subject)} : « ${title(mission)} ».`;
  }
  return { say: countdownPrefix + say, cta: ar ? 'ابدأ مهمة اليوم' : 'Commencer la mission', target: mission };
}
