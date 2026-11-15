# Pédagogie MSSID V1 — préscolaire à 5AP

Audit local du 13 novembre 2026, révision produit `2650e11`. Périmètre demandé : logique, justesse, caractère ludique et autonomie, avec les examens et défis. Le rapport distingue les défauts reproduits, les formulations à améliorer et les validations humaines encore nécessaires. Aucun changement de contenu ni génération audio dans cet audit.

## Conclusion

La structure d'ensemble est cohérente et les nouveaux parcours guidés constituent un progrès concret. Le préscolaire offre la plus grande variété de manipulations. La V1 ne peut toutefois pas être présentée comme entièrement correcte, uniformément ludique et utilisable seul par tout enfant : des quiz deviennent ambigus, certaines lectures sont mal routées, et des formulations scientifiques ou mathématiques restent à corriger.

Priorité : corriger les obstacles existants à la compréhension et à l'autocorrection, puis observer des enfants sur des notions difficiles. Le nombre de cours, d'animations ou de tests techniques ne prouve pas à lui seul un apprentissage réussi.

## Méthode et portée réelle

- Inventaire structurel des **389 cours**, des **23 modules / 200 activités préscolaires**, des **369 sujets** et des **90 défis rédigés**, plus les défis quotidiens issus des cours.
- Vérification des options, parcours, références et expressions numériques reconnaissables ; lecture ciblée de contenus à risque : vocalisation, numération, proportionnalité, masse, respiration, consignes et corrections.
- **1 177 tests existants réussis** : 116 sur examens/défis, 1 061 sur données préscolaires, missions, corrigés et outils par niveau. Ces tests vérifient surtout structure et invariants ; ils ne constituent pas une relecture sémantique indépendante de chaque réponse.
- **Cinq scénarios navigateur existants réussis** : terminer un défi, ouvrir/terminer un examen, corrigés mathématiques à 320, 390 et 1280 px, dont impression.
- **Sept reproductions unitaires diagnostiques** : quatre quiz ambigus, un jeu avec deux items vides, voix arabe sur texte français et pièces au rejeu. **Un diagnostic navigateur supplémentaire** confirme des boutons imbriqués dans un défi 1AP. Ces observations constatent des comportements existants, elles ne prouvent pas leur correction.
- Outil d'inventaire vérifié avec TypeScript. Rapport régénérable avec `node frontend/node_modules/tsx/dist/cli.mjs frontend/scripts/audit-pedagogy.ts` depuis la racine ; aucun service payant.

La relecture complète, ligne par ligne, des 389 cours et des 369 sujets, l'écoute de toutes les prononciations, la comparaison avec chaque édition du programme officiel et l'observation d'enfants n'ont pas été réalisées. Aucun taux de « justesse pédagogique » n'est donc annoncé.

## État par niveau

| Niveau | Inventaire | Appréciation fondée sur les éléments contrôlés | Priorité |
|---|---|---|---|
| Préscolaire | 200 activités, 15 types d'interactions | Base concrète et variée : toucher, trier, compter, tracer, mémoriser, colorier, raconter | Distinguer le rythme et les prérequis des plus petits et des enfants proches de l'entrée au primaire ; garder une place à l'adulte pour le langage et les récits |
| 1AP | 57 cours, 57 jeux déclarés | Format visuel, écoutes et vocabulaire concret favorables ; les jeux de l'onglet pratique restent principalement des choix de réponses | Rendre les choix de tanwīn visibles avec la vocalisation désactivée ; préserver les sons exacts dans les défis |
| 2AP | 61 cours, 61 jeux déclarés | Progression par thèmes et numération exploitable ; pas de nouveau parcours `learningPath`, mais des supports visuels/exemples existent | Lever les ambiguïtés de pronoms/tanwīn et rendre le corrigé d'examen consultable à l'écran |
| 3AP | 56 cours sur 78 avec nouveau parcours guidé | Le modèle observation → exemple → guidage → autonomie est pertinent ; quelques anciens textes scientifiques restent imprécis | Corriger la confusion masse/poids et la langue des écoutes d'examens ; alléger certains paragraphes |
| 4AP | 53 sur 86 avec nouveau parcours, dont tous les 12 cours de maths et 12 de sciences | Les notions difficiles ont un meilleur étayage, mais les autres matières et certains textes de synthèse sont moins guidés | Clarifier les quantités/unités en proportionnalité et proposer des activités concrètes sur les passages encore abstraits |
| 5AP | 61 sur 107 avec nouveau parcours, dont 15/16 maths, 15/17 arabe et toutes les sciences/FR/EN | Base enrichie, avec de vrais exemples résolus ; le volume proposé et les exigences de lecture restent importants | Doser l'entraînement, expliciter les prérequis et renforcer les applications concrètes hors des parcours déjà retravaillés |

Les 1AP–2AP utilisent une présentation spécifique : l'absence du champ `learningPath` n'implique pas une absence de pédagogie. Les **170 parcours** comptés sont ceux du nouveau moteur 3AP–5AP. Six cours possèdent une seconde mission enchaînée, quatre en 4AP et deux en 5AP. Les **101 autres cours de 3AP–5AP** ne sont pas tous défectueux et ne nécessitent pas tous le même modèle ; leur accompagnement doit être évalué par notion.

