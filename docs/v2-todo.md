# V2 — Suivi des tâches

> Mise à jour du 16 octobre 2026 : la synchronisation des nouvelles observations, le bilan parent et la distribution serveur des cahiers/sujets CEM sont implémentés dans le lot décrit dans [Validation avant vente](v2-validation-avant-vente.md). Leur mise en service exige le backend V2 et la migration V105. Les autres ateliers interactifs restent distribués dans le frontend. Les mentions de stockage seulement local ci-dessous décrivent les étapes antérieures.


Branche : `v2`. Référence : `docs/roadmap-v2.md`.

Règles : `main` est ramené dans `v2` chaque semaine ; les corrections de contenu V1 se font sur `main`. Une case ne se coche qu’une fois le point de validation atteint.

## Phase 1 — Cadrage et séparation

### Inventaire et décisions

- [x] Inventaire de la V1 à partir du code : écrans, modules, labs, jeux, flags, services, problèmes connus (`docs/v2-inventaire.md`)
- [ ] Classement de chaque élément : conserver, améliorer, remplacer, ajouter (proposition dans `docs/v2-inventaire.md` §2, à valider)
- [x] Corriger sur `main` les écarts V1 relevés (`docs/v2-inventaire.md` §3)
- [x] Labos V1 : Lots A–D de `docs/v1-labs-todo.md` (circuit, calculatrice, Anzan, TTS, chemin 1AP/2AP) — branche `fix/…`, pas `v2`
- [ ] Relevé Play Console : fiche, installations, désinstallations, utilisateurs actifs, Android vitals (Karim)
- [ ] Observation de quelques familles et d’au moins un enseignant sur trois tâches : choisir un niveau, finir une activité, reprendre le lendemain (Karim)
- [ ] Périmètre V2 arrêté : liste des évolutions, contenus nouveaux candidats au premium (idées labos : souk immersif, code de la route enfant — `docs/v2-inventaire.md` §2)



### Séparation technique

Plan détaillé : `docs/v2-inventaire.md` §4. Ne pas pousser `v2` tant que les variables Preview de Vercel ne sont pas réglées. Ne jamais créer de tag `v*` (déclenche le build de release Android).

- [ ] Vercel : Production Branch = `main`, `VITE_SPRING_BOOT_URL` limité à Production, protection des previews activée (Karim)
- [ ] Render : auto-deploy du service actuel limité à `main` (Karim)
- [x] Plage de numéros Flyway réservée à la V2 (V100+) et `out-of-order` sur l’environnement V2 uniquement (profil `v2`, `backend/src/main/resources/application-v2.properties` ; le service V2 tourne avec `SPRING_PROFILES_ACTIVE=prod,v2`)
- [ ] Base PostgreSQL de test indépendante et vide (pas de branche Neon copiée depuis la production), comptes fictifs uniquement
- [x] Resend et Gemini lus depuis `V2_RESEND_API_KEY`, `V2_GEMINI_API_KEY`, `V2_GEMINI_REELS_API_KEY` sous le profil `v2` (vides = désactivés)
- [ ] Backend de prévisualisation privé pointant sur la base de test
- [ ] Preview Vercel privé de `v2` avec `VITE_SPRING_BOOT_URL` vers le backend de test
- [x] Environnement Sentry `v2` (profil `v2`)
- [ ] Clients OAuth Google distincts : web (URL du preview) et Android `dz.mssid.app.beta` + SHA-1 de la clé debug (Karim)
- [x] Build Android de test : type `beta` (`assembleBeta`), identifiant `dz.mssid.app.beta`, nom « Mssid V2 (test) », signé avec la clé debug
- [ ] Compiler et installer un premier APK `beta` à côté de la V1 sur un téléphone
- [ ] Flags de paiement désactivés sur l’environnement V2 tant que la phase 8 n’est pas commencée

**Validation :** un essai sur la V2 (inscription, progression, reçu) ne laisse aucune trace dans la base ni dans les services de la V1.

## Phase 2 — Chantier design et navigation

Référence : `docs/v2-design-brief.md`. Un seul agent ou une seule personne à la fois sur les fichiers du prototype. La refonte d’un écran n’est décidée qu’après comparaison avec l’écran actuel.

### Cadrage

- [x] Brief design et UX avec les contraintes existantes (`docs/v2-design-brief.md`)
- [x] Trancher la couleur de fond et de texte : **`#FFFBF0` / `#0f172a`** retenus le 3 novembre 2026 (`.cursorrules`). La planète et la carte de Didou gardent leur style « monde de jeu ».
- [ ] Désigner qui réalise le prototype (Codex, Cursor ou Karim)
- [x] Captures des écrans actuels correspondants aux six écrans du prototype, en largeur téléphone (`docs/v2-captures/`)
- [ ] Refaire ces captures sur un vrai téléphone Android (Karim)

