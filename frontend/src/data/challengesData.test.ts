import { describe, expect, it } from 'vitest';
import { CHALLENGES_DATA } from './challengesData';

describe('CHALLENGES_DATA 1AP/2AP', () => {
  it('ships playable 1AP and 2AP challenges with answers in the options', () => {
    const one = CHALLENGES_DATA.filter((c) => c.grade === '1AP');
    const two = CHALLENGES_DATA.filter((c) => c.grade === '2AP');
    expect(one.length).toBeGreaterThanOrEqual(4);
    expect(two.length).toBeGreaterThanOrEqual(4);
    [...one, ...two].forEach((challenge) => {
      expect(challenge.items.length).toBeGreaterThan(0);
      challenge.items.forEach((item) => {
        expect(item.optionsAr).toContain(item.correctAnswerAr);
      });
    });
  });
});
