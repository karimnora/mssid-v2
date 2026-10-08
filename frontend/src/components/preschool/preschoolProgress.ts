import { localDateKey } from './useDailyChallenge';
import { PreschoolModule, PreschoolPlayQuality } from '../../data/preschool/types';

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

export type BilanStatus = 'discovered' | 'helped' | 'several';

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
    if (event.date === date && event.quality !== 'helped') ids.add(event.activityId);
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
    const successes = list.filter((e) => e.quality !== 'helped');
    const helped = list.some((e) => e.quality === 'helped' || e.quality === 'tried');
    const last = list[list.length - 1];
    const { title, moduleId } = titleOf(activityId);
    let status: BilanStatus = 'discovered';
    if (successes.length >= 2) status = 'several';
    else if (helped) status = 'helped';
    else if (successes.length === 0) continue;
    rows.push({
      activityId,
      moduleId,
      title,
      status,
      count: successes.length,
      lastAt: last.date,
    });
  }

  rows.sort((a, b) => b.lastAt.localeCompare(a.lastAt) || b.count - a.count);
  return rows;
}
