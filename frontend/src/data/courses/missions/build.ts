import type { CourseLesson, LearningPath, LearningPathStep, LearningPathVisual, ProgressiveExercise } from '../../../types';

/**
 * Compact authoring format for a guided mission (observe → method → with help → alone → new situation).
 * One mission introduces ONE idea of its lesson; the ordinary rules, practice and quiz stay untouched.
 */
type Hint = [labelAr: string, contentAr: string];

interface BaseExercise {
  problemAr: string;
  correctionAr: string;
  /** At least two: the first locates the difficulty, the second starts the work without giving the result. */
  hints: Hint[];
  stepTitleAr?: string;
}
export interface CalcExercise extends BaseExercise {
  answer: number;
  operationsAr?: string;
  /** Predictable wrong answers and the nudge that names the confusion. */
  wrong?: [answer: number, feedbackAr: string][];
}
export interface ChoiceExercise extends BaseExercise {
  /** Exactly one option is correct; display order is shuffled by the practice engine. */
  options: [textAr: string, isCorrect: boolean][];
}
export type MissionExercise = CalcExercise | ChoiceExercise;

export type MissionLang = 'fr' | 'en';

export interface MissionSpec {
  lessonId: string;
  /** French and English lessons: step titles and instructions are in that language so its voice can read them. */
  lang?: MissionLang;
  /** 'm2' for a second mission of the same lesson: keeps its exercise ids distinct from the first one. */
  idPrefix?: string;
  titleAr: string;
  recallAr: string;
  observe: { titleAr: string; textAr: string; visual?: LearningPathVisual };
  model: { titleAr: string; textAr: string; visual?: LearningPathVisual; operationsAr?: string; solutionAr?: string; irabRows?: { wordAr: string; analysisAr: string }[]; tableLabels?: [word: string, analysis: string] };
  guided: MissionExercise;
  solo: MissionExercise[];
  transfer: MissionExercise;
}

export const calc = (
  problemAr: string, answer: number, operationsAr: string | undefined, correctionAr: string,
  hints: Hint[], wrong?: [number, string][],
): CalcExercise => ({ problemAr, answer, operationsAr, correctionAr, hints, wrong });

export const choice = (
  problemAr: string, options: [string, boolean][], correctionAr: string, hints: Hint[],
): ChoiceExercise => ({ problemAr, options, correctionAr, hints });

// Authors type "23 405"; the catalogue convention is a narrow no-break space between digit groups.
const groupDigits = (text: string) => text.replace(/(\d) (?=\d{3}(?!\d))/g, '$1 ');

const STEP_DEFAULTS = {
  guided: { titleAr: 'أكمل مع ديدو', textAr: 'جزء من الحل معطى لك. أكمل، ثم اضغط «تحقق من الإجابة».', levelLabelAr: 'أكمل مع ديدو', level: 1, xp: 10 },
  independent: { titleAr: 'أحاول وحدي', textAr: 'هذه المرة أعمل وحدي. إذا تعثرت، يساعدني ديدو.', levelLabelAr: 'أحاول وحدي', level: 2, xp: 15 },
  transfer: { titleAr: 'وضعية جديدة', textAr: 'أطبق ما تعلمته في وضعية جديدة. أقرأ السؤال جيداً قبل أن أجيب.', levelLabelAr: 'وضعية جديدة', level: 3, xp: 20 },
} as const;

const STEP_DEFAULTS_FR = {
  guided: { titleAr: 'Je complète avec Didou', textAr: 'Une partie de la réponse est donnée. Choisis, puis vérifie ta réponse.', levelLabelAr: 'Avec Didou', level: 1, xp: 10 },
  independent: { titleAr: "J'essaie tout seul", textAr: "Cette fois, je travaille tout seul. Si je bloque, Didou m'aide.", levelLabelAr: 'Tout seul', level: 2, xp: 15 },
  transfer: { titleAr: 'Une nouvelle situation', textAr: "J'utilise ce que j'ai appris dans une nouvelle situation. Je lis bien la question.", levelLabelAr: 'Nouvelle situation', level: 3, xp: 20 },
} as const;
const STEP_DEFAULTS_EN = {
  guided: { titleAr: 'I complete with Didou', textAr: 'Part of the answer is given. Choose, then check your answer.', levelLabelAr: 'With Didou', level: 1, xp: 10 },
  independent: { titleAr: 'I try alone', textAr: 'This time, I work alone. If I am stuck, Didou helps me.', levelLabelAr: 'Alone', level: 2, xp: 15 },
  transfer: { titleAr: 'A new situation', textAr: 'I use what I learned in a new situation. I read the question well.', levelLabelAr: 'New situation', level: 3, xp: 20 },
} as const;
const AGAIN = {
  fr: { titleAr: "J'essaie encore tout seul", textAr: 'La même méthode avec un nouvel exemple.' },
  en: { titleAr: 'I try alone again', textAr: 'The same method with a new example.' },
  ar: { titleAr: 'أحاول وحدي مرة ثانية', textAr: 'نفس الطريقة مع مثال جديد.' },
} as const;
const defaultsFor = (lang?: MissionLang) => (lang === 'fr' ? STEP_DEFAULTS_FR : lang === 'en' ? STEP_DEFAULTS_EN : STEP_DEFAULTS);

