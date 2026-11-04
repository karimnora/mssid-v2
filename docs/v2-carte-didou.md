# V2 — Kawkab Didou : planète et carte de voyage

## Décisions de Karim (3 novembre 2026)

- **Style « monde de jeu » inspiré d'Adibou par Wiloki** (ciel étoilé, boutons brillants, Didou sur un ruban) pour la planète et la carte uniquement. C'est une exception assumée au `docs/v2-design-brief.md` : le reste de la V2 (cours, parents, cahiers) garde la charte crème et émeraude.
- **Chaque station ouvre une vraie leçon du catalogue** dans le `LessonViewer` habituel. Elle n'est validée que si le quiz est réussi à 100 % (F-10). La carte n'invente aucun exercice.
- **Huit mondes en 1AP**, parcourus de droite à gauche comme la lecture arabe.

## Parcours

Accueil → carte « كوكب ديدو » → planète à cinq quartiers (رحلتي, دروسي, المختبرات, أوسمتي, الأولياء) → carte de voyage → station → leçon → retour sur la carte. Quand la leçon débloque la station suivante, Didou y marche tout seul.

| Monde | Didou | Leçons (identifiants du catalogue) |
|---|---|---|
| الصحراء | à pied | `math-1ap-t1-spatial-relations`, `math-1ap-t1-right-left-inside-outside`, `math-1ap-t1-numbers-0-5` |
| القصبة | à pied | `arabic-1ap-t1-school-axis`, `arabic-1ap-t1-letters-group1`, `civics-1ap-t1-greetings-respect` |
| البحر | en bateau | `science-1ap-t1-animal-locomotion`, `arabic-1ap-t1-harakat`, `math-1ap-t2-numbers-6-10` |
| قسنطينة | à pied (sur le pont) | `math-1ap-t1-grandeurs`, `math-1ap-t2-compare-quantities`, `math-1ap-t2-subtraction-and-lengths` |
| جبال جرجرة | à pied | `science-1ap-t1-five-senses-hygiene`, `science-1ap-t2-plant-growth`, `science-1ap-t3-seasons-weather` |
| تيمقاد | à pied | `math-1ap-t1-shapes-colors`, `math-1ap-t2-numbers-11-20`, `civics-1ap-t2-flag-anthem` |
| الطاسيلي ناجر | à pied | `arabic-1ap-t2-letters-group3`, `arabic-1ap-t2-madd`, `arabic-1ap-t2-nature-axis` |
| الفضاء | en fusée | `math-1ap-t3-place-value-and-n99`, `math-1ap-t3-compare-symbols`, `math-1ap-t3-addition-and-time-money` |

Chaque monde se termine par un trésor qui donne une médaille.

## Règles

