import { CourseLesson } from '../types';

/** Parent-facing official axis label (الجيل الثاني). */
export function getOfficialAxisLabel(lesson: CourseLesson): string | undefined {
  return lesson.officialAxisAr ?? lesson.sequenceAr;
}

export function hasCurriculumAxis(lesson: CourseLesson): boolean {
  return Boolean(getOfficialAxisLabel(lesson) || lesson.curriculumAlignment);
}
