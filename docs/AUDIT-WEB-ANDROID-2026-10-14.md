# Audit web et Android — Mssid DZ V1 — 14 octobre 2026

**Suivi du 15 octobre :** les neuf correctifs autorisés ont été appliqués, avec contrôles mobiles et revue des examens de mathématiques. Voir `CORRECTIFS-FIABILITE-ET-MOBILE-2026-10-15.md` et `CORRECTIFS-EXAMENS-MATH-2026-10-15.md`. Le présent document conserve les constats de l’audit initial.

## Périmètre et verdict

Audit de la branche main locale, comprenant les modifications de son, impression et confirmation de sortie non encore publiées. Ce rapport ne décrit pas nécessairement le code actuellement déployé sur Vercel ou installé depuis Google Play.

La base fonctionne sur les parcours usuels. Des défauts confirmés touchent toutefois la progression, les erreurs serveur et deux intégrations de la nouvelle confirmation. Les corriger avant la prochaine publication apporte davantage de valeur qu’ajouter un nouveau grand module. Aucune modification du code produit ni aucune action sur un compte réel n’a été effectuée pendant cet audit.

## Vérifications effectuées

- 45 parcours navigateur : 44 réussis au premier passage ; le préscolaire français a dépassé l’attente de 5 secondes pendant le chargement sous tests parallèles, puis réussi en relance isolée. Cela n’établit ni un blocage permanent ni une mesure des performances de production.
- 30 laboratoires de 5AP ouverts sans exception JavaScript non tolérée et quittés par leur retour au catalogue.
- Parcours connexion/inscription, quiz de cours, examen, défi, retour d’une leçon ouverte directement, accueil FR/AR, mode sombre, installation web Android/iPad et préscolaire mobile.
- 76 tests unitaires de réseau, compte, progression, cache et navigation réussis ; 36 contrôles audio, capture, configuration et intégration native réussis dans l’audit Android. Ces contrôles peuvent se recouper : les nombres ne constituent pas un total de cas uniques.
- Reproductions ciblées avec services simulés : elles prouvent les anomalies ci-dessous malgré la réussite des scénarios ordinaires. Les fichiers de reproduction sont des artefacts ignorés sous frontend/build, pas des tests de non-régression qui attendent un comportement corrigé.
- Android : lecture des sources natives et configuration ; pas de compilation Java/AAB ni de test physique sur téléphone. L’essai natif reste nécessaire.

## Corrections prioritaires

| Priorité | Constat et déclencheur | Effet utilisateur | Correction proposée | Risque |
|---|---|---|---|---|
| P1 | Récompense d’un laboratoire pour un compte connecté : +30 XP après un score de 80, puis mise à jour des pièces. Reproduit. | Les pièces montent mais les XP reviennent à 80 ; la requête ne contient pas les XP. Le niveau invité n’est pas recalculé non plus. | Synchroniser une seule récompense cohérente XP, score, niveau et pièces depuis le dernier état ; vérifier le contrat serveur. | Faible à modéré, tests connecté/invité indispensables. |
| P1 | Changer de niveau depuis les réglages alors qu’un exercice a du travail en cours. Reproduit. | Le profil et le niveau changent avant la décision ; Continuer ne conserve pas l’ancien niveau. | Regrouper le changement de navigation et AuthService.updateGrade dans un seul requestLeave. | Faible. |
| P1 | Supprimer le compte avec une réponse serveur 500. Reproduit. | Suppression annoncée réussie, déconnexion et effacement local, mais compte serveur toujours présent. | Vérifier le résultat HTTP ; conserver session et sauvegarde en cas d’échec ; ne confirmer qu’après succès serveur. | Faible. |
| P1/P2 | Se connecter avec un historique serveur d’examens, défis et badges. Reproduit. | Certains champs sont ignorés ; sur nouvel appareil l’historique manque, et des données invitées peuvent rester affichées. | Partager un mapping complet entre mot de passe, Google, inscription et restauration ; représenter explicitement les tableaux vides d’un nouveau compte. | Faible à modéré. |
| P2 | Gagner des points puis recevoir une erreur 500 de sauvegarde ; rafraîchir le profil. Reproduit. | Les points semblent acquis, puis reviennent à l’ancien score sans explication. | Traiter res.error, afficher une sauvegarde en attente et éviter d’écraser un gain non confirmé. Concevoir séparément une reprise persistante et idempotente. | Faible pour le message ; modéré pour une vraie synchronisation hors ligne. |
| P2 | Quitter une activité via l’onglet Jouer et accepter la confirmation. Reproduit. | Le laboratoire par défaut apparaît à la place du catalogue attendu : la seconde action a été ignorée pendant l’attente. | Regrouper les actions du bouton dans une seule demande. Examiner également Reprendre un cours et Démarrer un devoir, qui utilisent le même motif. | Faible. |
| P2 | Appeler deux fois la validation d’un même examen. Reproduit au niveau métier. | +100 XP pour un seul examen au lieu de +50. Le bouton disparaît normalement après la première validation, ce qui limite le cas ordinaire. | Refuser la récompense si l’ID figure déjà dans les examens terminés, comme pour les défis. | Très faible. |
| P2 | Stopper une récitation avant que sa promesse de lecture soit résolue. Reproduit avec le vrai hook et Audio simulé. | Un ancien rejet relance l’audio de secours alors que le lecteur est arrêté. | Invalider la session sur Stop, changement et sortie ; ignorer les anciens rejets et événements. | Faible. |
| P2 | Ouvrir une confirmation pendant une partie chronométrée. Reproduit avec le duel de calcul. | Le chronomètre continue ; la partie peut finir pendant la décision. | Suspendre le chronomètre pendant la fenêtre ; tester les autres moteurs de jeu séparément. | Modéré, car plusieurs moteurs/timers existent. |
| P2 | Toucher la lettre actuellement choisie dans le studio d’écriture. Confirmé par le handler, non reproduit sur téléphone. | clearCanvas efface les traits même pour une simple réécoute ; un changement de langue efface également. | Même lettre : réécouter sans effacer. Lettre/langue différente : confirmer seulement s’il reste un tracé non validé. | Faible. |

