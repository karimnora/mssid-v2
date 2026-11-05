/** 2AP–3AP: five daily prayers, times, and rakʿah counts from the official sequence. */

export interface SalatPrayer {
  id: 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';
  nameAr: string;
  timeAr: string;
  rakahs: number;
  sky: string;
  icon: string;
}

export const SALAT_PRAYERS: SalatPrayer[] = [
  { id: 'fajr', nameAr: 'صَلَاةُ الفَجْرِ', timeAr: 'قَبْلَ شُرُوقِ الشَّمْسِ', rakahs: 2, sky: 'linear-gradient(180deg,#1E3A5F 0%,#F59E0B 70%,#FFF8E7 100%)', icon: '🌅' },
  { id: 'dhuhr', nameAr: 'صَلَاةُ الظُّهْرِ', timeAr: 'بَعْدَ زَوَالِ الشَّمْسِ', rakahs: 4, sky: 'linear-gradient(180deg,#38BDF8 0%,#FDE68A 60%,#FFFBF0 100%)', icon: '☀️' },
  { id: 'asr', nameAr: 'صَلَاةُ العَصْرِ', timeAr: 'فِي العَصْرِ قَبْلَ الغُرُوبِ', rakahs: 4, sky: 'linear-gradient(180deg,#FB923C 0%,#FDE68A 55%,#FFF8E7 100%)', icon: '🌇' },
  { id: 'maghrib', nameAr: 'صَلَاةُ المَغْرِبِ', timeAr: 'بَعْدَ غُرُوبِ الشَّمْسِ مُبَاشَرَةً', rakahs: 3, sky: 'linear-gradient(180deg,#7C2D12 0%,#C2410C 40%,#F59E0B 100%)', icon: '🌆' },
  { id: 'isha', nameAr: 'صَلَاةُ العِشَاءِ', timeAr: 'بَعْدَ دُخُولِ اللَّيْلِ', rakahs: 4, sky: 'linear-gradient(180deg,#0F172A 0%,#1E3A5F 70%,#334155 100%)', icon: '🌙' },
];

export interface SalatPosture {
  id: string;
  titleAr: string;
  descAr: string;
}

/** One rakʿah, simplified for 2AP (pillars a child can mime). */
export const SALAT_POSTURES: SalatPosture[] = [
  { id: 'takbir', titleAr: 'تَكْبِيرَةُ الإِحْرَامِ', descAr: 'أَقِفُ مُسْتَقْبِلَ القِبْلَةِ وَأَقُولُ «اللهُ أَكْبَرُ».' },
  { id: 'qiyam', titleAr: 'القِيَامُ وَالفَاتِحَةُ', descAr: 'أَقْرَأُ سُورَةَ الفَاتِحَةِ وَأَنَا وَاقِفٌ.' },
  { id: 'ruku', titleAr: 'الرُّكُوعُ', descAr: 'أَحْنِي ظَهْرِي وَأَضَعُ يَدَيَّ عَلَى رُكْبَتَيَّ.' },
  { id: 'raise', titleAr: 'الرَّفْعُ مِنَ الرُّكُوعِ', descAr: 'أَعُودُ وَاقِفاً وَأَقُولُ «سَمِعَ اللهُ لِمَنْ حَمِدَهُ».' },
  { id: 'sujud', titleAr: 'السُّجُودُ', descAr: 'أَضَعُ جَبْهَتِي وَأَنْفِي وَكَفَّيَّ عَلَى الأَرْضِ.' },
  { id: 'jalsa', titleAr: 'الجُلُوسُ بَيْنَ السَّجْدَتَيْنِ', descAr: 'أَجْلِسُ قَلِيلاً بَيْنَ السَّجْدَتَيْنِ.' },
  { id: 'sujud2', titleAr: 'السَّجْدَةُ الثَّانِيَةُ', descAr: 'أَسْجُدُ مَرَّةً ثَانِيَةً لِتَتِمَّ الرَّكْعَةُ.' },
];

export function rakahsFor(prayerId: SalatPrayer['id']): number {
  return SALAT_PRAYERS.find((prayer) => prayer.id === prayerId)?.rakahs ?? 0;
}

export function isSalatPostureCorrect(doneCount: number, postureId: string): boolean {
  return SALAT_POSTURES[doneCount]?.id === postureId;
}

