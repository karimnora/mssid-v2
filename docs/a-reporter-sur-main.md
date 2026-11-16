# À reporter sur `main` (V1 en production)

Liste tenue par Claude et Codex pendant le développement de la V2. On y note **tout défaut trouvé sur la V2 qui existe aussi en production**, et les **améliorations à faible risque** qui peuvent passer en production avant la fin de la V2.

## Règles

1. **Vérifier avant d'inscrire** : le défaut existe-t-il sur `main` ? (`git grep -n "<texte>" main -- frontend/src`). Sinon, il n'a rien à faire ici.
2. **Seulement du faible risque** : textes, données de cours (corrections et questions relues), affichage, taille des boutons. Pas de changement de base de données, de paiement, d'authentification ni de droits d'accès : ceux-là attendent la V2.
3. **Une branche par lot, créée depuis `main`** (jamais depuis `v2`), dans une copie de travail séparée (`git worktree add -b fix/<sujet> ../mssid-V1-fix-<sujet> main`). Ne jamais copier un fichier entier de `v2` vers `main` : les fichiers ont divergé, on reporte le correctif seul.
4. **Rien n'est commité, poussé ni fusionné sans Karim.** Un push sur `main` met la production à jour (Render et Vercel).
5. Quand une ligne est reportée : passer l'état à « Prêt », noter la branche ; Karim décide du commit et du push.
6. **Chaque commit destiné à `main` reçoit une note de risque de 1 à 5** (demande de Karim, 16 novembre 2026), inscrite dans le tableau « Commits prêts » ci-dessous avec sa justification. La note est revue après les tests : elle peut baisser si les tests ciblés passent.

États : **À faire** · **Prêt** (branche prête, en attente de Karim) · **En prod** (commit sur `main`) · **Abandonné** (avec la raison).

## Échelle de risque

| Note | Signification | Exemples |
|---|---|---|
| **1** | Presque nul : aucune logique touchée, valeurs vérifiées identiques, aucun test concerné | Caractère d'espace dans des nombres, faute de frappe dans un texte |
| **2** | Faible : textes ou petites retouches d'affichage, tests ajustés, peu de lignes | Libellé, traduction, taille d'un bouton |
| **3** | Modéré : gros volume de données ou comportement d'exercice modifié, ou conflits réglés à la main | Report d'une relecture de leçons, QCM au lieu de réponse à trou |
| **4** | Élevé : logique applicative partagée (progression, validation, navigation) | Règle de validation d'une leçon, écran d'accueil |
| **5** | Très élevé : base de données, paiement, connexion, droits d'accès | Migration, abonnement, authentification — **ne passent pas par cette liste** |

Avant un push, Karim choisit selon la note : 1–2 peuvent partir ensemble ; 3 après les tests ciblés ; 4 après les tests et un essai sur la V2 locale ; 5 jamais par ce circuit.

## Commits prêts

| Commit | Branche | Contenu | Risque | Pourquoi | Tests | Poussé |
|---|---|---|---|---|---|---|
| `28c14dd6` | `fix/missions-grands-nombres` | 241 nombres des missions 3AP–5AP avec l'espace insécable fine | **1** | Seul le caractère d'espace change ; valeurs vérifiées identiques par script ; aucun test ne compare ces textes | Non lancés | Non |
| `675531b5` | `fix/textes-faible-risque` | Prénom ou surnom à l'inscription, aide pour installer la voix, en-tête de leçon traduit | **2** | 7 fichiers, 10 lignes ; 3 appels de traduction dans `LessonViewer.tsx` (clés déjà existantes) ; 4 assertions de test adaptées à l'exemple « يونس » | Non lancés | Non |
| `5b02faeb` | `fix/textes-faible-risque` | Accord des nombres dans les sujets (`countAr`), carte du studio traduite, avatar « default_avatar » jamais affiché, « ألفين متتاليين » (22) | **2** | Petite fonction d'affichage dans `ExamsViewer.tsx`, nouveau `utils/avatar.ts` utilisé à 2 endroits de `useUserProgress.ts`, textes et données | Non lancés | Non |
| `1cac4f47` | `fix/relecture-5ap` | Relecture 5AP maths et arabe : erreurs corrigées, quiz à 5 questions, réponses à trou d'arabe en QCM | **3** | ~1 500 lignes de données ; 8 conflits réglés à la main ; des exercices changent de type (trou → QCM) ; données chargées et vérifiées par script (31 leçons, une bonne réponse par question), mais tests non lancés. Relu par Codex le 16 novembre : un QCM des polygones déclarait faux « rectangle » et « losange » pour un carré (G6), corrigé ensuite sur la branche avec le même cas en 4AP (commit `b1c310bf`). Passe à **2** si `courseCorrections.test.ts` et les tests des cours passent | Non lancés | Non |
| `b1c310bf` | `fix/relecture-5ap` | QCM du carré (5AP et 4AP) : « مستطيل / معين ليس مربعاً » au lieu de choix justes déclarés faux (relecture Codex, G6) | **1** | 2 lignes de données ; corrige une contradiction avec la règle de la leçon | Non lancés | Non |

