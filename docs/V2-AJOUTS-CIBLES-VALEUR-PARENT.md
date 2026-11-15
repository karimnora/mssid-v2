# Version payante — ajouts ciblés à forte utilité

## Accord et limites

Karim accepte de retenir quelques fonctions supplémentaires, y compris réservées à la version payante, lorsqu'elles apportent une valeur claire et peuvent être intégrées avec un risque maîtrisé. Les idées suivantes seront conservées pour plus tard.

Cet accord ne déclenche ni vente, ni affichage de prix, ni nouveau verrou dans la V1. Les démarches administratives restent en cours. Aucun push ni déploiement sans tests et feu vert explicite.

Il ne signifie pas non plus « zéro bug garanti ». La préférence va aux fonctions isolées, testables et facultatives : si elles échouent, l'enfant doit pouvoir continuer son cours.

## Sélection issue des sources V2

Lecture de la branche V2 au commit `0f67d38`. Les trois briques ci-dessous existent déjà dans ses sources ; la priorité est de les consolider avant d'ajouter de nouveaux services. Une première fiabilisation du bilan et du calendrier a depuis été appliquée localement dans le worktree V2 : [compte rendu](audits/2026-11-12-v2-bilan-revisions-validation.md), 45 tests ciblés et TypeScript réussis. La recette navigateur et Android de cette tranche reste à faire.

| Ordre | Fonction | Valeur pour le parent | Périmètre initial | Risque à maîtriser |
|---|---|---|---|---|
| 1 | Bilan lisible des activités et points à revoir | Comprendre ce que l'enfant a fait et quoi travailler ensuite | Lecture seule, un enfant, aperçu local ; export déclenché par le parent | Afficher des résultats incomplets comme une maîtrise ; mélanger les profils |
| 2 | Plan de révision avant une évaluation | Savoir quoi réviser et dans quel ordre | Date saisie par le parent, maths/arabe 4AP–5AP, liens vers les ressources existantes | Mauvaise date, liens cassés, programme présenté comme personnalisé sans observations suffisantes |
| 3, après validation des deux premiers | Cahier de rattrapage imprimable | Retrouver des exercices pertinents sans devoir les chercher | Exercices relus, document correspondant aux difficultés observées, impression existante | Corrigé incohérent, problème d'impression ou d'accès au document |

Les sources V2 à examiner pour l'intégration :

- Bilan : `utils/weeklyReport.ts`, `utils/familyParentSummary.ts`, `components/ParentNotebookModal.tsx` et leurs tests.
- Révision : `utils/examPlan.ts`, `components/examPlan/ExamPlanPanel.tsx` et leurs tests.
- Rattrapage : `utils/catchUpExercises.ts`, cahiers de compétences et leur distribution.

Le bilan doit rester fondé sur les observations réellement disponibles. « Réussi avec aide », « réussi sans indice dans l'application » et « acquis durablement » ne sont pas interchangeables. Un bilan vide doit expliquer l'absence de données.

## Premier lot limité à deux fonctions

1. Vérifier les données alimentant le bilan d'un seul enfant et les états sans activité.
2. Vérifier le plan de révision associé, avec une date réelle choisie par le parent et des ressources accessibles.
3. Faire tester cette combinaison sur un environnement de test.
4. Ajouter ensuite le cahier ciblé seulement si le bilan et le plan se révèlent utiles et fiables.

La lecture d'un bilan ne doit pas modifier les résultats. Un défaut d'export ne doit pas empêcher sa consultation. Un défaut de calendrier ne doit pas bloquer l'accès manuel aux leçons. L'envoi automatique par e-mail ou messagerie ne fait pas partie de ce premier lot.

## Critères avant de retenir une fonction

- [ ] Le besoin est compréhensible pour le parent sans expliquer la technique.
- [ ] Une version réduite peut être montrée et testée de bout en bout.
- [ ] Les données utilisées existent et sont correctement rattachées au compte, à l'enfant et au niveau.
- [ ] Une défaillance laisse accessibles les cours et la progression existante.
- [ ] Les états vide, erreur, hors connexion et nouvelle tentative sont explicites.
- [ ] Les droits de la future version payante sont vérifiés sans réintroduire de vente dans la V1.
- [ ] Les tests couvrent l'isolation des enfants, les changements de compte et les cas de données manquantes pertinents.
- [ ] Les contenus, dates, impressions et liens ont été vérifiés sur le support cible.
- [ ] Karim peut tester un résultat concret avant tout push.

## Ce qui reste hors de ce premier lot

Nouveaux appels d'IA payants au clic, refonte des paiements, synchronisation entièrement nouvelle, nouveau moteur de jeux, notifications automatiques et nouvelles promesses de diagnostic. Ces idées pourront être examinées séparément avec leurs coûts, dépendances et tests.

Le parcours autonome de base, la clarté des consignes et les corrections fiables restent des améliorations gratuites de la V1.

## Backlog des idées futures

Chaque nouvelle idée sera décrite avec : besoin de l'enfant ou du parent, exemple d'usage, valeur gratuite ou payante, données nécessaires, coût de fonctionnement, dépendances, version minimale, échec possible et critère de validation. Le backlog n'est pas une autorisation automatique de développement ou de publication.
