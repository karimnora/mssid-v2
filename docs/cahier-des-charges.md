# Cahier des charges — Mssid DZ (مَسِيد)

| | |
|---|---|
| **Produit** | Mssid DZ — application éducative du primaire algérien |
| **Version** | 1.2 |
| **Date** | 22 août 2026 |
| **Statut** | Décision produit ratifiée (lancement gratuit, souk plus tard) |
| **Auteur** | Karim — ingénierie produit / technique |
| **Public du document** | Produit, technique, store, partenaires pédagogiques |
| **Documents liés** | `DOCUMENTATION.md` (architecture) · `CLAUDE.md` (référentiel الجيل الثاني) · `frontend/src/featureFlags.ts` |

Ce document **prime** sur `DOCUMENTATION.md` §1.2 dès qu’il y a contradiction (accès Premium, verrouillage T2/T3, quota IA). L’architecture technique reste dans `DOCUMENTATION.md`.

---

## 1. Objet

Spécifier ce que **Mssid DZ livre au lancement** (site + Play Store), ce qui reste **toujours gratuit**, ce qui pourra être **vendu plus tard**, et les contraintes qui ne se négocient pas.

La règle : on remplit le cartable, on le donne. On n’enlève pas les cahiers déjà donnés pour ouvrir une caisse.

---

## 2. Contexte et vision

Mssid DZ numérise le **programme officiel du Ministère de l’Éducation Nationale algérien (الجيل الثاني)** pour le primaire, avec un personnage (Dido), des labs interactifs, un tuteur IA, un module préscolaire, et une application Android (Capacitor).

Lancement visé : **site (Vercel) + fiche Play Store**, **gratuit et complet** pour tous. La monétisation n’est pas un interrupteur sur le programme déjà livré : c’est une étagère d’options, ouverte seulement quand la communauté est assez grande.

Paliers de récit (pas un contrat chiffré) :

| Palier | Ordre de grandeur | Promesse |
|---|---|---|
| Cartable | 0 élèves | L’app s’ouvre, les leçons marchent |
| Rentrée | 0 → 5 000 | Chaque enfant entre sans payer |
| Récré | 5 000 → 50 000 | Bouche-à-oreille, pas de cadenas |
| Brevet | 50 000 → 100 000 | On prépare le paiement, rien n’est retiré |
| Souk | après 50–100k | On vend des extras |

---

## 3. Public cible

| Acteur | Besoin | Contrainte |
|---|---|---|
| Élève 6–11 ans (1AP–5AP) | Cours, quiz, labs, défis, Dido | Arabe d’abord, peu de scroll, un CTA par écran |
| Enfant préscolaire | Jeux / portes d’activités, pas un CMS scolaire | Audio aligné sur ce qui est à l’écran |
| Parent | Confiance, progression, pas de surprise payante | Compte optionnel ; pas de mur avant le 1er cours |
| Enseignant | Alignement programme, usage classe | Pas un LMS de notes au lancement |
| Admin Mssid | CMS, flags, reçus plus tard | Pas de comptes démo visibles en prod |

Langue **chrome** (menus, boutons hors fiche pédagogique) : arabe par défaut, français au choix explicite. **Jamais** déduire la langue du `navigator.language`. Les **cours**, **leçons** et **sujets d’examen** restent rédigés et affichés **en arabe** même si l’interface est en FR (sauf français / anglais / tamazight selon la matière).

Public Play Store : **6–11 ans**. Fiche et politique de confidentialité en **ar + fr**.

---

## 4. Objectifs

### 4.1 Produit

1. Un élève **invité** parcourt le programme livré **sans payer et sans compte**.
2. Un compte sert à **sauver** XP, badges, progression — pas à débloquer un trimestre.
3. L’IA est un plus derrière un compte, avec un **petit quota** quotidien.
4. Plus tard, on vend des **ajouts**. On ne reprend pas T2, T3, le préscolaire, les labs, les défis ni les annales déjà dans le bundle.

### 4.2 Pédagogie

Tout contenu de cours / exercice / quiz 1AP–5AP est **conforme au programme officiel** (`CLAUDE.md`). Pas de notion hors niveau. Situations ancrées en Algérie quand c’est un problème de vie quotidienne.

### 4.3 Confiance

