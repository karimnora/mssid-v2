# V2 — Répartition des tâches entre Claude et Codex (15 novembre 2026)

Destinataires : Codex, Claude et Karim. Branche `v2` uniquement ; ne jamais toucher `main`.
Ce fichier est la liste unique. Les autres `docs/v2-todo-*.md` restent la référence de détail pour chaque sujet.

## Qui fait quoi, et pourquoi

| | Codex | Claude |
|---|---|---|
| Rôle principal | Construire et brancher : code de l'application, serveur, migrations, tests, mise en ligne, génération des images | Décider quoi construire et vérifier : pédagogie, contenu, textes, essais simulés, revue |
| Pourquoi | Il lance déjà les tests et le serveur sur ce poste, et il a écrit la plus grande partie du code de `v2` | Il a écrit les missions et les contenus, connaît le programme officiel et rédige les consignes d'image |
| Ne fait pas | Ne modifie ni questions, ni corrigés, ni règles de validation ; ne refait pas le dessin d'un écran sans spécification | Ne lance ni tests ni build sans le feu vert de Karim ; ne touche pas au serveur |

## Règles de travail

1. **Un seul responsable par tâche.** L'autre relit. Personne ne modifie un fichier d'une tâche qui n'est pas la sienne.
2. **Ordre.** Une tâche marquée « après CL-xx » ou « après CX-xx » ne commence pas avant la fin de celle-ci.
3. **Relecture croisée.** Claude relit chaque lot de code de Codex avant le commit. Codex lance les tests sur chaque lot de Claude.
4. **Commits.** Chacun n'ajoute que ses propres fichiers (`git add` fichier par fichier). Messages en anglais, `feat(v2):`, `fix(v2):` ou `docs(v2):`.
5. **Périmètre gelé.** Aucun nouveau monde, moteur de jeu ou atelier avant la fin de la phase 1.
6. **Une case ne se coche qu'une fois le critère atteint**, avec le commit à côté.
7. **Rien d'inventé** : pas de faux avis, de fausse progression ni de faux résultat d'essai. Les essais de Claude sont dits « simulés ».
8. **Tests ciblés pendant le développement (Karim, 15 novembre 2026), pour Claude comme pour Codex.** Après chaque lot, ne lancer que les tests des fichiers modifiés (`npx vitest run <fichiers>` ou leurs tests voisins). Pas de suite complète, pas de build, pas de tests navigateur à chaque lot. La batterie complète se fait une seule fois, à la fin (CX-23), avant la mise en ligne.
9. Les règles de `CLAUDE.md` restent valables : cibles de 60 px en préscolaire et 1AP, audio sur chaque consigne en 1AP et 2AP, pas de texte rouge, deux colonnes `الحل` / `العمليات`, tableau `الكلمة` / `إعرابها`, aucun prix dans l'application Android.

## Phase 0 — Geler et faire tourner la V2 en local (16 au 30 novembre)

**Décision de Karim (15 novembre 2026) :** la V2 se teste en local sur son PC jusqu'à ce que le produit soit fini. Aucun push de `v2`, aucun hébergement, aucun APK distribué avant cela. La mise en ligne est la tâche CX-22, en fin de phase 3.

### Codex

- [ ] **CX-00 — Vérifier la fusion de la V1 dans la V2** (commit `924f059`, 15 novembre ; sauvegarde : étiquette `v2-backup-before-v1-merge-20261115`). Lancer seulement les tests liés aux 39 fichiers résolus à la main (liste dans le message du commit) ; corriger ce qui casse sans changer les choix de fusion. La suite complète et le build attendent CX-23. Refaire ensuite, sur la nouvelle carte compagnon de la V1, l'affichage du Didou 3D du monde (`world/DidouPortrait`), perdu dans la fusion. *Critère : les tests ciblés passent.*