## Liste

| # | Défaut ou amélioration | Origine | Sur `main` ? | Risque | Qui | État |
|---|---|---|---|---|---|---|
| M-01 | Grands nombres réordonnés dans le texte arabe des missions (espace ordinaire → espace insécable fine U+202F) : 241 nombres dans `data/courses/missions/math3AP.ts`, `math4AP.ts`, `math5AP.ts`. Valeurs vérifiées identiques. | E4 (`docs/v2-essais-simules-5ap.md`) | Oui | Très faible (données) | Claude | **Prêt** — branche `fix/missions-grands-nombres` (commit `28c14dd6`, copie `Desktop/mssid/mssid-V1-fix-nombres`), non poussée |
| M-02 | Choix de réponse en calcul affichés en désordre (« (3 × 1 000 000) + … ») : isoler de gauche à droite les choix sans lettre arabe. Sur `main` : `components/lessonViewer/LessonQuizPanel.tsx` (ligne 275) et `components/PracticeExerciseCard.tsx` (ligne 150). | E13, CX-27 | Oui (même rendu) | Faible (affichage) | Codex, après CX-27 sur `v2` | À faire |
| M-03 | Le formulaire d'inscription demande « الاسم الكامل » (exemple « يونس الجزائري ») : écrire « الاسم أو اللقب » et un exemple de prénom seul. `locales/ar/auth.ts` (`fullNameLabel`, `fullNamePlaceholder`) et l'équivalent français. | E3 | Oui | Très faible (texte) | Claude | **Prêt** — branche `fix/textes-faible-risque` (commit `675531b5`, copie `Desktop/mssid/mssid-V1-fix-nombres`), non poussée ; 4 assertions de test mises à jour (`AuthModal.test.tsx`, `e2e/auth.spec.ts`) |
| M-04 | Bouton « أحتاج مساعدة » de 16 px de haut dans les exercices : 60 px au moins. `components/PracticeExerciseCard.tsx` (ligne 295). | E5 | Oui | Faible (CSS) | Codex | À faire |
| M-05 | Bandeau « القراءة الصوتية غير متوفرة » : ajouter au parent comment installer la voix arabe du téléphone (texte seulement). `locales/ar/meta.ts` (`voiceUnavailable`), et le français. | E15 | Oui | Très faible (texte) | Claude | **Prêt** — même branche `fix/textes-faible-risque` (commit `675531b5`) ; le début du texte est inchangé, les tests qui le cherchent restent valables |
| M-06 | Corrections de la relecture 5AP qui existent aussi sur `main` (`docs/v2-relecture-5ap.md`). Exemple vérifié : 10 vocalisations fautives « تْ ال » dans `data/courses/5AP/arabic.ts`. À trier point par point : la formule fausse « = 342,5 » n'existe pas sur `main`. Reporté en entier (commit `dfe60aca` de `v2`, fusion à trois voies) : erreurs de fond (D1, D3, T1, T2, G1, G2, G4, N1, N2, N4, A2, A3, M2, M4, DEC3, exercice d'arabe qui enseignait un مفعول مطلق comme مفعول لأجله…), quiz portés à 5 questions, réponses à trou d'arabe passées en QCM (test `courseCorrections.test.ts` compris). 8 conflits réglés à la main : `main` écrit les décimaux avec un point, donc les corrections qui ne faisaient que passer à la virgule sont écartées (DEC1 et DEC2 n'existaient pas sur `main`) et les 9 lignes de quiz ajoutées avec une virgule passent au point. 18 « تْ ال » corrigés (dont `arabicCanvasByLesson.ts` et `history_geo.ts`, corrigés aussi sur `v2`). Vérifié : 31 leçons chargées, 5 questions au moins par quiz, une seule bonne réponse par question. | CL-06 | Oui | Faible (données, tests ajustés) | Claude | **Prêt** — branche `fix/relecture-5ap` (commit `1cac4f47`, copie `Desktop/mssid/mssid-V1-fix-relecture`), non poussée ; tests ciblés à lancer avant le push |
| M-07 | Solution complète affichée après la 2e erreur, sans indice proposé avant (missions). À vérifier sur `main`, puis reporter le correctif de CX-08 s'il est petit. | E6 | Non | — | Claude | **Abandonné** — vérifié le 16 novembre : sur `main`, la carte garde son compteur d'indices local et la suite encouragement → indice → solution fonctionne ; le défaut est propre à la V2 (CX-29) |
| M-08 | Sujets d'examen : « 2 تمارين » et « 10 نقاط / 20 نقاط » sans accord du nombre. Fait : petite fonction `countAr` dans `ExamsViewer.tsx` (1 → « تمرين واحد », 2 → « تمرينان », 3 à 10 → pluriel, 11 et plus → « تمريناً » / « نقطة »), pour le total, la partie 1 et la partie 2 ; aussi corrigé sur `v2`. Le minuteur à 01:30:00 n'existe pas sur `main` : un sujet s'y ouvre toujours par `openExam`, qui règle la durée ; sur `v2`, le lien du plan de 10 jours l'ouvre sans passer par là (E19). | E19 | Oui (accord) / Non (minuteur) | 2 | Claude | **Prêt** — branche `fix/textes-faible-risque` (commit `5b02faeb`), non poussée |
| M-09 | Porte parents : une addition à deux chiffres, trop facile pour un enfant de 3AP à 5AP. `gateIntro` existe sur `main`. | E8 | Oui | Faible | Codex | À faire |
| M-10 | Bouton « تسجيل الدخول / إنشاء حساب مجاني » qui ouvre la fenêtre sur l'onglet de connexion : `AuthModal` a `initialMode = 'login'` par défaut et l'accueil ne précise pas le mode. Proposition : ouvrir sur l'inscription quand aucune session n'a jamais existé sur l'appareil. | E7 | Oui (vérifié) | 3 (logique d'ouverture partagée) | Codex | À faire |
| M-11 | Libellés restés en arabe dans l'interface en français. Fait : en-tête de leçon (« الدرس », niveau « سهل/متوسط/متقدم », « معلومة لولي الأمر » ×2) passé par les traductions existantes dans `LessonViewer.tsx`. Puis carte du studio des certificats de l'accueil (titre et description, clés `certificatesStudioTitle` / `certificatesStudioDesc`, aussi corrigée sur `v2`). Laissés en arabe volontairement : les étapes des missions (« الخطوة … من … » dans `AutonomyLessonPath.tsx`) et l'éducation islamique, qui sont du contenu en arabe comme les cours. | E16 | Oui | Très faible (texte) | Claude | **Prêt** — branche `fix/textes-faible-risque` (commits `675531b5` et `5b02faeb`), non poussée |

