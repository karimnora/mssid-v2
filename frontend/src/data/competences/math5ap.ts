import type { Competence, LessonCompetences } from './types';

const NUMBERS = 'الأعداد والحساب';
const SPACE = 'الفضاء والهندسة';
const MEASURES = 'المقادير والقياس';
const PROPORTION = 'التناسبية وتنظيم المعطيات';

const c = (id: string, domainAr: string, labelAr: string, labelFr: string): Competence => ({
  id, grade: '5AP', subject: 'math', domainAr, labelAr, labelFr, inReferentiel: true,
});

/**
 * One competence per skill a parent can act on (« Amine bloque sur la division »), not per domain.
 * Ids of the first, coarser version are kept so that stats already recorded stay attached.
 */
export const MATH_5AP_COMPETENCES: Competence[] = [
  c('math-5ap-c-large-numbers', NUMBERS, 'أَقْرَأُ وَأَكْتُبُ الأَعْدَادَ الطَّبِيعِيَّةَ إِلَى المِلْيَارِ', 'Lire et écrire les nombres naturels jusqu’au milliard'),
  c('math-5ap-c-operations', NUMBERS, 'أُنْجِزُ الجَمْعَ وَالطَّرْحَ وَالضَّرْبَ عَلَى الأَعْدَادِ الطَّبِيعِيَّةِ', 'Poser addition, soustraction et multiplication des nombres naturels'),
  c('math-5ap-c-division', NUMBERS, 'أُنْجِزُ القِسْمَةَ الإِقْلِيدِيَّةَ وَأَتَحَقَّقُ مِنْ نَتِيجَتِهَا', 'Poser la division euclidienne et la vérifier'),
  c('math-5ap-c-fractions', NUMBERS, 'أَقْرَأُ الكُسُورَ وَأُقَارِنُهَا وَأَحْسُبُ بِهَا', 'Lire, comparer et calculer avec les fractions'),
  c('math-5ap-c-decimals', NUMBERS, 'أُنْجِزُ العَمَلِيَّاتِ عَلَى الأَعْدَادِ العَشْرِيَّةِ', 'Calculer avec les nombres décimaux'),
  c('math-5ap-c-proportion', PROPORTION, 'أَحُلُّ وَضْعِيَّاتِ التَّنَاسُبِيَّةِ (الرُّجُوعُ إِلَى الوَحْدَةِ)', 'Résoudre une situation de proportionnalité (règle de trois)'),
  c('math-5ap-c-percentage', PROPORTION, 'أَحْسُبُ النِّسْبَةَ المِئَوِيَّةَ وَأَسْتَعْمِلُ المِقْيَاسَ', 'Calculer un pourcentage et utiliser une échelle'),
  c('math-5ap-c-data', PROPORTION, 'أُنَظِّمُ مُعْطَيَاتٍ فِي جَدْوَلٍ أَوْ مُخَطَّطٍ', 'Organiser des données dans un tableau ou un diagramme'),
  c('math-5ap-c-measures', MEASURES, 'أُحَوِّلُ وَحَدَاتِ الطُّولِ وَالكُتْلَةِ وَالسِّعَةِ', 'Convertir longueurs, masses et capacités'),
  c('math-5ap-c-durations', MEASURES, 'أَحْسُبُ المُدَدَ وَأُحَوِّلُ وَحَدَاتِ الزَّمَنِ', 'Calculer des durées et convertir les unités de temps'),
  c('math-5ap-c-areas', MEASURES, 'أَحْسُبُ مُحِيطَ وَمِسَاحَةَ المُرَبَّعِ وَالمُسْتَطِيلِ', 'Calculer périmètre et aire du carré et du rectangle'),
  c('math-5ap-c-circle', SPACE, 'أَرْسُمُ الدَّائِرَةَ وَأُمَيِّزُ مَرْكَزَهَا وَنِصْفَ قُطْرِهَا وَقُطْرَهَا', 'Tracer un cercle, connaître centre, rayon et diamètre'),
  c('math-5ap-c-geometry', SPACE, 'أُمَيِّزُ المُسْتَقِيمَاتِ المُتَعَامِدَةَ وَالمُتَوَازِيَةَ وَالزَّوَايَا', 'Reconnaître droites perpendiculaires, parallèles et angles'),
  c('math-5ap-c-polygons', SPACE, 'أُمَيِّزُ المُضَلَّعَاتِ وَأَنْوَاعَ المُثَلَّثَاتِ', 'Reconnaître les polygones et les sortes de triangles'),
  c('math-5ap-c-symmetry', SPACE, 'أُكْمِلُ شَكْلاً بِالتَّنَاظُرِ وَأَتَعَرَّفُ عَلَى المُجَسَّمَاتِ', 'Compléter une figure par symétrie, reconnaître les solides'),
  c('math-5ap-c-volumes', MEASURES, 'أُقَدِّرُ الحَجْمَ بِعَدِّ مُكَعَّبَاتِ الوَحْدَةِ (دُونَ قَانُونٍ جَاهِزٍ)', 'Estimer un volume en comptant des cubes-unités, sans formule'),
];

export const MATH_5AP_LESSON_COMPETENCES: LessonCompetences[] = [
  { lessonId: 'math-5ap-large-numbers', competenceIds: ['math-5ap-c-large-numbers'] },
  { lessonId: 'math-5ap-operations', competenceIds: ['math-5ap-c-operations'] },
  { lessonId: 'math-5ap-division', competenceIds: ['math-5ap-c-division'] },
  { lessonId: 'math-5ap-fractions', competenceIds: ['math-5ap-c-fractions'] },
  { lessonId: 'math-5ap-decimals', competenceIds: ['math-5ap-c-decimals'] },
  { lessonId: 'math-5ap-lengths-masses-capacities', competenceIds: ['math-5ap-c-measures'] },
  { lessonId: 'math-5ap-perimeters-areas', competenceIds: ['math-5ap-c-areas'] },
  { lessonId: 'math-5ap-durations', competenceIds: ['math-5ap-c-durations'] },
  { lessonId: 'math-5ap-lines-angles', competenceIds: ['math-5ap-c-geometry'] },
  { lessonId: 'math-5ap-polygons-triangles', competenceIds: ['math-5ap-c-polygons'] },
  { lessonId: 'math-5ap-symmetry-solides', competenceIds: ['math-5ap-c-symmetry', 'math-5ap-c-volumes'] },
  { lessonId: 'math-5ap-proportionality-ruleofthree', competenceIds: ['math-5ap-c-proportion'] },
  { lessonId: 'math-5ap-percentage-scale', competenceIds: ['math-5ap-c-percentage'] },
  { lessonId: 'math-5ap-data-organization', competenceIds: ['math-5ap-c-data'] },
  { lessonId: 'math-5ap-circle-radius', competenceIds: ['math-5ap-c-circle'] },
  { lessonId: 'soroban-basics', competenceIds: ['math-5ap-c-operations'] },
];
