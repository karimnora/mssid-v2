# V2 — Ce qui est gratuit, ce qui est payant

Ce tableau est **généré** depuis `frontend/src/access/entitlements.ts`, la seule source de vérité. Pour changer une règle, on modifie le registre, puis on recopie ici le tableau que donne `renderEntitlementsTable()`. Le test `access/entitlements.test.ts` échoue tant que le tableau et le registre ne correspondent pas.

| Fonction | Accès | Part gratuite | Appliqué par | Clé |
|---|---|---|---|---|
| Cours, exercices et quiz des 3 trimestres (V1) | Gratuit | sans limite | app | `courseLessons` |
| Fiches imprimables V1 | Gratuit | sans limite | app | `v1Printables` |
| Mode Éveil (préscolaire) | Gratuit | sans limite | app | `preschool` |
| Laboratoires interactifs du catalogue | Gratuit | sans limite | app | `labs` |
| Examens V1 avec corrigés | Gratuit | sans limite | app | `examsV1` |
| Carte de Didou : mondes 1 à 2 (Sahara, Casbah) | Gratuit | sans limite | app | `journeyFreeWorlds` |
| « مساعدي » : toutes les questions, indices et règle de la leçon | Gratuit | sans limite | app | `musaidiHints` |
| Méthode guidée (maths 1AP–2AP) | Gratuit | sans limite | app | `guidedMethod` |
| Carnet parent : résumé et prochaine révision | Gratuit | sans limite | app | `parentNotebookBasic` |
| Démarrage guidé et e-mail du parent | Gratuit | sans limite | app | `firstSteps` |
| « مساعدي » : corrections détaillées pas à pas | Gratuit avec limite | 3 par jour et par compte | app + serveur | `musaidiCorrections` |
| Cahiers de compétence V2 (recto, corrigé) | Gratuit avec limite | 3 nouveaux cahiers par semaine pour la famille ; aperçu d’un exercice | app + serveur | `competenceCahiers` |
| Carte de Didou : mondes 3 à 8 et leurs médailles | Premium Famille | — | app | `journeyAllWorlds` |
| Carnet parent détaillé : compétences, historique, plan de la semaine | Premium Famille | résumé et prochaine révision | app | `parentNotebookDetail` |
| Bilan de la semaine partageable (WhatsApp) | Premium Famille | — | app | `weeklyReportShare` |
| Préparation au collège (5AP) | Premium Famille | premier exercice du premier sujet | app | `cemPrep` |
| Studio famille : vacances, rentrée, révisions avant évaluation | Premium Famille | un exercice par séance | app | `familyStudio` |
| Ateliers et laboratoires Premium (mosaïque, aventures, labos) | Premium Famille | première mission de chaque atelier | app | `familyWorkshops` |
| Missions jardin et marché du préscolaire | Premium Famille | séance découverte | app | `preschoolMissions` |
| Missions de Didou : cours immersifs et interactifs, Didou explique chaque erreur | Premium Famille | la première mission de chaque matière | app | `immersiveMissions` |
| Jeux éducatifs de Didou (memory, classer, ordonner, labyrinthe) | Premium Famille | le premier jeu de chaque niveau | app | `learningGames` |
| Plan « 10 jours avant la composition » construit sur les erreurs de l’enfant | Premium Famille | les 2 premiers jours du plan | app | `examPlan` |
| Sujets d’examen protégés (PDF) | Premium Famille | — | serveur | `examPapers` |

## Les trois accès

- **Gratuit** : ouvert à tous, sans limite.
- **Gratuit avec limite** : utilisable gratuitement jusqu'à la part indiquée, sans limite pour Premium Famille.
- **Premium Famille** : réservé aux comptes Premium, avec parfois un aperçu gratuit.

Le rôle Administrateur a les mêmes droits que Premium.

## Où la règle est appliquée

- **Serveur** : impossible à contourner en modifiant l'app.
- **App** : le contenu est caché à l'écran, mais il est encore livré dans l'application, donc extractible par quelqu'un de motivé. Ce n'est pas une protection. Pour vendre ces contenus en toute sécurité, il faudra qu'ils soient servis par le serveur. C'est aussi le cas du studio famille, des ateliers et des missions : le serveur dit si le compte est Premium, mais le contenu est livré dans l'app.
- **App + serveur** (cahiers) : le serveur compte les déblocages, mais le contenu des cahiers est encore livré dans l'app.

## Offres

Il y a deux offres : 900 DA pour 3 mois et 2 400 DA pour 12 mois (décision du 3 novembre 2026, voir `constants/pricing.ts`). Le serveur accepte encore les anciens reçus P6M et LEGACY_12M. L'app Android n'affiche ni prix ni bouton d'achat : le paiement se fait sur le web ou par code d'activation.

## Règle pour les développeurs

Aucun écran ne compare un rôle lui-même. Chaque écran appelle `canAccess('<clé>', role)` ou `isPremiumRole(role)`. Un test interdit `'ROLE_PREMIUM'` et `hasPremium(` en dehors du registre.
