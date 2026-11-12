import { buildMission, type BuiltMission } from './build';
import { MATH_3AP_MISSIONS } from './math3AP';
import { MATH_4AP_MISSIONS } from './math4AP';
import { MATH_5AP_MISSIONS } from './math5AP';
import { ARABIC_3AP_MISSIONS } from './arabic3AP';
import { ARABIC_4AP_MISSIONS } from './arabic4AP';
import { ARABIC_5AP_MISSIONS } from './arabic5AP';

export { applyMission } from './build';

/** Lesson id → guided mission. The two hand-written pilots live in autonomyPilots.ts and take precedence. */
export const MISSIONS_BY_LESSON: ReadonlyMap<string, BuiltMission> = new Map(
  [...MATH_3AP_MISSIONS, ...MATH_4AP_MISSIONS, ...MATH_5AP_MISSIONS, ...ARABIC_3AP_MISSIONS, ...ARABIC_4AP_MISSIONS, ...ARABIC_5AP_MISSIONS].map(spec => [spec.lessonId, buildMission(spec)]),
);
