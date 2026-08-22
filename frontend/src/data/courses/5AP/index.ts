import { CourseLesson } from '../../../types';
import { MATH_5AP } from './math';
import { MATH_5AP_CIRCLE } from './math-circle';
import { ARABIC_5AP } from './arabic';
import { SCIENCE_5AP } from './science';
import { HISTORY_GEO_5AP } from './history_geo';
import { ISLAMIC_5AP } from './islamic';
import { CIVICS_5AP } from './civics';
import { FRENCH_5AP } from './french';
import { FRENCH_5AP_INVENTIONS } from './french-inventions-ecologie';
import { ENGLISH_5AP } from './english';
import { ENGLISH_5AP_WILL_DIRECTIONS } from './english-will-directions';
import { SOROBAN_5AP } from './soroban';
import { TAMAZIGHT_5AP } from './tamazight';

export const COURSES_5AP: CourseLesson[] = [
  ...MATH_5AP,
  ...MATH_5AP_CIRCLE,
  ...ARABIC_5AP,
  ...SCIENCE_5AP,
  ...HISTORY_GEO_5AP,
  ...ISLAMIC_5AP,
  ...CIVICS_5AP,
  ...FRENCH_5AP,
  ...FRENCH_5AP_INVENTIONS,
  ...ENGLISH_5AP,
  ...ENGLISH_5AP_WILL_DIRECTIONS,
  ...SOROBAN_5AP,
  ...TAMAZIGHT_5AP,
];
