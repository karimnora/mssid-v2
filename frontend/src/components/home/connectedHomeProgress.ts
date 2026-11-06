import type { CourseLesson, PrimaryGrade } from "../../types";

/** Only published lessons in the selected class count; stale/duplicate ids earn nothing. */
export function connectedHomeProgress(
  grade: PrimaryGrade,
  courses: readonly CourseLesson[] | null,
  validated: readonly string[]
) {
  if (courses === null) return { total: null, completed: 0 };
  const ids = new Set(
    courses
      .filter((lesson) => lesson.grade === grade)
      .map((lesson) => lesson.id)
  );
  const done = new Set(validated);
  return {
    total: ids.size,
    completed: [...ids].filter((id) => done.has(id)).length,
  };
}
