# V2 — Jeux de Didou : état des lieux (5 novembre 2026)

> Pour Karim et pour la session qui refait le graphisme (voir `v2-pilote-prompts-nanobanana.md`).
> Branche `v2`, dernier commit jeux : `e0c80c7`. Catalogue complet des moteurs : `v2-jeux-catalogue.md`.

## 1. Ce qui est fait

### Contenu

- **4 moteurs** : Memory (`memory`), Classer (`sort`), Ordonner (`order`), Labyrinthe (`maze`).
- **24 jeux de 10 niveaux, soit 240 niveaux.** Chaque niveau scolaire, du préscolaire à la 5AP, a 4 jeux.
  - Données : `frontend/src/data/games/packs{Pre,1ap,2ap,3ap,4ap,5ap}.ts`.
  - Chaque niveau est relié à une leçon réelle du catalogue, ou à un module pour le préscolaire.
- **Progression des niveaux** :
  - 5 paliers : سهل، متوسط، صعب، خبير، بطل ;
  - le niveau 1 est un échauffement ;
  - le niveau 10 est un final avec une couronne ;
  - le brouillard apparaît au dernier labyrinthe de chaque jeu.
- **Langues** :
  - à partir de la 3AP, des cartes en anglais ou en français, lues avec la bonne voix ;
  - Didou explique toujours en arabe.
- **Test de contenu** (`games.test.ts`). Il vérifie :
  - les 10 niveaux par jeu ;
  - les leçons qui existent ;
  - les calculs exacts ;
  - les bornes du programme ;
  - aucune langue étrangère avant la 3AP ;
  - que les labyrinthes ont une solution.

### Jouabilité

- **Tous les niveaux sont ouverts**, et le bouton « تخطَّ » permet de sauter un niveau.
- **Étoiles** : 3 jusqu'à 1 erreur, 2 jusqu'à 3 erreurs, sinon 1.
- **Didou guide l'enfant** :
  - il explique chaque erreur, avec des explications calculées à partir de la valeur de chaque pierre (`ruleMaze`) ;
  - il donne un indice à partir de la 2e erreur ;
  - il encourage les séries de bonnes réponses (×3, ×5, ×8).
- **Le résultat de chaque niveau va dans le carnet du parent.**
- **Les XP sont donnés une seule fois**, quand les 10 niveaux sont réussis.
- **Accès** :
  - le premier jeu de chaque niveau scolaire est gratuit ;
  - les autres affichent un message Premium neutre, sans prix (règle Android).
- **Petits lecteurs (1AP et préscolaire)** : chaque carte est lue à voix haute, avec l'image au-dessus du mot. Les cibles font 56 à 72 px.

### Points d'entrée

1. L'étagère « ألعاب ديدو التعليمية » de l'espace Défis.
2. Le bandeau sous la mission, dans les leçons concernées : il ouvre directement le bon niveau.
3. L'espace jeux du préscolaire, quand la langue choisie est l'arabe.
4. **Les stations-jeux sur la carte de Didou** (1AP → 5AP) :
   - une station par jeu, et le jeu gratuit dans le premier monde ;
   - une fiche qui s'ouvre par le bas, avec les 10 niveaux et le niveau suggéré ;
   - une fiche Premium avec un aperçu flou et un retour vers le jeu gratuit.

### Rendu (code)

- **3D en CSS et `motion/react`** :
  - un décor en perspective (sol qui défile, nuages, soleil, décor sur 3 profondeurs) ;
  - des cartes épaisses qui se retournent et un plateau de Memory incliné ;
  - des pièces qui volent jusqu'à leur place ;
  - un labyrinthe incliné, où Didou saute de pierre en pierre ;
  - des confettis, des étoiles qui tournent et une vibration sur Android.
- **Vérifié au format téléphone (390 × 844) le 5 novembre** :
  - chaque plateau tient à l'écran ;
  - la barre d'actions ne recouvre plus le jeu ;
  - si un plateau dépasse encore un peu, la page glisse toute seule juste assez pour l'afficher.
- **Toutes les animations s'arrêtent** si l'appareil demande moins d'animations (`prefers-reduced-motion`).

## 2. Ce qui est à faire (manques réels)

| Priorité | Sujet | Détail |
|---|---|---|
| **P0** | **Progression par enfant** | Les étoiles sont rangées sous une seule clé (`mssid_learning_games_v1` dans `LearningGameEntry.tsx`), sans distinction d'enfant. Avec 6 enfants par compte, les frères et sœurs partagent les mêmes étoiles. Il faut une clé par enfant, comme la carte (`getActiveProgressOwner`), avec une migration de l'ancienne clé. |
| **P1** | **Progression non sauvegardée sur le serveur** | Les étoiles et l'état « XP donnés » restent dans le téléphone : changer d'appareil ou vider le cache fait tout perdre. Seuls les résultats envoyés au carnet et les XP passent par le serveur. |
| P1 | Verrou Premium uniquement dans l'app | Même règle que le reste de la V2 (`enforcedBy: 'client'`). C'est à traiter avec le paiement. |
| P1 | Test sur un vrai téléphone | Tout a été vérifié dans Chromium au format téléphone, mais pas encore dans la WebView Android. Points à regarder : fluidité de la 3D sur un téléphone d'entrée de gamme, voix arabe, vibration. |
| P2 | Matières sans jeu | Français en 4AP et en 5AP, histoire-géographie en 4AP, éducation civique. |
| P2 | Préscolaire en français | Les jeux du préscolaire ne s'affichent pas quand la langue choisie est le français. Il faudrait des cartes en français ou une version sans texte. |
| P2 | Préscolaire absent de la carte | La carte de Didou ne couvre que le primaire. |
| P2 | Sons | Il n'y a que 3 sons d'interface : pop, réussite, erreur douce. Pas de musique d'ambiance par monde, pas de son de victoire propre au niveau final. |
| P3 | 20 moteurs du catalogue non construits | M5 à M24 : points à relier, différences, « écoute et choisis », dictée de Didou, nombre cible, vrai ou faux, puzzle, coloriage magique, **Programme Didou (M17)** et **Manipulations (M21)**. |

