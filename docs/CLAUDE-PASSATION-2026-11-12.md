# Passation complète pour Claude — MSSID V1 et V2

> Instantané préparé avant la demande de Karim de poursuivre avec Codex. Des travaux supplémentaires ont ensuite été réalisés : voir le [compte rendu V2 actualisé](audits/2026-11-12-v2-bilan-revisions-validation.md) et la [roadmap](ROADMAP-V1-FREEMIUM-DESIGN-V2.md). L'archive destinée à Claude reste un instantané antérieur et n'a été envoyée à personne.

État du 12 novembre 2026, fuseau Europe/Paris. Ce document décrit le travail local réalisé avec Karim et ses décisions les plus récentes. Il ne remplace pas la vérification du code.

## 1. Demande et contraintes de Karim

MSSID est une application éducative pour le primaire algérien, 1AP à 5AP, avec un espace préscolaire. Des familles trouvent les cours difficiles, surtout en 4AP–5AP : l'enfant ne parvient pas toujours à travailler seul.

Objectifs :

- Simplifier au maximum les formulations et les étapes sans rendre les notions fausses.
- Montrer les méthodes, guider la pratique, puis vérifier la capacité à refaire une tâche nouvelle.
- Rendre l'interface plus attractive et réactive. Direction choisie : **ludique et soignée, avec Didou et des interactions légères**.
- Réutiliser à terme les éléments pertinents du design V2 dans la V1, sans fusionner toute la V2.
- Préparer quelques services à forte utilité pour la future version payante ; consolider d'abord le bilan parent et le plan de révision existants.

Instructions actuelles, prioritaires sur les propositions commerciales antérieures :

1. **Aucune vente ni présentation commerciale dans la V1.** Pas de prix, abonnement, bouton d'achat, invitation Premium, formulaire de paiement ou reçu, ni annonce « bientôt payant ». Les démarches administratives de Karim sont en cours.
2. La clarté des cours, les corrections fiables et le guidage pédagogique de base restent gratuits.
3. L'accord pour travailler sur des services de la version payante ne vaut pas autorisation de vendre, de les afficher en V1 ou de publier.
4. **Aucun push ni déploiement avant ses tests et son feu vert explicite.** Attention : `main` est présenté dans la documentation V2 comme une branche susceptible de déclencher un déploiement automatique.
5. Les retours de Karim sur le design de l'accueil sont toujours attendus. Il a autorisé à avancer sur les autres points pendant ce temps.
6. Éviter l'accumulation de nouvelles fonctions : Karim a d'autres idées pour plus tard. Favoriser de petites tranches testables et facultatives, sans promesse de zéro bug.

## 2. Contexte d'acquisition

Karim indique environ **deux mois d'activité et 30 € de publicité au total**, entre Facebook et TikTok.

Les captures partagées affichent : 220 comptes, 71 actifs sur 30 jours, 34 actifs sur sept jours. Deux campagnes de novembre affichent ensemble 996 vues de page pour 6,45 €.

Ces chiffres proviennent des captures, pas d'une vérification de la base en production. Les périodes et sources ne sont pas alignées : ne pas calculer un coût d'acquisition ou un taux de conversion en divisant arbitrairement comptes et visites. Les abandons ne peuvent pas encore être attribués à la pédagogie ou à la publicité.

## 3. Deux worktrees à ne pas confondre

| Version | Dossier | Branche | Base actuelle |
|---|---|---|---|
| V1 | `C:/Users/Karim/Desktop/mssid/mssid-V1` | `main` | `cfefd3b` |
| V2 | `C:/Users/Karim/.codex/worktrees/v2-testing/mssid-V1` | `v2` | `0f67d383284d6c295c4a914f36d1391c3e219145` |

**Tout le travail de cette session est non commité. Aucun push, aucune fusion de branches et aucun déploiement n'ont été effectués.**

La V1 comporte aussi des fichiers non suivis préexistants ou sans rapport avec les changements : pièces jointes, `lot2-contact.jpg`, éléments de `output/` et de `tmp/`. Ne pas les effacer ou les ajouter à un commit en bloc.

Plusieurs nouveaux composants et tests sont non suivis : un simple `git diff` ne suffit pas à voir tout le travail. Vérifier également `git status --short` et lire les nouveaux fichiers listés ci-dessous. Le paquet de relecture contient des patchs distincts V1/V2 incluant les nouveaux fichiers pertinents ; ce ne sont pas des patchs à appliquer indistinctement aux deux branches.