Pas de Premium promis sur la fiche store au lancement. Pas de leçon vide. Pas de bouton Admin / mot de passe démo en production.

---

## 5. Périmètre fonctionnel

### 5.1 Dans le cartable (gratuit au lancement et ensuite)

| ID | Module | Exigence |
|---|---|---|
| **C-01** | Cours 1AP–5AP | Toutes les leçons déjà dans l’app, **y compris T2 et T3**, jouables sans abonnement. `math-5ap-division` est **entièrement dans le bundle JS** (Phase 100). |
| **C-02** | Invité | Accès catalogue + leçon + quiz sans authentification. |
| **C-03** | Compte | Inscription email / mot de passe. Sauvegarde XP, badges, progression. |
| **C-04** | Préscolaire | Toujours visible (plus de flag `enablePreschoolModule`). Hub, activités, défi du jour en heure locale. |
| **C-05** | Labs | Outils pédagogiques activés : labs avancés, lecture vocale, calculatrice, writing lab. **1AP/2AP** : hub de **4 tuiles** (bande numérique, éveil, سوق, écriture) — pas les 4 catégories desktop, pas d’ouverture auto d’un labo, pas le conjugueur arabe. **3AP–5AP** : hub catégories. Lien profond / 3AP+ : jamais le conjugueur avant 3AP (`primary_math_ops`). |
| **C-06** | Examens | Toujours visible (plus de flag `enableExamSection`). Banque du **bundle** (devoirs, compositions, BEP), pas un paywall. **1AP** : état vide + calculateur de moyenne, pas de faux sujets officiels. **2AP** : funnel type → matière → **un sujet à la fois**. Timer, impression et « tout afficher les solutions » **seulement en 4AP–5AP**. |
| **C-07** | Fiches imprimables | Bouton impression/PDF activé (`enablePrintablePDFs: true`) au lancement. Un pack « plus » pourra s’ajouter plus tard sans retirer celui-ci. |
| **C-08** | Défis | Arène / défi du jour utilisable sans paiement. |
| **C-09** | Tuteur IA | Compte requis. Quota **3 questions / jour** (`ROLE_FREE`). Pas d’IA pour un invité. |
| **C-10** | Chrome bilingue | ar par défaut, fr au switch manuel. |

**Tamazight** (`tamazight`) : flag **éteint** au lancement. Hors cartable v1 tant que le flag n’est pas ouvert volontairement.

### 5.2 Au souk (payant, après palier communauté)

Rien de ceci n’est vendu au jour du lancement. Le code de paiement **existe** et reste **éteint**.

| ID | Offre | Commentaire |
|---|---|---|
| **P-01** | Quota IA élevé | Déjà en code : **50 / jour** (`ROLE_PREMIUM`) vs 3 en gratuit. Admin : 1000. |
| **P-02** | Packs d’annales **extra** | Sujets / corrigés **ajoutés après** le brevet — pas les annales déjà livrées. |
| **P-03** | Fiches imprimables premium | Packs supplémentaires (cahiers, séries). Le bouton actuel reste. |
| **P-04** | Espace parent | Plusieurs enfants, récap semaine. **N’existe pas encore** comme produit. |
| **P-05** | Nouveaux modules | Contenu créé après ouverture du souk, annoncé comme option, pas comme retrait. |

**Tarif déjà câblé côté serveur** : `app.payments.subscription-price-dzd=1500` (DZD / an). À **confirmer** avant ouverture réelle. Moyens prévus : BaridiMob / Edahabia / CCP. Un reçu = validation **humaine** (admin), jamais un faux bouton « valider Premium » côté client.

### 5.3 Mécanisme technique (présent, éteint)

| Flag / pièce | Défaut | Règle |
|---|---|---|
| `enablePayments` | `false` | Interrupteur maître. Seul, il ne verrouille rien. |
| `enableTrimesterPaywall` | `false` | T2/T3 verrouillés **seulement si les deux flags sont ON**. |
| `premiumContentPending` | inutilisé en 5AP maths | Champ conservé pour d’éventuels **nouveaux** shells, pas pour vider le bundle actuel. |
| `GET /api/v1/courses/premium-lessons/{id}` | code conservé | Non requis pour `math-5ap-division`. |
| Recus / `ROLE_PREMIUM` | code conservé | Inactif tant que `enablePayments` est off. |

