# Préparation du test familles et moteurs isolés

Travail local sur `v2`, après `8a357df`. Aucun nouvel enregistrement, appel payant, changement de contenu des cours ni branche de production. Les dix extensions ont été validées par Karim le 7 novembre 2026 ; elles ne seront appliquées qu’après les retours des familles.

## 1. Chargement et voix

- Préchargement PWA : environ 95 376 Kio avant, 12 648 Kio après. Le code des cours et les interfaces restent préchargés ; les images, fontes et sons sont maintenant mis en cache à la demande. Un média jamais utilisé n’est donc pas promis hors ligne. Cache limité à 300 entrées / 30 jours, ressources statiques locales uniquement ; les règles existantes des API privées ne sont pas élargies.
- Les huit petits animaux ont des dérivés WebP de 192×192, adaptés à leurs tailles d’affichage (60 à 110 px), avec originaux conservés : 314 122 -> 128 920 octets. Images secondaires en priorité faible, décodage asynchrone ; décor principal en priorité haute.
- Didou ne précharge plus les six répliques de l’accueil. Au plus une réplique probable suivante est préparée, en plus de la lecture courante ; pas de préchargement spéculatif avec économie de données ou connexion annoncée lente. Aucun son téléchargé avant interaction à cet accueil.
- Arrêt synchrone de la lecture précédente au nouveau geste, nettoyage des délais et arrêt à la sourdine, à la sortie et au masquage de l’onglet. Délai d’attente de démarrage borné à 15 secondes, retour lisible et réécoute explicite ; pas de reprise automatique de l’ancienne présentation après retour sur l’onglet.
- Le bouton de réécoute reste à côté de l’entrée du lieu, avec un libellé court, un nom accessible complet et une cible de 60 px. Il ne s’ajoute pas pendant la visite guidée.

Mesure reproductible : depuis `frontend`, `node scripts/measure-village-performance.cjs <rapport.json>`, avec le build servi localement au port 3004. Chromium 390×844, CPU ×4, débit 1,6 Mbit/s et latence 300 ms, API simulée, service worker bloqué. C’est une simulation locale sur Vite preview, pas une mesure sur un téléphone Android physique ni une garantie de délai en production. Mesures indicatives (un passage initial et contrôle final, pas une étude statistique) : bouton d’accueil visible en 7436 ms avant / 7341 ms après ; première voix 4750 / 3626 ms ; réécoute déjà chargée 47 ms. Lecture précédente en pause dans le même geste (gestionnaire 4.1 ms). Pas de gain démontré sur le premier affichage ; Android réel reste requis.

## 2. Audit réel 5AP et dix leçons

Commande : depuis `frontend`, `node node_modules/tsx/dist/cli.mjs scripts/audit-5ap.ts`. Le script importe le catalogue publié après ses transformations existantes, sans modifier les cours ni appeler une API. Résultats : [inventaire lisible et liste validée](../audit-5ap/README.md), [JSON et empreinte du catalogue](../audit-5ap/audit.json).

107 leçons, dix matières. Parmi les avertissements de provenance : 11 leçons sans référence et 25 avec une source secondaire. Quatre cours renseignent aussi un trimestre alors que leur note le dit non confirmé. Aucune règle vide ou QCM à plusieurs bonnes réponses détecté par ces contrôles structurels ; cela ne valide pas la justesse pédagogique de toutes les réponses. L’inventaire audio porte sur des correspondances exactes de textes, pas sur une écoute humaine ni la garantie qu’un enregistrement existe pour chaque phrase possible.

La comparaison officielle reste partielle : axes mathématiques rapprochés d’une copie identifiée du document ministériel de 2016, pages indiquées ; autres matières et programmes de langues actualisés non vérifiés dans ce lot. Le document mentionne le milliard page 68 mais le million page 73 ; arbitrage documentaire et relecture enseignante nécessaires. Les rapprochements lexicaux ne sont jamais présentés comme une certification de conformité.

La sélection validée : grands nombres, décimaux, opérations, division, proportionnalité, pourcentages/échelles, périmètres/aires, durées, structure de la phrase et production écrite. Le pilote fractions existe déjà et reste distinct de ces dix futures extensions.

