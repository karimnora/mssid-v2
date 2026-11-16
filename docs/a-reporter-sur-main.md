# À reporter sur `main` (V1 en production)

Liste tenue par Claude et Codex pendant le développement de la V2. On y note **tout défaut trouvé sur la V2 qui existe aussi en production**, et les **améliorations à faible risque** qui peuvent passer en production avant la fin de la V2.

## Règles

1. **Vérifier avant d'inscrire** : le défaut existe-t-il sur `main` ? (`git grep -n "<texte>" main -- frontend/src`). Sinon, il n'a rien à faire ici.
2. **Seulement du faible risque** : textes, données de cours, affichage, taille des boutons. Pas de changement de base de données, de paiement, d'authentification ni de droits d'accès : ceux-là attendent la V2.
3. **Une branche par lot, créée depuis `main`** (jamais depuis `v2`), dans une copie de travail séparée (`git worktree add -b fix/<sujet> ../mssid-V1-fix-<sujet> main`). Ne jamais copier un fichier entier de `v2` vers `main` : les fichiers ont divergé, on reporte le correctif seul.
4. **Rien n'est commité, poussé ni fusionné sans Karim.** Un push sur `main` met la production à jour (Render et Vercel).
5. Quand une ligne est reportée : passer l'état à « Prêt », noter la branche ; Karim décide du commit et du push.

États : **À faire** · **Prêt** (branche prête, en attente de Karim) · **En prod** (commit sur `main`) · **Abandonné** (avec la raison).

## Liste

| # | Défaut ou amélioration | Origine | Sur `main` ? | Risque | Qui | État |
|---|---|---|---|---|---|---|
| M-01 | Grands nombres réordonnés dans le texte arabe des missions (espace ordinaire → espace insécable fine U+202F) : 241 nombres dans `data/courses/missions/math3AP.ts`, `math4AP.ts`, `math5AP.ts`. Valeurs vérifiées identiques. | E4 (`docs/v2-essais-simules-5ap.md`) | Oui | Très faible (données) | Claude | **Prêt** — branche `fix/missions-grands-nombres`, copie `Desktop/mssid/mssid-V1-fix-nombres`, non commitée |
| M-02 | Choix de réponse en calcul affichés en désordre (« (3 × 1 000 000) + … ») : isoler de gauche à droite les choix sans lettre arabe. Sur `main` : `components/lessonViewer/LessonQuizPanel.tsx` (ligne 275) et `components/PracticeExerciseCard.tsx` (ligne 150). | E13, CX-27 | Oui (même rendu) | Faible (affichage) | Codex, après CX-27 sur `v2` | À faire |
| M-03 | Le formulaire d'inscription demande « الاسم الكامل » (exemple « يونس الجزائري ») : écrire « الاسم أو اللقب » et un exemple de prénom seul. `locales/ar/auth.ts` (`fullNameLabel`, `fullNamePlaceholder`) et l'équivalent français. | E3 | Oui | Très faible (texte) | Claude | À faire |
| M-04 | Bouton « أحتاج مساعدة » de 16 px de haut dans les exercices : 60 px au moins. `components/PracticeExerciseCard.tsx` (ligne 295). | E5 | Oui | Faible (CSS) | Codex | À faire |
| M-05 | Bandeau « القراءة الصوتية غير متوفرة » : ajouter au parent comment installer la voix arabe du téléphone (texte seulement). `locales/ar/meta.ts` (`voiceUnavailable`), et le français. | E15 | Oui | Très faible (texte) | Claude | À faire |
| M-06 | Corrections de la relecture 5AP qui existent aussi sur `main` (`docs/v2-relecture-5ap.md`). Exemple vérifié : 10 vocalisations fautives « تْ ال » dans `data/courses/5AP/arabic.ts`. À trier point par point : la formule fausse « = 342,5 » n'existe pas sur `main`. Ne reporter que les erreurs de fond (vocalisation, mauvaise réponse, mauvaise règle), pas les conversions en QCM ni les ajouts de quiz. | CL-06 | En partie | Faible (données) | Claude trie, puis reporte | À faire |
| M-07 | Solution complète affichée après la 2e erreur, sans indice proposé avant (missions). À vérifier sur `main`, puis reporter le correctif de CX-08 s'il est petit. | E6 | À vérifier | Moyen (logique d'exercice) | Codex | À faire |
| M-08 | Sujets d'examen : minuteur à 01:30:00 pour un sujet de 30 minutes ; « 2 تمارين » au lieu de « تمرينان ». La banque d'examens existe sur `main` (« إظهار كافة الحلول مجاناً ») : à vérifier sur un sujet court. | E19 | À vérifier | Faible | Codex | À faire |
| M-09 | Porte parents : une addition à deux chiffres, trop facile pour un enfant de 3AP à 5AP. `gateIntro` existe sur `main`. | E8 | Oui | Faible | Codex | À faire |
| M-10 | Bouton « إنشاء حساب مجاني » qui ouvre la fenêtre sur l'onglet de connexion. | E7 | À vérifier | Faible | Codex | À faire |
| M-11 | Libellés restés en arabe dans l'interface en français (« الدرس », « متوسط », « معلومة لولي الأمر », « الخطوة 1 من 6 »). | E16 | À vérifier | Très faible (texte) | Claude | À faire |

## Ne pas reporter (V2 seulement)

Pour éviter de les revérifier : le carnet du parent et la page Premium (E9 « ما درسه », E10 « 12 أشهر » et « V1 », E11), la carte des mondes (E12), le plan de 10 jours (E18), l'écran « في أي قسم تدرس؟ » (E20, CX-28), le diagnostic 5AP et l'illustration du train des rangs n'existent pas sur `main`.
