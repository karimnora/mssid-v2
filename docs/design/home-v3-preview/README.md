# Village de Didou — accueil connecté V2, 6 novembre 2026

## État livré

Le modèle approuvé est raccordé à l'accueil arabe du parcours Didou. L'accueil Premium en mode monde l'ouvre automatiquement ; le retour classique et le choix de design restent disponibles. Les comptes gratuits gardent leurs accès existants, avec les mêmes restrictions. Le préscolaire et l'accueil français conservent leurs interfaces actuelles.

`frontend/design-accueil.html` reste une démonstration indépendante. Pour utiliser les vrais profils, ouvrir l'application ou `/journey?g=…`, pas cette page de démonstration. Aucun profil fictif ni progression de démonstration n'est ajouté à l'application.

## Profil et pédagogie

- Classe issue de la navigation et du profil existants, de 1AP à 5AP ; nom du profil actif.
- Compteur : uniquement les leçons publiées de cette classe dont le quiz est entièrement validé ; pas les simples ouvertures, ni les anciennes leçons retirées, ni celles des autres classes. Chargement distinct de zéro et absence de catalogue.
- « دروسي » ouvre la progression, la mission du jour, la prochaine étape, la carte et le catalogue complet. Le bouton de reprise respecte les étapes existantes ; si la prochaine étape est un trésor, il ouvre la carte. Pas de reprise proposée quand le parcours est terminé ou indisponible.
- Mission existante : priorité à une compétence à revoir, puis une leçon interrompue, puis une prochaine leçon. Son stockage est désormais identifié par compte + enfant + classe + date, plutôt que par prénom.
- Histoires vers les cours, atelier vers le catalogue des labos, jeux vers les défis/jeux : callbacks réels de navigation, sans classe 2AP codée en dur dans le mode connecté, sans rechargement ni perte des gardes d'accès.
- Menu de toutes les activités conservé : matières, examens, reprise, labos disponibles pour la classe, profil, carnet parent et réglages. Plan de révision conservé lorsqu'il est activé.
- Remontage du parcours lors d'un changement de compte/enfant/classe : arrêt audio et remise à zéro des réactions temporaires. Données pédagogiques, XP et règles de validation conservés.

## Graphisme, mouvement, voix

Village imaginaire algérien, trois lieux, Didou de référence orange au foulard vert et étoile rouge. Police Cairo et phrases courtes. Actions principales visibles dès 360×640. Les bâtiments ont une cible étendue au-dessus de leur carte.

Sources image_gen : exec-cca34a02-6cce-4edc-aed0-3e1dbc3d2d1b.png (paysage), exec-5ac8d01a-efbc-47e4-8820-2104c3e32378.png (portrait), exec-712c1cd5-c834-4bd9-b26c-391e8320a262.png (trois poses), exec-c49eaf4d-acd2-4eb6-821e-c7e69e544e93.png (quatre animaux, deux états chacun). Découpe selon les vides, alpha contrôlé, WebP importés et hachés par Vite. Décors inférieurs à 250 Ko ; huit animaux 320 px totalisent 314 122 octets.

Papillon, abeille, oiseau et coccinelle : cibles fixes, ailes et déplacement internes en transform/opacity. Découvertes réelles de session 0–4, reprise volontaire ; aucun point pédagogique attribué pour ces clics. Didou respire, indique et célèbre. Préférence de mouvement réduit prise en compte immédiatement, y compris en cours de page. Pas d'animation 3D articulée ni de synchronisation labiale revendiquée.

Six MP3 Nova, interprétation A choisie par Karim, générés une seule fois puis compressés et réutilisés. Aucun appel OpenAI au clic ni génération du prénom. Accueil puis trois lieux, fin sans boucle, interruption propre, une seule voix simultanée. Réglage du son partagé avec la carte et mémorisé sur l'appareil. Les 399 autres voix restent distinctes.

La feuille de style du village est maintenant limitée à son composant ; elle ne modifie plus body, les boutons ni les liens du reste de l'application.

## Vérifications

Tests ciblés : 25 réussis (voix, interruptions, compteur par classe, destinations connectées, mission, progression du parcours). TypeScript réussi après intégration.

Chromium dans l'application, API et comptes simulés : 1AP en 360×640, 2AP en 390×844, 5AP en 1280×800. Classes et dénominateurs réels 57/61/107, mission adaptée, carte ouverte effectivement dans chaque classe, aucune erreur JavaScript. Largeur du panneau de progression corrigée après le premier contrôle. Référence locale : `home-connected-verification.json` et captures `accueil-connecte-*.png`, `progression-connectee-*.png` dans les artefacts de la session.

Contrôle des quatre animaux et de la remise à zéro en 390×844 et 1280×800 : mouvement mesuré, cibles au moins 60×60 et atteignables, arrêt en mode réduit, pas de débordement ni erreur JS. Rapport `accueil-v3-garden-verification.json`.

Suite complète et build : résultat final consigné ci-dessous après exécution. La refonte du préscolaire, les missions entièrement vocalisées et un Didou articulé restent des lots distincts.


### Séparation jeux / examens demandée par Karim

Le jardin garde sa destination jeux/défis ; « امتحاناتي » est une action distincte dans le panneau « دروسي », vers le catalogue d'examens de la classe. Le menu global a deux groupes séparés : « ألعب وأتدرّب » et « أقيّم تعلّمي ». La carte de quiz d'entraînement « اختبار سريع » devient « تحدٍّ سريع » avec la couleur des défis pour éviter la confusion avec les examens. Aucune question, correction, note ni règle de jeu n'est modifiée. Un test vérifie que l'action examens n'appelle jamais l'action jeux.


### Vérification finale du raccordement

Les cinq classes sont vérifiées dans Chromium avec API simulée : 1AP 57 leçons publiées, 2AP 61, 3AP 78, 4AP 86, 5AP 107 au moment du contrôle. Reprise dans une vraie leçon et carte effectivement ouverte pour chacune. En 1AP, une nouvelle validation met immédiatement le compteur à 1/57 et change la prochaine étape. En 2AP : destinations labos/jeux/examens, persistance du son et retour classique vérifiés. Cibles principales accessibles, panneau dans le viewport, aucune erreur JS. Les notifications de nouveaux badges sont neutralisées dans les fixtures de ce parcours ; le système de badges reste inchangé. Rapport : `home-final-verification.json`, captures `village-final-{classe}-{largeur}.png` dans les artefacts locaux.

TypeScript réussi. Build Vite/PWA réussi : 1 962 entrées précachées. Le premier contrôle complet a exécuté 250 fichiers : 2 533 tests réussis, un délai dépassé dans l'ancien test de sortie de quiz de LessonViewer. Le test attend désormais explicitement le panneau animé (4 s maximum au lieu d'une attente implicite de 1 s), sans modifier la leçon ni les assertions de protection de sortie. Les 41 contrôles ciblés repassent ; une seconde suite complète est lancée après les derniers changements.


Seconde suite complète réussie après corrections : 250 fichiers, 2 535 tests (Vitest, deux workers, pool threads ; 710,82 s). Aucun échec. La configuration partagée conserve sa limite de deux workers ; seul le test de montage du panneau a reçu l'attente explicite décrite plus haut. Aucun test ni règle pédagogique n'a été supprimé.

Contrôle final sur les fichiers livrés : TypeScript réussi, build Vite/PWA réussi (51,60 s, 1 962 entrées précachées), y compris l’icône et la couleur distinctes des examens. Commit et push limités à v2 ; résultat du déploiement distant à confirmer sur Vercel.
