# Audit V1 — Un enfant peut-il apprendre seul de la 1AP à la 5AP ?

Date : 12 novembre 2026. Référence : branche locale `main`, commit `cfefd3b`.

## Conclusion

Les retours sur la 4AP et la 5AP sont cohérents avec les problèmes observés dans le contenu et le parcours. La V1 contient de nombreuses ressources, mais l'accompagnement ne permet pas encore de considérer l'apprentissage autonome comme acquis.

La **4AP manque surtout de démonstrations propres à chaque notion et d'aides utiles**. La **5AP possède davantage d'exemples et d'indices progressifs, mais cumule densité, corrections parfois contradictoires et saisies trop strictes**. En 2AP–3AP, un autre problème existe : les exercices d'entraînement demandent principalement à l'enfant de réfléchir puis de comparer seul avec une correction.

Priorité : corriger les réponses et consignes incohérentes, rétablir l'aide à la lecture en 4AP–5AP, puis reconstruire le passage « je regarde → je fais avec aide → je fais seul » sur les notions les plus difficiles.

## Périmètre et limites

- Inventaire automatisé des **389 leçons** réellement exportées par `COURSES_DATA`, après enrichissement 4AP et ajout des exercices liés aux devoirs.
- Lecture ciblée du contenu des cinq niveaux, avec des exemples dans les dix matières de 4AP et de 5AP ; examen approfondi de certains cours de mathématiques et de langues.
- Analyse des composants d'explication, de contenu, d'entraînement, de quiz, de synthèse vocale et de validation.
- Cet audit ne constitue pas une relecture exhaustive de chaque réponse des 389 leçons. Les anomalies nommées sont des exemples confirmés, pas un décompte complet des erreurs.
- Pas de séance observée avec des enfants, pas de mesure réelle du temps d'apprentissage, pas de vérification visuelle sur téléphone et pas de comparaison avec une version déployée. Le diagnostic porte sur `main` local ; son identité avec la production n'est pas établie.
- La conformité au programme officiel algérien n'a pas été certifiée. Une notion dense n'est pas automatiquement une notion hors programme.
- Aucune modification des cours ou du fonctionnement de l'application dans cet audit.

L'[inventaire par leçon](2026-11-12-autonomie-inventaire.csv) permet de retrouver les éléments structurels. Une absence de champ n'est pas, à elle seule, une preuve d'absence d'explication : certains exemples existent dans d'autres champs.

## Comparaison des cinq niveaux

Les appréciations ci-dessous sont des estimations de risque issues de l'analyse, pas des résultats de tests auprès d'enfants.

| Niveau | Leçons | Diagnostic d'autonomie | Principal obstacle | Priorité |
|---|---:|---|---|---|
| 1AP | 57 | Base la plus favorable ; autonomie à observer en situation | Lecture initiale et recours à un seul indice lorsqu'il existe | Consolider |
| 2AP | 61 | Autonomie fragile malgré des supports courts | Entraînement par consultation du corrigé, sans vérification de la réponse de l'enfant | Élevée |
| 3AP | 78 | Risque de rupture entre compréhension et application | Même entraînement autoévalué ; explication générique par matière | Élevée |
| 4AP | 86 | Risque élevé de dépendance à un adulte | Peu de guidage spécifique, indices génériques, aide audio retirée des panneaux principaux | Très élevée |
| 5AP | 107 | Risque élevé, variable selon la matière et la leçon | Densité, saisie stricte, incohérences ; étayage présent mais partiel | Très élevée |

### Indicateurs structurels

| Indicateur | 1AP | 2AP | 3AP | 4AP | 5AP |
|---|---:|---:|---:|---:|---:|
| Matières | 5 | 5 | 10 | 10 | 10 |
| Volume textuel médian mesuré, en mots | 102 | 127 | 169 | 155 | 400 |
| Leçons avec un champ de découverte `discoveryAr` | 57 | 61 | 68 | 0 | 2 |
| Leçons avec exemples à paliers `progressiveWorkedExamples` | 0 | 0 | 0 | 0 | 86 |
| Exercices d'entraînement + évaluation | 173 | 132 | 155 | 516 | 1 159 |
| Dont exercices sans saisie, avec corrigé à consulter | 0 | 132 | 155 | 0 | 8 |
| Exercices avec plusieurs indices `progressiveHints` | 0 | 0 | 0 | 0 | 423 |
| Questions du quiz final | 228 | 102 | 178 | 206 | 200 |

