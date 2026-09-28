# V2 — Inventaire de la V1 et plan de séparation

Établi le 27 septembre 2026 à partir du code (branche `v2`, commit `7807ff1`). Le classement est une **proposition** à valider avant de fixer le périmètre V2.

## 1. Ce que contient la V1

| Domaine | Contenu | Emplacement principal |
|---|---|---|
| Navigation | Routage maison (`useAppNavigation`, `navigation/appLocation.ts`), accueil à 4 pôles : cours, labs, examens, défis | `App.tsx`, `HomeView.tsx`, `MobileBottomNav.tsx`, `Navbar.tsx` |
| Cours | ~389 leçons (1AP ~57, 2AP ~61, 3AP ~78, 4AP ~86, 5AP ~107) | `frontend/src/data/courses/` |
| Examens | 2AP–5AP, types devoir / composition / BEP / acquis ; timer et solutions en 4AP–5AP ; impression hors 1AP | `ExamsViewer.tsx`, `data/examsData.ts`, `data/exams/` |
| Labs | 29 labs (marché en dinars, wilayas, histoire, sciences, conjugueurs, soroban, géométrie, horloge, syllabes, etc.) | `ToolsHubView.tsx`, `data/subjectsData.ts` |
| Défis | ~78 défis + défi quotidien généré depuis les leçons, 3 mini-jeux, section arcade | `ChallengesArena.tsx`, `data/challengesData.ts` |
| Préscolaire | 19 modules (~182 activités), 13 moteurs d’activité, 8 jeux, tableau magique, xylophone, boîte à sons, fiches imprimables | `components/preschool/`, `data/preschool/` |
| Gamification | XP, niveau, pièces, badges, énergie de Didou, série, objectif du jour | `useUserProgress.ts`, `utils/badgeEngine.ts` |
| Audio | TTS unifié (Capacitor natif ou Web Speech), 25 sons préenregistrés (boîte à sons) | `utils/speech.ts`, `preschool/usePreschoolAudio.ts` |
| Impression et partage | Fiche révision, sujets et corrigés, générateur de fiches, certificats PNG partageables | `RevisionSheetViewer`, `PrintableWorksheetsGeneratorModal`, `utils/certificateImage.ts` |
| IA | Tuteur Gemini derrière compte, quota 3 / 50 / 1000 par jour | `AiTutorModal.tsx`, `GeminiProxyController`, `AiQuotaService` |
| Paiement (éteint) | Reçus, validation admin, `ROLE_PREMIUM` 1 an, expiration quotidienne, prix fixe 1 500 DA | `PaymentServiceImpl`, `SubscriptionExpiryService`, `SubscriptionPaywall.tsx` |
| Admin | Stats, audit, messages, flags, reçus, reels | `components/admin/`, `AdminController`, `AdReelController` |
| Backend | Spring Boot, 11 controllers, 13 entités, Flyway jusqu’à **V15** | `backend/` |
| Tests | ~104 fichiers Vitest / Playwright, 11 specs e2e, axe sur les labs ; CI sur toutes les branches | `frontend/e2e/`, `.github/workflows/ci.yml` |

### Points structurants pour la V2

- **Aucune notion de compétence sur les exercices.** L’alignement se fait au niveau leçon (`curriculumAlignment.axisId`, texte libre dans `competenciesTestedAr`). Le fichier de correspondance prévu en phase 3 part de zéro.
- **La progression est par compte, pas par enfant.** `completedLessonIds`, XP et badges sont des champs de `users` (jsonb) et du profil local.
- **Pas d’audio préenregistré au préscolaire.** Le champ `promptAudioSrc` existe mais n’est jamais rempli : toutes les consignes passent par le TTS en direct.
- **Les fiches imprimables et les certificats existent déjà**, sans lien avec une compétence.

## 2. Proposition de classement

### Conserver

Catalogue de leçons, banque d’examens, labs, défis, auth (email + Google), flags serveur, console admin, i18n ar/fr, code de paiement éteint.

### Améliorer

| Élément | Amélioration | Phase |
|---|---|---|
| Accueil et navigation | Parcours « reprendre / s’entraîner / découvrir », après observation des familles | 2 |
| Progression | Passer du compte au profil enfant ; valider les données lues avec `JSON.parse` (plusieurs lectures sans schéma) | 3 |
| Consignes préscolaires | Audio généré une fois et relu, via `promptAudioSrc` | 4 / 7 |
| Examens | Révision des erreurs, lien avec les compétences | 4 / 6 |
| Fiches imprimables | Relier aux compétences, vérifier l’A4 en arabe | 5 |
| Certificats | Partage depuis l’espace parent, informations au choix | 7 |
| Marché en dinars (`AlgerianCurrencyMarket`) | Total et monnaie à rendre | 6 |
| Tracé (`TouchWritingStudio`, `preWritingModule`) | Tracés guidés et sons | 6 |
| Labyrinthe (`CarMazeGame`) | Base possible pour Didou Robot (suites d’instructions) | 6 |
| Quota IA | En mémoire, perdu au redémarrage | 8 |
| Prix | 1 500 DA en dur, dupliqué front / back, pas de formules | 8 |

