import type { ParentNotebookRow } from '../../utils/competenceProgress';

export interface CemCheck {
  promptAr: string;
  choices: string[];
  correctIndex: number;
  competenceId?: string;
}

export interface CemPaperExercise {
  titleAr: string;
  points: number;
  contentAr: string;
  solutionAr: string;
  operationsAr?: string;
  check: CemCheck;
}

export interface CemPaper {
  id: string;
  subjectAr: string;
  durationMinutes: number;
  totalPoints: number;
  competenceIds: string[];
  exercises: CemPaperExercise[];
  problem: CemPaperExercise;
}

/** New 5AP→CEM papers — not the already shipped évaluation des acquis. */
export const CEM_PAPERS: CemPaper[] = [
  {
    id: 'cem-math-2027',
    subjectAr: 'الرِّيَاضِيَّاتُ — نُسْخَةُ التَّحْضِيرِ لِلمُتَوَسِّطَةِ',
    durationMinutes: 90,
    totalPoints: 10,
    competenceIds: ['math-5ap-c-decimals', 'math-5ap-c-operations', 'math-5ap-c-areas', 'math-5ap-c-proportion'],
    exercises: [
      {
        titleAr: 'التَّمْرِينُ 1 — الأَعْدَادُ العَشْرِيَّةُ (1.5 ن)',
        points: 1.5,
        contentAr:
          'أ) أَنْجِزْ مَعَ مُحَاذَاةِ الفَاصِلَةِ: 27.8 + 6.45 − 9.3\nب) رَتِّبْ تَنَازُلِيّاً: 5.09 — 5.9 — 5.19\nجـ) اكْتُبِ المُسَاوَاةَ الإِقْلِيدِيَّةَ لِـ 625 ÷ 8.',
        solutionAr:
          'أ) 27.80 + 6.45 = 34.25 ثُمَّ 34.25 − 9.30 = 24.95.\nب) 5.9 > 5.19 > 5.09.\nجـ) 625 = (8 × 78) + 1 لِأَنَّ 8 × 78 = 624 وَالبَاقِي 1 < 8.',
        operationsAr:
          'أ)  27.80\n   +  6.45\n   -------\n    34.25\n\n    34.25\n   −  9.30\n   -------\n    24.95\n\nب) 5.90\n   5.19\n   5.09\n\nجـ)    78\n     ×  8\n    ----\n     624\n\n     624\n    +   1\n    ----\n     625',
        check: {
          promptAr: '27.8 + 6.45 − 9.3 = ؟',
          choices: ['24.95', '25.95', '23.95'],
          correctIndex: 0,
          competenceId: 'math-5ap-c-decimals',
        },
      },
      {
        titleAr: 'التَّمْرِينُ 2 — النِّسْبَةُ المِئَوِيَّةُ (1.5 ن)',
        points: 1.5,
        contentAr:
          'ثَمَنُ مِحْفَظَةِ المُتَوَسِّطَةِ 3 200 دج عَلَيْهَا تَخْفِيضٌ 25%.\n1) احْسُبْ مَبْلَغَ التَّخْفِيضِ.\n2) مَا الثَّمَنُ بَعْدَ التَّخْفِيضِ؟\n3) حَوِّلْ 1.8 kg إِلَى g.',
        solutionAr:
          '1) التَّخْفِيضُ = (3 200 × 25) ÷ 100 = 800 دج.\n2) الثَّمَنُ = 3 200 − 800 = 2 400 دج.\n3) 1.8 kg = 1 800 g.',
        operationsAr:
          '1)  3200\n   ×   25\n   ------\n   80000\n\n   80000 ÷ 100 = 800\n\n2)  3200\n   −  800\n   ------\n    2400\n\n3) 1.8 × 1000 = 1800 g',
        check: {
          promptAr: 'مَا الثَّمَنُ بَعْدَ تَخْفِيضِ 25% عَلَى 3 200 دج؟',
          choices: ['2 400 دج', '800 دج', '3 200 دج'],
          correctIndex: 0,
          competenceId: 'math-5ap-c-proportion',
        },
      },
      {
        titleAr: 'التَّمْرِينُ 3 — المُحِيطُ وَالمِسَاحَةُ (1.5 ن)',
        points: 1.5,
        contentAr:
          'سَاحَةُ المُتَوَسِّطَةِ مُسْتَطِيلَةٌ طُولُهَا 36 m وَعَرْضُهَا 18 m.\n1) احْسُبِ المُحِيطَ وَالمِسَاحَةَ.\n2) حَوِّلِ المِسَاحَةَ إِلَى cm².',
        solutionAr:
          '1) المُحِيطُ = (36 + 18) × 2 = 108 m. المِسَاحَةُ = 36 × 18 = 648 m².\n2) 648 m² = 6 480 000 cm² لِأَنَّ 1 m² = 10 000 cm².',
        operationsAr:
          '1)  36\n   + 18\n   ----\n    54\n\n    54\n   ×  2\n   ----\n   108\n\n    36\n   × 18\n   ----\n   648\n\n2) 648 × 10 000 = 6 480 000',
        check: {
          promptAr: 'مَا مُحِيطُ مُسْتَطِيلٍ 36 m × 18 m؟',
          choices: ['108 m', '54 m', '648 m'],
          correctIndex: 0,
          competenceId: 'math-5ap-c-areas',
        },
      },
      {
        titleAr: 'التَّمْرِينُ 4 — السُّرْعَةُ (1.5 ن)',
        points: 1.5,
        contentAr:
          'حَافِلَةُ الثَّانَوِيَّةِ قَطَعَتْ 90 km فِي سَاعَتَيْنِ.\n1) مَا السُّرْعَةُ المُتَوَسِّطَةُ؟\n2) بِنَفْسِ السُّرْعَةِ، كَمْ تَسْتَغْرِقُ 135 km؟',
        solutionAr:
          '1) السُّرْعَةُ = 90 ÷ 2 = 45 km/h.\n2) المُدَّةُ = 135 ÷ 45 = 3 سَاعَاتٍ.',
        operationsAr:
          '1) 90 ÷ 2 = 45\n2) 135 ÷ 45 = 3',
        check: {
          promptAr: '90 km فِي سَاعَتَيْنِ. مَا السُّرْعَةُ المُتَوَسِّطَةُ؟',
          choices: ['45 km/h', '90 km/h', '135 km/h'],
          correctIndex: 0,
          competenceId: 'math-5ap-c-proportion',
        },
      },
    ],
    problem: {
      titleAr: 'وَضْعِيَّةٌ إِدْمَاجِيَّةٌ — تَسْجِيلُ القِسْمِ (4 ن)',
      points: 4,
      contentAr:
        'أَرَادَتِ المُتَوَسِّطَةُ تَبْلِيطَ مَمَرٍّ مُسْتَطِيلٍ طُولُهُ 22 m وَعَرْضُهُ 3.5 m. ثَمَنُ المِتْرِ المُرَبَّعِ 1 200 دج، وَعَلَيْهِ تَخْفِيضٌ 10%.\n1) احْسُبْ مِسَاحَةَ المَمَرِّ.\n2) مَا ثَمَنُ المِتْرِ المُرَبَّعِ بَعْدَ التَّخْفِيضِ؟\n3) احْسُبِ التَّكْلِفَةَ الإِجْمَالِيَّةَ.\n4) إِذَا دَفَعَتِ الإِدَارَةُ 90 000 دج، كَمْ يَبْقَى؟',
      solutionAr:
        '1) المِسَاحَةُ = 22 × 3.5 = 77 m².\n2) التَّخْفِيضُ = 120 دج. الثَّمَنُ = 1 080 دج.\n3) التَّكْلِفَةُ = 77 × 1 080 = 83 160 دج.\n4) البَاقِي = 90 000 − 83 160 = 6 840 دج.',
      operationsAr:
        '1)  22\n   × 3.5\n   -----\n    77\n\n2)  1200\n   ×  10%\n   = 120\n\n   1200 − 120 = 1080\n\n3)  1080\n   ×   77\n   ------\n   83160\n\n4)  90000\n   −83160\n   ------\n    6840',
      check: {
        promptAr: 'مَا مِسَاحَةُ مَمَرٍّ 22 m × 3.5 m؟',
        choices: ['77 m²', '25.5 m²', '80 m²'],
        correctIndex: 0,
        competenceId: 'math-5ap-c-areas',
      },
    },
  },
  {
    id: 'cem-arabic-2027',
    subjectAr: 'اللُّغَةُ العَرَبِيَّةُ — نُسْخَةُ التَّحْضِيرِ لِلمُتَوَسِّطَةِ',
    durationMinutes: 90,
    totalPoints: 10,
    competenceIds: ['ar-5ap-c-irab', 'ar-5ap-c-spelling', 'ar-5ap-c-writing'],
    exercises: [
      {
        titleAr: 'الكَفَاءَةُ 1 — فَهْمُ المَكْتُوبِ (2 ن)',
        points: 2,
        check: {
          promptAr: 'مَا الحَالُ فِي الجُمْلَةِ الأُولَى؟',
          choices: ['مُبْتَسِماً', 'هَادِئَةً', 'يُوسُفُ'],
          correctIndex: 0,
          competenceId: 'ar-5ap-c-irab',
        },
        contentAr:
          'اقْرَأْ ثُمَّ أَجِبْ:\n« فِي صَبَاحِ أَوَّلِ يَوْمٍ بِالمُتَوَسِّطَةِ، دَخَلَ يُوسُفُ السَّاحَةَ مُبْتَسِماً. حَمَلَ أَخُوهُ المِحْفَظَةَ الثَّقِيلَةَ، وَسَارَتِ الأُمُّ إِلَى البَابِ هَادِئَةً. قَالَ النَّاظِرُ: أَهْلاً بِتَلَامِيذِ السَّنَةِ الأُولَى. »\n1) مَا الفِكْرَةُ العَامَّةُ؟\n2) اسْتَخْرِجِ الحَالَ مِنَ الجُمْلَةِ الأُولَى.\n3) أَعْرِبْ «أَخُوهُ».',
        solutionAr:
          '1) أَوَّلُ يَوْمٍ لِيُوسُفَ فِي المُتَوَسِّطَةِ مَعَ أُسْرَتِهِ.\n2) الحَالُ: مُبْتَسِماً، مَنْصُوبٌ بِالفَتْحَةِ.\n3) أَخُوهُ: فَاعِلٌ مَرْفُوعٌ بِالوَاوِ لِأَنَّهُ مِنَ الأَسْمَاءِ الخَمْسَةِ، وَهُوَ مُضَافٌ، وَالهَاءُ ضَمِيرٌ مُتَّصِلٌ فِي مَحَلِّ جَرٍّ مُضَافٌ إِلَيْهِ.',
      },
      {
        titleAr: 'الكَفَاءَةُ 2 — الإِمْلَاءُ (2 ن)',
        points: 2,
        check: {
          promptAr: 'جَمْعُ «تِلْمِيذ» جَمْعَ مُذَكَّرٍ سَالِماً فِي الرَّفْعِ؟',
          choices: ['تِلْمِيذُونَ', 'تَلَامِيذُ', 'تِلْمِيذَيْنِ'],
          correctIndex: 0,
          competenceId: 'ar-5ap-c-spelling',
        },
        contentAr:
          '1) عَلِّلْ كِتَابَةَ الهَمْزَةِ فِي «مَسْؤُول».\n2) لِمَاذَا كَتَبْنَا «سَاحَة» بِتَاءٍ مَرْبُوطَةٍ؟\n3) اكْتُبْ جَمْعَ «تِلْمِيذ» جَمْعَ مُذَكَّرٍ سَالِماً فِي حَالَةِ الرَّفْعِ.',
        solutionAr:
          '1) الهَمْزَةُ مَضْمُومَةٌ وَقَبْلَهَا سَاكِنٌ فَكُتِبَتْ عَلَى وَاوٍ.\n2) اسْمٌ مُفْرَدٌ مُؤَنَّثٌ.\n3) تِلْمِيذُونَ.',
      },
    ],
    problem: {
      titleAr: 'التَّعْبِيرُ الكِتَابِيُّ (6 ن) — 8 إِلَى 12 سَطْراً',
      points: 6,
      check: {
        promptAr: 'هَلْ كَتَبْتَ 8 أَسْطُرٍ عَلَى الأَقَلِّ بِعُنْوَانٍ؟',
        choices: ['نَعَمْ، كَتَبْتُ النَّصَّ', 'لَيْسَ بَعْدُ'],
        correctIndex: 0,
        competenceId: 'ar-5ap-c-writing',
      },
      contentAr:
        'اكْتُبْ نَصّاً (8–12 سَطْراً) تَصِفُ فِيهِ أَوَّلَ حِصَّةٍ فِي المُتَوَسِّطَةِ. اذْكُرِ المَكَانَ، شُعُوراً وَاحِداً، زَمِيلاً، وَعَهْداً تَعِدُ بِهِ نَفْسَكَ هَذِهِ السَّنَةَ. ضَعْ عُنْوَاناً.',
      solutionAr:
        'نَصٌّ مُتَمَاسِكٌ بِعُنْوَانٍ، فِيهِ وَصْفٌ وَشُعُورٌ وَعَهْدٌ، مِنْ 8 إِلَى 12 سَطْراً، بِجُمَلٍ تَامَّةٍ وَإِمْلَاءٍ سَلِيمٍ.',
    },
  },
  {
    id: 'cem-science-2027',
    subjectAr: 'التَّرْبِيَةُ العِلْمِيَّةُ — نُسْخَةُ التَّحْضِيرِ لِلمُتَوَسِّطَةِ',
    durationMinutes: 60,
    totalPoints: 10,
    competenceIds: [],
    exercises: [
      {
        titleAr: 'التَّمْرِينُ 1 — التَّنَفُّسُ (3 ن)',
        points: 3,
        check: {
          promptAr: 'مِنْ أَيْنَ يَدْخُلُ الهَوَاءُ إِلَى الرِّئَتَيْنِ؟',
          choices: ['الأَنْفُ', 'الأُذُنُ', 'الجِلْدُ'],
          correctIndex: 0,
        },
        contentAr:
          '1) مَا العُضْوُ الَّذِي يَدْخُلُ مِنْهُ الهَوَاءُ إِلَى الرِّئَتَيْنِ؟\n2) لِمَاذَا نَتَنَفَّسُ؟\n3) اُذْكُرْ خَطَراً يُضِرُّ بِالجِهَازِ التَّنَفُّسِيِّ.',
        solutionAr:
          '1) الأَنْفُ (ثُمَّ القَصَبَةُ الهَوَائِيَّةُ).\n2) لِإِدْخَالِ الأُكْسِجِينِ وَإِخْرَاجِ ثَانِي أُكْسِيدِ الكَرْبُونِ.\n3) التَّدْخِينُ أَوْ تَلَوُّثُ الهَوَاءِ.',
      },
      {
        titleAr: 'التَّمْرِينُ 2 — أَخْطَارُ الكَهْرَبَاءِ (3 ن)',
        points: 3,
        check: {
          promptAr: 'مَاذَا نَفْعَلُ قَبْلَ تَغْيِيرِ مِصْبَاحٍ؟',
          choices: ['نَقْطَعُ التَّيَّارَ', 'نَلْمَسُ السِّلْكَ', 'نُبَلِّلُ اليَدَ'],
          correctIndex: 0,
        },
        contentAr:
          '1) لِمَاذَا لَا نَلْمَسُ وِصْلَةً كَهْرَبَائِيَّةً بِيَدٍ رَطْبَةٍ؟\n2) مَاذَا نَفْعَلُ قَبْلَ تَغْيِيرِ مِصْبَاحٍ؟\n3) أَيْنَ يَكُونُ الخَطَرُ أَكْبَرَ: فِي الحَمَّامِ أَمْ فِي غُرْفَةٍ جَافَّةٍ؟ لِمَاذَا؟',
        solutionAr:
          '1) المَاءُ مُوَصِّلٌ فَيَزِيدُ خَطَرَ الصَّعْقِ.\n2) نَقْطَعُ التَّيَّارَ مِنَ القَاطِعِ.\n3) فِي الحَمَّامِ، لِوُجُودِ المَاءِ.',
      },
    ],
    problem: {
      titleAr: 'وَضْعِيَّةٌ — مَخْبَرُ المُتَوَسِّطَةِ (4 ن)',
      points: 4,
      check: {
        promptAr: 'لِمَاذَا يَزِيدُ عَدَدُ الأَنْفَاسِ بَعْدَ الجَرْيِ؟',
        choices: ['العَضَلاَتُ تَحْتَاجُ أُكْسِجِيناً أَكْثَرَ', 'القَلْبُ يَتَوَقَّفُ', 'الهَوَاءُ يَنْقُصُ فِي السَّاحَةِ'],
        correctIndex: 0,
      },
      contentAr:
        'فِي حِصَّةِ العُلُومِ طُلِبَ مِنَ الفَوْجِ تَجْرِبَةٌ بِدَارَةٍ كَهْرَبَائِيَّةٍ صَغِيرَةٍ، ثُمَّ قِيَاسُ عَدَدِ الأَنْفَاسِ بَعْدَ الجَرْيِ فِي السَّاحَةِ.\n1) اُذْكُرْ قَاعِدَةَ أَمَانٍ وَاحِدَةً قَبْلَ غَلْقِ الدَّارَةِ.\n2) لِمَاذَا يَزِيدُ عَدَدُ الأَنْفَاسِ بَعْدَ الجَرْيِ؟\n3) اقْتَرِحْ عُنْوَاناً لِلتَّقْرِيرِ.',
      solutionAr:
        '1) قَطْعُ التَّيَّارِ / عَدَمُ لَمْسِ الأَسْلَاكِ العَارِيَةِ / يَدَانِ جَافَّتَانِ.\n2) العَضَلَاتُ تَحْتَاجُ مَزِيداً مِنَ الأُكْسِجِينِ.\n3) مَثَلاً: «التَّنَفُّسُ وَالكَهْرَبَاءُ فِي مَخْبَرِ المُتَوَسِّطَةِ».',
    },
  },
];

export function cemErrorRows(rows: ParentNotebookRow[]): ParentNotebookRow[] {
  return rows.filter((row) => row.status === 'review' && (row.competenceId.startsWith('math-5ap') || row.competenceId.startsWith('ar-5ap')));
}

export function paperById(id: string): CemPaper | undefined {
  return CEM_PAPERS.find((paper) => paper.id === id);
}

const CEM_REWARD_KEY = 'mssid.cemRewarded';

export function loadCemRewarded(): string[] {
  if (typeof localStorage === 'undefined') return [];
  try {
    const raw = localStorage.getItem(CEM_REWARD_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string') : [];
  } catch {
    return [];
  }
}

/** Returns true only the first time this exercise is marked rewarded. */
export function markCemRewarded(key: string): boolean {
  const prev = loadCemRewarded();
  if (prev.includes(key)) return false;
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(CEM_REWARD_KEY, JSON.stringify([...prev, key]));
  }
  return true;
}
