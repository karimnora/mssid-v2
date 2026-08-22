import { describe, expect, it } from 'vitest';
import { averageSubjectsForGrade, computeTermBulletin, subjectTermAverage } from './primaryAverage';

describe('subjectTermAverage (DzExams EP formula)', () => {
  it('averages évaluation and composition when both are filled', () => {
    expect(subjectTermAverage({ evalNote: 8, compositionNote: 6 })).toBe(7);
  });

  it('uses the only filled note when the other is missing', () => {
    expect(subjectTermAverage({ compositionNote: 9 })).toBe(9);
    expect(subjectTermAverage({ evalNote: 5 })).toBe(5);
    expect(subjectTermAverage({})).toBeNull();
  });

  it('rejects notes outside 0–10', () => {
    expect(subjectTermAverage({ evalNote: 11, compositionNote: 8 })).toBe(8);
    expect(subjectTermAverage({ evalNote: -1 })).toBeNull();
  });
});

describe('averageSubjectsForGrade', () => {
  it('follows the official programme: no French/English before 3AP', () => {
    expect(averageSubjectsForGrade('1AP')).toEqual(['arabic', 'math', 'science', 'islamic', 'civics']);
    expect(averageSubjectsForGrade('2AP')).not.toContain('french');
    expect(averageSubjectsForGrade('3AP')).toEqual(
      expect.arrayContaining(['french', 'english', 'history_geo'])
    );
  });

  it('adds Tamazight only from 3AP when requested', () => {
    expect(averageSubjectsForGrade('5AP', { includeTamazight: true })).toContain('tamazight');
    expect(averageSubjectsForGrade('1AP', { includeTamazight: true })).not.toContain('tamazight');
  });
});

describe('computeTermBulletin', () => {
  it('weights every taught subject with coefficient 1', () => {
    const result = computeTermBulletin('2AP', {
      arabic: { evalNote: 8, compositionNote: 8 },
      math: { compositionNote: 6 },
    });
    expect(result.coefficientSum).toBe(2);
    expect(result.generalAverage).toBe(7);
  });
});
