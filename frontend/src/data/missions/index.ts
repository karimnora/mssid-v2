import type { Mission } from './types';
import { MATH_5AP_MISSIONS } from './math5ap';
import { ARABIC_5AP_MISSIONS } from './arabic5ap';

export type { Mission } from './types';

export const MISSIONS: Mission[] = [...MATH_5AP_MISSIONS, ...ARABIC_5AP_MISSIONS];

const byLesson = new Map(MISSIONS.map((mission) => [mission.lessonId, mission]));

export function missionForLesson(lessonId: string): Mission | undefined {
  return byLesson.get(lessonId);
}

/** Free accounts: the mission flagged `free`, one per subject (checked by a test). */
export function canOpenMission(mission: Mission, premium: boolean): boolean {
  return premium || Boolean(mission.free);
}
