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
| 2 — maths, 2e trimestre | `math-5ap-durations`, `math-5ap-polygons-triangles` | Relu le 15 novembre 2026 |
| 3 — maths, 1er trimestre | grands nombres, opérations, longueurs/masses/capacités, droites et angles | Relu et corrigé le 16 novembre 2026, sauf M1 et A1 (décisions ci-dessous) |
| 4 — maths, 3e trimestre | décimaux, proportionnalité, pourcentages et échelle, périmètres et aires, cercle, symétrie et solides, organisation de données | Relu et corrigé le 16 novembre 2026 (cercle compris, `math-circle.ts`) ; trois points pour l'enseignant, un pour Codex |
| 5 — arabe | les 17 leçons de 5AP, avec le tableau `الكلمة` / `إعرابها` | Relu et corrigé le 16 novembre 2026, quiz complétés (5 questions par leçon) |

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

## Lot 2 — Résultats

| Niveau / identifiant | Objectif adapté | Prérequis / période | Consigne claire | Calcul et corrigé exacts | Aide utile | Langue | Décision | Correction précise |
|---|---|---|---|---|---|---|---|---|
| 5AP `math-5ap-durations` (7 exercices, 6 évaluations, 2 questions de quiz) | Oui | **Non pour le quiz q2** | Oui | Oui, les 20 vérifiés | Oui, indices progressifs | Deux tournures | **À corriger** | Voir T1 à T4. |
| 5AP `math-5ap-polygons-triangles` (7 exercices, 6 évaluations, 2 questions de quiz) | Oui | **À vérifier** (somme des angles) | **Non : définitions contradictoires** | Oui, les 9 calculs vérifiés | Oui | Une tournure ambiguë | **À corriger** | Voir G1 à G5. |

### Points à corriger dans les durées

| # | Où | Problème | Gravité | Correction proposée |
|---|---|---|---|---|
| T1 | Quiz `q2` : « كم دقيقة في 2,5 ساعة؟ » | 2,5 est un nombre décimal, vu au 3e trimestre seulement (`math-5ap-decimals`). La leçon est au 2e trimestre, et ce quiz doit être réussi à 100 %. Même défaut que D1. | Haute | « كم دقيقة في ساعتين ونصف؟ » avec les mêmes choix (150 juste, 250, 25). Explication : « ساعتان = 120 دقيقة، ونصف ساعة = 30 دقيقة، المجموع 150 دقيقة ». La moitié est une fraction, vue dans ce trimestre. |
| T2 | Exercice `ex3` et évaluation `eval4` : « 2 ساعة و15 دقيقة », « 2 ساعة و30 دقيقة », « 2 ساعة » | En arabe, on écrit le duel « ساعتان », pas « 2 ساعة ». | Faible | « ساعتان و15 دقيقة », « ساعتان و30 دقيقة », « ساعتان ». |
| T3 | Objectif « أُحوّل بين الساعات والدقائق والثواني » | Une seule question porte sur les secondes (`eval1`), et elle se limite à « combien de secondes dans une minute ». L'objectif n'est pas vraiment travaillé. | Faible | Ajouter un exercice : « كم ثانية في 3 دقائق و20 ثانية؟ » (réponse 200). |
| T4 | Quiz | 2 questions seulement pour valider la leçon (comme D4). | Faible | Ajouter 3 questions : une soustraction avec retenue (ex. 11h05min − 8h40min = 2h25min), une durée de trajet, une conversion minutes → heures et minutes. |

À faire vérifier par l'enseignant : la leçon écrit les unités en lettres latines (`h`, `min`, `s`). Le manuel algérien de 5AP les écrit-il ainsi, ou en arabe (`سا`, `د`, `ثا`) ? Si c'est en arabe, il faut l'adopter dans toute la leçon.

### Points à corriger dans les polygones et triangles

