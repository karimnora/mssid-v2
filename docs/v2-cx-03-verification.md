# CX-03 — Étoiles des jeux par enfant

Vérification du 16 novembre 2026, sur `v2`.

Le critère de CX-03 est atteint : deux enfants d'un même compte ne partagent aucune étoile. La séparation est déjà implémentée ; aucune modification de la logique applicative n'a été nécessaire.

## Fonctionnement vérifié

- `LearningGameEntry.tsx` utilise `progressStorage(owner)`, avec une clé de type `mssid_learning_games_v1:user:7:child:11`.
- Le changement d'enfant recharge les étoiles du bon propriétaire. Revenir au premier enfant restaure ses propres meilleurs résultats.
- Un callback conservé de l'ancien enfant est refusé après changement de propriétaire. L'XP de fin de pack n'est attribuée qu'une fois pour chacun des enfants.
- Les anciennes données non attribuées ne sont pas adoptées automatiquement. Le parent peut les récupérer pour l'enfant choisi via `recoverLegacyProgress`, une seule fois, sans modifier l'original ni attribuer ses étoiles au frère, à un autre compte ou à un invité.

## Tests exécutés

```text
vitest run src/components/games/learning/LearningGameEntry.test.tsx src/utils/ownerStorage.test.ts src/components/games/learning/LearningGamePlayer.test.tsx
```

Résultat : **22 tests réussis sur trois fichiers, aucun échec**. Trois tests de régression sont ajoutés dans `LearningGameEntry.test.tsx` pour couvrir explicitement CX-03.

Aucun build, aucune suite complète, aucun test navigateur, aucun push ni changement sur `main` pour ce lot. Les contenus en cours de modification par Claude sont laissés de côté.
