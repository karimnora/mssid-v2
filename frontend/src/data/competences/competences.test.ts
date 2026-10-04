import { describe, it, expect } from 'vitest';
import { COURSES_DATA } from '../coursesData';
import { COMPETENCES, LESSON_COMPETENCES, getLessonCompetences, getLessonsForCompetence } from './index';

describe('competence map', () => {
  const lessonIds = new Set(COURSES_DATA.map((l) => l.id));
  const competenceIds = new Set(COMPETENCES.map((c) => c.id));

  it('has unique competence ids and unique lesson entries', () => {
    expect(competenceIds.size).toBe(COMPETENCES.length);
    const mappedLessonIds = LESSON_COMPETENCES.map((l) => l.lessonId);
    expect(new Set(mappedLessonIds).size).toBe(mappedLessonIds.length);
  });

  it('only references lessons and competences that exist', () => {
    for (const entry of LESSON_COMPETENCES) {
      expect(lessonIds.has(entry.lessonId), entry.lessonId).toBe(true);
      expect(entry.competenceIds.length, entry.lessonId).toBeGreaterThan(0);
      for (const id of entry.competenceIds) {
        expect(competenceIds.has(id), `${entry.lessonId} → ${id}`).toBe(true);
      }
    }
  });

  it('maps every 1AP math, 1AP arabic, 2AP math and 5AP math lesson', () => {
    const needed = COURSES_DATA.filter(
      (l) =>
        (l.grade === '1AP' && (l.subject === 'math' || l.subject === 'arabic')) ||
        (l.grade === '2AP' && l.subject === 'math') ||
        (l.grade === '5AP' && l.subject === 'math'),
    );
    const unmapped = needed.filter((l) => getLessonCompetences(l.id).length === 0).map((l) => l.id);
    expect(unmapped).toEqual([]);
  });

  it('keeps each competence on the grade and subject of its lessons, and uses every competence', () => {
    for (const competence of COMPETENCES) {
      const lessons = getLessonsForCompetence(competence.id);
      expect(lessons.length, competence.id).toBeGreaterThan(0);
      for (const lessonId of lessons) {
        const lesson = COURSES_DATA.find((l) => l.id === lessonId)!;
        expect(lesson.grade, `${competence.id} ← ${lessonId}`).toBe(competence.grade);
        expect(lesson.subject, `${competence.id} ← ${lessonId}`).toBe(competence.subject);
      }
    }
  });
});
