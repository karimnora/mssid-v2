# Audit مساعدي — lot 3

Aucun contenu pédagogique ni écran modifié par cet audit. Empreinte SHA-256 : `0da2ccba1e309f1f47b19a8a9c2d29a9a6cb970d2c3444afd88b406d7311ad70`.

## Méthode

Catalogue local après transformations, même filtre curriculumReviewGate que App.tsx. État distant du réglage non interrogé.

Le réglage vaut false par défaut dans le code ; une configuration distante peut le remplacer. Les deux scénarios sont donc calculés, sans annoncer un état de production non vérifié.

- **question** : Une entrée réellement produite par buildMusaidiBank ; quiz et exercices progressifs uniquement.

- **detailedCorrection** : Au moins une étape non vide distincte de la réponse finale. Présence structurelle, pas validation pédagogique.

- **rule** : Au moins une règle non vide dans la leçon ; commune à toutes ses questions.

- **guidedCompetence** : Compétence distincte renvoyée par guidedHelpForLesson, réellement accessible dans cette leçon.

- **applicableGuide** : Même sélection que MusaidiPanel : compétence explicite de la question ou méthode unique de la leçon.

- **exclusions** : Exercices d’évaluation exclus, comme dans la banque actuelle. Brouillons non vérifiés exclus uniquement dans le scénario gate=true.

## Catalogue avec filtre de vérification désactivé

389 leçons ; 2366 questions.

| Classe | Matière | Leçons | Questions | Indice | Règle | Correction détaillée | Les trois | Compétences guidées / liées | Questions avec guide |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1AP | arabic | 22 | 155 | 57 | 155 | 155 | 57 | 0 / 4 | 0 |
| 1AP | civics | 6 | 42 | 13 | 42 | 42 | 13 | 0 / 0 | 0 |
| 1AP | islamic | 7 | 49 | 14 | 49 | 49 | 14 | 0 / 0 | 0 |
| 1AP | math | 15 | 106 | 36 | 106 | 106 | 36 | 12 / 12 | 56 |
| 1AP | science | 7 | 49 | 20 | 49 | 49 | 20 | 0 / 0 | 0 |
| 2AP | arabic | 16 | 74 | 38 | 74 | 74 | 38 | 0 / 0 | 0 |
| 2AP | civics | 7 | 21 | 14 | 21 | 21 | 14 | 0 / 0 | 0 |
| 2AP | islamic | 9 | 27 | 18 | 27 | 27 | 18 | 0 / 0 | 0 |
| 2AP | math | 20 | 61 | 40 | 61 | 61 | 40 | 8 / 8 | 61 |
| 2AP | science | 9 | 51 | 22 | 51 | 51 | 22 | 0 / 0 | 0 |
| 3AP | arabic | 11 | 65 | 27 | 65 | 65 | 27 | 0 / 0 | 0 |
| 3AP | art | 3 | 9 | 6 | 9 | 9 | 6 | 0 / 0 | 0 |
| 3AP | civics | 3 | 10 | 4 | 10 | 10 | 4 | 0 / 0 | 0 |
| 3AP | english | 8 | 32 | 16 | 32 | 32 | 16 | 0 / 0 | 0 |
| 3AP | french | 11 | 44 | 22 | 44 | 44 | 22 | 0 / 0 | 0 |
| 3AP | history_geo | 5 | 18 | 8 | 18 | 18 | 8 | 0 / 0 | 0 |
| 3AP | islamic | 7 | 24 | 10 | 24 | 24 | 10 | 0 / 0 | 0 |
| 3AP | math | 18 | 61 | 38 | 61 | 61 | 38 | 0 / 0 | 0 |
| 3AP | science | 9 | 64 | 24 | 64 | 64 | 24 | 0 / 0 | 0 |
| 3AP | tamazight | 3 | 6 | 0 | 6 | 6 | 0 | 0 / 0 | 0 |
| 4AP | arabic | 11 | 90 | 44 | 90 | 90 | 44 | 0 / 0 | 0 |
| 4AP | art | 3 | 15 | 12 | 15 | 15 | 12 | 0 / 0 | 0 |
| 4AP | civics | 4 | 24 | 16 | 24 | 24 | 16 | 0 / 0 | 0 |
| 4AP | english | 10 | 60 | 40 | 60 | 60 | 40 | 0 / 0 | 0 |
| 4AP | french | 9 | 55 | 36 | 55 | 55 | 36 | 0 / 0 | 0 |
| 4AP | history_geo | 11 | 66 | 44 | 66 | 66 | 44 | 0 / 0 | 0 |
| 4AP | islamic | 10 | 60 | 40 | 60 | 60 | 40 | 0 / 0 | 0 |
| 4AP | math | 12 | 62 | 48 | 62 | 62 | 48 | 0 / 0 | 0 |
| 4AP | science | 12 | 96 | 48 | 96 | 96 | 48 | 0 / 0 | 0 |
| 4AP | tamazight | 4 | 22 | 16 | 22 | 22 | 16 | 0 / 0 | 0 |
| 5AP | arabic | 17 | 135 | 117 | 135 | 135 | 117 | 0 / 14 | 0 |
| 5AP | art | 3 | 9 | 6 | 9 | 9 | 6 | 0 / 0 | 0 |
| 5AP | civics | 11 | 66 | 33 | 66 | 66 | 33 | 0 / 0 | 0 |
| 5AP | english | 9 | 75 | 55 | 75 | 75 | 55 | 0 / 0 | 0 |
| 5AP | french | 7 | 60 | 45 | 60 | 60 | 45 | 0 / 0 | 0 |
| 5AP | history_geo | 10 | 88 | 69 | 88 | 88 | 69 | 0 / 0 | 0 |
| 5AP | islamic | 16 | 142 | 112 | 142 | 142 | 112 | 0 / 0 | 0 |
| 5AP | math | 16 | 138 | 106 | 138 | 138 | 106 | 0 / 16 | 0 |
| 5AP | science | 15 | 132 | 106 | 132 | 132 | 106 | 0 / 0 | 0 |
| 5AP | tamazight | 3 | 3 | 0 | 3 | 3 | 0 | 0 / 0 | 0 |

