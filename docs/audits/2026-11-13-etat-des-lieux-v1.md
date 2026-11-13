# État des lieux des améliorations de MSSID V1

État local au 13 novembre 2026, branche `main`. Aucun push ni déploiement. La V1 reste gratuite, sans nouvelle offre commerciale affichée. Karim a validé les deux cours de référence ; la recette globale et le feu vert de publication restent à obtenir.

Complément du même jour : [nouvel accueil illustré](2026-11-13-accueil-illustre.md), avec village V2, action principale mieux visible, matières remontées avant le compagnon sur téléphone et état de chargement du catalogue. Vérifications : 35 tests ciblés, huit parcours navigateur et TypeScript ; recette téléphone de Karim attendue.

Complément audio : [lecteur arabe fiabilisé](2026-11-13-fiabilisation-lecture-arabe.md), texte vocalisé indépendant de l'affichage et réutilisation des phrases enregistrées. L'[audit des 118 cours de 1AP–2AP](../audio-v1/cours-1ap-2ap/README.md) révèle une couverture enregistrée très partielle : neuf cours avec au moins un passage couvert, sans garantie de couverture complète de ces cours. Un premier lot de 24 textes et les manquants sont préparés ; leur génération et validation à l'écoute restent à faire. Commit lecteur : `c5a6615`, sans push.

Suite audio du même jour : [24 MP3 produits avec cedar, la voix de Didou V2](../audio-v1/cours-1ap-2ap/OPENAI-DIDOU-LOT-01.md), et raccordés aux titres. Les anciens sons V1/V2 sont préservés. La couverture passe à 34 cours ayant au moins un passage enregistré ; le contenu intégral et la validation de prononciation restent à compléter.

## Ce qui est en place

| Domaine | Amélioration disponible | Limite actuelle |
|---|---|---|
| Présentation | Accueil et catalogue illustrés, parcours matière → trimestre → cours, cours suggéré, présentation des leçons harmonisée | Quiz et résultats gardent encore des éléments de l'ancien style |
| Mobile | Objectifs repliés, choix des étapes compact, commandes principales agrandies, RTL et animations réduites | Recette Android réelle nécessaire |
| Didou | Portrait illustré selon trois stades, croissance visible, repas, garde-robe avec aperçu, messages lisibles, studio accessible au clavier | Tenues personnalisées encore en SVG ; les messages sont des encouragements, pas une nouvelle conversation IA |
| Pédagogie | Observation, méthode illustrée, exercice accompagné, essais autonomes et transfert | Une mission traite une notion ; textes et quiz historiques pas tous réécrits |
| Erreurs | Réessai avec indices avant correction dans les missions et l'entraînement interactif ; correction accessible sans indice | Compréhension des indices à observer avec des enfants |
| Écoute | Facultative, langue adaptée ; en 3AP–5AP, masquée sans voix correspondante ; enregistrements des petits préservés | Qualité des voix du téléphone à confirmer |
| Lisibilité | Statuts éditoriaux retirés de l'écran enfant ; milliers séparés par espace fine insécable | Retrait du bandeau sans certification du contenu |

## Couverture pédagogique réelle

Inventaire exécuté sur `COURSES_DATA` après application des missions : **389 cours, dont 170 avec un parcours guidé**. Les deux pilotes sont inclus dans les 170.

| Niveau | Cours du catalogue | Avec mission guidée |
|---|---:|---:|
| 1AP | 57 | 0 |
| 2AP | 61 | 0 |
| 3AP | 78 | 56 |
| 4AP | 86 | 53 |
| 5AP | 107 | 61 |
| Total | 389 | 170 |

Les missions de 3AP–5AP couvrent 45 cours de mathématiques, 35 d'arabe, 27 de français, 27 d'anglais et 36 de sciences. Le dernier lot relie les sciences préparées et reprend l'anglais ; les autres missions proviennent du travail précédent de Claude et de Codex.

**219 cours n'ont pas encore ce parcours guidé**, dont les 118 cours de 1AP–2AP. Ils conservent leurs exercices et aides existants. Les corrections déjà apportées aux premiers niveaux ne constituent pas une réécriture pédagogique complète. Les matières complémentaires et quelques cours d'arabe/mathématiques restent aussi à prioriser.

Le dernier lot précise notamment l'eau potable, le monoxyde de carbone, la nutrition et l'électricité. En anglais, a/an dépend du premier son et like + ing n'est plus présenté comme l'unique construction possible. [Détail et sources](2026-11-13-sciences-anglais-3ap-5ap.md).

## Commits locaux

