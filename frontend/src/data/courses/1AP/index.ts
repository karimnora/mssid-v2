import { CourseLesson } from '../../../types';
import { MATH_1AP } from './math';
import { MATH_1AP_COMPARE } from './math-compare';
import { ARABIC_1AP } from './arabic';
import { ARABIC_1AP_MADD } from './arabic-madd';
import { SCIENCE_1AP } from './science';
import { ISLAMIC_1AP } from './islamic';
import { CIVICS_1AP } from './civics';

export const COURSES_1AP: CourseLesson[] = [
  ...MATH_1AP,
  ...MATH_1AP_COMPARE,
  ...ARABIC_1AP,
  ...ARABIC_1AP_MADD,
  ...SCIENCE_1AP,
  ...ISLAMIC_1AP,
  ...CIVICS_1AP,
];