### Remplacer

Rien d’identifié à ce stade.

### Ajouter

Correspondance exercice → compétence, profils enfant, évaluation d’orientation facultative, carnet d’erreurs par compétence, espace parent, contes, Cherche et trouve, Nature et découverte (à rapprocher de `primary_discovery` et des labs sciences), Défi famille à deux (vérifier ce que fait `SpeedMathDuelGame`), flag par module premium, verrou limité aux nouveaux modules avec son test, formules d’abonnement.

### Idées de labos (Karim, 28 sept. 2026) — V2, pas V1

Les 29 labos V1 sont des **outils pédagogiques utilisables**, pas un produit immersif. Le marché en dinars est un catalogue d’emoji + panier + pièces CSS. C’est ancré (dattes Deglet Nour, pain à 50 DA, billets 500/1000/2000) mais ce n’est pas un souk.

Règle : **corriger et rendre lisible en V1** (circuit, calculatrice, Anzan, contrastes). **Ne pas livrer en V1 les nouvelles expériences** : une fois dans le cartable gratuit, elles ne se vendent plus (C-05 + L-05 + P-05).

Candidats V2 (pack « labos nouveaux ») :

| Idée | Ancrage programme | Niveau d’ambition réaliste |
|---|---|---|
| Souk immersif (rue, étals, payer, monnaie) | Maths argent 1AP–5AP ; labo `algerian_market` déjà là | Scène 2,5D illustrée (kiosques algériens, pain, lait en sachet, dattes). Photos réelles seulement si on en possède les droits. Pas un marché 3D type jeu AAA (téléphones milieu de gamme). La V1 garde le calcul des dinars actuel. |
| Code de la route enfant | 2AP civile : feux, ممر الراجلين, trajet école. 5AP : قواعد المرور + bus/tram | Scènes tap : feu rouge/orange/vert, passage piéton, regarder droite/gauche, ne pas courir, céder le siège. Rue algérienne (trottoir, bus, tram si 5AP). |
| Autres idées Karim | À lister une par une | Même règle : nouveau = V2 ; polish du labo existant = V1. |

## 3. Écarts V1 à corriger sur `main` (pas sur `v2`)

- `enableAITutor` n’est lu nulle part hors du catalogue de flags : l’admin annonce que le bouton du tuteur se cache quand le flag est désactivé, ce qui est faux.
- `authService.ts` lit des reçus avec `JSON.parse` sans `try`.
- Relevés pendant la visite des écrans (détail et captures dans `docs/v2-captures/README.md`) :
  - bouton « التالي » de la leçon recouvert par la barre du bas selon le défilement ;
  - compteurs d’étapes et de questions inversés (« 4 / 2 » pour 2 / 4) ;
  - colonne « الحل » des examens rendue fausse à la lecture par le sens d’écriture (« 3.8 < 3.18 < 3.08 »), opérations non posées ;
  - explications génériques dans certains quiz ;
  - erreurs affichées en rouge vif ;
  - réinitialisation de la progression sans Parent Gate ;
  - onglet actif « الدروس » sur la page des examens.
- Labo électricité, constructeur de circuit (`CircuitBuilder.tsx`), signalé par Karim sur téléphone : zone fixe de 640 × 400 px dans un conteneur à défilement horizontal, alors que le SVG a `touch-action: none` sur toute sa surface. Sur mobile, on ne voit qu’environ la moitié du circuit, on ne peut pas faire défiler au doigt (seulement par la barre), le défilement vertical de la page est bloqué sur 400 px, la vue démarre au bord droit en RTL (pile coupée), les nouveaux éléments apparaissent au hasard sur 640 px (souvent hors écran) et la palette n’affiche que des icônes. Piste : disposition portrait adaptée à la largeur (points ≥ 48 px), `touch-action: none` limité aux éléments et points, apparition dans la zone visible, libellés sous les icônes.
- Labo calculatrice éducative (`EducationalCalculator.tsx`, l. 64–69), signalé par Karim sur téléphone : le titre et la description sont écrasés dans une colonne d’environ 60 px (un mot par ligne) parce que la barre de lecture `TextToSpeechButton` (≈ 330 px, `inline-flex` sans retour à la ligne) partage la même ligne sans passage en colonne sur mobile ; la barre déborde à gauche (« السرعة » coupé). Même composant : boutons d’environ 32 px (sous 48 px), indication « 1x » en double avec le menu, menu des vitesses aligné par `right-0` au lieu d’`end-0`. Piste : barre sous le titre sur mobile, `flex-wrap`, boutons de 48 px, retrait de « 1x ».
- Labo soroban, onglet Anzan (`SorobanInteractive.tsx`), signalé par Karim : le champ « المجموع المتوقع » et le message de réussite sont illisibles. Cause : `data-lab-instrument` n’est posé que sur le canvas du boulier (onglet « العداد الحر »). Sur Anzan, ce canvas n’est plus dans le DOM, donc `.lab-interior` force les fonds sombres en blanc (`bg-slate-800` → blanc) sans inverser `text-white` ni `text-emerald-200`. Résultat : saisie blanche sur fond blanc ; succès émeraude pâle sur fond émeraude pâle. Piste : poser `data-lab-instrument` sur le bloc Anzan, ou (mieux) passer cet onglet en thème clair cohérent (`text-slate-900`, fond crème, placeholder visible).
- Bouton de fermeture de la fenêtre des réglages sans libellé accessible (lecteur d’écran : bouton sans nom).
- Prompt du tuteur IA (`GeminiAiService`, référentiel 1AP) : « الأعداد من 0 إلى 20 », alors que la borne officielle 1AP est 100 (`CLAUDE.md`).

