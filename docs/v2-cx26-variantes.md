# CX-26 — Réponses acceptées en plus pour les réponses à trou (4AP et 5AP)

Préparé par Claude le 17 novembre 2026, avant que CX-26 existe dans le code. Données : `docs/v2-cx26-variantes.json`. Elles sont prêtes à poser dans le champ `fillBlankAcceptedAr` dès que Codex l'aura ajouté. Rien n'est encore modifié dans `frontend/src/data`.

## Périmètre

**154 exercices à trou dont la réponse est en lettres arabes** en 4AP et 5AP, relevés par script dans `frontend/src/data/courses/4AP` et `5AP`. Ce sont les 154 annoncés dans CX-26. Ils totalisent **483 réponses acceptées en plus**, et 7 exercices restent sans variante, volontairement. Les réponses en lettres latines (anglais, français) ne sont pas concernées.

Chaque ligne du JSON donne le fichier, l'identifiant de l'exercice (absent pour les 7 exercices d'éducation civique de `4apLessonEnricher.ts`, qui n'en ont pas), le début de la question, la réponse attendue et la liste à ajouter. Pour retrouver l'exercice, utiliser le couple fichier + `problemAr`, qui est unique ; les numéros de ligne changent trop souvent.

## Règles appliquées

| Matière | Ce qui est accepté en plus | Pourquoi |
|---|---|---|
| **Arabe (langue)**, 33 exercices | Uniquement une liste écrite à la main : le mot recopié de la phrase avec ses voyelles ou sans elles, la chadda, et les formes justes équivalentes (« اللاتي » et « اللائي » pour « اللواتي », « معتل أجوف » pour « أجوف », « مبتدأ مرفوع بالضمة »). **Aucune faute d'orthographe** (ة/ه, hamza, ى/ي) n'est acceptée. | En langue, l'orthographe et les voyelles font partie de ce qu'on évalue. |
| **Sciences, histoire-géographie, éducation islamique, arts, éducation civique**, 121 exercices | Avec ou sans « ال » pour un nom seul ; hamza écrite comme un simple alif (« اكسجين ») ; ة finale écrite ه ; ى finale écrite ي ; chadda absente ; synonymes du manuel et réponses plus longues mais justes (« الرسكلة » pour « إعادة التدوير », « الطاقة الريحية », « مدار السرطان », « ديهيا » pour « الكاهنة »). | On évalue la notion, pas l'orthographe. Sur un clavier de téléphone, un enfant tape rarement la hamza ou la chadda. |
| **Versets et hadiths à compléter**, 14 exercices | Seulement les écarts de frappe (hamza, ى/ي, chadda). Jamais « ال » ajouté ou retiré. | Le mot doit être celui du texte. |

Pas de « ال » ajouté aux noms propres, aux verbes, aux adjectifs ni aux particules (« ثور » ne devient pas « الثور », qui veut dire « le taureau »).

## Les 7 exercices sans variante

« كبد » (2 fois), « شهر », « زلزالها » : versets à compléter, le mot n'a pas d'autre forme. « ذو النورين » : à laisser exact. « سيرتا » (2 fois, 4AP) : nom propre sans autre forme ; « قسنطينة » serait faux, puisque la question demande le nom ancien.

## Points relevés en chemin

| # | Exercice | Constat | Proposition |
|---|---|---|---|
| V1 | `geo-4ap-location-eval2` (4AP), **présent aussi sur `main`** | « اذكر دولة مجاورة للجزائر من الشرق » : la réponse attendue est « تونس », mais **la Libye borde aussi l'Algérie à l'est**. Un enfant qui répond « ليبيا » est compté faux. | Sur `v2`, la variante « ليبيا » est prévue. Sur `main`, qui n'aura pas CX-26, reformuler : « اذكر الدولة المجاورة للجزائر من الشمال الشرقي ». À inscrire dans `a-reporter-sur-main.md` après accord de Karim. |
| V2 | `ar4-sifa-ex2` (arabe 4AP) | La consigne demande la qualification « منصوبة مؤنثة », mais la réponse attendue est « جميلة » sans tanwin. | « جميلةً » est ajouté aux réponses acceptées. Mettre « جميلةً » comme réponse principale serait plus juste ; à faire avec CX-26. |
| V3 | `arabic-5ap-passive-ex2`, `arabic-5ap-passive-eval3`, `arabic-5ap-kaninna-ex6`, `arabic-5ap-passive-ex6` | La réponse se distingue **seulement par les voyelles** (« فُهِمَ » / « فَهِمَ », « التلميذُ » / « التلميذَ »). Sur un téléphone, un enfant de 10 ans tape rarement les voyelles : il sera compté faux en ayant compris. | Les passer en QCM, comme les 33 autres de la relecture X1 (distracteurs : la forme active, la mauvaise voyelle). Travail de Claude, à faire après accord. |
| V4 | `islamic-5ap-tayammum-eval3` | « كم ضربة يحتاجها التيمم؟ » → « واحدة ». Dans le rite malékite, une frappe est obligatoire et la seconde est recommandée. Le manuel peut enseigner « ضربتان ». | À vérifier par l'enseignant (ajouté à sa grille). |
| V5 | `history-5ap-periods-ex2` | « وسيطة » : les enfants connaissent surtout « العصور الوسطى ». | « الوسطى » et « العصور الوسطى » sont acceptés. |

## Pose dans les données (après CX-26)

Un script lit le JSON, retrouve chaque exercice par fichier + `problemAr` et ajoute `fillBlankAcceptedAr: [...]` après `fillBlankAnswerAr`. Il échoue si un exercice n'est pas trouvé exactement une fois. Puis test ciblé de `practiceAssessment` et chargement des leçons, lancé par Codex (règle 3).
