import { MUSAIDI_FREE_DAILY_CORRECTIONS } from '../data/musaidiBank';

/**
 * Daily detailed-correction quota for « مساعدي » (3 per day for free accounts, unlimited in Premium).
 * Stored on the device per account and per Algerian calendar day. Re-opening a correction already
 * seen today is free. TODO (docs/v2-todo-business.md): move the counter server-side, per family
 * account, so a reinstall cannot reset it.
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
