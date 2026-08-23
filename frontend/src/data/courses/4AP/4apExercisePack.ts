import { ProgressiveExercise } from '../../../types';

type ExerciseInput = {
  problemAr: string;
  solutionAr: string;
  detailedCorrectionAr: string;
  type?: ProgressiveExercise['type'];
  hintsAr?: string[];
  options?: ProgressiveExercise['options'];
  calculationAnswer?: number;
  operationsAr?: string;
  irabTableAr?: ProgressiveExercise['irabTableAr'];
  fillBlankAnswerAr?: string;
};

const TIER_LABELS = ['أكتشف', 'أتدرب', 'أتقن', 'أتحدى'] as const;
const TIER_XP = [10, 15, 20, 25] as const;

/** Standard 4AP lesson practice: 4 progressive tiers + 2 evaluation items. */
export function build4ApPractice(
  prefix: string,
  tiers: [ExerciseInput, ExerciseInput, ExerciseInput, ExerciseInput],
  evals: [ExerciseInput, ExerciseInput],
): { progressiveExercises: ProgressiveExercise[]; evaluationExercises: ProgressiveExercise[] } {
  return {
    progressiveExercises: tiers.map((tier, index) => ({
      id: `${prefix}-p${index + 1}`,
      level: (index + 1) as 1 | 2 | 3 | 4,
      levelLabelAr: TIER_LABELS[index],
      type: tier.type ?? 'qcm',
      hintsAr: tier.hintsAr ?? ['فكّر جيداً قبل الإجابة.'],
      xpReward: TIER_XP[index],
      ...tier,
    })),
    evaluationExercises: evals.map((tier, index) => ({
      id: `${prefix}-e${index + 1}`,
      level: 2,
      levelLabelAr: 'تقويم',
      type: tier.type ?? 'qcm',
      hintsAr: tier.hintsAr ?? [],
      xpReward: 12 + index * 3,
      ...tier,
    })),
  };
}
