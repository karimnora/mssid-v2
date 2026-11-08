import { PrimaryGrade, SubjectId } from '../types';
import { isValidGrade } from '../navigation/appLocation';
import {
  GUEST_PROGRESS_OWNER,
  getActiveProgressOwner,
  isProgressOwnerKey,
  progressOwnerId,
} from './progressOwner';

const STORAGE_KEY = 'mssid_last_activity';

export type LastActivity = {
  grade: PrimaryGrade;
  titleAr: string;
  titleFr?: string;
} & (
  | { kind: 'lesson'; lessonId: string; subject: SubjectId }
  | { kind: 'lab'; toolId: SubjectId }
);

function isSubjectId(value: unknown): value is SubjectId {
  return typeof value === 'string' && value.length > 0 && value.length < 80;
}

function parseActivity(parsed: unknown): LastActivity | null {
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return null;
  const o = parsed as Record<string, unknown>;
  if (!isValidGrade(typeof o.grade === 'string' ? o.grade : null)) return null;
  if (typeof o.titleAr !== 'string' || !o.titleAr.trim()) return null;
  const titleFr = typeof o.titleFr === 'string' ? o.titleFr : undefined;
  if (o.kind === 'lesson' && isSubjectId(o.lessonId) && isSubjectId(o.subject)) {
    return {
      kind: 'lesson',
      lessonId: o.lessonId,
      subject: o.subject,
      grade: o.grade as PrimaryGrade,
      titleAr: o.titleAr,
      titleFr,
    };
  }
  if (o.kind === 'lab' && isSubjectId(o.toolId)) {
    return {
      kind: 'lab',
      toolId: o.toolId,
      grade: o.grade as PrimaryGrade,
      titleAr: o.titleAr,
      titleFr,
    };
  }
  return null;
}

function readStore(): Record<string, unknown> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
    return parsed as Record<string, unknown>;
  } catch {
    return {};
  }
}

function writeStore(store: Record<string, unknown>): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    // Quota / private mode — resume CTA simply stays hidden.
  }
}

function isOwnerScoped(store: Record<string, unknown>): boolean {
  const keys = Object.keys(store);
  if (keys.length === 0) return true;
  if (store.kind === 'lesson' || store.kind === 'lab') return false;
  return keys.every((key) => isProgressOwnerKey(key) || key === 'legacy-unassigned');
}

export function readLastActivity(): LastActivity | null {
  const store = readStore();
  if (!isOwnerScoped(store)) {
    const legacy = parseActivity(store);
    if (legacy) writeStore({ 'legacy-unassigned': legacy });
    return null;
  }
  return parseActivity(store[getActiveProgressOwner()]);
}

/** Last opened lesson survives a subsequent lab visit, within the same owner record. */
export function readLastLessonActivity(): Extract<LastActivity, {kind:'lesson'}> | null {
  const store = readStore();
  if (!isOwnerScoped(store)) return null;
  const record = store[getActiveProgressOwner()];
  const current = parseActivity(record);
  if (current?.kind === 'lesson') return current;
  const previous = record && typeof record === 'object' ? parseActivity((record as Record<string,unknown>).lastLesson) : null;
  return previous?.kind === 'lesson' ? previous : null;
}

export function writeLastActivity(activity: LastActivity): void {
  const store = readStore();
  const scoped = isOwnerScoped(store) ? { ...store } : { 'legacy-unassigned': parseActivity(store) };
  const lastLesson = readLastLessonActivity();
  scoped[getActiveProgressOwner()] = activity.kind === 'lab' && lastLesson ? {...activity, lastLesson} : activity;
  writeStore(scoped);
}

export function clearOwnerLastActivity(ownerId: string): void {
  const store = readStore();
  if (!isOwnerScoped(store)) {
    // Do not erase data whose owner is unknown.
    return;
  }
  const next = { ...store };
  delete next[ownerId];
  writeStore(next);
}

export function clearGuestLastActivity(): void {
  clearOwnerLastActivity(GUEST_PROGRESS_OWNER);
}

export function migrateGuestLastActivityToUser(userId: number): void {
  const store = readStore();
  const scoped = isOwnerScoped(store)
    ? { ...store }
    : { 'legacy-unassigned': parseActivity(store) };
  const userOwner = progressOwnerId(userId);
  if (!parseActivity(scoped[userOwner]) && parseActivity(scoped[GUEST_PROGRESS_OWNER])) {
    scoped[userOwner] = scoped[GUEST_PROGRESS_OWNER];
  }
  delete scoped[GUEST_PROGRESS_OWNER];
  writeStore(scoped);
}

export function lastActivityTitle(activity: LastActivity, locale: string): string {
  if (locale === 'fr' && activity.titleFr?.trim()) return activity.titleFr;
  return activity.titleAr;
}
