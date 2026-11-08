# Recommandation design finale V2 — valeur et Premium (6 novembre 2026)

Destinataire : Codex, sur la branche `v2` uniquement. Ce document fusionne :
- la revue du commit `415c647` (village de Didou connecté) ;
- le plan design proposé par Codex.

Il donne l'ordre de travail, les critères d'acceptation et les points à ne pas réinterpréter.

---

## 0. Règles non négociables

- **Branches.** Travailler sur `v2` seulement. Ne jamais toucher `main` : c'est la prod, déployée automatiquement. Commits en anglais, préfixés `feat(v2):` ou `fix(v2):`.
- **Données réelles.** Aucune donnée fictive dans l'application : pas de fausse progression, de faux bilan, de faux avis ni de fausse étoile. Les démonstrations utilisent un profil de démo clairement identifié, jamais un vrai enfant.
- **Pédagogie.**
  - Ne modifier ni questions, ni corrections, ni notes, ni règles de validation, ni XP sans demande explicite.
  - Respecter le programme officiel (CLAUDE.md, section 3).
- **Décisions business du 3 novembre 2026** (source : `docs/v2-todo-business.md`) :
  - deux offres seulement : 900 DA / 3 mois et 2 400 DA / 12 mois ;
  - jusqu'à 6 enfants par abonnement ;
  - carte de Didou : mondes 1 et 2 gratuits, mondes 3 à 8 Premium ; les leçons restent gratuites dans « دروسي » ;
  - **5AP en priorité** (maths puis arabe) ;
  - fond `#FFFBF0` partout, sauf la planète et la carte de Didou ;
  - accueil par niveau à tester : 1AP sur la carte, 2AP–5AP sur « مهمتي اليومية ».
- **Sollicitation commerciale.** Elle passe toujours par l'espace parent, derrière le *Parent Gate*. Jamais de prix ni de paiement affichés devant l'enfant seul.
- **Coût.** Aucun appel payant (OpenAI ou autre) au clic de l'enfant. Les voix sont générées une seule fois, compressées puis réutilisées.

---

## 1. Revue du commit `415c647`

### Ce qu'il faut garder
- Le compteur filtré par classe et par leçons publiées entièrement validées (`connectedHomeProgress`).
- La mission enregistrée par compte + enfant + classe + date.
- Le remontage du parcours au changement de profil.
- La séparation jeux / examens (« تحدٍّ سريع », groupe « أقيّم تعلّمي »).
- Les MP3 générés une seule fois.
- Le respect de `saveData` et du mouvement réduit, le piège de focus et les cibles d'au moins 60 px.
- La qualité du décor et de Didou : c'est la référence visuelle à atteindre partout.

### Ce qu'il faut corriger
1. **Les comptes gratuits ne voient jamais le village.** Il est conditionné à `isPremiumRole && designMode === 'world'` (`App.tsx` ~l.381). La plus belle vitrine est cachée à ceux qu'on veut convertir.
2. **Le code est resté un prototype.**
   - `DidouHomePreview.tsx` est un composant fourre-tout : audio, visite, fenêtres, piège de focus dupliqué deux fois, JSX très compacté.
   - `homePreview.css` fait 21 Ko de CSS minifiée à la main.
   - Le composant porte encore le nom « Preview » et vit dans `src/design/`.
   - `href: '/courses?g=2AP'` est codé en dur dans `PLACES`.
3. **Les lieux trompent l'enfant.**
   - « دار الحكايات » ouvre tout le catalogue, maths comprises.
   - « دروسي » ouvre aussi les cours : deux entrées pour la même chose.
4. **Vocalisation incomplète.** Le compteur, la mission et la prochaine leçon ne sont pas lus. C'est contraire à la règle 1AP de CLAUDE.md : 100 % des consignes avec audio.
5. **Voix au masculin seulement** (« صديقكَ، سأريكَ »), même pour une fille.
6. **Hiérarchie inversée.**
   - Le titre « لنلعب ونتعلّم » met le jeu en premier.
   - La progression est petite et cachée derrière un tap.
   - Le parent qui paie, surtout en 5AP, cherche d'abord l'apprentissage.
7. **Incohérence de langue.** Le village n'existe qu'en arabe ; le français garde `PlanetHub`.
8. **Poids de l'accueil.** Environ 1,2 Mo d'images et de voix : il faut un mode « données légères ».

## 2. Revue du plan Codex

**Ce qui est bon et repris :**
- la promesse « apprend avec plaisir, aidé quand il bloque, le parent voit les progrès » ;
- Didou comme compagnon utile ;
- le déroulement commun *découvrir → essayer → comprendre → s'entraîner → résultat* ;
- l'alternative tap-tap au glisser-déposer ;
- le bilan parent sobre (« seul / avec aide ») ;
- la démonstration avant paiement ;
- les sollicitations commerciales dans l'espace parent.

