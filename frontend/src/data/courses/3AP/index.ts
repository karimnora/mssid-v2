import { CourseLesson } from '../../../types';
import { MATH_3AP } from './math';
import { ARABIC_3AP } from './arabic';
import { ENGLISH_3AP } from './english';
import { HISTORY_GEO_3AP } from './history_geo';
import { SCIENCE_3AP } from './science';
import { ISLAMIC_3AP } from './islamic';
import { CIVICS_3AP } from './civics';
import { TAMAZIGHT_3AP } from './tamazight';
import { ART_3AP } from './art';

// No French import: French moved to 4AP starting rentrée 2026-2027 (CLAUDE.md § 2.B),
// its 3AP-authored beginner lessons were merged into 4AP/french.ts.
export const COURSES_3AP: CourseLesson[] = [
  ...MATH_3AP,
  ...ARABIC_3AP,
  ...ENGLISH_3AP,
  ...HISTORY_GEO_3AP,
  ...SCIENCE_3AP,
  ...ISLAMIC_3AP,
  ...CIVICS_3AP,
  ...TAMAZIGHT_3AP,
  ...ART_3AP,
];