| # | Où | Problème | Gravité | Correction proposée |
|---|---|---|---|---|
| G1 | Vocabulaire, règles, `shape_explorer`, `ex1b`, `eval2`, `eval4` | **Les définitions se contredisent.** `ex1b` dit qu'un carré est un rectangle (juste). Mais la règle du rectangle dit « قطران متقايسان **وغير متعامدين** », ce qui exclut le carré. De même, le losange est défini « زواياه غير قائمة », ce qui exclut le carré, alors que la correction de `eval2` dit « المربع حالة خاصة من المعين ». Un enfant qui applique la règle de la leçon répond faux à `ex1b`. | Haute | Définitions inclusives partout : rectangle « 4 زوايا قائمة، وقطراه متقايسان » ; losange « 4 أضلاع متقايسة، وقطراه متعامدان » ; ajouter la règle « المربع مستطيل خاص ومعين خاص ». Dans `eval4`, écrire « مستطيل ليس مربعاً » et « معين ليس مربعاً » au lieu de « فقط ». |
| G2 | Évaluation `eval1`, correction : « ضلعان متقايسان فقط (وليس ثلاثة) » | Même défaut pour les triangles : un triangle équilatéral est aussi isocèle. | Moyenne | « مثلث له ضلعان متقايسان يسمى متساوي الساقين ». Supprimer « فقط (وليس ثلاثة) ». |
| G3 | Somme des angles du triangle (180°) et du quadrilatère (360°), objectif 3, `ex4`, `ex6`, `eval3`, `eval5`, `eval6`, quiz `q2`, jeu | Cette propriété est en principe enseignée au collège (1re année moyenne), pas dans le programme de 5AP. Si c'est confirmé, un tiers de la leçon et une question du quiz sont hors programme. | Moyenne | **À trancher avec l'enseignant et le manuel.** Si c'est hors programme : garder ces questions comme « défi » facultatif, et remplacer `q2` du quiz par une question sur les propriétés des côtés. |
| G4 | Exemple 2, étape : « تعريف شكل معيّن » | « معيّن » (« déterminé ») se lit comme « المعين » (le losange), à côté de la définition du losange : l'enfant peut croire que la réponse est « losange ». | Faible | « هذا هو تعريف المربع ». |
| G5 | Résumé (« متوازي الاضلاع ») et quiz | Le parallélogramme est annoncé dans le résumé mais jamais traité. Le quiz n'a que 2 questions. | Faible | Retirer « متوازي الاضلاع » du résumé, ou ajouter une règle. Ajouter 3 questions au quiz : triangle isocèle, carré et rectangle, losange. |

À vérifier dans le code avant correction : la réponse à trou de `ex2` (« مربع ») accepte-t-elle aussi « المربع » ?

### Vérifié et correct

- **Durées :** les 20 calculs et réponses (2h20+1h50, 5h15−2h40, Alger–Oran 4h50, devoirs 19h30, 3h40+1h35, 07h50→09h10, 6h10−3h35, film 105 min, 4h20+2h50, 06h35→07h05, réunion 85 min, 10h30+1h45, conversions 75, 90, 120, 135, 150 et 180 min). Les distracteurs reprennent les vraies erreurs (calcul en base 100, « 11h75min »).
- **Polygones :** les 9 calculs (70°, 60°, 110°, 40°, 160°, et les 3 sommes du jeu).

## Lot 3 — Résultats

| Niveau / identifiant | Objectif adapté | Prérequis / période | Consigne claire | Calcul et corrigé exacts | Aide utile | Langue | Décision | Correction précise |
|---|---|---|---|---|---|---|---|---|
| 5AP `math-5ap-large-numbers` (7 exercices, 6 évaluations, 2 questions de quiz) | Oui | Oui (1er trimestre) | Oui | Oui, les 22 vérifiés | Une aide trompeuse (`eval4`) | Une erreur de fait, une tournure | **Corrigé** | N1 à N5. |
| 5AP `math-5ap-operations` (7 exercices, 6 évaluations, 2 questions de quiz) | **Annonce les décimaux** | **Non : décimaux au 1er trimestre** | Oui | Oui, les 24 vérifiés | Vocabulaire mélangé | Une tournure | **Corrigé** | O1 à O6. |
| 5AP `math-5ap-lengths-masses-capacities` (7 exercices, 6 évaluations, 2 questions de quiz) | Oui | **Non : nombres décimaux partout** | Oui | Oui, les 21 vérifiés | Aides qui donnent la réponse ; une aide fausse | Trois tournures | **Corrigé, sauf M1** | M1 à M6. |
| 5AP `math-5ap-lines-angles` (7 exercices, 6 évaluations, 2 questions de quiz) | Oui | **À vérifier** (mesure en degrés) | Oui | Oui, les 7 calculs vérifiés | Une aide fausse | Une notation fausse | **Corrigé, sauf A1** | A1 à A4. |

### Points relevés

