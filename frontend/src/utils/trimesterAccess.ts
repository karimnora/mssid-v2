import { CourseLesson } from '../types';
import { UserRole } from '../types/auth';
import { isPremiumRole } from '../access/entitlements';

export interface TrimesterAccessContext {
  enablePayments: boolean;
  enableTrimesterPaywall: boolean;
  userRole: UserRole | null | undefined;
}


/**
 * V2 access matrix — one rule, used by product copy and by the lock helpers.
 * Shipped V1 lessons stay free. Premium, when payments are actually collectable,
 * sells depth (carnet, cahiers, CEM pack, extra AI quota), not T2/T3.
 */
export const V2_ACCESS = {
  shippedLessonsT1T2T3: 'free',
  parentNotebookBasic: 'free',
  competenceCahiers: 'premium-when-payments',
  cemPrep: 'premium-when-payments',
  immersiveLabs: 'premium-when-payments',
  aiAssistant: 'daily-quota',
} as const;

export type PremiumModule = 'cahiers' | 'cem-prep' | 'immersive-labs';

/**
 * Trimester 1 is always free. T2/T3 require ROLE_PREMIUM/ADMIN only once BOTH enablePayments
 * (master kill-switch) and enableTrimesterPaywall are on — same pair the backend reads in
 * PremiumContentController.
 *
 * V2 product rule: do not flip enableTrimesterPaywall. The paid offer is modules, not a
 * lock of already-promised trimesters. Defaults stay off so existing users keep T2/T3.
 */
export function isLessonLocked(lesson: Pick<CourseLesson, 'trimester'>, ctx: TrimesterAccessContext): boolean {
  if (!ctx.enablePayments || !ctx.enableTrimesterPaywall) return false;
  if (!lesson.trimester || lesson.trimester === 1) return false;
  return !isPremiumRole(ctx.userRole);
}

/** New V2 modules stay open while payments are off. When payments are on, they need premium. */
export function isPremiumModuleLocked(_module: PremiumModule, ctx: TrimesterAccessContext): boolean {
  if (!ctx.enablePayments) return false;
  return !isPremiumRole(ctx.userRole);
}
