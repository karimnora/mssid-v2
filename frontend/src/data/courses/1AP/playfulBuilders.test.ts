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

  it('never glues the digits of a multi-number answer into a fake number', () => {
    // "اِثْنَا عَشَرَ. 10 + 2" used to become "103".
    expect(oppositeChoice('اِثْنَا عَشَرَ. 10 + 2', ['10 + 4'])).toBe('10 + 4');
    expect(oppositeChoice('58 > 45', [])).toBe('لَيْسَ هَذَا');
  });

  it('does not offer the same answer twice when two solutions differ only by vowel marks', () => {
    expect(oppositeChoice('ز', ['زْ', 'ر'])).toBe('ر');
  });
});

describe('1AP maths tap exercises', () => {
  it('always offer a wrong answer of the same kind as the right one', () => {
    const lessons = COURSES_1AP.filter(lesson => lesson.subject === 'math');
    for (const lesson of lessons) {
      const solutions = (lesson.progressiveExercises ?? []).map(ex => ex.solutionAr);
      for (const ex of lesson.progressiveExercises ?? []) {
        if (ex.type !== 'qcm') continue;
        const wrong = ex.options!.filter(option => !option.isCorrect).map(option => option.textAr);
        for (const text of wrong) {
          // A full-sentence answer must not be paired with a bare number or another question's sentence.
          if (/\s/.test(ex.solutionAr) && /[^\d\s<>+−=]/.test(ex.solutionAr)) {
            expect(/^\d+$/.test(text), `${ex.id}: ${text}`).toBe(false);
            expect(solutions.filter(solution => solution !== ex.solutionAr && /\s/.test(solution)).includes(text) && lesson.id !== 'math-1ap-t2-compare-quantities', `${ex.id}: ${text}`).toBe(false);
          }
          if (/^\d+$/.test(text)) expect(Number(text), `${ex.id}: ${text}`).toBeLessThan(100);
        }
      }
    }
  });
});