## Défauts à corriger en priorité

### PED-01 — Des quiz et un jeu d'arabe deviennent impossibles à distinguer

La vocalisation est désactivée par défaut dans le profil. [LessonQuizPanel.tsx](../../../frontend/src/components/lessonViewer/LessonQuizPanel.tsx#L291) applique le retrait des marques aux options sans préserver celles qui différencient deux réponses.

Cas reproduits dans le composant réel :

- `arabic-1ap-t3-tanween`, quatrième question : deux choix deviennent vides.
- `arabic-2ap-t2-personal-pronouns`, quatrième question : `أَنْتَ` et `أَنْتِ` deviennent tous deux `أنت`.
- `arabic-2ap-t2-tanween-three-types`, première question : deux lectures différenciées par les voyelles deviennent identiques.
- `arabic-3ap-t1-conjugation-past-present`, troisième question : deux terminaisons de conjugaison perdent leur distinction.

Le jeu du même cours 1AP sur le tanwīn présente aussi deux items dont les trois choix deviennent vides : six boutons sans contenu distinctif. Ce comportement est reproduit dans `LessonPracticePanel`.

Conséquence : le choix correct dépend d'une information retirée à l'enfant. Priorité haute, même si un son est parfois disponible.

Correction proposée : reprendre la protection déjà présente dans [PracticeExerciseCard.tsx](../../../frontend/src/components/PracticeExerciseCard.tsx#L82), qui conserve les marques lorsqu'elles distinguent les options. Les 31 collisions candidates de l'inventaire ne sont donc **pas 31 défauts** : 25 concernent des exercices dont le rendu possède déjà cette protection ; quatre concernent des questions de quiz et deux des items de jeu non protégés.

### PED-02 — L'aide audio n'est pas encore cohérente dans examens/défis

Les défis retirent les voyelles avant lecture : 27 correspondances enregistrées utilisables disparaissent sur le périmètre contrôlé. Le français d'un examen 3AP est envoyé à `ar-SA`. Les contrôles d'écoute des jeunes défis peuvent être imbriqués dans les boutons-réponses, confirmé par Axe sur mobile.

Voir les preuves et correctifs ciblés dans [l'audit examens/défis](examens-defis.md). Réutiliser le texte original, la détection d'enregistrements et la sélection de langue déjà présentes ailleurs dans l'application permet de corriger une partie de ces problèmes sans produire de nouveaux sons.

### PED-03 — Une formulation enseigne une confusion masse/poids

Dans [3AP/math.ts](../../../frontend/src/data/courses/3AP/math.ts#L936), une explication affirme que poids et masse se mesurent tous deux en kilogrammes et grammes. En physique, la masse se mesure en kilogrammes et le poids est une force. [Référence NIST](https://www.nist.gov/pml/owm/si-units-mass).

Pour cet âge, une correction courte suffit : « نقيس كتلة الكيس بالكيلوغرام. » Il n'est pas nécessaire de transformer cet exercice en cours avancé sur les forces. Distinguer l'emploi familier de « poids » d'une définition scientifique formelle.

### PED-04 — Proportionnalité : les quantités disparaissent derrière des égalités

Le bilan de [4AP/mathLessonsRest.ts](../../../frontend/src/data/courses/4AP/mathLessonsRest.ts#L435) écrit en substance : « si 2 = 100, alors 1 = 50 et 5 = 250 ». Le calcul de correspondance est compréhensible pour un adulte, mais ces égalités sans quantités ni unités risquent d'enseigner un mauvais sens du signe égal.

Proposition : « Deux cahiers coûtent 100 DA. Un cahier coûte 50 DA. Cinq cahiers coûtent 250 DA. » Représenter les cahiers et associer quantité/prix avant la règle abstraite.

### PED-05 — Respiration : remplacer « air pollué par tes poumons »

Dans [3AP/science.ts](../../../frontend/src/data/courses/3AP/science.ts#L42), les anciens textes décrivent l'air expiré comme un air « mauvais/pollué par les poumons ». Le nouveau parcours guidé est plus clair sur l'entrée/sortie de l'air et l'effort ; il faut harmoniser les anciens onglets avec lui.

Recommandation de rédaction à relire par un enseignant : décrire d'abord l'air qui entre à l'inspiration et sort à l'expiration, puis expliquer progressivement les échanges gazeux. Éviter une opposition « air bon / air sale » qui prendrait la place de l'explication.

## Ce qui reste à améliorer pour être plus ludique et autonome

### Le préscolaire dispose de vrais gestes de jeu

Répartition observée : 81 activités de choix, 19 de tracé, 16 de tri, 14 de parcours simple, 11 de mémoire, 11 d'association, neuf de suites, huit de déplacement/comptage, huit de coloriage, sept d'écoute de récitation, cinq de cartes à écouter, quatre de labyrinthe, trois de récit ordonné, deux créatives et deux puzzles.

Les traductions et associations mot/image ciblées passent les tests. Le tracé distingue une tentative d'un tracé suffisamment couvert ; il ne faut pas assimiler ces validations techniques à une certification de l'écriture ou de la prononciation. Les récits et échanges avec un adulte sont cohérents avec le rôle du jeu dans le développement du langage : [UNICEF, apprentissage par le jeu](https://www.unicef.org/sites/default/files/2018-12/UNICEF-Lego-Foundation-Learning-through-Play.pdf).

### Les jeux déclarés des cours restent souvent des questionnaires

[LessonPracticePanel.tsx](../../../frontend/src/components/lessonViewer/LessonPracticePanel.tsx#L99) rend les items de `educationalGame` comme des choix de réponses, quel que soit le type déclaré. Une activité intitulée mémoire, association ou tri n'est donc pas automatiquement un vrai jeu de mémoire, d'association ou de déplacement. L'arène réutilise également une présentation de questionnaire pour ses différents formats.

Il existe bien de vrais outils interactifs et simulations dans d'autres composants. Les nombres de jeux déclarés ou d'outils attachés à un cours ne prouvent pas que chaque notion bénéficie d'une manipulation pertinente. Priorité : réutiliser les manipulations déjà disponibles pour les fractions, numérations, mesures, classement et construction de phrases, avec un but compréhensible et un retour explicatif.

### La quantité d'entraînement n'est pas un parcours de séance

Les parcours guidés limitent la charge initiale à une progression explicite. Dans l'onglet pratique, les exercices de chaque palier sont ensuite affichés en liste. Certains cours proposent jusqu'à 21 exercices en comptant pratique et évaluation ; cela ne signifie pas qu'ils sont tous imposés dans la mission.

Proposition : rendre plus visible le petit ensemble à faire maintenant, puis les exercices de consolidation optionnels. Vérifier les prérequis et alterner exemples entièrement résolus, exercices partiellement guidés et essais autonomes, comme le décrit l'[EEF sur l'étayage des exemples résolus](https://educationendowmentfoundation.org.uk/news/supporting-pupils-with-worked-examples).

### La correction doit aider l'enfant à comprendre son erreur

Les missions et le réessai guidé sont de bons points : indices gradués, comparaison de procédures, nouvelle situation. Les anciens textes, les jeux et les sujets d'examen doivent atteindre le même niveau de clarté. Une réponse verte ou l'affichage du corrigé sans explication accessible ne suffit pas à vérifier que l'enfant a compris.

## Mathématiques : ne pas confondre alertes automatiques et erreurs

Le script a évalué 1 139 fragments d'égalité et levé 36 candidates. La relecture contextuelle montre des unités, pourcentages, durées, décompositions ou restes que l'extraction avait omis. Aucune erreur de calcul non ambiguë n'est confirmée sur ces candidates ; la notation de proportionnalité ci-dessus reste à clarifier. Voir [revue des équations](revue-equations.json).

Le script exclut les nombres à virgule de groupement ambiguë plutôt que de supposer leur valeur. Il repère 207 champs concernés dans examens/défis, à harmoniser avec les espaces déjà présents dans les cours compilés. Aucun de ces résultats ne valide toutes les réponses rédigées ou toutes les unités.

## Lots proposés

1. **Compréhension immédiate** : quatre questions de quiz et deux items de jeu d'arabe, langues d'écoute et voyelles, boutons d'écoute accessibles.
2. **Justesse et formulation** : masse/poids, proportionnalité, respiration, séparateurs numériques d'examens/défis.
3. **Autocorrection** : corrigés 2AP–3AP accessibles sur écran et feedback des activités anciennes.
4. **Jeu et autonomie** : cibler les notions encore trop textuelles ; renforcer le geste utile et l'explication plutôt que multiplier les questionnaires.
5. **Validation terrain** : observer des enfants avec et sans aide, puis relire les notions sensibles avec un enseignant ; l'audit n'a mesuré ni plaisir réel, ni mémorisation, ni transfert différé.

Les pièces au rejeu et les libellés de défis sont des règles produit à préciser : voir le rapport dédié. Les sources et audios déjà présents restent conservés.

## Preuves et autoévaluation

[Inventaire complet](inventaire.json), [reproductions](reproductions.json), [diagnostic d'accessibilité](defis-accessibilite.json), [examens/défis](examens-defis.md).

| Axe | Note | Preuve et limite |
|---|---:|---|
| Exactitude | 4/5 | Défauts d'affichage et de routage reproduits ; tous les contenus et sons ne sont pas relus |
| Complétude | 3/5 | Catalogue inventorié ; audit sémantique exhaustif et tests avec enfants absents |
| Clarté | 4/5 | Défauts, choix produit et limites séparés ; certains sujets exigent une expertise enseignante |
| Action possible | 4/5 | Sources et lots de correction identifiés ; correctifs non appliqués dans cette analyse |
| Concision | 4/5 | Bilan par niveau et priorités ; preuves détaillées conservées pour la revue |

Aucun push ni déploiement. L'état décrit précède les corrections recommandées.
