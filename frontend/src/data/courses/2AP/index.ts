import { CourseLesson } from '../../../types';
import { MATH_2AP } from './math';
import { MATH_2AP_GAPS } from './math-gaps';
import { ARABIC_2AP } from './arabic';
import { ARABIC_2AP_GAPS } from './arabic-gaps';
import { SCIENCE_2AP } from './science';
import { SCIENCE_2AP_GAPS } from './science-gaps';
import { ISLAMIC_2AP } from './islamic';
import { ISLAMIC_2AP_GAPS } from './islamic-gaps';
import { CIVICS_2AP } from './civics';
import { CIVICS_2AP_GAPS } from './civics-gaps';
import { withCheckedMathAnswers } from './mathAnswerChecks';

export const COURSES_2AP: CourseLesson[] = [
  ...withCheckedMathAnswers(MATH_2AP),
  ...withCheckedMathAnswers(MATH_2AP_GAPS),
  ...ARABIC_2AP,
  ...ARABIC_2AP_GAPS,
  ...SCIENCE_2AP,
  ...SCIENCE_2AP_GAPS,
  ...ISLAMIC_2AP,
  ...ISLAMIC_2AP_GAPS,
  ...CIVICS_2AP,
  ...CIVICS_2AP_GAPS,
];
