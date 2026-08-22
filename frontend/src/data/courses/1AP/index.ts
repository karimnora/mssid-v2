import { CourseLesson } from '../../../types';
import { MATH_1AP } from './math';
import { MATH_1AP_COMPARE } from './math-compare';
import { MATH_1AP_GAPS } from './math-gaps';
import { ARABIC_1AP } from './arabic';
import { ARABIC_1AP_MADD } from './arabic-madd';
import { ARABIC_1AP_GAPS } from './arabic-gaps';
import { SCIENCE_1AP } from './science';
import { ISLAMIC_1AP } from './islamic';
import { CIVICS_1AP } from './civics';
import { applyPlayful1AP } from './playfulBuilders';
import { PLAYFUL_PACKS } from './playfulPacks';

export const COURSES_1AP: CourseLesson[] = applyPlayful1AP(
  [
    ...MATH_1AP,
    ...MATH_1AP_COMPARE,
    ...MATH_1AP_GAPS,
    ...ARABIC_1AP,
    ...ARABIC_1AP_MADD,
    ...ARABIC_1AP_GAPS,
    ...SCIENCE_1AP,
    ...ISLAMIC_1AP,
    ...CIVICS_1AP,
  ],
  PLAYFUL_PACKS,
);
