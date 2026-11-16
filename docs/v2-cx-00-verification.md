# CX-00 — Vérification locale du 16 novembre 2026

Branche : `v2`. Corrections appliquées dans le worktree, sans changement de permissions.
Les critères techniques sont atteints. Karim a demandé le commit local de ce lot ; la relecture croisée de Claude n'est pas consignée dans ce compte rendu.

## Corrections

- Quatre cas audio de `useLessonSpeech.test.ts` : les attentes vérifient désormais aussi le pitch `1` et l'option `{ preferredRecording: undefined }` transmis par le code fusionné.
- Deux cas de `PreschoolDragDrop.test.tsx` : le compteur est recherché dans `bdi`.
- Carte compagnon : le fennec en tenue par défaut retrouve `world/DidouPortrait`, avec les interactions de caresse et de nourriture. Les autres espèces et tenues gardent leur rendu équipé. La nouvelle disposition de la carte issue de la V1 est conservée.
- Trois tests de régression ajoutés dans `DidouVirtualCompanion.test.tsx` : portrait du monde et interactions, tenue du fennec, espèce aigle.

## Résultats exécutés

**253 tests réussis sur 22 fichiers, aucun échec**, répartis en trois lots ciblés terminés :

| Lot | Fichiers | Tests réussis |
|---|---:|---:|
| `useLessonSpeech`, `PreschoolDragDrop`, `DidouDressingRoomModal` | 3 | 29 |
| `DidouVirtualCompanion` | 1 | 3 |
| Vérification des composants liés à la fusion ci-dessous | 18 | 221 |

Le dernier lot a été exécuté avec `vitest run --maxWorkers=1 --reporter=verbose` sur ces fichiers :

```text
src/components/AuthModal.test.tsx
src/components/ChallengesArena.test.tsx
src/components/ExamsViewer.test.tsx
src/components/HomeView.test.tsx
src/components/LessonViewer.test.tsx
src/components/PracticeExerciseCard.test.tsx
src/components/SubjectIllustratedCard.test.tsx
src/components/lessonViewer/YoungLessonStory.test.tsx
src/components/lessonViewer/useLessonPractice.test.ts
src/components/preschool/PreschoolActivityPlayer.test.tsx
src/components/preschool/PreschoolApp.navigation.test.tsx
src/components/preschool/PreschoolModulePicker.test.tsx
src/components/preschool/PreschoolStoryOrder.test.tsx
src/components/preschool/preschoolProgress.test.ts
src/components/preschool/usePreschoolAudio.test.ts
src/data/mathExamSolutions.test.ts
src/data/preschool/remainingAudio.test.ts
src/utils/speechPlayback.test.ts
```

Les tentatives précédentes du lot élargi ont été interrompues sans bilan final ; elles ne sont pas comptées dans ces résultats. La relance avec un seul processus s'est terminée avec le code de sortie 0.

Avertissements non bloquants : `window.scrollTo` non implémenté dans JSDOM et mises à jour React hors `act` dans des tests existants.

Aucun build, aucune suite complète, aucun test navigateur, aucun push, aucun changement sur `main` pendant les essais CX-00. Le commit local a ensuite été demandé par Karim.