**Ce qui est ajusté :**
- **Pas de « design system » complet avant de livrer.** Extraire uniquement les tokens et composants que le village utilise déjà (lot 1), puis les éprouver sur une tranche verticale réelle (lot 2).
- **Le préscolaire ne passe pas en premier.** La décision du 3 novembre donne la priorité à 5AP, le niveau où les parents paient. La tranche de référence est en **5AP maths** ; le préscolaire vient au lot 6.
- **« Didou explique ce qui a été compris » s'appuie sur le contenu existant** (`rulesAr`, `keyFormulas`, `summaryAr`) et sur l'aide « مساعدي » existante : indice et règle illimités, 3 corrections détaillées par jour en gratuit. Aucun texte pédagogique inventé à la volée.
- **Le plan oubliait trois sujets** : la consolidation du code du village, l'ouverture du village aux comptes gratuits avec des cadenas visibles, et la mesure de la conversion. Ils sont ajoutés ci-dessous.
- **Les tests familles** se font avec le pilote déjà prévu (5 à 10 familles 4AP/5AP), pas avec un panel séparé.

---

## 3. Plan de réalisation (dans cet ordre)

### Lot 0 — Consolider le village, sans changer son rendu
- Renommer `DidouHomePreview` en `DidouVillageHome` et le déplacer dans `src/components/home/`. La page `design-accueil.html` continue d'importer le même composant.
- Extraire :
  - `useDidouVoice` : lecture, interruption, préchargement, voix unique ;
  - `useFocusTrap` : un seul exemplaire, réutilisé par les deux fenêtres et `PlanetShelf` si possible ;
  - `VillageDialog` : la fenêtre « دروسي » et la fenêtre de lieu.
- Réécrire `homePreview.css` en CSS lisible, basée sur des variables (tokens du lot 1).
- Supprimer les `2AP` codés en dur.

**Critère d'acceptation** : captures avant/après identiques en 360×640, 390×844 et 1280×800 ; tests existants du village verts.

### Lot 1 — Fondations visuelles minimales
Elles sont extraites du village, pas inventées.
- **Tokens** : couleurs (fond `#FFFBF0`, couleurs des pôles cours / labos / jeux / examens), typographie Cairo avec ses tailles minimales, rayons, ombres « 3D » des boutons, durées et courbes de mouvement (reprendre `motionTokens`).
- **Composants** : bouton principal, bouton secondaire, carte, dialogue, bulle de Didou avec sous-titre et bouton réécouter, barre de progression.
- **Grammaire Premium unique** :
  - un badge doré ✦ et un cadenas doré ;
  - la même formulation partout (« مع العائلة المميّزة ») ;
  - une seule fiche d'offre réutilisée partout.
- **Spécification de Didou** : poses existantes (accueille, montre, célèbre) et poses à produire (réfléchit, encourage après une erreur, regarde un objet). Pour chaque pose, préciser quand l'utiliser.

**Critère d'acceptation** : le village utilise ces tokens ; un document court `docs/design/v2-fondations.md` les liste.

### Lot 2 — Tranche verticale Premium de référence : 5AP maths
Un seul parcours complet, de bout en bout, avec de vraies données.

1. **Accueil village.**
   - Placer la carte « دروسي » en tête : prochaine leçon, barre de progression et bouton « أكمل » en **un seul tap**.
   - Passer le titre à « نتعلّم ونلعب ».
2. **Mission du jour en 2AP–5AP** (proposition du 3 novembre) : priorité à une compétence à revoir, puis à une leçon interrompue, puis à la leçon suivante.
3. **Une leçon de maths 5AP au format commun** : je découvre → j'essaie → je comprends → je m'entraîne → je vois mon résultat.
   - Une idée par étape et une consigne audio.
   - Pour les problèmes, respecter la présentation officielle à deux colonnes : `الحل` à gauche et `العمليات` à droite.
4. **Didou compagnon dans cette leçon.**
   - Après une erreur : un indice précis tiré de « مساعدي », un encouragement, puis un nouvel essai.
   - Après une réussite : il reformule la règle (`rulesAr` / `keyFormulas`).
   - Un bouton « ساعدني » toujours visible, et du temps laissé pour réfléchir (aucune aide imposée avant une dizaine de secondes).
5. **Un labo 5AP lié à la leçon.** Afficher en tête trois lignes : *ce que je découvre / ce que je manipule / ce que je saurai expliquer*. Prévoir l'alternative tap-tap au glisser-déposer.
6. **Bilan parent de cette séance.**
   - Contenu : compétences travaillées, réussites « seul » et « avec aide », exemple d'activité réalisée, prochaine étape concrète.
   - Les points et récompenses restent secondaires.

**Critère d'acceptation** : une famille 5AP peut faire le parcours sans aide extérieure ; toutes les données affichées viennent du vrai profil.

### Lot 3 — Rendre le Premium visible sans frustrer
1. **Village ouvert à tous.**
   - Supprimer la condition `isPremiumRole` sur l'accueil village et garder la possibilité de revenir à l'accueil classique.
   - En gratuit, les mondes 1 et 2 sont ouverts.
   - Les éléments Premium restent **visibles** avec le cadenas doré, jamais masqués.
2. **Tap sur un cadenas, côté enfant.**
   - Didou dit une phrase positive (« هذا العالم ينتظرك! اطلب من أوليائك ») et montre un aperçu animé de 5 secondes.
   - Aucun prix n'est affiché.
   - Un bouton « أخبر أوليائي » marque l'intérêt de l'enfant dans l'espace parent.
