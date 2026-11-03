export interface WorldCountry {
  id: string;
  nameAr: string;
  capitalAr: string;
  region: 'maghreb' | 'sahel' | 'mashriq';
  factAr: string;
}

export const WORLD_COUNTRIES: WorldCountry[] = [
  {
    id: 'dz',
    nameAr: 'الجَزَائِرُ',
    capitalAr: 'مَدِينَةُ الجَزَائِرِ',
    region: 'maghreb',
    factAr: 'بَلَدُنَا. العَلَمُ أَخْضَرُ وَأَبْيَضُ، وَفِي وَسَطِهِ هِلَالٌ وَنَجْمَةٌ حَمْرَاوَانِ.',
  },
  {
    id: 'tn',
    nameAr: 'تُونِسُ',
    capitalAr: 'تُونِسُ',
    region: 'maghreb',
    factAr: 'جَارَتُنَا الشَّرْقِيَّةُ عَلَى البَحْرِ الأَبْيَضِ المُتَوَسِّطِ.',
  },
  {
    id: 'ly',
    nameAr: 'لِيبِيَا',
    capitalAr: 'طَرَابُلُسُ',
    region: 'maghreb',
    factAr: 'جَارَةٌ شَرْقِيَّةٌ. عَلَمُهَا أَحْمَرُ وَأَسْوَدُ وَأَخْضَرُ.',
  },
  {
    id: 'ma',
    nameAr: 'المَغْرِبُ',
    capitalAr: 'الرِّبَاطُ',
    region: 'maghreb',
    factAr: 'جَارٌ غَرْبِيٌّ فِي اتِّحَادِ المَغْرِبِ العَرَبِيِّ. فِي عَلَمِهِ نَجْمَةٌ خَضْرَاءُ.',
  },
  {
    id: 'mr',
    nameAr: 'مُورِيتَانِيَا',
    capitalAr: 'نُوَاكْشُوطُ',
    region: 'maghreb',
    factAr: 'بَلَدٌ مَغَارِبِيٌّ عَلَى المُحِيطِ الأَطْلَسِيِّ.',
  },
  {
    id: 'eh',
    nameAr: 'الصَّحْرَاءُ الغَرْبِيَّةُ',
    capitalAr: 'العُيُونُ',
    region: 'maghreb',
    factAr: 'جَارَةٌ غَرْبِيَّةٌ. الجَزَائِرُ تَعْتَرِفُ بِهَا. عَلَمُهَا أَسْوَدُ وَأَبْيَضُ وَأَخْضَرُ، مَعَ مُثَلَّثٍ أَحْمَرَ وَهِلَالٍ وَنَجْمَةٍ.',
  },
  {
    id: 'ml',
    nameAr: 'مَالِي',
    capitalAr: 'بَامَاكُو',
    region: 'sahel',
    factAr: 'جَارٌ جَنُوبِيٌّ فِي الصَّحْرَاءِ وَالسَّاحِلِ.',
  },
  {
    id: 'ne',
    nameAr: 'النِّيجَرُ',
    capitalAr: 'نِيَامِي',
    region: 'sahel',
    factAr: 'جَارٌ جَنُوبِيٌّ شَرْقِيٌّ. عَاصِمَتُهُ نِيَامِي.',
  },
  {
    id: 'eg',
    nameAr: 'مِصْرُ',
    capitalAr: 'القَاهِرَةُ',
    region: 'mashriq',
    factAr: 'بَلَدٌ عَرَبِيٌّ عَلَى النِّيلِ. عَاصِمَتُهُ القَاهِرَةُ.',
  },
  {
    id: 'ps',
    nameAr: 'فِلَسْطِينُ',
    capitalAr: 'القُدْسُ',
    region: 'mashriq',
    factAr: 'عَلَمٌ أَسْوَدُ وَأَبْيَضُ وَأَخْضَرُ، مَعَ مُثَلَّثٍ أَحْمَرَ عِنْدَ السَّارِيَةِ.',
  },
  {
    id: 'sa',
    nameAr: 'السُّعُودِيَّةُ',
    capitalAr: 'الرِّيَاضُ',
    region: 'mashriq',
    factAr: 'فِيهَا الحَرَمَانِ الشَّرِيفَانِ. عَاصِمَتُهَا الرِّيَاضُ.',
  },
];

export const MAGHREB_LAYOUT: Array<string | null> = [
  null, 'tn', null,
  'ma', 'dz', 'ly',
  'eh', 'mr', null,
];

export function countryById(id: string): WorldCountry | undefined {
  return WORLD_COUNTRIES.find((country) => country.id === id);
}

export function maghrebIds(): string[] {
  return WORLD_COUNTRIES.filter((country) => country.region === 'maghreb').map((country) => country.id);
}

export function countriesByRegion(region: WorldCountry['region']): WorldCountry[] {
  return WORLD_COUNTRIES.filter((country) => country.region === region);
}

export const FLAG_QUIZ = [
  {
    id: 'q1',
    questionAr: 'مَا عَاصِمَةُ الجَزَائِرِ؟',
    optionsAr: ['مَدِينَةُ الجَزَائِرِ', 'وَهْرَانُ', 'قَسَنْطِينَةُ'],
    correctAr: 'مَدِينَةُ الجَزَائِرِ',
  },
  {
    id: 'q2',
    questionAr: 'أَيُّ بَلَدٍ عَاصِمَتُهُ تُونِسُ؟',
    optionsAr: ['تُونِسُ', 'لِيبِيَا', 'مَالِي'],
    correctAr: 'تُونِسُ',
  },
  {
    id: 'q3',
    questionAr: 'عَاصِمَةُ المَغْرِبِ هِيَ:',
    optionsAr: ['الرِّبَاطُ', 'الدَّارُ البَيْضَاءُ', 'نُوَاكْشُوطُ'],
    correctAr: 'الرِّبَاطُ',
  },
  {
    id: 'q4',
    questionAr: 'كَمْ دَوْلَةً تَحُدُّ الجَزَائِرَ بَرّاً؟',
    optionsAr: ['سَبْعُ دُوَلٍ', 'خَمْسُ دُوَلٍ', 'ثَلاَثُ دُوَلٍ'],
    correctAr: 'سَبْعُ دُوَلٍ',
  },
] as const;

/** « أين العلم؟ » round: the country to find and 4 flags to choose from (the right one included). */
export function flagRound(targetId: string, random: () => number = Math.random): { target: WorldCountry; options: WorldCountry[] } {
  const target = countryById(targetId) ?? WORLD_COUNTRIES[0];
  const others = shuffled(WORLD_COUNTRIES.filter((c) => c.id !== target.id), random).slice(0, 3);
  return { target, options: shuffled([target, ...others], random) };
}

/** Order in which the countries are asked: Algeria first, then the others shuffled. */
export function flagRoundOrder(random: () => number = Math.random): string[] {
  return ['dz', ...shuffled(WORLD_COUNTRIES.filter((c) => c.id !== 'dz'), random).map((c) => c.id)];
}

function shuffled<T>(list: T[], random: () => number): T[] {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