**Interdit** : flipper `enableTrimesterPaywall` pour cacher le T2/T3 déjà livré. Si un cadenas apparaît un jour, il ne s’applique qu’à du **contenu nouveau** explicitement hors cartable.

Les flags `enableExamSection` et `enablePreschoolModule` **n’existent plus** : examens et préscolaire sont toujours dans le cartable.

---

## 6. Exigences fonctionnelles détaillées

### 6.1 Parcours élève

| ID | Exigence | Critère d’acceptation |
|---|---|---|
| **F-01** | Premier cours sans mur d’inscription | Depuis l’accueil, un invité atteint une leçon T1 **et** une leçon T2 en moins de 3 tapotements utiles (matière → trimestre → leçon). |
| **F-02** | Leçon complète | Titre, résumé, règles (≥ 2), exemples, quiz avec une seule bonne réponse et explication. |
| **F-03** | Pas de coquille vide | Aucune leçon du catalogue 5AP maths n’a `premiumContentPending`. Toute leçon ouverte montre règles / vocabulaire sans fetch `/premium-lessons`. |
| **F-04** | Progression | Compte connecté : XP et badges persistent après rechargement (API Spring). Invité : usage local acceptable, perdu au reset navigateur. |
| **F-05** | Parent gate | Actions sensibles (ex. suppression de compte) passent par `ParentGateModal`. |
| **F-06** | Paywall UI | Le composant paywall peut rester dans le code. Il ne s’affiche **pas** tant que les deux flags paiement sont off. |
| **F-07** | Accueil 1AP / 2AP | Un seul bouton principal (« Réviser les cours »). Préscolaire = lien texte. 3AP–5AP : quatre pôles. |
| **F-08** | Nav mobile 1AP / 2AP | Quatre onglets : accueil, cours, labs, profil. Tuteur IA et examens hors barre. |
| **F-09** | Leçon, un CTA | Un bouton d’action « Suivant ». En 1AP/2AP : pas de fiche imprimable ni précédent/suivant en en-tête ; parcours séquentiel. |
| **F-10** | Leçon terminée | Une leçon n’entre dans `completedLessonIds` **que** si le quiz interactif est réussi à 100 % (ou s’il n’y a pas de quiz, au tap sur le CTA de fin). Une bonne réponse isolée donne de l’XP, pas le cours. |
| **F-11** | Hub labs 1AP / 2AP | Quatre tuiles max : bande numérique, éveil scientifique/civique, سوق الجزائري, atelier d’écriture. Un tap ouvre l’outil. Retour = les 4 tuiles. |
| **F-12** | Navbar enfant 1AP / 2AP | Chrome enfant : accueil + choix de niveau. Thème, langue, préscolaire, tuteur IA, compte / admin : **tiroir ولي الأمر**. 3AP–5AP : barre complète. |
| **F-13** | Examens 2AP | Après le type (devoir / composition) et la matière, un seul CTA « ابدأ الموضوع » (prochain sujet non fait). Pas de grille de toutes les copies. Pas de timer / imprimer / tout-afficher avant 4AP. |
| **F-14** | Liste des cours | Funnel matière → trimestre → cartes de leçons (titre, résumé, badges). **Ne pas** compresser 1AP/2AP en une colonne « titre + coche + CTA leçon suivante » : ce changement a été retiré. |

### 6.2 Auth et rôles (lancement)

| Rôle | Au lancement |
|---|---|
| Invité | Catalogue + leçons + labs + préscolaire + examens bundle. Pas d’IA. Profil de départ : **1AP**, 0 XP, aucune leçon seed. |
| `ROLE_FREE` | Idem + sauvegarde + IA 3/jour. |
| `ROLE_PREMIUM` | Même cartable. Quota IA 50/jour. **Pas** de leçons en plus tant que le souk n’a pas d’offre additive. |
| `ROLE_ADMIN` | CMS, flags, reçus, users. Invisible au grand public. |

Les libellés « PREMIUM / PRO » dans la navbar ne justifient **pas** un cadenas pédagogique au lancement.

### 6.3 Admin / ops

