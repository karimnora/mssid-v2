import { describe, expect, it } from 'vitest';
import { CHALLENGES_DATA } from './challengesData';
import { COURSES_DATA } from './coursesData';

describe('CHALLENGES_DATA 1AP/2AP', () => {
  it('ships playable 1AP and 2AP challenges with answers in the options', () => {
    const one = CHALLENGES_DATA.filter((c) => c.grade === '1AP');
    const two = CHALLENGES_DATA.filter((c) => c.grade === '2AP');
    expect(one.length).toBeGreaterThanOrEqual(6);
    [...one].forEach((challenge) => {
      expect(challenge.items.length, challenge.id).toBeGreaterThanOrEqual(5);
    });
    expect(two.length).toBeGreaterThanOrEqual(4);
    [...one, ...two].forEach((challenge) => {
      expect(challenge.items.length).toBeGreaterThan(0);
      challenge.items.forEach((item) => {
        expect(item.optionsAr).toContain(item.correctAnswerAr);
      });
    });
  });

  it('ships thematic 1AP arabic and 2AP multiplication arena challenges', () => {
    const thematic = CHALLENGES_DATA.find((c) => c.id === 'challenge-1ap-arabic-thematic-axes');
    const mult = CHALLENGES_DATA.find((c) => c.id === 'challenge-2ap-math-multiplication-groups');
    expect(thematic).toBeTruthy();
    expect(mult).toBeTruthy();
    expect(thematic!.format).toBe('memory');
    expect(mult!.format).toBe('quiz_flash');
    expect(mult!.timeLimitSeconds).toBeUndefined();
    const lessonIds = new Set(COURSES_DATA.map((l) => l.id));
    [...(thematic!.relatedLessonIds || []), ...(mult!.relatedLessonIds || [])].forEach((id) => {
      expect(lessonIds.has(id), id).toBe(true);
    });
  });
});