Le volume mesuré additionne résumé, introduction détaillée, règles, vocabulaire, exemples ordinaires et exemples à paliers, solutions incluses. Il exclut notamment les exercices, leurs corrigés, les textes d'interface, les scénarios génériques et certaines autres rubriques. Ce n'est ni un nombre de mots à lire obligatoirement ni un score de lisibilité. La médiane 5AP est environ 2,6 fois celle de 4AP sur ce périmètre, mais la 4AP montre qu'un texte plus court peut rester insuffisamment explicatif.

Point positif : les **914 questions de quiz** possèdent toutes une explication sur au moins une option correcte. La présence d'une explication ne garantit cependant ni sa justesse ni son utilité pour une erreur précise.

## Constats prioritaires et preuves

### P0 — Une correction de maths peut sanctionner un raisonnement juste

Leçon `math-5ap-large-numbers`, [math.ts](../../frontend/src/data/courses/5AP/math.ts), lignes 146–153 : l'énoncé affirme que le nombre de centaines dans **456 789 est 456**, et l'option « vrai » est déclarée correcte. Or le nombre de centaines complètes est **4 567**. Le chiffre des centaines est **7**.

La règle et une carte interactive donnent bien 4 567, tandis que le corrigé de cet exercice maintient 456. L'enfant reçoit donc deux enseignements incompatibles dans la même leçon.

Deux autres erreurs locales sont confirmées dans cette leçon :

- Ligne 51 : une correction associe 4 567 au nombre de milliers ; le nombre de milliers de 456 789 est 456.
- Ligne 131 : l'indice appelle les millions la deuxième période depuis la droite, alors qu'ils viennent en troisième après les unités et les milliers.

**Correction attendue :** aligner énoncé, option correcte, indice, carte interactive et corrigé. Ajouter une vérification arithmétique ciblée qui échoue sur la réponse erronée actuelle.

### P0 — En français 5AP, la consigne et la réponse attendue ne concordent pas

Leçon `french-5ap-projet1-monde-animal`, exercice `french-5ap-animal-ex6`, dans [french.ts](../../frontend/src/data/courses/5AP/french.ts).

La consigne demande de réécrire seulement la partie fautive, « l'article et l'adjectif long ». Mais `fillBlankAnswerAr` attend exactement : `L'éléphant est grand et il a de longues défenses.`

Un enfant qui suit la consigne et fournit seulement les éléments corrigés ne peut pas être validé par le moteur actuel.

**Correction attendue :** demander explicitement la phrase entière, ou proposer deux champs séparés correspondant aux deux corrections. Le format demandé doit correspondre au format évalué.

### P1 — L'aide audio des panneaux principaux disparaît en 4AP–5AP

Dans [useLessonSpeech.tsx](../../frontend/src/components/lessonViewer/useLessonSpeech.tsx), `isYoungGrade` couvre uniquement 1AP, 2AP et 3AP. Dans [LessonViewer.tsx](../../frontend/src/components/LessonViewer.tsx), notamment lignes 656–687 et 721–722, les callbacks de lecture des explications, du contenu, de l'entraînement et du quiz dépendent de cette condition.

**Impact probable :** les élèves dont le décodage ou la compréhension écrite restent fragiles perdent cette aide au moment où les contenus deviennent plus exigeants. Ce constat concerne ces panneaux ; il ne signifie pas que toute fonction audio de l'application est absente en 4AP–5AP.

**Correction attendue :** rendre l'écoute facultative disponible sur les cinq niveaux. Tester séparément les passages arabes, français et anglais ainsi que les contenus mixtes. Le tamazight nécessite des ressources vocales adaptées ; le code évite déjà une lecture de substitution inappropriée.