| # | Où | Problème | Gravité | Correction |
|---|---|---|---|---|
| N1 | Grands nombres, `discoveryAr` | « عدد سكان الجزائر يُكتب بأكثر من 8 أرقام » est faux : environ 47 millions s'écrit avec 8 chiffres. | Moyenne | « يُكتب بـ 8 أرقام ». **Appliqué.** |
| N2 | Grands nombres, quiz `q1`, explication | Appelle 87 « الرقم », alors que toute la leçon oppose le chiffre (رقم) et le nombre (عدد). | Moyenne | « عدد مئات الآلاف فهو 87 ». **Appliqué.** |
| N3 | Grands nombres, `eval4`, aide | « انظر إن كان العدد أقرب للمليون الأدنى أو الأعلى » confond encadrement et arrondi. | Faible | « العدد محصور بين هذا العدد من الملايين والمليون الموالي ». **Appliqué.** |
| N4 | Grands nombres, `eval6` | « باعت جمعية خيرية ... من التبرعات » : une association ne vend pas des dons. | Faible | « جمعت ». **Appliqué.** |
| N5 | Grands nombres, quiz | 2 questions (comme D4). | Faible | 3 questions ajoutées : lecture avec zéros (4 003 000), comparaison par le nombre de chiffres, décomposition de 3 060 400. **Appliqué.** |
| O1 | Opérations : titre, objectif 1, règle 1, `keyFormulas` | La leçon (1er trimestre) annonce les nombres décimaux (« والعشرية », « الفاصلة تحت الفاصلة », « نزيح الفاصلة »), vus au 3e trimestre dans `math-5ap-decimals`. Aucun exercice ne les travaille. Le titre dit aussi « الأربع » sans la division. | Moyenne | Décimaux retirés de ces quatre endroits ; titre « العمليات الحسابية: الجمع، الطرح والضرب في الأعداد الطبيعية ». **Appliqué.** |
| O2 | Opérations : erreur courante 1, aides de `ex2` et `eval1` | « الاستلاف » (emprunt, soustraction) est employé pour la retenue de l'addition (« الاحتفاظ »). | Moyenne | « الاحتفاظ » pour l'addition, « الاستلاف » pour la soustraction. **Appliqué.** |
| O3 | Opérations, exemple 5 | « 2 كتاب » (comme D3). | Faible | « كتابين ». **Appliqué.** |
| O4 | Opérations, `ex1` | 289 + 411 = 700 exactement : l'estimation tombe juste et n'apprend rien ; la correction dit « بالصدفة تقريباً ». | Faible | 289 + 426 (estimation 700, résultat exact 715). **Appliqué.** |
| O5 | Opérations, métadonnées | `sourceReference` et `sourceNoteAr` disent que le trimestre est volontairement laissé vide, mais `trimester: 1` est renseigné. | Faible | À trancher par l'enseignant ; non modifié. |
| O6 | Opérations, quiz | 2 questions. | Faible | 3 questions ajoutées : addition avec retenues, estimation d'un produit, problème de multiplication. **Appliqué.** |
| M1 | Longueurs, masses, capacités : 13 questions sur 21 et 4 exemples | La leçon est au 1er trimestre mais utilise des nombres décimaux presque partout (2,5 kg ; 4,2 km ; 0,75 m ; réponse saisie 3,75 q à `ex6` ; quiz `q1` 3,5 hL). Même défaut que D1 et T1, mais à l'échelle de toute la leçon. | **Haute** | **Décision de Karim** (voir plus bas). |
| M2 | Longueurs, masses, capacités, `eval4`, aide | « استعمل قاعدة ×100 أو ÷100 » alors que 2 t → kg demande ×1 000. | Moyenne | « عدّ الخطوات بين الوحدتين في الجدول... (والطن = 1 000 kg) ». **Appliqué.** |
| M3 | Longueurs, masses, capacités, aides de `eval1` et `eval2` | L'aide d'une évaluation donne directement la réponse (« 1 kg = 1 000 g », « 1 hL يساوي 100 L فقط »). | Moyenne | Aides qui renvoient au tableau (compter les étapes). **Appliqué.** Les aides des exercices d'entraînement sont gardées. |
| M4 | Longueurs, masses, capacités : vocabulaire, erreur courante 3, conclusion, aide de `ex5`, exemple intégré | « كل kL » (abréviation inventée, unité absente du tableau) ; « نقسم في 10 » au lieu de « نقسم على 10 » ; coquille « زنها ». | Faible | Corrigés. **Appliqué.** |
| M5 | Longueurs, masses, capacités, quiz | 2 questions. | Faible | 3 questions ajoutées, sans décimal : 3 L en cL, 2 t et 5 q en kg, choix de l'unité. **Appliqué.** |
| M6 | Longueurs, masses, capacités, objectif 3 « أختار الوحدة المناسبة » | Aucune question ne travaillait cet objectif. | Faible | Couvert par la nouvelle question `q5`. **Appliqué.** |
| A1 | Droites et angles : toute la partie « angles » | La leçon mesure les angles en degrés (rapporteur, 40°, 125°, addition de 90° + 55°). À vérifier : en primaire algérien, les angles se comparent d'habitude à l'équerre ou au gabarit, et la mesure au rapporteur arrive au collège. Même question que G3. | Moyenne | **À trancher avec l'enseignant et le manuel**, en même temps que G3. |
| A2 | Droites et angles, `eval1`, aide | « أكبر زاوية ممكنة » est faux (un angle peut dépasser 180°) ; 360° est d'ailleurs un des choix. | Faible | « ضلعاها على استقامة واحدة ». **Appliqué.** |
| A3 | Droites et angles, exemple intégré | « الزاوية DAB » : (D) est le nom d'une droite, pas d'un point. | Faible | Ajout du point C sur (D) ; « الزاوية CAB ». **Appliqué.** |
| A4 | Droites et angles, quiz | 2 questions, et `q2` répète `eval2`. | Faible | 3 questions ajoutées : sécantes non perpendiculaires, angles adjacents, droites perpendiculaires à une même droite. **Appliqué.** |

