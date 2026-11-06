> Rapport historique du commit 7affd96. Le pilote a depuis été renforcé : voir [la version actuelle](v2-pilote-fractions-renforce.md), notamment pour les manipulations, le bilan et le budget audio.

# TODO 3 et 4 — accueil connecté et leçon pilote 5AP

6 novembre 2026. Branche v2. Ces numéros désignent le TODO de Karim, pas les tranches du document de recommandation.

## Résultat

L’accueil montre la prochaine mission, le nombre réel de leçons validées et un bouton pour continuer directement. La lecture de la mission utilise le moteur vocal existant. La maison des histoires ouvre les cours d’arabe ; le panneau des leçons donne accès aux mathématiques et au pilote de fractions, avec les contrôles de classe et de disponibilité habituels. Jeux et examens restent séparés.

La leçon arabe `math-5ap-fractions` devient la référence visuelle : cinq phases (découvrir, essayer, comprendre, pratiquer, résultat), surfaces crème lisibles, Didou animé et aide à portée de main. Le dernier groupe contient les deux panneaux existants d’évaluation et de quiz.

L’enfant manipule huit parts égales sans score, parcourt le vocabulaire et les règles source, puis travaille un exercice à la fois. Les cartes restent montées pour conserver les réponses et les indices lorsqu’il revient en arrière. Le bouton d’aide déclenche le véritable indice de l’exercice et conserve le suivi de l’aide utilisée. Didou réagit à la réponse avec l’indice ou la règle du cours. Le cours complet et les activités supplémentaires restent disponibles dans des volets dépliables.

Les données du programme, les sept exercices, les questions du quiz, les corrections, les points et la validation restent ceux du moteur existant. Consulter une phase ou manipuler les parts ne donne aucune maîtrise artificielle. Le résultat final exige toujours la validation du quiz.

## Voix

42 fichiers MP3 Nova A, environ 4,1 Mo au total, chargés à la demande. Génération unique et dédupliquée avec cache : aucun appel OpenAI lors des clics de l’enfant. Seuls les textes pédagogiques publics ont été transmis ; aucun prénom ou profil enfant. L’accueil conserve ses enregistrements et son mécanisme de lecture existants ; le pilote bénéficie des nouveaux enregistrements.

Voir [l’audit des fichiers](pilot-fractions-audio.json) : texte, durée calculée sur les données PCM réelles, taille et empreinte. Les fichiers ont été décodés et contrôlés contre le silence. Cela ne constitue pas une certification humaine de prononciation. En cas de fichier indisponible, le moteur conserve son repli vocal existant.

## Vérification

Tests ciblés : 42 réussis sur les quatre fichiers du contrôle final. Vérification visuelle Playwright en arabe à 360×640, 390×844 et 1280×800 : accès de l’accueil visibles et touchables, manipulation 3/8, indice après erreur, réaction de réussite et résultat après le quiz ; aucun débordement horizontal ni erreur JavaScript. Les mouvements respectent prefers-reduced-motion.

Captures et rapports locaux : `C:/Users/Karim/.codex/visualizations/2026/11/05/01a1ac76-e238-7532-9072-bbec939fcfdb/` (`village-step3-*`, `pilot-discover-*`, `pilot-explore-*`, `pilot-hint-*`, `pilot-result-*`, `pilot-verification.json`).

Les résultats de la suite complète, du contrôle TypeScript et du build sont consignés après exécution ci-dessous.

## Reste

Étendre ce modèle après validation à d’autres cours et aux labos, puis enrichir le suivi parent (étapes suivantes du TODO). Le pilote ne constitue pas une refonte de tous les cours, du français ou du préscolaire. L’ouverture commerciale du village aux comptes gratuits n’est pas modifiée.

### Bilan de validation

- Suite complète : **2 548 tests réussis, 251 fichiers**, 408 secondes avec deux workers.
- Lecture Nova réelle confirmée dans Chromium, avec commande d’arrêt.
- Raccourcis arabe et maths contrôlés sur les écrans de cours réels. Le catalogue se remonte lors d’un changement de matière d’entrée pour éviter de garder sa sélection initiale derrière le village.
- Auto-évaluation : périmètre 3/4 couvert ; contenu et notation source conservés ; absence de débordement vérifiée sur trois formats ; extension à tous les cours et validation humaine des voix encore hors de ce lot.
- TypeScript : contrôle complet réussi via PowerShell.
- Build Vite/PWA : réussi. L’avertissement de taille de certains bundles reste présent ; il ne bloque pas le build. Ce lot ne prétend pas résoudre le découpage global de l’application.