### P1 — L'onglet « explication » ne démontre pas assez la notion précise

Dans [LessonExplanationView.tsx](../../frontend/src/components/LessonExplanationView.tsx), les 1AP–2AP utilisent les règles rédigées pour la leçon. Pour les autres niveaux, `getSubjectRealWorldContent()` construit des scénarios et trois étapes principalement communs à la matière.

Exemple : le scénario mathématique parle d'achats et de fournitures scolaires, avec des étapes générales de compréhension, d'application et de vérification. Cette entrée n'explique pas concrètement comment commencer une symétrie ou effectuer une division. Le titre de la leçon apparaît dans le scénario, mais sa présence ne rend pas la méthode spécifique.

**Impact probable :** un enfant peut parcourir trois étapes présentées comme explicatives sans avoir vu les gestes intellectuels nécessaires à son premier exercice. Les vrais contenus existent ailleurs, notamment dans « résumé et règles », ce qui lui demande de retrouver lui-même le bon support.

**Correction attendue :** alimenter l'explication principale avec des étapes écrites pour chaque notion, une démonstration et une question intermédiaire. Conserver les introductions générales seulement lorsqu'elles apportent un contexte utile.

### P1 — En 4AP, une partie importante des indices n'aide pas à démarrer

[4apExercisePack.ts](../../frontend/src/data/courses/4AP/4apExercisePack.ts) fournit l'indice par défaut `فكّر جيداً قبل الإجابة.` : « Réfléchis bien avant de répondre ».

Après enrichissement du catalogue, **156 exercices sur 516** possèdent cet indice, **78 n'ont pas de `hintsAr`**, et aucun n'a de chaîne `progressiveHints`. Les autres peuvent avoir un indice propre à la notion ; la 4AP n'est donc pas entièrement dépourvue d'aide.

La 4AP possède également **zéro série `progressiveWorkedExamples`**. Des exemples résolus ordinaires existent : le problème est leur insuffisant découpage pour accompagner un débutant, pas l'absence totale d'exemples.

**Correction attendue :** remplacer l'encouragement générique par une aide concrète : où regarder, quelle première action effectuer, puis un début de résolution. Les niveaux « je découvre / je m'entraîne / je maîtrise / défi » doivent correspondre à une véritable progression, pas seulement à quatre étiquettes.

### P1 — En 2AP–3AP, l'entraînement repose sur l'autoévaluation

Les **132 exercices de 2AP** et les **155 de 3AP** n'ont pas de `type`. [practiceAssessment.ts](../../frontend/src/components/lessonViewer/practiceAssessment.ts) les traite comme pratique guidée. [PracticeExerciseCard.tsx](../../frontend/src/components/PracticeExerciseCard.tsx), ligne 258 et suivantes, demande de réfléchir puis d'afficher le corrigé ; [useLessonPractice.ts](../../frontend/src/components/lessonViewer/useLessonPractice.ts) ne les considère pas comme une preuve de maîtrise.

Ce comportement évite de récompenser à tort une réponse non vérifiée. Mais un enfant qui ne comprend pas ne reçoit pas de retour sur son raisonnement personnel. Le quiz et les outils interactifs apportent d'autres occasions de répondre ; ils ne remplacent pas systématiquement cet entraînement.

**Correction attendue :** convertir en priorité les premiers exercices de chaque notion en actions vérifiables : choix, classement, association, mot ou nombre à compléter. Garder la comparaison avec un modèle pour les tâches qui s'y prêtent réellement.

### P1 — La correction des textes est trop littérale

[useLessonPractice.ts](../../frontend/src/components/lessonViewer/useLessonPractice.ts) vérifie les réponses `fill_blank` par égalité exacte après suppression des espaces aux extrémités.

Exemples : `His` est attendu dans `english-5ap-school-ex2`, et la phrase complète avec ponctuation dans `english-5ap-school-ex6`. `his`, une apostrophe typographique ou une phrase correcte sans point final peuvent être refusés selon la réponse attendue.