### Vérifié et correct

- **Grands nombres :** les 22 calculs et réponses (décompositions de 2 340 506, 52 000, 4 073 000, 6 204 000 ; encadrements ; rangements ; 67 530 000 − 675 030 = 66 854 970 ; 650 000 ; 2 150 000 ; chiffre et nombre dans 8 745 210).
- **Opérations :** les 24 calculs (6 234 ; 3 356 ; 78 000 ; 2 260 ; 142 800 ; 7 861 ; 738 ; 408 ; 2 700 ; 4 892 ; 3 853 ; 378 ; 2 100 ; 8 820 ; 2 625, et le jeu).
- **Mesures :** les 21 conversions et calculs (dont 4 500 kg = 4,5 t, 320 − 85 = 235 L, 12 × 750 mL = 9 L).
- **Angles :** les 7 sommes et classements (125°, 85°, 145°, 140°, et le jeu, dont 89° « حادة »).
- Les 12 nouvelles questions de quiz ont chacune une explication pour la bonne réponse et pour chaque distracteur.

## Corrections appliquées (16 novembre 2026, sur `v2` seulement)

Décision de Karim : corriger d'abord les lots 1 et 2, sur `v2`. `main` (la V1 en production) n'est pas touché.

| Point | Fait |
|---|---|
| D1 | Quiz `q2` de la division : « 9 600 ÷ 100 » (96), sans nombre décimal. |
| D2 | `eval6` : 3 400 sacs de farine pour 15 familles (reste 10 sacs). |
| D3 | `ex6` : « 2 (كتابان) ». |
| D4 | Quiz de la division porté à 5 questions : division par 12, vérification par (diviseur × quotient) + reste, partage de 100 crayons. |
| Fractions | Quiz porté à 5 questions : comparaison de fractions de même dénominateur, fraction décimale, 2/3 d'un groupe de 30. |
| T1 | Quiz `q2` des durées : « ساعتين ونصف » au lieu de « 2,5 ساعة ». |
| T2 | « ساعتان » au lieu de « 2 ساعة » (ex3, eval2, eval4). |
| T3 | Nouvel exercice `math-5ap-durations-ex5b` : 3 min 20 s = 200 s. |
| T4 | Quiz des durées porté à 5 questions : soustraction avec retenue, trajet Sétif–Béjaïa, conversion de 200 minutes. |
| G1 | Définitions inclusives : rectangle (diagonales de même longueur), losange (diagonales perpendiculaires), règle « le carré est un rectangle particulier et un losange particulier » ; `eval4` oppose « مستطيل ليس مربعاً » et « معين ليس مربعاً ». |
| G2 | `eval1` : l'équilatéral est un cas particulier de l'isocèle. |
| G4 | Exemple 2 : « هذا هو تعريف المربع ». |
| G5 | Parallélogramme retiré du résumé ; quiz porté à 5 questions (isocèle, carré-rectangle, losange). |

