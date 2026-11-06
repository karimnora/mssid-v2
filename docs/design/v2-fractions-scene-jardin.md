# Scène jardin et parcours tactile — trois priorités du pilote

6 novembre 2026 · branche v2 · commit local uniquement, aucun push.

## Résultat visible

- La leçon arabe en mode village s’ouvre dans une scène dédiée, en fond `#FFFBF0`, aussi bien depuis son lien direct que depuis le jardin. La barre du haut contient retour, Didou et son. L’interface classique est masquée, retirée de l’accès clavier et des lecteurs d’écran pendant la scène, puis restaurée à la sortie. Les anciens compagnons flottants sont démontés pour arrêter leurs animations et temporisations.
- Les parties du dessin sont touchables. La partie réellement choisie se remplit ; cinq cinquièmes sont regroupés en un entier. L’enfant peut décomposer un entier et dispose aussi de boutons +/− de 60 px. La quantité disponible est conservée : on ne peut pas construire plus de 17/5 (ou 7/3 dans le labo). Les unités apparaissent sous les commandes pour ne pas déplacer la zone où l’enfant tape.
- Un seul couple de navigation pédagogique reste visible en bas. Les cinq phases sont un indicateur de position, pas des onglets. Les trois missions de découverte précèdent les trois missions du labo, puis le choix d’explication. Les réponses et les indices restent disponibles en revenant en arrière. Une erreur invite à réessayer et ne renvoie pas au début.

Le labo n’est plus un onglet parallèle. Les mots du cours et les activités supplémentaires restent accessibles dans des volets secondaires. La lecture complète, les règles, les exercices, l’évaluation et le quiz d’origine sont conservés.

## Didou et interaction

Didou annonce les transitions et les sept étapes avec des fichiers Nova enregistrés. Un seul court enregistrement a été ajouté pour l’explication (18 284 octets) ; les autres phrases sont réutilisées. Les fragments partagés contenant des voyelles arabes explicites sont recherchés exactement avant le repli sans vocalisation : une consigne connue ne bascule plus inutilement sur la voix du téléphone.

La banque du cours reste à 990 852 octets. Les 24 fragments partagés font 351 936 octets. Aucun appel TTS payant pendant l’activité et aucune donnée enfant envoyée pour cette annonce. Les mouvements des unités utilisent transform/opacity et s’arrêtent avec prefers-reduced-motion.

Le texte de Didou n’est plus coupé. La barre d’action reste accessible, avec des cibles de 60 px au minimum pour les nouveaux gestes. Le bouton de Didou révèle l’indice de la mini-mission par callback. La protection de sortie conserve la manipulation si l’enfant annule son départ.

## Ce qui reste inchangé ou hors de ce lot

Les données du cours, les réponses officielles, les règles de note, les points et la validation ne changent pas. Les manipulations restent de la découverte, pas des preuves d’acquisition attribuant de l’XP. Le quiz officiel reste requis pour terminer une leçon non encore validée.

Le bilan parent reste celui de la séance courante, protégé par le contrôle parent existant. Sa persistance et les variantes aléatoires de fractions ne font pas partie de ces trois priorités. Le reste des cours, les interfaces française et préscolaire n’ont pas reçu cette scène.

## Modifications ciblées

App : import de configuration, condition de démontage des compagnons. LessonViewer : retrait du callback de sélection des anciens onglets (trois lignes). JourneyScreen : entrée directe dans la scène pour les leçons configurées. Aucun reformatage global de ces fichiers ni de useLessonPractice. Les nouveaux fichiers et la manipulation fonctionnellement réécrite utilisent des guillemets simples.

## Vérification

- Tests ciblés : 30 réussis dans 5 fichiers. Ils couvrent le regroupement réel, les limites de quantité, les alternatives +/−, l’ordre des étapes, la conservation après retour et erreur, l’isolation/restauration du site, les points, les indices, le contrôle parent et le quiz d’origine.
- Matrice Chromium en arabe : lien direct et entrée depuis le jardin × 360×640, 390×844 et 1280×800. Les six parcours complets passent, sans erreur JavaScript ni débordement horizontal. Le site classique est masqué pendant la scène et redevient accessible en sortant.
- Contrôle tactile : dimensions ≥ 60 px ; la position des cases ne bouge pas à la création d’un entier. L’annulation d’une sortie conserve le premier morceau choisi.
- Chaque transition des sept étapes demande le bon MP3 Nova ; le labo n’apparaît qu’après les trois premières missions et le défi après les trois missions du labo.
- Bilan parent protégé, aide réellement comptée et quiz toujours nécessaire : vérifiés dans chacun des six parcours.
- Rapports et captures : `C:/Users/Karim/.codex/visualizations/2026/11/05/01a1ac76-e238-7532-9072-bbec939fcfdb/linear-*`.

Les résultats complets figurent ci-dessous.

## Auto-évaluation

| Axe | Note / 5 | Preuve et limite |
|---|---:|---|
| Exactitude | 4 | Conservation des quantités, résultats officiels et flux vérifiés ; voix sans certification humaine de prononciation. |
| Complétude | 4 | Les trois priorités sont intégrées ; persistance du carnet et variété restent hors périmètre. |
| Clarté | 4 | Une navigation et des pièces concrètes ; un essai avec des enfants reste utile. |
| Utilisabilité | 4 | Six parcours vérifiés, gestes stables et récupération d’une sortie annulée ; autres navigateurs non certifiés. |
| Concision | 4 | Contrôles secondaires rangés dans des volets ; le cours complet reste long par nature. |

## Résultats finaux

Suite complète : **2 554 tests réussis sur 253 fichiers**, 421,88 secondes, avec deux workers et un délai local de 20 secondes par test (`--testTimeout=20000`). Aucune configuration CI modifiée et aucun workflow distant lancé.

Le contrôle sonore réel a ensuite révélé une course entre le nettoyage du panneau précédent et le démarrage de la nouvelle annonce. Les annonces de changement de phase sont désormais mises en attente puis démarrées après le nettoyage React. Après ce correctif limité au cycle audio : **30 tests ciblés réussis**, puis les **3 tests du pilote** réexécutés avec une assertion sur l’ordre nettoyage / nouvelle voix. Le scénario Chromium vérifie le démarrage réel des sept MP3, leur arrêt avec le bouton son et l’absence de nouvelle lecture pendant la coupure.

TypeScript et build Vite/PWA finaux : réussis. L’avertissement préexistant sur la taille de certains bundles reste présent. Les données pédagogiques et le moteur de notation n’ont pas changé pendant le correctif sonore.

Le dernier contrôle couvre également les annonces des règles, de l’entraînement, de l’évaluation et du quiz. Le démarrage est décalé d’une microtâche annulable pour laisser terminer aussi la répétition des nettoyages de StrictMode. Le test de parcours est désormais exécuté sous StrictMode, avec vérification de l’ordre arrêt / lecture à chaque changement de panneau ; les **30 tests ciblés** passent dans cette configuration. Le scénario Chromium complet passe avec les démarrages audio réels, le son coupé puis réactivé et la restauration du site à la sortie.
