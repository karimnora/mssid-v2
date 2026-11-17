# Relecture Codex des changements de Claude — 16 novembre 2026

Demande de Karim : relire les changements et commits de Claude. Revue effectuée sur la branche `v2`, HEAD `33f86019`, avec les changements non commités présents au moment de la revue. Aucun fichier applicatif modifié par cette revue, aucun commit, build, push ni modification de `main`.

## Point à corriger

### [P2] QCM des polygones : deux réponses valides sont déclarées fausses

Fichier : `frontend/src/data/courses/5AP/math.ts`, lignes 4072–4088 ; exercice `math-5ap-polygons-ex2`, leçon `math-5ap-polygons-triangles`. Introduit par `dfe60aca`, présent aussi dans le report `1cac4f47`.

La question décrit un carré (quatre côtés égaux, quatre angles droits, diagonales égales et perpendiculaires) puis demande son nom. Les trois choix sont « مربع » (carré), « مستطيل » (rectangle) et « معين » (losange). Les deux derniers portent `isCorrect: false`, alors que la règle de la même leçon, ligne 4013, enseigne explicitement que le carré est un rectangle particulier et un losange particulier.

Un enfant appliquant cette règle et choisissant rectangle ou losange est donc pénalisé. Le correcteur réel `useLessonPractice` confirme le refus des deux choix : deux cas de reproduction ciblés échouent avec `expected false to be true`. Le fichier temporaire de reproduction a été retiré de la découverte Vitest après l'essai.

Correction proposée à Claude : garder « carré » comme unique réponse et remplacer les deux distracteurs par des figures qui ne satisfont pas les propriétés ; ou demander explicitement le nom le plus précis et clarifier la correction. Reporter aussi cette correction dans le lot préparé pour la V1. Les données pédagogiques n'ont pas été modifiées par Codex.

## Périmètre relu

- `c2bd7208` : spécification de l'habillage et deux motifs SVG. Le périmètre, les exclusions et les critères de comparaison sont explicités ; ce commit n'intègre pas encore l'habillage dans l'application.
- `dfe60aca` : corrections maths/arabe 5AP, quiz, conversions en QCM et extraction JSON de division. Le point ci-dessus reste à corriger ; les questions de programme déjà signalées pour l'enseignant restent ouvertes.
- `ea94e0fb` : rapport des essais simulés, séparateurs des grands nombres et illustration du train. Vérification mécanique : dans les quatre fichiers de données, le diff est strictement un remplacement d'espaces ordinaires par U+202F ; aucun chiffre ni autre caractère n'est changé. Les 283 séparateurs concernés se répartissent en 69 / 83 / 89 / 42.
- `6126427d` et `33f86019` : corrections de vocalisation et suivi des reports/risques. Pas d'autre anomalie bloquante relevée dans ces changements.
- Changements non commités de Claude : traduction de la carte des certificats dans `HomeView` et ses dictionnaires, accord des nombres dans `ExamsViewer`, affichage de l'avatar et raccourcis du profil (`ProfileModal`, `useUserProgress`, nouveau `utils/avatar.ts`), contraste et isolation des nombres de Musaidi. Aucun autre défaut fonctionnel identifié dans le périmètre vérifié. Le nouveau fichier `avatar.ts` doit accompagner ses deux importateurs dans le futur commit.
- Reports préparés : lecture de `28c14dd6`, `675531b5` et `1cac4f47`. Les trois fichiers de `28c14dd6` ne changent eux aussi que les espaces des nombres (241 séparateurs). Les 31 leçons maths/arabe de V2 et du commit `1cac4f47` se chargent ; leurs 155 items de quiz ont chacun un seul choix déclaré correct et des identifiants de choix distincts. Ce contrôle structurel ne garantit pas la justesse pédagogique.

Les lots Codex CX-04, CX-24 et CX-05 ne font pas partie de cette relecture croisée de Claude.

## Tests exécutés

Sur le worktree V2 : **437 tests ciblés réussis dans 17 fichiers**, zéro échec dans ces tests existants :

```text
npx vitest run src/data/courses/courseCorrections.test.ts src/data/coursesData.test.ts src/data/coursesAdditions.test.ts src/data/courses/5apOfficialLayouts.test.ts src/data/courses/hintHygiene.test.ts src/data/courses/missions/missions.test.ts src/data/missions/missions.test.ts src/utils/courseThousands.test.ts src/utils/courseQuality.test.ts src/utils/diagnostic.test.ts src/components/ExamsViewer.test.tsx src/components/HomeView.test.tsx src/components/ProfileModal.test.tsx src/components/musaidi/MusaidiPanel.test.tsx src/components/musaidi/MusaidiText.test.tsx src/hooks/useUserProgress.test.ts
npx vitest run src/components/lessonViewer/illustrations/illustrations.test.tsx
```

Premier groupe : 376 tests ; illustration : 61 tests. En complément, les deux cas temporaires reproduisant le défaut du QCM échouent comme indiqué plus haut : le succès des tests existants ne couvre donc pas cette ambiguïté.

Les copies de travail `fix/textes-faible-risque` et `fix/relecture-5ap` ne disposent pas de leur installation Vitest. Aucun test n'a été exécuté dans ces copies ; aucune dépendance n'y a été installée et leurs notes de risque n'ont pas été abaissées sur la seule base des tests V2.

## Avis

Les retouches d'affichage et de traduction examinées ne présentent pas de régression identifiée et leurs tests voisins passent. Le lot pédagogique `dfe60aca` et son report `1cac4f47` demandent la correction du QCM des polygones avant validation. Cette revue technique et les contrôles des données ne remplacent pas la validation du programme et des formulations par l'enseignant.

## Suivi du 17 novembre

Claude a corrigé le point P2 dans `d9387f8c` sur V2 et dans `b1c310bf` sur la branche de report. Lecture du diff : la question demande le nom le plus précis et les deux distracteurs deviennent « مستطيل ليس مربعاً » et « معين ليس مربعاً » ; la correction rappelle la règle inclusive. Le défaut décrit dans cette revue est donc levé dans ces corrections. Les 437 tests ci-dessus restent le résultat de la revue initiale ; ils n’ont pas été relancés sur ces nouveaux commits pendant la clôture des lots CX-04/CX-24/CX-05.
