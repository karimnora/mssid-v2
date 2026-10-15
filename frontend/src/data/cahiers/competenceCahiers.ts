import type { PrimaryGrade } from '../../types';
import { COMPETENCES } from '../competences';
import previews from './cahierPreviews.json';

export type CahierFigure = 'square-circle' | 'two-dots' | 'stars-5';

export interface CahierExercise {
  promptAr: string;
  lines: number;
  figure?: CahierFigure;
}

export interface CompetenceCahier {
  competenceId: string;
  grade: PrimaryGrade;
  titleAr: string;
  domainAr: string;
  exercises: CahierExercise[];
  versoAr: string[];
}

export const COMPETENCE_CAHIERS = previews as CompetenceCahier[];
const cahierById = new Map(COMPETENCE_CAHIERS.map((cahier) => [cahier.competenceId, cahier]));

export function getCahier(competenceId: string): CompetenceCahier | undefined {
  return cahierById.get(competenceId);
}

export function cahiersForGrade(grade: PrimaryGrade): CompetenceCahier[] {
  return COMPETENCE_CAHIERS.filter((cahier) => cahier.grade === grade);
}

export function assertCahierCoverage(): string[] {
  return COMPETENCES.map((competence) => competence.id).filter((id) => !cahierById.has(id));
}
