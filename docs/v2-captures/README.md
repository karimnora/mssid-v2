# Captures de la V1 — référence pour le prototype V2

Prises le 27 septembre 2026 sur la V1 lancée en local (`vite`, branche `v2` au commit `949cce7`, code identique à `main` pour le frontend), en invité, écran simulé de 390 × 844 px dans le navigateur. À confirmer sur un vrai téléphone Android : barre système, zones de sécurité et rendu du WebView peuvent changer le résultat.

## Correspondance avec les six écrans du prototype

| Écran du prototype | Équivalent V1 | Captures |
|---|---|---|
| 1. Choix du profil enfant | N’existe pas (un profil par compte ou par appareil) | — |
| 2. Accueil préscolaire | Choix de la langue, puis « عالم الصغار » | `02a`, `02b` |
| 3. Accueil primaire | Accueil 1AP (en-tête, Didou, préscolaire, matières, examens, défis, labs) | `03`, `03b`, `03c` |
| 4. Exercice avec consigne audio et correction | Leçon `math-1ap-t1-numbers-0-5` en 4 étapes ; sujet d’examen 5AP en deux colonnes | `04a` à `04f`, `07b` |
| 5. Bilan de séance | N’existe pas : la leçon se termine sur le bouton « الدرس التالي » | `05` |
| 6. Tableau de bord parent | N’existe pas : le profil est celui de l’enfant (nom, avatar, badges) | `06` |

Référence complémentaire : banque d’examens 5AP (`07a`).

## Constats

### Parcours et structure

- **Accueil primaire long :** environ trois hauteurs d’écran (2 514 px). L’action principale visible est « استكشف الرياضيات » ; les matières arrivent au deuxième écran, examens, défis et labs au troisième.
- **Préscolaire :** un écran de choix de la langue précède l’accueil à chaque première visite ; l’accueil montre le défi du jour, les fiches à imprimer, puis de grandes portes (ateliers, apprendre, jouer).
- **Leçon en 4 étapes :** explication, activité interactive, série d’exercices sur un même écran (chacun avec son bouton « تحقق من الإجابة »), quiz de 4 questions. Plusieurs activités par écran à l’étape 3.
- **Correction :** la réponse juste est donnée immédiatement après une erreur, sans nouvel essai. Le quiz fige les réponses.
- **Pas de bilan de séance** ni d’espace parent.
- **Barre du bas :** accueil, cours, Didou, jouer, profil. Pas d’accès direct aux examens ni aux labs (F-08 prévoit accueil, cours, labs, examens, tuteur IA, profil). Sur la page des examens, l’onglet actif affiché est « الدروس ».

### Défauts relevés (V1, à traiter sur `main`)

- **Bouton « التالي » de la leçon recouvert par la barre du bas** selon la position de défilement : le bloc collant (`bottom: 88px`) passe sous la barre fixe et le bouton central de Didou (`04b`).
- **Compteurs inversés** par le mélange arabe / nombres : « الخطوة 4 / 2 » au lieu de 2 / 4 (`04c`), « 4 / 1 أسئلة » au lieu de 1 / 4 (`05`).
- **Colonne « الحل » des examens déformée** par le même problème de sens d’écriture : le rangement 3.08 < 3.18 < 3.8 s’affiche « 3.8 < 3.18 < 3.08 », ce qui est faux à la lecture ; la division 437 = (72 × 6) + 5 devient illisible (`07b`). Les opérations ne sont pas posées (lignes de texte séparées par `------`, chiffres non alignés).
- **Explications génériques** dans le quiz : « الإجابة الصحيحة تم اختيارها استنادا لقاعدة الدرس الذهبية » pour deux questions sur quatre (`05`).
- **Erreurs en rouge vif** (bloc, texte et badge) dans le quiz, alors que `CLAUDE.md` demande d’éviter le texte rouge agressif sur une erreur d’exercice (`05`).
- **Réinitialisation de la progression** protégée par un simple `window.confirm`, pas par le Parent Gate, contrairement à la suppression de compte (`06`).

### Ce qui fonctionne et peut servir de base

- Palette crème, émeraude et ambre déjà appliquée ; boutons audio présents sur chaque bloc.
- Validation de leçon conforme à F-10 dans le code (`LessonQuizPanel.tsx` : toutes les réponses justes).
- Disposition des deux colonnes dans le bon sens (`العمليات` à droite, `الحل` à gauche), timer, impression et « إظهار كافة الحلول » en 5AP.
