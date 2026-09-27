# V2 — Suivi des tâches

Branche : `v2`. Référence : `docs/roadmap-v2.md`.

Règles : `main` est ramené dans `v2` chaque semaine ; les corrections de contenu V1 se font sur `main`. Une case ne se coche qu’une fois le point de validation atteint.

## Phase 1 — Cadrage et séparation

### Inventaire et décisions

- [x] Inventaire de la V1 à partir du code : écrans, modules, labs, jeux, flags, services, problèmes connus (`docs/v2-inventaire.md`)
- [ ] Classement de chaque élément : conserver, améliorer, remplacer, ajouter (proposition dans `docs/v2-inventaire.md` §2, à valider)
- [ ] Corriger sur `main` les écarts V1 relevés (`docs/v2-inventaire.md` §3)
- [ ] Relevé Play Console : fiche, installations, désinstallations, utilisateurs actifs, Android vitals (Karim)
- [ ] Observation de quelques familles et d’au moins un enseignant sur trois tâches : choisir un niveau, finir une activité, reprendre le lendemain (Karim)
- [ ] Périmètre V2 arrêté : liste des évolutions, contenus nouveaux candidats au premium



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

## Phase 2 — Préparation

- [x] Brief design et UX avec les contraintes existantes (`docs/v2-design-brief.md`)
- [ ] Trancher la couleur de fond et de texte : `.cursorrules` (`#FFFBF0` / `#0f172a`) ou cahier des charges PED-05 (`#F8F9FA` / `#1E293B`) (Karim)

## Phases suivantes (à détailler au démarrage de chacune)

- [ ] Phase 2 — Navigation et expérience utilisateur
- [ ] Phase 3 — Socle pédagogique et progression
- [ ] Phase 4 — Accompagnement personnalisé
- [ ] Phase 5 — Espace parent et fiches imprimables
- [ ] Phase 6 — Enrichissement pédagogique
- [ ] Phase 7 — Contenus audio, récompenses et vidéos
- [ ] Phase 8 — Abonnements et administration
- [ ] Phase 9 — Tests privés et stabilisation
- [ ] Phase 10 — V2 prête, conservée à part