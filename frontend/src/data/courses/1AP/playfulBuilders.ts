import type {
  CourseLesson,
  EducationalGameItem,
  ProgressiveExercise,
  QuizQuestion,
} from '../../../types';

export const PLAY_L1 = '🟢 أَلْعَبُ';
export const PLAY_L2 = '🟡 أُحَاوِلُ';
export const PLAY_L3 = '🟣 أَرْبِطُ';

export function quizTap(
  id: string,
  questionAr: string,
  yes: string,
  no: string,
  why: string,
  no2?: string,
): QuizQuestion {
  const options = [
    { id: 'a', textAr: yes, isCorrect: true, explanationAr: why },
    { id: 'b', textAr: no, isCorrect: false },
  ];
  if (no2) options.push({ id: 'c', textAr: no2, isCorrect: false });
  return { id, questionAr, options };
}

export function gameTap(
  questionOrPromptAr: string,
  correctAnswerAr: string,
  wrong: string,
  explanationAr: string,
  wrong2?: string,
): EducationalGameItem {
  return {
    questionOrPromptAr,
    correctAnswerAr,
    optionsAr: wrong2 ? [correctAnswerAr, wrong, wrong2] : [correctAnswerAr, wrong],
    explanationAr,
  };
}

export function qcmTap(
  id: string,
  level: 1 | 2 | 3,
  problemAr: string,
  yes: string,
  no: string,
  why: string,
  hintAr?: string,
): ProgressiveExercise {
  return {
    id,
    level,
    levelLabelAr: level === 1 ? PLAY_L1 : level === 2 ? PLAY_L2 : PLAY_L3,
    type: 'qcm',
    problemAr,
    hintsAr: hintAr ? [hintAr] : [],
    options: [
      { id: 'a', textAr: yes, isCorrect: true },
      { id: 'b', textAr: no, isCorrect: false },
    ],
    solutionAr: yes,
    detailedCorrectionAr: why,
    xpReward: level === 1 ? 10 : 15,
  };
}

export function matchTap(
  id: string,
  problemAr: string,
  pairs: { leftAr: string; rightAr: string }[],
): ProgressiveExercise {
  return {
    id,
    level: 3,
    levelLabelAr: PLAY_L3,
    type: 'matching',
    problemAr,
    hintsAr: ['اضغط كلمة ثم صورتها.'],
    matchingPairsAr: pairs,
    solutionAr: pairs.map((p) => `${p.leftAr} → ${p.rightAr}`).join('، '),
    detailedCorrectionAr: 'كل صورة مع كلمتها.',
    xpReward: 20,
  };
}

const OPPOSITES: Array<[RegExp, string]> = [
  [/فَوْق|فوق/, 'تَحْتَ 👇'],
  [/تَحْت|تحت/, 'فَوْقَ ☝️'],
  [/أَمَام|امام|أمام/, 'وَرَاءَ 🔙'],
  [/وَرَاء|وراء/, 'أَمَامَ 👀'],
  [/بَيْن|بين/, 'فَوْقَ ☝️'],
  [/يُمْن|يمين/, 'اليَسَارُ 🤚'],
  [/يُسْر|يسار/, 'اليَمِينُ ✋'],
  [/دَاخِل|داخل/, 'خَارِجٌ 🚪'],
  [/خَارِج|خارج/, 'دَاخِلٌ 📦'],
  [/أَطْوَل|أطول/, 'أَقْصَرُ'],
  [/أَقْصَر|أقصر/, 'أَطْوَلُ'],
  [/أَثْقَل|أثقل/, 'أَخَفُّ'],
  [/أَكْثَر|أكثر/, 'أَقَلَّ مِنْ'],
  [/أَقَلّ|أقل/, 'أَكْثَرَ مِنْ'],
  [/بِقَدْر/, 'أَكْثَرَ مِنْ'],
  [/مُثَلَّث|مثلث/, 'دَائِرَةٌ'],
  [/دَائِرَة|دائرة/, 'مُرَبَّعٌ'],
  [/مُرَبَّع|مربع/, 'مُثَلَّثٌ'],
  [/مُسْتَطِيل|مستطيل/, 'دَائِرَةٌ'],
];

/**
 * A same-lesson sibling's solution (e.g. another letter, another surah name, another short
 * sentence) makes a far more honest wrong answer than a made-up placeholder — the child still has
 * to recognise which real answer fits, instead of learning to spot a fake option by its wording.
 * `otherSolutions` only reaches here when no OPPOSITES entry matched.
 */
export function oppositeChoice(solutionAr: string, otherSolutions: string[] = []): string {
  // Only a lone number gets "number + 1". Gluing the digits of "اِثْنَا عَشَرَ. 10 + 2" together used to
  // produce nonsense options such as "103".
  const numbers = solutionAr.match(/\d+/g) ?? [];
  if (numbers.length === 1) {
    const n = Number(numbers[0]);
    return String(n === 0 ? 1 : n + 1);
  }
  const hit = numbers.length === 0 ? OPPOSITES.find(([re]) => re.test(solutionAr)) : undefined;
  if (hit) return hit[1];
  // Two solutions that differ only by vowel marks are the same answer: never offer one against the other.
  const bare = (text: string) => text.replace(/[\u064B-\u0652\u0670]/g, '').trim();
  const sibling = otherSolutions.find((s) => s && bare(s) !== bare(solutionAr));
  if (sibling) return sibling;
  return 'لَيْسَ هَذَا';
}

