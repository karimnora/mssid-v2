# V1 — trois priorités avant de multiplier les fonctionnalités

12 novembre 2026. Recommandation transmise par Karim, intégrée à la roadmap. Ce document fixe la prochaine séquence ; il ne décrit pas des fonctions déjà implémentées.

## 1. Réussir la première minute

- [ ] Observer un enfant qui ouvre l'application, choisit son niveau et commence sans aide.
- [ ] Réduire le parcours jusqu'à une courte mission existante adaptée au niveau ; les deux pilotes 4AP–5AP sont les premiers candidats à tester.
- [ ] Garder une action principale claire sur l'accueil et rendre les autres accès secondaires.
- [ ] Proposer l'inscription pour sauvegarder après une première expérience utile, en conservant les étoiles déjà gagnées. Tester l'inscription avant de modifier ses règles.
- [x] Retirer les statuts de revue éditoriale de l'écran enfant.

État du code : `guestAccess.ts` autorise déjà le premier cours de chaque matière, et `App.tsx` ouvre une inscription gratuite pour les autres. L'entrée sans compte existe ; l'accès direct à un exercice de mission n'est pas encore le parcours d'accueil. Aucun objectif de réussite en trente secondes n'est présenté comme mesuré.

## 2. Rendre la boucle d'exercice excellente

- [x] Deux pilotes structurés avec modèle, entraînement guidé, réponse autonome et transfert.
- [ ] Tester la compréhension d'un écran d'exercice à la fois et le retour après erreur avec des enfants.
- [x] Après validation des deux références par Karim, étendre le réessai guidé à l'entraînement interactif avec indices ; conserver le corrigé accessible sans indice. La relecture des aides de chaque notion reste à poursuivre.
- [ ] Réutiliser les poses de Didou pour un retour discret et compréhensible ; aucun effet obligatoire ou animation permanente.
- [ ] Tester d'abord une manipulation utile sur chaque pilote : tableau de numération et partage d'objets. Conserver un contrôle au toucher ou au clavier accessible ; un glisser-déposer seul ne suffit pas.
- [ ] Définir les courtes consignes à enregistrer et obtenir de vrais enregistrements adaptés. Aucune voix synthétique n'est présentée comme un enregistrement humain.

État du code : le réessai guidé est optionnel dans `PracticeExerciseCard` et actif dans les pilotes. Les échecs de l'entraînement restent surtout dans l'état React de la leçon ; `useLessonPractice` appelle le callback de récompense sur une bonne réponse. Une reprise automatique des erreurs à J+2 nécessite un historique fiable, elle ne peut pas être déduite de l'XP.

## 3. Donner une raison simple de revenir

- [ ] Définir une séance courte de trois exercices issus du contenu existant, sans promettre cinq minutes avant observation.
- [ ] Réutiliser l'objectif quotidien et les jours d'activité existants après vérification de leurs règles de comptage et de sauvegarde.
- [ ] Montrer une prochaine action utile après la séance ; éviter d'ajouter immédiatement un nouveau système de récompenses.
- [ ] Préparer ensuite la révision d'erreurs à J+2, une fois les tentatives et aides enregistrées correctement.
- [ ] Évaluer le lien entre exercices réussis et soins de Didou après validation de la boucle principale.

État du code : `dailyObjective.ts` possède déjà une cible locale de trois activités ; `useUserProgress` contient des jours consécutifs et la dernière date d'activité. Ces éléments ne constituent pas encore une mission quotidienne de trois exercices distincts ni une mesure de retour à J+1. Réutiliser et vérifier ces briques avant d'en créer d'autres.

## Dix notions ciblées, pas 389 réécritures simultanées

Deux sont implémentées : valeur du chiffre en 4AP et division avec reste en 5AP. Huit candidates à confronter au catalogue, aux prérequis et à une relecture pédagogique : sens des fractions, comparaison de fractions, valeur des chiffres décimaux, addition/soustraction de décimaux, proportionnalité simple, conversions de mesures, phrase nominale/verbale, i'rab du sujet et du complément.

Cette liste est un périmètre de travail proposé, pas une attestation du programme officiel de chaque niveau. Valider un lot avant le suivant.

## Quatre mesures définies avant instrumentation

| Mesure | Définition de départ | Vigilance |
|---|---|---|
| Cours ouvert | Contenu utilisable effectivement affiché, pas seulement clic sur une carte | Dédupliquer les réaffichages techniques |
| Premier exercice tenté | Première validation d'une réponse réelle dans la séance, bonne ou mauvaise | Un clic sur une aide n'est pas une tentative |
| Mission terminée | Les exercices requis de la mission sont validés selon sa règle explicite | Lecture, XP et cours parcouru ne suffisent pas |
| Retour le lendemain | Activité le jour local suivant pour la cohorte ayant commencé une mission | Préciser le fuseau et distinguer appareil invité et compte |

- [ ] Vérifier le suivi existant côté application et serveur avant ajout.
- [ ] Fixer le périmètre des identifiants et de la conservation, sans saisir les réponses libres des enfants dans les événements.
- [ ] Établir une mesure de départ puis comparer des périodes cohérentes.

Les 220 comptes et 34 actifs sur sept jours viennent des captures fournies par Karim. Ils ne suffisent pas à identifier le point d'abandon, à calculer une conversion publicitaire ou à prouver une cause.

## Cadre

V1 gratuite, aucune sollicitation commerciale ajoutée. Les nouvelles extensions V2 viennent après la validation du parcours principal V1. Tout changement reste local ; tests de Karim puis feu vert explicite avant push ou déploiement.
