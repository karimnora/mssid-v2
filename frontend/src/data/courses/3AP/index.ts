import { CourseLesson } from '../../../types';
import { MATH_3AP } from './math';
import { ARABIC_3AP } from './arabic';
import { FRENCH_3AP } from './french';
import { ENGLISH_3AP } from './english';
import { HISTORY_GEO_3AP } from './history_geo';
import { SCIENCE_3AP } from './science';
import { ISLAMIC_3AP } from './islamic';
import { CIVICS_3AP } from './civics';

export const COURSES_3AP: CourseLesson[] = [
  ...MATH_3AP,
  ...ARABIC_3AP,
  ...FRENCH_3AP,
  ...ENGLISH_3AP,
  ...HISTORY_GEO_3AP,
  ...SCIENCE_3AP,
  ...ISLAMIC_3AP,
  ...CIVICS_3AP,
];
