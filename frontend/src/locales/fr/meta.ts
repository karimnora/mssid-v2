import type { meta as metaAr } from '../ar/meta';

export const meta: typeof metaAr = {
  installSubtitle: 'Retrouve Mssid facilement depuis ton appareil.',
  installGooglePlay: 'Télécharger sur Google Play',
  installHomeScreen: "Ajouter à l’écran d’accueil",
  installIosHelp: 'Dans Safari, ouvre le menu Partager, puis choisis « Sur l’écran d’accueil ». Si tu utilises un autre navigateur, ouvre d’abord ce site dans Safari.',
  installError: 'L’installation n’a pas pu démarrer. Réessaie ou utilise le menu de ton navigateur.',
  reviewTitle: 'Ton avis sur Mssid',
  reviewStoreDescription: 'Tu peux laisser une note et un commentaire directement sur Google Play.',
  reviewContactDescription: 'Partage tes remarques avec l’équipe Mssid.',
  reviewGooglePlay: 'Noter sur Google Play',
  reviewSuggestion: 'Envoyer une suggestion',
  reviewOpenError: 'Impossible d’ouvrir Google Play. Réessaie dans un instant.',
  appVersion: 'Version {version}',
  offlineTitle: 'Apprendre hors connexion',
  offlineOnline: 'Connexion Internet disponible',
  offlineDisconnected: 'Tu es hors connexion',
  offlineContent: 'Les contenus déjà disponibles sur cet appareil peuvent rester accessibles sans Internet. Ouvre les leçons souhaitées avant de te déconnecter.',
  offlineLimits: 'La connexion au compte, le professeur IA et les contenus qui doivent être récupérés sur le serveur nécessitent Internet.',
  offlineNoSync: 'Cet écran ne télécharge pas de packs et ne synchronise pas tes progrès. Tu peux le fermer pour retrouver tes leçons.',
  offlineBack: 'Revenir aux leçons',
  networkOffline: 'Aucune connexion Internet détectée. Reconnecte-toi, puis réessaie.',
  networkSlow: 'Le serveur met du temps à répondre. Merci de patienter.',
  networkTimeout: 'Le serveur n’a pas répondu à temps. Vérifie ta connexion puis réessaie.',
  networkUnavailable: 'Impossible de joindre le serveur. Vérifie ta connexion puis réessaie.',
  networkWriteUncertain: 'La réponse du serveur n’est pas arrivée. Vérifie si ton action a été enregistrée avant de la renvoyer.',
  networkRetry: 'Réessayer',
  parentGateTitle: 'Espace parents',
  parentGateBody: 'Cette action est réservée à un adulte. Pour continuer, résolvez cette opération.',
  parentGateAnswer: 'Saisissez le résultat',
  parentGateError: 'Réponse incorrecte. Réessayez.',
  parentGateContinue: 'Continuer',
  voiceUnavailable: 'La lecture vocale n’est pas disponible sur cet appareil pour le moment.',
  // PwaInstallBanner.tsx
  pwaIosInstallHint:
    'Pour installer l\'application sur ton appareil : appuie sur le bouton Partager, puis choisis "Sur l\'écran d\'accueil" (Add to Home Screen) 📲',
  pwaBannerTitle: 'Installe Mssid sur ton téléphone',
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
