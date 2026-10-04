import type { Competence, LessonCompetences } from './types';

const LETTERS = 'الحروف والأصوات';
const THEMES = 'التعبير الشفوي والمحاور';

export const ARABIC_1AP_COMPETENCES: Competence[] = [
  {
    id: 'ar-1ap-c-letters',
    grade: '1AP',
    subject: 'arabic',
    domainAr: LETTERS,
    labelAr: 'أَتَعَرَّفُ عَلَى الحُرُوفِ وَأَصْوَاتِهَا وَأَشْكَالِهَا فِي بِدَايَةِ الكَلِمَةِ وَوَسَطِهَا وَآخِرِهَا',
    labelFr: 'Reconnaître les lettres, leurs sons et leurs formes en début, milieu et fin de mot',
    inReferentiel: true,
  },
  {
    id: 'ar-1ap-c-harakat',
    grade: '1AP',
    subject: 'arabic',
    domainAr: LETTERS,
    labelAr: 'أَقْرَأُ بِالحَرَكَاتِ القَصِيرَةِ: فَتْحَة، ضَمَّة، كَسْرَة، سُكُون',
    labelFr: 'Lire avec les voyelles brèves : fatha, damma, kasra, soukoun',
    inReferentiel: true,
  },
  {
    id: 'ar-1ap-c-madd',
    grade: '1AP',
    subject: 'arabic',
    domainAr: LETTERS,
    labelAr: 'أَقْرَأُ المُدُودَ: بِالأَلِفِ وَالوَاوِ وَاليَاءِ، وَالتَّنْوِينَ',
    labelFr: 'Lire les voyelles longues et le tanwîn',
    inReferentiel: true,
  },
  {
    id: 'ar-1ap-c-themes',
    grade: '1AP',
    subject: 'arabic',
    domainAr: THEMES,
    labelAr: 'أُعَبِّرُ شَفَوِيّاً حَوْلَ المَدْرَسَةِ وَالعَائِلَةِ وَالحَيِّ وَالصِّحَّةِ وَالطَّبِيعَةِ وَالأَعْيَادِ',
    labelFr: 'S’exprimer à l’oral sur l’école, la famille, le quartier, la santé, la nature et les fêtes',
    inReferentiel: true,
  },
];

export const ARABIC_1AP_LESSON_COMPETENCES: LessonCompetences[] = [
  { lessonId: 'arabic-1ap-t1-letters-group1', competenceIds: ['ar-1ap-c-letters'] },
  { lessonId: 'arabic-1ap-t1-harakat', competenceIds: ['ar-1ap-c-harakat'] },
  { lessonId: 'arabic-1ap-t1-letters-group2', competenceIds: ['ar-1ap-c-letters'] },
  { lessonId: 'arabic-1ap-t2-letters-group3', competenceIds: ['ar-1ap-c-letters'] },
  { lessonId: 'arabic-1ap-t2-letters-group4', competenceIds: ['ar-1ap-c-letters'] },
  { lessonId: 'arabic-1ap-t3-letters-group5', competenceIds: ['ar-1ap-c-letters'] },
  { lessonId: 'arabic-1ap-t3-tracing-name', competenceIds: ['ar-1ap-c-letters'] },
  { lessonId: 'arabic-1ap-t1-school-axis', competenceIds: ['ar-1ap-c-themes'] },
  { lessonId: 'arabic-1ap-t1-family-axis', competenceIds: ['ar-1ap-c-themes'] },
  { lessonId: 'arabic-1ap-t2-neighborhood-home', competenceIds: ['ar-1ap-c-themes'] },
  { lessonId: 'arabic-1ap-t2-health-sports', competenceIds: ['ar-1ap-c-themes'] },
  { lessonId: 'arabic-1ap-t2-nature-axis', competenceIds: ['ar-1ap-c-themes'] },
  { lessonId: 'arabic-1ap-t3-play-entertainment', competenceIds: ['ar-1ap-c-themes'] },
  { lessonId: 'arabic-1ap-t3-childhood-holidays', competenceIds: ['ar-1ap-c-themes'] },
  { lessonId: 'arabic-1ap-t1-oral-daily', competenceIds: ['ar-1ap-c-themes'] },
  { lessonId: 'arabic-1ap-t1-letters-jim-ha-kha', competenceIds: ['ar-1ap-c-letters'] },
  { lessonId: 'arabic-1ap-t2-letter-zay', competenceIds: ['ar-1ap-c-letters'] },
  { lessonId: 'arabic-1ap-t2-letters-sad-family', competenceIds: ['ar-1ap-c-letters'] },
  { lessonId: 'arabic-1ap-t2-hamza', competenceIds: ['ar-1ap-c-letters'] },
  { lessonId: 'arabic-1ap-t2-letter-positions', competenceIds: ['ar-1ap-c-letters'] },
  { lessonId: 'arabic-1ap-t3-tanween', competenceIds: ['ar-1ap-c-madd'] },
  { lessonId: 'arabic-1ap-t2-madd', competenceIds: ['ar-1ap-c-madd'] },
];
