import { describe, expect, it } from 'vitest';
import { evaluateEligibleBadgeIds } from './badgeEngine';
import { BADGES_CATALOG } from '../data/badgesData';
import { createFreshGuestProfile } from '../hooks/useUserProgress';

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
