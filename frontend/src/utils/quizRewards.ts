import {
  GUEST_PROGRESS_OWNER,
  getActiveProgressOwner,
  isProgressOwnerKey,
  progressOwnerId,
} from './progressOwner';

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

function isOwnerScoped(record: Record<string, unknown>): boolean {
  const keys = Object.keys(record);
  if (keys.length === 0) return true;
  return keys.every((key) => isProgressOwnerKey(key));
}

function readOwnerBucket(key: string, ownerId: string): Record<string, unknown> {
  const record = readJsonRecord(key);
  if (!isOwnerScoped(record)) {
    const scoped: Record<string, unknown> = { [getActiveProgressOwner()]: record };
    writeJsonRecord(key, scoped);
    return getActiveProgressOwner() === ownerId ? record : {};
  }
  const bucket = record[ownerId];
  if (!bucket || typeof bucket !== 'object' || Array.isArray(bucket)) return {};
  return bucket as Record<string, unknown>;
}

function writeOwnerBucket(key: string, ownerId: string, bucket: Record<string, unknown>): void {
  const record = readJsonRecord(key);
  const scoped = isOwnerScoped(record) ? { ...record } : { [getActiveProgressOwner()]: record };
  scoped[ownerId] = bucket;
  writeJsonRecord(key, scoped);
}

function clearOwnerBucket(key: string, ownerId: string): void {
  const record = readJsonRecord(key);
  if (!isOwnerScoped(record)) {
    if (getActiveProgressOwner() === ownerId) writeJsonRecord(key, {});
    return;
  }
  const next = { ...record };
  delete next[ownerId];
  writeJsonRecord(key, next);
}

function ownerHasEntries(bucket: Record<string, unknown>): boolean {
  return Object.keys(bucket).length > 0;
}

/** Question ids that already paid first-success XP for this lesson, for the active profile. */
export function loadAwardedQuestionIds(lessonId: string): string[] {
  const bucket = readOwnerBucket(FIRST_AWARDS_KEY, getActiveProgressOwner());
  const ids = bucket[lessonId];
  return Array.isArray(ids) ? ids.filter((id): id is string => typeof id === 'string') : [];
}

export function persistAwardedQuestionId(lessonId: string, questionId: string): void {
  const ownerId = getActiveProgressOwner();
  const bucket = readOwnerBucket(FIRST_AWARDS_KEY, ownerId);
  const current = Array.isArray(bucket[lessonId])
    ? (bucket[lessonId] as unknown[]).filter((id): id is string => typeof id === 'string')
    : [];
  if (current.includes(questionId)) return;
  bucket[lessonId] = [...current, questionId];
  writeOwnerBucket(FIRST_AWARDS_KEY, ownerId, bucket);
}

export function hasAwardedGameXp(lessonId: string): boolean {
  return readOwnerBucket(GAME_XP_KEY, getActiveProgressOwner())[lessonId] === true;
}

export function persistGameXpAwarded(lessonId: string): void {
  const ownerId = getActiveProgressOwner();
  const bucket = readOwnerBucket(GAME_XP_KEY, ownerId);
  bucket[lessonId] = true;
  writeOwnerBucket(GAME_XP_KEY, ownerId, bucket);
}

/**
 * One small revision bonus per lesson per calendar day after the first full success.
 * Returns true when this call consumes today's bonus.
 */
export function claimDailyLessonRevisionBonus(lessonId: string): boolean {
  const ownerId = getActiveProgressOwner();
  const bucket = readOwnerBucket(REVISION_DAY_KEY, ownerId);
  const today = todayStamp();
  if (bucket[lessonId] === today) return false;
  bucket[lessonId] = today;
  writeOwnerBucket(REVISION_DAY_KEY, ownerId, bucket);
  return true;
}

export function clearOwnerQuizRewards(ownerId: string): void {
  clearOwnerBucket(FIRST_AWARDS_KEY, ownerId);
  clearOwnerBucket(GAME_XP_KEY, ownerId);
  clearOwnerBucket(REVISION_DAY_KEY, ownerId);
}

export function clearGuestQuizRewards(): void {
  clearOwnerQuizRewards(GUEST_PROGRESS_OWNER);
}

/** Guest → account: copy only if the account has no local quiz ledger yet, then drop the guest bucket. */
export function migrateGuestQuizRewardsToUser(userId: number): void {
  const userOwner = progressOwnerId(userId);
  for (const key of [FIRST_AWARDS_KEY, GAME_XP_KEY, REVISION_DAY_KEY]) {
    const guestBucket = readOwnerBucket(key, GUEST_PROGRESS_OWNER);
    const userBucket = readOwnerBucket(key, userOwner);
    if (!ownerHasEntries(userBucket) && ownerHasEntries(guestBucket)) {
      writeOwnerBucket(key, userOwner, guestBucket);
    }
    clearOwnerBucket(key, GUEST_PROGRESS_OWNER);
  }
}
