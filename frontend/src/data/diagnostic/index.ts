import type { PrimaryGrade, SubjectId } from '../../types';
import type { DiagnosticSet } from './types';
import { MATH_5AP_DIAGNOSTIC } from './math5ap';

export type { DiagnosticOption, DiagnosticQuestion, DiagnosticSet } from './types';

/** 5AP maths first (priority level); other grades are added here once their questions are written. */
export const DIAGNOSTIC_SETS: DiagnosticSet[] = [MATH_5AP_DIAGNOSTIC];

export function getDiagnosticSet(grade: PrimaryGrade, subject: SubjectId = 'math'): DiagnosticSet | undefined {
  return DIAGNOSTIC_SETS.find((set) => set.grade === grade && set.subject === subject);
}
