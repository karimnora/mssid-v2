import { UserProfile, Badge, BadgeCriteria } from '../types';
import { COURSES_DATA } from '../data/coursesData';
import { BADGES_CATALOG } from '../data/badgesData';

const SUBJECT_BY_LESSON_ID = new Map(COURSES_DATA.map((lesson) => [lesson.id, lesson.subject]));

// Every lesson id that belongs to a given grade, precomputed once — used by the 'grade_completed'
// diploma criteria below so checking "is this whole year done?" is a Set membership pass, not a
// re-filter of the ~390-lesson catalog on every evaluation.
const LESSON_IDS_BY_GRADE = new Map<string, string[]>();
for (const lesson of COURSES_DATA) {
  const ids = LESSON_IDS_BY_GRADE.get(lesson.grade) ?? [];
  ids.push(lesson.id);
  LESSON_IDS_BY_GRADE.set(lesson.grade, ids);
}

export type BadgeEvalOptions = {
  /** Welcome (`first_login`) is for a real account, not a guest session after logout. */
  isAuthenticated?: boolean;
};

function isCriteriaMet(criteria: BadgeCriteria, profile: UserProfile, options?: BadgeEvalOptions): boolean {
  switch (criteria.type) {
    case 'first_login':
      return options?.isAuthenticated === true;
    case 'lessons_completed_subject': {
      const count = profile.completedLessonIds.filter((id) => SUBJECT_BY_LESSON_ID.get(id) === criteria.subject).length;
      return count >= criteria.count;
    }
    case 'lessons_completed_total':
      return profile.completedLessonIds.length >= criteria.count;
    case 'streak_days':
      return profile.streakDays >= criteria.days;
    case 'xp_total':
      return profile.xp >= criteria.xp;
    case 'exam_completed_count':
      return (profile.completedExamIds || []).length >= criteria.count;
    case 'challenge_completed_count':
      return (profile.completedChallengeIds || []).length >= criteria.count;
    case 'game_completed_count':
      return (profile.completedGameIds || []).length >= criteria.count;
    case 'lab_visited':
      return (profile.completedLabIds || []).includes(criteria.labId);
    case 'grade_completed': {
      const gradeLessonIds = LESSON_IDS_BY_GRADE.get(criteria.grade) ?? [];
      if (gradeLessonIds.length === 0) return false;
      const completed = new Set(profile.completedLessonIds);
      return gradeLessonIds.every((id) => completed.has(id));
    }
    default:
      return false;
  }
}

/** Pure: every badge id whose criteria is currently satisfied by this profile (regardless of what's already unlocked). */
export function evaluateEligibleBadgeIds(profile: UserProfile, options?: BadgeEvalOptions): string[] {
  return BADGES_CATALOG.filter((b) => isCriteriaMet(b.criteria, profile, options)).map((b) => b.id);
}

/**
 * Re-evaluates the full catalog against the profile and merges any newly-earned badge
 * ids in. Already-owned badges are never removed, even if the catalog changes later.
 * Returns the SAME profile reference when nothing new was unlocked, so callers can use
 * that to skip a state update (see the effect in App.tsx).
 */
export function applyBadgeEvaluation(
  profile: UserProfile,
  options?: BadgeEvalOptions,
): { profile: UserProfile; newlyUnlocked: Badge[] } {
  const eligibleIds = evaluateEligibleBadgeIds(profile, options);
  const newlyUnlockedIds = eligibleIds.filter((id) => !profile.badges.includes(id));

  if (newlyUnlockedIds.length === 0) {
    return { profile, newlyUnlocked: [] };
  }

  const now = new Date().toISOString();
  const badgeUnlockedAt = { ...profile.badgeUnlockedAt };
  newlyUnlockedIds.forEach((id) => {
    badgeUnlockedAt[id] = now;
  });

  return {
    profile: {
      ...profile,
      badges: [...profile.badges, ...newlyUnlockedIds],
      badgeUnlockedAt,
    },
    newlyUnlocked: BADGES_CATALOG.filter((b) => newlyUnlockedIds.includes(b.id)),
  };
}

/** Human-readable "how to unlock" hint for a locked badge, shown in the badges gallery. */
export function describeCriteria(criteria: BadgeCriteria): string {
  switch (criteria.type) {
    case 'first_login':
      return 'يُمنح تلقائياً عند إنشاء حسابك';
    case 'lessons_completed_subject':
      return `أكمل ${criteria.count} دروس في هذه المادة`;
    case 'lessons_completed_total':
      return `أكمل ${criteria.count} درساً في مختلف المواد`;
    case 'streak_days':
      return `تعلّم لمدة ${criteria.days} أيام متتالية`;
    case 'xp_total':
      return `اجمع ${criteria.xp} نقطة خبرة`;
    case 'exam_completed_count':
      return criteria.count === 1 ? 'أنهِ موضوع امتحان رسمي واحد' : `أنهِ ${criteria.count} مواضيع امتحانات رسمية`;
    case 'challenge_completed_count':
      return `أنهِ ${criteria.count} تحديات في نادي التحديات`;
    case 'game_completed_count':
      return criteria.count === 1 ? 'أتمم لعبة ترويحية واحدة' : `أتمم ${criteria.count} ألعاب ترويحية`;
    case 'lab_visited':
      return 'افتح المختبر التفاعلي المطلوب مرة واحدة';
    case 'grade_completed':
      return `أكمل جميع دروس السنة ${criteria.grade} في كل المواد`;
    default:
      return '';
  }
}
