/**
 * preschoolBadgesData.ts
 * Catalogue des badges débloquables dans Mode Éveil (Maternelle 0AP).
 * Critères simples et vérifiables sans moteur externe — tout est data-driven.
 */

export type PreschoolBadgeCriteria =
  | { type: 'activities_count'; count: number }
  | { type: 'module_complete'; moduleId: string }
  | { type: 'modules_count'; count: number }
  | { type: 'streak_days'; days: number };

export interface PreschoolBadge {
  id: string;
  icon: string;
  titleI18n: { ar: string; fr: string; en: string };
  descI18n:  { ar: string; fr: string; en: string };
  criteria: PreschoolBadgeCriteria;
}

export const PRESCHOOL_BADGES: PreschoolBadge[] = [
  // ── Premières activités ──────────────────────────────────────────────────────
  {
    id: 'pb_first_star',
    icon: '⭐',
    titleI18n: { ar: 'أَوَّلُ نَجْمَة', fr: 'Première Étoile', en: 'First Star' },
    descI18n:  { ar: 'أَنْهَيْتَ أَوَّلَ نَشَاط!', fr: 'Tu as terminé ta première activité !', en: 'You completed your first activity!' },
    criteria: { type: 'activities_count', count: 1 },
  },
  {
    id: 'pb_5_activities',
    icon: '🌟',
    titleI18n: { ar: 'مُتَعَلِّمٌ نَشِيط', fr: 'Apprenant Actif', en: 'Active Learner' },
    descI18n:  { ar: 'أَتْمَمْتَ خَمْسَةَ أَنْشِطَة!', fr: '5 activités terminées, bravo !', en: '5 activities done, great job!' },
    criteria: { type: 'activities_count', count: 5 },
  },
  {
    id: 'pb_20_activities',
    icon: '💪',
    titleI18n: { ar: 'مُجْتَهِدٌ وَمُتَفَوِّق', fr: 'Super Persévérant', en: 'Super Perseverant' },
    descI18n:  { ar: 'عِشْرُونَ نَشَاطاً أَتْمَمْتَهَا!', fr: '20 activités terminées !', en: '20 activities completed!' },
    criteria: { type: 'activities_count', count: 20 },
  },
  {
    id: 'pb_50_activities',
    icon: '🏅',
    titleI18n: { ar: 'بَطَلُ التَّعَلُّم', fr: 'Champion de l\'Apprentissage', en: 'Learning Champion' },
    descI18n:  { ar: 'خَمْسُونَ نَشَاطاً! أَنْتَ رَائِعٌ!', fr: '50 activités ! Tu es formidable !', en: '50 activities! You are amazing!' },
    criteria: { type: 'activities_count', count: 50 },
  },

  // ── Complétion de modules spécifiques ─────────────────────────────────────
  {
    id: 'pb_letters_done',
    icon: '🔤',
    titleI18n: { ar: 'عَارِفُ الحُرُوف', fr: 'Maître des Lettres', en: 'Letter Master' },
    descI18n:  { ar: 'أَتْقَنْتَ كُلَّ حُرُوفِ اللُّغَة!', fr: 'Tu maîtrises toutes les lettres !', en: 'You mastered all the letters!' },
    criteria: { type: 'module_complete', moduleId: 'preschool-letters' },
  },
  {
    id: 'pb_numbers_done',
    icon: '🔢',
    titleI18n: { ar: 'مَاهِرُ الأَرْقَام', fr: 'Champion des chiffres', en: 'Number champion' },
    descI18n:  { ar: 'تَعَلَّمْتَ الأَعْدَادَ مِنْ صِفْرٍ إِلَى عَشَرَة!', fr: 'Tu connais les chiffres de 0 à 10 !', en: 'You know the numbers from 0 to 10!' },
    criteria: { type: 'module_complete', moduleId: 'preschool-numbers-0-10' },
  },
  {
    id: 'pb_shapes_done',
    icon: '🔷',
    titleI18n: { ar: 'خَبِيرُ الأَشْكَال', fr: 'Expert des Formes', en: 'Shape Expert' },
    descI18n:  { ar: 'تَعْرِفُ كُلَّ الأَشْكَالِ الهَنْدَسِيَّة!', fr: 'Tu reconnais toutes les formes !', en: 'You know all the shapes!' },
    criteria: { type: 'module_complete', moduleId: 'preschool-shapes' },
  },
  {
    id: 'pb_colors_done',
    icon: '🎨',
    titleI18n: { ar: 'سَيِّدُ الأَلْوَان', fr: 'Maître des Couleurs', en: 'Color Master' },
    descI18n:  { ar: 'تَمَيَّزْتَ فِي جَمِيعِ الأَلْوَان!', fr: 'Tu maîtrises toutes les couleurs !', en: 'You mastered all the colors!' },
    criteria: { type: 'module_complete', moduleId: 'preschool-colors' },
  },
  {
    id: 'pb_animals_done',
    icon: '🦁',
    titleI18n: { ar: 'صَدِيقُ الحَيَوَانَات', fr: 'Ami des Animaux', en: 'Animal Friend' },
    descI18n:  { ar: 'تَعَرَّفْتَ عَلَى كُلِّ الحَيَوَانَات!', fr: 'Tu connais tous les animaux !', en: 'You know all the animals!' },
    criteria: { type: 'module_complete', moduleId: 'preschool-animals' },
  },
  {
    id: 'pb_algeria_done',
    icon: '🇩🇿',
    titleI18n: { ar: 'فَخْرُ الجَزَائِر', fr: 'Fier de l\'Algérie', en: 'Proud of Algeria' },
    descI18n:  { ar: 'تَعَلَّمْتَ تُرَاثَ وَجَمَالَ الجَزَائِر!', fr: 'Tu connais le beau patrimoine algérien !', en: 'You learned about Algeria\'s heritage!' },
    criteria: { type: 'module_complete', moduleId: 'preschool-algeria' },
  },
  {
    id: 'pb_emotions_done',
    icon: '💚',
    titleI18n: { ar: 'عَارِفُ المَشَاعِر', fr: 'Expert des Émotions', en: 'Emotions Expert' },
    descI18n:  { ar: 'فَهِمْتَ جَمِيعَ المَشَاعِرِ وَالأَحَاسِيس!', fr: 'Tu comprends toutes les émotions !', en: 'You understand all emotions!' },
    criteria: { type: 'module_complete', moduleId: 'preschool-emotions' },
  },

  // ── Plusieurs modules complétés ────────────────────────────────────────────
  {
    id: 'pb_3_modules',
    icon: '🏆',
    titleI18n: { ar: 'مُتَعَلِّمٌ مُمْتَاز', fr: 'Super Apprenant', en: 'Super Learner' },
    descI18n:  { ar: 'أَتْمَمْتَ ثَلَاثَةَ مَسَارَاتٍ كَامِلَة!', fr: '3 parcours entièrement terminés !', en: '3 full learning paths done!' },
    criteria: { type: 'modules_count', count: 3 },
  },
  {
    id: 'pb_7_modules',
    icon: '🎓',
    titleI18n: { ar: 'بَطَلُ المَعْرِفَة', fr: 'Champion du Savoir', en: 'Knowledge Champion' },
    descI18n:  { ar: 'سَبْعَةُ مَسَارَاتٍ أَتْمَمْتَهَا بِنَجَاح!', fr: '7 parcours terminés avec succès !', en: '7 learning paths completed with success!' },
    criteria: { type: 'modules_count', count: 7 },
  },

  // ── Streaks ────────────────────────────────────────────────────────────────
  {
    id: 'pb_streak_1',
    icon: '⚡',
    titleI18n: { ar: 'مُتَحَدِّي اليَوْم', fr: 'Challenger du Jour', en: 'Daily Challenger' },
    descI18n:  { ar: 'أَنْهَيْتَ أَوَّلَ تَحَدِّي يَوْمِي!', fr: 'Tu as terminé ton premier défi du jour !', en: 'You finished your first daily challenge!' },
    criteria: { type: 'streak_days', days: 1 },
  },
  {
    id: 'pb_streak_3',
    icon: '🔥',
    titleI18n: { ar: 'مُوَاظِبٌ عَلَى التَّعَلُّم', fr: 'Assidu en Apprentissage', en: 'Consistent Learner' },
    descI18n:  { ar: 'تَعَلَّمْتَ ثَلَاثَةَ أَيَّامٍ مُتَتَالِيَة!', fr: '3 jours d\'apprentissage consécutifs !', en: '3 consecutive days of learning!' },
    criteria: { type: 'streak_days', days: 3 },
  },
  {
    id: 'pb_streak_7',
    icon: '🌈',
    titleI18n: { ar: 'أُسْطُورَةُ المُثَابَرَة', fr: 'Légende de la Persévérance', en: 'Perseverance Legend' },
    descI18n:  { ar: 'سَبْعَةُ أَيَّامٍ مُتَتَالِيَةٍ مِنَ التَّعَلُّم!', fr: '7 jours d\'apprentissage consécutifs !', en: '7 consecutive days of learning!' },
    criteria: { type: 'streak_days', days: 7 },
  },
];