## 4. Audit pédagogique V1 réalisé

Inventaire automatisé du catalogue réellement exporté : **389 leçons** après enrichissements.

| Niveau | Leçons | Constat principal |
|---|---:|---|
| 1AP | 57 | Parcours plus adapté : découverte, audio, activités courtes ; autonomie réelle non mesurée |
| 2AP | 61 | 132 exercices d'entraînement sans saisie vérifiée : réflexion puis consultation du corrigé |
| 3AP | 78 | 155 exercices du même type ; explications souvent génériques par matière |
| 4AP | 86 | 156 indices génériques « réfléchis bien » sur 516 exercices ; peu de démonstrations structurées |
| 5AP | 107 | Contenu plus dense ; exemples et aides déjà nombreux mais couverture partielle et erreurs confirmées |

La relecture du fond a été ciblée : toutes les réponses des 389 leçons n'ont pas été vérifiées. L'audit n'est pas une certification du programme officiel ni un test auprès d'enfants.

Documents :

- `docs/audits/2026-11-12-autonomie-1ap-5ap.md`
- `docs/audits/2026-11-12-autonomie-inventaire.csv`

## 5. Design V1 implémenté localement

- Accueil vert profond, crème et doré, message plus court et action principale mise en évidence.
- Matières placées avant le grand bloc Didou sur mobile ; Didou dans une colonne dédiée sur ordinateur.
- Cartes de matières : accent coloré, illustrations réutilisées, titres pouvant revenir à la ligne, interactions discrètes.
- Adaptation des commandes de Didou pour éviter leur chevauchement dans la colonne étroite.
- Priorité corrigée dans le tri des matières : les identifiants absents de l'ordre principal ne remontent plus avant les matières prioritaires.
- Réduction des animations respectée sur les zones retravaillées.

Fichiers V1 :

- `frontend/src/components/HomeView.tsx`
- `frontend/src/components/SubjectIllustratedCard.tsx`
- `frontend/src/components/DidouVirtualCompanion.tsx`
- `frontend/src/index.css`
- `frontend/src/locales/ar/home.ts`
- `frontend/src/locales/fr/home.ts`

Ce design est une proposition locale. Ce n'est pas une reprise intégrale ou déjà comparée écran par écran de la V2. Karim ne l'a pas encore validé sur son téléphone.

Preuves : 13 tests existants accueil/sélection réussis ; TypeScript validé ; six rendus navigateur vérifiés, dont français, arabe, clair/sombre, mobile/tablette/ordinateur. Axe n'a signalé aucune violation sur les deux zones nouvelles contrôlées, ce qui ne certifie pas l'accessibilité globale. Aucun gain de vitesse avant/après n'a été mesuré.

Captures et notes : `output/design-preview/README.md` et les images de ce dossier.

## 6. Corrections pédagogiques V1 implémentées

### Erreurs confirmées

- `math-5ap-large-numbers` : l'exercice vrai/faux validait 456 centaines dans 456 789. La bonne réponse est 4 567 centaines complètes ; le vrai/faux et son corrigé sont corrigés.
- Même leçon : correction d'une confusion entre centaines et milliers, et de l'indice appelant les millions la deuxième période plutôt que la troisième depuis la droite.
- `french-5ap-animal-ex6` : la consigne demande désormais la phrase entière, conformément à la réponse attendue.

### Saisie et lecture

- Nouveau `fillBlankComparison: 'exact' | 'latin_sentence'` dans le contrat d'exercice.
- Comparaison plus tolérante explicitement activée sur trois exercices français/anglais : casse, apostrophe typographique, espaces et ponctuation finale. Accents, mots et grammaire restent significatifs. Pas de suppression globale de vocalisation arabe.
- Comparaison par défaut exacte après normalisation Unicode NFC et suppression des espaces externes.
- Lecture facultative des panneaux de cours disponible en 4AP–5AP comme sur les niveaux inférieurs, sous le réglage existant. Pas de voix arabe de substitution pour le tamazight.
- Champs de saisie identifiés par leur consigne pour l'accessibilité.
- Isolation gauche-droite des opérations dans les nouvelles explications et les indices arabes, après détection visuelle d'un problème de lecture des soustractions.

### Deux missions pilotes

Nouveau contrat optionnel `learningPath`, appliqué à deux cours dans le catalogue final :

