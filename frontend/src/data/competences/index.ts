import type { Competence, LessonCompetences } from './types';
import { MATH_1AP_COMPETENCES, MATH_1AP_LESSON_COMPETENCES } from './math1ap';
import { MATH_2AP_COMPETENCES, MATH_2AP_LESSON_COMPETENCES } from './math2ap';
import { MATH_5AP_COMPETENCES, MATH_5AP_LESSON_COMPETENCES } from './math5ap';
import { ARABIC_1AP_COMPETENCES, ARABIC_1AP_LESSON_COMPETENCES } from './arabic1ap';
import { ARABIC_5AP_COMPETENCES, ARABIC_5AP_LESSON_COMPETENCES } from './arabic5ap';

export type { Competence, LessonCompetences } from './types';

export const COMPETENCES: Competence[] = [
  ...MATH_1AP_COMPETENCES,
  ...MATH_2AP_COMPETENCES,
  ...MATH_5AP_COMPETENCES,
  ...ARABIC_1AP_COMPETENCES,
  ...ARABIC_5AP_COMPETENCES,
];

export const LESSON_COMPETENCES: LessonCompetences[] = [
  ...MATH_1AP_LESSON_COMPETENCES,
  ...MATH_2AP_LESSON_COMPETENCES,
  ...MATH_5AP_LESSON_COMPETENCES,
  ...ARABIC_1AP_LESSON_COMPETENCES,
  ...ARABIC_5AP_LESSON_COMPETENCES,
];

const competenceById = new Map(COMPETENCES.map((c) => [c.id, c]));
const competenceIdsByLesson = new Map(LESSON_COMPETENCES.map((l) => [l.lessonId, l.competenceIds]));

export function getCompetence(id: string): Competence | undefined {
  return competenceById.get(id);
}

export function getLessonCompetences(lessonId: string): Competence[] {
  return (competenceIdsByLesson.get(lessonId) ?? [])
    .map((id) => competenceById.get(id))
    .filter((c): c is Competence => c !== undefined);
}

export function getLessonsForCompetence(competenceId: string): string[] {
  return LESSON_COMPETENCES.filter((l) => l.competenceIds.includes(competenceId)).map((l) => l.lessonId);
}
