import { describe, it, expect } from 'vitest';
import { isLessonLocked } from './trimesterAccess';

const baseCtx = { enablePayments: true, enableTrimesterPaywall: true, userRole: undefined as any };

describe('isLessonLocked (trimester paywall)', () => {
  it('never locks Trimester 1, regardless of role or flags', () => {
    expect(isLessonLocked({ trimester: 1 }, { ...baseCtx, userRole: undefined })).toBe(false);
    expect(isLessonLocked({ trimester: 1 }, { ...baseCtx, userRole: 'ROLE_FREE' })).toBe(false);
  });

  it('never locks a lesson with no trimester set', () => {
    expect(isLessonLocked({ trimester: undefined }, baseCtx)).toBe(false);
  });

  it('locks Trimester 2/3 for a guest (no role) when both flags are on', () => {
    expect(isLessonLocked({ trimester: 2 }, { ...baseCtx, userRole: undefined })).toBe(true);
    expect(isLessonLocked({ trimester: 3 }, { ...baseCtx, userRole: undefined })).toBe(true);
  });

  it('locks Trimester 2/3 for a ROLE_FREE account', () => {
    expect(isLessonLocked({ trimester: 2 }, { ...baseCtx, userRole: 'ROLE_FREE' })).toBe(true);
  });

  it('never locks anything when enableTrimesterPaywall is off (pre-launch content review)', () => {
    expect(isLessonLocked({ trimester: 2 }, { ...baseCtx, enableTrimesterPaywall: false, userRole: undefined })).toBe(false);
    expect(isLessonLocked({ trimester: 3 }, { ...baseCtx, enableTrimesterPaywall: false, userRole: 'ROLE_FREE' })).toBe(false);
  });

  it('never locks anything when enablePayments (master kill-switch) is off, even if enableTrimesterPaywall is on', () => {
    expect(isLessonLocked({ trimester: 2 }, { ...baseCtx, enablePayments: false, userRole: undefined })).toBe(false);
  });

  it('unlocks Trimester 2/3 for ROLE_PREMIUM, ROLE_TEACHER, and ROLE_ADMIN', () => {
    expect(isLessonLocked({ trimester: 2 }, { ...baseCtx, userRole: 'ROLE_PREMIUM' })).toBe(false);
    expect(isLessonLocked({ trimester: 3 }, { ...baseCtx, userRole: 'ROLE_TEACHER' })).toBe(false);
    expect(isLessonLocked({ trimester: 2 }, { ...baseCtx, userRole: 'ROLE_ADMIN' })).toBe(false);
  });
});