export const SALAT_QUIZ = [
  {
    "id": "q1",
    "questionAr": "كَمْ رَكْعَةً فِي صَلَاةِ المَغْرِبِ؟",
    "optionsAr": [
      "ثَلَاثُ رَكَعَاتٍ",
      "رَكْعَتَانِ",
      "أَرْبَعُ رَكَعَاتٍ"
    ],
    "correctAr": "ثَلَاثُ رَكَعَاتٍ",
    "explanationAr": "صَلَاةُ المَغْرِبِ ثَلَاثُ رَكَعَاتٍ."
  },
  {
    "id": "q2",
    "questionAr": "أَيُّ صَلَاةٍ تُؤَدَّى قَبْلَ شُرُوقِ الشَّمْسِ؟",
    "optionsAr": [
      "الفَجْرُ",
      "الظُّهْرُ",
      "العِشَاءُ"
    ],
    "correctAr": "الفَجْرُ",
    "explanationAr": "وَقْتُ الفَجْرِ قَبْلَ شُرُوقِ الشَّمْسِ."
  },
  {
    "id": "q3",
    "questionAr": "كَمْ رَكْعَةً فِي صَلَاةِ الفَجْرِ؟",
    "optionsAr": [
      "رَكْعَتَانِ",
      "ثَلَاثُ رَكَعَاتٍ",
      "أَرْبَعُ رَكَعَاتٍ"
    ],
    "correctAr": "رَكْعَتَانِ",
    "explanationAr": "صَلَاةُ الفَجْرِ رَكْعَتَانِ."
  },
  {
    "id": "q4",
    "questionAr": "كَمْ عَدَدُ الصَّلَوَاتِ المَفْرُوضَةِ فِي اليَوْمِ؟",
    "optionsAr": [
      "ثَلَاثٌ",
      "خَمْسٌ",
      "سَبْعٌ"
    ],
    "correctAr": "خَمْسٌ",
    "explanationAr": "الفَجْرُ، الظُّهْرُ، العَصْرُ، المَغْرِبُ، العِشَاءُ: خَمْسُ صَلَوَاتٍ."
  },
  {
    "id": "q5",
    "questionAr": "كَمْ رَكْعَةً فِي صَلَاةِ الظُّهْرِ؟",
    "optionsAr": [
      "رَكْعَتَانِ",
      "ثَلَاثُ رَكَعَاتٍ",
      "أَرْبَعُ رَكَعَاتٍ"
    ],
    "correctAr": "أَرْبَعُ رَكَعَاتٍ",
    "explanationAr": "صَلَاةُ الظُّهْرِ أَرْبَعُ رَكَعَاتٍ."
  },
  {
    "id": "q6",
    "questionAr": "كَمْ رَكْعَةً فِي صَلَاةِ العَصْرِ؟",
    "optionsAr": [
      "أَرْبَعُ رَكَعَاتٍ",
      "رَكْعَتَانِ",
      "ثَلَاثُ رَكَعَاتٍ"
    ],
    "correctAr": "أَرْبَعُ رَكَعَاتٍ",
    "explanationAr": "صَلَاةُ العَصْرِ أَرْبَعُ رَكَعَاتٍ وَوَقْتُهَا قَبْلَ الغُرُوبِ."
  },
  {
    "id": "q7",
    "questionAr": "كَمْ رَكْعَةً فِي صَلَاةِ العِشَاءِ؟",
    "optionsAr": [
      "ثَلَاثُ رَكَعَاتٍ",
      "أَرْبَعُ رَكَعَاتٍ",
      "رَكْعَتَانِ"
    ],
    "correctAr": "أَرْبَعُ رَكَعَاتٍ",
    "explanationAr": "صَلَاةُ العِشَاءِ أَرْبَعُ رَكَعَاتٍ بَعْدَ دُخُولِ اللَّيْلِ."
  },
  {
    "id": "q8",
    "questionAr": "مَاذَا نَقْرَأُ أَثْنَاءَ القِيَامِ؟",
    "optionsAr": [
      "سُورَةَ الفَاتِحَةِ",
      "جَدْوَلَ الضَّرْبِ",
      "أَسْمَاءَ الأَلْوَانِ"
    ],
    "correctAr": "سُورَةَ الفَاتِحَةِ",
    "explanationAr": "أَقْرَأُ سُورَةَ الفَاتِحَةِ وَأَنَا وَاقِفٌ."
  },
  {
    "id": "q9",
    "questionAr": "أَيْنَ نَضَعُ اليَدَيْنِ فِي الرُّكُوعِ؟",
    "optionsAr": [
      "عَلَى الرَّأْسِ",
      "عَلَى الرُّكْبَتَيْنِ",
      "خَلْفَ الظَّهْرِ"
    ],
    "correctAr": "عَلَى الرُّكْبَتَيْنِ",
    "explanationAr": "أَحْنِي ظَهْرِي وَأَضَعُ يَدَيَّ عَلَى رُكْبَتَيَّ."
  },
  {
    "id": "q10",
    "questionAr": "مَاذَا يَلْمَسُ الأَرْضَ فِي السُّجُودِ كَمَا تَعَلَّمْنَا؟",
    "optionsAr": [
      "الجَبْهَةُ وَالأَنْفُ وَالكَفَّانِ",
      "الشَّعْرُ فَقَطْ",
      "الكَتِفَانِ"
    ],
    "correctAr": "الجَبْهَةُ وَالأَنْفُ وَالكَفَّانِ",
    "explanationAr": "أَضَعُ جَبْهَتِي وَأَنْفِي وَكَفَّيَّ عَلَى الأَرْضِ."
  },
  {
    "id": "q11",
    "questionAr": "مَاذَا نَفْعَلُ بَيْنَ السَّجْدَتَيْنِ؟",
    "optionsAr": [
      "نَرْكُضُ",
      "نَجْلِسُ قَلِيلاً",
      "نَصْفِقُ"
    ],
    "correctAr": "نَجْلِسُ قَلِيلاً",
    "explanationAr": "نَجْلِسُ قَلِيلاً بَيْنَ السَّجْدَتَيْنِ، ثُمَّ نَسْجُدُ مَرَّةً ثَانِيَةً."
  },
  {
    "id": "q12",
    "questionAr": "مَاذَا يَأْتِي بَعْدَ الجُلُوسِ بَيْنَ السَّجْدَتَيْنِ؟",
    "optionsAr": [
      "تَكْبِيرَةُ الإِحْرَامِ",
      "السَّجْدَةُ الثَّانِيَةُ",
      "الرُّكُوعُ"
    ],
    "correctAr": "السَّجْدَةُ الثَّانِيَةُ",
    "explanationAr": "أَسْجُدُ مَرَّةً ثَانِيَةً لِتَتِمَّ الرَّكْعَةُ."
  }
] as const;

/** One canonical phrase shared by playback and offline voice generation. */
export function salatPrayerNarration(prayer: SalatPrayer): string {
  return `${prayer.nameAr}. ${prayer.timeAr}. عَدَدُ الرَّكَعَاتِ: ${prayer.rakahs}.`;
}
