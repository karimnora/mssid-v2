import type { PrimaryGrade, SubjectId } from '../../types';

export interface Competence {
  id: string;
  grade: PrimaryGrade;
  subject: SubjectId;
  domainAr: string;
  labelAr: string;
  labelFr: string;
  /** False when the skill is taught in the catalogue but not listed in the CLAUDE.md référentiel for this grade — to confirm against the official programme. */
  inReferentiel: boolean;
}

/** Exercises of a lesson inherit its competences until an exercise-level mapping exists. */
export interface LessonCompetences {
  lessonId: string;
  competenceIds: string[];
}
