import type { PrimaryGrade, SubjectId } from '../../types';

export interface DiagnosticOption {
  id: string;
  textAr: string;
}

export interface DiagnosticQuestion {
  id: string;
  /** A competence of data/competences: the result feeds the same parent notebook. */
  competenceId: string;
  /** Trimester in which the catalogue teaches this competence. */
  trimester: 1 | 2 | 3;
  questionAr: string;
  options: DiagnosticOption[];
  correctId: string;
  /** Shown to the parent in the report, never during the check. */
  explanationAr: string;
}

export interface DiagnosticSet {
  grade: PrimaryGrade;
  subject: SubjectId;
  titleAr: string;
  titleFr: string;
  questions: DiagnosticQuestion[];
}
