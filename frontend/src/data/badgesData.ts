import { Badge } from '../types';

// Full badge catalog — each entry carries a real, checkable `criteria` (see
// utils/badgeEngine.ts). Unlocking is fully data-driven: adding/removing a
// badge here is enough, no separate trigger code needed anywhere else.
export const BADGES_CATALOG: Badge[] = [
  { id: 'b_welcome', titleAr: 'مجتهد الجزائر', descriptionAr: 'انضمامك لمنصة مسيد DZ والبدء في التعلم', icon: '🇩🇿', category: 'general', criteria: { type: 'first_login' } },

  // Algerian Cultural & Heritage Badges
  { id: 'b_fennec_desert', titleAr: 'مستكشف الصحراء', descriptionAr: 'استكشاف معالم وبيئة الجزائر مع ديدو الفنك', icon: '🦊', category: 'general', criteria: { type: 'lessons_completed_total', count: 5 } },
  { id: 'b_tifinagh_friend', titleAr: 'صديق تيفيناغ', descriptionAr: 'استكشاف دروس وحروف اللغة الأمازيغية التفاعلية', icon: 'ⵣ', category: 'tamazight', criteria: { type: 'lessons_completed_subject', subject: 'tamazight', count: 1 } },
  { id: 'b_arabic_calligraphy', titleAr: 'عاشق الخط والبيان', descriptionAr: 'استكشاف جماليات الحروف والخط العربي وقواعد لغة الضاد', icon: '🖋️', category: 'arabic', criteria: { type: 'lessons_completed_subject', subject: 'arabic', count: 1 } },
  { id: 'b_algerian_heritage', titleAr: 'حامي التراث الوطني', descriptionAr: 'استكشاف خريطة ولايات الجزائر الـ 58 ومتحف التاريخ', icon: '🏛️', category: 'history_geo', criteria: { type: 'lessons_completed_subject', subject: 'history_geo', count: 2 } },
  { id: 'b_gold_dinar', titleAr: 'تاجر الدينار الصغير', descriptionAr: 'إتقان الحساب والتعامل بالدينار الجزائري في السوق التعليمي', icon: '🪙', category: 'math', criteria: { type: 'lab_visited', labId: 'algerian_market' } },
  { id: 'b_green_defender', titleAr: 'حامي البيئة والطاقة', descriptionAr: 'دراسة مشاريع الطاقة الشمسية وحماية الطبيعة الجزائرية', icon: '🌱', category: 'science', criteria: { type: 'lessons_completed_subject', subject: 'science', count: 5 } },

  // Subjects & Skills Badges
  { id: 'b_math_star', titleAr: 'عبقري الرياضيات', descriptionAr: 'إكمال 3 دروس في الرياضيات', icon: '📐', category: 'math', criteria: { type: 'lessons_completed_subject', subject: 'math', count: 3 } },
  { id: 'b_math_legend', titleAr: 'أسطورة الأرقام', descriptionAr: 'إكمال 10 دروس في الرياضيات', icon: '🧠', category: 'math', criteria: { type: 'lessons_completed_subject', subject: 'math', count: 10 } },
  { id: 'b_soroban_master', titleAr: 'بطل السوروبان والحساب الذهني', descriptionAr: 'إكمال درس السوروبان والتدريب على العداد', icon: '🧮', category: 'soroban', criteria: { type: 'lessons_completed_subject', subject: 'soroban', count: 1 } },

  { id: 'b_arabic_hero', titleAr: 'فارس لغة الضاد', descriptionAr: 'إكمال 3 دروس في اللغة العربية', icon: '📖', category: 'arabic', criteria: { type: 'lessons_completed_subject', subject: 'arabic', count: 3 } },
  { id: 'b_arabic_master', titleAr: 'أديب اللغة العربية', descriptionAr: 'إكمال 8 دروس في اللغة العربية', icon: '✍️', category: 'arabic', criteria: { type: 'lessons_completed_subject', subject: 'arabic', count: 8 } },

  { id: 'b_french_champion', titleAr: 'Champion de Français', descriptionAr: 'إكمال 3 دروس ومشاريع في اللغة الفرنسية', icon: '🇫🇷', category: 'french', criteria: { type: 'lessons_completed_subject', subject: 'french', count: 3 } },
  { id: 'b_english_master', titleAr: 'English Explorer', descriptionAr: 'إكمال 3 دروس واستماع حواري في اللغة الإنجليزية', icon: '🇬🇧', category: 'english', criteria: { type: 'lessons_completed_subject', subject: 'english', count: 3 } },

  { id: 'b_science_explorer', titleAr: 'مستكشف العلوم والتجارب', descriptionAr: 'إكمال 3 دروس في التربية العلمية والتكنولوجية', icon: '🔬', category: 'science', criteria: { type: 'lessons_completed_subject', subject: 'science', count: 3 } },
  { id: 'b_science_genius', titleAr: 'عالم صغير مخترع', descriptionAr: 'إكمال 8 دروس في التربية العلمية والتكنولوجية', icon: '🧪', category: 'science', criteria: { type: 'lessons_completed_subject', subject: 'science', count: 8 } },

  { id: 'b_history_geo_scholar', titleAr: 'مؤرخ الجزائر الصغير', descriptionAr: 'إكمال 3 دروس في التاريخ والجغرافيا الوطنية', icon: '🗺️', category: 'history_geo', criteria: { type: 'lessons_completed_subject', subject: 'history_geo', count: 3 } },
  { id: 'b_islamic_light', titleAr: 'نور الأخلاق والهدى', descriptionAr: 'إكمال 3 دروس في التربية الإسلامية والآداب النبوية', icon: '🕌', category: 'islamic', criteria: { type: 'lessons_completed_subject', subject: 'islamic', count: 3 } },
  { id: 'b_civics_citizen', titleAr: 'مواطن صالح ومبادر', descriptionAr: 'إكمال 3 دروس في التربية المدنية وقيم المواطنة', icon: '🤝', category: 'civics', criteria: { type: 'lessons_completed_subject', subject: 'civics', count: 3 } },

  { id: 'b_all_rounder', titleAr: 'التلميذ المتفوق الشامل', descriptionAr: 'إكمال 20 درساً في مختلف المواد والمستويات', icon: '🌟', category: 'general', criteria: { type: 'lessons_completed_total', count: 20 } },

  { id: 'b_exam_champion', titleAr: 'بطل الامتحانات الفصلية', descriptionAr: 'إنهاء موضوع امتحان رسمي واحد على الأقل بنجاح', icon: '🏆', category: 'exams', criteria: { type: 'exam_completed_count', count: 1 } },
  { id: 'b_exam_legend', titleAr: 'أسطورة الاختبارات والتحصيل', descriptionAr: 'إنهاء 5 مواضيع امتحانات رسمية مع التصحيح النموذجي', icon: '🎓', category: 'exams', criteria: { type: 'exam_completed_count', count: 5 } },

  { id: 'b_challenge_master', titleAr: 'بطل التحديات السريعة', descriptionAr: 'إنهاء 3 تحديات في نادي التحديات والمسابقات', icon: '⚡', category: 'challenges', criteria: { type: 'challenge_completed_count', count: 3 } },
  { id: 'b_challenge_legend', titleAr: 'أسطورة الحلبة والسرعة', descriptionAr: 'إنهاء 10 تحديات في نادي التحديات والمسابقات', icon: '🔥', category: 'challenges', criteria: { type: 'challenge_completed_count', count: 10 } },

  { id: 'b_streak_flame', titleAr: 'شعلة المثابرة اليومية', descriptionAr: 'التعلم لمدة 3 أيام متتالية بدون انقطاع', icon: '🔥', category: 'streak', criteria: { type: 'streak_days', days: 3 } },
  { id: 'b_streak_legend', titleAr: 'أسطورة المواظبة والنجاح', descriptionAr: 'التعلم لمدة 7 أيام متتالية بكل عزيمة', icon: '📅', category: 'streak', criteria: { type: 'streak_days', days: 7 } },

  { id: 'b_xp_1000', titleAr: 'صائد النقاط الماسية', descriptionAr: 'الوصول إلى 1000 نقطة خبرة XP في منصة مسيد', icon: '💎', category: 'general', criteria: { type: 'xp_total', xp: 1000 } },

  { id: 'b_game_first', titleAr: 'لاعب مبتدئ', descriptionAr: 'إتمام أول لعبة ترويحية في نادي التحديات', icon: '🎮', category: 'games', criteria: { type: 'game_completed_count', count: 1 } },
  { id: 'b_arcade_master', titleAr: 'سيد الألعاب', descriptionAr: 'إتمام 3 ألعاب ترويحية مختلفة في نادي التحديات', icon: '🕹️', category: 'games', criteria: { type: 'game_completed_count', count: 3 } },

  // Grade-completion diplomas — unlock only once every lesson of that grade (all subjects, all
  // trimesters) is done. HonorCertificatesStudioModal.tsx maps each of these ids to the matching
  // "graduate" certificate template and locks that template until the badge is earned.
  { id: 'diploma_1ap', titleAr: 'دِبْلُومُ السَّنَةِ الأُولَى ابْتِدَائِيّ', descriptionAr: 'إكمال جميع دروس السنة الأولى ابتدائي في كل المواد', icon: '🔤', category: 'diploma', criteria: { type: 'grade_completed', grade: '1AP' } },
  { id: 'diploma_2ap', titleAr: 'دِبْلُومُ السَّنَةِ الثَّانِيَة ابْتِدَائِيّ', descriptionAr: 'إكمال جميع دروس السنة الثانية ابتدائي في كل المواد', icon: '💯', category: 'diploma', criteria: { type: 'grade_completed', grade: '2AP' } },
  { id: 'diploma_3ap', titleAr: 'دِبْلُومُ السَّنَةِ الثَّالِثَة ابْتِدَائِيّ', descriptionAr: 'إكمال جميع دروس السنة الثالثة ابتدائي في كل المواد', icon: '📚', category: 'diploma', criteria: { type: 'grade_completed', grade: '3AP' } },
  { id: 'diploma_4ap', titleAr: 'دِبْلُومُ السَّنَةِ الرَّابِعَة ابْتِدَائِيّ', descriptionAr: 'إكمال جميع دروس السنة الرابعة ابتدائي في كل المواد', icon: '🗺️', category: 'diploma', criteria: { type: 'grade_completed', grade: '4AP' } },
  { id: 'diploma_5ap', titleAr: 'دِبْلُومُ نِهَايَةِ التَّعْلِيمِ الاِبْتِدَائِيّ', descriptionAr: 'إكمال جميع دروس السنة الخامسة ابتدائي في كل المواد', icon: '🎓', category: 'diploma', criteria: { type: 'grade_completed', grade: '5AP' } },
];