## 3. Trois moteurs, aucune leçon raccordée

Page séparée : `/manipulations.html`, en développement comme dans le build. Elle ne monte ni l’application, ni son authentification, ni la progression. Aucun appel d’API, stockage de résultat, point ou note ; l’avertissement de démonstration est visible.

- `NumberLine` : toucher pour placer, secours +/−, pas décimal et bornes contrôlés.
- `PlaceValueTable` : familles des milliards aux millièmes ; calcul exact en millièmes entiers (`BigInt`), sans dérive flottante ; plafond d’un milliard inclus, retenues et passages d’une famille à l’autre visibles.
- `TwoColumnProblem` : solution à gauche, opérations à droite, exemple fictif en dinars. Une erreur conserve la saisie et peut être corrigée.

Les composants sont réutilisables et isolés dans `components/manipulations/`. Cette page sert à la revue technique et pédagogique. Son habillage de démonstration n’est pas une nouvelle leçon Premium et son exemple n’est pas ajouté au programme.

## 4. Défauts connus côté parent

- Petits textes du paiement et de la protection parent portés à 16 px minimum ; sortie de la protection avec une cible de 60 px.
- Un seul défi parent dans un parcours continu : autorisation locale au composant, quinze minutes maximum, non persistée. Fermer puis rouvrir recrée la protection. Aucun prix affiché avant le défi dans le chemin normal.
- Nouvelles demandes de reçus et nouveaux lots de codes : seulement `P3M` / `P12M`. `P6M` refusé côté serveur pour les nouvelles ventes. Les reçus P6M déjà déposés gardent leurs six mois à l’approbation ; les codes déjà émis ne sont pas modifiés. Tarifs 900 / 2 400 DA conservés.

## 5. Régénération reproductible de la vitrine

Depuis `frontend` : `node scripts/regenerate-premium-showcase.cjs <dossier-de-relecture>` ; `CAPTURE_BASE_URL` peut désigner un autre port local. Le script refuse les hôtes distants et les sorties directes dans les assets. Il importe la vraie leçon, utilise un contexte navigateur neuf, un profil fictif, une date fixe, des API simulées et le bouton distinct de démonstration.

Il parcourt réellement les gestes, l’aide et le bilan protégé, vérifie l’isolation de la progression, exporte cinq WebP, les PNG et une page de relecture. Manifeste avec empreintes des fichiers et de la leçon. En cas de changement du parcours, une assertion arrête le script plutôt que de fabriquer une capture. Les cinq WebP doivent être relus avant remplacement des assets ; aucun remplacement automatique ni publication dans ce lot.

Les dérivés des animaux sont reproductibles avec `python scripts/optimize-village-creatures.py` (Pillow requis pour cet outil de préparation uniquement, pas de dépendance applicative ajoutée).

## Vérifications et limites

- Suite frontend complète : 260 fichiers / 2 578 tests réussis, puis 4 fichiers / 33 tests ciblés après les dernières finitions de réécoute, continuité d’image, virgule décimale et typographie parent. TypeScript et build final réussis.
- Backend : 266 tests réussis hors `EducationApplicationTests`. Les deux intégrations nécessitant PostgreSQL local restent à exécuter dans un environnement équipé ; elles ne sont pas déclarées réussies.
- Chromium arabe 390×844 et 1280×800 : trois moteurs, report de retenue, correction d’erreur, colonnes officielles, cibles de 60 px, aucun débordement ni écriture de progression. Réécoute également contrôlée en 360×640.
- Cache réel du service worker : démonstration et image de Didou déjà visitées utilisables après passage hors ligne ; aucune API dans le cache média. Ce contrôle ne prouve pas que toutes les activités inédites fonctionnent hors ligne.
- Script des cinq captures exécuté avec succès sur le profil fictif, sans modification des résultats de l’enfant.

Restent avant le panel : Android physique, vérification après déploiement conjoint, formalités de participation/données et relecture pédagogique. Restent pour l’audit : comparaison officielle détaillée des autres matières et références actualisées. Aucun moteur ne sera appliqué aux dix leçons avant les retours des familles.
