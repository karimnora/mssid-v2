import { PreschoolModule } from './types';
import { preschoolSurahs } from '../quranShortSurahsCatalog';

const PROMPTS: Record<string, { ar: string; fr: string; en: string; titleFr: string; titleEn: string }> = {
  fatiha: {
    titleFr: 'Al-Fatiha',
    titleEn: 'Al-Fatiha',
    ar: 'اِسْمَعْ سُورَةَ الفَاتِحَةِ، ثُمَّ كَرِّرْ مَعَ الشَّيْخِ!',
    fr: 'Écoute Al-Fatiha, puis répète avec le cheikh !',
    en: 'Listen to Al-Fatiha, then repeat with the reciter!',
  },
  ikhlas: {
    titleFr: 'Al-Ikhlas',
    titleEn: 'Al-Ikhlas',
    ar: 'اِسْمَعْ سُورَةَ الإِخْلَاصِ. اللَّهُ وَاحِدٌ!',
    fr: 'Écoute Al-Ikhlas. Allah est Un !',
    en: 'Listen to Al-Ikhlas. Allah is One!',
  },
  falaq: {
    titleFr: 'Al-Falaq',
    titleEn: 'Al-Falaq',
    ar: 'اِسْمَعْ سُورَةَ الفَلَقِ. نَطْلُبُ حِمَايَةَ اللَّهِ.',
    fr: 'Écoute Al-Falaq. On demande la protection d’Allah.',
    en: 'Listen to Al-Falaq. We ask Allah for protection.',
  },
  nas: {
    titleFr: 'An-Nas',
    titleEn: 'An-Nas',
    ar: 'اِسْمَعْ سُورَةَ النَّاسِ. رَبُّ النَّاسِ يَحْمِينَا.',
    fr: 'Écoute An-Nas. Le Seigneur des gens nous protège.',
    en: 'Listen to An-Nas. The Lord of people protects us.',
  },
  kawthar: {
    titleFr: 'Al-Kawthar',
    titleEn: 'Al-Kawthar',
    ar: 'اِسْمَعْ سُورَةَ الكَوْثَرِ. نِعَمُ اللَّهِ كَثِيرَةٌ!',
    fr: 'Écoute Al-Kawthar. Les bienfaits d’Allah sont nombreux !',
    en: 'Listen to Al-Kawthar. Allah’s gifts are many!',
  },
  nasr: {
    titleFr: 'An-Nasr',
    titleEn: 'An-Nasr',
    ar: 'اِسْمَعْ سُورَةَ النَّصْرِ مَعَ دِيدُو. نُكَرِّرُ آيَةً آيَةً!',
    fr: 'Écoute An-Nasr avec Didou. On répète verset par verset !',
    en: 'Listen to An-Nasr with Didou. We repeat verse by verse!',
  },
  asr: {
    titleFr: 'Al-Asr',
    titleEn: 'Al-Asr',
    ar: 'اِسْمَعْ سُورَةَ العَصْرِ. الوَقْتُ ثَمِينٌ!',
    fr: 'Écoute Al-Asr. Le temps est précieux !',
    en: 'Listen to Al-Asr. Time is precious!',
  },
};

const SUCCESS = {
  ar: 'أَحْسَنْت! نَجْمَةٌ لَكَ!',
  fr: 'Bravo ! Une étoile pour toi !',
  en: 'Well done! A star for you!',
};

export const SHORT_SURAHS_MODULE: PreschoolModule = {
  id: 'preschool-short-surahs',
  domain: 'values',
  icon: '📖',
  totalSteps: 7,
  titleI18n: {
    ar: 'سُوَرِي الصَّغِيرَةُ',
    fr: 'Mes petites sourates',
    en: 'My short surahs',
  },
  activities: preschoolSurahs().map((surah, index) => {
    const copy = PROMPTS[surah.id] ?? PROMPTS.fatiha;
    return {
      id: `surah-${surah.id}`,
      domain: 'values' as const,
      targetValue: surah.id,
      stepNumber: index + 1,
      interactionType: 'quran_listen' as const,
      i18n: {
        ar: {
          title: surah.nameAr,
          promptAudio: copy.ar,
          promptText: 'يستمع الطفل للتلاوة المهنية (ورش) ويردد. الميكروفون اختياري.',
          successAudio: SUCCESS.ar,
        },
        fr: {
          title: copy.titleFr,
          promptAudio: copy.fr,
          promptText: 'L’enfant écoute une récitation Warsh professionnelle et répète. Le micro est optionnel.',
          successAudio: SUCCESS.fr,
        },
        en: {
          title: copy.titleEn,
          promptAudio: copy.en,
          promptText: 'The child listens to professional Warsh recitation and repeats. The mic is optional.',
          successAudio: SUCCESS.en,
        },
      },
      visualAssets: {
        mainSvgOrImage: surah.emoji,
        quranSurahAr: surah.nameAr,
      },
    };
  }),
};
