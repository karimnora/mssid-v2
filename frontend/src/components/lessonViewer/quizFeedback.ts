import type { QuizQuestion } from '../../types';

export interface QuizFeedback {
  isCorrect: boolean;
  /** Spoken + primary body: why the chosen (wrong) option fails, or why the correct one works. */
  primaryAr: string;
  /** Shown only after a mistake, so the child also sees the right answer. */
  correctAr?: string;
  primaryLabelAr: string;
}

const FALLBACK_AR = 'الإجابة الصحيحة تم اختيارها استناداً لقاعدة الدرس الذهبية.';
const GENERIC_EXPLANATION = /^(نعم|لا|صحيح!?|خطأ!?|أحسنت!?|هذا صحيح\.?|هذا خطأ\.?)$/;

/** Skip one-word / placeholder explanations so the child sees a real reason, not «نعم». */
export function isUsefulExplanation(text: string | undefined): text is string {
  if (!text) return false;
  const trimmed = text.trim();
  if (trimmed.length < 12) return false;
  if (trimmed === FALLBACK_AR) return false;
  return !GENERIC_EXPLANATION.test(trimmed);
}

function pickExplanation(...candidates: Array<string | undefined>): string | undefined {
  return candidates.find(isUsefulExplanation);
}

export function getQuizFeedback(
  question: QuizQuestion,
  selectedId: string | undefined,
): QuizFeedback | null {
  if (!selectedId) return null;

  const selected = question.options.find((o) => o.id === selectedId);
  const correct = question.options.find((o) => o.isCorrect);
  if (!selected) return null;

  if (selected.isCorrect) {
    return {
      isCorrect: true,
      primaryAr:
        pickExplanation(selected.explanationAr, correct?.explanationAr, question.hintAr) ||
        (correct?.textAr
          ? `الجواب الصحيح هو: ${correct.textAr}. راجِع قاعدة الدرس لتتأكد من السبب.`
          : FALLBACK_AR),
      primaryLabelAr: 'التفسير والشرح العلمي للحل:',
    };
  }

  return {
    isCorrect: false,
    primaryAr:
      pickExplanation(selected.explanationAr, question.hintAr) ||
      `هذا الخيار («${selected.textAr}») غير مناسب. حاول مرة أخرى اعتماداً على قاعدة الدرس.`,
    correctAr:
      pickExplanation(correct?.explanationAr, question.hintAr) ||
      (correct?.textAr ? `الجواب الصحيح هو: ${correct.textAr}` : undefined),
    primaryLabelAr: 'لِمَاذَا هَذَا الجَوَابُ غَيْرُ مُنَاسِبٍ؟',
  };
}

export function quizFeedbackSpeakText(feedback: QuizFeedback): string {
  if (feedback.correctAr) {
    return `${feedback.primaryAr} الصواب: ${feedback.correctAr}`;
  }
  return feedback.primaryAr;
}
