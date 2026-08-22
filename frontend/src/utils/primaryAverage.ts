import { PrimaryGrade, SubjectId } from '../types';

export interface SubjectTermNotes {
  evalNote?: number | null;
  compositionNote?: number | null;
}

export interface SubjectAverageRow {
  subject: SubjectId;
  coefficient: number;
  average: number | null;
}

/**
 * DzExams EP formula (the site the parent actually uses):
 * matière = (évaluation + composition) / 2 when both exist, else the only filled note.
 * Notes are on 10. Coefficients in Algerian primary are 1 per taught subject.
 */
export function isValidNoteOn10(value: number | null | undefined): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= 10;
}

export function subjectTermAverage(notes: SubjectTermNotes): number | null {
  const evalN = isValidNoteOn10(notes.evalNote) ? notes.evalNote : null;
  const comp = isValidNoteOn10(notes.compositionNote) ? notes.compositionNote : null;
  if (evalN != null && comp != null) return (evalN + comp) / 2;
  if (comp != null) return comp;
  if (evalN != null) return evalN;
  return null;
}

/** Official taught subjects in this app — not the PDF-site lists that show French in 1AP. */
export function averageSubjectsForGrade(
  grade: PrimaryGrade,
  options?: { includeTamazight?: boolean }
): SubjectId[] {
  const core: SubjectId[] =
    grade === '1AP' || grade === '2AP'
      ? ['arabic', 'math', 'science', 'islamic', 'civics']
      : ['arabic', 'math', 'science', 'islamic', 'civics', 'french', 'english', 'history_geo'];
  if (options?.includeTamazight && grade !== '1AP' && grade !== '2AP') {
    return [...core, 'tamazight'];
  }
  return core;
}

export function computeTermBulletin(
  grade: PrimaryGrade,
  notesBySubject: Partial<Record<SubjectId, SubjectTermNotes>>,
  options?: { includeTamazight?: boolean }
): { rows: SubjectAverageRow[]; generalAverage: number | null; coefficientSum: number } {
  const subjects = averageSubjectsForGrade(grade, options);
  const rows: SubjectAverageRow[] = subjects.map((subject) => ({
    subject,
    coefficient: 1,
    average: subjectTermAverage(notesBySubject[subject] || {}),
  }));
  const filled = rows.filter((row) => row.average != null);
  const coefficientSum = filled.reduce((sum, row) => sum + row.coefficient, 0);
  const points = filled.reduce((sum, row) => sum + (row.average as number) * row.coefficient, 0);
  return {
    rows,
    coefficientSum,
    generalAverage: coefficientSum > 0 ? points / coefficientSum : null,
  };
}
