import type { IslamicQuranVerseItem } from '../types';
import {
  SURAH_FALAQ,
  SURAH_FATIHA,
  SURAH_IKHLAS,
  SURAH_KAWTHAR,
  SURAH_MASAD,
  SURAH_NAS,
  SURAH_NASR,
} from './courses/1AP/shortSurahs';
import {
  SURAH_ASR,
  SURAH_FIL,
  SURAH_HUMAZAH,
  SURAH_MAUN,
  SURAH_QARIAH,
  SURAH_QURAISH,
  SURAH_TAKATHUR,
} from './courses/2AP/shortSurahs';
import { SURAH_ADIAT, SURAH_BAYYINA, SURAH_SHARH, SURAH_TIN } from './courses/3AP/shortSurahs';
import {
  SURAH_ALAQ,
  SURAH_BALAD,
  SURAH_DUHA,
  SURAH_GHASHIYA,
  SURAH_LAYL,
  SURAH_SHAMS,
} from './courses/4AP/shortSurahs';
import { SURAH_ALA, SURAH_FAJR, SURAH_QADR, SURAH_ZALZALA } from './courses/5AP/shortSurahs';
import { surahNumberFromName } from './quranRecitation';

export type SurahBand = 'preschool' | '1AP' | '2AP' | '3AP' | '4AP' | '5AP';

export interface CatalogSurah {
  id: string;
  nameAr: string;
  number: number;
  emoji: string;
  verses: IslamicQuranVerseItem[];
  bands: SurahBand[];
}

function entry(
  id: string,
  verses: IslamicQuranVerseItem[],
  emoji: string,
  bands: SurahBand[],
): CatalogSurah {
  const nameAr = verses[0]!.surahAr;
  return {
    id,
    nameAr,
    number: surahNumberFromName(nameAr) ?? 0,
    emoji,
    verses,
    bands,
  };
}

/** Every short surah shipped in explorers, one row per mushaf number. */
export const ALL_SHORT_SURAHS: CatalogSurah[] = [
  entry('fatiha', SURAH_FATIHA, '📖', ['preschool', '1AP']),
  entry('ala', SURAH_ALA, '⬆️', ['5AP']),
  entry('ghashiya', SURAH_GHASHIYA, '☁️', ['4AP']),
  entry('fajr', SURAH_FAJR, '🌄', ['5AP']),
  entry('balad', SURAH_BALAD, '🏙️', ['4AP']),
  entry('shams', SURAH_SHAMS, '☀️', ['4AP']),
  entry('layl', SURAH_LAYL, '🌙', ['4AP']),
  entry('duha', SURAH_DUHA, '🌤️', ['4AP']),
  entry('sharh', SURAH_SHARH, '💚', ['3AP']),
  entry('tin', SURAH_TIN, '🫒', ['3AP']),
  entry('alaq', SURAH_ALAQ, '✏️', ['4AP']),
  entry('qadr', SURAH_QADR, '✨', ['5AP']),
  entry('bayyina', SURAH_BAYYINA, '📜', ['3AP']),
  entry('zalzala', SURAH_ZALZALA, '🌍', ['5AP']),
  entry('adiat', SURAH_ADIAT, '🐎', ['3AP']),
  entry('qariah', SURAH_QARIAH, '⚡', ['2AP']),
  entry('takathur', SURAH_TAKATHUR, '📦', ['2AP']),
  entry('asr', SURAH_ASR, '⏳', ['preschool', '2AP']),
  entry('humazah', SURAH_HUMAZAH, '🙊', ['2AP']),
  entry('fil', SURAH_FIL, '🐘', ['2AP']),
  entry('quraish', SURAH_QURAISH, '🕋', ['2AP']),
  entry('maun', SURAH_MAUN, '🍞', ['2AP']),
  entry('kawthar', SURAH_KAWTHAR, '🤲', ['preschool', '1AP']),
  entry('nasr', SURAH_NASR, '🏳️', ['preschool', '1AP']),
  entry('masad', SURAH_MASAD, '🔥', ['1AP']),
  entry('ikhlas', SURAH_IKHLAS, '💚', ['preschool', '1AP']),
  entry('falaq', SURAH_FALAQ, '🌅', ['preschool', '1AP']),
  entry('nas', SURAH_NAS, '👥', ['preschool', '1AP']),
].sort((a, b) => a.number - b.number);

export const PRESCHOOL_SURAH_ORDER = ['fatiha', 'ikhlas', 'falaq', 'nas', 'kawthar', 'nasr', 'asr'] as const;

export function preschoolSurahs(): CatalogSurah[] {
  return PRESCHOOL_SURAH_ORDER.map((id) => ALL_SHORT_SURAHS.find((s) => s.id === id)!);
}

export function catalogSurahByName(nameAr: string): CatalogSurah | undefined {
  return ALL_SHORT_SURAHS.find((s) => s.nameAr === nameAr);
}
