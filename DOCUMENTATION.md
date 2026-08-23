# 📘 Documentation Technique, Architecture & Schémas — Mssid DZ (مَسِيد)

> **Document d'Architecture Système, Base de Données & Guide de Transmission**  
> **Auteur :** Lead Software Architect  
> **Projet :** Mssid DZ (مَسِيد) — Plateforme Éducative du Programme Primaire Algérien  
> **Version Système :** v1.0.4  

---

## 📋 Table des Matières

1. [Présentation du projet & Matrice des Rôles (RBAC)](#1-présentation-du-projet--matrice-des-rôles-rbac)
2. [Schémas d'Architecture Système Full-Stack & Spring Boot](#2-schémas-darchitecture-système-full-stack--spring-boot)
3. [Schémas de Flux de Fonctionnement (Diagrammes de Séquence)](#3-schémas-de-flux-de-fonctionnement-diagrammes-de-séquence)
4. [Modèle de Données & Tables de la Base de Données](#4-modèle-de-données--tables-de-la-base-de-données)
5. [Matrice des Endpoints API RESTful](#5-matrice-des-endpoints-api-restful)
6. [Guide : Ajouter une nouvelle matière](#6-guide--ajouter-une-nouvelle-matière)
7. [Guide : Ajouter une nouvelle année scolaire](#7-guide--ajouter-une-nouvelle-année-scolaire)
8. [Guide : Ajouter un cours](#8-guide--ajouter-un-cours)
9. [Guide : Ajouter un examen officiel (Annales 5AP)](#9-guide--ajouter-un-examen-officiel-annales-5ap)
10. [Guide : Ajouter un mini-jeu / Outil interactif](#10-guide--ajouter-un-mini-jeu--outil-interactif)
11. [Système de Gamification & Formules d'XP](#11-système-de-gamification--formules-dxp)
12. [Back-Office CMS & Machine à États Pédagogique](#12-back-office-cms--machine-à-états-pédagogique)
13. [Spécifications du Backend Spring Boot (JPA & JWT)](#13-spécifications-du-backend-spring-boot-jpa--jwt)
14. [Guide Développeur, Build & Déploiement Cloud Run](#14-guide-développeur-build--déploiement-cloud-run)
15. [FAQ Technique Développeur](#15-faq-technique-développeur)
16. [Système de Rate-Limiting & Caching des Requêtes IA Gemini](#16-système-de-rate-limiting--caching-des-requêtes-ia-gemini-cache-in-memory--quotas-par-rôle)
17. [Guide de Publication Google Play Store & Android App Bundle (.aab)](#17-guide-de-publication-google-play-store--android-app-bundle-aab)

---

## 1. Présentation du projet & Matrice des Rôles (RBAC)

### 1.1 Context et Objectifs
**Mssid DZ (مَسِيد)** est une plateforme éducative web full-stack dédiée aux élèves du primaire en Algérie (de la **1AP** à la **5AP**). Elle numérise le programme officiel de l'Éducation Nationale avec des outils interactifs (Soroban, Convertisseur de mesures, Explorateur géométrique 2D/3D), un tuteur IA basé sur Gemini 3.6 Flash, et un système de vérification des reçus de paiement **BaridiMob / Edahabia**.

### 1.2 Matrice des Rôles Utilisateurs & Droits (RBAC)

| Rôle (`UserRole`) | Droits & Portée d'Accès | Méthode d'Authentification | Périmètre d'Action |
| :--- | :--- | :--- | :--- |
| **`ROLE_FREE`** | Accès gratuit aux leçons de base, outils interactifs et 3 requêtes IA/jour. | Connexion Simple / Invité | Consultation des cours, exercices Soroban, quiz et profil élève. |
| **`ROLE_PREMIUM`** | Accès illimité aux sujets d'examens (Annales 2008-2026), corrigés détaillés et tuteur IA illimité. | Email + Mot de passe ou validation reçu BaridiMob | Téléchargement des annales, accès aux examens blancs chronométrés. |
| **`ROLE_TEACHER`** | Accès au Back-Office CMS pour rédiger, éditer des cours et créer des exercices. | Compte Enseignant certifié | Édition du programme, soumission de leçons en statut `review`. |
| **`ROLE_ADMIN`** | Contrôle total du système, validation des reçus de paiement BaridiMob et publication CMS. | JWT Admin Authentifié | Validation des paiements CCP/BaridiMob, publication CMS, audit système. |

### 1.3 Tableau des Modules Pédagogiques

| Module | Emplacement Code | Description & Rendu |
| :--- | :--- | :--- |
| **تصريف الأفعال العربية** | `src/components/ArabicConjugator.tsx` | تصريف تفاعلي ممتع للأفعال العربية (الماضي، المضارع، الأمر) مع النطق والقواعد. |
| **تصريف الأفعال الفرنسية** | `src/components/FrenchLanguageLab.tsx` | تصريف الأفعال الفرنسية (Présent, Futur, Passé composé, Imparfait) مع الصوت وقواعد الضمائر والاختبارات. |
| **تصريف الأفعال الإنجليزية** | `src/components/EnglishLanguageLab.tsx` | تصريف الأفعال الإنجليزية (Present Simple, Continuous, Past, Future) مع الصوت والألعاب التفاعلية. |
| **المعداد الياباني Soroban** | `src/components/SorobanInteractive.tsx` | Boulier à 5 tiges, entraînement Anzan Flash et règles des compléments. |
| **Convertisseur de Mesures** | `src/components/UnitConverter.tsx` | Unités de longueur ($m$), masse ($kg$), capacité ($L$) et surfaces agricoles ($ha, a, ca$). |
| **Géométrie Vectorielle** | `src/components/GeometryVisualizer.tsx` | Figures 2D et solides 3D en SVG interactif avec formules de calcul. |
| **Annales BEM / 5AP** | `src/components/ExamsViewer.tsx` | Sujets officiels 2008-2026 avec timer de 90 min et barème détaillé. |
| **Tuteur IA "Mssid"** | `src/components/AiTutorModal.tsx` | Assistant IA pédagoge alimenté par Google Gemini 3.6 Flash via API proxy. |
| **Gestionnaire de Reçus** | `src/components/AdminReceiptsManager.tsx` | Back-office d'audit et validation manuelle des reçus BaridiMob / Edahabia. |
| **Back-Office CMS** | `src/components/cms/CmsMainView.tsx` | Interface d'administration pour la gestion du programme et des contenus. |

---

## 2. Schémas d'Architecture Système Full-Stack & Spring Boot

### 2.1 Schéma Global de l'Architecture Multi-Tiers

```
+---------------------------------------------------------------------------------------+
|                                    CLIENT BROWSER                                     |
|  +---------------------------------------------------------------------------------+  |
|  |                          React 18 SPA (Vite) + Tailwind CSS                      |  |
|  |  +-------------------+  +--------------------+  +----------------------------+  |  |
|  |  |   LessonViewer    |  | SorobanInteractive |  |   AdminReceiptsManager     |  |  |
|  |  +-------------------+  +--------------------+  +----------------------------+  |  |
|  |  |   ExamsViewer     |  |    CmsMainView     |  |   SpringBootSpecsModal     |  |  |
|  |  +-------------------+  +--------------------+  +----------------------------+  |  |
|  +----------------------------------------+----------------------------------------+  |
+-------------------------------------------|-------------------------------------------+
                                            | HTTP / REST (Bearer JWT Header)
                                            v
+---------------------------------------------------------------------------------------+
|                               EXPRESS NODE PROXY (server.ts)                          |
|  +----------------------------------------+----------------------------------------+  |
|  | - Port: 3000 | Host: 0.0.0.0           | - Middleware Vite (Dev) / Static (Prod)|  |
|  | - Security Proxy: /api/gemini/explain  | - Static File Server: dist/            |  |
|  +----------------------------------------+----------------------------------------+  |
+-------------------------------------------|-------------------------------------------+
                                            |
                    ┌───────────────────────┴───────────────────────┐
                    │ HTTPS Call                            │ REST / JDBC
                    v                                       v
+---------------------------------------+   +---------------------------------------+
|    GOOGLE GEMINI 3.6 FLASH API        |   |      SPRING BOOT BACKEND SERVICE      |
|   (Moteur d'Intelligence Artificielle)|   | (Optionnel Production Enterprise Java)|
+---------------------------------------+   |  - Spring Security + JWT Filter       |
                                            |  - Spring Data JPA                    |
                                            |  - Base de Données SQL (PostgreSQL/H2)|
                                            +---------------------------------------+
```

### 2.2 Schéma de l'Architecture Spring Boot (Cible Enterprise)

```
+---------------------------------------------------------------------------------------+
|                              SPRING BOOT ARCHITECTURE                                 |
|                                                                                       |
|  [ HTTP Requests ]                                                                    |
|         │                                                                             |
|         ▼                                                                             |
|  +---------------------------------------------------------------------------------+  |
|  | SecurityFilterChain (JwtAuthenticationFilter)                                    |  |
|  |  - Extrait l'en-tête Authorization: Bearer <jwt_token>                         |  |
|  |  - Valide la signature HMAC256 et vérifie l'expiration                          |  |
|  |  - Injecte SecurityContextHolder avec les autorités (ROLE_FREE, ROLE_ADMIN, etc.)|  |
|  +----------------------------------------┬----------------------------------------+  |
|                                           │                                           |
|                                           ▼                                           |
|  +---------------------------------------------------------------------------------+  |
|  | REST Controllers Layer                                                           |  |
|  |  - AuthController        (/api/auth/login, /api/auth/register)                 |  |
|  |  - ReceiptController     (/api/receipts/submit, /api/receipts/verify)          |  |
|  |  - CourseController      (/api/courses, /api/courses/{id})                     |  |
|  |  - ExamController        (/api/exams, /api/exams/{id})                         |  |
|  +----------------------------------------┬----------------------------------------+  |
|                                           │                                           |
|                                           ▼                                           |
|  +---------------------------------------------------------------------------------+  |
|  | Service Layer (Business Logic & Transactions)                                   |  |
|  |  - AuthService           - ReceiptVerificationService                           |  |
|  |  - CourseService          - UserProgressService                                  |  |
|  +----------------------------------------┬----------------------------------------+  |
|                                           │                                           |
|                                           ▼                                           |
|  +---------------------------------------------------------------------------------+  |
|  | Data Access Layer (Spring Data JPA Repositories)                                |  |
|  |  - UserRepository        - PaymentReceiptRepository                             |  |
|  |  - CourseRepository      - OfficialExamRepository                               |  |
|  +----------------------------------------┬----------------------------------------+  |
|                                           │                                           |
|                                           ▼                                           |
|  +---------------------------------------------------------------------------------+  |
|  | Database Layer (PostgreSQL / MySQL / H2 Database Engine)                         |  |
|  +---------------------------------------------------------------------------------+  |
+---------------------------------------------------------------------------------------+
```

---

## 3. Schémas de Flux de Fonctionnement (Diagrammes de Séquence)

### 3.1 Diagramme 3.1 : Connexion & Émission du Jeton JWT

```
Utilisateur                 React Frontend (AuthModal)             AuthService / Server
    │                                  │                                   │
    │ ─── 1. Saisie email & pass ────> │                                   │
    │                                  │ ─── 2. POST /api/auth/login ────> │
    │                                  │      { email, password }          │
    │                                  │                                   │ Vérification Hash BCrypt
    │                                  │                                   │ Génération JWT JWS
    │                                  │ <── 3. Retour 200 OK ──────────── │
    │                                  │      { token, userProfile }       │
    │                                  │                                   │
    │ <── 4. Stockage localStorage ─── │                                   │
    │      'mssid_jwt_token'           │                                   │
```

### 3.2 Diagramme 3.2 : Workflow de Soumission et Validation d'un Reçu BaridiMob

```
Élève / Parent                React App                Admin (ADMIN)              Server / Storage
    │                             │                          │                           │
    │ ── 1. Import Reçu CCP/BM ─> │                          │                           │
    │      (Photo / Scan + Ref)   │                          │                           │
    │                             │ ── 2. POST Reçu ─────────┼─────────────────────────> │
    │                             │    Status: PENDING       │                           │ Enregistrement reçu
    │ <─ 3. Confirmation "En  ─── │                          │                           │
    │       attente de validation"│                          │                           │
    │                             │                          │                           │
    │                             │                          │ ── 4. Ouvre Admin Panel ─>│ Cible status=PENDING
    │                             │                          │ <─ 5. Reçoit liste ────── │
    │                             │                          │                           │
    │                             │                          │ ── 6. Clic "Approuver" ─> │
    │                             │                          │                           │ UPDATE status='APPROVED'
    │                             │                          │                           │ Upgrade rôle -> ROLE_PREMIUM
    │ <─ 7. Notification & ───────┴──────────────────────────┴───────────────────────────│
    │      Passage en PREMIUM!
```

### 3.3 Diagramme 3.3 : Flux de Requête Tuteur IA Gemini

```
Élève                         AiTutorModal.tsx         Express Proxy (server.ts)     Google Gemini API
    │                                │                            │                         │
    │ ── 1. Pose une question ─────> │                            │                         │
    │      "اشرح لي درس الكسور"       │                            │                         │
    │                                │ ── 2. POST /api/gemini/explain ──>                   │
    │                                │    { prompt, grade: '5AP' }│                         │
    │                                │                            │ Injection Clé API &     │
    │                                │                            │ System Prompt Pédagogique│
    │                                │                            │ ── 3. Call generateContent ─>
    │                                │                            │ <─ 4. Réponse Texte IA ─│
    │                                │ <── 5. Réponse JSON ────── │                         │
    │ <── 6. Affichage structuré ─── │                            │                         │
```

---

## 4. Modèle de Données & Tables de la Base de Données

Below is the Entity-Relationship (ER) diagram followed by the precise technical data dictionaries for each table.

### 4.1 Schéma Entity-Relationship (ER Diagram ASCII)

```
 +------------------------+              +------------------------+
 |         users          |              |     subscriptions      |
 +------------------------+              +------------------------+
 | PK  id                 |<──────1:1───| PK  id                 |
 |     email              |              | FK  user_id            |
 |     nom                |              |     status             |
 |     role               |              |     start_date         |
 |     created_at         |              |     end_date           |
 +-----------┬------------+              |     amount_dzd         |
             │                           +------------------------+
             │
             │ 1:N                       +------------------------+
             └──────────────────────────>|    payment_receipts    |
                                         +------------------------+
                                         | PK  id                 |
                                         | FK  user_id            |
                                         |     receipt_image_url  |
                                         |     payment_method     |
                                         |     transaction_ref    |
                                         |     amount_dzd         |
                                         |     status             |
                                         |     submitted_at       |
                                         |     verified_at        |
                                         +------------------------+

 +------------------------+              +------------------------+
 |        courses         |              |     official_exams     |
 +------------------------+              +------------------------+
 | PK  id                 |              | PK  id                 |
 |     grade              |              |     year               |
 |     subject            |              |     session_ar         |
 |     category_ar        |              |     title_ar           |
 |     title_ar           |              |     duration_minutes   |
 |     summary_ar         |              |     exercises_json     |
 |     rules_json         |              |     problem_json       |
 |     quiz_json          |              +------------------------+
 +------------------------+
```

### 4.2 Table 1 : `users` (Gestion des Utilisateurs & Rôles)

| Nom du Champ | Type SQL / JPA | Contraintes | Description & Valeurs Par Défaut |
| :--- | :--- | :--- | :--- |
| **`id`** | `BIGINT` | `PRIMARY KEY, AUTO_INCREMENT` | Identifiant unique de l'utilisateur. |
| **`email`** | `VARCHAR(150)` | `UNIQUE, NOT NULL` | Email d'authentification de l'élève ou parent. |
| **`password_hash`** | `VARCHAR(255)` | `NOT NULL` | Hash du mot de passe (BCrypt $2a$). |
| **`nom`** | `VARCHAR(100)` | `NOT NULL` | Nom complet de l'élève en arabe/français. |
| **`role`** | `VARCHAR(30)` | `NOT NULL, DEFAULT 'ROLE_FREE'` | Rôle Système : `ROLE_FREE`, `ROLE_PREMIUM`, `ROLE_TEACHER`, `ROLE_ADMIN`. |
| **`grade`** | `VARCHAR(10)` | `NOT NULL, DEFAULT '5AP'` | Niveau d'étude actuel (`1AP`, `2AP`, `3AP`, `4AP`, `5AP`). |
| **`created_at`** | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP` | Date de création du compte. |

### 4.3 Table 2 : `payment_receipts` (Reçus de Paiement BaridiMob & CCP)

| Nom du Champ | Type SQL / JPA | Contraintes | Description & Valeurs Par Défaut |
| :--- | :--- | :--- | :--- |
| **`id`** | `BIGINT` | `PRIMARY KEY, AUTO_INCREMENT` | ID du reçu de paiement. |
| **`user_id`** | `BIGINT` | `FOREIGN KEY (users.id)` | Référence à l'utilisateur qui soumet le reçu. |
| **`receipt_image_url`** | `TEXT` | `NOT NULL` | URL de la preuve de paiement (Capture BaridiMob ou reçu CCP). |
| **`payment_method`** | `VARCHAR(30)` | `NOT NULL` | Mode de paiement : `BARIDIMOB`, `EDAHABIA`, `CCP_TRANSFER`. |
| **`transaction_ref`** | `VARCHAR(100)` | `NOT NULL, UNIQUE` | Numéro de transaction ou référence de virement RIP. |
| **`amount_dzd`** | `INT` | `NOT NULL, DEFAULT 1500` | Montant payé en Dinars Algériens (DZD). |
| **`status`** | `VARCHAR(30)` | `NOT NULL, DEFAULT 'PENDING_VERIFICATION'` | État : `PENDING_VERIFICATION`, `APPROVED`, `REJECTED`. |
| **`rejection_reason`**| `VARCHAR(255)` | `NULLABLE` | Motif de rejet en cas de preuve non conforme. |
| **`submitted_at`** | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP` | Horodatage de la soumission par l'utilisateur. |
| **`verified_at`** | `TIMESTAMP` | `NULLABLE` | Horodatage de la validation administrative. |

### 4.4 Table 3 : `subscriptions` (Abonnements Premium Actifs)

| Nom du Champ | Type SQL / JPA | Contraintes | Description & Valeurs Par Défaut |
| :--- | :--- | :--- | :--- |
| **`id`** | `BIGINT` | `PRIMARY KEY, AUTO_INCREMENT` | ID de l'abonnement. |
| **`user_id`** | `BIGINT` | `FOREIGN KEY (users.id), UNIQUE` | ID de l'utilisateur abonné. |
| **`status`** | `VARCHAR(20)` | `NOT NULL, DEFAULT 'ACTIVE'` | Statut : `ACTIVE`, `EXPIRED`, `CANCELLED`. |
| **`start_date`** | `DATE` | `NOT NULL` | Date de début de l'abonnement. |
| **`end_date`** | `DATE` | `NOT NULL` | Date d'expiration (1 an après la validation). |
| **`plan_name`** | `VARCHAR(100)` | `NOT NULL` | Nom de la formule (ex: `"الاشتراك السنوي الشامل 5AP"`). |
| **`amount_dzd`** | `INT` | `NOT NULL` | Prix de la formule souscrite. |

### 4.5 Table 4 : `courses` (Programme Pédagogique & Leçons)

| Nom du Champ | Type SQL / JPA | Contraintes | Description & Valeurs Par Défaut |
| :--- | :--- | :--- | :--- |
| **`id`** | `VARCHAR(80)` | `PRIMARY KEY` | ID textuel lisible (ex: `"math-5ap-numbers"`). |
| **`grade`** | `VARCHAR(10)` | `NOT NULL` | Année scolaire cible (`1AP` à `5AP`). |
| **`subject`** | `VARCHAR(30)` | `NOT NULL` | Identifiant de matière (`math`, `arabic`, `soroban`, etc.). |
| **`category_ar`** | `VARCHAR(100)` | `NOT NULL` | Domaine pédagogique (ex: `"الأعداد والحساب"`). |
| **`title_ar`** | `VARCHAR(150)` | `NOT NULL` | Titre officiel de la leçon en arabe. |
| **`summary_ar`** | `TEXT` | `NOT NULL` | Résumé pédagogique et objectif du cours. |
| **`rules_json`** | `JSON / TEXT` | `NOT NULL` | Tableau JSON des règles clés et définitions. |
| **`interactive_tool`** | `VARCHAR(50)` | `NULLABLE` | Outil rattaché (`soroban`, `unit_converter`, `geometry_visualizer`). |
| **`quiz_json`** | `JSON / TEXT` | `NOT NULL` | Tableau JSON des questions du quiz interactif. |

---

## 5. Matrice des Endpoints API RESTful

Below is the exhaustive specification matrix of all HTTP endpoints exposed by the backend API.

| Méthode | Endpoint Path | Rôle Requis | Request Body Schema | Response Output | Description & Utilisation |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Tout public | `{ email, password }` | `{ token, userProfile }` | Authentification utilisateur et génération du jeton JWT. |
| `POST` | `/api/auth/register` | Tout public | `{ nom, email, password, grade }` | `{ token, userProfile }` | Inscription d'un nouvel élève. |
| `GET` | `/api/auth/me` | Connecté | En-tête `Authorization: Bearer <jwt>` | `{ userProfile }` | Récupération du profil et des détails de l'abonnement. |
| `GET` | `/api/receipts` | `ROLE_ADMIN` | aucun | `Array<PaymentReceipt>` | Récupération de tous les reçus de paiement enregistrés. |
| `POST` | `/api/receipts/submit` | Connecté | `{ paymentMethod, amountDzd, transactionRef, receiptImageUrl }` | `PaymentReceipt` | Soumission d'une preuve de paiement par l'élève. |
| `PUT` | `/api/receipts/{id}/verify`| `ROLE_ADMIN` | `{ approve: boolean, rejectionReason?: string }` | `PaymentReceipt` | Validation ou rejet manuel d'un reçu par l'admin. |
| `POST` | `/api/gemini/explain` | Tout public | `{ topic, question, grade, promptType }` | `{ text, cached, usage }` | Proxy IA Gemini 3.6 Flash avec Rate-Limiting & Caching in-memory. |
| `POST` | `/api/gemini/cms-generate`| `ROLE_TEACHER` | `{ type, topic, grade, subject }` | `{ text, cached, usage }` | Génération IA de contenus CMS avec Caching & Quota Enseignant. |
| `GET` | `/api/gemini/stats` | Tout public | Aucun | `{ cacheSize, totalHitsSaved, hitRatio }` | Statistiques du cache de questions et d'économie de coûts API. |
| `GET` | `/api/gemini/quota` | Tout public | Headers/QueryParams: `role, userId` | `{ role, limit, remaining, resetHours }` | Consultation du solde de quota quotidien restant pour un rôle. |
| `GET` | `/api/courses` | Tout public | QueryParams: `?grade=5AP&subject=math` | `Array<CourseLesson>` | Liste filtrée des leçons du programme national. |
| `GET` | `/api/exams` | `ROLE_PREMIUM` | QueryParams: `?year=2025` | `Array<OfficialExam>` | Archives et corrigés des épreuves de l'examen 5AP. |

---

## 6. Guide : Ajouter une nouvelle matière

Pour ajouter une nouvelle matière (par exemple **"التربية المدنية" / Éducation Civique**) :

### Procédure Étape par Étape

1. **Étape 1 : Modification des types TypeScript (`src/types/index.ts`)**
   ```typescript
   export type SubjectId =
     | 'math'
     | 'arabic'
     | 'soroban'
     | 'french'
     | 'islamic'
     | 'civics' // <--- Nouvelle clé
     | 'history'
     | 'science'
     | 'exams';
   ```

2. **Étape 2 : Déclaration dans le Registre (`src/data/subjectsData.ts`)**
   ```typescript
   export const SUBJECTS_LIST: SubjectInfo[] = [
     // ...
     {
       id: 'civics',
       nameAr: 'التربية المدنية',
       nameFr: 'Éducation Civique',
       icon: 'Heart', // Nom d'icône Lucide React
       color: 'bg-rose-50 text-rose-700 border-rose-200',
       description: 'قواعد الحياة الجماعية، المؤسسات الوطنية والحقوق والواجبات.',
     },
   ];
   ```

3. **Étape 3 : Ajout des leçons associées (`src/data/coursesData.ts`)**
   Créer des objets leçons avec `subject: 'civics'`.

---

## 7. Guide : Ajouter une nouvelle année scolaire

Pour étendre la plateforme à un nouveau niveau (ex: **"1AM" - 1ère Année Moyen**) :

| Étape | Fichier à Modifier | Action & Code à Ajouter |
| :--- | :--- | :--- |
| **1. Modifier le Type** | `src/types/index.ts` | `export type PrimaryGrade = '1AP' \| '2AP' \| '3AP' \| '4AP' \| '5AP' \| '1AM';` |
| **2. Ajouter le Bouton** | `src/App.tsx` | Ajouter `'1AM'` au tableau d'itération des boutons de niveaux. |
| **3. Ajouter les Cours** | `src/data/coursesData.ts` | Insérer les cours ayant `grade: '1AM'`. |

---

## 8. Guide : Ajouter un cours

Chaque cours est un objet respectant la structure `CourseLesson` dans `src/data/coursesData.ts` :

```typescript
{
  id: "math-5ap-fractions-decimals",
  grade: "5AP",
  subject: "math",
  categoryAr: "الأعداد والحساب",
  titleAr: "الكسور العشرية والأعداد العشرية",
  summaryAr: "تعلم تحويل الكسور ذات المقامات 10، 100، 1000 إلى أعداد بالفاصلة والعكس.",
  rulesAr: [
    "الكسر العشري هو كسر مقامه 10 أو 100 أو 1000.",
    "لكتابة كسر عشري على شكل عدد عشري، نكتب البسط ونضع الفاصلة بعد عدد من الأرقام مساوٍ لعدد الأصفار في المقام."
  ],
  keyFormulas: [
    { labelAr: "تحويل كسر عشري", formulaAr: "35 / 10 = 3.5" },
    { labelAr: "جزء من مائة", formulaAr: "247 / 100 = 2.47" }
  ],
  interactiveTool: "unit_converter",
  quiz: [
    {
      id: "q_frac_1",
      questionAr: "ما هو العدد العشري المساوي للكسر 75/10؟",
      options: [
        { id: "opt1", textAr: "0.75", isCorrect: false },
        { id: "opt2", textAr: "7.5", isCorrect: true },
        { id: "opt3", textAr: "75.0", isCorrect: false }
      ]
    }
  ]
}
```

---

## 9. Guide : Ajouter un examen officiel (Annales 5AP)

Les examens officiels sont répertoriés dans `src/data/examsData.ts` :

```typescript
export const OFFICIAL_EXAMS_DATA: OfficialExam[] = [
  {
    id: "exam-2026",
    year: 2026,
    sessionAr: "دورة 2026 الرسمية",
    titleAr: "امتحان شهادة التعليم الابتدائي - دورة 2026",
    durationMinutes: 90,
    exercises: [
      {
        titleAr: "التمرين الأول (1.5 ن): الحساب والتحويل",
        contentAr: "أنجز العمليات التالية عمودياً:\n1) 458.2 + 129.8\n2) 845 × 23",
        solutionAr: "1) 458.2 + 129.8 = 588.0 (0.75 ن)\n2) 845 × 23 = 19435 (0.75 ن)",
        points: 1.5
      }
    ],
    problemExercise: {
      titleAr: "الوضعية الإدماجية (04 نقاط): حقل أخي أحمد",
      contentAr: "يمتلك فلاح حشلاً مستطيل الشكل طوله 120m وعرضه نصف طوله...\n1. احسب عرض الحقل.\n2. احسب مساحته.",
      solutionAr: "1. عرض الحقل = 120 ÷ 2 = 60m (1ن)\n2. المساحة = 120 × 60 = 7200 m² (2ن)",
      points: 4.0
    }
  }
];
```

---

## 10. Guide : Ajouter un mini-jeu / Outil interactif

1. Créer le composant React dans `src/components/MyNewTool.tsx`.
2. Déclarer le nom dans `src/types/index.ts` :
   ```typescript
   interactiveTool?: 'soroban' | 'unit_converter' | 'geometry_visualizer' | 'my_new_tool';
   ```
3. Brancher le rendu dans `LessonViewer.tsx` sous l'onglet interactif.

---

## 11. Système de Gamification & Formules d'XP

### Formules Mathématiques de Progression

* **Gain d'XP par Quiz :** $+15 \text{ XP}$ par bonne réponse.
* **Calcul du Niveau (Level) :**
  $$\text{Niveau} = \left\lfloor \frac{\text{XP Total}}{100} \right\rfloor + 1$$
* **Progression dans le Niveau :**
  $$\text{XP Niveau Courant} = \text{XP Total} \pmod{100}$$

### Tableau des Badges Débloquables

| Badge ID | Nom du Badge | Condition de Déblocage |
| :--- | :--- | :--- |
| `b_welcome` | **مجتهد الجزائر** | Attribué automatiquement dès la première visite. |
| `b_math_star` | **عبقري الرياضيات** | Succès à au moins 3 quiz de mathématiques. |
| `b_soroban_master` | **بطل السوروبان** | Complétion d'une session Anzan Flash Math. |
| `b_exam_champion` | **بطل شهادة 5AP** | Résolution complète d'un sujet d'examen officiel. |

---

## 12. Back-Office CMS & Machine à États Pédagogique

### États du Contenu (Content Lifecycle Matrix)

```
[ Brouillon (draft) ] ──> [ En Relecture (review) ] ──> [ Validé (validated) ] ──> [ Publié (published) ]
```

| État | Visibilité | Rôle Autorisé | Action Possible |
| :--- | :--- | :--- | :--- |
| **`draft`** | Enseignant uniquement | `ROLE_TEACHER` | Rédaction et modifications libres. |
| **`review`** | Relecteurs Pédagogiques | `ROLE_TEACHER`, `ROLE_ADMIN` | Révision et commentaires pédagogiques. |
| **`validated`** | Comité de validation | `ROLE_ADMIN` | Approbation définitive du contenu. |
| **`published`** | Tout public sur l'application | `ROLE_ADMIN` | Publication en direct pour les élèves. |

---

## 13. Spécifications du Backend Spring Boot (JPA & JWT)

### Structure des Packages Java Recommandée

```
com.mssid.app
├── config/
│   ├── SecurityConfig.java         # Configuration Spring Security & CORS
│   └── JwtAuthenticationFilter.java# Filtre d'interception JWT
├── controller/
│   ├── AuthController.java         # API Authentification
│   ├── ReceiptController.java      # API Gestion des Reçus
│   └── CourseController.java       # API Gestion du Programme
├── entity/
│   ├── UserEntity.java             # Entité JPA Table 'users'
│   ├── ReceiptEntity.java          # Entité JPA Table 'payment_receipts'
│   └── SubscriptionEntity.java     # Entité JPA Table 'subscriptions'
└── repository/
    ├── UserRepository.java         # Interface Spring Data JPA
    └── PaymentReceiptRepository.java
```

---

## 14. Guide Développeur, Build & Déploiement Cloud Run

### 14.1 Lancement en Développement
```bash
cd frontend

# Installation des dépendances
npm install

# Démarrage du serveur dev Express + Vite (Port 3000)
npm run dev
```

### 14.2 Scripts de Production & Build
Conformément aux contraintes de conteneurisation Cloud Run :
```json
{
  "scripts": {
    "dev": "tsx server.ts",
    "build": "vite build && esbuild server.ts --bundle --platform=node --format=cjs --packages=external --sourcemap --outfile=dist/server.cjs",
    "start": "node dist/server.cjs"
  }
}
```

---

## 15. FAQ Technique Développeur

| Question | Réponse Synthétique |
| :--- | :--- |
| **Q1 : Où ajouter un cours ?** | Dans `src/data/coursesData.ts` sous forme d'objet respectant `CourseLesson`. |
| **Q2 : Comment modifier le port HTTP ?** | Le port `3000` est imposé par l'infrastructure reverse-proxy de Cloud Run. |
| **Q3 : Où est la clé Gemini ?** | Dans `.env` sous `GEMINI_API_KEY`. Elle n'est accessible que côté serveur dans `server.ts`. |
| **Q4 : Comment ajouter un reçu de test ?** | Utiliser le bouton "الدخول" ➔ Rôle Admin ➔ Accéder à la "لوحة التدقيق Admin". |
| **Q5 : Comment la progression est-elle conservée ?** | Via `localStorage` sous la clé `'mssid_user_profile'` synchronisée automatiquement. |

---

## 16. Système de Rate-Limiting & Caching des Requêtes IA Gemini (Cache In-Memory & Quotas Par Rôle)

### 16.1 Modèle de Rate-Limiting Basé sur les Rôles Utilisateurs (RBAC)
Afin de maîtriser les coûts d'utilisation de l'API Google Gemini 3.6 Flash et d'assurer une haute disponibilité équitable pour l'ensemble des élèves et enseignants, un système de **Rate-Limiting granulaire par rôle** et de **Caching In-Memory intelligent** a été intégré au serveur Proxy Node/Express (`server.ts`).

#### Matrice des Quotas Quotidiens par Rôle (`ROLE_DAILY_QUOTAS`)
| Rôle Utilisateur | Quota Max / 24h | Fenêtre de Réinitialisation | Action à la Dépassement (`HTTP 429`) |
| :--- | :--- | :--- | :--- |
| **`ROLE_FREE`** | **3 requêtes / jour** | 24 heures glissantes | Blocage avec message d'incitation à la migration vers `ROLE_PREMIUM`. |
| **`ROLE_PREMIUM`** | **50 requêtes / jour** | 24 heures glissantes | Protection contre les abus, réinitialisation automatique. |
| **`ROLE_TEACHER`** | **100 requêtes / jour** | 24 heures glissantes | Dédié à la création et à la génération de contenus pédagogiques CMS. |
| **`ROLE_ADMIN`** | **1000 requêtes / jour** | 24 heures glissantes | Accès système prioritaire illimité pour maintenance. |

---

### 16.2 Schéma d'Architecture Caching & Rate Limiting (`AiRateLimiterAndCacheService`)

```
                          [ REQUÊTE ÉLÈVE / ENSEIGNANT ]
                                        │
                                        ▼
                  POST /api/gemini/explain OU /api/gemini/cms-generate
                  Headers: x-user-role, x-user-id
                                        │
                                        ▼
                 ┌──────────────────────────────────────────────┐
                 │ 1. Génération de Clé Normalisée (Normalized) │
                 │ pType : grade : subject : topic : question  │
                 └──────────────────────┬───────────────────────┘
                                        │
                       ┌────────────────┴────────────────┐
                       │ Existe dans QuestionCache Map ? │
                       └───────────────┬─────────────────┘
                                       │
                      ┌────────────────┴────────────────┐
                   OUI │                                 │ NON
                       ▼                                 ▼
         ┌───────────────────────────┐     ┌───────────────────────────┐
         │       CACHE HIT ⚡        │     │  Vérifier Quota Quotidien │
         │  - Zéro consommation quota│     │   checkAndConsumeQuota()  │
         │  - Latence ~2ms           │     └─────────────┬─────────────┘
         │  - Header: X-Cache: HIT   │                   │
         └─────────────┬─────────────┘         ┌─────────┴─────────┐
                       │                     OUI│                   │NON (Dépassement)
                       │                        ▼                   ▼
                       │           ┌──────────────────────┐  ┌──────────────────────┐
                       │           │   GEMINI 3.6 FLASH   │  │   HTTP 429 ERROR     │
                       │           │      API CALL        │  │ RATE_LIMIT_EXCEEDED  │
                       │           └──────────┬───────────┘  └──────────────────────┘
                       │                      │
                       │                      ▼
                       │           ┌──────────────────────┐
                       │           │ Enregistrer dans Map │
                       │           │ setCachedResponse()  │
                       │           └──────────┬───────────┘
                       │                      │
                       └──────────────────────┴──────────────────────┐
                                                                     ▼
                                                         [ RÉPONSE JSON CLIENT ]
                                                         - text: string
                                                         - cached: boolean
                                                         - usage: { remaining, limit }
```

---

### 16.3 Normalisation des Questions & Clé Déterministe
Pour maximiser le taux de réponse depuis la mémoire cache (**Hit Ratio**), les textes des questions en langue arabe subissent un traitement de normalisation linguistique :
1. **Suppression du Tashkeel (التشكيل):** Élimination des voyelles courtes courantes (فتحة، ضمة، كسرة، تنوين، شدة، سكون) via l'expression régulière `/[\u064B-\u0652]/g`.
2. **Normalisation des Alifs (الألف):** Conversion de `أ`, `إ`, `آ` vers la forme neutre `ا`.
3. **Normalisation du Teh Marbuta (التاء المربوطة):** Conversion de `ة` vers `ه`.
4. **Nettoyage de la Ponctuation & Espaces:** Suppression de la ponctuation et réduction des espaces consécutifs.

#### Exemple de Clé Normalisée :
* **Question d'origine :** `"شرح درس القِسْمَةُ الأقْلِيدِيّةِ والسُّورُوبَان لِلسَّنَةِ الخَامِسَةِ ابْتِدَائِي"`
* **Chaine Normalisée :** `"explain:5ap:math:شرح درس القسمه الاقليديه والسوروبان للسنه الخامسه ابتدائي:"`
* **Empreinte de Clé Cache :** `explain:5AP:math:شرح درس القسمه الاقليديه والسوروبان للسنه الخامسه ابتدائي:`

---

### 16.4 Format de Réponse API & Headers HTTP Rate-Limit

#### Exemple de Réponse HTTP 200 (Cache Miss)
```json
{
  "text": "مرحباً بك يا بطل! المعلم مسيد يشرح لك درس القسمة الأقليدية...",
  "cached": false,
  "usage": {
    "limit": 50,
    "remaining": 49,
    "resetHours": 24
  }
}
```

#### Exemple de Réponse HTTP 200 (Cache Hit - Zéro Décompte)
```json
{
  "text": "مرحباً بك يا بطل! المعلم مسيد يشرح لك درس القسمة الأقليدية...",
  "cached": true,
  "cacheHitsCount": 14,
  "usage": {
    "limit": 50,
    "remaining": 49,
    "resetHours": 24
  }
}
```

#### Exemple de Réponse HTTP 429 (Dépassement du Quota)
```json
{
  "error": "RATE_LIMIT_EXCEEDED",
  "message": "لقد تجاوزت الحد اليومي المسموح به لأسئلة المعلم مَسيد (3 سؤالاً/يوم لدور ROLE_FREE). يرجى الانتظار 24 ساعة لتجديد الرصيد أو الترقية للحساب المميز Premium.",
  "messageFr": "Limite quotidienne atteinte (3 requêtes/jour pour le rôle ROLE_FREE). Veuillez patienter 24h.",
  "limit": 3,
  "remaining": 0,
  "resetHours": 24,
  "userRole": "ROLE_FREE"
}
```

#### Headers HTTP Automatiques Retournés :
```http
HTTP/1.1 200 OK
X-Cache: HIT
X-RateLimit-Limit: 50
X-RateLimit-Remaining: 49
Content-Type: application/json
```

---

### 16.5 Endpoint d'Audit & Monitoring Système (`GET /api/gemini/stats`)
Cet endpoint accessible permet aux administrateurs de suivre les performances du cache en temps réel :

```json
{
  "cacheSize": 42,
  "totalQueriesHandled": 128,
  "totalHitsSaved": 54,
  "hitRatio": "42.2%",
  "activeUsersTracked": 19,
  "quotas": {
    "ROLE_FREE": 3,
    "ROLE_PREMIUM": 50,
    "ROLE_TEACHER": 100,
    "ROLE_ADMIN": 1000
  }
}
```

---

## 17. Guide de Publication Google Play Store & Android App Bundle (.aab)

### 17.1 Commandes de Compilation & Génération du Fichier `.aab` (Android App Bundle)

Pour publier l'application mobile **Mssid DZ (مَسِيد)** sur le Google Play Store, vous devez générer un fichier binaire au format `.aab` (Android App Bundle) signé avec votre clé de production.

#### Option A : Déploiement Hybride Capacitor (Recommandé)
```bash
# 1. Génération du build web optimisé Vite
npm run build

# 2. Installation de Capacitor Core & CLI (si non présent)
npm install @capacitor/core @capacitor/android
npx cap init "Mssid DZ" "com.mssid.app" --web-dir "dist"

# 3. Ajout de la plateforme Android
npx cap add android
npx cap sync android

# 4. Génération de la Keystore de signature de production (Exécuter une seule fois)
keytool -genkey -v -keystore mssid-release-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias mssid-key

# 5. Compilation directe de l'Android App Bundle (.aab) via Gradle Wrapper
cd android
./gradlew bundleRelease

# Le fichier .aab généré se trouve dans :
# android/app/build/outputs/bundle/release/app-release.aab
```

#### Option B : Déploiement Trusted Web Activity (Bubblewrap CLI)
```bash
# 1. Génération du package TWA depuis la WebApp / PWA
npx @bubblewrap/cli init --manifest=https://mssid-dz.com/manifest.json

# 2. Compilation de l'AAB de production
npx @bubblewrap/cli build
```

---

### 17.2 Fiche du Store Google Play Console (Texte FR & AR)

#### 🇩🇿 النسخة العربية (Arabic Listing)

* **اسم التطبيق (Title - Max 30 chars):**  
  `مَسِيد DZ - التعليم الابتدائي`

* **الوصف القصير (Short Description - Max 80 chars):**  
  `تطبيق تعليمي تفاعلي وفق المنهاج الجزائري مع معلم ذكي وبدون إنترنت (1AP-5AP).`

* **الوصف الكامل (Full Description - Max 4000 chars):**  
  ```text
  تطبيق "مَسِيد DZ" هو المنصة التعليمية الرقمية الأولى الشاملة والتفاعلية المصممة خصيصاً للتلاميذ وأولياء الأمور في مرحلة التعليم الابتدائي بالجزائر (من السنة الأولى 1AP إلى السنة الخامسة 5AP).

  يقدم التطبيق تجربة تعليمية فريدة وممتعة تتوافق بنسبة 100% مع المنهاج الرسمي لوزارة التربية الوطنية الجزائرية، مع إمكانية التصفح والمراجعة بدون الحاجة إلى الاتصال الدائم بالإنترنت.

  🌟 أهم مميزات تطبيق مَسِيد DZ:
  • 📚 جميع المواد والدروس: الرياضيات، اللغة العربية، اللغة الفرنسية، التربية الإسلامية، التربية المدنية، التاريخ والجغرافيا، والعلوم.
  • 🧮 المعداد الياباني (السوروبان Soroban): ورشة تفاعلية كاملة لتنمية الذكاء والحساب الذهني السريع (Anzan Flash) مع مستويات متدرجة.
  • 📐 أدوات وورشات تفاعلية: محول مقادير القياس (الاطوال، الكتل، السعات والمساحات) ومستكشف الهندسة والأشكال 2D/3D.
  • 📝 أرشيف امتحانات شهادة التعليم الابتدائي (5AP): مواضيع الامتحانات الرسمية من دورة 2008 إلى 2026 مع الحلول النموذجية والسلالم الرسمية للقياس.
  • 🤖 المعلم الذكي (ذكاء اصطناعي Gemini 3.6): أستاذ افتراضي يجيب على أسئلة التلميذ ويشرح المفاهيم الصعبة بأسلوب بيداغوجي مبسط ومحفز.
  • 🏆 نظام التحفيز والشارات: كسب نقاط الخبرة (XP)، الارتقاء في المستويات، وفتح ميداليات التفوق لدعم الاستمرارية.
  • 📱 تفعيل سهل ومباشر عبر تطبيق BaridiMob أو CCP مع معالجة سريعة للطلبات.

  تطبيق مَسِيد DZ مصمم بعناية ليضمن بيئة آمنة ونظيفة للأطفال خالية من أي إعلانات مزعجة، مع الالتزام التام بمعايير سياسة الحماية الأسرية (Designed for Families).
  ```

---

#### 🇫🇷 Version Française (French Listing)

* **Titre de l'application (Title - Max 30 chars) :**  
  `Mssid DZ - Primaire Algérie`

* **Description courte (Short Description - Max 80 chars) :**  
  `App éducative conforme au programme algérien avec tuteur IA & Soroban (1AP-5AP).`

* **Description détaillée (Full Description - Max 4000 chars) :**  
  ```text
  L'application "Mssid DZ (مَسِيد)" est la plateforme numérique éducative de référence, spécialement conçue pour les élèves de l'enseignement primaire en Algérie (de la 1AP à la 5AP) et leurs parents.

  Totalement conforme au programme officiel du Ministère de l'Éducation Nationale Algérienne, Mssid DZ offre un apprentissage interactif et ludique utilisable même sans connexion internet.

  🌟 Fonctionnalités clés :
  • 📚 Programme complet : Mathématiques, Langue Arabe, Français, Éducation Islamique, Éducation Civique, Histoire-Géographie et Sciences.
  • 🧮 Boulier Soroban & Calcul Mental : Module interactif d'entraînement Anzan Flash pour stimuler la mémoire et l'agilité mentale.
  • 📐 Laboratoire Interactif : Convertisseur d'unités de mesures (longueurs, masses, capacités, surfaces) et visualiseur géométrique 2D/3D.
  • 📝 Annales Officiennes du 5AP (2008-2026) : Examens officiels chronométrés avec corrigés détaillés et barèmes officiels.
  • 🤖 Tuteur IA "Mssid" : Assistant pédagogique alimenté par l'IA Google Gemini pour expliquer chaque cours de manière adaptée à l'enfant.
  • 🏆 Gamification : Badges de réussite, points d'expérience (XP) et niveaux de progression.
  • 📱 Activation rapide des abonnements via BaridiMob / CCP.

  Sécurité garantie : Application certifiée sans publicités intrusives, respectant rigoureusement la charte "Designed for Families" de Google Play.
  ```

---

### 17.3 Modèle de Politique de Confidentialité (Privacy Policy) Type COPPA & Google Play

Le modèle ci-dessous est intégré dans l'application (`PrivacyPolicyModal.tsx`) et accessible à l'URL publique de confidentialité exigée par la Google Play Console :

```text
POLITIQUE DE CONFIDENTIALITÉ — APPLICATION MSSID DZ (مَسِيد)
Dernière mise à jour : 05 Août 2026

1. OBJET ET PÉRIMÈTRE
L'application Mssid DZ (com.mssid.app) est une application éducative destinée aux enfants du primaire (âges de 6 à 12 ans, 1AP à 5AP) et à leurs parents en Algérie. Nous appliquons les normes de protection de la vie privée des enfants COPPA (Children's Online Privacy Protection Act) ainsi que la politique "Designed for Families" de Google Play.

2. COLLECTE DES DONNÉES ET UTILISATION
- Identifiants de compte : Adresse e-mail, nom/pseudo et niveau scolaire (1AP-5AP). Ces données sont uniquement utilisées pour l'authentification et la personnalisation pédagogique.
- Autorisation Caméra et Galerie Photos : L'accès à la caméra et à la galerie d'images est sollicité exclusivement lorsqu'un parent souhaite importer une photo de reçu de paiement (BaridiMob / CCP) pour valider un abonnement Premium. Aucune autre photo n'est accédée ou stockée.
- Jetons d'authentification (JWT) : Stockés de façon sécurisée localement pour maintenir la session active sans ré-authentification constante.

3. AUCUNE PUBLICITÉ NI TRAÇAGE COMMERCIAL
L'application ne contient AUCUNE publicité d'annonceurs tiers, AUCUN réseau publicitaire ciblé (AdMob, Facebook Audience Network) et aucun traqueur comportemental.

4. SÉCURITÉ ET STOCKAGE DES DONNÉES
Toutes les communications entre l'application mobile et les serveurs sont sécurisées par un chiffrement SSL/TLS (HTTPS). Les données sont traitées par notre backend sécurisé Spring Boot.

5. DROITS DE SUPPRESSION DES DONNÉES (PARENTAL RIGHTS)
Les parents peuvent à tout moment demander la suppression intégrale du compte et des données associées de leur enfant en envoyant un e-mail à : mssid.dz.app@gmail.com.

Contact Support : mssid.dz.app@gmail.com / https://mssid-dz.com
```

---

### 17.4 Guide Pas-à-Pas : Configuration "Designed for Families" sur Google Play Console

Pour valider l'application sur la Google Play Console dans la section **Conçu pour les familles (Designed for Families)**, suivez la procédure ci-dessous :

1. **Étape 1 : Public cible et contenu (Target Audience & Content)**
   * Allez dans `Console Google Play ➔ Enquête sur le public cible`.
   * Sélectionner les tranches d'âge : **6-8 ans**, **9-11 ans** et **12 ans et plus** (ou Cocher "Enfants et Familles").
   * Déclarer que l'application s'adresse directement aux enfants.

2. **Étape 2 : Déclaration des publicités (Ads Policy)**
   * Sélectionner : **"Non, mon application ne contient pas de publicités"**.

3. **Étape 3 : Questionnaires de sécurité des données (Data Safety)**
   * Indiquer le type de données collectées : `Email` (pour authentification), `Nom` (pour le profil), et `Photos/Vidéos` (pour les reçus de paiement uniquement, facultatif).
   * Préciser que les données sont **chiffrées en transit (HTTPS/SSL)** et que l'utilisateur peut demander la **suppression des données**.

4. **Étape 4 : Évaluation du contenu (IARC Content Rating)**
   * Compléter le questionnaire IARC. Sélectionner la catégorie **Éducation / Enseignement**.
   * Répondre "Non" à toutes les questions sur la violence, le langage vulgaire ou le contenu sensible.
   * Résultat attendu : Classification **PEGI 3** / **USK 0** / **Everyone**.

5. **Étape 5 : Inscription au programme "Designed for Families"**
   * Cocher l'adhésion au programme **Designed for Families**.
   * Confirmer la conformité avec la loi **COPPA** et soumettre la Politique de Confidentialité (`https://mssid-dz.com/privacy`).

---

*Fin de la Documentation Technique & Architecture Officielle — Mssid DZ (مَسِيد)*

