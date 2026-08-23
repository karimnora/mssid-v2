import { describe, expect, it } from 'vitest';
import { oppositeChoice } from './playfulBuilders';
import { COURSES_1AP } from './index';

describe('1AP tap builders', () => {
  it('turns a number solution into a nearby wrong tap', () => {
    expect(oppositeChoice('3')).toBe('4');
    expect(oppositeChoice('0')).toBe('1');
  });

  it('turns a spatial word into its opposite picture-word', () => {
    expect(oppositeChoice('فَوْقَ الغُصْنِ')).toBe('تَحْتَ 👇');
    expect(oppositeChoice('دَاخِلَ السَّلَّةِ')).toBe('خَارِجٌ 🚪');
  });

  it('turns a shape name into a different real shape', () => {
    expect(oppositeChoice('مُثَلَّثٌ')).toBe('دَائِرَةٌ');
  });

  // Regression guard for a real bug: a solution with no spatial/numeric/shape opposite (a letter,
  // a surah name, a full sentence...) used to fall through to the literal placeholder "لَيْسَ هَذَا"
  // shown as if it were a real wrong answer. It should now borrow another real solution from the
  // same exercise set instead.
  it('borrows a sibling solution instead of a made-up placeholder when nothing else matches', () => {
    expect(oppositeChoice('سُورَةُ الفَاتِحَةِ', ['بِسْمِ اللهِ'])).toBe('بِسْمِ اللهِ');
    expect(oppositeChoice('أَ', [])).toBe('لَيْسَ هَذَا'); // no sibling available: last-resort fallback only
  });

  it('never leaves the placeholder wrong-answer in the assembled 1AP course data', () => {
    const offenders: string[] = [];
    COURSES_1AP.forEach((lesson) => {
      (lesson.progressiveExercises || []).forEach((ex) => {
        (ex.options || []).forEach((opt) => {
          if (opt.textAr?.includes('لَيْسَ هَذَا')) {
            offenders.push(`${lesson.id} / ${ex.id}`);
          }
        });
      });
    });
    expect(offenders).toEqual([]);
  });
});
