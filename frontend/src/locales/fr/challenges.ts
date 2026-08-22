import type { challenges as challengesAr } from '../ar/challenges';

export const challenges: typeof challengesAr = {
  difficultyEasy: '🟢 Facile',
  difficultyMedium: '🟡 Moyen',
  difficultyHard: '🔴 Difficile',

  formatQuizFlash: '⚡ Question flash',
  formatSpeedCalc: '🧮 Calcul rapide',
  formatMemory: '🧠 Défi mémoire',
  formatWordScramble: '🔤 Remettre les mots en ordre',
  formatBossMix: '👑 Défi du boss',

  modeQuickTitle: 'Quiz rapide',
  modeQuickDesc: '10 questions flash sans limite de temps',
  modeChronoTitle: 'Défi chrono',
  modeChronoDesc: 'Deux minutes pour résoudre un maximum de questions',
  modeBossTitle: 'Le grand défi du trimestre',
  modeBossDesc: 'Un défi complet et difficile — réservé aux champions !',

  arenaEyebrow: 'Club des défis et concours',
  heroTitle: 'Défis chronométrés et jeux rapides pour gagner des points d’expérience',
  heroSubtitle: 'Choisis une matière et un niveau de difficulté, puis lance le défi pour tester tes connaissances et gagner de l’XP.',

  chooseModeLabel: 'Choisis un mode de jeu pour filtrer les défis et y accéder directement :',
  clearFilterButton: 'Annuler le filtre et tout afficher ✕',

  challengesCountSuffix: 'défis',
  modeActiveLabel: 'Mode actif actuellement (descends 👇)',
  modeFilterLabel: 'Filtrer avec ce mode et y accéder 👇',

  challengesListTitle: 'Liste des défis disponibles ({count})',
  modeFilterSuffix: '— mode : {modeTitle}',
  showAllModes: 'Afficher tous les modes',

  subjectFilterLabel: 'Matière :',
  allLabel: 'Tous',
  difficultyFilterLabel: 'Difficulté :',

  noChallengesMatch: 'Aucun défi ne correspond au filtre sélectionné actuellement.',
  resetAllFilters: 'Réinitialiser tous les filtres et afficher tous les défis',

  itemsCountLabel: '{count} questions',
  startChallengeButton: 'Commencer le défi',

  challengeOverTitle: 'Défi terminé !',
  backToListButton: 'Retour à la liste',
  playAgainButton: 'Rejouer',

  exitButton: 'Quitter',
  showAnswerButton: 'Afficher la réponse',
  finishChallengeButton: 'Terminer le défi',
  nextQuestionButton: 'Question suivante',
};
