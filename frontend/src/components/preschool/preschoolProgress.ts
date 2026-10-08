import { localDateKey } from './useDailyChallenge';
import { isPlaySuccess, PreschoolModule, PreschoolPlayQuality } from '../../data/preschool/types';

const LEGACY_PROGRESS_KEY = 'mssid_preschool_progress';
const LEGACY_CHALLENGE_KEY = 'mssid_daily_challenge';
const CHILDREN_KEY = 'mssid_preschool_children';
const ACTIVE_CHILD_KEY = 'mssid_preschool_active_child';

export const PRESCHOOL_CHILD_IDS = ['child-1', 'child-2'] as const;
export type PreschoolChildId = (typeof PRESCHOOL_CHILD_IDS)[number];

export interface PreschoolChildSlot {
  id: PreschoolChildId;
  name: string;
}

export interface PlayEvent {
  activityId: string;
  date: string;
  quality: PreschoolPlayQuality;
}

export const GUEST_OWNER_ID = 'child-1';
export const LEGACY_BADGES_KEY = 'mssid_preschool_badges';
const SINGLE_NAME_KEY = 'mssid_preschool_child_name';

export type BilanStatus = 'discovered' | 'several' | 'tried' | 'skipped' | 'helped';

export interface BilanRow {
  activityId: string;
  moduleId: string;
  title: string;
  status: BilanStatus;
  count: number;
  lastAt: string;
}

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* quota / private mode */
  }
}

function progressKey(childId: string): string {
  return `${LEGACY_PROGRESS_KEY}:${childId}`;
}

function eventsKey(childId: string): string {
  return `mssid_preschool_events:${childId}`;
}

export function challengeStorageKey(childId: string): string {
  return `${LEGACY_CHALLENGE_KEY}:${childId}`;
}

export function badgeStorageKey(ownerId: string): string {
  return `${LEGACY_BADGES_KEY}:${ownerId}`;
}

export function progressOwnerId(userId?: number | null): string {
  return typeof userId === 'number' ? `user-${userId}` : GUEST_OWNER_ID;
}

export function firstNameOf(nom?: string | null): string {
  const token = nom?.trim().split(/\s+/)[0] ?? '';
  return token.slice(0, 24);
}

function childNameKey(ownerId: string): string {
  return `${SINGLE_NAME_KEY}:${ownerId}`;
}

export function loadSingleChildName(ownerId: string): string {
  if (typeof window === 'undefined') return '';
  return window.localStorage.getItem(childNameKey(ownerId))?.trim().slice(0, 24) ?? '';
}

export function saveSingleChildName(ownerId: string, name: string) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(childNameKey(ownerId), name.trim().slice(0, 24));
  } catch {
    /* ignore */
  }
}

export function adoptGuestProgressIfEmpty(userId: number) {
  const dest = progressOwnerId(userId);
  if (loadProgress(dest).length > 0 || loadEvents(dest).length > 0) return;
  const guestProgress = loadProgress(GUEST_OWNER_ID);
  const guestEvents = loadEvents(GUEST_OWNER_ID);
  if (guestProgress.length) saveProgress(dest, guestProgress);
  if (guestEvents.length) writeJson(eventsKey(dest), guestEvents);
  const guestName = loadSingleChildName(GUEST_OWNER_ID);
  if (guestName && !loadSingleChildName(dest)) saveSingleChildName(dest, guestName);
  if (typeof window === 'undefined') return;
  const destChallenge = window.localStorage.getItem(challengeStorageKey(dest));
  const guestChallenge = window.localStorage.getItem(challengeStorageKey(GUEST_OWNER_ID));
  if (!destChallenge && guestChallenge) {
    window.localStorage.setItem(challengeStorageKey(dest), guestChallenge);
  }
  const destBadges = window.localStorage.getItem(badgeStorageKey(dest));
  const guestBadges = window.localStorage.getItem(badgeStorageKey(GUEST_OWNER_ID))
    ?? window.localStorage.getItem(LEGACY_BADGES_KEY);
  if (!destBadges && guestBadges) {
    window.localStorage.setItem(badgeStorageKey(dest), guestBadges);
  }
}

function migrateLegacyIfNeeded(childId: string) {
  if (typeof window === 'undefined') return;
  if (childId !== 'child-1') return;
  if (!window.localStorage.getItem(progressKey(childId))) {
    const legacy = window.localStorage.getItem(LEGACY_PROGRESS_KEY);
    if (legacy) window.localStorage.setItem(progressKey(childId), legacy);
  }
  if (!window.localStorage.getItem(challengeStorageKey(childId))) {
    const legacy = window.localStorage.getItem(LEGACY_CHALLENGE_KEY);
    if (legacy) window.localStorage.setItem(challengeStorageKey(childId), legacy);
  }
}

export function loadChildSlots(): PreschoolChildSlot[] {
  const stored = readJson<PreschoolChildSlot[]>(CHILDREN_KEY, []);
  return PRESCHOOL_CHILD_IDS.map((id) => ({
    id,
    name: stored.find((s) => s.id === id)?.name?.trim() ?? '',
  }));
}