| ID | Exigence |
|---|---|
| **A-01** | Comptes démo / `password123` / switch de rôle : **hors production** (build, flag, ou suppression UI). |
| **A-02** | Flags serveur hydratés au boot (`GET /api/v1/feature-flags`). Un admin sur un autre appareil fait foi. |
| **A-03** | Logs SQL DEBUG coupés en prod. |
| **A-04** | Reçus : montant ≠ 1500 DZD rejeté (tant que le tarif reste 1500). |

---

## 7. Exigences pédagogiques

| ID | Exigence |
|---|---|
| **PED-01** | Niveaux : préscolaire + 1AP à 5AP. Pas de collège dans v1. |
| **PED-02** | Matières cœur : arabe, maths, sciences, islamique, civique ; dès 3AP : français, anglais, histoire-géo (tamazight selon flag). |
| **PED-03** | Maths 5AP : nombres jusqu’au milliard, fractions, décimaux, proportionnalité, aires / volume pavé, conformément à `CLAUDE.md`. |
| **PED-04** | Une leçon = une notion du programme, pas un chapitre inventé. |
| **PED-05** | Design : pastel, fond `#F8F9FA`, texte `#1E293B`, coins très arrondis, spring Framer Motion, un bouton d’action principal par écran. |
| **PED-06** | Catalogue : les leçons manquantes du programme s’ajoutent en **fichiers neufs** (ex. 1AP المدود / comparaison ; 5AP cercle, Projet 3 inventions & écologie, *will* + directions). **Interdit** de réécrire un fichier de leçon déjà livré. |

---

## 8. Exigences non fonctionnelles

| ID | Thème | Exigence |
|---|---|---|
| **NF-01** | Plateformes | Web (Vercel) + Android (Capacitor / Play). iOS hors v1. |
| **NF-02** | Hors-ligne | Leçons **bundlées** lisibles sans API (PWA / cache). IA, login, sync progression : réseau requis. |
| **NF-03** | Perf | Phaser hors du chunk principal (Phase 95). Workbox : plafond déjà fixé (~8 MiB). Pas de régression « page blanche au premier cours ». |
| **NF-04** | Locale | Défaut `ar`. Choix `fr` persisté en localStorage uniquement si l’utilisateur l’a choisi. |
| **NF-05** | RTL | Interface arabe RTL correcte ; labs latin LTR là où le graphème l’exige. |
| **NF-06** | Enfants | Pas de pub tierce, pas de chat ouvert, IA cadrée pédagogique. |
| **NF-07** | Sécu | JWT + cookie ; quota IA **uniquement** depuis l’identité JWT (pas d’en-têtes `x-user-role` client). CORS et `COOKIE_SECURE` corrects en HTTPS. |
| **NF-08** | Qualité | `npx tsc --noEmit` et tests Vitest/JUnit du périmètre touché verts avant merge `main`. |

---

## 9. Conformité, store, données

| ID | Exigence |
|---|---|
| **L-01** | Politique de confidentialité publiée (URL Play), ar + fr. |
| **L-02** | Fiche Play : public 6–11 ans, captures Dido, **aucune** mention Premium au lancement. |
| **L-03** | Compte enfant : minimum de données (email parent / tuteur pour le compte). Pas de tracking pub. |
| **L-04** | Paiement réel : cadre Algérie (CCP / BaridiMob) **avant** d’allumer `enablePayments`. Pas d’encaissement « jouet ». |
| **L-05** | Grand-père : ce qui était gratuit dans l’APK installé **reste** gratuit pour ces installs. Annonce **4 semaines** avant tout souk. |

---

## 10. Architecture (contraintes de réalisation)

Stack actuelle, non renegociée par ce CdC :

- **Frontend** : React 18, Vite, TypeScript, Tailwind, Framer Motion, Capacitor, PWA.
- **API** : Spring Boot Java 21 (auth, progression, flags, reçus, quota IA).
- **IA** : proxy Gemini ; quota `AiQuotaService` (3 / 50 / 1000).
- **Cours** : données TypeScript dans `frontend/src/data/courses/` — source de vérité du cartable.
- **Hébergement visé** : Vercel (front) + backend déjà déployé (Render ou équivalent) ; `VITE_SPRING_BOOT_URL` en HTTPS.

Le backend de reçus et `PremiumContentController` **ne se suppriment pas**. Ils restent dormants.

---

## 11. Hors périmètre (v1 lancement)

