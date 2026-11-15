# V2 — Relecture pédagogique de la 5AP (CL-06)

Relecture faite par Claude, sur la branche `v2` après la fusion de la V1. Grille : `docs/v2-relecture-enseignant.md`.
Statut : **relecture préparatoire, pas une validation d'enseignant.** Chaque leçon relue ici reste « à relire » pour l'enseignant ; ce document lui fait gagner du temps en signalant ce qui est déjà vérifié et ce qui pose problème.

## Méthode

Pour chaque leçon : tous les exercices d'entraînement, toutes les évaluations et le quiz final. Pour chacun :
- le calcul et la réponse attendue sont refaits ;
- la bonne réponse est unique, et les distracteurs sont plausibles ;
- la notion est dans le programme et dans le bon trimestre (`CLAUDE.md`, section 3) ;
- la situation a du sens pour un enfant.

Je ne modifie aucune question dans ce lot : les corrections sont proposées, et attendent l'accord de Karim (voir « Décision attendue »).

## Avancement

| Lot | Leçons | État |
|---|---|---|
| 1 — parcours de référence | `math-5ap-fractions`, `math-5ap-division` | Relu le 15 novembre 2026 |
| 2 — maths, 2e trimestre | `math-5ap-durations`, `math-5ap-polygons-triangles` | À faire |
| 3 — maths, 1er trimestre | grands nombres, opérations, longueurs/masses/capacités, droites et angles | À faire |
| 4 — maths, 3e trimestre | décimaux, proportionnalité, pourcentages et échelle, périmètres et aires, cercle, symétrie et solides, organisation de données | À faire |
| 5 — arabe | les 17 leçons de 5AP, avec le tableau `الكلمة` / `إعرابها` | À faire |

## Lot 1 — Résultats

| Niveau / identifiant | Objectif adapté | Prérequis / période | Consigne claire | Calcul et corrigé exacts | Aide utile | Langue | Décision | Correction précise |
|---|---|---|---|---|---|---|---|---|
| 5AP `math-5ap-fractions` (7 exercices, 6 évaluations, 2 questions de quiz) | Oui | Oui (2e trimestre) | Oui | Oui, les 15 vérifiés | Oui, indices progressifs | Oui | À corriger (mineur) | Quiz trop court : 2 questions seulement pour valider la leçon à 100 %. Ajouter 3 questions (comparaison de fractions de même dénominateur, fraction décimale, problème « fraction d'une quantité »). |
| 5AP `math-5ap-division` (7 exercices, 6 évaluations, 2 questions de quiz) | Oui | **Non pour le quiz q2** | Non pour q2 | Oui, sauf q2 | Oui | Une tournure à revoir | **À corriger** | Voir les points D1 à D4 ci-dessous. |

### Points à corriger dans la division

| # | Où | Problème | Gravité | Correction proposée |
|---|---|---|---|---|
| D1 | Quiz `q2` : « ما ناتج 960 ÷ 100 مباشرة؟ », réponse attendue « 9,6 » | Le résultat est un nombre décimal, vu seulement au 3e trimestre (`math-5ap-decimals`). Et dans une leçon sur la division euclidienne, « quotient 9, reste 60 » est aussi une réponse juste. Un enfant qui a bien appris peut être compté faux, alors que ce quiz doit être réussi à 100 %. | Haute | Remplacer par « ما ناتج 9 600 ÷ 100 مباشرة؟ » avec les choix 96 (juste), 960 et 9 600 ; correction : « نحذف صفرين من 9 600 فنجد 96 ». |
| D2 | Évaluation `eval6` : 3 400 kg d'aide alimentaire pour 15 familles, « combien de kg restent non distribués ? » | Des kilogrammes se partagent : parler d'un reste « non distribuable » de 10 kg n'a pas de sens. La division euclidienne porte sur des objets entiers. | Moyenne | Garder les nombres et changer l'objet : « وزّعت بلدية 3 400 كيس دقيق على 15 عائلة بالتساوي. كم كيساً يتبقّى غير موزّع؟ » Réponse inchangée : 10. |
| D3 | Exercice `ex6` : `solutionAr: '2 كتابين'` | Tournure incorrecte (« 2 كتابين ») ; en arabe, on écrit le nombre ou le duel, pas les deux. | Faible | « 2 (كتابان) » ou « كتابان ». La réponse saisie (2) ne change pas. |
| D4 | Quiz | 2 questions seulement pour valider la leçon. | Faible | Ajouter 3 questions : une division posée à deux chiffres au diviseur, la vérification « المقسوم = (المقسوم عليه × الحاصل) + الباقي », un problème de partage d'objets entiers. |

### Vérifié et correct

- **Fractions :** les 15 calculs et réponses (fractions équivalentes, encadrement de 17/5, 29/6 et 23/5, fraction d'une quantité 750 m² et 900 kg, situation d'intégration 1 200 m²).
- **Division :** les 13 autres calculs et réponses (29 ÷ 4, 97 ÷ 8, 45 ÷ 6, 38 ÷ 9, 132 ÷ 11, 138 ÷ 6 posé, 1 250 ÷ 8, 41 ÷ 6, 630 ÷ 10, 60 ÷ 8, 33 ÷ 5, 50 ÷ 7, 457 ÷ 5).
- Les distracteurs reprennent des erreurs réelles d'élèves (reste plus grand que le diviseur, oubli du reste, inversion numérateur/dénominateur).

## Décision attendue de Karim

Ces leçons existent aussi dans la V1 en production. Deux possibilités :
1. **Corriger seulement sur `v2`** (proposé) : la V2 remplacera la V1 à la mise en ligne, et `main` n'est pas touché.
2. Corriger aussi la V1 : demande un changement sur `main`, donc un déploiement en production.

Avec l'accord de Karim, Claude applique lui-même ces corrections de contenu (questions, corrigés) sur `v2`, puis lance le test ciblé des examens et leçons de maths 5AP.
