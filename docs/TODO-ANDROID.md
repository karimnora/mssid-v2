# TODO — prochaine version Android

Mise à jour le 6 octobre 2026. Version Play en cours de build : `versionCode 9` / `versionName 1.0.8` (tag `v1.0.8`). La précédente version taguée était `v1.0.7` (`versionCode` 8).

## Corrections réalisées dans le code

- [x] Transmettre `VITE_GOOGLE_CLIENT_ID` au build Android et refuser une configuration de publication incomplète.
- [x] Afficher le bouton Google dans l'application Android même si son initialisation échoue, avec une nouvelle tentative possible.
- [x] Supprimer le workflow « Keep Render backend awake ».
- [x] Retirer le gestionnaire Reels du CMS, en conservant les données existantes côté serveur.
- [x] Vérifier l'adresse HTTPS de production avant le build Android de publication.
- [x] Remplacer les commandes de téléchargement et synchronisation hors ligne simulées par une information fidèle.
- [x] Afficher la version réelle du build dans les réglages.
- [x] Améliorer les messages réseau et éviter de répéter automatiquement les envois pouvant créer des doublons.
- [x] Depuis le web Android, diriger l'installation vers la fiche Google Play `dz.mssid.app`. Masquer cet appel dans l'application native.
- [x] Conserver l'aide d'installation web sur iPhone et iPad, y compris Safari sans événement `beforeinstallprompt`, et le parcours PWA sur ordinateur.
- [x] Remplacer la présélection d'étoiles par un lien explicite « Noter sur Google Play » sur Android, après validation parentale. Sur iOS sans application App Store, proposer le formulaire de contact.
- [x] Garder « Envoyer une suggestion » indépendant de la notation et limiter les sollicitations automatiques.

## À vérifier sur des appareils et avant publication

- [ ] Sur un téléphone Android, valider le client Web Google utilisé par le backend, le package `dz.mssid.app` et le SHA-1 de signature Google Play ; tester connexion, annulation, nouvelle tentative et reconnexion.
- [ ] Tester les liens et textes FR/AR dans un navigateur Android, l'application Android native, Safari iPhone/iPad et une application web déjà installée.
- [ ] Tester une mise à jour par-dessus la version Play actuelle : session, progression, leçons, connexion Google et mot de passe.
- [x] Quand Karim demandera la nouvelle version, choisir `versionName` et un `versionCode` supérieur au dernier code accepté par Play Console, puis synchroniser les ressources Capacitor et générer l'AAB. **1.0.8 / `versionCode` 9** : bump dans `build.gradle`, tag `v1.0.8` qui déclenche `Android Release Build`. L’AAB sort des artefacts du job.
- [ ] Valider le nouvel AAB sur la piste interne Google Play avant une éventuelle diffusion publique.

L'intégration native In-App Review reste un chantier ultérieur : le lien explicite vers la fiche Play permet à l'utilisateur de choisir lui-même sa note. Aucun clic dans l'application ne prouve qu'un avis a été publié.

Références : [Google In-App Review](https://developer.android.com/guide/playcore/in-app-review), [installation web sur iPhone](https://support.apple.com/guide/iphone/open-as-web-app-iphea86e5236/ios), [plugin Google Sign-In](https://capawesome.io/docs/sdks/capacitor/google-sign-in/).
