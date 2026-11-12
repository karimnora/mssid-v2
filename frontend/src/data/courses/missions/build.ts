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

export interface MissionSpec {
  lessonId: string;
  titleAr: string;
  recallAr: string;
  observe: { titleAr: string; textAr: string; visual?: LearningPathVisual };
  model: { titleAr: string; textAr: string; operationsAr?: string; solutionAr?: string; irabRows?: { wordAr: string; analysisAr: string }[] };
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

function toExercise(id: string, kind: keyof typeof STEP_DEFAULTS, ex: MissionExercise): ProgressiveExercise {
  const defaults = STEP_DEFAULTS[kind];
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
  const guided = toExercise(`${spec.lessonId}-m-guided`, 'guided', spec.guided);
  const solos = spec.solo.map((ex, index) => toExercise(`${spec.lessonId}-m-solo${index + 1}`, 'independent', ex));
  const transfer = toExercise(`${spec.lessonId}-m-transfer`, 'transfer', spec.transfer);
  const visual = spec.observe.visual && { ...spec.observe.visual, captionAr: groupDigits(spec.observe.visual.captionAr) };
  const steps: LearningPathStep[] = [
    { kind: 'observe', titleAr: spec.observe.titleAr, textAr: groupDigits(spec.observe.textAr), visual },
    {
      kind: 'model', titleAr: spec.model.titleAr, textAr: groupDigits(spec.model.textAr),
      workedExample: spec.model.operationsAr && spec.model.solutionAr
        ? { operationsAr: groupDigits(spec.model.operationsAr), solution: groupDigits(spec.model.solutionAr) }
        : undefined,
      irabTable: spec.model.irabRows,
    },
    { kind: 'guided', titleAr: spec.guided.stepTitleAr ?? STEP_DEFAULTS.guided.titleAr, textAr: STEP_DEFAULTS.guided.textAr, exerciseId: guided.id },
    ...solos.map((ex, index): LearningPathStep => ({
      kind: 'independent',
      titleAr: spec.solo[index].stepTitleAr ?? (index === 0 ? STEP_DEFAULTS.independent.titleAr : 'أحاول وحدي مرة ثانية'),
      textAr: index === 0 ? STEP_DEFAULTS.independent.textAr : 'نفس الطريقة مع مثال جديد.',
      exerciseId: ex.id,
    })),
    { kind: 'transfer', titleAr: spec.transfer.stepTitleAr ?? STEP_DEFAULTS.transfer.titleAr, textAr: STEP_DEFAULTS.transfer.textAr, exerciseId: transfer.id },
  ];
  return {
    lessonId: spec.lessonId,
    learningPath: { titleAr: spec.titleAr, prerequisiteAr: groupDigits(spec.recallAr), steps },
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
