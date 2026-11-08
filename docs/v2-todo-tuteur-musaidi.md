# TODO « مساعدي » (tuteur) — 8 novembre 2026

Destinataire : Codex, sur la branche `v2` uniquement. Ne jamais toucher `main`.
Fichiers concernés : `frontend/src/components/AiTutorModal.tsx`, `frontend/src/components/musaidi/MusaidiPanel.tsx`, `frontend/src/data/musaidiBank.ts`, `frontend/src/data/guidedMath.ts`, `frontend/src/utils/musaidiQuota.ts`.

## Règles
- **Corrections préparées.** « مساعدي » n'utilise aucune IA générative dans les lots 1 à 3. Les corrections viennent uniquement de la banque vérifiée.
- **Ce qui reste gratuit, pour tous** : les indices, la règle de la leçon et la voix. Ce sont des aides d'accessibilité.
- **Le Premium ajoute de la valeur** ; il ne retire rien au gratuit. Le quota de 3 corrections détaillées par jour en gratuit reste inchangé.
- **Pédagogie.**
  - Ne modifier ni questions, ni corrections, ni règles de validation, ni XP.
  - Pour les maths, utiliser l'affichage officiel `الحل` / `العمليات` (CLAUDE.md).
  - Pour la grammaire, utiliser le tableau `الكلمة` / `إعرابها`.
- **Accessibilité.**
  - Cibles tactiles d'au moins 60 px (le code actuel utilise `min-h-12`, soit 48 px : à corriger).
  - Texte utile de 16 px minimum.
  - Nombres isolés en LTR.
  - Mouvement réduit respecté.
- **Rapport à la fin de chaque lot** : captures en 360×640 et 390×844, vérifications lancées, limites restantes.

---

## Lot 1 — Simplifier (gratuit et Premium) : priorité
1. **Une seule classe, celle de l'enfant.**
   - Supprimer les boutons 1AP à 5AP de `MusaidiPanel`.
   - Utiliser la classe du profil actif ; seul le parent peut la changer, depuis le profil.
2. **Seulement les matières de l'année** qui ont au moins une question publiée.
3. **Le contexte d'abord.** Si l'aide est ouverte depuis une leçon, aller directement à la liste des questions de cette leçon. Un bouton « مواد أخرى » permet d'en sortir.
4. **Des tuiles au lieu des 3 listes déroulantes**, en trois étapes avec un bouton retour visible :
   1. la **matière** : grandes tuiles, icône et couleur de la matière ;
   2. la **leçon** : celles du **trimestre en cours** d'abord, déduites de la date (septembre–décembre = 1, janvier–mars = 2, avril–juin = 3 ; juillet–août = toute l'année). Les autres trimestres sont repliés sous « دروس أخرى » ;
   3. la **question**, par pages de 20 comme aujourd'hui.
5. **La recherche**, seulement en 4AP et 5AP. En 1AP–3AP, un bouton sur chaque tuile la lit à voix haute.
6. **Supprimer l'onglet « طريقة موجّهة ».**
   - La méthode guidée s'affiche *dans* la question quand elle existe pour sa compétence.
   - Corriger le bug actuel : la classe est forcée à 1AP/2AP (`AiTutorModal.tsx`, `viewGrade`), si bien qu'un enfant de 5AP voit les guides de 1AP/2AP.
   - S'il n'y a pas de guide, ne rien afficher : pas de message « pilote 1AP/2AP ».
7. **Sous-titre honnête** : garder « تصحيحات محضّرة دون ذكاء اصطناعي ».

**Critères d'acceptation :**
- Depuis une leçon de 5AP : une seule tape pour arriver à une question de cette leçon.
- Depuis le menu : au plus 3 tapes.
- Aucune matière ni classe hors de l'année de l'enfant.
- Aucune liste déroulante.

## Lot 2 — La valeur Premium
1. **« ديدو يقترح عليك »** en tête de l'aide.
   - **En Premium** : 3 questions liées aux difficultés réelles de l'enfant, tirées de `competenceStats` (`missedExerciseIds`, échecs récents), avec le motif affiché (« لأنك أخطأت في … »).
   - **En gratuit** : les questions de la leçon en cours, ou de la dernière leçon ouverte.
   - Si aucune donnée n'existe, ne rien suggérer : jamais de faux diagnostic.
