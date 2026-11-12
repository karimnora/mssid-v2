# Roadmap — V1 gratuite, design V2 et autonomie des enfants

Date : 12 novembre 2026.

## Objectif

**Priorité de travail actualisée : première minute, boucle d'exercice, retour le lendemain.** La [séquence ciblée](PRIORITES-V1-PREMIERE-MINUTE-EXERCICE-RETOUR.md) reprend la recommandation transmise par Karim : réutiliser les briques existantes et viser dix notions difficiles, avec quatre mesures bien définies. Les fonctions décrites comme à faire ne sont pas annoncées comme livrées.

Les [correctifs du lecteur enfant](audits/2026-11-12-correctifs-ecran-enfant.md) retirent le statut de vérification, harmonisent les milliers en espace fine insécable, replient les objectifs et compactent les étapes mobiles. Après validation des deux cours de référence par Karim, le [réessai guidé est étendu à l'entraînement](audits/2026-11-12-reessai-guide-entrainement.md), avec une exception lorsqu'aucun indice exploitable n'est disponible.

Améliorer l'attractivité de MSSID et faciliter le démarrage, la compréhension et la reprise des activités. Réutiliser les éléments pertinents du design V2 dans la V1 gratuite, avec une adaptation aux enfants de 1AP à 5AP et aux téléphones Android.

**Instruction prioritaire de Karim : aucune vente ni présentation commerciale dans la V1.** Aucun prix, abonnement, bouton d'achat, invitation Premium, formulaire de paiement ou de reçu, ni message « bientôt payant » ne doit être ajouté au parcours V1. Les démarches administratives sont en cours. La monétisation est différée ; elle nécessitera une décision explicite ultérieure, distincte du feu vert pour les améliorations gratuites.

**Priorité centrale : vulgariser les concepts et construire une autonomie progressive de la 1AP à la 5AP.** Chaque notion doit partir d'une situation accessible, être expliquée avec des mots simples et une démonstration, puis donner lieu à une pratique accompagnée et à une vérification autonome. Le design doit rendre ce parcours évident.

Simplifier au maximum la formulation et les étapes sans altérer la justesse ni supprimer les termes scolaires à apprendre. L'autonomie sera observée auprès d'enfants ; elle ne peut pas être garantie pour tous les élèves par une simple réécriture.

Référence de conception : [charte pédagogique et todo détaillée](CHARTE-PEDAGOGIQUE-AUTONOMIE-1AP-5AP.md).

Le [document de réflexion commerciale](OFFRE-V1-GRATUITE-PREMIUM-FAMILLE.md) reste interne et différé. Ses prix, brouillons de vente et tâches commerciales sont exclus de la mise en œuvre V1 actuelle. Le pilote 4AP–5AP sert d'abord à tester gratuitement la pédagogie.

Karim autorise également la sélection de quelques fonctions à forte valeur pour la future version payante, avec un périmètre réduit et des tests. La [sélection initiale](V2-AJOUTS-CIBLES-VALEUR-PARENT.md) retient le bilan parent et le plan de révision, puis le cahier ciblé après validation. Ces briques existent déjà en V2 et doivent être consolidées ; cet accord ne lève aucune restriction commerciale ou de publication concernant la V1.

Direction choisie : **ludique et soignée, avec Didou et des interactions légères**.

La refonte locale couvre maintenant aussi le [parcours matière → liste des cours → leçon](audits/2026-11-12-design-parcours-cours.md) : trimestres, raccourci de démarrage, cartes, navigation et étapes de leçon. Les écrans de quiz et de résultats ne sont pas entièrement refondus dans ce lot.

Avancement complémentaire du 12 novembre : [bilan parent et calendrier V2 consolidés](audits/2026-11-12-v2-bilan-revisions-validation.md), avec 57 tests ciblés et six scénarios navigateur. Les illustrations V2 sélectionnées sont aussi reprises localement dans l'accueil V1 et les deux parcours pilotes : ciel étoilé, Didou qui salue et Didou qui montre. Les retours de Karim et les essais sur Android réel restent nécessaires.

**Règle de livraison : aucun push ni déploiement avant les tests de Karim et son feu vert explicite.** Une validation visuelle ne vaut pas automatiquement autorisation de publication.

## État de départ

- Branche de travail actuelle : `main`, modifications locales non publiées.
- La branche locale `v2` existe. Une première comparaison des droits, tarifs et services est documentée dans l'offre ; la comparaison détaillée des interfaces et de leurs dépendances reste à faire.
- Une première proposition de design est implémentée localement sur l'accueil et les cartes partagées des matières. Elle n'est pas présentée comme une reprise déjà vérifiée du design V2.
- Cette proposition couvre la palette, l'action principale, le placement des matières et de Didou, les titres et les interactions légères.
- Contrôles de cette proposition : 13 tests existants réussis, TypeScript validé, six configurations visuelles contrôlées. Tests personnels de Karim encore attendus.
- L'audit pédagogique porte sur un inventaire de 389 leçons, avec analyse approfondie d'exemples. Il identifie notamment des erreurs de correction et des obstacles au guidage en 4AP–5AP.
- Une première tranche pédagogique est maintenant implémentée localement : corrections confirmées en 5AP, comparaison de saisie explicite pour trois exercices de langues, écoute facultative en 4AP–5AP et deux missions guidées en mathématiques. Voir le [compte rendu et les accès de test](audits/2026-11-12-pilotes-autonomie-validation.md).
- Les chiffres d'audience et les captures publicitaires ne permettent pas encore de relier précisément campagne, inscription, apprentissage et retour.

Documents : [audit pédagogique](audits/2026-11-12-autonomie-1ap-5ap.md) et [aperçus du design local](../output/design-preview/README.md).

## Ordre des lots

| Lot | Résultat attendu | Priorité | Dépendance | Validation |
|---|---|---|---|---|
| 0 | Retours sur la proposition locale | Immédiate | Proposition disponible | Karim teste et note ses retours |
| Monétisation future | Réflexion interne uniquement | Différée, hors livraison V1 | Démarches terminées et nouvelle décision explicite | Aucun affichage commercial V1 |
| 1 | Sélection des éléments V2 à porter | Haute | Comparaison V1/V2 | Direction et périmètre visuels validés |
| 2 | Parcours d'entrée clair et cohérent | Haute | Lot 1 | Accueil → matière → cours utilisable sur mobile |
| 3 | Corrections pédagogiques bloquantes | Critique | Peut avancer indépendamment du lot 1 | Réponses et consignes cohérentes |
| 4 | Concepts vulgarisés et apprentissage autonome, 1AP–5AP | Centrale | Corrections du lot 3 ; préparation du contenu indépendante du design | Compréhension, reprise après erreur et transfert observés |
| 5 | Gratuité visible et mesure de l'usage | Haute | Mesure minimale possible dès le départ | Aucun écran commercial ; abandons identifiables |
| 6 | Recette complète et publication autorisée | Avant livraison | Lots retenus terminés | Tests Karim, puis feu vert explicite |
| 7 | Observation après publication | Après livraison | Publication autorisée | Décisions fondées sur les usages réels |

Le numéro des lots organise la lecture. Les corrections critiques du lot 3 ne doivent pas attendre la fin de la refonte visuelle.

La réécriture pédagogique et la comparaison du design V2 peuvent être préparées en parallèle. Le premier pilote de pédagogie n'attend pas la refonte complète de l'interface.

## Lot 0 — Tester la proposition déjà disponible

- [x] Préparer une proposition locale sur l'accueil et les cartes des matières.
- [x] Fournir des captures français, arabe, clair, sombre, mobile et grand écran.
- [ ] Faire tester l'accueil à Karim sur son téléphone habituel.
- [ ] Recueillir les retours : couleurs, densité, taille des textes, place de Didou, facilité à commencer.
- [ ] Identifier les éléments à conserver, ajuster ou retirer.

Livrable : une liste courte de retours validés. Ce lot ne déclenche aucun push.

## Lot 1 — Comparer le design V2 et préparer son adaptation

- [ ] Sélectionner uniquement les éléments de design et de pédagogie compatibles avec la V1 gratuite.
- [ ] Exclure du portage les offres, prix, boutons Premium, achats, quotas commerciaux et formulaires de paiement V2.
- [ ] Conserver la réflexion sur les tarifs dans la documentation interne, sans intégration ni affichage V1.
- [ ] Comparer les écrans équivalents : accueil, matières, liste des cours, leçon, navigation et inscription.
- [ ] Classer chaque élément V2 : réutilisable, à adapter à la V1, ou à laisser en V2.
- [ ] Vérifier les dépendances : routes, composants, données, ressources et fonctionnalités premium.
- [ ] Éviter d'importer une fonctionnalité V2 uniquement pour récupérer son apparence.
- [ ] Fixer les règles communes : palette, typographie, espacements, cartes, boutons et états interactifs.
- [ ] Préparer les aperçus de référence en français et en arabe.
- [ ] Faire valider cette direction par Karim avant de l'étendre à tous les écrans.

Livrable : tableau de correspondance V1/V2 et écrans de référence. Réception : chaque élément porté a une utilité et un périmètre identifiés.

## Lot 2 — Refaire le parcours d'entrée

- [ ] Ajuster l'accueil selon les retours du lot 0 et la comparaison V2.
- [ ] Rendre l'action principale évidente pour un nouvel utilisateur.
- [ ] Mettre en valeur la reprise de la dernière activité pour un utilisateur qui revient.
- [ ] Harmoniser les cartes de matières et les indicateurs de progression.
- [ ] Harmoniser la liste des leçons : titre, trimestre, état commencé/terminé et accès.
- [ ] Vérifier que les titres longs restent lisibles, notamment en 4AP–5AP.
- [ ] Harmoniser les retours, le changement de niveau et la navigation mobile.
- [ ] Prévoir les états de chargement, d'erreur et de liste vide avec une action utile.

Réception : le parcours accueil → matière → cours fonctionne sans hésitation majeure, débordement ou bouton sans effet sur les écrans testés.

## Lot 3 — Réparer les blocages pédagogiques confirmés

- [x] Corriger l'exercice de centaines dans `math-5ap-large-numbers` : 456 789 contient 4 567 centaines complètes.
- [x] Corriger l'association erronée entre nombre de milliers et nombre de centaines dans la même leçon.
- [x] Corriger l'indice sur la position de la période des millions.
- [x] Aligner la consigne et la réponse attendue dans `french-5ap-animal-ex6`.
- [x] Définir des tolérances explicites pour trois exercices de français/anglais sans effacer les distinctions grammaticales.
- [ ] Étendre cette revue aux autres saisies du catalogue selon l'objectif évalué.
- [ ] Vérifier les énoncés, indices, choix et corrigés ensemble sur les cours pilotes.
- [x] Ajouter des tests ciblés sur les erreurs confirmées.

Réception : une bonne réponse conforme à la consigne est acceptée ; le cours et son corrigé enseignent la même chose.

## Lot 4 — Améliorer le design et le guidage des leçons

### Socle commun de vulgarisation, 1AP–5AP

- [ ] Définir les prérequis de chaque notion et proposer un rappel concret lorsqu'ils manquent.
- [ ] Découper chaque leçon dense en missions avec un objectif principal explicite.
- [ ] Réécrire les consignes du point de vue de l'enfant : une action précise, un format de réponse clair.
- [ ] Introduire les termes abstraits après un exemple accessible et conserver leur définition scolaire exacte.
- [ ] Montrer la méthode pas à pas, y compris les décisions que l'adulte fait habituellement de tête.
- [ ] Utiliser des illustrations et manipulations qui expliquent réellement le concept.
- [ ] Prévoir une démonstration, un exercice partiellement complété et un exercice nouveau à faire seul.
- [ ] Adapter le guidage au niveau et à la matière avec la charte pédagogique.
- [ ] Vérifier la cohérence entre mots simples, termes scolaires, exemples, indices et corrigés.
- [ ] Organiser une relecture pédagogique du fond avant de généraliser les leçons réécrites.

### Pilote 4AP–5AP

- [x] Implémenter les deux premières missions pilotes : valeur du chiffre en nombres 4AP et sens de la division avec reste en 5AP.
- [ ] Préparer les prochains pilotes de grammaire arabe et de français après revue des premiers exemples.
- [ ] Afficher un objectif enfant court et observable pour chaque mission.
- [ ] Découper les regroupements de notions en missions accessibles séparément.
- [ ] Remplacer les explications génériques par une démonstration propre à la notion.
- [ ] Structurer le parcours : je regarde → je fais avec aide → je fais seul.
- [ ] Prévoir plusieurs aides concrètes avant le corrigé complet.
- [x] Étendre l'écoute facultative des panneaux de cours aux 4AP–5AP et vérifier le choix de langue par tests.
- [ ] Vérifier les voix et la prononciation sur le téléphone Android réel, notamment les passages mixtes.
- [ ] Ajouter une question nouvelle pour vérifier le transfert après l'entraînement.
- [ ] Améliorer les retours après erreur : explication courte et prochaine action explicite.

### Extension aux autres niveaux

- [ ] En 2AP–3AP, convertir les premiers exercices autoévalués en réponses ou actions vérifiables lorsque cela convient.
- [ ] En 1AP, préserver les consignes courtes, l'audio et les actions simples.
- [ ] Observer le pilote avec quelques familles de profils différents avant généralisation.
- [ ] Étendre les changements aux autres cours par petits lots relus.

Réception : l'enfant comprend quoi faire, utilise une aide utile après une erreur et peut résoudre une tâche équivalente sans recopier le modèle. Cette vérification nécessite une observation réelle, pas seulement des tests automatisés.

## Lot 5 — Maintenir la V1 gratuite et mesurer les abandons

- [x] Documenter en interne les différences commerciales V1/V2 ; leur mise en œuvre est différée.
- [ ] Vérifier que les paiements et le verrou trimestriel restent désactivés dans l'environnement V1 concerné.
- [ ] Vérifier l'absence de prix, offres Premium, boutons d'achat, formulaires de paiement et dépôt de reçu dans les parcours V1.
- [ ] Vérifier qu'un import de design V2 ne réintroduit aucun de ces éléments, y compris dans l'espace parent.
- [ ] Tester gratuitement le pilote pédagogique de révisions 4AP–5AP.
- [ ] Expliquer l'intérêt d'un compte gratuit pour sauvegarder sa progression.
- [ ] Recenser le suivi existant avant d'ajouter des événements.
- [ ] Mesurer le parcours : visite → inscription → cours ouvert → premier exercice réussi → cours terminé → retour.
- [ ] Distinguer les niveaux, les matières, les supports et les sources publicitaires.
- [ ] Distinguer une réponse réussie avec aide d'une réussite autonome lorsque la mesure le permet.
- [ ] Définir précisément les périodes et cohortes de rétention avant d'interpréter les pourcentages.

Réception : aucune sollicitation commerciale n'apparaît en V1, les accès gratuits sont préservés et les principaux points d'abandon sont identifiables. Les objectifs chiffrés seront fixés après une mesure de départ fiable.

## Lot 6 — Recette et feu vert

- [ ] Passer TypeScript et les tests pertinents pour les changements retenus.
- [ ] Vérifier Android réel, mobile étroit, tablette et ordinateur.
- [ ] Vérifier arabe RTL, français LTR, clair et sombre.
- [ ] Vérifier les boutons au toucher, le clavier, le focus et la réduction des animations.
- [ ] Vérifier les textes longs, le zoom et les retours après erreur.
- [ ] Mesurer le chargement et la réactivité sur les écrans clés ; comparer avant/après dans les mêmes conditions.
- [ ] Tester les parcours invité et compte gratuit avec des comptes de test, et vérifier l'absence d'écran commercial.
- [ ] Fournir à Karim une version locale ou un paquet de test convenu, et une liste des changements.
- [ ] Recueillir ses retours et corriger les anomalies bloquantes.
- [ ] Obtenir son **feu vert explicite pour le push**.
- [ ] Identifier si le push déclenche automatiquement un déploiement ; inclure cet effet dans l'autorisation demandée.
- [ ] Obtenir une autorisation de déploiement si elle n'est pas déjà couverte par ce feu vert.
- [ ] Préparer la procédure de retour à la version précédente avant publication.

Réception : aucun blocage connu sur les parcours retenus et autorisation explicite de Karim avant toute publication.

## Lot 7 — Observer et ajuster

- [ ] Vérifier le bon fonctionnement après la publication autorisée.
- [ ] Examiner les premières activités terminées et les abandons par niveau.
- [ ] Recueillir les retours des familles, particulièrement sur l'autonomie 4AP–5AP.
- [ ] Comparer les usages à la mesure de départ sur des périodes cohérentes.
- [ ] Décider ensuite de l'extension du design, des contenus et des campagnes publicitaires.

## Prochaine séquence de travail proposée

1. Karim teste les aperçus actuels et donne ses retours.
2. Comparer V1/V2 pour sélectionner les éléments visuels et pédagogiques à reprendre sans affichage commercial.
3. Réparer les erreurs pédagogiques confirmées.
4. Finaliser le parcours accueil → matière → cours.
5. Préparer un cours pilote 4AP et un cours pilote 5AP avec vulgarisation et guidage ; préparer également un échantillon 1AP–3AP avant extension à ces niveaux.
6. Tester compréhension, reprise après erreur et résolution autonome avec des enfants, ajuster, puis étendre par lots relus.
7. Effectuer la recette et attendre le feu vert explicite avant push ou déploiement.

Les cases correspondent à des tâches à accomplir, pas à une autorisation de les publier. Aucun calendrier ferme n'est fixé avant la comparaison V1/V2 et les retours sur le pilote.
