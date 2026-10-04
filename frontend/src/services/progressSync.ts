import { AuthUser } from '../types/auth';
import { springBootApi } from './springBootApi';

type Patch = Record<string, unknown>;
export type ProgressSyncState = { status: 'local' | 'saving' | 'pending' | 'synced'; syncedAt?: string };
const allowed = new Set(['score', 'xp', 'level', 'goldCoins', 'avatarConfig', 'avatar', 'grade', 'wilaya',
  'streakDays', 'quizzesCompleted', 'lastActiveDate', 'completedLessonIds', 'completedExamIds',
  'completedChallengeIds', 'badges', 'badgeUnlockedAt', 'quizScores', 'competenceStats', 'lessonSessions']);
const numbers = new Set(['score', 'xp', 'level', 'goldCoins', 'streakDays', 'quizzesCompleted']);
const ids = new Set(['completedLessonIds', 'completedExamIds', 'completedChallengeIds', 'badges']);
const listeners = new Set<() => void>();
let state: ProgressSyncState = { status: 'local' };
let owner: number | null = null;
let epoch = 0;
let revision = 0;
let pending: Patch | null = null;
let flight: { epoch: number; promise: Promise<void> } | null = null;
const key = (id: number) => `mssid_progress_pending_v1_${id}`;

function publish(next: ProgressSyncState) { state = next; listeners.forEach(listener => listener()); }
function cleanPatch(value: unknown): Patch {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  const patch: Patch = {};
  for (const [field, entry] of Object.entries(value)) {
    if (!allowed.has(field) || entry === undefined) continue;
    if (numbers.has(field)) {
      if (typeof entry === 'number' && Number.isFinite(entry) && entry >= 0) patch[field] = entry;
    } else if (ids.has(field)) {
      if (Array.isArray(entry)) patch[field] = entry.filter(item => typeof item === 'string');
    } else if (field === 'lessonSessions') {
      if (Array.isArray(entry)) patch[field] = entry;
    } else if (['avatarConfig', 'badgeUnlockedAt', 'quizScores', 'competenceStats'].includes(field)) {
      if (entry && typeof entry === 'object' && !Array.isArray(entry)) patch[field] = entry;
    } else if (typeof entry === 'string') patch[field] = entry;
  }
  return patch;
}
function mergePatch(previous: Patch, next: Patch): Patch {
  const merged = { ...previous, ...next };
  for (const field of ids) {
    if (Array.isArray(previous[field]) && Array.isArray(next[field])) merged[field] = [...new Set([...previous[field], ...next[field]])];
  }
  for (const field of ['score', 'xp']) {
    if (typeof previous[field] === 'number' && typeof next[field] === 'number') merged[field] = Math.max(previous[field], next[field]);
  }
  for (const field of ['badgeUnlockedAt', 'quizScores']) {
    if (previous[field] && next[field]) merged[field] = { ...(previous[field] as object), ...(next[field] as object) };
  }
  return merged;
}
function load(id: number): Patch | null {
  try {
    const patch = cleanPatch(JSON.parse(localStorage.getItem(key(id)) ?? 'null'));
    return Object.keys(patch).length ? patch : null;
  } catch { return null; }
}
function persist(id: number) {
  try {
    if (pending) localStorage.setItem(key(id), JSON.stringify(pending));
    else localStorage.removeItem(key(id));
  } catch { /* Keep the in-memory pending state if storage is unavailable. */ }
}

export function setProgressSyncOwner(id: number | null) {
  if (id === owner) return;
  owner = id; epoch += 1; revision = 0; flight = null;
  pending = id === null ? null : load(id);
  publish({ status: id === null ? 'local' : pending ? 'pending' : 'synced' });
}

/** Store progress only, scoped to the account ID; never store identity, email or session tokens. */
export function queueProgressUpdate(id: number, update: Patch): Promise<void> {
  if (owner !== id) return Promise.resolve();
  pending = mergePatch(pending ?? {}, cleanPatch(update));
  revision += 1; persist(id);
  return retryPendingProgress();
}

/** PUT snapshots are absolute totals and unioned IDs, so a retry cannot award the same XP twice. */
export function retryPendingProgress(): Promise<void> {
  if (owner === null || !pending) return Promise.resolve();
  if (flight?.epoch === epoch) return flight.promise;
  const activeOwner = owner; const activeEpoch = epoch;
  const promise = (async () => {
    while (owner === activeOwner && epoch === activeEpoch && pending) {
      const snapshot = pending; const snapshotRevision = revision;
      publish({ status: 'saving', syncedAt: state.syncedAt });
      try {
        const result = await springBootApi.updateUserProgress(snapshot);
        if (owner !== activeOwner || epoch !== activeEpoch) return;
        if (result.error || (result.status !== undefined && result.status >= 400)) {
          publish({ status: 'pending', syncedAt: state.syncedAt }); return;
        }
        // The backend caps large offline gains. Do not claim that a partial acknowledgement saved all gains.
        const actual = result.data as Patch | undefined;
        const capped = actual && ['xp', 'goldCoins'].some(field =>
          typeof actual[field] === 'number' && typeof snapshot[field] === 'number' && actual[field] < snapshot[field]);
        const incompleteIds = actual && [...ids].some(field => {
          const saved = actual[field]; const requested = snapshot[field];
          return Array.isArray(saved) && Array.isArray(requested) && requested.some(id => !saved.includes(id));
        });
        if (capped || incompleteIds) { publish({ status: 'pending', syncedAt: state.syncedAt }); return; }
        if (revision !== snapshotRevision) continue;
        pending = null; persist(activeOwner);
        publish({ status: 'synced', syncedAt: new Date().toISOString() }); return;
      } catch {
        if (owner === activeOwner && epoch === activeEpoch) publish({ status: 'pending', syncedAt: state.syncedAt });
        return;
      }
    }
  })();
  flight = { epoch: activeEpoch, promise };
  void promise.finally(() => { if (flight?.promise === promise) flight = null; });
  return promise;
}

export function restorePendingProgress(user: AuthUser): AuthUser {
  const update = owner === user.id ? pending : load(user.id);
  if (!update) return user;
  const merged = mergePatch(user as unknown as Patch, update) as unknown as AuthUser;
  const xp = Math.max(user.score ?? user.xp ?? 0, Number(update.xp ?? update.score ?? 0));
  return { ...merged, id: user.id, email: user.email, role: user.role, score: xp, xp, level: Math.floor(xp / 100) + 1 };
}

export function clearPendingProgress(id: number) {
  try { localStorage.removeItem(key(id)); } catch { /* unavailable storage */ }
  if (owner === id) { pending = null; revision += 1; publish({ status: 'synced' }); }
}
export const progressSync = {
  subscribe: (listener: () => void) => { listeners.add(listener); return () => { listeners.delete(listener); }; },
  getSnapshot: () => state,
};