2. **Correction interactive.**
   - La correction détaillée se révèle étape par étape. Avant chaque étape, l'enfant peut « essayer l'étape suivante » ou la révéler.
   - **Le décompte du quota** ne change pas : une correction ouverte compte pour une, quel que soit le nombre d'étapes révélées.
3. **Question jumelle.**
   - Après une correction, proposer un exercice **de la même compétence**, tiré de la banque existante, pour vérifier la compréhension.
   - Le résultat remonte comme « avec aide » via `onPracticeResult`, jamais comme « seul ».
4. **Formats officiels.**
   - Maths : affichage `الحل` / `العمليات` avec le moteur existant `components/manipulations/TwoColumnProblem.tsx`.
   - Grammaire : tableau `الكلمة` / `إعرابها` quand la correction contient une analyse grammaticale.
5. **Révision avant les compositions** : quand le compte à rebours des compositions est actif, une série de révisions du trimestre construite sur les erreurs de l'enfant (Premium).
6. **Lien avec le carnet parent** (carnet détaillé, Premium) : « طلب المساعدة 3 مرات في: الكسور », avec la révision conseillée. Uniquement des compteurs réels, et isolés par enfant.
7. **Marque Premium** : utiliser `VillagePremiumMark` et la fiche d'offre existante (protection parent), sans nouveau prix. Mesurer les événements avec `recordPremiumEvent`.

**Critères d'acceptation :**
- Rien n'est retiré au gratuit.
- Chaque suggestion Premium affiche sa raison, tirée d'une donnée réelle.
- Aucune donnée d'un enfant n'apparaît chez un autre (tester le changement de profil).

## Lot 3 — Couverture du contenu
1. **Audit par script** des leçons publiées, pour chaque classe et chaque matière :
   - nombre de questions dans la banque ;
   - nombre de questions avec indice, règle et correction détaillée ;
   - nombre de compétences ayant un guide (`guidedMath`).
2. **Liste des trous prioritaires**, en commençant par les maths 5AP et 4AP, à faire valider par Karim avant d'écrire du contenu.
3. **Étendre les méthodes guidées** au-delà de 1AP/2AP, en commençant par les 10 leçons 5AP de l'audit `docs/design/audit-5ap/`, sur le contenu existant (`rulesAr`, `keyFormulas`).

## Lot 4 — Prototype « photo de l'exercice » (Premium) : NE PAS COMMENCER sans le feu vert de Karim
**Préalables :**
- le test familles 5AP est terminé ;
- l'intérêt des parents pour cette fonction est confirmé ;
- la question ANPDP est traitée (transfert de données hors d'Algérie).

Prototype isolé, **hors application**, avec des images de test seulement :
1. Un jeu de **100 photos d'exercices algériens écrits à la main par des adultes**, sans enfant ni nom : maths 4AP/5AP et arabe.
2. Comparer le **niveau gratuit de l'API Gemini (Flash)** et un **modèle ouvert** (par exemple un modèle d'OCR arabe basé sur Qwen2.5-VL, comme Baseer-Nakba). Aucune image réelle d'enfant ne doit passer par le niveau gratuit.
3. **Le circuit à tester :**
   1. Lire l'énoncé.
   2. Le **retrouver dans la banque « مساعدي »**. Si on le trouve, afficher la correction vérifiée.
   3. Si on ne le trouve pas, donner **seulement un indice et une méthode, jamais la réponse finale**.
   4. Refaire les calculs **par du code classique**.
   5. Afficher un niveau de confiance, et « تحقّق مع معلّمك » quand il est faible.
4. **Mode « vérifie ma réponse »** : dire quelle étape est juste et où est l'erreur. Jamais de note sur une copie d'examen.
5. **Mesures à rapporter** :
   - pourcentage d'énoncés bien lus ;
   - pourcentage d'énoncés retrouvés dans la banque ;
   - pourcentage d'indices justes ;
   - réponses finales inventées (objectif : 0) ;
   - temps de réponse et coût par photo.
6. **Seuil pour aller plus loin** : au moins 95 % d'énoncés bien lus. Sinon, on garde « مساعدي » sans photo.
7. **Dans l'application, plus tard seulement** :
   - photo prise par le **parent**, derrière la protection parent ;
   - image recadrée sur l'exercice ;
   - aucune image conservée après traitement ;
   - niveau payant d'un fournisseur où les données ne servent pas à l'entraînement, ou modèle hébergé par nous ;
   - quota quotidien.

## Ordre
Lot 1, puis lot 2, puis lot 3. Le lot 4 attend le feu vert de Karim après le test familles.