### Exploration du style

- [ ] Deux ou trois variantes de l’accueil primaire en maquette, sans code. Proposition du 3 novembre 2026 à tester avec les familles : carte de Didou en 1AP, « مهمتي اليومية » de la 2AP à la 5AP (détail dans `v2-todo-business.md`).
- [ ] Choix d’une variante (Karim)

### Prototype (branche `v2`, route de prototype non visible dans la navigation)

- [x] 1. Choix du profil enfant (facultatif ; passage direct pour l’invité)
- [ ] 2. Accueil préscolaire (cibles 60–72 px, audio sur chaque consigne)
- [ ] 3. Accueil primaire (« Continuer » en action principale ; matières, examens, labs, défis visibles)
- [ ] 4. Exercice avec consigne audio et correction (vrai exercice, dont un problème de maths en deux colonnes)
- [ ] 5. Bilan de séance
- [ ] 6. Tableau de bord parent
- [ ] Parcours cliquable reliant les six écrans

### Vérification

- [ ] Test sur un Android milieu de gamme : lisibilité de l’arabe, texte et nombres mélangés, RTL, zoom non bloqué
- [ ] Contrôle d’accessibilité (axe) sur les six écrans
- [ ] Test avec quelques familles : trouver une activité et reprendre une séance sans aide (Karim)
- [ ] Décision écran par écran : conserver, ajuster ou remplacer (Karim)

### Bibliothèque de composants

- [ ] Composants communs issus du prototype validé : boutons, cartes, consigne audio, feedback, progression, Didou
- [ ] Application aux écrans retenus pour la refonte

**Validation :** un utilisateur trouve une activité et reprend sa séance sans explication extérieure.

## Phase 3 — Socle pédagogique et progression

### Compétences

Référentiel dans `frontend/src/data/competences/`, sans modifier les fichiers de leçons (PED-06). Une leçon liste ses compétences ; ses exercices en héritent tant qu’il n’existe pas de lien exercice par exercice. Le test `competences.test.ts` vérifie que chaque leçon couverte du catalogue est reliée et que tous les identifiants existent.

- [x] Maths 1AP : 12 compétences, 15 leçons reliées (`math1ap.ts`)
- [ ] Relecture pédagogique des compétences maths 1AP, en particulier les deux marquées `inReferentiel: false` (soustraction, résolution de problèmes) : à confirmer dans le programme officiel (Karim)
- [ ] Lien exercice par exercice lorsque les exercices d’une leçon travaillent des compétences différentes
- [ ] Étendre au périmètre choisi pour la première série complète (phase 3 de la roadmap)

### Progression

- [x] Modèle de profil enfant côté serveur : migration `V100__add_child_profiles.sql`, API `/api/v1/children` (liste, création, modification, suppression), prénom ou pseudo + niveau (`PRESCHOOL`, 1AP–5AP) + avatar facultatif, 6 profils maximum, suppression avec le compte
- [x] Parent Gate côté frontend avant création, modification ou suppression d’un profil
- [x] Écran de choix du profil (prototype, écran 1) et rattachement de la progression locale au profil choisi
- [x] Enregistrement des séances et des résultats par profil et par compétence (local, lié au slot enfant : `competenceStats` + `lessonSessions`, maths 1AP via `getLessonCompetences`. Persistance serveur = phase suivante.)

## Phases suivantes (à détailler au démarrage de chacune)

### Phase 4 — Accompagnement personnalisé
- [x] Carnet parent local : compétences travaillées / pas commencées (maths 1AP), lecture de `competenceStats` + `lessonSessions`, bouton Réviser vers la leçon
- [x] Carnet d’erreurs et révisions adaptatives (échecs locaux, section « à revoir », relance de la leçon)

### Phase 5 — Espace parent et fiches imprimables
- [x] Entrée carnet derrière Parent Gate depuis le profil et les réglages, sans changer l’accueil à 4 pôles
- [x] Fiches imprimables liées aux compétences : bouton Imprimer du carnet → fiche de révision de la leçon mappée (même contenu que la leçon, pas de double rédaction)

- [ ] Phase 6 — Enrichissement pédagogique
- [ ] Phase 7 — Contenus audio, récompenses et vidéos
- [ ] Phase 8 — Abonnements et administration
- [ ] Phase 9 — Tests privés et stabilisation
- [ ] Phase 10 — V2 prête, conservée à part