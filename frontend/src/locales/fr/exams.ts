import type { exams as examsAr } from '../ar/exams';

export const exams: typeof examsAr = {
  gradeTitle1AP: '1ère année primaire (1AP)',
  gradeTitle2AP: '2ème année primaire (2AP)',
  gradeTitle3AP: '3ème année primaire (3AP)',
  gradeTitle4AP: '4ème année primaire (4AP)',
  gradeTitle5AP: '5ème année primaire (5AP)',

  backToExamsOf: 'Retour aux sujets de {gradeTitle}',
  hideAllSolutions: 'Masquer toutes les solutions',
  showAllSolutionsFree: 'Afficher toutes les solutions gratuitement ✨',
  printExamTitle: "Imprimer le sujet d'examen",
  print: 'Imprimer',
  printSubject: 'Imprimer le sujet',
  printCorrige: 'Imprimer le corrigé',
  printCorrigeTitle: 'Imprimer le corrigé type et le barème',
  printLastName: 'Nom :',
  printFirstName: 'Prénom :',
  printClass: 'Classe :',
  printNumber: 'N° :',
  pauseTimer: 'Mettre en pause',
  startTimer: 'Démarrer le minuteur',
  resetTimerTitle: 'Réinitialiser le minuteur',

  allSolutionsFreeBannerTitle:
    'Toutes les solutions types et barèmes sont gratuits à 100 % et entièrement accessibles',
  allSolutionsFreeBannerSubtitle:
    'Entraîne-toi librement, vérifie les étapes de la solution et gagne des points d’expérience !',
  freeOpenBadge: 'Version gratuite et ouverte 🎓',

  officialHeaderRepublic: 'Plateforme Mssid DZ — Contenu aligné sur le programme officiel (Génération 2)',
  subjectLabel: 'Matière :',
  durationLabel: 'Durée prévue :',
  minutesUnit: 'minutes',
  totalPointsLabel: 'Total général :',
  pointsUnit: 'points',

  partOneLabel: 'Partie 1 : {count} exercices indépendants ({points} points)',
  officialScoringScales: 'Barèmes de notation officiels',
  exercisePoints: '{points} points',

  hideSolution: 'Masquer la solution type',
  showSolutionFree: 'Afficher la solution type et le barème (gratuit)',
  approvedSolutionLabel: 'Solution type approuvée et barème de notation :',

  partTwoLabel: 'Partie 2 : situation d’intégration composée ({points} points)',
  productionAndSolution: 'Production et solution composée',
  fullPointsBadge: '{points} points complets',

  hideIntegratedSolution: 'Masquer la solution de la situation d’intégration',
  showIntegratedSolutionFree: 'Afficher la solution détaillée et le barème (gratuit)',
  integratedScoringLabel: 'Barème et solution type de la situation d’intégration :',

  completedMessage: 'Bravo ! Tu as terminé ce sujet avec succès et ta progression a été enregistrée ✅',
  markCompleteButton: '✅ J’ai terminé cet examen blanc',

  heroEyebrow: 'Banque d’examens et de sujets — {gradeTitle}',
  heroTitle: 'Sujets et examens de {gradeTitle}',
  heroSubtitle:
    'Modèles d’examens d’évaluation et trimestriels conformes au programme de la 2ème génération, avec solutions types et barèmes complets, gratuitement.',

  endOfCycleTitle: 'Examens du certificat de fin d’études primaires',
  officialSessionsBadge: 'Sessions officielles',
  endOfCycleDesc: 'Archives des sessions du certificat de fin d’études primaires avec solutions types et barème.',

  trimesterExamsTitle: 'Compositions trimestrielles (5ème année)',
  trimestersBadge: 'Trimestres 1, 2, 3',
  trimesterExamsDesc: 'Examens d’évaluation types pour chaque trimestre de la 5ème année primaire.',

  changeSubjectLabel: 'Changer de matière :',
  subjectsOfGrade: 'Matières des examens de {gradeTitle} :',
  showAllSubjects: 'Afficher toutes les matières',
  examsCountLabel: '{count} sujets',

  allTrimesters: 'Tous les trimestres',
  trimesterOrdinal1: '1er trimestre',
  trimesterOrdinal2: '2ème trimestre',
  trimesterOrdinal3: '3ème trimestre',

  freeSolutionsBadge: 'Solutions gratuites ✨',
  completedShortBadge: '✓ Terminé',
  minutesWithCount: '{minutes} min',
  pointsWithCount: '{points} points',
  openExamPaper: "Ouvrir le sujet d'examen",
  startNextExamCta: 'Commencer le sujet',

  noExamsTitle: 'Aucun sujet dans cette section pour le moment',
  noExamsDesc: 'Choisis une autre matière ou un autre trimestre pour voir les sujets disponibles pour {gradeTitle}.',

  kindDevoirsTitle: 'Devoirs maison',
  kindDevoirsDesc: 'Entraînement court façon devoir hebdomadaire, avec corrigé — contenu original مَسِيد.',
  kindCompositionsTitle: 'Compositions trimestrielles',
  kindCompositionsDesc: 'Modèles de compositions 2e génération, avec situation d’intégration et barème.',
  kindBepTitle: 'Certificat de fin de primaire',
  kindBepDesc: 'Sujets du certificat de fin de cycle pour s’entraîner au format, avec corrigés.',
  kindAcquisTitle: 'Évaluation des acquis',
  kindAcquisDesc: 'Modèles d’évaluation des compétences de fin de cycle (5AP), avec tâches, situation d’intégration et barème.',
  devoirBadge: 'Devoir',
  compositionBadge: 'Composition',
  bepBadge: 'Certificat',
  acquisBadge: 'Acquis',

  filterTrail: '{gradeTitle} · {kind} · {subject} · {trimester}',
  allSubjectsShort: 'Toutes les matières',
  endOfCycleShort: 'Fin de cycle',

  grade1apEmptyTitle: '1AP : évaluation continue, pas d’examens officiels',
  grade1apEmptyDesc:
    'En 1AP on s’entraîne dans les leçons et les quiz — il n’y a pas de sujets d’examen officiels à ce niveau.',
  grade1apOpenCourses: 'Ouvrir les cours de 1AP',
  relatedLessonsTitle: 'Révise ces leçons avant le sujet :',
  reviseLessonCta: 'Réviser cette leçon',
  doneOfTotal: '{done} / {total} sujets terminés',
};