**Correction attendue :** définir les variantes acceptables pour chaque objectif. Tolérer la casse ou la ponctuation lorsqu'elles ne sont pas évaluées ; préserver accents, marques grammaticales et vocalisation lorsqu'ils constituent précisément l'apprentissage. Éviter une normalisation universelle qui effacerait les erreurs à enseigner.

### P2 — Les cours 5AP regroupent trop d'objectifs pour une entrée autonome

La leçon de français sur le monde animal atteint **665 mots** sur le périmètre mesuré. Elle mêle vocabulaire, groupes de la phrase, transformation au féminin et correction orthographique. Le premier cours de nombres 4AP associe lecture, écriture, décomposition, chiffre/nombre et encadrement. Le cours de sciences 4AP sur la digestion présente plusieurs organes et leurs fonctions dès une même règle.

Ces contenus peuvent être pertinents dans une séquence scolaire accompagnée. L'enfant seul doit néanmoins identifier ce qu'il doit apprendre maintenant, ce qu'il sait déjà et ce qu'il peut laisser pour plus tard.

**Correction attendue :** conserver la leçon comme regroupement de programme, avec plusieurs missions courtes accessibles séparément. Une mission vise une compétence observable et propose une action immédiatement réalisable.

### P2 — Le quiz mesure surtout la réussite après correction

[useLessonQuiz.ts](../../frontend/src/components/lessonViewer/useLessonQuiz.ts) autorise les nouvelles tentatives et verrouille les réponses justes. Terminer exige de trouver toutes les bonnes réponses. C'est utile pour apprendre et encourageant pour poursuivre.

Cependant, parvenir à 100 % après avoir vu les corrections ne prouve pas à lui seul que l'enfant peut transférer la méthode à un exercice nouveau. Les batteries finales sont parfois courtes : **200 questions pour 107 leçons en 5AP** et **178 pour 78 leçons en 3AP**.

**Correction attendue :** distinguer réussite avec aide et vérification autonome. Ajouter une question nouvelle, équivalente mais non identique, après l'entraînement. Ne pas supprimer le droit de se tromper.

## Lecture par niveau et par matière

### 1AP — Préserver le parcours déjà adapté

Points forts : 57 découvertes contextualisées, parcours `YoungLessonStory`, boutons d'écoute, 149 QCM et 24 associations dans l'entraînement, 228 questions de quiz expliquées. Le volume textuel mesuré reste limité.

À consolider : donner une démonstration visuelle du premier geste, vérifier que l'enfant repère seul l'écoute et la suite, et proposer une deuxième aide lorsqu'un indice unique ne suffit pas. La maîtrise du geste tactile et la reconnaissance des symboles restent à observer avec de vrais utilisateurs.

### 2AP — Faire répondre l'enfant avant de lui montrer le modèle

Points forts : découverte dans toutes les leçons, libellés plus courts, audio, certains textes structurés en scènes et représentations de groupes en mathématiques.

À corriger : les 132 entraînements autoévalués. En nombres et calcul, commencer par manipuler ou compléter une seule étape ; en arabe, faire sélectionner ou construire un exemple avant de présenter une règle générale ; en sciences, demander une observation simple puis une conclusion.

### 3AP — Accompagner l'élargissement à dix matières

Points forts : découverte présente dans 68 leçons sur 78, audio des panneaux, exemples et outils spécialisés.

À corriger : entraînement autoévalué et explications génériques. La première leçon de français contient notamment le vocabulaire « graphèmes », « combinatoire », « graphie et phonie » dans ses textes. Ces termes peuvent servir à l'enseignant ; l'entrée enfant doit commencer par écouter, reconnaître et assembler `m + a = ma`. Séparer la consigne compréhensible de l'explication savante.

### 4AP — Refaire le pont entre la règle et le premier exercice

