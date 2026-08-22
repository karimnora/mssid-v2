import { ExamKind, OfficialExam } from '../types';

/**
 * Classifies a paper the way DzExams/DzMadrassa folder trees do (devoir / composition / BEP),
 * without depending on their filenames. Explicit `kind` always wins.
 */
export function getExamKind(exam: OfficialExam): ExamKind {
  if (exam.kind) return exam.kind;
  const blob = `${exam.titleAr} ${exam.sessionAr}`;
  if (exam.trimester == null && /دورة|شهادة التعليم الابتدائي/.test(blob)) return 'bep';
  return 'composition';
}
