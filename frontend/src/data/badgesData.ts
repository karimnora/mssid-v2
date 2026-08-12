import { Badge } from '../types';

// Full badge catalog — each entry carries a real, checkable `criteria` (see
// utils/badgeEngine.ts). Unlocking is fully data-driven: adding/removing a
// badge here is enough, no separate trigger code needed anywhere else.
export const BADGES_CATALOG: Badge[] = [
  { id: 'b_welcome', titleAr: 'مجتهد الجزائر', descriptionAr: 'انضمامك لمنصة مسيد DZ والبدء في التعلم', icon: '🇩🇿', category: 'general', criteria: { type: 'first_login' } },

  { id: 'b_math_star', titleAr: 'عبقري الرياضيات', descriptionAr: 'إكمال 3 دروس في الرياضيات', icon: '📐', category: 'math', criteria: { type: 'lessons_completed_subject', subject: 'math', count: 3 } },
  { id: 'b_math_legend', titleAr: 'أسطورة الأرقام', descriptionAr: 'إكمال 10 دروس في الرياضيات', icon: '🧠', category: 'math', criteria: { type: 'lessons_completed_subject', subject: 'math', count: 10 } },
  { id: 'b_soroban_master', titleAr: 'بطل السوروبان', descriptionAr: 'إكمال درس السوروبان والحساب الذهني', icon: '🧮', category: 'soroban', criteria: { type: 'lessons_completed_subject', subject: 'soroban', count: 1 } },

  { id: 'b_arabic_hero', titleAr: 'فارس الضاد', descriptionAr: 'إكمال 3 دروس في اللغة العربية', icon: '📖', category: 'arabic', criteria: { type: 'lessons_completed_subject', subject: 'arabic', count: 3 } },
  { id: 'b_arabic_master', titleAr: 'أديب اللغة العربية', descriptionAr: 'إكمال 8 دروس في اللغة العربية', icon: '✍️', category: 'arabic', criteria: { type: 'lessons_completed_subject', subject: 'arabic', count: 8 } },

  { id: 'b_french_champion', titleAr: 'Champion de Français', descriptionAr: 'إكمال 3 دروس في اللغة الفرنسية', icon: '🇫🇷', category: 'french', criteria: { type: 'lessons_completed_subject', subject: 'french', count: 3 } },
  { id: 'b_english_master', titleAr: 'English Master', descriptionAr: 'إكمال 3 دروس في اللغة الإنجليزية', icon: '🇬🇧', category: 'english', criteria: { type: 'lessons_completed_subject', subject: 'english', count: 3 } },

  { id: 'b_science_explorer', titleAr: 'مستكشف العلوم', descriptionAr: 'إكمال 3 دروس في التربية العلمية والتكنولوجية', icon: '🔬', category: 'science', criteria: { type: 'lessons_completed_subject', subject: 'science', count: 3 } },
  { id: 'b_science_genius', titleAr: 'عالم صغير', descriptionAr: 'إكمال 8 دروس في التربية العلمية والتكنولوجية', icon: '🧪', category: 'science', criteria: { type: 'lessons_completed_subject', subject: 'science', count: 8 } },

  { id: 'b_history_geo_scholar', titleAr: 'مؤرخ صغير', descriptionAr: 'إكمال 3 دروس في التاريخ والجغرافيا', icon: '🗺️', category: 'history_geo', criteria: { type: 'lessons_completed_subject', subject: 'history_geo', count: 3 } },
  { id: 'b_islamic_light', titleAr: 'نور الهدى', descriptionAr: 'إكمال 3 دروس في التربية الإسلامية', icon: '🕌', category: 'islamic', criteria: { type: 'lessons_completed_subject', subject: 'islamic', count: 3 } },
  { id: 'b_civics_citizen', titleAr: 'مواطن المستقبل', descriptionAr: 'إكمال 3 دروس في التربية المدنية', icon: '🤝', category: 'civics', criteria: { type: 'lessons_completed_subject', subject: 'civics', count: 3 } },

  { id: 'b_all_rounder', titleAr: 'التلميذ الشامل', descriptionAr: 'إكمال 20 درساً في مواد مختلفة', icon: '🌟', category: 'general', criteria: { type: 'lessons_completed_total', count: 20 } },

  { id: 'b_exam_champion', titleAr: 'بطل شهادة 5AP', descriptionAr: 'إنهاء موضوع امتحان رسمي واحد على الأقل', icon: '🏆', category: 'exams', criteria: { type: 'exam_completed_count', count: 1 } },
  { id: 'b_exam_legend', titleAr: 'أسطورة الامتحانات', descriptionAr: 'إنهاء 5 مواضيع امتحانات رسمية', icon: '🎓', category: 'exams', criteria: { type: 'exam_completed_count', count: 5 } },

  { id: 'b_challenge_master', titleAr: 'بطل التحديات', descriptionAr: 'إنهاء 3 تحديات في نادي التحديات والمسابقات', icon: '⚡', category: 'challenges', criteria: { type: 'challenge_completed_count', count: 3 } },
  { id: 'b_challenge_legend', titleAr: 'أسطورة الحلبة', descriptionAr: 'إنهاء 10 تحديات في نادي التحديات والمسابقات', icon: '🔥', category: 'challenges', criteria: { type: 'challenge_completed_count', count: 10 } },

  { id: 'b_streak_flame', titleAr: 'شعلة المثابرة', descriptionAr: 'التعلم لمدة 3 أيام متتالية', icon: '🔥', category: 'streak', criteria: { type: 'streak_days', days: 3 } },
  { id: 'b_streak_legend', titleAr: 'أسطورة المواظبة', descriptionAr: 'التعلم لمدة 7 أيام متتالية', icon: '📅', category: 'streak', criteria: { type: 'streak_days', days: 7 } },

  { id: 'b_xp_1000', titleAr: 'صائد النقاط', descriptionAr: 'الوصول إلى 1000 نقطة خبرة', icon: '💎', category: 'general', criteria: { type: 'xp_total', xp: 1000 } },
];