- **Progression :** une station est terminée quand sa leçon figure dans `quizFullyValidatedLessonIds`. Une leçon réussie ailleurs dans l'app compte aussi sur la carte. Seule la première station non terminée est ouverte, les suivantes sont fermées.
- **Leçon absente du catalogue publié** (par exemple avec `curriculumReviewGate`) : la station est grisée et sautée, elle ne bloque jamais le voyage.
- **Étoiles :** 3 sans échec récent sur la leçon (`lessonSessions`), 2 après un ou deux échecs, 1 au-delà. Elles reflètent le « réussi seul / avec aide » du carnet, pas l'XP.
- **Médailles et position de Didou :** stockées sur l'appareil par enfant et par niveau (`mssid_journey_v1:<propriétaire>:<niveau>`). Elles ne sont pas encore synchronisées avec le serveur. Les leçons, l'XP et le carnet passent par les mêmes fonctions que la section cours.
- **Accès :** les mondes 1 et 2 (Sahara, Casbah) sont gratuits, les mondes 3 à 8 sont Premium Famille. Ces règles viennent de `access/entitlements.ts`, voir `docs/v2-gratuit-payant.md`. Une station Premium affiche un cadenas et un message neutre (« متاحة لحسابات العائلة المميزة »), avec le bouton parent habituel. Une leçon déjà validée ailleurs dans l'app reste marquée comme faite. Les leçons de ces mondes restent gratuites dans « دروسي » : seul le parcours de jeu est Premium. Un invité garde la même limite de leçons que partout ailleurs (`isLessonLocked`, puis la fenêtre de connexion).
- **Flag :** `didouJourney` (activé par défaut sur `v2`, réglable dans l'onglet admin). Désactivé, la carte d'accueil disparaît et `/journey` renvoie à l'accueil.

## Technique

- `data/journey/journeyWorlds.ts` : les mondes, leurs leçons, leurs positions ; `utils/journeyProgress.ts` : états, étoiles et mémoire.
- `components/journey/` : `JourneyScreen` (assemblage), `PlanetHub`, `JourneyMap`, `JourneyScenery` (décors SVG originaux), `DidouJourneyArt`, `JourneyRibbon` (dialogues et sons doux synthétisés), `journey.css`.
- Rendu en couche plein écran au-dessus de l'app (z-index 45, sous les modales à partir de 50), sur la route `/journey`. `useAppNavigation` ne réécrit pas cette URL, comme pour `/prototype`.
- Voix : `speakText` (enregistrement existant si le texte correspond, sinon synthèse). Un bouton d'écoute accompagne chaque message de Didou, et le son se coupe depuis la planète.
- Animations désactivées avec `prefers-reduced-motion`. Les zones tactiles des stations font 160 unités de carte, environ 64 px sur un téléphone en paysage.

## À faire

- [x] Vérifications du 3 novembre 2026 : TypeScript et build web réussis ; suite frontend complète 2 295/2 296 (le seul échec, `SpeedVelocityLab`, est un délai dépassé sous charge et passe relancé seul) ; 51 tests ciblés de la carte, du routage et de l'accueil réussis ; parcours Edge accueil → planète → carte → station → leçon sans erreur JavaScript, en 1280 × 800 et en téléphone paysage 800 × 360. Aucun essai sur un téléphone Android réel.
- [ ] Essai sur un téléphone Android réel : fluidité du défilement, taille des stations, retour matériel.
- [ ] Voix enregistrées pour les phrases fixes de Didou (accueil des mondes, encouragements).
- [ ] Synchroniser médailles et position avec le serveur, et les montrer dans le carnet parent.
- [ ] Cartes 2AP à 5AP avec les mêmes mondes et d'autres leçons.
- [ ] Remplacer les illustrations vectorielles provisoires par celles d'un illustrateur, puis animer Didou (Rive).

## Cartes de la 2AP à la 5AP (4 novembre 2026)

- **Une carte par niveau, pour toute l'année scolaire.** L'enfant reste un an dans un même niveau, donc on ne voyage pas d'une année à l'autre. Chaque niveau garde sa propre progression (`mssid_journey_v1:<enfant>:<niveau>`).
- Les 8 lieux algériens, leurs décors, véhicules et médailles sont les mêmes qu'en 1AP. Ce qui change par niveau :
  - le thème de chaque monde ;
  - l'accueil de Didou ;
  - les 3 vraies leçons de ce niveau.
- Les mondes suivent les trimestres : mondes 1 à 3 = 1er trimestre, mondes 4 à 6 = 2e trimestre, mondes 7 et 8 = 3e trimestre. Un test le vérifie leçon par leçon (`data/journey/journeyWorlds.test.ts`).
- Exemples en 5AP :
  - Constantine, « les ponts de la division, des fractions et des durées » ;
  - Timgad, « l'analyse avancée » (nawasikh, compléments, tamyiz) ;
  - le Tassili, « la mémoire de la résistance et de la Révolution ».
- Plusieurs étapes de 5AP ont leur mission de Didou (division, fractions, phrase, tamyiz).
- Les mondes 1 et 2 restent gratuits, les mondes 3 à 8 Premium, comme en 1AP. Sur l'accueil gratuit, le bouton « خريطة ديدو » ouvre maintenant la carte à tous les niveaux.
- Fichier : `data/journey/journeyWorldsByGrade.ts`.