- Verrouiller T2/T3 ou une leçon déjà shippée.
- iOS / App Store.
- LMS enseignant (notes, classes, devoirs rendus).
- Chat pupils-to-pupils ou réseau social.
- Tamazight tant que son flag est off.
- Paiement in-app Google Play Billing (le flux prévu est reçu BaridiMob / CCP).
- Promettre « IA illimitée » (le code dit 50/jour en Premium, pas illimité).
- Collège, lycée, BEM comme produit principal (les annales 5AP du bundle oui).

---

## 12. Livrables par palier

### Niveau 0 — Cartable (avant ouverture publique)

- [x] Réintégrer `math-5ap-division` dans le JS (Phase 100, `82c0e9c`).
- [ ] Masquer démo / switch de rôle hors développement.
- [ ] Env prod : API HTTPS, JWT, cookies, CORS, pas de SQL DEBUG.
- [ ] APK / AAB signé, pas de WebView debug.
- [ ] Privacy URL + fiche Play ar/fr.
- [ ] Flags `enablePayments` et `enableTrimesterPaywall` **false** en prod.

### Niveau 1 — Rentrée

Site + Play (ou test interne d’abord). Relais enseignants / parents. Bugs 1 étoile corrigés en moins de 48 h. IA derrière compte + quota 3.

### Niveau 2 — Récré

Nouveau mini-jeu ou pack de leçons **gratuit**. Lire les avis. Mesurer actifs 7 jours et leçons terminées, pas seulement les installs.

### Niveau 3 — Brevet (50–100k)

Cadre paiement vérifié. Message ar+fr : voici ce qui reste libre, voici ce qui s’ajoute. Test flags sur **~5 %** des comptes, pas un big bang.

### Niveau 4 — Souk

Allumer **`enablePayments` seulement**. Offres P-01 à P-05. **`enableTrimesterPaywall` reste off** pour le contenu déjà livré.

---

## 13. Critères d’acceptation — go store

On publie si :

1. Un invité termine une leçon T2 maths 5AP (division) **sans** appel premium et **sans** compte.
2. Aucun cadenas T2/T3 n’apparaît avec les flags par défaut.
3. L’IA refuse l’invité et limite le compte free à 3/jour.
4. Pas d’entrée admin / mot de passe de démo visible.
5. Privacy + fiche Play présentes.
6. Build Vercel et AAB générables ; le premier cours s’affiche sur un téléphone milieu de gamme.

On **n’ouvre pas** le souk si : note Play sous ~4,2, IA en panne chronique, ou paiement non encaissable légalement.

---

## 14. Risques

| Risque | Mitigation |
|---|---|
| Tentation de lock T2 « pour payer les serveurs » | Ce CdC + flags doubles + grand-père |
| `DOCUMENTATION.md` dit encore « Premium = annales » | Ce document prime ; mettre à jour l’archi plus tard |
| Quota IA 3 trop juste / trop généreux | Ajuster les constantes, pas le cartable |
| Leçon encore en shell | Test `no 5AP math lesson is left as a premiumContentPending shell` |
| Recette 1500 DZD figée trop tôt | Confirmer au palier Brevet avant communication publique |

---

## 15. Glossaire

| Terme | Sens ici |
|---|---|
| **Cartable** | Tout le programme et outils déjà dans l’app, gratuits. |
| **Souk** | Options payantes additives, après 50–100k. |
| **T2 / T3** | Trimestres 2 et 3. Toujours dans le cartable s’ils sont déjà livrés. |
| **Shell** | Leçon bundle sans quiz/règles, hydratée par API. Interdit pour le catalogue actuel 5AP maths. |
| **Invité** | Utilisateur sans JWT. |

---

## 16. Historique du document

| Version | Date | Contenu |
|---|---|---|
| 1.1 | 22 août 2026 | Cartable gratuit, flags examens/prépa retirés, F-07 à F-10 (accueil, nav, leçon). |
| 1.2 | 22 août 2026 | UX 6–11 ans : F-11 labs 4 tuiles, F-12 tiroir parent, F-13 examens 2AP, F-14 liste des cours inchangée. C-05 / C-06 alignés. PED-06 (nouveaux fichiers de leçons, pas de réécriture). |

*Fin du cahier des charges v1.2. Toute modification des §5.2, §5.3 ou §11 (souk, flags T2, hors périmètre) exige une décision explicite de Karim.*
