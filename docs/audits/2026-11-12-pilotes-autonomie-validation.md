# Première tranche pédagogique — corrections et deux pilotes

Date : 12 novembre 2026. Travail local sur V1, sans push ni déploiement.

## Ce qui est implémenté

- Correction de l'exercice vrai/faux 5AP : 456 789 contient 4 567 centaines complètes, pas 456. La règle, la réponse et la correction sont désormais cohérentes.
- Correction de la confusion centaines/milliers dans une explication et de l'indice sur la position des millions.
- Consigne de français 5AP alignée avec la phrase complète réellement attendue.
- Comparaison de saisie explicite pour trois exercices de langues : casse, apostrophe typographique, espaces et ponctuation finale tolérés lorsque ces éléments ne sont pas l'objectif évalué. Les accents, mots et distinctions grammaticales restent significatifs. Les autres exercices conservent une comparaison exacte après normalisation Unicode et suppression des espaces externes.
- Écoute facultative des panneaux de cours ouverte aux cinq niveaux, sous le réglage de lecture existant. Le tamazight n'est pas lu avec une voix de substitution inadaptée.
- Nouvelles zones de saisie identifiées par leur consigne pour les technologies d'assistance.
- Sens gauche-droite des opérations préservé dans les nouveaux paragraphes arabes et dans les indices d'exercices.

## Deux cours pilotes

### 4AP — `math-4ap-numbers-under-100k`

Mission : distinguer chiffre, position et valeur.

1. Observer un tableau de positions pour 23 405, avec le rôle du zéro.
2. Voir comment trouver la valeur de 4 : quatre centaines = 400.
3. Compléter un calcul guidé dans 34 206.
4. Chercher soi-même la valeur de 7 dans 52 708.
5. Réutiliser la méthode avec 47 032, où 7 vaut cette fois 7 000.

### 5AP — `math-5ap-division`

Mission : comprendre le partage, le quotient et le reste avant les divisions plus longues.

1. Voir 17 crayons répartis en quatre parts de quatre, avec un crayon restant.
2. Relier la situation aux termes scolaires et vérifier par multiplication et addition du reste.
3. Compléter le reste de 23 ÷ 5 avec la multiplication fournie.
4. Chercher le reste de 29 ÷ 6.
5. Changer de situation : former des sacs de huit cartes avec 41 cartes, et donner le nombre de sacs complets.

Chaque mission comporte cinq étapes : observer, voir la méthode, faire avec aide, essayer seul, appliquer dans une autre situation. Les opérations et solutions utilisent le composant mathématique existant. Une erreur permet de lire la correction, demander un indice après réinitialisation et réessayer.

La suite du parcours guidé attend une réponse correcte sur les étapes d'exercice. Les onglets ordinaires du cours restent accessibles. La lecture d'un exemple n'attribue aucun XP. Les exercices utilisent le même état que les panneaux d'entraînement et d'évaluation ; y revenir ne récompense pas deux fois la même réponse dans la session.

Les leçons, règles, exemples et quiz originaux restent disponibles. Ces missions introduisent une partie de chaque leçon ; elles ne prétendent pas remplacer l'ensemble de la séquence de nombres ou de division. La progression existante n'est pas migrée et aucune réussite indépendante nouvelle n'est inventée dans un bilan parent.

## Comment tester

Avec le serveur Vite de prévisualisation local sur le port 3100 :

