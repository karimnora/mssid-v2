import type { Competence, LessonCompetences } from './types';

const SYNTAX = 'التراكيب النحوية والإعراب';
const MORPHO = 'الصرف';
const SPELLING = 'الإملاء';
const WRITING = 'التعبير الكتابي';

const c = (id: string, domainAr: string, labelAr: string, labelFr: string): Competence => ({
  id, grade: '5AP', subject: 'arabic', domainAr, labelAr, labelFr, inReferentiel: true,
});

/**
 * One competence per grammar or spelling point (« bloque sur الحال »), as listed in the 5AP référentiel.
 * The three ids of the first, coarser version are kept so that stats already recorded stay attached.
 */
export const ARABIC_5AP_COMPETENCES: Competence[] = [
  c('ar-5ap-c-irab', SYNTAX, 'أُمَيِّزُ الجُمْلَةَ الفِعْلِيَّةَ وَالاسْمِيَّةَ وَأُعْرِبُ عَنَاصِرَهُمَا', 'Distinguer phrase verbale et nominale, analyser leurs éléments'),
  c('ar-5ap-c-nawasikh', SYNTAX, 'أُعْرِبُ الجُمْلَةَ بَعْدَ كَانَ وَأَخَوَاتِهَا وَإِنَّ وَأَخَوَاتِهَا', 'Analyser la phrase après كان et إنّ et leurs sœurs'),
  c('ar-5ap-c-passive', SYNTAX, 'أَصُوغُ المَبْنِيَّ لِلْمَجْهُولِ وَأُعْرِبُ نَائِبَ الفَاعِلِ', 'Former le passif et analyser نائب الفاعل'),
  c('ar-5ap-c-annex-adjective', SYNTAX, 'أُعْرِبُ المُضَافَ إِلَيْهِ وَالصِّفَةَ', 'Analyser le complément de nom et l’adjectif'),
  c('ar-5ap-c-hal-five', SYNTAX, 'أُعْرِبُ الحَالَ وَالأَسْمَاءَ الخَمْسَةَ وَالأَفْعَالَ الخَمْسَةَ', 'Analyser الحال, les cinq noms et les cinq verbes'),
  c('ar-5ap-c-mafaeel', SYNTAX, 'أُمَيِّزُ المَفْعُولَ المُطْلَقَ وَالمَفْعُولَ لِأَجْلِهِ وَالمَفْعُولَ فِيهِ', 'Distinguer les trois compléments (مطلق، لأجله، فيه)'),
  c('ar-5ap-c-tamyiz', SYNTAX, 'أُمَيِّزُ التَّمْيِيزَ وَأُعْرِبُهُ', 'Reconnaître et analyser التمييز'),
  c('ar-5ap-c-number-plural', SYNTAX, 'أُعْرِبُ المُثَنَّى وَالجُمُوعَ وَأُمَيِّزُ جَمْعَ التَّكْسِيرِ', 'Analyser le duel et les pluriels, reconnaître le pluriel brisé'),
  c('ar-5ap-c-verb-conjugation', MORPHO, 'أُصَرِّفُ الفِعْلَ الصَّحِيحَ وَالمُعْتَلَّ وَأَجْزِمُهُ', 'Conjuguer verbes sains et faibles, et les mettre au جزم'),
  c('ar-5ap-c-derivation', MORPHO, 'أُمَيِّزُ المُجَرَّدَ وَالمَزِيدَ وَأَصُوغُ اسْمَ الفَاعِلِ وَاسْمَ المَفْعُولِ', 'Verbe nu et augmenté, participes actif et passif'),
  c('ar-5ap-c-taa', SPELLING, 'أَكْتُبُ التَّاءَ المَفْتُوحَةَ وَالمَرْبُوطَةَ وَأُعَلِّلُ', 'Écrire le تاء ouvert ou lié et le justifier'),
  c('ar-5ap-c-spelling', SPELLING, 'أَكْتُبُ هَمْزَةَ الوَصْلِ وَالقَطْعِ وَالهَمْزَةَ المُتَوَسِّطَةَ وَالمُتَطَرِّفَةَ', 'Écrire la hamza (وصل/قطع, médiane, finale)'),
  c('ar-5ap-c-alif', SPELLING, 'أَكْتُبُ الأَلِفَ اللَّيِّنَةَ مَمْدُودَةً أَوْ مَقْصُورَةً', 'Écrire l’alif layyina longue ou courte'),
  c('ar-5ap-c-writing', WRITING, 'أَكْتُبُ نَصّاً مِنْ 8 إِلَى 12 سَطْراً وَأُرَاجِعُهُ بِالشَّبَكَةِ', 'Rédiger un texte de 8 à 12 lignes et le relire avec la grille'),
];

export const ARABIC_5AP_LESSON_COMPETENCES: LessonCompetences[] = [
  { lessonId: 'arabic-5ap-sentence-components', competenceIds: ['ar-5ap-c-irab'] },
  { lessonId: 'arabic-5ap-kan-inna', competenceIds: ['ar-5ap-c-nawasikh'] },
  { lessonId: 'arabic-5ap-passive-voice', competenceIds: ['ar-5ap-c-passive'] },
  { lessonId: 'arabic-5ap-annexation-adjective', competenceIds: ['ar-5ap-c-annex-adjective'] },
  { lessonId: 'arabic-5ap-hal-five-names-verbs', competenceIds: ['ar-5ap-c-hal-five'] },
  { lessonId: 'arabic-5ap-maf3ul-types', competenceIds: ['ar-5ap-c-mafaeel'] },
  { lessonId: 'arabic-5ap-tamyiz', competenceIds: ['ar-5ap-c-tamyiz'] },
  { lessonId: 'arabic-5ap-muthanna-sound-plurals', competenceIds: ['ar-5ap-c-number-plural'] },
  { lessonId: 'arabic-5ap-jam-taksir', competenceIds: ['ar-5ap-c-number-plural'] },
  { lessonId: 'arabic-5ap-morphology-verbs', competenceIds: ['ar-5ap-c-verb-conjugation'] },
  { lessonId: 'arabic-5ap-mutal-verbs-jazm-amr', competenceIds: ['ar-5ap-c-verb-conjugation'] },
  { lessonId: 'arabic-5ap-bare-augmented-participles', competenceIds: ['ar-5ap-c-derivation'] },
  { lessonId: 'arabic-5ap-spelling-taas', competenceIds: ['ar-5ap-c-taa'] },
  { lessonId: 'arabic-5ap-spelling-hamzas', competenceIds: ['ar-5ap-c-spelling'] },
  { lessonId: 'arabic-5ap-alif-layina', competenceIds: ['ar-5ap-c-alif'] },
  { lessonId: 'arabic-5ap-integration-writing', competenceIds: ['ar-5ap-c-writing'] },
  { lessonId: 'arabic-5ap-writing-evaluation-grid', competenceIds: ['ar-5ap-c-writing'] },
];
