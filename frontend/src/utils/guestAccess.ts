import { CourseLesson, SubjectId } from '../types';

/**
 * Labs a guest (no account) can open without logging in — one flagship lab per age band, chosen
 * to match `defaultLabForGrade` in useAppNavigation.ts so a guest can always reach at least the
 * lab the app would land them on by default. Every other lab redirects to the login modal.
 */
export const FREE_LABS_FOR_GUEST: SubjectId[] = ['primary_math_ops', 'arabic_conjugator'];

export function isLabFreeForGuest(toolId: SubjectId): boolean {
  return FREE_LABS_FOR_GUEST.includes(toolId);
}

/**
 * Guest lesson preview: only the first lesson of a subject (lowest trimester, then catalog order
 * as tiebreaker) is free — enough to show the content quality without giving full access. Returns
 * true (free) when the catalog isn't loaded yet, since a lesson can't actually be opened before
 * its row exists in the UI anyway; this is a defensive fallback, not a real bypass path.
 */
export function isLessonFreeForGuest(lesson: CourseLesson, allLessons: CourseLesson[] | null): boolean {
  if (!allLessons) return true;
  const siblings = allLessons.filter(
    (l) => l.subject === lesson.subject && (l.grade === lesson.grade || lesson.subject === 'soroban'),
  );
  if (siblings.length === 0) return true;
  let first = siblings[0];
  for (const l of siblings) {
    if ((l.trimester ?? 1) < (first.trimester ?? 1)) first = l;
  }
  return first.id === lesson.id;
}