| M-12 | Conditions Android affichant BaridiMob / CCP, reçu et prix ; ligne de confidentialité mentionnant le reçu. Variantes natives prévues par CL-04 / CL-14 appliquées en CX-24 sur `v2` ; garde-fou de rendu étendu, 19 tests ciblés réussis. Reporter uniquement les variantes de texte et les tests disponibles sur `main`, sans copier les fichiers V2 entiers. | CL-04, CX-24 | Oui (vérifié par `git show main:…`, 16 novembre) | 2/5 (texte et affichage conditionnel natif ; aucun flux de paiement modifié) | Codex | À faire — lot V2 en attente de relecture Claude, aucune branche de report créée |
| M-13 | Le mot technique « default_avatar » s'affiche dans l'en-tête et le profil quand un compte n'a pas choisi d'avatar (`UserMapper` renvoie ce mot ; `useUserProgress.ts` le recopie : `avatar: authUser.avatar \|\| prev.avatar`). Corrigé sur `v2` le 16 novembre par `utils/avatar.ts` (`displayAvatar`). | Capture de Karim | Oui (même ligne, `useUserProgress.ts:268`) | 2 | Claude | **Prêt** — branche `fix/textes-faible-risque` (commit `5b02faeb`), non poussée |
| M-14 | « بين ألفين متتاليتين » au lieu de « متتاليين » (ألف est masculin) : 22 occurrences sur `main` (3AP et 4AP maths, examens). Ne pas toucher « مئتين / عشرتين متتاليتين » (féminins, justes). | CL-08 | Oui | 1 | Claude | **Prêt** — branche `fix/textes-faible-risque` (commit `5b02faeb`), non poussée |

## Ne pas reporter (V2 seulement)

Pour éviter de les revérifier : le carnet du parent et la page Premium (E9 « ما درسه », E10 « 12 أشهر » et « V1 », E11), la carte des mondes (E12), le plan de 10 jours (E18), l'écran « في أي قسم تدرس؟ » (E20, CX-28), le diagnostic 5AP et l'illustration du train des rangs n'existent pas sur `main`.