## 3. Pour la session graphisme : ce que les jeux peuvent récupérer

Aujourd'hui, les jeux dessinent tout **en emoji et en CSS**. C'est là que les images du pilote auraient le plus d'effet :

| Aujourd'hui dans les jeux | Image du pilote à utiliser | Où dans le code |
|---|---|---|
| Didou en petit portrait SVG (`DidouPortrait`), avec 3 humeurs `talk` / `happy` / `think` | 02 parle, 03 bravo, 04 réfléchit | `DidouGuide` (bulle), `lg-node-didou` (carte des niveaux), `lg-stone-didou` (labyrinthe) |
| Étoiles ⭐ en emoji | 13-1 étoile dorée | `LevelClear`, `lg-node-stars`, fiche de station (`gs-levels`) |
| Trésor 💎 du labyrinthe | 13-3 coffre ouvert | `lg-stone-goal` dans `boards.tsx` |
| Cadenas SVG violet | 13-4 cadenas | station Premium sur la carte, `gs-icon-lock` |
| Fond de chaque jeu : un dégradé, avec des emoji en guise de décor (`theme.scenery`, par exemple 🏪 🍊 🧺) | Un décor peint par lieu, comme 10/11 pour Constantine | `World` dans `LearningGamePlayer.tsx`, champ `theme` des packs |
| Dos des cartes du Memory : motif zellige en CSS et sceau 🦊 | Une illustration de dos de carte, par exemple Didou en médaillon | `.lg-mcard-back`, `.lg-mcard-seal` |
| Icône de la station sur la carte : l'emoji du pack | Une icône 3D par moteur (Memory, Classer, Ordonner, Labyrinthe) | `JourneyMap.tsx` (`j-game`) et `.gs-icon` |

**Règles à garder** (déjà respectées, et vérifiées par les tests) :

- **Cibles tactiles** : au moins 56 px, 60 à 72 px en 1AP et au préscolaire.
- **Erreurs** : jamais de texte rouge, et un son doux.
- **Sens de lecture** : tout est de droite à gauche, sauf les nombres, les calculs et les mots latins, qui restent de gauche à droite.
- **Premium** : aucun prix affiché.
- **Images** : aucun texte dans les images, puisque les plateaux affichent le contenu pédagogique en texte.
- **Animations** : `prefers-reduced-motion` coupe tout.
- **Repères à ne pas renommer, les tests en dépendent** :
  - `data-lg-*` : `data-lg-board`, `data-lg-card`, `data-lg-cell`, `data-lg-level`, `data-lg-next`, `data-lg-skip`, `data-lg-actions`, `data-lg-scroll`… ;
  - `data-gs-*` (fiche de station) ;
  - `data-game-station` (station sur la carte).
- **Poids** : les décors doivent rester légers (WebP, chargement progressif), car un jeu peut s'ouvrir en pleine leçon.

## 4. Ce qui serait bien à ajouter

**Pour l'enfant (envie de revenir)**

- **Défi du jour** : un niveau tiré chaque jour, en lien avec la dernière leçon vue. C'est le format « quotidien » prévu au §9 du catalogue.
- **Collection de trophées** : chaque jeu terminé avec 30 étoiles sur 30 donne un objet du monde (médaille de Constantine, lanterne de la Casbah…), à exposer dans le sac de Didou.
- **Rejouer en mode chrono** une fois les 10 niveaux réussis, avec un record personnel. Le niveau n'en devient pas plus dur.
- **Réactions de Didou plus riches** : une pose différente selon l'événement (bonne réponse, série, erreur, fin), grâce aux images 02 à 05.

**Pour le parent (valeur Premium)**

- **Résumé par jeu dans le carnet** : par exemple « Lina a réussi 8 niveaux sur 10 du labyrinthe des fractions, elle bloque sur 3/4 ». Les données existent déjà : un résultat par niveau, avec la leçon et l'aide reçue.
- **Recommandation après une leçon ratée** : « Rejoue le niveau 4 de la mémoire du marché de Belcourt ».

**Pour l'équipe**

- **Test visuel automatique** (Playwright, au format téléphone) qui mesure qu'aucun plateau ne passe sous la barre. Je l'ai fait à la main le 5 novembre : il suffirait de transformer cette vérification en test qui reste dans le dépôt.
- **Écran de relecture enseignant** pour les 240 niveaux, comme `v2-relecture-enseignant.md` pour les leçons.

## 5. Ordre conseillé

1. **P0 : progression par enfant.** C'est un petit correctif, à faire avant toute démo à une famille.
2. Les images du pilote branchées dans les jeux, en même temps que leur intégration dans le reste de l'app : Didou en 4 poses, étoile, coffre, cadenas, décor de Constantine pour les jeux de ce monde.
3. Test dans la WebView Android sur un téléphone modeste.
4. Lot 2 des moteurs : M17 Programme Didou et M21 Manipulations, les meilleurs arguments Premium.
5. Défi du jour et résumé par jeu dans le carnet.
