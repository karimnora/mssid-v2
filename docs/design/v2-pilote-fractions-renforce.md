# Pilote fractions renforcé — les quatre corrections

6 novembre 2026 · v2 · commits locaux uniquement, aucun push.

## Ce qui change

1. **Comprendre par manipulation.** L’enfant construit 17/5 en unités entières et reste, choisit son intervalle entre deux entiers et partage une même surface pour obtenir 1/2 = 5/10. Le dessin construit se met à jour avec les choix. Les réponses sont vérifiées mathématiquement. Une erreur invite à réessayer, et l’aide reste mémorisée lorsqu’on change de mini-mission. L’ancien explorateur de boutons et le double affichage des outils interactifs ont été retirés.
2. **Présentation réutilisable.** Une configuration centrale, `villageLessonConfig.ts`, active le mode. `VillageLessonLayout` porte les cinq phases et les panneaux source ; le lecteur standard possède une seule entrée vers ce mode. `LessonExtras` partage le rendu des missions et jeux, sans recopier les blocs. L’activation d’une autre leçon exige encore une revue de son contenu et un adaptateur si sa manipulation diffère : ajouter un identifiant ne fabrique pas une pédagogie adaptée.
3. **Voix et poids.** Banque du cours : **27 fichiers, 990 852 octets** (contre 42 fichiers et 4,1 Mo). Banque partagée : **23 fragments, 333 652 octets**, utilisés pour les instructions et l’accueil. Le cache WAV a été réutilisé ; seuls 23 fragments courts et 7 indices manquants ont été générés, sans profil, nom ou réponse d’enfant. Les fichiers sont décodables et non silencieux, avec empreintes dans `pilot-fractions-audio.json`. La prononciation n’est pas certifiée par une relecture humaine.
4. **Transférer et rendre compte.** Le labo de la même leçon propose 7/3, son encadrement et 2/3 = 4/6, puis un choix d’explication. Le bilan parent protégé distingue essais, réussite au premier essai sans indice, réussite après aide/erreur et non évalué. Il sépare les observations du labo des exercices et du quiz officiels, puis ouvre une prochaine activité adaptée.

## Contrats conservés

- Les données originales du cours, exercices, évaluations, quiz, corrections et récompenses ne sont pas modifiées.
- Les six mini-missions et le choix d’explication n’attribuent pas de points de maîtrise ; le quiz reste requis pour terminer le cours.
- Le bouton Didou appelle maintenant `practice.revealHint(ex)` ; la carte utilise la même action et le même état. Il ne cherche et ne clique plus de bouton dans le document.
- Le bilan décrit **la séance courante** et disparaît en quittant le lecteur. Les remontées officielles au carnet existant continuent. Ce n’est pas encore un nouveau tableau de bord parent persistant.
- Le choix d’une explication est observé ; l’application n’écoute ni n’évalue une explication orale de l’enfant.
- Cibles tactiles de 60 px minimum pour les nouveaux contrôles ; alternatives par tap et clavier ; animations limitées au guide et coupées par la préférence de réduction des mouvements. Aucune certification WCAG complète revendiquée.

## Politique audio

Budget du pilote : **1 050 000 octets** hors fragments mutualisés. Pour les prochaines leçons : enregistrer d’abord l’introduction, les règles, les indices et les retours ; mesurer le poids avant activation. MP3 mono 24 kHz / 32 kbit/s pour les phrases de parole. Conserver les WAV maîtres hors des assets de production pour les ajustements futurs.

Les MP3 sont des ressources séparées, référencées par URL hachée après build et servies par le CDN du déploiement. Ils ne sont pas intégrés en base64 au JavaScript ni ajoutés au précache de la PWA. Aucun appel payant à la lecture ; chargement lors de l’écoute. Une migration vers un stockage média dédié peut être décidée avant une généralisation massive ; elle n’est pas nécessaire pour ce pilote.

