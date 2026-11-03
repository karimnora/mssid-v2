import { MUSAIDI_FREE_DAILY_CORRECTIONS } from '../data/musaidiBank';

/**
 * Daily detailed-correction quota for « مساعدي » (3 per day for free accounts, unlimited in Premium).
 * Re-opening a correction already seen today is free. The server (POST /api/v1/musaidi/open) is the
 * authority, per family account and per Algerian day, so a reinstall cannot reset it; the device copy
 * below is only the offline fallback and a cache for the list of corrections already opened.
 */
const PREFIX = 'mssid_musaidi_v1';

export function algeriaDay(now: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Africa/Algiers', year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);
}

const keyFor = (account: string, now: Date) => `${PREFIX}:${account}:${algeriaDay(now)}`;

export function readOpenedToday(account: string, now: Date = new Date()): string[] {
  try {
    const raw = window.localStorage.getItem(keyFor(account, now));
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === 'string') : [];
  } catch {
    return [];
  }
}

export function canOpenCorrection(premium: boolean, opened: string[], itemId: string): boolean {
  return premium || opened.includes(itemId) || opened.length < MUSAIDI_FREE_DAILY_CORRECTIONS;
}

/** Records the correction as seen today. Returns the updated list, or null when the quota refuses it. */
export function openCorrection(account: string, premium: boolean, itemId: string, now: Date = new Date()): string[] | null {
  const opened = readOpenedToday(account, now);
  if (!canOpenCorrection(premium, opened, itemId)) return null;
  if (opened.includes(itemId)) return opened;
  const next = [...opened, itemId];
  try {
    window.localStorage.setItem(keyFor(account, now), JSON.stringify(next));
  } catch {
    /* storage unavailable: allow this view, nothing persisted */
  }
  return next;
}

export function remainingCorrections(premium: boolean, opened: string[]): number | null {
  return premium ? null : Math.max(0, MUSAIDI_FREE_DAILY_CORRECTIONS - opened.length);
}

/** What GET /v1/musaidi/today and POST /v1/musaidi/open answer (MusaidiQuotaService.Status). */
export interface MusaidiServerStatus {
  allowed: boolean;
  premium: boolean;
  limit: number | null;
  remaining: number | null;
  opened: string[];
  day: string;
}

export interface MusaidiApi {
  getMusaidiToday(): Promise<{ data?: MusaidiServerStatus; status: number }>;
  openMusaidi(itemId: string): Promise<{ data?: MusaidiServerStatus; status: number }>;
}

const isStatus = (value: unknown): value is MusaidiServerStatus =>
  !!value && typeof value === 'object' && Array.isArray((value as MusaidiServerStatus).opened) && typeof (value as MusaidiServerStatus).allowed === 'boolean';

function remember(account: string, ids: string[], now: Date): string[] {
  const merged = Array.from(new Set([...readOpenedToday(account, now), ...ids]));
  try {
    window.localStorage.setItem(keyFor(account, now), JSON.stringify(merged));
  } catch {
    /* storage unavailable */
  }
  return merged;
}

/** Loads today's list from the server (free accounts). Falls back to the device copy when offline. */
export async function syncOpenedToday(account: string, api: MusaidiApi, now: Date = new Date()): Promise<string[]> {
  const response = await api.getMusaidiToday().catch(() => null);
  const status = response?.data;
  if (!isStatus(status) || status.premium) return readOpenedToday(account, now);
  // The server count wins: the device copy may be from another family account or stale.
  remember(account, status.opened, now);
  return status.opened;
}

/**
 * Opens a correction, asking the server first. Returns the list of corrections opened today, or null
 * when the free quota refuses it. Offline (or server unreachable) it falls back to the device counter.
 */
export async function openCorrectionSynced(
  account: string,
  premium: boolean,
  itemId: string,
  api: MusaidiApi | null,
  now: Date = new Date(),
): Promise<string[] | null> {
  if (premium || !api) return openCorrection(account, premium, itemId, now);
  const response = await api.openMusaidi(itemId).catch(() => null);
  const status = response?.data;
  if (!isStatus(status)) return openCorrection(account, premium, itemId, now);
  if (status.premium) return openCorrection(account, true, itemId, now);
  if (!status.allowed) return null;
  remember(account, status.opened, now);
  return status.opened;
}