## Catalogue avec filtre de vérification activé

0 leçons ; 0 questions.

| Classe | Matière | Leçons | Questions | Indice | Règle | Correction détaillée | Les trois | Compétences guidées / liées | Questions avec guide |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |

## Dix leçons de l’audit 5AP précédent

Attention : la sélection comprend huit leçons de maths et deux d’arabe. Ce ne sont pas dix leçons de maths. Elle prévoyait une application après les retours familles ; cet audit ne déclare pas cette condition satisfaite.

| Leçon | Questions | Indice | Règle | Correction | Guide applicable | Règles / formules disponibles |
| --- | --- | --- | --- | --- | --- | --- |
| math-5ap-large-numbers | 9 | 7 | 9 | 9 | 0 | oui / 2 |
| math-5ap-decimals | 9 | 7 | 9 | 9 | 0 | oui / 2 |
| math-5ap-operations | 9 | 7 | 9 | 9 | 0 | oui / 2 |
| math-5ap-division | 9 | 7 | 9 | 9 | 0 | oui / 2 |
| math-5ap-proportionality-ruleofthree | 9 | 7 | 9 | 9 | 0 | oui / 2 |
| math-5ap-percentage-scale | 9 | 7 | 9 | 9 | 0 | oui / 3 |
| math-5ap-perimeters-areas | 9 | 7 | 9 | 9 | 0 | oui / 3 |
| math-5ap-durations | 9 | 7 | 9 | 9 | 0 | oui / 2 |
| arabic-5ap-sentence-components | 9 | 7 | 9 | 9 | 0 | oui / 2 |
| arabic-5ap-integration-writing | 8 | 7 | 8 | 8 | 0 | oui / 0 |

## Détail et reproductibilité

`audit.json` contient chaque leçon, les manques et les deux scénarios ; `lecons.csv` est le tableau exportable. Relancer depuis frontend : `node node_modules/tsx/dist/cli.mjs scripts/audit-musaidi-coverage.ts`.

Les volumes ne certifient ni la justesse, ni la pertinence d’un indice, ni la conformité au programme. Aucune capture mobile supplémentaire : le lot ne change pas l’interface.