- [ ] **CX-01 — Pile V2 complète en local.** Faire tourner `compose.v2.yml` (site, serveur Spring profil `v2`, PostgreSQL vide) sur le PC de Karim avec la V2 fusionnée : migrations V100 à V108 passées, site sur http://localhost:3002. Ajouter deux scripts à double-cliquer à la racine, `v2-demarrer.cmd` et `v2-arreter.cmd` (arrêt sans `-v`, les comptes de test sont gardés). Créer en local un compte administrateur et un compte Premium fictifs, et noter dans `docs/v2-tests-isoles.md` comment les recréer. *Critère : inscription, profils enfants, progression, carnet parent et activation d'un code fonctionnent, sans aucune requête vers la V1.*
- [ ] **CX-02 — Tester sur un téléphone, en local.** Permettre, seulement quand Karim le demande, d'ouvrir le site local depuis un téléphone sur le même Wi-Fi (adresse du PC, port 3002), sans exposer le PC à Internet. *Critère : connexion, leçon et carnet parent utilisables dans Chrome Android.* L'APK bêta n'est pas possible en local (il exige un serveur HTTPS) : il passe dans CX-22.
- [ ] **CX-03 — Étoiles des jeux par enfant.** Vérifier que `mssid_learning_games_v1` (`LearningGameEntry.tsx`) est bien séparée par enfant ; sinon, une clé par enfant avec reprise de l'ancienne. *Critère : test avec deux profils qui ne partagent aucune étoile.*
- [ ] **CX-04 — Consentement parental** (lot A de `v2-todo-conformite-anpdp.md`) : case obligatoire non cochée à l'inscription et à la connexion Google, refus côté serveur, date et version enregistrées. Textes : `docs/v2-consentement-parental.md`.
- [ ] **CX-24 — Android sans mot de paiement, suite de CL-04** (`docs/v2-revue-android-paiement.md`) : section « الاشتراك والدفع » des conditions d'utilisation remplacée par le texte neutre proposé quand l'application tourne sur Android ; garde-fou `NativeNoPaymentWording.test.tsx` étendu au rendu des écrans listés. *Critère : le test ciblé passe et attrape l'ancien texte.*
- [ ] **CX-05 — Village ouvert aux comptes gratuits**, avec les cadenas dorés sur ce qui est Premium (aujourd'hui réservé à `isPremiumRole && designMode === 'world'`). *Critère : un compte gratuit voit le village ; aucun prix affiché.*

### Claude

- [ ] **CL-01 — Essais simulés 5AP** (après le feu vert de Karim, sur la V2 lancée en local). Huit profils, rapport dans `docs/v2-essais-simules-5ap.md` : chaque blocage avec capture, gravité et correction proposée.
- [x] **CL-02 — L'offre en trois piliers.** Fait : `docs/v2-offre-trois-piliers.md`. Spécification et textes arabe et français : l'aventure de Didou, le suivi du parent, la réussite aux examens. Dit quelle clé de `access/entitlements.ts` va dans quel pilier. Codex l'applique en CX-06.
- [x] **CL-03 — Texte du consentement parental** en arabe et en français, adressé au parent, avec sa version. Fait : `docs/v2-consentement-parental.md` (version `parental-consent-2026-11-v1`). Nécessaire à CX-04.
- [x] **CL-04 — Revue des écrans Android** à partir du code : relever tout mot lié au prix ou à l'achat, en particulier `MosaicWorkshop`, `PremiumLearningLabs` et `GardenMission`. Fait : `docs/v2-revue-android-paiement.md` (3 points à corriger, CX-24).

## Phase 1 — Parcours 5AP de référence et essais simulés (1 au 21 décembre)

### Claude

- [x] **CL-05 — Spécification du parcours 5AP maths** : accueil, mission du jour, leçon en cinq étapes, phrases de Didou tirées de `rulesAr` et `keyFormulas`, laboratoire lié, bilan parent. Avec les critères d'acceptation par écran. Fait : `docs/v2-spec-parcours-5ap-maths.md` (fractions et division ; 4 décisions ouvertes pour Karim).
- [ ] **CL-06 — Relecture pédagogique de la 5AP**, maths puis arabe : questions, corrigés, distracteurs, bornes du programme. Résultat dans la grille de `v2-relecture-enseignant.md`, prête pour un enseignant.
- [x] **CL-07 — Diagnostic d'arabe 5AP** : questions et barème, sur le modèle de `data/diagnostic/math5ap.ts`. Fait : `frontend/src/data/diagnostic/arabic5ap.ts` (28 questions, 2 par compétence, à faire relire par un enseignant).
- [ ] **CL-08 — Essais simulés 4AP, 1AP et préscolaire**, un rapport par niveau.

### Codex

- [ ] **CX-06 — Appliquer les trois piliers** (`docs/v2-offre-trois-piliers.md`, section 5) dans la fiche d'offre et le registre des droits, sans changer les accès.
- [ ] **CX-07 — Construire le parcours 5AP maths** selon `docs/v2-spec-parcours-5ap-maths.md`, dans l'ordre de sa section 3. *Critère : les captures 360 × 640 et 390 × 844 correspondent à la spécification.*
- [ ] **CX-08 — Corriger les blocages** relevés par CL-01 puis CL-08, du plus grave au moins grave. Claude rejoue l'essai après chaque correction.
- [ ] **CX-09 — Brancher le diagnostic d'arabe 5AP** : ajouter `ARABIC_5AP_DIAGNOSTIC` à `DIAGNOSTIC_SETS` (`data/diagnostic/index.ts`), laisser le parent choisir maths ou arabe dans `DiagnosticModal`, mettre à jour le libellé de `levelDiagnostic` dans `access/entitlements.ts` (« maths et arabe 5AP ») et le tableau généré. *Critère : le test ciblé `utils/diagnostic.test.ts` passe pour les deux matières.*
- [ ] **CX-10 — Progression des jeux sauvegardée sur le serveur**, pour qu'un changement de téléphone ne la perde pas.

## Phase 2 — Immersion et attachement (22 décembre au 17 janvier)

### Claude

- [x] **CL-09 — Didou compagnon, le contenu** : pour chaque événement (bonne réponse, série, erreur, indice, fin), la pose et la phrase, au masculin et au féminin. Fait : `docs/v2-didou-phrases-lecon.md` (neutre par défaut, le profil n'a pas de genre).
- [ ] **CL-10 — Le sac de Didou, le contenu** : un objet par monde, liste, textes et consignes d'image (style, cadrage, fond, ce qu'il ne faut pas montrer). Codex génère les images en CX-12.
- [x] **CL-11 — Carte de Didou 5AP** : quelle leçon va dans quelle station des 8 mondes. Fait : `docs/v2-carte-5ap.md` (le plan existant est juste, aucun changement de code).
- [ ] **CL-12 — Voix à enregistrer** : liste des phrases fixes de Didou et des consignes de 1AP et 2AP, par ordre d'utilité.

### Codex

- [ ] **CX-11 — Didou compagnon dans les leçons** de 5AP puis de 4AP (`docs/v2-didou-phrases-lecon.md`, section 4) : pose par événement, indice après une erreur, règle après une réussite, bouton « ساعدني ».
- [ ] **CX-12 — Sac de Didou** (après CL-10) : générer les images des objets à partir des consignes de CL-10 (même style que les 8 mondes et les poses de Didou déjà dans `assets/world/`, WebP léger, aucun texte dans l'image), puis la collection par enfant, sauvegardée. Claude relit les images avant intégration.
- [ ] **CX-12b — Images restantes du monde de Didou** : île « espace » sans drapeaux, médailles 4 et 7 à refaire, décor de la Casbah moins « Santorin » (voir `docs/v2-pilote-prompts-nanobanana.md`). Claude relit avant intégration.
- [ ] **CX-13 — Défi du jour** : un niveau de jeu lié à la dernière leçon, sans série à perdre.
- [ ] **CX-14 — Ambiance sonore par monde**, avec un bouton pour couper, et **mode « données légères »** pour l'accueil. Le mode « données légères » est **une seule fonction partagée** (par exemple `utils/lightMode.ts`), réutilisée par le village, la planète (CX-15) et la carte. Elle est active si `navigator.connection.saveData` est vrai, si la connexion est lente (`effectiveType` en `2g` ou `slow-2g`) ou si le parent l'a choisie dans les réglages. Le mouvement réduit (`prefers-reduced-motion`) coupe les animations, mais pas les images.
- [ ] **CX-15 — Planète de Didou, carte 5AP et mode léger** (en même temps que CX-14).
  1. **Garder et réutiliser la planète tournante existante** (`components/journey/PlanetHub.tsx` : rotation avec les boutons « أدر الكوكب » / « Tourner la planète », 8 mondes, médailles). Ne pas en dessiner une nouvelle.
  2. **En faire l'accès aux mondes depuis le village**, en arabe et en français. En arabe : un lieu ou un bouton « كوكب ديدو » dans `components/home/DidouVillageHome.tsx` ouvre la planète, et un bouton visible ramène au village en un tap. En français, tant que le village n'existe pas dans cette langue : la carte « La planète de Didou » de l'accueil (`HomeView`, déjà présente) ouvre la même planète. Les textes de la planète passent déjà par `pickText` ; vérifier que chaque libellé, bulle de Didou et nom de monde existe dans les deux langues.
  3. **Stations 5AP : déjà reliées** (`PLAN_5AP`, vérifié en CL-11, `docs/v2-carte-5ap.md`). Il reste à vérifier sur un écran de téléphone que les 24 stations s'affichent sans chevaucher les décors ni les stations de jeux, en arabe et en français. Mondes 1 et 2 gratuits, mondes 3 à 8 avec le cadenas doré (`journeyAllWorlds`), sans prix.
  4. **Affichage statique en mode « données légères »** (fonction de CX-14) : une image fixe et légère de la planète, sans rotation animée, sans ambiance sonore ni décor animé. Les 8 mondes restent atteignables par des boutons de 60 px au moins (les flèches de rotation changent le monde affiché, sans animation). Décor de la planète d'environ 120 Ko au plus dans ce mode.
  *Critères : depuis le village, une station 5AP s'ouvre en trois taps au plus ; même parcours en français depuis l'accueil ; en mode léger, aucune animation ni son ne se lance et la planète reste utilisable ; captures en 360 × 640 et 390 × 844, en arabe et en français ; tests ciblés des fichiers modifiés.*

## Phase 3 — Offre professionnelle et conformité (5 janvier au 7 février)

### Claude

- [ ] **CL-13 — Page « Premium Famille »** : plan de la page, textes arabe et français, questions fréquentes, tableau gratuit / Premium court.
- [ ] **CL-14 — Projets de conditions de vente et de mise à jour de la politique de confidentialité**, à faire valider par un juriste avant publication Inclure les points 1 et 2 de `docs/v2-revue-android-paiement.md` (offres 3 et 12 mois, codes d'activation, reçus, aucun moyen de paiement nommé dans la version Android).
- [ ] **CL-15 — Dossier de conformité interne** (lot E) et brouillon du registre des traitements pour Karim.
- [ ] **CL-16 — Fiche Google Play et plaquette écoles** : textes et choix des captures, sans aucun prix sur la fiche.

### Codex

- [ ] **CX-16 — Construire la page « Premium Famille »** (après CL-13), avec le profil de démonstration clairement indiqué.
- [ ] **CX-17 — Essai Premium de 7 jours** : une fois par compte, lancé depuis le site, 2 sujets blancs au plus.
- [ ] **CX-18 — Droits du parent** (lot B) : export des données, suppression complète, liens légaux en bas de page.
- [ ] **CX-19 — Conservation** (lot C) : purge de nuit, comptes inactifs, Sentry sans données personnelles, aucun appel à une IA.
- [ ] **CX-23 — Batterie complète de fin**, une seule fois, quand Karim déclare le produit fini et avant CX-22 : TypeScript, suite Vitest complète, tests du serveur, build, tests navigateur. Corriger tout ce qui casse. Claude rejoue ensuite tous les essais simulés sur la version finale.
- [ ] **CX-22 — Mise en ligne, après CX-23.** Push de `v2` (sans forcer), serveur V2 hébergé sur sa propre base vide, site de test, client Google de l'APK bêta, APK `assembleBeta` installé sur un vrai téléphone. Les réglages des tableaux de bord sont vérifiés avant le premier push (`docs/v2-tests-isoles.md`). *Critère : les parcours testés en local fonctionnent aussi en ligne et sur l'APK, sans trace dans la V1.*

## Phase 4 — Ouverture de la vente (8 février au 7 mars 2027)

- [ ] **CX-20 — Mesure du parcours** : inscription, activité chaque semaine, carnet activé, essai, paiement ; indicateur « leçon terminée dans les 24 h ».
- [ ] **CX-21 — Alerte au parent** le jour où l'enfant bloque, et résumé par jeu dans le carnet.
- [ ] **CL-17 — Textes de campagne** : avant les compositions du 2e trimestre, Ramadan, e-mail du jeudi.
- [ ] **CL-18 — Essai simulé du parcours d'achat** : essai, code d'activation, reçu, fin d'abonnement et retour au gratuit.

## Ce qui dépend de Karim

- [ ] Donner le feu vert aux essais simulés (CL-01) et dire à Codex que le périmètre est gelé.
- [ ] Lancer Docker Desktop avant chaque séance de test local (CX-01).
- [ ] Le jour où le produit est fini : donner le feu vert à la mise en ligne, fournir les accès Render et le client Google de l'APK bêta (CX-22), puis installer l'APK sur un téléphone.
- [ ] Compte ANPDP, registre des traitements, demande de transfert vers l'étranger.
- [ ] Statut juridique (ANAE ou registre de commerce) et choix de la passerelle de paiement.
- [ ] Trouver un enseignant relecteur de 5AP et 3 à 5 familles volontaires parmi les utilisateurs de la V1.