| Commit | Lot |
|---|---|
| `a933353` | Missions maths/arabe 3AP–5AP et présentation des cours |
| `97fdc27` | Missions français et corrections maths 1AP–2AP |
| `9abcc08` | Réessai guidé étendu, anglais et préparation sciences |
| `f4d42df` | Didou : croissance, nourriture, garde-robe et messages |
| `5e75d83` | Sciences reliées et précisions sciences/anglais |
| `806f44b` | Écoute 3AP selon disponibilité et langue |

Les travaux V2 restent distincts : leur bilan parent et leurs révisions ne sont pas annoncés comme livrés dans cette V1.

## Vérifications des derniers lots

| Lot | Tests automatisés | Navigateur | Autres contrôles |
|---|---|---|---|
| Didou | 34 tests, trois fichiers | Trois scénarios : 320 px français, 390 px arabe sombre, 1440 px français ; Axe ciblé studio | TypeScript, patch |
| Sciences/anglais | 141 tests des missions, comprenant aussi les régressions maths/français | Six missions mobiles complètes, une par niveau et matière | TypeScript, inventaire des 63 cours, patch |
| Écoute | 42 tests, quatre fichiers | Six scénarios mobiles : sciences/français/anglais 3AP avec/sans voix, catalogue puis cours | TypeScript, patch |

Les tests par lot se recouvrent : ne pas les additionner comme des tests distincts. Les scénarios navigateur utilisent une API simulée en invité. Ils vérifient l'interface locale, sans valider inscription, synchronisation réelle ou compréhension d'un enfant. Le contrôle TypeScript final est réussi. Aucun test Android physique ni audit intégral du backend n'est revendiqué.

## Recette immédiate pour Karim

Sur le même Wi-Fi que le PC : **http://192.168.1.200:3100/**, réponse HTTP 200 vérifiée depuis le PC. Sur le PC : **http://localhost:3100/**. Le serveur doit rester ouvert ; l'adresse IP dépend du réseau.

1. Accueil : choisir la classe, trouver une matière puis le cours suggéré, revenir en arrière. Vérifier la lisibilité sans zoom en arabe et français.
2. Didou : ouvrir les quatre onglets, essayer une tenue avant équipement, donner un repas et lire un message. Vérifier le solde après action. La croissance dépend du niveau existant, pas d'un changement à chaque repas.
3. Sciences/anglais : commencer la première mission de chaque classe 3AP/4AP/5AP ; faire une erreur, lire l'indice, réessayer et réussir la situation nouvelle.
4. Écoute 3AP : essayer une consigne et une question dans les trois langues. Sans voix, vérifier que l'absence de bouton n'empêche pas de continuer.
5. Avec un enfant : laisser le téléphone sans expliquer la méthode. Noter l'écran où il demande de l'aide et s'il réussit après l'indice puis dans une nouvelle situation.
6. Avec le vrai environnement connecté : inscription après essai, conservation des étoiles, reconnexion et progression retrouvée. Ces points restent à vérifier en conditions réelles.

## Reste à faire, par ordre de valeur

- [ ] Recueillir les retours Android de Karim et corriger les problèmes observés.
- [ ] Observer des enfants de plusieurs niveaux et faire relire les notions sensibles par un enseignant ; simplifier à partir des blocages réels.
- [ ] Réussir la première minute : accès direct à une courte activité, puis inscription de sauvegarde testée. L'accès au premier cours sans compte existe ; une réussite en trente secondes n'est pas mesurée.
- [ ] Mesurer cours ouvert, premier exercice tenté, mission terminée et retour le lendemain. Les captures publicitaires ne suffisent pas à identifier les abandons.
- [ ] Construire une séance quotidienne courte à partir de l'objectif et des jours d'activité existants. Ils ne sont pas encore une mission quotidienne de trois exercices.
- [ ] Enregistrer les erreurs de façon fiable avant une révision automatique à J+2, qui n'est pas livrée.
- [ ] Prioriser les adaptations 1AP–2AP et matières restantes, harmoniser quiz/résultats et préparer de vraies consignes enregistrées.
- [ ] Après recette, obtenir le feu vert explicite avant push et publication.

La base est plus cohérente, plus attractive et mieux guidée. Rétention et autonomie réelle restent à démontrer par l'usage.

## Autoévaluation

| Axe | Note | Preuve et amélioration possible |
|---|---:|---|
| Exactitude | 4/5 | Inventaire, TypeScript et sources des corrections ; relecture enseignante absente |
| Complétude | 4/5 | Trois lots terminés et committés ; autonomie des 389 cours pas acquise |
| Clarté | 4/5 | Couverture et limites distinguées ; retours sur les écrans attendus |
| Action possible | 4/5 | Adresse et recette concrète ; téléphone et synchronisation réelle à vérifier |
| Concision | 4/5 | Tableaux et liens ; détail conservé pour les preuves |

Moyenne : 4/5. Priorités : recette téléphone, observation enfant et mesure de la première activité. Cette appréciation de l'agent ne remplace pas la validation de Karim.
