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

describe('one map per grade, for the whole school year', () => {
  const catalog = new Map(COURSES_DATA.map((l) => [l.id, l]));
  for (const grade of ['2AP', '3AP', '4AP', '5AP'] as const) {
    it(`${grade}: eight worlds of real ${grade} lessons, used once, following the trimesters`, () => {
      const worlds = JOURNEYS[grade]!;
      expect(worlds).toHaveLength(8);
      expect(worlds.map((w) => w.id)).toEqual(JOURNEYS['1AP']!.map((w) => w.id));
      const ids = worlds.flatMap((w) => [...w.lessonIds]);
      expect(new Set(ids).size).toBe(ids.length);
      worlds.forEach((w, k) => {
        const expected = k < 3 ? 1 : k < 6 ? 2 : 3;
        for (const id of w.lessonIds) {
          const lesson = catalog.get(id);
          expect(lesson, `${grade} ${w.id} ${id}`).toBeDefined();
          expect(lesson!.grade, id).toBe(grade);
          expect(lesson!.trimester, `${grade} ${w.id} ${id}`).toBe(expected);
        }
        for (const text of [w.subtitle, w.welcome]) {
          expect(text.ar.trim()).not.toBe('');
          expect(text.fr.trim()).not.toBe('');
        }
      });
    });
  }

  it('never shares a theme between grades: each year has its own map', () => {
    const subtitles = (['1AP', '2AP', '3AP', '4AP', '5AP'] as const).map((g) => JOURNEYS[g]![3].subtitle.ar);
    expect(new Set(subtitles).size).toBe(subtitles.length);
  });
});