## 5. Vérifier le backend en local

Pas de Maven ni de Java 21 sur la machine : les tests passent par Docker (Docker Desktop démarré).

```powershell
docker network create mssid-v2-test
docker run -d --rm --name mssid-v2-pg --network mssid-v2-test -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=mssid_db postgres:16
docker run --rm --network mssid-v2-test -e DATABASE_URL=jdbc:postgresql://mssid-v2-pg:5432/mssid_db -v "${PWD}\backend:/app" -v mssid-m2:/root/.m2 -w /app maven:3.9-eclipse-temurin-21 mvn -B test
docker stop mssid-v2-pg; docker network rm mssid-v2-test
```

La base du conteneur est jetable : elle part vide à chaque lancement.

## 4. Séparation technique : constats et plan

### Risques relevés

- **Vercel :** `vercel.json` ne filtre aucune branche. Avec l’intégration Git standard, **un push de `v2` déclenche un déploiement Preview**. Si `VITE_SPRING_BOOT_URL` est défini pour « All Environments », ce preview appellera l’API de production.
- **Tags :** `android-release.yml` se déclenche sur les tags `v*`. **Un tag `v2` ou `v2.0` lancerait un build de release signé.** Nommer les repères V2 autrement (par exemple `beta-2026-10-01`).
- **Base de test :** une branche Neon créée depuis la production copierait des données réelles d’enfants (contraire à L-03). La base V2 doit partir vide, avec des comptes fictifs.
- **Emails :** avec la même clé Resend, le backend V2 peut envoyer de vrais emails.
- **CORS :** pas de joker `*.vercel.app` ; l’URL du preview V2 doit être ajoutée explicitement au backend V2.
- **Android :** aucun flavor, `applicationId` `dz.mssid.app`. Le client OAuth Android est lié au package et à l’empreinte de signature.

### Plan

| Élément | V2 | Prérequis |
|---|---|---|
| Front | Preview Vercel de la branche `v2`, protégé (Deployment Protection) | Variables Preview réglées **avant le premier push** |
| `VITE_SPRING_BOOT_URL` | URL du backend V2, portée Preview uniquement | Backend V2 en ligne |
| Backend | Nouveau service Render (`mssid-backend-v2`, plan gratuit) | Base V2 |
| Base | Nouveau projet ou base Neon **vide**, migrations Flyway appliquées au démarrage | — |
| `JWT_SECRET` | Nouveau secret | — |
| `CORS_ALLOWED_ORIGINS` | URL stable du preview `v2` + `https://localhost` | URL connue |
| Google OAuth | Client web et client Android distincts (`dz.mssid.app.beta`) | — |
| Gemini | Clé distincte, quotas bas | — |
| Resend | Désactivé ou clé de test | — |
| Sentry | Même projet, environnement `v2` | — |
| Android | `applicationIdSuffix ".beta"` et nom d’app distinct dans un build dédié | Client OAuth `.beta` |
| Flyway | Migrations V2 à partir de **V100** ; `spring.flyway.out-of-order=true` sur l’environnement V2 uniquement, pour accepter les migrations de `main` ramenées ensuite (V16, V17…) | Décision de renumérotation au moment de la fusion (phase 10) |
| Flags | `enablePayments` et `enableTrimesterPaywall` désactivés jusqu’à la phase 8 | — |

### À faire par Karim (tableaux de bord)

1. Vercel : vérifier la Production Branch (`main`), la portée de `VITE_SPRING_BOOT_URL`, activer la protection des previews. **Ne pas pousser `v2` avant.**
2. Render : confirmer que l’auto-deploy du service actuel est limité à `main`.
3. Neon : créer une base vide pour la V2.
4. Google Cloud : créer les clients OAuth V2.