**Non appliqué :** G3 (somme des angles), en attente de l'avis de l'enseignant et du manuel. La phrase d'erreur courante sur les diagonales garde encore « المستطيل (متقايسان فقط) » : c'est la description de l'erreur, pas la règle, mais l'enseignant peut la reformuler.

Vérifié : `tsc` sans erreur, tests des données et des calculs (`src/data`, `src/test`) : 1 836 sur 1 836. L'extraction `scripts/premium-content-out/math-5ap-division.*.json` est régénérée.

**Lot 3 (16 novembre 2026) :** corrections N1 à N5, O1 à O4, O6, M2 à M6 et A2 à A4 appliquées sur `v2` dans `frontend/src/data/courses/5AP/math.ts`. **Pas encore vérifiées** : ni `tsc` ni tests lancés (en attente du feu vert de Karim ; selon la règle 3 de la liste des tâches, Codex peut lancer `npx vitest run src/data/courses`).

## Lot 4 — Résultats

| Niveau / identifiant | Calculs et réponses | Décision | Points |
|---|---|---|---|
| 5AP `math-5ap-decimals` | Tous refaits, tous justes | **Corrigé** | DEC1 à DEC4 |
| 5AP `math-5ap-perimeters-areas` | Tous refaits, tous justes | **Corrigé** | PER1 à PER3 |
| 5AP `math-5ap-symmetry-solides` | Tous refaits, tous justes | **Corrigé**, un terme à vérifier | SYM1, SYM2 |
| 5AP `math-5ap-proportionality-ruleofthree` | Tous refaits, tous justes | **Corrigé**, une méthode à vérifier | PRO1, PRO2 |
| 5AP `math-5ap-percentage-scale` | Tous refaits, tous justes | **Corrigé** | PCT1 |
| 5AP `math-5ap-data-organization` | Tous refaits, tous justes | **Corrigé**, un terme à vérifier | DAT1, DAT2 |

### Points relevés

