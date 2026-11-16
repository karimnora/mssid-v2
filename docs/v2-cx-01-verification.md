# CX-01 — Pile locale vérifiée le 16 novembre 2026

La V2 tourne sur **http://localhost:3002**, avec Spring profil `v2` et PostgreSQL `mssid_v2`. Les trois services sont sains. Les ports sont liés à `127.0.0.1` uniquement.

Les critères fonctionnels sont vérifiés. Karim a demandé le commit local de ce lot ; la relecture croisée de Claude n'est pas consignée dans ce compte rendu. Aucun push n'a été effectué.

## Travail réalisé

- `v2-demarrer.cmd` et `v2-arreter.cmd`, utilisables par double-clic. Le démarrage n'effectue ni build ni téléchargement automatique ; l'arrêt conserve le volume.
- Dockerfile backend réservé à la V2, avec compilation Java sans exécution de la suite complète. Le Dockerfile de production reste inchangé.
- Image de construction frontend Node 24 Alpine : les téléchargements de l'image Debian échouaient avec EOF. TypeScript et Vite ont ensuite réussi.
- Exclusion des dépendances Windows, fichiers générés, configurations locales et secrets du contexte Docker.
- Sonde de santé du serveur ; le site attend sa disponibilité.
- Configuration Nginx locale montée en lecture seule. Correction de `Unexpected token '<'` : `/_vercel/insights/script.js` recevait la page HTML de repli ; `/_vercel/` répond maintenant 204 dans la pile locale. Les scripts/styles absents répondent 404.

Le build des deux images a été explicitement autorisé par Karim pour CX-01. Cette exception ne vaut pas autorisation générale de lancer les builds des lots suivants.

Les résultats portent sur les images construites dans ce lot. Le site Docker n'a pas de rechargement des sources : les modifications de contenu réalisées en parallèle après ce build ne sont pas automatiquement intégrées. Les scripts de démarrage ne reconstruisent pas les images.

## Résultats réellement exécutés

| Vérification | Résultat |
|---|---|
| Configuration Compose et syntaxe Nginx | Valides |
| Compilation Java | Réussie, tests non exécutés par le build |
| TypeScript `tsc --noEmit`, Vite et génération PWA | Réussis |
| Migrations V100 à V108 demandées par CX-01 | Toutes réussies |
| Migrations supplémentaires présentes V109 à V111 | Réussies également |
| Démarrage sur une base neuve dédiée | 28 migrations réussies, schéma V111, serveur sain |
| Inscription de deux comptes fictifs par l'API réelle | Réussie |
| Compte administrateur et contrôle de santé de la base | Réussis |
| Génération d'un code P3M puis activation sur le compte famille | Réussie ; abonnement ACTIVE |
| Deux profils enfants ; progression enregistrée pour A, absente pour B | Vérifié |
| Cookies de session HttpOnly et reconnexion | Vérifiés |
| Connexion navigateur, choix du profil A, ouverture du carnet | Vérifiés sur la pile réelle, sans API simulée |
| Carnet : nom du profil A et une réussite de leçon cette semaine | Vérifiés |
| Requêtes API du parcours navigateur | Origine locale uniquement ; aucun appel V1 observé |
| Erreurs JavaScript après correction Nginx | Aucune dans le parcours vérifié |
| Arrêt et redémarrage par les deux scripts Windows | Réussis ; comptes, abonnement et progression conservés |

Les contrôles API initiaux comportent huit vérifications réussies. Les quatre vérifications de persistance ont été rejouées avec succès après arrêt/redémarrage, via le proxy du site sur le port 3002. Le contrôle navigateur a également réussi après redémarrage.

Le volume d'essais V2 préexistant a été conservé, sans copie de données V1 ni effacement. Il était au schéma V104 ; les migrations suivantes ont été appliquées au démarrage.

Le démarrage à vide a été testé séparément : après avoir vérifié son absence, la base `mssid_v2_cx01_fresh` a été créée dans le PostgreSQL local. Un conteneur du projet `mssid-v2-fresh-check`, sans port publié, a utilisé l'image backend déjà construite pour y appliquer toutes les migrations. La requête de contrôle renvoie `migrations = 28`, `all_successful = t`, `latest_version = 111`, et la sonde de santé du serveur a réussi. Ce conteneur de contrôle a ensuite été arrêté et retiré. La base de contrôle est conservée ; la base principale `mssid_v2` et ses comptes restent inchangés.

## Comptes, reproduction et pièces de relecture

- Administrateur fictif : `admin-v2@example.test`.
- Famille Premium fictive : `premium-v2@example.test`.
- Profils : `Test CX01 A` et `Test CX01 B`.
- Identifiants aléatoires locaux : `tmp/cx01-accounts.json` (ignoré par Git).
- Procédure de recréation : [v2-tests-isoles.md](v2-tests-isoles.md).
- Contrôles locaux reproductibles sur ce poste : `node tmp/cx01-smoke.mjs --verify-only` et `node tmp/cx01-browser.mjs`.
- Résultats locaux : `tmp/cx01-result.json` et `output/cx01/browser-result.json`.
- Captures : `output/cx01/carnet-parent.png` et `output/cx01/carnet-progression.png`.

Les fichiers sous `tmp/` et `output/` sont des pièces locales ignorées par Git. Les connexions répétées de test ont aussi déclenché la limite existante de cinq tentatives par quinze minutes ; cette limite n'a pas été modifiée.

Aucune suite complète, aucun hébergement, aucun APK distribué, aucun changement sur `main`, aucune modification des permissions système. La pile V2 est laissée démarrée pour les essais locaux et la relecture.
