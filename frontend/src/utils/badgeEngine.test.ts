import { describe, expect, it } from 'vitest';
import { evaluateEligibleBadgeIds } from './badgeEngine';
import { BADGES_CATALOG } from '../data/badgesData';
import { createFreshGuestProfile } from '../hooks/useUserProgress';
import { COURSES_DATA } from '../data/coursesData';

describe('lab_visited badges', () => {
  it('catalog uses lab_visited for the gold dinar, not a course subject', () => {
    const badge = BADGES_CATALOG.find((b) => b.id === 'b_gold_dinar');
    expect(badge?.criteria).toEqual({ type: 'lab_visited', labId: 'algerian_market' });
  });

  it('unlocks b_gold_dinar after visiting the Algerian market lab', () => {
    const fresh = createFreshGuestProfile('1AP');
    expect(evaluateEligibleBadgeIds(fresh)).not.toContain('b_gold_dinar');

    const visited = { ...fresh, completedLabIds: ['algerian_market'] };
    expect(evaluateEligibleBadgeIds(visited)).toContain('b_gold_dinar');
  });
});

describe('first_login welcome badge', () => {
  it('does not grant مجتهد الجزائر to a guest or a fresh profile after logout', () => {
    const fresh = createFreshGuestProfile('5AP');
    expect(evaluateEligibleBadgeIds(fresh)).not.toContain('b_welcome');
    expect(evaluateEligibleBadgeIds(fresh, { isAuthenticated: false })).not.toContain('b_welcome');
  });

  it('grants مجتهد الجزائر only for a signed-in account', () => {
    const fresh = createFreshGuestProfile('5AP');
    expect(evaluateEligibleBadgeIds(fresh, { isAuthenticated: true })).toContain('b_welcome');
  });
});

describe('grade_completed diploma badges', () => {
  it('catalog declares one diploma per grade, gated on that grade being fully completed', () => {
    (['1AP', '2AP', '3AP', '4AP', '5AP'] as const).forEach((grade) => {
      const badge = BADGES_CATALOG.find((b) => b.id === `diploma_${grade.toLowerCase()}`);
      expect(badge?.criteria).toEqual({ type: 'grade_completed', grade });
      expect(badge?.category).toBe('diploma');
    });
  });

  it('does not unlock diploma_1ap until every 1AP lesson (all subjects) is completed', () => {
    const all1apIds = COURSES_DATA.filter((l) => l.grade === '1AP').map((l) => l.id);
    expect(all1apIds.length).toBeGreaterThan(0);

    const fresh = createFreshGuestProfile('1AP');
    expect(evaluateEligibleBadgeIds(fresh)).not.toContain('diploma_1ap');

    const almostDone = { ...fresh, completedLessonIds: all1apIds.slice(0, -1) };
    expect(evaluateEligibleBadgeIds(almostDone)).not.toContain('diploma_1ap');

    const allDone = { ...fresh, completedLessonIds: all1apIds };
    expect(evaluateEligibleBadgeIds(allDone)).toContain('diploma_1ap');
  });

  it('completing 1AP does not also unlock the 2AP diploma', () => {
    const all1apIds = COURSES_DATA.filter((l) => l.grade === '1AP').map((l) => l.id);
    const profile = { ...createFreshGuestProfile('1AP'), completedLessonIds: all1apIds };
    expect(evaluateEligibleBadgeIds(profile)).not.toContain('diploma_2ap');
  });
});
