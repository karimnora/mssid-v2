import { CourseLesson } from '../types';
import { UserRole } from '../types/auth';

export interface TrimesterAccessContext {
  enablePayments: boolean;
  enableTrimesterPaywall: boolean;
  userRole: UserRole | null | undefined;
}

const PREMIUM_OR_STAFF_ROLES: UserRole[] = ['ROLE_PREMIUM', 'ROLE_ADMIN', 'ROLE_TEACHER'];

/**
 * Trimester 1 is always free for everyone. T2/T3 require ROLE_PREMIUM/TEACHER/ADMIN, but only once
 * BOTH enablePayments (the master kill-switch for the whole payment subsystem) and
 * enableTrimesterPaywall (the specific T2/T3 gate, off by default during the pre-launch content
 * review phase — see featureFlags.ts) are on. This is a client-side ("soft") gate: lesson content
 * is statically bundled into the app today, so it's a UX/conversion nudge, not a security boundary —
 * true content protection would require serving T2/T3 lessons from an API that checks the
 * subscription server-side instead of shipping them in the JS bundle regardless of role.
 */
export function isLessonLocked(lesson: Pick<CourseLesson, 'trimester'>, ctx: TrimesterAccessContext): boolean {
  if (!ctx.enablePayments || !ctx.enableTrimesterPaywall) return false;
  if (!lesson.trimester || lesson.trimester === 1) return false;
  return !ctx.userRole || !PREMIUM_OR_STAFF_ROLES.includes(ctx.userRole);
}
