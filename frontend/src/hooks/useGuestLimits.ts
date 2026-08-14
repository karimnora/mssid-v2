import { useCallback, useState } from 'react';

const GUEST_USAGE_KEY = 'mssid_guest_usage';
export const MAX_GUEST_LESSONS = 3;

interface GuestUsage {
  viewedLessonIds: string[];
}

function loadGuestUsage(): GuestUsage {
  if (typeof window === 'undefined') return { viewedLessonIds: [] };
  try {
    const saved = window.localStorage.getItem(GUEST_USAGE_KEY);
    if (!saved) return { viewedLessonIds: [] };
    const parsed = JSON.parse(saved);
    return { viewedLessonIds: Array.isArray(parsed?.viewedLessonIds) ? parsed.viewedLessonIds : [] };
  } catch {
    return { viewedLessonIds: [] };
  }
}

function saveGuestUsage(usage: GuestUsage): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(GUEST_USAGE_KEY, JSON.stringify(usage));
}

// Mode Découverte: tracks which lessons a non-authenticated visitor has opened, as a plain array of
// lesson ids in localStorage — no name/email/PII, so this is unaffected by the SEC-05 localStorage
// cleanup (that was specifically about the authenticated profile). This hook only tracks usage; the
// caller (App.tsx) decides whether to enforce the limit (it never applies once authUser exists).
export function useGuestLimits() {
  const [usage, setUsage] = useState<GuestUsage>(() => loadGuestUsage());

  const viewedCount = usage.viewedLessonIds.length;
  const remaining = Math.max(0, MAX_GUEST_LESSONS - viewedCount);
  const hasReachedLimit = viewedCount >= MAX_GUEST_LESSONS;

  // A lesson already opened once stays free to revisit — only a *new* 4th lesson gets blocked.
  const canAccessLesson = useCallback(
    (lessonId: string): boolean => {
      if (usage.viewedLessonIds.includes(lessonId)) return true;
      return usage.viewedLessonIds.length < MAX_GUEST_LESSONS;
    },
    [usage]
  );

  const recordLessonView = useCallback((lessonId: string): void => {
    setUsage((prev) => {
      if (prev.viewedLessonIds.includes(lessonId)) return prev;
      const next: GuestUsage = { viewedLessonIds: [...prev.viewedLessonIds, lessonId] };
      saveGuestUsage(next);
      return next;
    });
  }, []);

  return { viewedCount, remaining, hasReachedLimit, canAccessLesson, recordLessonView };
}
