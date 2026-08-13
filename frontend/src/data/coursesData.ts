import { CourseLesson } from '../types';
import { COURSES_1AP } from './courses1AP';
import { COURSES_2AP } from './courses/2AP';
import { COURSES_3AP } from './courses/3AP';
import { COURSES_4AP } from './courses/4AP';
import { COURSES_5AP } from './courses/5AP';

// 3AP/4AP/5AP content used to live directly in flat files (courses3AP.ts, and a single
// ~27 500-line array for 4AP/5AP). All three are now split by grade+subject under
// ./courses/{grade}/{subject}.ts so each future lesson addition only touches one small,
// subject-scoped file instead of one giant one.
export const COURSES_DATA: CourseLesson[] = [
  ...COURSES_1AP,
  ...COURSES_2AP,
  ...COURSES_3AP,
  ...COURSES_4AP.map((lesson) => ({
    ...lesson,
    contentSource: lesson.contentSource ?? 'needs_verification',
  })),
  ...COURSES_5AP.map((lesson) => ({
    ...lesson,
    contentSource: lesson.contentSource ?? 'needs_verification',
  })),
];
