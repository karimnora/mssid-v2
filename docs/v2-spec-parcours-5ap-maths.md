# V2 — Spécification du parcours de référence 5AP maths (CL-05)

Rédigé par Claude le 15 novembre 2026 pour la tâche CX-07 de Codex (`docs/v2-todo-claude-codex.md`). Reprend le lot 2 de `docs/v2-recommandation-design-finale.md` et l'adapte au code de `v2` après la fusion de la V1 (commit `924f059`).

## 0. Ce qu'on construit, et pourquoi

Un seul parcours, complet et poli, qui sert de modèle aux autres niveaux : un enfant de 5AP ouvre l'application, fait sa mission du jour dans une leçon de maths au format « village », manipule, se fait aider par Didou, réussit, et son parent lit un bilan juste.

**Leçons concernées :** les deux leçons du 2e trimestre, celles que les enfants travaillent en janvier, quand la phase 2 commence.

| Leçon | Identifiant | État aujourd'hui |
|---|---|---|
| Les fractions | `math-5ap-fractions` | Déjà au format village (pilote) : à polir |
| La division | `math-5ap-division` | Format classique : à passer au format village |

**Règles qui s'appliquent partout :**
- Aucun texte pédagogique inventé à l'écran. Tout vient du catalogue (`rulesAr`, `keyFormulas`, `summaryAr`, `hintsAr`, `progressiveHints`), de la mission guidée de la leçon (`data/courses/missions/math5AP.ts`) ou de ce document.
- Aucune donnée fictive : tout ce qui est affiché vient du vrai profil de l'enfant. La démonstration utilise un profil de démo clairement nommé.
- Ne modifier ni questions, ni corrigés, ni règles de validation, ni XP.
- Problèmes : affichage officiel en deux colonnes, `الحل` à gauche et `العمليات` à droite.
- Cibles tactiles d'au moins 60 px, texte utile d'au moins 16 px, nombres en LTR, mouvement réduit respecté, jamais de texte rouge à l'erreur.
- Arabe seulement : le village n'existe pas encore en français (décision ouverte n° 3).
- Tests : seulement les tests des fichiers modifiés (règle 8 de la liste) ; captures à 360 × 640 et 390 × 844.

## 1. Le parcours en un coup d'œil

1. **Accueil** : la carte « دروسي » en tête, et la mission du jour.
2. **Mission du jour** : une seule chose à faire, choisie pour l'enfant.
3. **Leçon village**, en cinq étapes : أكتشف · أجرّب · أفهم · أتدرّب · نتيجتي.
4. **Didou compagnon**, présent à chaque étape.
5. **Laboratoire lié** à la leçon, dans l'étape « أجرّب ».
6. **Fin de séance** : résultat de l'enfant et résumé pour le parent.
7. **Carnet du parent**, derrière la protection parent.

## 2. Écran par écran

### É1 — Accueil 5AP

**Ce que voit l'enfant :** le village de Didou (même décor qu'aujourd'hui), avec en tête :
- la carte « دروسي » : titre de la prochaine leçon, barre de progression de la matière, bouton « أكمل » qui ouvre la leçon **en un seul tap**, à l'étape où l'enfant s'était arrêté ;
- juste dessous, la carte « مهمّة اليوم » (É2) ;
- le titre du village devient « نتعلّم ونلعب » (l'apprentissage d'abord).

**Données :** progression filtrée par classe et par leçons publiées (`connectedHomeProgress`, déjà en place) ; dernière activité (`lastActivity`).

**Critères d'acceptation :**
- Depuis l'ouverture de l'application, une leçon de maths 5AP s'ouvre en un tap.
- La barre de progression correspond au nombre réel de leçons terminées du profil actif.
- Un compte gratuit voit le même accueil (dépend de CX-05).

### É2 — Mission du jour

**Règle de choix (déjà codée dans `utils/dailyMission.ts`, à garder) :** une compétence à revoir (erreur récente) › la leçon laissée en cours › la prochaine leçon non faite. Le choix reste le même toute la journée.

**Textes de la carte :**

| Cas | Arabe | Ce qui s'ouvre |
|---|---|---|
| `review` | لنراجع معاً: {اسم الكفاءة} | La leçon liée, directement à l'étape « أتدرّب », sur les exercices ratés en premier |
| `resume` | لنكمل درس: {عنوان الدرس} | La leçon, à l'étape où l'enfant s'était arrêté |
| `next` | درس جديد ينتظرك: {عنوان الدرس} | La leçon, à l'étape « أكتشف » |
| mission faite | أحسنت! أنهيت مهمّة اليوم. | Bouton « مهمّة أخرى » qui propose la suivante |

