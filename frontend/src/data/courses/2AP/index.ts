import { CourseLesson } from '../../../types';
import { MATH_2AP } from './math';
import { ARABIC_2AP } from './arabic';
import { SCIENCE_2AP } from './science';
import { ISLAMIC_2AP } from './islamic';
import { CIVICS_2AP } from './civics';

export const COURSES_2AP: CourseLesson[] = [
  ...MATH_2AP,
  ...ARABIC_2AP,
  ...SCIENCE_2AP,
  ...ISLAMIC_2AP,
  ...CIVICS_2AP,
];
