import { beforeEach, describe, expect, it } from 'vitest';
import { JOURNEYS } from '../data/journey/journeyWorlds';
import {
  buildStations,
  currentStationIndex,
  journeyStorageKey,
  loadJourneyMemory,
  saveJourneyMemory,
  starsForLesson,
  stationStates,
} from './journeyProgress';
import { setActiveProgressOwner } from './progressOwner';

const worlds = JOURNEYS['1AP']!;
const stations = buildStations(worlds);
const allLessons = new Set(worlds.flatMap((w) => [...w.lessonIds]));
const none = new Set<string>();

describe('buildStations', () => {
  it('creates three lessons then a treasure per world', () => {
    expect(stations).toHaveLength(worlds.length * 4);
    expect(stations.slice(0, 4).map((s) => s.kind)).toEqual(['lesson', 'lesson', 'lesson', 'treasure']);
    expect(stations[0].lessonId).toBe(worlds[0].lessonIds[0]);
    // Travel goes right → left: x strictly decreases along the path.
    for (let i = 1; i < stations.length; i++) expect(stations[i].x).toBeLessThan(stations[i - 1].x);
  });
});

describe('stationStates', () => {
  it('opens only the first station for a new child', () => {
    const states = stationStates(stations, worlds, none, none, allLessons);
    expect(states[0]).toBe('open');
    expect(states.slice(1).every((s) => s === 'locked')).toBe(true);
    expect(currentStationIndex(states)).toBe(0);
  });

  it('counts a station done only when its quiz was fully validated, then opens the treasure', () => {
    const validated = new Set(worlds[0].lessonIds);
    const states = stationStates(stations, worlds, validated, none, allLessons);
    expect(states.slice(0, 3)).toEqual(['done', 'done', 'done']);
    expect(states[3]).toBe('open');
    expect(states[4]).toBe('locked');
  });

  it('moves on to the next world once the treasure is claimed', () => {
    const states = stationStates(stations, worlds, new Set(worlds[0].lessonIds), new Set(['sahara']), allLessons);
    expect(states[3]).toBe('done');
    expect(states[4]).toBe('open');
  });

  it('keeps lessons validated elsewhere done even ahead of the open station', () => {
    const states = stationStates(stations, worlds, new Set([worlds[1].lessonIds[0]]), none, allLessons);
    expect(states[0]).toBe('open');
    expect(states[4]).toBe('done');
  });

  it('skips a lesson missing from the published catalog instead of blocking the journey', () => {
    const available = new Set([...allLessons].filter((id) => id !== worlds[0].lessonIds[0]));
    const states = stationStates(stations, worlds, none, none, available);
    expect(states[0]).toBe('missing');
    expect(states[1]).toBe('open');
  });

  it('parks Didou on the last station when everything is done', () => {
    const states = stationStates(stations, worlds, allLessons, new Set(worlds.map((w) => w.id)), allLessons);
    expect(states.every((s) => s === 'done')).toBe(true);
    expect(currentStationIndex(states)).toBe(stations.length - 1);
  });
});

describe('starsForLesson', () => {
  it('gives 3 stars without a miss, 2 after one or two, 1 beyond', () => {
    const id = 'math-1ap-t1-spatial-relations';
    const fail = { lessonId: id, outcome: 'fail' as const };
    const ok = { lessonId: id, outcome: 'success' as const };
    expect(starsForLesson(undefined, id)).toBe(3);
    expect(starsForLesson([ok], id)).toBe(3);
    expect(starsForLesson([fail, ok], id)).toBe(2);
    expect(starsForLesson([fail, fail, fail, ok], id)).toBe(1);
    expect(starsForLesson([{ lessonId: 'other', outcome: 'fail' }], id)).toBe(3);
  });
});

describe('journey memory', () => {
  beforeEach(() => {
    window.localStorage.clear();
    setActiveProgressOwner(7, 3);
  });

  it('is stored per child and per grade', () => {
    expect(journeyStorageKey('1AP')).toBe('mssid_journey_v1:user:7:child:3:1AP');
    saveJourneyMemory('1AP', { claimed: ['sahara'], at: 4, welcomed: true });
    expect(loadJourneyMemory('1AP')).toEqual({ claimed: ['sahara'], at: 4, welcomed: true });
    setActiveProgressOwner(7, 4);
    expect(loadJourneyMemory('1AP')).toEqual({ claimed: [], at: 0, welcomed: false });
  });

  it('survives corrupted storage', () => {
    window.localStorage.setItem(journeyStorageKey('1AP'), '{not json');
    expect(loadJourneyMemory('1AP')).toEqual({ claimed: [], at: 0, welcomed: false });
    window.localStorage.setItem(journeyStorageKey('1AP'), JSON.stringify({ claimed: [1, 'sea'], at: -2 }));
    expect(loadJourneyMemory('1AP')).toEqual({ claimed: ['sea'], at: 0, welcomed: false });
  });
});
