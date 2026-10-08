import { describe, expect, it } from 'vitest';
import { SHORT_SURAH_COUNTS } from './courses/1AP/shortSurahs';
import { SURAH_2AP_COUNTS } from './courses/2AP/shortSurahs';
import { SURAH_3AP_COUNTS } from './courses/3AP/shortSurahs';
import { SURAH_4AP_COUNTS } from './courses/4AP/shortSurahs';
import { SURAH_5AP_COUNTS } from './courses/5AP/shortSurahs';
import {
  ayahFileName,
  fallbackAyahUrl,
  primaryAyahUrl,
  SURAH_NUMBER_BY_AR,
  surahNumberFromName,
} from './quranRecitation';

const ALL_NAMES = {
  ...SHORT_SURAH_COUNTS,
  ...SURAH_2AP_COUNTS,
  ...SURAH_3AP_COUNTS,
  ...SURAH_4AP_COUNTS,
  ...SURAH_5AP_COUNTS,
};

describe('quranRecitation Warsh URLs', () => {
  it('maps every explorer surah name to a mushaf number', () => {
    Object.keys(ALL_NAMES).forEach((name) => {
      expect(surahNumberFromName(name), name).toBeGreaterThan(0);
      expect(SURAH_NUMBER_BY_AR[name]).toBe(surahNumberFromName(name));
    });
  });

  it('builds verse-by-verse Warsh filenames SSSAAA.mp3', () => {
    expect(ayahFileName(93, 1)).toBe('093001.mp3');
    expect(ayahFileName(1, 7)).toBe('001007.mp3');
    expect(ayahFileName(114, 6)).toBe('114006.mp3');
  });

  it('points primary audio at Yassin Al-Jazaery Warsh', () => {
    expect(primaryAyahUrl(93, 1)).toBe(
      'https://everyayah.com/data/warsh/warsh_yassin_al_jazaery_64kbps/093001.mp3',
    );
  });

  it('points fallback audio at Ibrahim Al-Dosary Warsh', () => {
    expect(fallbackAyahUrl(1, 1)).toBe(
      'https://everyayah.com/data/warsh/warsh_ibrahim_aldosary_128kbps/001001.mp3',
    );
  });

});
