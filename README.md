# 🇩🇿 Mssid DZ (مَسِيد) — Guide de Développement & Tests

> **Plateforme Éducative du Programme Primaire Algérien (1AP - 5AP)**  
> **Frontend:** React 18, Vite, TypeScript, Tailwind CSS, Lucide Icons  
> **Backend Service Proxy:** Node.js, Express, Gemini 3.6 AI Proxy  
> **Backend Enterprise (Optionnel):** Java 21, Spring Boot, Spring Security JWT, JPA  

---

## 📋 Table des Matières

1. [Structure du Projet](#-structure-du-projet)
2. [Prérequis Système](#-prérequis-système)
3. [Configuration des Variables d'Environnement](#-configuration-des-variables-denvironnement)
4. [Lancement en Mode Développement (Dev Mode)](#-lancement-en-mode-développement-dev-mode)
   - [Méthode 1 : Frontend Unifié (React + Proxy Express)](#méthode-1--frontend-unifié-react--proxy-express-recommandé)
   - [Méthode 2 : Backend Spring Boot (Java)](#méthode-2--lancement-du-backend-spring-boot-java)
5. [Guide des Tests en Local (Frontend & Backend)](#-guide-des-tests-en-local)
   - [Tests Frontend (TypeScript & Vitest)](#1-tests-du-frontend)
   - [Tests Backend (JUnit 5 & Spring Boot)](#2-tests-du-backend-spring-boot)
6. [Compilation & Production Build](#-compilation--production-build)
7. [Application Mobile Android (.APK / .AAB)](#7-application-mobile-android)

---

## 📁 Structure du Projet

```text
mssid-dz/
├── frontend/                 # Frontend React actif (Vite, TypeScript, Tailwind, Capacitor)
│   ├── src/
│   │   ├── components/       # Composants UI (LessonViewer, Soroban, AiTutorModal, preschool/, etc.)
│   │   ├── data/              # Données des cours (1AP à 5AP)
│   │   ├── locales/           # Traductions ar / fr / en / ber
│   │   └── App.tsx            # Composant Racine React
│   ├── server.ts              # Serveur Express Node.js (Proxy API Gemini + Static File Server)
│   ├── .env.example           # Modèle des variables d'environnement du frontend
│   └── package.json           # Dépendances Frontend / Express & Scripts
├── backend/                  # Application Spring Boot Java 21 (Maven)
│   ├── src/main/java/        # Contrôleurs REST, Services, Entités JPA, Security
│   ├── src/test/java/        # Tests Unitaires et d'Intégration JUnit
│   └── pom.xml               # Configuration Maven
├── _archive/                 # Code historique conservé pour référence, non maintenu (voir son README)
└── DOCUMENTATION.md          # Spécifications d'Architecture Complètes
```

> ℹ️ Le projet ne comporte qu'un seul frontend actif : `frontend/`. Un scaffold initial généré par
> Google AI Studio existait auparavant à la racine (`src/`, `server.ts`, etc.) ; il a été déplacé
> vers `_archive/legacy-ai-studio-prototype/` car il n'était plus maintenu depuis le tout premier
> commit du projet et exposait un faux backend non sécurisé (mots de passe en clair, JWT non
> signé). Voir le README de ce dossier pour le détail.

---

## ⚙️ Prérequis Système

* **Node.js :** v18.x ou supérieur (v20+ recommandé)
* **npm :** v9.x ou supérieur
* **Java SDK :** Java 21 OpenJDK (Pour exécuter le backend Spring Boot)
* **Maven :** Wrapper `./mvnw` inclus dans le dossier `backend/`

---

## 🔐 Configuration des Variables d'Environnement

Créez un fichier `.env` dans `frontend/` en vous basant sur `frontend/.env.example` :

```bash
cd frontend
cp .env.example .env
```

Contenu recommandé du fichier `.env` :

```env
# Clé API Google Gemini (Serveur)
GEMINI_API_KEY=votre_cle_gemini_api_ici

# Port du serveur Express (Hardcodé à 3000 dans Cloud Run)
PORT=3000

# URL du Backend Spring Boot (en local)
VITE_SPRING_BOOT_URL=http://localhost:8080/api
```

---

## 🚀 Lancement en Mode Développement (Dev Mode)

### Méthode 1 : Frontend Unifié (React + Proxy Express) (Recommandé)

Cette méthode lance le serveur unifié Node.js/Express avec le middleware Vite HMR sur le port **3000**. Elle prend en charge la livraison de l'application React et expose l'API proxy `/api/gemini/explain` pour le tuteur IA.

```bash
cd frontend
npm install
npm run dev
```

📍 **URL d'accès :** `http://localhost:3000`

---

### Méthode 2 : Lancement du Backend Spring Boot (Java)

Pour exécuter le serveur API REST Spring Boot indépendant (Gestion des utilisateurs, authentification JWT, paiements BaridiMob) :

```bash
cd backend

# Sous Linux / macOS :
./mvnw spring-boot:run

# Sous Windows (CMD / PowerShell) :
mvnw.cmd spring-boot:run
```

📍 **URL de l'API REST Backend :** `http://localhost:8080/api`  
📍 **Console H2 Database (Dev) :** `http://localhost:8080/h2-console`

---

## 🧪 Guide des Tests en Local

### 1. Tests du Frontend

#### A. Vérification de la Conformité des Types TypeScript
Vérifiez qu'il n'y a aucune erreur de typage dans le code React/TypeScript :

```bash
npm run lint
```

#### B. Exécution des Tests Unitaires & Composants (Vitest + React Testing Library)
Lancez la suite de tests automatisée Vitest pour le Frontend :

```bash
# Exécution rapide une seule fois (CI Mode)
npm run test

# Exécution en mode Watch (Relance automatique à la modification des fichiers)
npx vitest

# Génération du rapport de couverture de code
npx vitest --coverage
```

---

### 2. Tests du Backend Spring Boot

Les tests unitaires et d'intégration du Backend Java utilisent **JUnit 5**, **Spring Boot Test** et **MockMvc**.

```bash
cd backend

# Lancer la suite de tests JUnit 5 complète
./mvnw test

# Lancer une classe de test spécifique
./mvnw test -Dtest=UserControllerTest

# Exécuter les tests avec génération du rapport de couverture Jacoco
./mvnw verify
```

---

## 🛠️ Compilation & Production Build

### 1. Build du Frontend & Serveur Express Proxy
Compile les fichiers React optimisés dans `dist/` et génère le fichier `dist/server.cjs` pour Node.js :

```bash
cd frontend
npm run build
```

Pour tester le build de production en local :

```bash
npm run start
```

---

### 2. Build du JAR Executable Spring Boot
Génère le package binaire `.jar` prêt à être déployé sur un serveur de production Java :

```bash
cd backend
./mvnw clean package -DskipTests
```

Le fichier JAR généré se trouve dans : `backend/target/education-0.0.1-SNAPSHOT.jar`

En local, pour des logs SQL/DEBUG : `SPRING_PROFILES_ACTIVE=dev` (voir `backend/src/main/resources/application-dev.properties`). Render pose `SPRING_PROFILES_ACTIVE=prod`.

---

## 🔐 Checklist mise en production (P0)

Vérifier **sur les dashboards** (pas seulement dans git) :

1. **CORS** — Render `CORS_ALLOWED_ORIGINS` = `https://mssid-dz.com,https://www.mssid-dz.com,https://localhost` (Capacitor). Tester un preflight `OPTIONS` depuis le site réel : pas de 403.
2. **Cookies** — `COOKIE_SECURE=true`, `COOKIE_SAME_SITE=None` si le front (Vercel) et l’API (Render) sont sur des domaines différents.
3. **JWT** — `JWT_SECRET` défini, ≥ 32 octets. Générer : `openssl rand -base64 32`. Ne jamais laisser le défaut du dépôt.
4. **Front** — `VITE_SPRING_BOOT_URL=https://mssid-backend.onrender.com/api` (ou le domaine API définitif) **au build** Vercel / Capacitor.
5. **Clés** — `GEMINI_API_KEY`, `RESEND_API_KEY`, `DATABASE_*` renseignés. Logs : profil `prod` (pas de `show-sql` / Security DEBUG).

### Sauvegardes Neon (PITR) et restauration

Neon ne se configure pas dans ce dépôt. À faire **une fois** dans [console.neon.tech](https://console.neon.tech) sur le projet prod :

1. Project → **Backups** / **Point-in-time restore** : activer PITR (plan qui le permet).
2. Noter la fenêtre de rétention (souvent 7 jours sur les plans payants ; le free tier peut n’offrir qu’un restore limité — vérifier le plan actuel).
3. **Test restore** : restaurer vers une branche jetable, `SELECT count(*) FROM users;`, puis supprimer la branche. Sans ce test, on n’a pas de restauration.
4. Après incident : restore PITR à l’horodatage voulu → mettre à jour `DATABASE_URL` Render vers la branche restaurée **ou** promouvoir la branche, puis redémarrer le service `mssid-backend`.
5. Rollback appli : Render → service → **Rollback** vers l’image Docker précédente ; Vercel → Deployment → Promote previous.

Le cron GitHub `keep-backend-awake.yml` ping `https://mssid-backend.onrender.com/api/health` pour limiter le sleep free-tier ; ce n’est pas une sauvegarde.

---

## 📱 7. Application Mobile Android (.APK / .AAB)

L'application **Mssid DZ** est configurée avec **Capacitor** pour être compilée sous forme d'application native Android pour le Google Play Store.

```bash
cd frontend

# 1. Compiler la version web React
npm run build

# 2. Synchroniser avec le projet Android Capacitor
npm run cap:sync

# 3. Ouvrir dans Android Studio pour exécuter ou générer le bundle Signed AAB / APK
npm run cap:open
```

👉 **Consultez le guide détaillé :** [`ANDROID_BUILD_GUIDE.md`](./ANDROID_BUILD_GUIDE.md)

---

## 📚 Documentation Complète & Références

Pour consulter les diagrammes d'architecture, les schémas de base de données, la matrice des endpoints API REST et la politique de confidentialité :
👉 Consultez le fichier **[`DOCUMENTATION.md`](./DOCUMENTATION.md)** à la racine.