/**
 * Hand-written wrong answers for exercises whose automatic one was not a real choice
 * (an answer borrowed from another question, or a bare word against a full sentence).
 */
export const TAP_WRONG_ANSWERS: Record<string, string> = {
  'ex1-math1ap-spatial': 'تَحْتَ الغُصْنِ',
  'ex2-math1ap-spatial': 'فَوْقَ الطَّاوِلَةِ',
  'ex1-math1ap-rl': 'خَارِجَ السَّلَّةِ',
  'ex2-math1ap-rl': 'بِاليَدِ اليُسْرَى',
  'ex2-math1ap-shapes': '3 أَضْلاَعٍ',
  'ex1-math1ap-num20': 'وَاحِدٌ وَعِشْرُونَ. 20 + 1',
  'ex2-math1ap-num20': '20 و 30. وَ 17 وَ 19',
  'ex1-math1ap-t90': '53 — ثَلاَثَةٌ وَخَمْسُونَ',
  'ex2-math1ap-t90': '30 وَ 40',
  'ex1-math1ap-pl': '76 — سِتَّةٌ وَسَبْعُونَ',
  'ex2-math1ap-tm': 'أَجْمَعُ: 18 + 5 = 23',
  'ex1-math1ap-symbols': '7 < 2',
  'ex2-math1ap-symbols': '58 < 45',
  'ex1-math1ap-grandeurs': 'المِسْطَرَةُ أَقْصَرُ',
  'ex2-math1ap-grandeurs': 'نَمْلَةٌ، قِطَّةٌ، فِيلٌ',
  'ex1-math1ap-ruler': 'المِمْحَاةَ',
  'ex2-math1ap-ruler': 'مُسْتَقِيمٌ',
  // The two «ز» answers of this lesson differ only by a vowel mark: the real contrast is with «ر».
  'ex1-ar1ap-zay': 'ر',
  'ex2-ar1ap-zay': 'رَ',
  // Arabic
  'ex1-ar1ap-tracing': '5 (خَمْسَةُ أَصَابِعَ)',
  'ex2-ar1ap-tracing': 'مِنَ اليَسَارِ إِلَى اليَمِينِ',
  'ex1-ar1ap-madd': 'بِي',
  'ex2-ar1ap-madd': 'مَدٌّ بِالأَلِفِ',
  'ex3-ar1ap-madd': 'جِ في المَسْجِدِ',
  'ex1-ar1ap-oral': 'تُصْبِحِينَ عَلَى خَيْرٍ',
  'ex2-ar1ap-oral': 'أَعْطِنِي الكُرَةَ الآنَ',
  'ex1-ar1ap-hamza': 'عَيْنٌ (عَ)',
  'ex2-ar1ap-hamza': 'فِي الأَوَّلِ أَ',
  'ex1-ar1ap-pos': 'ـب (شَكْلُ الآخِرِ)',
  'ex2-ar1ap-pos': 'فِي الأَوَّلِ',
  'ex1-ar1ap-tanween': 'تَنْوِينُ الفَتْحِ ً',
  'ex2-ar1ap-tanween': 'بُنْ',
  'ex1-ar1ap-school': 'فِي القِسْمِ',
  'ex2-ar1ap-school': 'الطَّبِيبُ',
  'ex1-ar1ap-family': 'المُعَلِّمُ',
  'ex2-ar1ap-family': 'العَمُّ وَالعَمَّةُ',
  'ex1-ar1ap-neighborhood': 'فِي المَدْرَسَةِ',
  'ex2-ar1ap-neighborhood': 'السَّائِقُ',
  'ex1-ar1ap-health': 'المَشْرُوبَ الغَازِيَّ',
  'ex2-ar1ap-health': 'النَّوْمِ',
  'ex1-ar1ap-nature': 'الثَّلْجَ وَالمَطَرَ',
  'ex2-ar1ap-nature': 'نَرْمِي الأَوْسَاخَ فِي كُلِّ مَكَانٍ',
  'ex1-ar1ap-play': 'اِذْهَبْ بَعِيدًا',
  'ex2-ar1ap-play': 'مِلْعَقَةٍ وَصَحْنٍ',
  'ex1-ar1ap-holidays': 'تُصْبِحُونَ عَلَى خَيْرٍ',
  'ex2-ar1ap-holidays': 'وَاجِبًا مَدْرَسِيًّا',
  // Science
  'ex1-sc1ap-senses': 'الأُذُنَانِ',
  'ex2-sc1ap-senses': 'عِنْدَ النَّوْمِ فَقَطْ',
  'ex1-sc1ap-locomotion': 'يَسْبَحُ',
  'ex2-sc1ap-locomotion': 'لِأَنَّهَا تُحِبُّ النَّوْمَ',
  'ex1-sc1ap-bodyparts': 'بِقَدَمَيَّ',
  'ex2-sc1ap-bodyparts': 'المَشْرُوبُ الغَازِيُّ',
  'ex1-sc1ap-movement': 'الجَرْيُ السَّرِيعُ',
  'ex2-sc1ap-movement': 'لَعِبًا أَكْثَرَ دُونَ تَوَقُّفٍ',
  'ex1-sc1ap-plant': 'فَوْقَ الطَّاوِلَةِ',
  'ex2-sc1ap-plant': 'تَكْبُرُ بِسُرْعَةٍ',
  'ex1-sc1ap-seasons': 'الشِّتَاءُ ❄️',
  'ex2-sc1ap-seasons': 'قَمِيصٌ خَفِيفٌ وَصَنْدَلٌ',
  'ex1-sc1ap-foodhygiene': 'آكُلُهَا مُبَاشَرَةً',
  'ex2-sc1ap-foodhygiene': 'تُصْبِحُ أَقْوَى',
  // Islamic education
  'ex1-isl1ap-fatiha': 'إِلَى اللِّقَاءِ',
  'ex2-isl1ap-fatiha': 'سُورَةُ النَّاسِ',
  'ex1-isl1ap-shortsurahs': 'سُورَةُ الكَوْثَرِ',
  'ex2-isl1ap-shortsurahs': 'عَنِ النَّصْرِ وَالفَتْحِ',
  // The shahada must never be shown completed with another name, even as a wrong option.
  'ex1-isl1ap-pillars': 'النَّاسُ',
  'ex2-isl1ap-pillars': 'جِبْرِيلُ عَلَيْهِ السَّلَامُ',
  'ex1-isl1ap-manners': 'لَا أَقُولُ شَيْئًا',
  'ex2-isl1ap-manners': 'أَدْخُلُ دُونَ اسْتِئْذَانٍ',
  'ex1-isl1ap-parents': 'أَرْفَعُ الصَّوْتَ أَكْثَرَ',
  'ex2-isl1ap-parents': 'رِضَا الأَصْدِقَاءِ',
  'ex1-isl1ap-masad': 'صَدَقَ اللهُ العَظِيمُ',
  'ex2-isl1ap-masad': 'سُورَةُ المَسَدِ',
  // Civics
  'ex1-civics1ap-greetings': 'إِلَى اللِّقَاءِ',
  'ex2-civics1ap-greetings': 'نَتَكَلَّمُ مَعَ زَمِيلِنَا',
  'ex1-civics1ap-identity': 'اسْمُ لُعْبَتِي المُفَضَّلَةِ فَقَطْ',
  'ex2-civics1ap-identity': 'أَتْرُكُهَا فِي السَّاحَةِ',
  'ex1-civics1ap-sharing': 'أَضْحَكُ عَلَيْهِ وَأَذْهَبُ',
  'ex2-civics1ap-sharing': 'الشِّجَارُ وَالصُّرَاخُ',
  'ex1-civics1ap-flag': 'الأَزْرَقُ وَالأَصْفَرُ',
  'ex2-civics1ap-flag': '"طَلَعَ البَدْرُ"',
  'ex1-civics1ap-rules': 'نَصْرُخُ بِصَوْتٍ عَالٍ',
  'ex2-civics1ap-rules': 'تَحْتَ الطَّاوِلَةِ',
  'ex1-civics1ap-rights': 'الحَقُّ فِي اللَّعِبِ',
  'ex2-civics1ap-rights': 'لَا أَهْتَمُّ بِهَا',
};

