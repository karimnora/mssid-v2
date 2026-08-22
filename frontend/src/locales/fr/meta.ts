import type { meta as metaAr } from '../ar/meta';

export const meta: typeof metaAr = {
  // PwaInstallBanner.tsx
  pwaIosInstallHint:
    'Pour installer l\'application sur ton appareil : appuie sur le bouton Partager, puis choisis "Sur l\'écran d\'accueil" (Add to Home Screen) 📲',
  pwaBannerTitle: 'Installe les jeux et les cours Mssid sur ta tablette ou ton téléphone',
  pwaBannerBadge: 'Rapide et léger 🚀',
  pwaBannerSubtitle: 'Accès rapide en un seul geste et apprentissage facile, sans interruption !',
  pwaInstallButton: "Installer l'application maintenant 🚀",
  pwaLaterButton: 'Plus tard',
  pwaCloseAriaLabel: 'Fermer',
  pwaInstalledSuccess: "Bravo ! L'application Mssid DZ a été installée avec succès sur ton appareil, champion 🎉",

  // AppRatingPrompt.tsx
  ratingCloseAriaLabel: 'Fermer',
  ratingTitle: "Tu aimes l'application Mssid ? 🌟",
  ratingSubtitle: 'Évalue ton expérience avec nous, d\'une à cinq étoiles',
  ratingStarAriaLabel: '{count} étoiles',
  ratingThanksHighTitle: 'Merci beaucoup ! 🎉',
  ratingThanksHighBody: "Nous espérons que tu nous laisseras un avis sur le store pour aider d'autres élèves.",
  ratingThanksLowTitle: 'Merci pour ton avis !',
  ratingThanksLowBody: 'Nous serions ravis de savoir comment nous pouvons nous améliorer.',
  ratingSendFeedbackButton: 'Envoyer mon avis',

  // ErrorBoundary.tsx
  errorTitle: 'Une erreur inattendue est survenue',
  errorMessage:
    "Désolé, un problème est survenu sur cette page. Appuie sur le bouton ci-dessous pour revenir et réessayer.",
  errorReloadButton: '🔄 Recharger',

  // LoadingFallback.tsx
  loadingDefaultLabel: 'Chargement...',

  // ui/XPProgressBar.tsx
  xpLevelLabel: 'Niveau {level}',
};
