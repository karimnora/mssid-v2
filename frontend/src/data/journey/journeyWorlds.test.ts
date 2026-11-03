import { describe, expect, it } from 'vitest';
import { COURSES_DATA } from '../coursesData';
import { JOURNEYS, JOURNEY_HEIGHT, journeyWidth, worldLeft } from './journeyWorlds';

describe('journey worlds', () => {
  const worlds = JOURNEYS['1AP']!;

  it('has the eight Algerian worlds of the 1AP journey, in travel order', () => {
    expect(worlds.map((w) => w.id)).toEqual(['sahara', 'casbah', 'sea', 'constantine', 'djurdjura', 'timgad', 'tassili', 'space']);
  });

  it('only points at real 1AP lessons of the catalog, each used once', () => {
    const catalog = new Map(COURSES_DATA.map((l) => [l.id, l]));
    const ids = worlds.flatMap((w) => [...w.lessonIds]);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) {
      const lesson = catalog.get(id);
      expect(lesson, id).toBeDefined();
      expect(lesson!.grade, id).toBe('1AP');
    }
  });

  it('keeps every station inside the map and bilingual texts filled', () => {
    for (const w of worlds) {
      for (const y of w.ys) {
        expect(y).toBeGreaterThan(100);
        expect(y).toBeLessThan(JOURNEY_HEIGHT - 100);
      }
      for (const text of [w.name, w.subtitle, w.welcome, w.badge]) {
        expect(text.ar.trim()).not.toBe('');
        expect(text.fr.trim()).not.toBe('');
      }
    }
  });

  it('lays the worlds out right to left, like Arabic reading', () => {
    expect(worldLeft(worlds, 0)).toBe(journeyWidth(worlds) - 1600);
    expect(worldLeft(worlds, worlds.length - 1)).toBe(0);
  });
});
