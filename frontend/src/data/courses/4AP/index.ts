import { CourseLesson } from '../../../types';
import { MATH_4AP } from './math';
import { ARABIC_4AP } from './arabic';
import { SCIENCE_4AP } from './science';
import { ISLAMIC_4AP } from './islamic';
import { FRENCH_4AP } from './french';
import { ENGLISH_4AP } from './english';
import { HISTORY_GEO_4AP } from './history_geo';
import { CIVICS_4AP } from './civics';
import { TAMAZIGHT_4AP } from './tamazight';

export const COURSES_4AP: CourseLesson[] = [
  ...MATH_4AP,
  ...ARABIC_4AP,
  ...SCIENCE_4AP,
  ...ISLAMIC_4AP,
  ...FRENCH_4AP,
  ...ENGLISH_4AP,
  ...HISTORY_GEO_4AP,
  ...CIVICS_4AP,
  ...TAMAZIGHT_4AP,
];
