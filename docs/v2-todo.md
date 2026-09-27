# V2 — Suivi des tâches

Branche : `v2`. Référence : `docs/roadmap-v2.md`.

Règles : `main` est ramené dans `v2` chaque semaine ; les corrections de contenu V1 se font sur `main`. Une case ne se coche qu’une fois le point de validation atteint.

## Phase 1 — Cadrage et séparation

### Inventaire et décisions

- [ ] Inventaire de la V1 à partir du code : écrans, modules, labs, jeux, flags, services, problèmes connus (`docs/v2-inventaire.md`)
- [ ] Classement de chaque élément : conserver, améliorer, remplacer, ajouter
- [ ] Relevé Play Console : fiche, installations, désinstallations, utilisateurs actifs, Android vitals (Karim)
- [ ] Observation de quelques familles et d’au moins un enseignant sur trois tâches : choisir un niveau, finir une activité, reprendre le lendemain (Karim)
- [ ] Périmètre V2 arrêté : liste des évolutions, contenus nouveaux candidats au premium

### Séparation technique

- [ ] Plage de numéros Flyway réservée à la V2 et documentée
- [ ] Base PostgreSQL de test indépendante, comptes fictifs uniquement
- [ ] Backend de prévisualisation privé pointant sur la base de test
- [ ] Preview Vercel privé de `v2` avec `VITE_SPRING_BOOT_URL` vers le backend de test
- [ ] Identifiants OAuth Google, environnement Sentry et clé Gemini distincts pour la V2
- [ ] Build Android de test avec identifiant `.beta` (ou piste de test interne Play)
- [ ] Flags de paiement désactivés sur l’environnement V2 tant que la phase 8 n’est pas commencée

**Validation :** un essai sur la V2 (inscription, progression, reçu) ne laisse aucune trace dans la base ni dans les services de la V1.

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
