import { CourseLesson } from '../../../types';
import { MATH_4AP } from './math';
import { ARABIC_4AP } from './arabic';
import { SCIENCE_4AP } from './science';
import { ISLAMIC_4AP } from './islamic';
import { FRENCH_4AP } from './french';
import { ENGLISH_4AP } from './english';

export const COURSES_4AP: CourseLesson[] = [
  ...MATH_4AP,
  ...ARABIC_4AP,
  ...SCIENCE_4AP,
  ...ISLAMIC_4AP,
  ...FRENCH_4AP,
  ...ENGLISH_4AP,
];
