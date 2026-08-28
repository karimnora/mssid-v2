import { ExamKind, OfficialExam, PrimaryGrade } from '../types';

/**
 * Classifies a paper the way DzExams/DzMadrassa folder trees do
 * (devoir / composition / BEP / évaluation des acquis), without depending on their filenames.
 * Explicit `kind` always wins.
 */
export function getExamKind(exam: OfficialExam): ExamKind {
  if (exam.kind) return exam.kind;
  const blob = `${exam.titleAr} ${exam.sessionAr}`;
  if (/تقييم المكتسبات|تقييم مكتسبات/.test(blob)) return 'acquis';
  if (exam.trimester == null && /دورة|شهادة التعليم الابتدائي/.test(blob)) return 'bep';
  return 'composition';
}

export function examUsesTrimester(kind: ExamKind): boolean {
  return kind !== 'bep' && kind !== 'acquis';
}

export function preferredExamKind(grade: PrimaryGrade | undefined): ExamKind {
  return grade === '5AP' || !grade ? 'acquis' : 'composition';
}

export function examKindOrder(grade: PrimaryGrade): ExamKind[] {
  return grade === '5AP'
    ? ['acquis', 'bep', 'composition', 'devoir']
    : ['composition', 'devoir'];
}

export type ExamKindBadgeKey = 'devoirBadge' | 'compositionBadge' | 'bepBadge' | 'acquisBadge';

export function examKindBadgeKey(kind: ExamKind): ExamKindBadgeKey {
  if (kind === 'devoir') return 'devoirBadge';
  if (kind === 'bep') return 'bepBadge';
  if (kind === 'acquis') return 'acquisBadge';
  return 'compositionBadge';
}
