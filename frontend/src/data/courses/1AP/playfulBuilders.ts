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
];

export function oppositeChoice(solutionAr: string): string {
  const n = Number.parseInt(solutionAr.replace(/[^\d-]/g, ''), 10);
  if (!Number.isNaN(n) && String(n) && /\d/.test(solutionAr)) {
    return String(n === 0 ? 1 : n + 1);
  }
  const hit = OPPOSITES.find(([re]) => re.test(solutionAr));
  if (hit) return hit[1];
  return 'لَيْسَ هَذَا';
}

function asTapQcm(ex: ProgressiveExercise): ProgressiveExercise {
  if (ex.type && ex.type !== 'short_answer') return ex;
  const yes = ex.solutionAr;
  return {
    ...ex,
    type: 'qcm',
    options: [
      { id: 'a', textAr: yes, isCorrect: true },
      { id: 'b', textAr: oppositeChoice(yes), isCorrect: false },
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
    const progressiveExercises = [
      ...(lesson.progressiveExercises || []).map(asTapQcm),
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
