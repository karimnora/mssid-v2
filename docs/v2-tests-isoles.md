# Tester la V2 sans modifier la V1

La branche `v2` est rebasée sur `main` (`d57f7a0`, version Android V1 1.0.11). Le checkout principal reste sur `main`. Le travail V2 se fait dans le worktree `v2-testing`. Les essais locaux restent indépendants des déploiements et de main.

## En local

1. Dans le worktree V2 : `docker compose -f backend/docker-compose.v2.yml up -d`. Ce projet utilise une base vide `mssid_v2`, le port 5433 et son propre volume. Ne pas utiliser le compose V1.
2. Lancer le backend avec Java 21 et Maven, profil `v2`, port 8081. Définir `V2_JWT_SECRET` avec une clé de test distincte d'au moins 32 caractères, puis `mvn spring-boot:run -Dspring-boot.run.profiles=v2` depuis `backend`. Le profil ignore `DATABASE_URL`, `DATABASE_USERNAME`, `DATABASE_PASSWORD` et `JWT_SECRET` de la V1. Les services emails/IA/Google/Sentry restent désactivés sans variables V2.
3. Depuis `frontend`, installer les dépendances avec Node 22.22.2+ ou 24.15+, puis `npm run dev:v2` : site sur http://localhost:3002, API sur http://localhost:8081/api. Utiliser un profil de navigateur de test et des comptes fictifs.
4. Vérifier inscription, connexion, profils enfants, changement d'enfant, progression, carnet parent, quiz et impressions. Contrôler que les requêtes du navigateur ciblent uniquement le backend de test.

## Prévisualisation sur Internet

- Garder Vercel Production Branch et le service Render V1 sur `main`.
- Utiliser un hébergement autorisant l’usage commercial, avec un site dédié à `v2`. Vercel Hobby ne convient pas au lancement payant. Créer un nouveau service backend avec `render-v2.yaml`, profil `prod,v2`.
- Créer une base PostgreSQL indépendante et vide, sans copie des données V1. Renseigner les trois variables `V2_DATABASE_*` et une nouvelle clé `V2_JWT_SECRET`.
- Frontend : `VITE_V2_SPRING_BOOT_URL=https://<backend-de-test>/api`. Les variables génériques V1 sont ignorées par le build V2 ; l'API publique V1 connue et localhost:8080 sont refusés.
- Backend : `V2_CORS_ALLOWED_ORIGINS` contient uniquement l'URL exacte du site de test et, pour Android, `https://localhost`. Avec deux domaines HTTPS, cookies Secure=true, SameSite=None.
- Google est facultatif : créer un client OAuth web de test, puis fournir `VITE_V2_GOOGLE_CLIENT_ID` et `V2_GOOGLE_OAUTH_CLIENT_ID` identiques. Aucune clé IA/email de production.
- Vérifier ces réglages dans les tableaux de bord AVANT le premier push. Les configurations externes n'ont pas été modifiées par ce travail.

## Android à côté de la V1

Le type de build `beta` utilise `dz.mssid.app.beta`, le nom « Mssid V2 (test) » et la clé debug. Il n'écrase pas l'application Play Store.

1. Fournir `VITE_V2_SPRING_BOOT_URL` vers le backend HTTPS de test. `npm run cap:sync:beta` refuse une API de production connue, une URL manquante ou localhost.
2. Dans `frontend/android`, `./gradlew assembleBeta` (Windows : `./gradlew.bat assembleBeta`) avec SDK Android et Java 21.
3. Installer `app/build/outputs/apk/beta/app-beta.apk`. Le Google Sign-In Android exige son propre client pour `dz.mssid.app.beta` et l'empreinte de la clé debug.

Ne pas créer de tag `v*` pour la V2. Le workflow release et son script de build sont désactivés sur cette branche. Après push et configuration de la variable Actions `VITE_V2_SPRING_BOOT_URL`, lancer manuellement « Android V2 Beta Build » sur `v2` pour récupérer un APK signé debug ; aucun secret de signature de production n’est utilisé. Ne pas publier cette bêta sur la fiche Play Store V1.

Le backend V2 refuse aussi le profil `prod` seul avant le démarrage des migrations ; il faut un service distinct avec `prod,v2`. Cette protection ne remplace pas la vérification des réglages de déploiement.

Les tests automatisés frontend utilisent des API simulées ; un essai réel avec le backend/base séparés reste indispensable avant de distribuer la bêta.

## Pile complète locale et CI

### Scripts Windows (CX-01)

- `v2-demarrer.cmd` : démarre uniquement les images V2 déjà présentes, puis attend leur démarrage. Aucun build ni téléchargement automatique. Le site est accessible sur http://localhost:3002.
- `v2-arreter.cmd` : arrête uniquement le projet `mssid-v2-stack`, sans `-v`. Les comptes fictifs et le volume PostgreSQL sont conservés.
- Les scripts utilisent leur propre dossier : ils peuvent être lancés par double-clic ou depuis un autre répertoire.

