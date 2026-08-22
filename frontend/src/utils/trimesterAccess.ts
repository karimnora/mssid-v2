import { CourseLesson } from '../types';
import { UserRole } from '../types/auth';

export interface TrimesterAccessContext {
  enablePayments: boolean;
  enableTrimesterPaywall: boolean;
  userRole: UserRole | null | undefined;
}

const PREMIUM_OR_STAFF_ROLES: UserRole[] = ['ROLE_PREMIUM', 'ROLE_ADMIN'];

/**
 * Trimester 1 is always free. T2/T3 require ROLE_PREMIUM/ADMIN only once BOTH enablePayments
 * (master kill-switch) and enableTrimesterPaywall are on — same pair the backend reads in
 * PremiumContentController. Flags off = free-launch window (payments not collectable yet).
 * Lessons marked premiumContentPending fetch their body from GET /api/v1/courses/premium-lessons/{id};
 * fully bundled T2/T3 lessons (including math-5ap-division) skip that fetch. This helper is the
 * catalog/UX lock that opens the paywall modal before a fetch, once both payment flags are on.
 */
export function isLessonLocked(lesson: Pick<CourseLesson, 'trimester'>, ctx: TrimesterAccessContext): boolean {
  if (!ctx.enablePayments || !ctx.enableTrimesterPaywall) return false;
  if (!lesson.trimester || lesson.trimester === 1) return false;
  return !ctx.userRole || !PREMIUM_OR_STAFF_ROLES.includes(ctx.userRole);
}