export function saveChildName(childId: PreschoolChildId, name: string) {
  const next = loadChildSlots().map((slot) =>
    slot.id === childId ? { ...slot, name: name.trim().slice(0, 24) } : slot,
  );
  writeJson(CHILDREN_KEY, next);
}

export function loadActiveChildId(): PreschoolChildId {
  const saved = typeof window === 'undefined' ? null : window.localStorage.getItem(ACTIVE_CHILD_KEY);
  return saved === 'child-2' ? 'child-2' : 'child-1';
}

export function saveActiveChildId(childId: PreschoolChildId) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(ACTIVE_CHILD_KEY, childId);
  } catch {
    /* ignore */
  }
}

export function loadProgress(childId: string): string[] {
  migrateLegacyIfNeeded(childId);
  const ids = readJson<string[]>(progressKey(childId), []);
  return Array.isArray(ids) ? ids.filter((id) => typeof id === 'string') : [];
}

export function saveProgress(childId: string, ids: string[]) {
  writeJson(progressKey(childId), ids);
}

export function loadEvents(childId: string): PlayEvent[] {
  const events = readJson<PlayEvent[]>(eventsKey(childId), []);
  return Array.isArray(events) ? events.filter((e) => e && typeof e.activityId === 'string' && typeof e.date === 'string') : [];
}

export function appendEvent(childId: string, event: PlayEvent): PlayEvent[] {
  const next = [...loadEvents(childId), event];
  writeJson(eventsKey(childId), next);
  return next;
}

export function todayPlayIds(events: PlayEvent[], date: string = localDateKey()): string[] {
  const ids = new Set<string>();
  for (const event of events) {
    if (event.date === date && isPlaySuccess(event.quality)) ids.add(event.activityId);
  }
  return [...ids];
}

export function childDisplayName(
  slot: PreschoolChildSlot,
  language: 'ar' | 'fr' | 'en',
  index: number,
): string {
  if (slot.name) return slot.name;
  if (language === 'ar') return `الطِّفْل ${index + 1}`;
  if (language === 'fr') return `Enfant ${index + 1}`;
  return `Child ${index + 1}`;
}

export function summarizeBilan(
  events: PlayEvent[],
  modules: PreschoolModule[],
  language: 'ar' | 'fr' | 'en',
): BilanRow[] {
  const byActivity = new Map<string, PlayEvent[]>();
  for (const event of events) {
    const list = byActivity.get(event.activityId) ?? [];
    list.push(event);
    byActivity.set(event.activityId, list);
  }

  const titleOf = (activityId: string): { title: string; moduleId: string } => {
    for (const mod of modules) {
      const act = mod.activities.find((a) => a.id === activityId);
      if (act) return { title: act.i18n[language].title, moduleId: mod.id };
    }
    return { title: activityId, moduleId: '' };
  };

  const rows: BilanRow[] = [];
  for (const [activityId, list] of byActivity) {
    const successes = list.filter((e) => isPlaySuccess(e.quality));
    const helped = list.some((e) => e.quality === 'helped');
    const tried = list.some((e) => e.quality === 'tried');
    const skipped = list.some((e) => e.quality === 'skipped');
    const last = list[list.length - 1];
    const { title, moduleId } = titleOf(activityId);
    let status: BilanStatus | null = null;
    if (successes.length >= 2) status = 'several';
    else if (successes.length === 1) status = 'discovered';
    else if (helped) status = 'helped';
    else if (tried) status = 'tried';
    else if (skipped) status = 'skipped';
    if (!status) continue;
    rows.push({
      activityId,
      moduleId,
      title,
      status,
      count: successes.length || list.length,
      lastAt: last.date,
    });
  }

  rows.sort((a, b) => b.lastAt.localeCompare(a.lastAt) || b.count - a.count);
  return rows;
}

export function suggestNextActivity(
  modules: PreschoolModule[],
  completedIds: string[],
  lastActivityId?: string | null,
): { moduleId: string; activityId: string } | null {
  const completed = new Set(completedIds);
  const lastModule = lastActivityId
    ? modules.find((mod) => mod.activities.some((act) => act.id === lastActivityId))
    : undefined;
  const ordered = lastModule
    ? [lastModule, ...modules.filter((mod) => mod.id !== lastModule.id)]
    : modules;
  for (const mod of ordered) {
    const next = mod.activities.find((act) => !completed.has(act.id));
    if (next) return { moduleId: mod.id, activityId: next.id };
  }
  return null;
}

export function moduleProgressRows(
  modules: PreschoolModule[],
  completedIds: string[],
  language: 'ar' | 'fr' | 'en',
): { moduleId: string; title: string; done: number; total: number }[] {
  return modules
    .map((mod) => ({
      moduleId: mod.id,
      title: mod.titleI18n[language],
      done: mod.activities.filter((act) => completedIds.includes(act.id)).length,
      total: mod.activities.length,
    }))
    .filter((row) => row.done > 0)
    .sort((a, b) => b.done / Math.max(b.total, 1) - a.done / Math.max(a.total, 1))
    .slice(0, 5);
}