| Matière | Exemple examiné | Action prioritaire |
|---|---|---|
| Mathématiques | Nombres jusqu'à 99 999 : plusieurs compétences dans une même leçon | Tableau de positions manipulable, puis un exercice par compétence |
| Arabe | Classes de mots et types de phrases ; première phrase déjà développée | Commencer par une phrase courte et colorer les éléments utiles |
| Français | Présentation/famille avec vocabulaire, être et articles | Une mini-scène orale, puis une seule transformation à réaliser |
| Anglais | Famille : `I/My`, `He/His`, `Her` | Montrer qui parle et qui possède avant le choix du pronom |
| Sciences | Digestion : chaîne d'organes dans un même paragraphe | Parcours visuel du trajet, un organe par étape |
| Histoire-géographie | Histoire personnelle et nationale, rangement chronologique | Faire déplacer des événements sur une frise avec repères |
| Éducation islamique | Deux sourates et leurs enseignements dans un regroupement | Séparer écoute, compréhension d'un passage et mise en situation |
| Éducation civique | Propriété privée/publique | Partir de deux objets concrets et expliciter la règle de décision |
| Tamazight | Alphabet et symboles, questions générales sur l'écriture | Faire reconnaître une lettre et son son avec ressources validées |
| Arts | Couleurs chaudes/froides | Faire choisir et comparer visuellement des couleurs |

Ces actions sont des propositions ciblées issues des exemples examinés ; elles ne signifient pas que tous les outils existants doivent être remplacés.

### 5AP — Exploiter l'étayage existant et réduire les obstacles

Points forts à conserver : **86 leçons avec exemples à paliers**, **423 exercices avec plusieurs indices progressifs**, des tableaux d'analyse grammaticale et des opérations posées. Il serait inexact de dire que la 5AP n'offre aucun accompagnement.

| Matière | Risque observé dans les exemples | Action prioritaire |
|---|---|---|
| Mathématiques | Contradictions chiffre/nombre ; plusieurs compétences regroupées | Corriger les erreurs, puis séparer lecture, décomposition et encadrement |
| Arabe | Analyse de phrases et vocabulaire grammatical abstrait | Partir de « qui fait quoi ? », puis introduire le terme et le tableau |
| Français | Texte dense, exercices à plusieurs objectifs, saisie incohérente | Scinder les missions et aligner exactement consigne et correction |
| Anglais | Réponses textuelles exactes et correction de phrase entière | Définir les variantes acceptables et guider la modification visée |
| Sciences | Notions comme les échanges gazeux, avant application à une situation | Schéma puis observation guidée ; expliciter le vocabulaire avant le test |
| Histoire-géographie | Repérage dans les périodes, dates et événements | Frise/cartes intégrées à l'explication de la notion |
| Éducation islamique | Compréhension et justification de plusieurs enseignements | Segmenter les passages et proposer des exemples de la vie quotidienne |
| Éducation civique | Constitution, symboles, formulations abstraites | Une situation concrète avant la définition institutionnelle |
| Tamazight | Exemple de grammaire sans batterie `progressiveExercises` | Prévoir une pratique guidée vérifiable et une aide de prononciation adaptée |
| Arts | Couleurs complémentaires | Manipulation et comparaison avant la définition |

## Plan de correction recommandé

| Ordre | Lot | Périmètre concret | Critère de réception |
|---|---|---|---|
| 1 | Réparer les blocages confirmés | Nombres 5AP, français 5AP, formats de réponse | Un enfant qui suit la consigne et donne la bonne réponse est accepté |
| 2 | Rendre l'aide accessible | Audio 4AP–5AP, consignes et navigation | Écoute disponible et bonne langue ; une prochaine action clairement identifiable |
| 3 | Piloter un nouveau guidage | Nombres/décomposition 4AP, division 5AP, grammaire arabe, français 4AP–5AP | Démonstration propre à la notion, exercice accompagné, puis exercice nouveau seul |
| 4 | Réparer l'entraînement 2AP–3AP | Premiers exercices de chaque notion | Une réponse ou une action de l'enfant est vérifiée avant l'accès au corrigé |
| 5 | Étendre progressivement | Autres matières, puis ensemble du catalogue | Relecture de fond et observation d'élèves avant généralisation |

Ne pas commencer par ajouter davantage de texte ou davantage de QCM à toutes les leçons. Le premier travail consiste à supprimer les contradictions et à rendre visible la première action utile.