1. `math-4ap-numbers-under-100k` : observer les positions dans 23 405, voir la valeur de 4, compléter un calcul guidé, chercher seul dans 52 708, puis transférer à 47 032.
2. `math-5ap-division` : partager 17 crayons entre quatre enfants, nommer quotient/reste et vérifier, compléter le reste de 23 ÷ 5, chercher celui de 29 ÷ 6, puis trouver le nombre de sacs de huit cartes avec 41 cartes.

Étapes : **observer → voir la méthode → faire avec aide → essayer seul → appliquer dans une autre situation**.

Le parcours spécifique remplace l'explication générique pour ces deux cours. Les règles, exemples, quiz et onglets ordinaires restent disponibles. Les nouvelles étapes utilisent le moteur d'exercices existant et son état commun : pas de récompense pour lire un modèle, ni de double récompense dans la session en passant du parcours à l'entraînement.

Les missions introduisent seulement une partie de chaque leçon. Les autres notions ne sont pas déclarées acquises et aucune mesure durable d'autonomie n'est inventée.

Fichiers principaux V1 :

- `frontend/src/types/index.ts`
- `frontend/src/data/courses/autonomyPilots.ts` — nouveau
- `frontend/src/data/coursesData.ts`
- `frontend/src/components/lessonViewer/AutonomyLessonPath.tsx` — nouveau
- `frontend/src/components/LessonViewer.tsx`
- `frontend/src/components/PracticeExerciseCard.tsx`
- `frontend/src/components/lessonViewer/practiceAssessment.ts`
- `frontend/src/components/lessonViewer/useLessonPractice.ts`
- `frontend/src/components/lessonViewer/useLessonSpeech.tsx`
- `frontend/src/data/courses/5AP/math.ts`, `french.ts`, `english.ts`

Nouveaux tests : `autonomyPilots.test.ts`, `AutonomyLessonPath.test.tsx`, `fillBlankAssessment.test.ts`, `useLessonSpeech.test.ts`, `frontend/e2e/autonomyPilots.spec.ts`. Tests existants étendus : `courseCorrections.test.ts`, `PracticeExerciseCard.test.tsx`.

Validation de cette tranche : **12 fichiers / 162 tests réussis**, TypeScript réussi, **quatre parcours navigateur réussis** (4AP mobile 320 px, 5AP mobile 390 px, 5AP interface française sombre, 4AP ordinateur). Les navigateurs simulent les API. Pas de test sur téléphone réel ni d'observation d'enfants.

Compte rendu : `docs/audits/2026-11-12-pilotes-autonomie-validation.md`. Captures : `output/pedagogy-preview/`.

Si le serveur local V1 sur le port 3100 est actif :

- `http://127.0.0.1:3100/lesson/math-4ap-numbers-under-100k?g=4AP`
- `http://127.0.0.1:3100/lesson/math-5ap-division?g=5AP`

Ces adresses sont locales à l'ordinateur, pas directement accessibles depuis un autre téléphone via son propre localhost.

## 7. Monétisation future : cadrage, pas activation

Les sources V2 possèdent déjà un registre `frontend/src/access/entitlements.ts` et deux formules : 900 DA pour trois mois, 2 400 DA pour douze mois, avec une offre familiale documentée jusqu'à six enfants. La V1 contient encore un ancien prix annuel de 1 500 DA.

Aucun prix n'a été changé. Avant toute vente future, affichage, serveur, durées, accès et reçus historiques devront être cohérents. Les fonctions présentes dans les sources ne sont pas automatiquement validées en production.

La proposition initiale de présenter une offre a été **explicitement différée par Karim**. Les documents commerciaux sont internes ; leurs tarifs et textes ne doivent pas être affichés dans la V1 actuelle.

Fonctions futures sélectionnées : bilan parent clair, plan de révision, puis cahier ciblé après validation des deux premiers. Pas de nouveau service d'IA payant au clic, de nouvelle synchronisation ou de nouveau paiement dans cette tranche.

Documents : `docs/OFFRE-V1-GRATUITE-PREMIUM-FAMILLE.md` et `docs/V2-AJOUTS-CIBLES-VALEUR-PARENT.md`.

## 8. Travail V2 effectivement réalisé après le dernier « go »

Les outils existaient déjà. Quatre fichiers V2 ont été consolidés, avec un nouveau fichier de tests. Aucun de ces changements n'a été porté en V1.

