import type { Competence, LessonCompetences } from './types';

const IRAB = 'الإعراب والنظام اللغوي';
const WRITING = 'التعبير الكتابي';

export const ARABIC_5AP_COMPETENCES: Competence[] = [
  {
    id: 'ar-5ap-c-irab',
    grade: '5AP',
    subject: 'arabic',
    domainAr: IRAB,
    labelAr: 'أُعْرِبُ المُبْتَدَأَ وَالخَبَرَ وَالفَاعِلَ وَالمَفْعُولَ وَالحَالَ وَالأَسْمَاءَ الخَمْسَةَ',
    labelFr: 'Analyser sujet, attribut, verbe, complément, ḥāl et les cinq noms',
    inReferentiel: true,
  },
  {
    id: 'ar-5ap-c-spelling',
    grade: '5AP',
    subject: 'arabic',
    domainAr: IRAB,
    labelAr: 'أَضْبِطُ الهَمْزَةَ المُتَوَسِّطَةَ وَالمُتَطَرِّفَةَ وَالأَلِفَ اللَّيِّنَةَ',
    labelFr: 'Maîtriser hamza médiane/finale et alif layyina',
    inReferentiel: true,
  },
  {
    id: 'ar-5ap-c-writing',
    grade: '5AP',
    subject: 'arabic',
    domainAr: WRITING,
    labelAr: 'أَكْتُبُ نَصّاً مِنْ 8 إِلَى 12 سَطْراً',
    labelFr: 'Rédiger un texte de 8 à 12 lignes',
    inReferentiel: true,
  },
];

export const ARABIC_5AP_LESSON_COMPETENCES: LessonCompetences[] = [
  { lessonId: 'arabic-5ap-sentence-components', competenceIds: ['ar-5ap-c-irab'] },
  { lessonId: 'arabic-5ap-kan-inna', competenceIds: ['ar-5ap-c-irab'] },
  { lessonId: 'arabic-5ap-hal-five-names-verbs', competenceIds: ['ar-5ap-c-irab'] },
  { lessonId: 'arabic-5ap-annexation-adjective', competenceIds: ['ar-5ap-c-irab'] },
  { lessonId: 'arabic-5ap-passive-voice', competenceIds: ['ar-5ap-c-irab'] },
  { lessonId: 'arabic-5ap-morphology-verbs', competenceIds: ['ar-5ap-c-irab'] },
  { lessonId: 'arabic-5ap-mutal-verbs-jazm-amr', competenceIds: ['ar-5ap-c-irab'] },
  { lessonId: 'arabic-5ap-bare-augmented-participles', competenceIds: ['ar-5ap-c-irab'] },
  { lessonId: 'arabic-5ap-maf3ul-types', competenceIds: ['ar-5ap-c-irab'] },
  { lessonId: 'arabic-5ap-tamyiz', competenceIds: ['ar-5ap-c-irab'] },
  { lessonId: 'arabic-5ap-muthanna-sound-plurals', competenceIds: ['ar-5ap-c-irab'] },
  { lessonId: 'arabic-5ap-jam-taksir', competenceIds: ['ar-5ap-c-irab'] },
  { lessonId: 'arabic-5ap-spelling-taas', competenceIds: ['ar-5ap-c-spelling'] },
  { lessonId: 'arabic-5ap-spelling-hamzas', competenceIds: ['ar-5ap-c-spelling'] },
  { lessonId: 'arabic-5ap-alif-layina', competenceIds: ['ar-5ap-c-spelling'] },
  { lessonId: 'arabic-5ap-integration-writing', competenceIds: ['ar-5ap-c-writing'] },
  { lessonId: 'arabic-5ap-writing-evaluation-grid', competenceIds: ['ar-5ap-c-writing'] },
];