**État vérifié le 16 novembre 2026 :** les deux images locales sont construites et la pile fonctionne sur http://localhost:3002. Karim a explicitement autorisé ce build pour CX-01, en exception à la règle « pas de build avant CX-23 ». Les migrations V100 à V111 sont réussies. L'inscription, l'activation Premium, les profils enfants, la progression et le carnet ont été contrôlés sur la vraie pile. L'arrêt/redémarrage conserve les comptes et leurs données. Voir [le compte rendu CX-01](v2-cx-01-verification.md). Le commit local a ensuite été demandé par Karim ; la relecture croisée de Claude n'est pas consignée dans ce compte rendu.

La pile utilise `backend/Dockerfile.v2`, qui compile sans lancer la suite backend (`-DskipTests`). Le Dockerfile de production est inchangé. Après autorisation du build local, la préparation des images se fait séparément avec `docker compose --env-file .env.v2.local -f compose.v2.yml build backend web`, puis le double-clic sur `v2-demarrer.cmd` démarre la pile.

La configuration Nginx locale est montée en lecture seule depuis `frontend/nginx.v2.conf`. Vercel Analytics est inactif dans cette pile (`/_vercel/` répond 204) ; un script ou un style absent répond 404 au lieu de recevoir la page HTML. Les deux comptes de test créés sont `admin-v2@example.test` et `premium-v2@example.test`. Leurs mots de passe aléatoires sont dans `tmp/cx01-accounts.json`, ignoré par Git ; les scripts démarrer/arrêter ne les modifient pas.

### Recréer les comptes fictifs, une fois la pile opérationnelle

1. Sur http://localhost:3002, inscrire `admin-v2@example.test` et `premium-v2@example.test`, avec des mots de passe réservés aux tests. Les comptes ne sont pas précréés par les scripts.
2. Depuis la racine du worktree V2, promouvoir uniquement le compte fictif administrateur dans la base locale :

   ```powershell
   docker compose --env-file .env.v2.local -f compose.v2.yml exec -T postgres psql -U postgres -d mssid_v2 -v ON_ERROR_STOP=1 -c "BEGIN; INSERT INTO roles(name) VALUES ('ROLE_ADMIN') ON CONFLICT(name) DO NOTHING; UPDATE users SET role_id = (SELECT id FROM roles WHERE name = 'ROLE_ADMIN') WHERE email = 'admin-v2@example.test'; COMMIT;"
   ```

   Vérifier que le résultat est `UPDATE 1`, puis reconnecter le compte administrateur.
3. Dans l'administration locale, générer un code d'activation de test. Se connecter avec `premium-v2@example.test`, saisir ce code et vérifier le statut Premium. Cette étape vérifie le vrai parcours d'activation, sans paiement ni modification manuelle de l'abonnement.
4. Créer deux profils enfants fictifs, enregistrer une progression, changer de profil puis revenir au premier. Contrôler la progression et le carnet parent après reconnexion et après arrêt/redémarrage de la pile.
5. Vérifier les migrations avec la commande ci-dessous : les versions `100` à `108` doivent toutes apparaître avec `success = t`.

   ```powershell
   docker compose --env-file .env.v2.local -f compose.v2.yml exec -T postgres psql -U postgres -d mssid_v2 -v ON_ERROR_STOP=1 -c "SELECT version, description, success FROM flyway_schema_history WHERE version IN ('100','101','102','103','104','105','106','107','108') ORDER BY installed_rank;"
   ```

Ces étapes permettent de reproduire les essais sur une autre base V2. Les résultats réellement exécutés sur ce poste sont dans le compte rendu CX-01 ; le volume d'essais V2 préexistant a été conservé, sans remise à zéro. Un démarrage à vide a aussi été vérifié dans la base distincte `mssid_v2_cx01_fresh` : 28 migrations réussies jusqu'à V111, serveur sain, puis arrêt du conteneur de contrôle sans effacer les bases.

`compose.v2.yml` lance un site Nginx, le backend Spring et PostgreSQL avec leur propre volume. Le site local http://localhost:3002 passe ses requêtes /api au backend de la pile : connexion et cookies utilisent ainsi la même origine. Les ports sont limités au PC local. Cette configuration HTTP ne doit pas être exposée directement sur Internet.

Copier `.env.v2.example` vers `.env.v2.local` puis remplacer les deux valeurs par des secrets aléatoires. Ce fichier est ignoré par Git. Préparer les images par un build uniquement quand celui-ci est autorisé, puis utiliser `v2-demarrer.cmd`. Arrêter le serveur de développement 3002 et tout ancien PostgreSQL V2 5433 avant de lancer la pile. Ne pas lancer les deux fichiers Compose en même temps.

Arrêt sans perte des comptes fictifs : `docker compose --env-file .env.v2.local -f compose.v2.yml down`. Ne pas ajouter `-v` sauf si l’on veut explicitement effacer les données de test.

Sur chaque push, GitHub vérifie les types et tests frontend, les scénarios navigateur, et la suite backend avec profil V2 contre une vraie base éphémère mssid_v2. Aucun secret de production n’est utilisé. La construction de l’APK bêta reste manuelle et nécessite l’URL HTTPS d’un backend V2 réellement déployé.
