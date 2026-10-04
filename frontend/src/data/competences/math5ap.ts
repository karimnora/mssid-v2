import type { Competence, LessonCompetences } from './types';

const NUMBERS = 'الأعداد والحساب';
const SPACE = 'الفضاء والهندسة';
const MEASURES = 'المقادير والقياس';
const PROPORTION = 'التناسبية وتنظيم المعطيات';

export const MATH_5AP_COMPETENCES: Competence[] = [
  {
    id: 'math-5ap-c-large-numbers',
    grade: '5AP',
    subject: 'math',
    domainAr: NUMBERS,
    labelAr: 'أَقْرَأُ وَأَكْتُبُ الأَعْدَادَ الطَّبِيعِيَّةَ إِلَى المِلْيَارِ',
    labelFr: 'Lire et écrire les nombres naturels jusqu’au milliard',
    inReferentiel: true,
  },
  {
    id: 'math-5ap-c-operations',
    grade: '5AP',
    subject: 'math',
    domainAr: NUMBERS,
    labelAr: 'أُنْجِزُ العَمَلِيَّاتِ الأَرْبَعَ وَالقِسْمَةَ الإِقْلِيدِيَّةَ',
    labelFr: 'Effectuer les quatre opérations et la division euclidienne',
    inReferentiel: true,
  },
  {
    id: 'math-5ap-c-decimals',
    grade: '5AP',
    subject: 'math',
    domainAr: NUMBERS,
    labelAr: 'أُنْجِزُ العَمَلِيَّاتِ عَلَى الأَعْدَادِ العَشْرِيَّةِ وَالكُسُورِ',
    labelFr: 'Calculer avec les décimaux et les fractions',
    inReferentiel: true,
  },
  {
    id: 'math-5ap-c-proportion',
    grade: '5AP',
    subject: 'math',
    domainAr: PROPORTION,
    labelAr: 'أَحْسُبُ النِّسْبَةَ المِئَوِيَّةَ وَالمِقْيَاسَ وَالسُّرْعَةَ المُتَوَسِّطَةَ',
    labelFr: 'Calculer un pourcentage, une échelle et une vitesse moyenne',
    inReferentiel: true,
  },
  {
    id: 'math-5ap-c-areas',
    grade: '5AP',
    subject: 'math',
    domainAr: MEASURES,
    labelAr: 'أَحْسُبُ المُحِيطَ وَالمِسَاحَةَ وَأَتَعَرَّفُ عَلَى الدَّائِرَةِ',
    labelFr: 'Calculer périmètre et aire, reconnaître le cercle',
    inReferentiel: true,
  },
  {
    id: 'math-5ap-c-volumes',
    grade: '5AP',
    subject: 'math',
    domainAr: MEASURES,
    labelAr: 'أُقَدِّرُ الحَجْمَ بَعَدِّ مُكَعَّبَاتِ الوَحْدَةِ (دُونَ قَانُونٍ جَاهِزٍ)',
    labelFr: 'Estimer un volume en comptant des cubes-unités, sans formule',
    inReferentiel: true,
  },
  {
    id: 'math-5ap-c-measures',
    grade: '5AP',
    subject: 'math',
    domainAr: MEASURES,
    labelAr: 'أُحَوِّلُ الأَطْوَالَ وَالكُتَلَ وَالسِّعَاتِ وَالمُدَدَ',
    labelFr: 'Convertir longueurs, masses, capacités et durées',
    inReferentiel: true,
  },
  {
    id: 'math-5ap-c-geometry',
    grade: '5AP',
    subject: 'math',
    domainAr: SPACE,
    labelAr: 'أُمَيِّزُ المُسْتَقِيمَاتِ وَالزَّوَايَا وَالمُضَلَّعَاتِ',
    labelFr: 'Distinguer droites, angles et polygones',
    inReferentiel: true,
  },
  {
    id: 'math-5ap-c-data',
    grade: '5AP',
    subject: 'math',
    domainAr: PROPORTION,
    labelAr: 'أُنَظِّمُ مُعْطَيَاتٍ فِي جَدْوَلٍ أَوْ مُخَطَّطٍ',
    labelFr: 'Organiser des données dans un tableau ou un diagramme',
    inReferentiel: true,
  },
];

export const MATH_5AP_LESSON_COMPETENCES: LessonCompetences[] = [
  { lessonId: 'math-5ap-large-numbers', competenceIds: ['math-5ap-c-large-numbers'] },
  { lessonId: 'math-5ap-operations', competenceIds: ['math-5ap-c-operations'] },
  { lessonId: 'math-5ap-division', competenceIds: ['math-5ap-c-operations'] },
  { lessonId: 'math-5ap-fractions', competenceIds: ['math-5ap-c-decimals'] },
  { lessonId: 'math-5ap-decimals', competenceIds: ['math-5ap-c-decimals'] },
  { lessonId: 'math-5ap-lengths-masses-capacities', competenceIds: ['math-5ap-c-measures'] },
  { lessonId: 'math-5ap-perimeters-areas', competenceIds: ['math-5ap-c-areas'] },
  { lessonId: 'math-5ap-durations', competenceIds: ['math-5ap-c-measures'] },
  { lessonId: 'math-5ap-lines-angles', competenceIds: ['math-5ap-c-geometry'] },
  { lessonId: 'math-5ap-polygons-triangles', competenceIds: ['math-5ap-c-geometry'] },
  { lessonId: 'math-5ap-symmetry-solides', competenceIds: ['math-5ap-c-volumes'] },
  { lessonId: 'math-5ap-proportionality-ruleofthree', competenceIds: ['math-5ap-c-proportion'] },
  { lessonId: 'math-5ap-percentage-scale', competenceIds: ['math-5ap-c-proportion'] },
  { lessonId: 'math-5ap-data-organization', competenceIds: ['math-5ap-c-data'] },
  { lessonId: 'math-5ap-circle-radius', competenceIds: ['math-5ap-c-areas'] },
  { lessonId: 'soroban-basics', competenceIds: ['math-5ap-c-operations'] },
];