### Exemple de réécriture : distinguer chiffre et nombre de centaines

Mission enfant : « Je trouve combien de paquets de 100 contient un nombre. »

1. Montrer `347 = 3 × 100 + 47` : trois paquets complets, reste 47.
2. Faire compléter `1 247 = … × 100 + 47` avec une aide visuelle : 12 paquets.
3. Comparer explicitement : dans 1 247, le chiffre des centaines est 2, le nombre de centaines est 12.
4. Demander seul le nombre de centaines de 2 368 : 23.
5. Proposer une aide graduée : entourer ce qui reste sous 100, montrer la première étape, puis expliquer la solution.
6. Vérifier ensuite avec un autre nombre, sans afficher le corrigé précédent.

Cette proposition conserve la notion et rend sa méthode observable. Les grands nombres peuvent venir ensuite dans la même progression.

## Comment vérifier réellement l'autonomie

Organiser un premier essai exploratoire avec trois à cinq enfants par niveau et des profils de lecture différents, sur le support habituel, notamment Android. Cet effectif sert à détecter les problèmes, pas à produire un taux représentatif de réussite.

Pour chaque enfant : une leçon familière, une notion moins maîtrisée et une question de transfert nouvelle. L'adulte observe sans enseigner ; toute aide nécessaire est notée.

Mesurer : compréhension de la consigne, identification de la première action, demandes d'aide adulte, utilisation des indices, reprise après erreur, réponses justes au premier essai et réussite sur une question nouvelle. Demander à l'enfant de raconter simplement comment il a trouvé.

Critères proposés pour le pilote, à ajuster après observation :

- L'enfant sait dire ou montrer ce qu'il doit faire sans reformulation adulte.
- Après une erreur, il trouve une aide utile et sait quoi essayer ensuite.
- Une bonne réponse conforme à la consigne n'est jamais rejetée pour un détail non évalué.
- Il résout une tâche nouvelle équivalente sans recopier le modèle.
- Les demandes d'intervention adulte diminuent par rapport au parcours actuel.

Ne pas assimiler « termine en cliquant » et « comprend et peut refaire seul ».

## Vérifications et références

L'inventaire a été exécuté en important les exports TypeScript réels ; aucun contenu `premiumContentPending` n'apparaît dans les 389 leçons inventoriées. Les tests structurels existants contrôlent notamment la présence des règles, exemples et tableaux. Leur réussite ne certifie pas la justesse de chaque correction ni l'autonomie des enfants.

Vérification exécutée : **5 fichiers de tests, 110 tests réussis** (`coursesData`, programme 4AP, dispositions 5AP, entraînement et quiz). Le premier lancement a été bloqué avant l'exécution par une permission sur le cache temporaire ; la relance autorisée a réussi. Aucun test n'a été ajouté et aucun correctif applicatif n'a été appliqué.

Les recommandations de démonstration, pratique accompagnée puis pratique indépendante sont cohérentes avec les [approches universelles de l'EEF](https://educationendowmentfoundation.org.uk/education-evidence/inclusive-teaching/universal-approaches/). Les recommandations sur les consignes et étapes explicites s'appuient aussi sur les [instructions pas à pas du W3C](https://www.w3.org/WAI/WCAG2/supplemental/patterns/o4p07-step-instructions/). Ces références orientent la conception ; elles ne valident pas spécifiquement le produit ni le programme algérien.

### Relecture de l'audit

Application du guide `agent-self-evaluation` : exactitude 4/5 (preuves locales, sans validation de la production) ; couverture 4/5 (inventaire complet, relecture pédagogique ciblée) ; clarté 4/5 (rapport détaillé nécessitant une synthèse) ; caractère opérationnel 4/5 (lots et critères définis, sans essai enfant réalisé) ; concision 4/5 (détail conservé pour rendre les corrections vérifiables). Moyenne : 4/5. L'amélioration la plus utile est maintenant l'observation du pilote avec des enfants et une relecture pédagogique des réponses 4AP–5AP. Cette autoévaluation décrit les limites du rapport, pas la qualité scolaire du produit.
