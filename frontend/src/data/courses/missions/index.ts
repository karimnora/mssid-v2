import { buildMission, type BuiltMission } from './build';
import { SECOND_MISSIONS } from './secondMissions';
import { MATH_3AP_MISSIONS } from './math3AP';
import { MATH_4AP_MISSIONS } from './math4AP';
import { MATH_5AP_MISSIONS } from './math5AP';
import { ARABIC_3AP_MISSIONS } from './arabic3AP';
import { ARABIC_4AP_MISSIONS } from './arabic4AP';
import { ARABIC_5AP_MISSIONS } from './arabic5AP';
import { FRENCH_3AP_MISSIONS } from './french3AP';
import { FRENCH_4AP_MISSIONS } from './french4AP';
import { FRENCH_5AP_MISSIONS } from './french5AP';
import { ENGLISH_3AP_MISSIONS } from './english3AP';
import { ENGLISH_4AP_MISSIONS } from './english4AP';
import { ENGLISH_5AP_MISSIONS } from './english5AP';
import { SCIENCE_3AP_MISSIONS } from './science3AP';
import { SCIENCE_4AP_MISSIONS } from './science4AP';
import { SCIENCE_5AP_MISSIONS } from './science5AP';

export { applyMission, applyNextMission } from './build';

/** Lesson id → guided mission. The two hand-written pilots live in autonomyPilots.ts and take precedence. */
export const MISSIONS_BY_LESSON: ReadonlyMap<string, BuiltMission> = new Map(
  [...MATH_3AP_MISSIONS, ...MATH_4AP_MISSIONS, ...MATH_5AP_MISSIONS, ...ARABIC_3AP_MISSIONS, ...ARABIC_4AP_MISSIONS, ...ARABIC_5AP_MISSIONS, ...FRENCH_3AP_MISSIONS, ...FRENCH_4AP_MISSIONS, ...FRENCH_5AP_MISSIONS, ...ENGLISH_3AP_MISSIONS, ...ENGLISH_4AP_MISSIONS, ...ENGLISH_5AP_MISSIONS, ...SCIENCE_3AP_MISSIONS, ...SCIENCE_4AP_MISSIONS, ...SCIENCE_5AP_MISSIONS].map(spec => [spec.lessonId, buildMission(spec)]),
);

/** Lesson id → second mission, chained after the first one (see applyNextMission). */
export const SECOND_MISSIONS_BY_LESSON: ReadonlyMap<string, BuiltMission> = new Map(SECOND_MISSIONS.map(spec => [spec.lessonId, buildMission(spec)]));