| # | Où | Problème | Gravité | Correction |
|---|---|---|---|---|
| DEC1 | Décimaux : `keyFormulas` et carte « الضرب والقسمة » | **Les deux formules clés sont fausses** : « 3 425 × 100 = 342,5 » et « 342,5 ÷ 100 = 3 425 ». La virgule de 3,425 est devenue une espace de milliers. Ce sont les formules que Didou lit et que « مساعدي » affiche. | **Haute** | « 3,425 × 100 = 342,5 » et « 342,5 ÷ 100 = 3,425 ». **Appliqué.** |
| DEC2 | Décimaux : règle 2 et correction de `ex1b` | Même défaut : « 5,4 = 5,40 = 5 400 » et « 14,8 = 14,80 = 14 800 », faux. | **Haute** | « 5,400 » et « 14,800 ». **Appliqué.** |
| DEC3 | Décimaux, carte de comparaison | « ثم المئات » (les centaines) au lieu des centièmes. | Moyenne | « ثم الأجزاء من مئة ». **Appliqué.** |
| DEC4 | Décimaux, exemple 5 | « ضاعف تاجر سعر منتج ... بضربه في 100، ثم قسّم على 10 » : une histoire sans sens (« doubler » en multipliant par 100). | Faible | Prix de 100 stylos puis de 10 stylos ; mêmes calculs. **Appliqué.** |
| PER1 | Périmètres et aires, situation d'intégration | « تسييج وتلييس » (« plâtrer » un champ) et « أراد الصاحب تسييجه بفرز مدخل » : arabe incorrect. | Faible | « تسييج حقل فلاحي », « أراد صاحبه تسييجه مع ترك مدخل ». **Appliqué.** |
| PER2 | Titre de la leçon des périmètres et aires | Le titre annonce les « formes composées » (الأشكال المركبة), jamais travaillées. *Correction du 16 novembre : le cercle a bien sa leçon, `math-5ap-circle-radius`, dans un fichier séparé (`5AP/math-circle.ts`). Relue : centre, rayon, diamètre, 3 exercices et 3 questions, tous justes.* | Faible | Retirer « الأشكال المركبة » du titre, ou ajouter un exercice sur une forme composée. Non fait. |
| SYM1 | Symétrie et solides, quiz `q1` | Coquille « كم عد ». Les 2 questions du quiz portent sur les faces et sommets : rien sur la symétrie ni le volume. | Faible | Corrigé ; 3 questions ajoutées (symétrique d'un point, volume en comptant les cubes, cube de côté 2). **Appliqué.** |
| SYM2 | Symétrie et solides, tout le vocabulaire du patron | La leçon dit « مسطّح (النشر) ». À vérifier : le manuel algérien emploie-t-il plutôt « تصميم المجسم » ? | Faible | **À vérifier avec l'enseignant.** |
| PRO1 | Proportionnalité, résumé | « نقوم بحل الجدول خطياً أو أفقياً » : « خطياً » n'a pas de sens ici. | Faible | « عمودياً أو أفقياً ». **Appliqué.** |
| PRO2 | Proportionnalité, règle 2, méthode 3 | « ضرب المتقابلين قُطرياً » (produit en croix). À vérifier : est-ce enseigné en 5AP, ou le manuel passe-t-il par l'unité et le coefficient ? L'objectif 1 (reconnaître une situation proportionnelle) n'était travaillé que dans le jeu. | Faible | Méthode : **à vérifier avec l'enseignant**. Quiz : 3 questions ajoutées, dont une pour reconnaître une situation proportionnelle. **Appliqué.** |
| PCT1 | Pourcentages et échelle, `keyFormulas` | Libellé « البعد الحقيقي بالشيء » sans sens. Le quiz ne portait ni sur la réduction, ni sur l'échelle. | Faible | « البعد الحقيقي بسلّم الخريطة » ; 3 questions ajoutées (réduction, échelle, vitesse). **Appliqué.** |
| DAT1 | Organisation de données : tout le vocabulaire | « المبيان » est le terme du manuel marocain. À vérifier : le manuel algérien dit-il « المخطّط بالأعمدة » ? | Moyenne | **À vérifier avec l'enseignant**, puis remplacer partout si besoin. |
| DAT2 | Organisation de données : tous les exercices | Les 12 exercices et le jeu utilisent le même tableau (livres empruntés). L'objectif 4 (choisir le bon mode de représentation) n'est pas travaillé. | Faible | Quiz : 3 questions ajoutées sur un nouveau tableau (sports préférés). Le reste est à revoir avec l'enseignant. |

### Point transversal, pour Codex

| # | Où | Problème | Gravité | Correction |
|---|---|---|---|---|
| X1 | Toutes les réponses à trou attendant un mot arabe | La comparaison est **exacte** (`isFillBlankCorrect`) : « سلّم » est compté faux si la réponse attendue est « سلم », de même « المربع » pour « مربع » ou « حاده » pour « حادة ». L'enfant qui recopie l'orthographe de la leçon peut être compté faux. **188 exercices** sont concernés en 4AP et 5AP (dont 50 en arabe 5AP, 33 en sciences 5AP, 33 en éducation islamique 5AP). | **Haute** | En 5AP maths, les 5 exercices concernés sont passés en QCM (`lines-angles-ex2`, `lines-angles-eval3`, `polygons-ex2`, `data-ex2`, `data-eval3`). **Appliqué.** Pour les autres : ajouter un champ `fillBlankAcceptedAr?: string[]` (réponses acceptées en plus) plutôt que d'assouplir la comparaison, qui doit garder les voyelles dans les exercices de langue. Tâche Codex. |

## Lot 4 — Corrections appliquées (16 novembre 2026, sur `v2` seulement)

DEC1 à DEC4, PER1, SYM1, PRO1, PCT1 ; 18 questions de quiz ajoutées (3 par leçon, chacune avec une explication pour chaque choix) ; les 5 réponses à trou de X1 passées en QCM. **Pas encore vérifiées par les tests** (en attente du feu vert). Le fichier se charge sans erreur : il a été relu par un script, ce qui ne remplace pas `tsc` ni les tests.

## Lot 5 — Arabe 5AP : résultats

Relu : règles, tableaux `الكلمة` / `إعرابها`, exemples, exercices, évaluations, jeux et quiz des 17 leçons de `5AP/arabic.ts`. Les tableaux d'i'rab sont justes. Les fautes trouvées sont surtout des explications fausses, des vocalisations fautives et des réponses à trou impossibles à réussir.

### Point le plus grave, à traiter à part

| # | Où | Problème | Gravité | Correction |
|---|---|---|---|---|
| AR0 | Quiz des 17 leçons | **16 leçons sur 17 n'ont qu'une seule question de quiz** (la première en a 2). Une leçon est donc validée (règle F-10, 100 %) sur une seule réponse. | **Haute** | **Fait le 16 novembre 2026** : 67 questions vocalisées ajoutées, 5 questions par leçon. Chacune a une explication pour la bonne réponse et pour chaque distracteur, et les distracteurs reprennent les erreurs d'élèves vues dans la leçon (« لَمْ يَتَأَخَّرُونَ », « غَزَى », « لَاعِبِينَ » / « لَاعِبَيْنِ »). Elles évitent les points à trancher (nombre de critères de la grille, « ما زال »). **À faire relire par l'enseignant.** |

### Erreurs de contenu corrigées

| # | Leçon | Problème | Gravité | Correction appliquée |
|---|---|---|---|---|
| AR1 | Plusieurs leçons (13 endroits) | Tâ du féminin écrit avec soukoun devant « ال » : « أزهرتْ الحديقةُ », « كَرَّمَتْ المَدْرَسَةُ », « كُتِبَتْ التَّاءُ ». Devant hamzat al-wasl, ce tâ prend une kasra. Faute de vocalisation dans des leçons qui enseignent la vocalisation. | Moyenne | « تِ ال » partout. |
| AR2 | `maf3ul-types`, `ex5` | « أَطَاعَ التِّلْمِيذُ طَاعَةً » présenté comme exemple de **مفعول لأجله** : « طَاعَةً » vient du même verbe, c'est un **مفعول مطلق**. L'exercice enseigne le contraire de la règle. | **Haute** | « وَقَفَ التِّلْمِيذُ اِحْتِرَاماً ». |
| AR3 | `spelling-hamzas`, exemple 5 | « يَجْرُؤُ » expliqué comme une hamza médiane « مضمومة وما قبلها ساكن ». Elle est finale, et la lettre d'avant (ر) porte une damma. | Moyenne | Explication par la règle de la hamza finale. |
| AR4 | `spelling-hamzas`, `ex6` | « شَيْئاً » justifié par « ما قبل الهمزة مكسور » : faux, c'est un yâ sakin. | Moyenne | Règle juste : après un yâ sakin, la hamza s'écrit sur la nabira. |
| AR5 | `annexation-adjective`, formule clé et exemple 1 | « المضاف نكرة، والمضاف إليه معرفة » : faux (« كِتَابُ تِلْمِيذٍ » est une annexion). | Moyenne | Le مضاف n'a ni « ال » ni tanwîn ; le مضاف إليه est toujours au génitif. |
| AR6 | `tamyiz`, `eval1` | « عِنْدِي عَشَرَةُ أَقْلَامٍ » donné comme exemple de tamyiz, alors que la leçon dit que le tamyiz est toujours au cas direct (منصوب). Après 3 à 10, le nom est au génitif. | Moyenne | « عِنْدِي عِشْرُونَ قَلَماً ». |
| AR7 | `sentence-components`, exemple 5 | Une note dit que le pluriel féminin à l'accusatif en kasra « dépasse les objectifs de la leçon », alors que la règle 3 l'enseigne et que le quiz le demande. | Moyenne | Note retirée. |
| AR8 | `hal-five-names-verbs`, exemple 4 | « في الجملة خطآن » : la correction n'en trouve qu'une, et il n'y en a qu'une. | Faible | « خطأ واحد ». |
| AR9 | `maf3ul-types`, jeu | « ضَرَباً (ضَرَبْتُهُ ضَرَباً) » : le masdar est « ضَرْباً », et l'exemple est violent pour un enfant. | Faible | « قَفَزْتُ قَفْزاً ». |
| AR10 | `mutal-verbs-jazm-amr`, exemple 4 | La phrase citée écrit « لَا تَنْسِ » puis la correction « تَنْسَ ». | Faible | « لَا تَنْسَ ». |
| AR11 | `bare-augmented-participles`, règle 1 et `ex6` | Le مزيد بحرفين manque dans la règle mais est demandé dans 3 exercices. La phrase de `ex6` (« يُقَدِّمُ دَرْساً كَارِمٌ ») n'a pas de sens. | Faible | Ligne ajoutée (اِفْتَعَلَ، تَفَاعَلَ، تَفَعَّلَ، اِنْفَعَلَ) ; « الأُسْتَاذُ كَارِمٌ لِضُيُوفِهِ ». |
| AR12 | Divers | « تِصْبِحُ », « الحَالُ المَفْرَدَةُ » (titre), « مَبْتَسِماً », « مَضَافَةٌ », « المَلَوَّنَةَ » (aucun mot n'est en couleur), « يَسِرَ » (verbe rare), « بَنَاتٌ أم بَنَاةٌ » sans dire de quel mot. Une phrase de `maf3ul-types` contenait un مفعول مطلق non signalé (« جِدّاً »). | Faible | Corrigés. |

### Réponses à trou (suite de X1)

34 exercices d'arabe 5AP sur 50 attendaient un mot tapé à l'identique, souvent avec ses voyelles (« فَاهِمٌ », « اُدْعُ », « أمامَ »), ou même une phrase entière (« لأنها في آخر اسم ثلاثي ساكن الوسط »). **33 sont passés en QCM**, avec des distracteurs tirés des erreurs habituelles (« لَمْ يَسْعَى », « شَيْأً », « مُعَلِّمَاتَ »). L'exercice d'écriture libre `writing-ex6`, qui attendait le texte « إنتاج حر يوظف صفة مطابقة لموصوفها », est devenu un entraînement guidé avec un modèle de réponse. Les 16 restants attendent un seul mot simple sans voyelles (« الحديقة », « الطقس ») et seront couverts par CX-26.

### À vérifier avec l'enseignant

| # | Point |
|---|---|
| AR13 | `writing-evaluation-grid` : la grille officielle algérienne compte-t-elle 3 critères (ملاءمة، انسجام، سلامة اللغة), ou 4 avec la pertinence (الوجاهة) et la perfection (الإتقان) ? `eval1` demande « combien de critères ? », réponse « trois ». |
| AR14 | `kan-inna` : la liste des sœurs de « كان » s'arrête à « ليس » ; « ما زال » et « ما دام » sont-elles au programme de 5AP ? |
| AR15 | `maf3ul-types` : la formule clé associe « كيف ؟ » au مفعول مطلق, alors que la leçon sur le ḥâl enseigne aussi « كيف ؟ ». Risque de confusion. |

Vérification : le fichier se charge sans erreur (relu par script) ; `tsc` et les tests ne sont pas lancés.

## Décisions attendues de Karim pour le lot 3

1. **M1 — Décimaux dans la leçon des mesures (1er trimestre).** Deux possibilités :
   - **Passer la leçon au 3e trimestre**, après `math-5ap-decimals` (proposé : un seul champ à changer, aucune question à réécrire). À vérifier avec l'enseignant que le manuel ne place pas les conversions au 1er trimestre.
   - Garder le 1er trimestre et réécrire 13 questions en nombres entiers et unités composées (« 2 kg 500 g » au lieu de « 2,5 kg »).
2. **A1 et G3 — Angles en degrés et somme des angles.** Une seule question à poser à l'enseignant : en 5AP, mesure-t-on les angles au rapporteur ? Si non, les deux leçons gardent ces questions en « défi » facultatif et les quiz sont adaptés.

## Décision attendue de Karim (lots 1 et 2)

Ces leçons existent aussi dans la V1 en production. Deux possibilités :
1. **Corriger seulement sur `v2`** (proposé) : la V2 remplacera la V1 à la mise en ligne, et `main` n'est pas touché.
2. Corriger aussi la V1 : demande un changement sur `main`, donc un déploiement en production.

Avec l'accord de Karim, Claude applique lui-même ces corrections de contenu (questions, corrigés) sur `v2`, puis lance le test ciblé des examens et leçons de maths 5AP.

## Correction après la relecture de Codex (16 novembre 2026)

**G6 — Choix « carré / rectangle / losange » contradictoire avec la règle inclusive.** Signalé par Codex : dans `math-5ap-polygons-ex2`, la figure décrite est un carré, mais « مستطيل » et « معين » étaient déclarés faux, alors que la leçon enseigne (G1) que le carré est un rectangle particulier et un losange particulier. Un enfant qui applique la règle était pénalisé. **Corrigé** : la question demande « ما أدقّ اسم له؟ », les choix faux deviennent « مستطيل ليس مربعاً » et « معين ليس مربعاً », et la correction explique que le carré est aussi un rectangle et un losange. Recherche du même piège dans toutes les données : un seul autre cas, en 4AP (`math-4ap-geometry-lines-polygons`, « المربع » juste / « المعين » faux), corrigé de la même façon. Les deux corrections sont aussi sur la branche de report `fix/relecture-5ap`.