function toExercise(id: string, kind: keyof typeof STEP_DEFAULTS, ex: MissionExercise, lang?: MissionLang): ProgressiveExercise {
  const defaults = defaultsFor(lang)[kind];
  const base = {
    id,
    level: defaults.level,
    levelLabelAr: defaults.levelLabelAr,
    problemAr: groupDigits(ex.problemAr),
    hintsAr: [groupDigits(ex.hints[0][1])],
    progressiveHints: ex.hints.map(([labelAr, contentAr]) => ({ labelAr, contentAr: groupDigits(contentAr) })),
    detailedCorrectionAr: groupDigits(ex.correctionAr),
    xpReward: defaults.xp,
  };
  if ('options' in ex) {
    const options = ex.options.map(([textAr, isCorrect], index) => ({ id: String.fromCharCode(97 + index), textAr: groupDigits(textAr), isCorrect }));
    return { ...base, type: 'qcm', options, solutionAr: options.find(option => option.isCorrect)?.textAr ?? '' };
  }
  return {
    ...base,
    type: 'calculation',
    calculationAnswer: ex.answer,
    solutionAr: String(ex.answer),
    operationsAr: ex.operationsAr ? groupDigits(ex.operationsAr) : undefined,
    misconceptionsAr: ex.wrong?.map(([answer, feedbackAr]) => ({ answer, feedbackAr: groupDigits(feedbackAr) })),
  };
}

export interface BuiltMission {
  lessonId: string;
  learningPath: LearningPath;
  practiceExercises: ProgressiveExercise[];
  transferExercise: ProgressiveExercise;
}

export function buildMission(spec: MissionSpec): BuiltMission {
  const D = defaultsFor(spec.lang);
  const prefix = spec.idPrefix ?? 'm';
  const guided = toExercise(`${spec.lessonId}-${prefix}-guided`, 'guided', spec.guided, spec.lang);
  const solos = spec.solo.map((ex, index) => toExercise(`${spec.lessonId}-${prefix}-solo${index + 1}`, 'independent', ex, spec.lang));
  const transfer = toExercise(`${spec.lessonId}-${prefix}-transfer`, 'transfer', spec.transfer, spec.lang);
  const visual = spec.observe.visual && { ...spec.observe.visual, captionAr: groupDigits(spec.observe.visual.captionAr) };
  const steps: LearningPathStep[] = [
    { kind: 'observe', titleAr: spec.observe.titleAr, textAr: groupDigits(spec.observe.textAr), visual },
    {
      kind: 'model', titleAr: spec.model.titleAr, textAr: groupDigits(spec.model.textAr),
      workedExample: spec.model.operationsAr && spec.model.solutionAr
        ? { operationsAr: groupDigits(spec.model.operationsAr), solution: groupDigits(spec.model.solutionAr) }
        : undefined,
      visual: spec.model.visual && { ...spec.model.visual, captionAr: groupDigits(spec.model.visual.captionAr) },
      irabTable: spec.model.irabRows,
      irabTableLabels: spec.model.tableLabels,
    },
    { kind: 'guided', titleAr: spec.guided.stepTitleAr ?? D.guided.titleAr, textAr: D.guided.textAr, exerciseId: guided.id },
    ...solos.map((ex, index): LearningPathStep => ({
      kind: 'independent',
      titleAr: spec.solo[index].stepTitleAr ?? (index === 0 ? D.independent.titleAr : AGAIN[spec.lang ?? 'ar'].titleAr),
      textAr: index === 0 ? D.independent.textAr : AGAIN[spec.lang ?? 'ar'].textAr,
      exerciseId: ex.id,
    })),
    { kind: 'transfer', titleAr: spec.transfer.stepTitleAr ?? D.transfer.titleAr, textAr: D.transfer.textAr, exerciseId: transfer.id },
  ];
  return {
    lessonId: spec.lessonId,
    learningPath: { lang: spec.lang, titleAr: spec.titleAr, prerequisiteAr: groupDigits(spec.recallAr), steps },
    practiceExercises: [guided, ...solos],
    transferExercise: transfer,
  };
}

/** Mission exercises lead the practice list; the transfer joins the evaluation when the lesson has one. */
export function applyMission(lesson: CourseLesson, mission: BuiltMission): CourseLesson {
  const hasEvaluation = (lesson.evaluationExercises?.length ?? 0) > 0;
  return {
    ...lesson,
    learningPath: mission.learningPath,
    progressiveExercises: [
      ...mission.practiceExercises,
      ...lesson.progressiveExercises ?? [],
      ...(hasEvaluation ? [] : [mission.transferExercise]),
    ],
    evaluationExercises: hasEvaluation ? [...lesson.evaluationExercises ?? [], mission.transferExercise] : lesson.evaluationExercises,
  };
}

/** Chains a second mission after the first one: its exercises follow the first mission's in the practice list. */
export function applyNextMission(lesson: CourseLesson, mission: BuiltMission): CourseLesson {
  if (!lesson.learningPath) return lesson;
  const firstIds = new Set(lesson.learningPath.steps.flatMap(step => ('exerciseId' in step ? [step.exerciseId] : [])));
  const progressive = lesson.progressiveExercises ?? [];
  const insertAt = progressive.reduce((last, ex, index) => (firstIds.has(ex.id) ? index + 1 : last), 0);
  const hasEvaluation = (lesson.evaluationExercises?.length ?? 0) > 0;
  return {
    ...lesson,
    learningPath: { ...lesson.learningPath, next: mission.learningPath },
    progressiveExercises: [
      ...progressive.slice(0, insertAt),
      ...mission.practiceExercises,
      ...progressive.slice(insertAt),
      ...(hasEvaluation ? [] : [mission.transferExercise]),
    ],
    evaluationExercises: hasEvaluation ? [...lesson.evaluationExercises ?? [], mission.transferExercise] : lesson.evaluationExercises,
  };
}
