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

// Mode Découverte: Tracks viewed lessons in guest mode for friendly stats/nudges,
// but NEVER locks or blocks the child from accessing any lesson.
export function useGuestLimits() {
  const [usage, setUsage] = useState<GuestUsage>(() => loadGuestUsage());

  const viewedCount = usage.viewedLessonIds.length;
  // Always allow unlimited access
  const hasReachedLimit = false;

  const canAccessLesson = useCallback(
    (_lessonId?: string): boolean => {
      // Unlimited access for all students, no blocking
      return true;
    },
    []
  );

  const recordLessonView = useCallback((lessonId: string): void => {
    setUsage((prev) => {
      if (prev.viewedLessonIds.includes(lessonId)) return prev;
      const next: GuestUsage = { viewedLessonIds: [...prev.viewedLessonIds, lessonId] };
      saveGuestUsage(next);
      return next;
    });
  }, []);

  return {
    viewedCount,
    remaining: Infinity,
    hasReachedLimit,
    canAccessLesson,
    recordLessonView,
    shouldShowFriendlyAuthTip: viewedCount >= 3,
  };
}