L’accueil assemble des fragments enregistrés selon le type réel de mission et la matière réelle. Il annonce l’action et la matière, puis renvoie explicitement au titre et aux détails visibles sur la carte. Il **ne prononce pas intégralement chaque titre de tous les cours**, ni les compteurs numériques. Le lecteur complet conserve son mécanisme de repli existant pour les textes non enregistrés ; les phrases clés du pilote et les fragments de l’accueil utilisent Nova A.

## Vérification

- Contrôle ciblé : **52 tests réussis sur 7 fichiers**, dont calculs des trois missions, transfert et explication, indices réels, bilan protégé, voix séquentielle et absence de double attribution de points.
- Playwright en arabe : **360×640, 390×844, 1280×800**. Les six missions, l’explication, le bilan après protection parent, sa prochaine action et le quiz officiel sont vérifiés. Corrections à deux colonnes `الحل / الأجوبة` à gauche, `العمليات` à droite. Aucun débordement horizontal de page ni erreur JavaScript. Le tableau parent défile horizontalement à l’intérieur du dialogue sur petit écran.
- Lecture réelle des trois fragments de la mission dans Chromium et arrêt à la navigation confirmés.
- Les dialogues longs sont maintenant bornés à l’écran et défilables ; le bouton final du bilan a été testé sur petit téléphone.
- Rapports et captures : `C:/Users/Karim/.codex/visualizations/2026/11/05/01a1ac76-e238-7532-9072-bbec939fcfdb/`, fichiers `premium-*`.
- Suite complète, TypeScript et build : résultats ajoutés après exécution finale.

## Auto-évaluation

| Axe | Note / 5 | Preuve et limite |
|---|---:|---|
| Exactitude | 4 | Calculs et notation vérifiés ; voix sans relecture humaine certifiée. |
| Complétude | 4 | Les quatre points sont intégrés ; bilan limité à la séance et aux réponses observables. |
| Clarté | 4 | Phases, dessins et états non évalués explicites ; à faire essayer à des enfants et parents. |
| Utilisabilité | 4 | Parcours complet vérifié sur trois formats ; généralisation encore soumise à revue pédagogique. |
| Concision | 4 | Phrases vocales mutualisées ; tableau détaillé du bilan demande encore du défilement. |

### Résultats finaux des tests

Suite complète : **2 554 tests réussis, 252 fichiers**, en 1 123,54 secondes. Commande locale : `node node_modules/vitest/vitest.mjs run --pool=threads --maxWorkers=1 --testTimeout=20000 --reporter=verbose`. Les premières exécutions parallèles ont rencontré des dépassements du délai de 5 secondes sur des parcours d’interface existants ; la vérification a été relancée en série avec un délai local de 20 secondes. Les assertions et la liste des tests sont inchangées ; seuls la concurrence et le délai d’exécution ont été ajustés localement. La configuration Vitest du dépôt n’a pas été modifiée. Aucun workflow GitHub Actions lancé.

TypeScript : contrôle complet réussi via PowerShell. Build Vite/PWA : réussi (73 secondes). Les 50 MP3 sont émis comme fichiers séparés et ne figurent pas dans le précache ; contrôle effectué sur le service worker généré. L’avertissement existant de taille de certains bundles reste présent.

### Dernier contrôle de la voix de Didou

Les phrases `missionIntroAr` et `detailedCourse.takeawayAr` ont été explicitement conservées dans la banque. Trois doublons secondaires ont été retirés ; le retour de quiz réutilise la règle enregistrée plutôt qu’une seconde copie de la même règle précédée d’une phrase d’erreur. Le cache WAV existant a suffi, sans nouvelle génération. Les tests vocaux réinitialisent maintenant leurs mocks entre scénarios, contrôlent le dernier appel et couvrent toutes les phrases du guide ainsi qu’une erreur au quiz. Après cet ajustement audio : **53 tests ciblés réussis sur 7 fichiers**, puis les **7 tests du pilote** réexécutés avec le contrôle du retour de quiz. Lecture réelle de l’introduction Nova et bouton d’arrêt confirmés dans Chromium ; les paramètres de cache de Vite sont ignorés lors du contrôle de l’URL. Le build final est également réussi. La suite complète de 2 554 tests ci-dessus précède ce dernier ajustement limité à la sélection audio.
