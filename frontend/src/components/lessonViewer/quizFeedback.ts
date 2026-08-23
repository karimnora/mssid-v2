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
      primaryAr: selected.explanationAr || correct?.explanationAr || FALLBACK_AR,
      primaryLabelAr: 'التفسير والشرح العلمي للحل:',
    };
  }

  return {
    isCorrect: false,
    primaryAr: selected.explanationAr || FALLBACK_AR,
    correctAr: correct?.explanationAr,
    primaryLabelAr: 'لِمَاذَا هَذَا الجَوَابُ غَيْرُ مُنَاسِبٍ؟',
  };
}

export function quizFeedbackSpeakText(feedback: QuizFeedback): string {
  if (feedback.correctAr) {
    return `${feedback.primaryAr} الصواب: ${feedback.correctAr}`;
  }
  return feedback.primaryAr;
}
