import { daysBetween, suggestExamDate } from './examPlan';

/** The banner shows from J-15 to J-1 before the trimester's compositions (flag `examCountdown`). */
export const EXAM_COUNTDOWN_DAYS = 15;

export interface ExamCountdown {
  examDate: string;
  trimester: 1 | 2 | 3;
  daysLeft: number;
}

/** Next composition window (same dates as the 10-day plan), or null outside J-15…J-1. */
export function examCountdown(now: Date = new Date()): ExamCountdown | null {
  const { date, trimester } = suggestExamDate(now);
  const daysLeft = daysBetween(now, date);
  if (daysLeft < 1 || daysLeft > EXAM_COUNTDOWN_DAYS) return null;
  return { examDate: date, trimester, daysLeft };
}

/** « غداً / بعد يومين / بعد 5 أيام / بعد 12 يوماً » — Arabic number agreement for 1…15. */
export function inDaysAr(days: number): string {
  if (days === 1) return 'غداً';
  if (days === 2) return 'بعد يومين';
  if (days <= 10) return `بعد ${days} أيام`;
  return `بعد ${days} يوماً`;
}

export function inDaysFr(days: number): string {
  return days === 1 ? 'demain' : `dans ${days} jours`;
}

/** Local day key, so « plus tard » hides the banner until tomorrow only. */
export function countdownDismissKey(now: Date = new Date()): string {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `mssid_exam_countdown_dismissed:${y}-${m}-${d}`;
}