Correctifs :

- Bilan limité à une fenêtre de sept jours valide, sans activités futures ou dates invalides ; mêmes données pour compteurs et liste des réussites.
- Repli de l'export image après trois secondes si `canvas.toBlob` ne répond pas, permettant le partage texte déjà présent. Aucun message n'a réellement été envoyé.
- Suggestion d'une date future après l'été, contrôle strict des dates impossibles et calcul par jours calendaires pour éviter les décalages au changement d'heure.
- Filtrage des leçons d'une ancienne classe dans le plan de la classe actuelle ; anciennes statistiques du carnet préservées conformément aux tests existants.
- Élimination des doublons et entrées invalides dans les jours cochés stockés.
- Pas d'examen blanc fictif sans sujet disponible ; repli vers les leçons et état explicite sans ressources.
- Mention « programme général » en l'absence de difficultés exploitables ; pas de fausse personnalisation.

Fichiers V2 :

- `frontend/src/utils/competenceProgress.ts`
- `frontend/src/utils/weeklyReport.ts`
- `frontend/src/utils/examPlan.ts`
- `frontend/src/components/examPlan/ExamPlanPanel.tsx`
- `frontend/src/utils/parentToolsReliability.test.tsx` — nouveau

Validation : baseline **30 tests réussis** ; nouveau fichier de 15 cas dont 14 défauts reproduits avant correction ; après correction **six fichiers / 45 tests réussis** ; TypeScript V2 et `git diff --check` réussis.

Pas de nouveau test navigateur V2 dans cette tranche, pas de test Android physique, pas de migration, pas de paiement, pas d'envoi automatique, pas de publication.

Compte rendu dans le dossier V1 : `docs/audits/2026-11-12-v2-bilan-revisions-validation.md`.

## 9. Documents de référence et prochaines tâches

- `docs/ROADMAP-V1-FREEMIUM-DESIGN-V2.md` — malgré son nom historique, son contenu impose une V1 gratuite sans affichage commercial.
- `docs/CHARTE-PEDAGOGIQUE-AUTONOMIE-1AP-5AP.md` — règles de vulgarisation, adaptations par niveau, structure de mission et critères d'observation.
- Les trois comptes rendus dans `docs/audits/` et l'inventaire CSV.

Priorités restantes :

1. Obtenir les retours de Karim sur le design local et tester sur Android réel.
2. Faire relire les deux pilotes par un enseignant et observer des enfants, particulièrement leur compréhension des consignes et l'usage des aides.
3. Comparer réellement les écrans V1/V2 avant un portage visuel plus large ; vérifier qu'aucune entrée commerciale V2 n'est importée.
4. Étendre le modèle pédagogique seulement après ajustement des pilotes : autres notions, langues, puis 1AP–3AP avec une adaptation aux lecteurs débutants.
5. Poursuivre la recette du bilan parent et du calendrier V2 dans le navigateur et sur appareils ; ne pas confondre les tests de composants avec cette recette.
6. Vérifier les droits, expirations, séparation des profils et comportements réseau avant toute commercialisation future ; ce dernier chantier reste distinct de la V1 gratuite.
7. Conserver les idées supplémentaires au backlog et garder un périmètre limité.

## 10. Relecture demandée à Claude

Commencer par une **revue indépendante en lecture seule** des deux worktrees et des nouveaux fichiers. Vérifier les affirmations de ce document dans les diffs et les tests ; ne pas supposer que la réussite technique démontre l'autonomie d'un enfant.

Restituer :

- Les anomalies concrètes, classées par gravité, avec fichier, cas de reproduction et impact.
- Les régressions possibles sur les cours, les récompenses, la saisie, la lecture audio et la navigation.
- Les défauts pédagogiques des deux missions : exactitude, niveau de langage, étapes encore implicites, transfert réellement évalué.
- Les limites du bilan et du plan : dates, données absentes, profils/niveaux, compteurs, export qui échoue.
- Une distinction nette entre corrigé, testé, à confirmer avec des utilisateurs et simplement proposé.
- Une prochaine tranche de travail courte et priorisée, sans ajouter automatiquement de nouvelles fonctions.

Ne pas pousser, déployer, fusionner V2 dans V1, ouvrir les ventes, modifier les données réelles ou envoyer de messages aux familles. Préserver le travail local et les fichiers sans rapport avec cette session.
