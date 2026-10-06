import { PrimaryGrade, SubjectId } from '../types';
import { isValidGrade } from '../navigation/appLocation';

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

export function readLastActivity(): LastActivity | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
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
  } catch {
    return null;
  }
}

export function writeLastActivity(activity: LastActivity): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(activity));
  } catch {
    // Quota / private mode — resume CTA simply stays hidden.
  }
}

export function lastActivityTitle(activity: LastActivity, locale: string): string {
  if (locale === 'fr' && activity.titleFr?.trim()) return activity.titleFr;
  return activity.titleAr;
}