- [Ouvrir le pilote 4AP](http://127.0.0.1:3100/lesson/math-4ap-numbers-under-100k?g=4AP).
- [Ouvrir le pilote 5AP](http://127.0.0.1:3100/lesson/math-5ap-division?g=5AP).

Les liens nécessitent que ce serveur local soit en cours d'exécution. Les cours conservent leur langue pédagogique arabe lorsque l'interface est en français.

Parcours conseillé : lire ou écouter, passer à la méthode, saisir volontairement une réponse fausse, consulter la correction, réessayer avec une aide, puis répondre à la question finale. Vérifier aussi les onglets habituels et le retour au catalogue.

Captures : [tableau 4AP](../../output/pedagogy-preview/4ap-mobile-observe.png), [partage 5AP](../../output/pedagogy-preview/5ap-mobile-observe.png), [méthode 5AP en mode sombre](../../output/pedagogy-preview/5ap-dark-fr-model.png). Des barres de navigation fixes peuvent apparaître superposées dans les captures d'une région de page ; elles ne constituent pas une comparaison avec une maquette de référence.

## Vérifications

- Dernière exécution ciblée : **12 fichiers, 162 tests réussis**.
- Les tests de régression ont d'abord reproduit les erreurs de centaines, d'indice et de saisie avant correction.
- Les tests des pilotes vérifient les réponses mathématiques, la reprise après erreur, le passage au problème nouveau et l'absence de récompense pour la simple consultation d'un modèle.
- Les tests audio vérifient l'ouverture aux cinq niveaux, la langue du sujet et la désactivation par le réglage de lecture.
- Vérification TypeScript réussie avec une limite mémoire Node de 6 Go.
- Quatre parcours navigateur locaux réussis : 4AP à 320 px, 5AP à 390 px, 5AP avec interface française en mode sombre, 4AP sur ordinateur.
- Sur ces quatre parcours : pas de débordement horizontal détecté, aucune erreur JavaScript détectée, essai faux puis reprise et problème nouveau réussis, aucun bouton commercial correspondant aux contrôles du test.
- Axe sur la région initiale des nouveaux parcours : aucune violation automatique détectée. Ce contrôle ne couvre pas tous les écrans, toutes les étapes ni l'accessibilité complète de l'application.
- Les tests navigateur simulent les API et utilisent une progression de test. Aucun paiement, aucun envoi à une famille et aucune opération sur une base réelle.

L'absence d'écran d'achat dans ces scénarios ne certifie pas les réglages actuels de production ; aucun réglage de paiement ou d'environnement n'a été modifié.

## Ce qui reste à valider

- Les formulations et exemples avec un enseignant et avec des enfants des niveaux concernés.
- L'utilité réelle des indices : l'enfant sait-il quoi faire après les avoir lus ?
- La réponse au problème nouveau sans aide adulte et sans copier un modèle.
- La lecture et la prononciation sur un vrai Android, avec ses voix installées.
- L'adaptation de ce modèle aux autres notions et matières, avant extension au catalogue.

Les retours de Karim sur le design de l'accueil restent attendus. Les modifications de cette tranche ne reprennent pas les nouveaux écrans commerciaux V2.

Complément visuel à la demande de Karim : la pose « Didou qui montre » issue de la V2 accompagne désormais le titre des deux missions. Les schémas mathématiques restent indépendants de cette illustration décorative. Après cet ajout, les trois fichiers de tests accueil/choix des cours/parcours totalisent 16 tests réussis et les quatre scénarios Playwright des pilotes ont été rejoués avec succès. Les captures du dossier `output/pedagogy-preview/` ont été actualisées.

## Relecture du travail

| Axe | Note | Preuve et limite |
|---|---|---|
| Exactitude | 4/5 | Régressions mathématiques et de saisie vérifiées ; relecture enseignant non réalisée |
| Couverture | 4/5 | Erreurs confirmées et deux pilotes implémentés ; pas de réécriture des 389 leçons |
| Clarté | 4/5 | Cinq étapes et exemples concrets ; compréhension réelle à observer |
| Caractère opérationnel | 4/5 | Parcours locaux testables et captures disponibles ; pas de test Android physique |
| Concision | 4/5 | Réutilisation du moteur d'exercices ; documentation détaillée pour permettre la recette |

Moyenne : 4/5. La prochaine amélioration utile est l'observation d'enfants et la relecture du fond, avant de généraliser le modèle. Aucun push ni déploiement avant les tests et le feu vert explicite de Karim.
