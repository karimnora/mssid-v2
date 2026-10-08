import { describe, expect, it } from 'vitest';
import { ALL_SHORT_SURAHS, PRESCHOOL_SURAH_ORDER, preschoolSurahs } from './quranShortSurahsCatalog';

describe('quran short-surah catalog', () => {
  it('keeps one row per mushaf number', () => {
    const numbers = ALL_SHORT_SURAHS.map((s) => s.number);
    expect(new Set(numbers).size).toBe(numbers.length);
    expect(numbers.every((n) => n > 0)).toBe(true);
  });

  it('lists the seven preschool surahs in learning order', () => {
    expect(preschoolSurahs().map((s) => s.id)).toEqual([...PRESCHOOL_SURAH_ORDER]);
    expect(preschoolSurahs().every((s) => s.bands.includes('preschool'))).toBe(true);
    expect(preschoolSurahs().every((s) => s.verses.length >= 3)).toBe(true);
  });
});
