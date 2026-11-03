import {
  JOURNEY_STATION_XS,
  worldLeft,
  type JourneyWorld,
} from '../data/journey/journeyWorlds';
import type { PrimaryGrade } from '../types';
import { getActiveProgressOwner } from './progressOwner';

export interface JourneyStation {
  index: number;
  worldIndex: number;
  kind: 'lesson' | 'treasure';
  lessonId?: string;
  /** 1–3 for lessons, 0 for the treasure. */
  number: number;
  x: number;
  y: number;
}

/**
 * done: lesson quiz fully validated / treasure opened.
 * open: the next station on the path.
 * locked: further along the path.
 * missing: the lesson is not in the published catalog (e.g. curriculumReviewGate) — shown greyed
 *          and skipped, so a hidden lesson never blocks the rest of the journey.
 * premium: in a Premium world (access/entitlements.ts → journeyAllWorlds) for a free account. A
 *          lesson already validated elsewhere in the app still shows as done.
 */
export type StationState = 'done' | 'open' | 'locked' | 'missing' | 'premium';

export function buildStations(worlds: readonly JourneyWorld[]): JourneyStation[] {
  const stations: JourneyStation[] = [];
  worlds.forEach((world, worldIndex) => {
    const left = worldLeft(worlds, worldIndex);
    JOURNEY_STATION_XS.forEach((x, j) => {
      const base = { index: stations.length, worldIndex, x: left + x, y: world.ys[j] };
      stations.push(
        j < 3
          ? { ...base, kind: 'lesson', lessonId: world.lessonIds[j], number: j + 1 }
          : { ...base, kind: 'treasure', number: 0 },
      );
    });
  });
  return stations;
}

export function stationStates(
  stations: readonly JourneyStation[],
  worlds: readonly JourneyWorld[],
  validatedLessonIds: ReadonlySet<string>,
  claimedWorldIds: ReadonlySet<string>,
  availableLessonIds: ReadonlySet<string>,
  /** First world index reserved to Premium; null when the account has full access. */
  premiumFromWorld: number | null = null,
): StationState[] {
  let openGiven = false;
  return stations.map((station) => {
    if (station.kind === 'lesson') {
      if (!availableLessonIds.has(station.lessonId!)) return 'missing';
      if (validatedLessonIds.has(station.lessonId!)) return 'done';
    } else if (claimedWorldIds.has(worlds[station.worldIndex].id)) {
      return 'done';
    }
    if (premiumFromWorld != null && station.worldIndex >= premiumFromWorld) return 'premium';
    if (openGiven) return 'locked';
    openGiven = true;
    return 'open';
  });
}

/** Where Didou should stand: the open station, the last free one before a Premium world, or the end. */
export function currentStationIndex(states: readonly StationState[]): number {
  const open = states.indexOf('open');
  if (open !== -1) return open;
  const premium = states.indexOf('premium');
  if (premium > 0) return premium - 1;
  return Math.max(0, states.length - 1);
}

/**
 * Stars of a validated station: 3 when the recent sessions of this lesson show no failed attempt,
 * 2 after one or two misses, 1 beyond. Mirrors the parent notebook's "réussi seul / avec aide"
 * reading rather than XP, which piles up with every replayed activity.
 */
export function starsForLesson(
  lessonSessions: ReadonlyArray<{ lessonId: string; outcome: 'success' | 'fail' }> | undefined,
  lessonId: string,
): number {
  const misses = (lessonSessions ?? []).filter((s) => s.lessonId === lessonId && s.outcome === 'fail').length;
  if (misses === 0) return 3;
  if (misses <= 2) return 2;
  return 1;
}

interface JourneyMemory {
  claimed: string[];
  /** Station where Didou was last left, to animate his walk to a newly opened station. */
  at: number;
  welcomed: boolean;
}

const EMPTY_MEMORY: JourneyMemory = { claimed: [], at: 0, welcomed: false };

export function journeyStorageKey(grade: PrimaryGrade, owner = getActiveProgressOwner()): string {
  return `mssid_journey_v1:${owner}:${grade}`;
}

export function loadJourneyMemory(grade: PrimaryGrade): JourneyMemory {
  try {
    const raw = window.localStorage.getItem(journeyStorageKey(grade));
    if (!raw) return { ...EMPTY_MEMORY };
    const parsed = JSON.parse(raw) as Partial<JourneyMemory>;
    return {
      claimed: Array.isArray(parsed.claimed) ? parsed.claimed.filter((id) => typeof id === 'string') : [],
      at: typeof parsed.at === 'number' && parsed.at >= 0 ? parsed.at : 0,
      welcomed: parsed.welcomed === true,
    };
  } catch {
    return { ...EMPTY_MEMORY };
  }
}

export function saveJourneyMemory(grade: PrimaryGrade, memory: JourneyMemory): void {
  try {
    window.localStorage.setItem(journeyStorageKey(grade), JSON.stringify(memory));
  } catch {
    /* storage full or blocked: the journey still works for this session */
  }
}