## Références de code

- Récompense labo : frontend/src/hooks/useUserProgress.ts:326 ; frontend/src/services/authService.ts:490 ; effet de restauration à useUserProgress.ts:247.
- Réglages et niveau : frontend/src/App.tsx:673 ; frontend/src/hooks/useAppNavigation.ts:155.
- Suppression : frontend/src/services/springBootApi.ts:128 ; frontend/src/services/authService.ts:688 ; frontend/src/components/ProfileModal.tsx:110.
- Mapping d’identité : frontend/src/services/authService.ts:99 et :179 ; restauration de progression à frontend/src/hooks/useUserProgress.ts:256.
- Échec de sauvegarde : frontend/src/services/authService.ts:249 ; réponse HTTP à frontend/src/services/springBootApi.ts:286 ; rafraîchissement à authService.ts:567.
- Onglet Jouer : frontend/src/App.tsx:705 ; attente à frontend/src/context/ActivityExitContext.tsx:43.
- Récompense examen : frontend/src/services/authService.ts:386.
- Ancienne lecture audio : frontend/src/hooks/useQuranRecitation.ts:46.
- Chronomètre du duel : frontend/src/components/games/SpeedMathDuelGame.tsx:177.
- Effacement du tracé : frontend/src/components/TouchWritingStudio.tsx:1343 ; changement de langue à :578.

## Améliorations utiles sans refonte

1. **Réessayer le micro après un refus.** VoiceEchoBar et PreschoolWordEcho retirent le bouton lorsque l’accès est refusé. Si le parent autorise ensuite le micro dans les réglages, un bouton Réessayer évite de quitter et rouvrir l’activité. Faible risque, sans nouvelle permission automatique.
2. **Donner un état de sauvegarde vrai.** Distinguer Enregistré sur cet appareil, En attente et Synchronisé. Le message doit refléter une réponse serveur réelle, pas seulement la fin d’un appel. Les parents savent alors si la progression survivra à un changement de téléphone.
3. **Étendre Reprendre aux examens et au préscolaire.** Le bouton existe déjà pour les cours et laboratoires. Mémoriser d’abord seulement la destination exacte apporte un gain simple ; ne pas promettre une restauration des réponses, dessins ou parties tant qu’elle n’est pas implémentée.
4. **Expliquer l’absence de voix.** useVoiceAvailable quitte après vingt essais sans passer de null à false lorsque aucune voix n’est installée. Reproduit à 2,3 secondes avec voix vides. Corriger cet état et remplacer onvoiceschanged partagé par des abonnements propres. Cela aide surtout les navigateurs qui utilisent encore la synthèse de secours.
5. **Optimiser les sons existants avant toute génération.** Le plan audio couvre 90,4 % des cibles inventoriées ; 35 phrases FR et 74 EN restent volontairement reportées. Les défauts d’arrêt, réécoute et accès au micro sont prioritaires sur ces nouveaux sons.

Les blocs compilés restent importants : environ 1,96 Mo pour le bloc initial, 4,05 Mo pour le catalogue de cours, 1,68 Mo pour Phaser, avant compression. Le précache contient environ 62 Mo de ressources. Mesurer sur réseau limité et téléphone modeste ; une recompression ciblée d’images ou sons est moins risquée qu’une refonte du chargement/cache. Ces tailles ne prouvent pas à elles seules une lenteur ressentie.

## Ordre conseillé

Lot 1 avant publication : navigation atomique (niveau et onglet Jouer), erreurs de suppression, mapping de compte et récompenses des laboratoires. Ajouter des tests qui attendent le résultat corrigé.

Lot 2 : sauvegarde visible et exacte, récompense d’examen unique, annulation audio, réessai du micro et effacement du tracé.

Lot 3 : pause des jeux pendant confirmation, reprise élargie et optimisation mesurée des ressources.

Avant publication Android : Retour physique Continuer/Quitter, modales de compte et réglages, micro après refus puis autorisation, lecture/Stop, impression native et mise à jour par-dessus la version Play. La version locale reste 1.0.10 / code 11 : une prochaine publication devra avoir un code supérieur au dernier accepté par Google Play. Le workflow de release est déclenché par tag ou manuellement, pas par tout push.