3. **Côté parent, derrière le Parent Gate.**
   - Une carte « ما يحصل عليه طفلك مع المميّز » avec un aperçu **flouté du vrai bilan détaillé** de son enfant : compétences, plan de la semaine, partage WhatsApp.
   - En 5AP, mettre en avant la préparation au CEM, avec le premier exercice offert (`cemPrep.freeAllowance`).
4. **Démonstration avant paiement.**
   - La tranche du lot 2 est jouable en entier par un compte gratuit, une fois, sur un profil de démo identifié.
   - La démo enchaîne accueil, manipulation, aide, réussite et aperçu du bilan parent.
5. **Page d'abonnement.**
   - Cinq bénéfices concrets, chacun illustré par une **vraie capture** de l'application :
     - parcours adapté ;
     - accompagnement vocal ;
     - ateliers et jeux ;
     - corrections détaillées et révisions ;
     - suivi parent.
   - Un comparatif clair gratuit / Premium et les deux prix (900 DA / 2 400 DA).
   - La mention « jusqu'à 6 enfants », et une phrase sur ce qui se passe à la fin du Premium (retour au gratuit sans perte de données).

**Critère d'acceptation** : aucun prix n'est visible sans passer le Parent Gate ; aucune fonctionnalité gratuite actuelle n'est retirée.

### Lot 4 — Accessibilité intégrée
Ce lot s'applique au village, à la tranche du lot 2 et aux écrans du lot 3.

- **Vocaliser tout le texte utile en 1AP–2AP** : compteur, mission, prochaine leçon.
  - Assembler des fragments pré-enregistrés (« بقي لك » + nombre + « دروس »).
  - Aucune génération au clic.
- **Variantes masculin et féminin** des voix et sous-titres du village, choisies selon le profil. Si le genre n'est pas connu, utiliser une formulation neutre.
- **Contraste WCAG AA vérifié** pour tout texte posé sur le décor :
  - texte d'au moins 16 px ;
  - les légendes de 13 px sur fond semi-transparent doivent passer sur un fond opaque.
- **Signaux redondants** : aucune information portée seulement par la couleur ou le son ; jamais de texte rouge agressif à l'erreur.
- **Contrôles** : clavier, focus visible, dialogues accessibles, TalkBack en arabe.
- **Mode « données légères »** : un décor d'environ 120 Ko au maximum et les animaux chargés en différé quand `saveData` est actif ou la connexion lente.

**Critère d'acceptation** : contrôles réussis en 360×640, sans débordement horizontal.

### Lot 5 — Test familles et mesure
- **Pilote** : 5 à 10 familles 4AP/5AP (le pilote prévu). Observer les hésitations, les demandes d'aide et les taps sur les cadenas.
- **Événements à mesurer, sans données personnelles inutiles** (loi 18-07 et déclaration ANPDP avant le test) :
  - tap sur un cadenas ;
  - « أخبر أوليائي » ;
  - ouverture de la fiche d'offre ;
  - démonstration terminée ;
  - abonnement.
- **Expérience A/B** : deux variantes du cadenas, par exemple aperçu animé contre simple message de Didou.

### Lot 6 — Déploiement du modèle validé
- **Ordre de déploiement** :
  1. les autres matières de 5AP (arabe, avec le tableau de I'rab الكلمة | إعرابها) ;
  2. 4AP ;
  3. 2AP et 3AP ;
  4. 1AP (accueil sur la carte) ;
  5. le préscolaire : village zéro texte, 3 grosses cibles de 72 px, consignes 100 % parlées, activités courtes.
- **Lieux et matières** : chaque lieu doit ouvrir ce qu'il promet. Par exemple :
  - « دار الحكايات » pour l'arabe et la lecture ;
  - une « دار الأرقام » pour les maths ;
  - « ورشة الاكتشاف » pour les sciences et les labos ;
  - « حديقة الألعاب » pour les défis.
  - Les examens restent dans « دروسي ».
  - Faire valider la carte des lieux par Karim avant de produire de nouvelles images.
- **Français** : porter le village en français, ou décider explicitement qu'il reste réservé à l'arabe (décision à demander à Karim).
- **Didou** : produire les nouvelles poses du lot 1 (réfléchit, encourage, regarde).

---

## 4. Points à faire valider par Karim avant de coder
1. L'ouverture du village aux comptes gratuits (lot 3.1).
2. La démo unique avant paiement sur un profil de démo (lot 3.4).
3. La carte « lieux ↔ matières » et la création de « دار الأرقام » (lot 6).
4. Le village en français : oui ou non.
5. La règle de vocalisation masculin / féminin / neutre quand le genre n'est pas renseigné.

## 5. Rapport attendu à la fin de chaque lot
Le rapport liste :
- les fichiers modifiés et ce qui a changé ;
- les captures avant/après aux trois tailles ;
- les vérifications lancées et leur résultat ;
- ce qui reste ouvert ;
- les écarts éventuels avec ce document, avec leur justification.
