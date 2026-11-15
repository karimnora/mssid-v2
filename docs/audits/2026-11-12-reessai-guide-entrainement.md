# Réessai guidé dans l'entraînement des cours

12 novembre 2026. Karim valide les cours de référence 4AP–5AP ; cette validation permet de poursuivre l'extension prévue. Aucun push ni déploiement n'est autorisé par cette validation pédagogique.

## Comportement

L'onglet « أتدرب » active maintenant le mécanisme déjà présent dans les missions pilotes, pour les exercices interactifs disposant d'indices : après une première erreur, l'enfant peut réessayer avec une première aide ; après une seconde erreur, le corrigé complet apparaît. Les bons choix, les coches et les couleurs de correction sont retenus pendant le premier essai pour ne pas divulguer la réponse.

Les activités sans réponse vérifiable restent des corrections à consulter. Les exercices sans indice, ou avec seulement un encouragement générique connu comme « pense bien avant de répondre », conservent le corrigé dès la première erreur. Tous les anciens indices concrets sont accessibles dans l'ordre, au lieu de ne proposer que le premier. Les indices progressifs restent prioritaires lorsqu'ils existent.

Les évaluations gardent leur fonctionnement propre. Aucun nouveau suivi publicitaire, système de mission quotidienne ou changement commercial n'est introduit.

## Vérification

- **36 tests réussis dans quatre fichiers** : six formats (calcul, saisie, QCM, vrai/faux, appariement et ordre), absence de divulgation avant réessai, aide générique ignorée, ordre des indices et intégration avec le véritable panneau d'entraînement.
- Le test d'intégration vérifie une erreur sans XP, une réponse correcte récompensée puis une nouvelle réussite du même exercice sans double récompense dans la session.
- TypeScript complet réussi.
- **Un scénario Chromium réussi sur le véritable entraînement de numération 5AP**, à 390 px : premier choix erroné, indice, deuxième erreur avec corrigé, puis réponse correcte. Les contrôles sont placés dans la zone de lecture par défilement, pour éviter la navigation fixe du bas ; la recette tactile physique reste nécessaire.

Les indices conservés proviennent des cours existants. Le filtre retire quelques formules génériques connues ; il n'évalue pas automatiquement la pertinence de tous les indices. L'observation d'enfants et la réécriture des aides insuffisantes restent nécessaires.

## Relecture

Exactitude 4/5 : six contrôles d'interaction et récompenses vérifiés, aucune validation terrain supplémentaire. Couverture 4/5 : entraînement généralisé avec exception explicite sans indice, données des aides encore inégales. Clarté 4/5 : même boucle que les pilotes validés, à observer sur d'autres notions. Caractère opérationnel 4/5 : code et tests locaux, sans publication. Concision 4/5 : réutilisation du mécanisme existant et d'un petit filtre d'indices.
