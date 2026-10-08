/** Professional Warsh recitation (Algerian mushaf). Verse files from everyayah.com. */

export const QURAN_RECITER_AR = 'الشيخ ياسين الجزائري';
export const QURAN_RECITER_RIWAYAH_AR = 'رواية ورش عن نافع';

const PRIMARY_BASE = 'https://everyayah.com/data/warsh/warsh_yassin_al_jazaery_64kbps';
const FALLBACK_BASE = 'https://everyayah.com/data/warsh/warsh_ibrahim_aldosary_128kbps';

/** Exact `surahAr` labels used in 1AP–5AP shortSurahs explorers. */
export const SURAH_NUMBER_BY_AR: Record<string, number> = {
  'سُورَةُ الفَاتِحَةِ': 1,
  'سُورَةُ الأَعْلَى': 87,
  'سُورَةُ الغَاشِيَةِ': 88,
  'سُورَةُ الفَجْرِ': 89,
  'سُورَةُ البَلَدِ': 90,
  'سُورَةُ الشَّمْسِ': 91,
  'سُورَةُ اللَّيْلِ': 92,
  'سُورَةُ الضُّحَى': 93,
  'سُورَةُ الشَّرْحِ': 94,
  'سُورَةُ التِّينِ': 95,
  'سُورَةُ العَلَقِ': 96,
  'سُورَةُ القَدْرِ': 97,
  'سُورَةُ البَيِّنَةِ': 98,
  'سُورَةُ الزَّلْزَلَةِ': 99,
  'سُورَةُ العَادِيَاتِ': 100,
  'سُورَةُ القَارِعَةِ': 101,
  'سُورَةُ التَّكَاثُرِ': 102,
  'سُورَةُ العَصْرِ': 103,
  'سُورَةُ الهُمَزَةِ': 104,
  'سُورَةُ الفِيلِ': 105,
  'سُورَةُ قُرَيْشٍ': 106,
  'سُورَةُ المَاعُونِ': 107,
  'سُورَةُ الكَوْثَرِ': 108,
  'سُورَةُ النَّصْرِ': 110,
  'سُورَةُ المَسَدِ': 111,
  'سُورَةُ الإِخْلَاصِ': 112,
  'سُورَةُ الفَلَقِ': 113,
  'سُورَةُ النَّاسِ': 114,
};

function pad3(n: number): string {
  return String(n).padStart(3, '0');
}

export function ayahFileName(surahNumber: number, ayahNumber: number): string {
  return `${pad3(surahNumber)}${pad3(ayahNumber)}.mp3`;
}

export function primaryAyahUrl(surahNumber: number, ayahNumber: number): string {
  return `${PRIMARY_BASE}/${ayahFileName(surahNumber, ayahNumber)}`;
}

export function fallbackAyahUrl(surahNumber: number, ayahNumber: number): string {
  return `${FALLBACK_BASE}/${ayahFileName(surahNumber, ayahNumber)}`;
}

export function surahNumberFromName(surahAr: string): number | null {
  return SURAH_NUMBER_BY_AR[surahAr] ?? null;
}

/** Visual basmala line. Warsh verse 1 files already include the spoken basmala — do not prepend 001001. */
export const BASMALA_AR = 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ';