function asTapQcm(ex: ProgressiveExercise, otherSolutions: string[] = []): ProgressiveExercise {
  if (ex.type && ex.type !== 'short_answer') return ex;
  const yes = ex.solutionAr;
  return {
    ...ex,
    type: 'qcm',
    options: [
      { id: 'a', textAr: yes, isCorrect: true },
      { id: 'b', textAr: TAP_WRONG_ANSWERS[ex.id] ?? oppositeChoice(yes, otherSolutions), isCorrect: false },
    ],
  };
}

export type PlayfulPack = {
  extra: ProgressiveExercise[];
  game: EducationalGameItem[];
  quiz: QuizQuestion[];
};

export function applyPlayful1AP(
  lessons: CourseLesson[],
  packs: Record<string, PlayfulPack>,
): CourseLesson[] {
  return lessons.map((lesson) => {
    const pack = packs[lesson.id];
    if (!pack) return lesson;
    const originalExercises = lesson.progressiveExercises || [];
    const allSolutions = originalExercises.map((ex) => ex.solutionAr);
    const progressiveExercises = [
      ...originalExercises.map((ex) => asTapQcm(ex, allSolutions)),
      ...pack.extra,
    ];
    const educationalGame = lesson.educationalGame
      ? {
          ...lesson.educationalGame,
          items: [...lesson.educationalGame.items, ...pack.game],
          xpReward: Math.max(lesson.educationalGame.xpReward, 25),
        }
      : lesson.educationalGame;
    return {
      ...lesson,
      progressiveExercises,
      educationalGame,
      quiz: [...lesson.quiz, ...pack.quiz],
    };
  });
}