Le nom de la compétence vient de `data/competences/math5ap.ts` ; le titre de la leçon vient du catalogue.

**Critères d'acceptation :**
- Avec une erreur récente en fractions, la mission propose « لنراجع معاً » et ouvre les exercices ratés en premier.
- Sans aucune donnée, elle propose la prochaine leçon, jamais un faux diagnostic.

### É3 — Leçon au format village (fractions, puis division)

La mise en page `VillageLessonLayout` est généralisée : ajouter `math-5ap-division` dans `VILLAGE_LESSONS` (`components/lessonViewer/villageLessonConfig.ts`) avec une interaction `division`. Aucun identifiant de leçon dans le code de la mise en page.

La barre d'étapes affiche **cinq étapes**. L'évaluation (« أقيّم تعلّمي ») reste à l'intérieur de « أتدرّب », après les exercices.

| Étape | Ce que fait l'enfant | Source du contenu |
|---|---|---|
| أكتشف | Découvre la situation et le vocabulaire, une idée par écran, avec la consigne lue | `detailedCourse.vocabulary` + étape « observer » de la mission guidée |
| أجرّب | Manipule avant toute règle (É5) | Interaction village + laboratoire de la leçon |
| أفهم | Lit la règle, reformulée par Didou | `rulesAr`, `keyFormulas` + étape « méthode » de la mission guidée |
| أتدرّب | Fait les exercices, du guidé au seul, puis l'évaluation | `progressiveExercises` + étapes « guidé » et « seul » de la mission, puis `evaluationExercises` |
| نتيجتي | Fait le quiz ; la leçon n'est validée qu'à 100 % (règle F-10) | `quiz` + `summaryAr` |

**Interaction `division`, à construire :** un partage de dattes dans des boîtes.
- L'enfant choisit le nombre de boîtes, puis tape une boîte pour y mettre une datte, ou tape « وزّع جولة » pour en mettre une dans chaque boîte.
- Ce qui ne peut plus être partagé reste visible à côté : c'est le reste.
- À la fin, l'écriture `المقسوم = (المقسوم عليه × حاصل القسمة) + الباقي` se remplit avec les nombres manipulés.
- Tap-tap seulement, pas de glisser-déposer obligatoire.
- Les nombres proposés viennent des exercices de la leçon ; aucun nouveau calcul inventé.

**Critères d'acceptation :**
- La leçon des fractions garde son rendu actuel, sauf la barre à cinq étapes.
- La leçon de division s'ouvre au format village, et toutes ses données existantes restent accessibles.
- Un problème s'affiche toujours en deux colonnes `الحل` / `العمليات`.

### É4 — Didou compagnon

Didou est présent à chaque étape, dans un coin, sans couvrir le contenu.

| Moment | Ce que fait Didou | Pose | Source du texte |
|---|---|---|---|
| Première erreur | Encourage et propose de réessayer, sans donner la réponse | réfléchit | Phrase fixe (CL-09) |
| Deuxième erreur | Donne un indice précis, jamais la réponse | montre | `progressiveHints` ou `hintsAr` de l'exercice, sinon l'indice de « مساعدي » |
| Troisième erreur | Montre la méthode pas à pas, puis propose un exercice jumeau | montre | Correction préparée de « مساعدي » (compte dans le quota en gratuit) |
| Réussite | Félicite et reformule la règle en une phrase | célèbre | `rulesAr` ou `keyFormulas` de la leçon |
| Série de 3 réussites | Félicite plus fort | célèbre | Phrase fixe (CL-09) |

- Le bouton « ساعدني » est toujours visible. Aucune aide ne s'affiche toute seule avant 10 secondes sans action.
- Après l'aide, l'exercice réussi est noté « réussi avec aide » ; ce n'est jamais présenté comme une maîtrise.
- Tant que CL-09 n'est pas écrit, les phrases fixes reprennent celles qui existent déjà dans `LessonDidou`.
- Les poses existent déjà (`world/DidouPortrait` : parle, célèbre, réfléchit, montre).

