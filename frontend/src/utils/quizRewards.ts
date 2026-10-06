const FIRST_AWARDS_KEY = 'mssid_quiz_first_awards';
const GAME_XP_KEY = 'mssid_quiz_game_xp';
const REVISION_DAY_KEY = 'mssid_quiz_revision_day';

function todayStamp(): string {
  return new Date().toISOString().slice(0, 10);
}

function readJsonRecord(key: string): Record<string, unknown> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed)
      ? (parsed as Record<string, unknown>)
      : {};
  } catch {
    return {};
  }
}

function writeJsonRecord(key: string, value: Record<string, unknown>): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Quota / private mode — XP caps stay in-memory for this session.
  }
}

/** Question ids that already paid first-success XP for this lesson. */
export function loadAwardedQuestionIds(lessonId: string): string[] {
  const record = readJsonRecord(FIRST_AWARDS_KEY);
  const ids = record[lessonId];
  return Array.isArray(ids) ? ids.filter((id): id is string => typeof id === 'string') : [];
}

export function persistAwardedQuestionId(lessonId: string, questionId: string): void {
  const record = readJsonRecord(FIRST_AWARDS_KEY);
  const current = Array.isArray(record[lessonId])
    ? (record[lessonId] as unknown[]).filter((id): id is string => typeof id === 'string')
    : [];
  if (current.includes(questionId)) return;
  record[lessonId] = [...current, questionId];
  writeJsonRecord(FIRST_AWARDS_KEY, record);
}

export function hasAwardedGameXp(lessonId: string): boolean {
  return readJsonRecord(GAME_XP_KEY)[lessonId] === true;
}

export function persistGameXpAwarded(lessonId: string): void {
  const record = readJsonRecord(GAME_XP_KEY);
  record[lessonId] = true;
  writeJsonRecord(GAME_XP_KEY, record);
}

/**
 * One small revision bonus per lesson per calendar day after the first full success.
 * Returns true when this call consumes today's bonus.
 */
export function claimDailyLessonRevisionBonus(lessonId: string): boolean {
  const record = readJsonRecord(REVISION_DAY_KEY);
  const today = todayStamp();
  if (record[lessonId] === today) return false;
  record[lessonId] = today;
  writeJsonRecord(REVISION_DAY_KEY, record);
  return true;
}