**Critères d'acceptation :**
- Un enfant qui se trompe trois fois voit successivement l'encouragement, l'indice, puis la méthode, jamais la réponse seule au premier essai.
- Le carnet parent enregistre « avec aide » dès qu'un indice ou une méthode a été montré.

### É5 — Laboratoire lié, dans l'étape « أجرّب »

En tête du laboratoire, trois lignes, lues par Didou :

| | Fractions | Division |
|---|---|---|
| ما أكتشفه | أنّ الكسر جزءٌ من كلٍّ مقسَّمٍ إلى أجزاءٍ متساوية. | أنّ القسمة توزيعٌ بالتساوي، وقد يبقى باقٍ. |
| ما أتلاعب به | أقسم قطعةً إلى أجزاءٍ متساوية وألوّن بعضها. | أوزّع التمر على علبٍ متساوية وأرى ما يبقى. |
| ما سأعرف أن أشرحه | لماذا يمثّل ٢/٤ و١/٢ الجزءَ نفسه. | لماذا يكون الباقي دائماً أصغر من المقسوم عليه. |

Les nombres s'affichent en chiffres occidentaux dans l'interface (2/4, 1/2), comme dans le reste du catalogue ; les chiffres arabes-indiens ci-dessus ne sont qu'une écriture du document.

Le laboratoire est celui de la leçon (`interactiveTool: 'math_lab'`, `MathInteractive`), complété par l'interaction village. Toute action de glisser a son équivalent en tap-tap.

**Critère d'acceptation :** les trois lignes s'affichent et se lisent ; le laboratoire se termine sans glisser-déposer.

### É6 — Fin de séance

Deux parties, dans cet ordre :
1. **Pour l'enfant :** « نتيجتي », avec les étapes faites, les étoiles et une phrase de Didou. Les points et récompenses restent secondaires.
2. **Pour le parent :** le résumé de séance qui existe déjà (`useVillageSessionReport`, bouton « ملخص الجلسة للولي »), qui affiche :
   - la compétence travaillée (nom de `math5ap.ts`) ;
   - les exercices réussis seul et réussis avec aide ;
   - un exemple de ce que l'enfant a fait (un exercice réussi, avec sa réponse) ;
   - la prochaine étape concrète : la mission de demain, ou la leçon suivante.

**Critères d'acceptation :**
- Toutes les données du résumé viennent de la séance réelle.
- « Avec aide » n'est jamais compté comme « seul ».

### É7 — Carnet du parent

Derrière la protection parent, la séance apparaît dans le carnet existant (`ParentNotebookModal`) :
- **gratuit** : le résumé et la prochaine révision (`parentNotebookBasic`) ;
- **Premium** : le détail par compétence, l'historique et le plan de la semaine (`parentNotebookDetail`), présentés sous le nom du pilier « متابعة الوليّ » (`docs/v2-offre-trois-piliers.md`).

**Critère d'acceptation :** après une séance de fractions avec un indice, le carnet affiche la compétence des fractions avec un exercice « réussi avec aide », sur le bon enfant uniquement.

## 3. Ordre de construction conseillé (CX-07)

1. Barre à cinq étapes et contenu de la mission guidée dans la leçon des fractions (É3).
2. Didou compagnon dans la leçon des fractions (É4).
3. Accueil et mission du jour reliés à la leçon (É1, É2).
4. Résumé de séance et carnet (É6, É7).
5. Leçon de division au format village, avec son interaction (É3, É5).

Après chaque point : tests ciblés des fichiers modifiés et captures aux deux tailles. Claude rejoue ensuite l'essai simulé (CL-01, CL-08).

## 4. Hors périmètre

- Les autres leçons de 5AP et les autres niveaux (lot 6 de la recommandation design).
- Le village en français.
- Les nouvelles images : les poses existantes suffisent.

## 5. Décisions ouvertes pour Karim

1. **Deuxième leçon :** la division (proposée ici), ou une autre leçon de 5AP ?
2. **Accès gratuit au format village :** aujourd'hui, les missions immersives sont Premium, sauf la première de chaque matière (`immersiveMissions`). Proposition : la leçon des fractions au format village reste gratuite comme démonstration, et la division au format village est Premium. Le compte gratuit garde alors la leçon de division au format classique, complète.
3. **Village en français :** plus tard, ou jamais ?
4. **Genre des phrases de Didou :** masculin et féminin selon le profil, et une formulation neutre si le genre n'est pas connu (proposition de la recommandation design).
