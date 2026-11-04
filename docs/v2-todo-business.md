# V2 — To-do conversion et business model

Établi le 3 novembre 2026, à partir de l'état de la branche `v2` (commit `a8133a5`) et des décisions de Karim du même jour.

## Décisions du 3 novembre 2026 (après l'état des lieux V2)

Ces décisions tranchent les contradictions relevées entre les documents. Elles remplacent les règles contraires des autres fichiers `docs/v2-*.md`.

| Sujet | Décision | Conséquence dans le code (à faire) |
|---|---|---|
| Prix | **Deux offres seulement** : 900 DA pour 3 mois, 2 400 DA pour 12 mois (mise en avant). L'offre de 6 mois à 1 500 DA est abandonnée. | Retirer P6M des offres affichées et du dépôt de reçu ; garder la lecture des reçus P6M ou LEGACY_12M déjà enregistrés. |
| « مساعدي » | Question, indice et règle gratuits sans limite ; **3 corrections détaillées par jour** en gratuit, illimitées en Premium. | Rien pour le lancement : le compteur reste sur l'appareil. Le compteur serveur passe en P2. |
| Carte de Didou | **Mondes 1 et 2 (الصحراء, القصبة) gratuits** ; mondes 3 à 8 réservés au Premium. Les leçons de ces mondes restent gratuites dans « دروسي ». Seuls le parcours sur la carte, les trésors et les médailles sont Premium. | Ajouter le verrou Premium à partir du monde 3, avec un message neutre sur Android. Ce verrou reste une barrière d'interface : progression et médailles sont stockées sur l'appareil. |
| Couleur de fond | **`#FFFBF0`** (crème) pour les cours, exercices, « مساعدي » et le carnet parent. La planète et la carte gardent leur style « monde de jeu ». | Aucune : c'est déjà la valeur de `.cursorrules`. |
| Niveau prioritaire | **5AP d'abord** : étendre le référentiel de compétences et le carnet d'erreurs aux maths 5AP, puis à l'arabe 5AP, avant la 2AP et la 3AP. | Nouveau fichier de compétences 5AP et liens leçon → compétences. |
| Nombre d'enfants par abonnement | **Jusqu'à 6 enfants**, toute la fratrie, préscolaire compris. | Aucune côté serveur (V100 accepte déjà 6 profils). Mettre à jour le texte de la page de vente. |
| Accueil selon le niveau | **Proposition à valider pendant le test avec les familles (étape 5)** : la 1AP ouvre sur la carte de Didou, avec un bouton audio « واصل رحلتك مع ديدو » et un accès aux cours « دروسي » toujours visible (un compte gratuit est bloqué au monde 3). La 2AP à la 5AP ouvrent sur « مهمتي اليومية » sur fond crème. Cet écran montre une leçon à revoir tirée du carnet d'erreurs (à défaut, la prochaine leçon non terminée), un raccourci vers « مساعدي » et le carnet parent derrière le Parent Gate. Le préscolaire garde son espace « Éveil ». La 2AP passera sur la carte quand sa carte existera. | À coder après la décision. |

### Ordre retenu pour atteindre les premiers abonnements

1. Commiter le travail du 3 novembre sur `v2`.
2. Réparer le wrapper Maven, puis compiler et tester `PUT /api/v1/users/me/parent-email` (`UserControllerTest`).
3. Héberger le backend V2 avec V105 sur sa propre base, puis le site V2. Créer le client Google OAuth de l'APK `dz.mssid.app.beta`.
4. Faire la revue Google Play sur un vrai téléphone, notamment `MosaicWorkshop`, `PremiumLearningLabs` et `GardenMission`.
5. Faire tester par 5 à 10 familles, surtout en 4AP et 5AP (`docs/v2-recette-familles.md`).
6. En parallèle : les codes d'activation (environ 2 à 3 jours une fois Maven réparé) et les compétences 5AP.
7. Ensuite : le bilan hebdomadaire par e-mail ou WhatsApp, puis le paiement CIB/Edahabia.

Avant de vendre, même par code ou BaridiMob, il faut aussi faire la recette exigée par `docs/v2-validation-avant-vente.md`, et régler les points suivants (Karim, en parallèle des étapes 1 à 5) :

- **Statut juridique :** registre de commerce ou statut d'auto-entrepreneur (ANAE). Le statut d'auto-entrepreneur ne couvre qu'une liste fermée d'activités. Vérifier auprès de l'ANAE que les services éducatifs en ligne y figurent, et auprès de Chargily (ou de l'autre passerelle) que ce statut est accepté.
- **Données personnelles (loi 18-07) :** faire la déclaration ou la demande d'autorisation auprès de l'ANPDP. Les données d'enfants demandent des précautions particulières. Cela vaut dès le test avec les familles, même gratuit ; les pseudos du protocole de recette réduisent le risque sans l'enlever.
- **Conditions de vente et mentions légales sur le site :** durée des offres (3 et 12 mois), renouvellement, remboursement, données des enfants.

Le test gratuit avec les familles peut avoir lieu pendant ces démarches, puisqu'il n'y a pas de vente.

## Objectif réaliste

40 % de toutes les familles actives qui paient n'est pas un objectif réaliste pour une application grand public : les meilleures applications éducatives freemium convertissent environ 5 à 10 % de leurs utilisateurs actifs (ordre de grandeur public, pas une étude du marché algérien). L'objectif de 40 % est retenu pour deux groupes précis :

- les **parents engagés** : carnet parent activé et enfant actif au moins 3 fois par semaine ;
- les **écoles** qui achètent pour une classe entière.

## Business model

| Canal | Ce qu'on y fait | Paiement |
|---|---|---|
| App Android (Google Play) | Téléchargement et contenu gratuits ; un compte Premium acheté ailleurs se débloque automatiquement | **Aucun.** Ni prix, ni bouton d'achat, ni lien ou texte qui oriente vers le site pour payer |
| Site web mssid | Souscription « Premium Famille » (jusqu'à 6 enfants) | CIB/Edahabia via une passerelle algérienne, cartes prépayées à code, reçu en secours |
| Écoles (privées, soutien) | Licence par classe et tableau de bord enseignant | Facture et virement |

- **Gratuit :** tous les cours, quiz et exercices ; les mondes 1 et 2 de la carte de Didou ; le bilan simple ; les cahiers de la V1.
- **Premium :** bilan hebdomadaire détaillé, plans de révision avant les compositions, examens blancs corrigés, cahiers illimités, préparation CEM, carte de Didou complète.
- **Passage de l'app au site :** jamais depuis l'app. Le lien vers l'offre web passe par l'e-mail du bilan hebdomadaire envoyé au parent, hors de l'application (à revérifier dans la politique Paiements de Google Play au moment de la soumission). L'e-mail du parent est demandé à l'activation du carnet, sans être obligatoire pour que l'enfant joue. WhatsApp automatique seulement plus tard : l'API WhatsApp Business est payante et ses modèles de messages doivent être approuvés.
- **Prix :** deux offres, 900 DA le trimestre et 2 400 DA l'année (mise en avant). Écoles : environ 1 000 DA par élève et par an, à tester.

## Ordre d'exécution

1. Mode natif sans aucun mot lié au paiement, avec son test automatique (court, et bloquant pour Google Play).
2. « مساعدي » sans IA, avec le quota de 3 corrections détaillées par jour.
3. Bilan hebdomadaire par e-mail, plan « avant composition », codes d'activation et paiement web.

## To-do

### P0 — Conformité Google Play (bloquant)

- [ ] Vérifier tous les écrans natifs FR/AR : aucun prix, bouton « acheter », dépôt de reçu, lien de paiement, ni phrase de type « abonnez-vous sur notre site » — y compris cadenas, messages Premium, pied de page et notifications.
- [ ] Contenu Premium dans l'app : message neutre « متاح لحسابات العائلة المميزة », sans dire où ni comment acheter.
- [ ] Vérifier le programme Familles de Google Play : sécurité des données, aucune publicité, consentement parental.
- [ ] Test automatique qui échoue si un mot lié au prix ou au paiement apparaît dans le build natif.
  - 3 novembre 2026, vérifié (TypeScript OK, suite complète 2 303/2 303) :
    - le suivi du reçu est masqué sur Android dans « اشتراكي » ;
    - cinq messages incitatifs ont une variante Android neutre : cahiers, carnet parent, préparation au collège, studio famille, ateliers (`*Native` dans `locales/*/subscription.ts` et `constants/nativeOfferCopy.ts`) ;
    - garde-fou ajouté dans `components/NativeNoPaymentWording.test.tsx`.
  - Reste à faire : passer en revue écran par écran sur un téléphone, y compris `MosaicWorkshop`, `PremiumLearningLabs` et `GardenMission`, qui disent seulement « fait partie de Premium ».

### P0 — Tuteur sans IA « مساعدي »

- [x] Vérifier qu'aucune route IA (Gemini) n'est plus appelée : `AiTutorModal` n'appelle aucune route IA, et un test le vérifie.
- [x] Listes en cascade : niveau → matière → trimestre → leçon → question → réponse corrigée, avec explication, méthode en étapes, audio et lien « revoir la leçon ». Fait le 3 novembre 2026 : onglet « أسئلة السنة » de `AiTutorModal` (`components/musaidi/MusaidiPanel.tsx`). Les opérations posées s'affichent sur deux colonnes, le إعراب dans son tableau. Ouvert depuis une leçon, l'onglet se place sur cette leçon.
- [x] Générer la banque à partir du catalogue (quiz et exercices avec `explanationAr`, environ 1 459 explications) et du pilote `guidedMath`, sans coût d'IA. Fait : `data/musaidiBank.ts` produit 2 366 questions corrigées (1AP 401, 2AP 234, 3AP 333, 4AP 550, 5AP 848), sans IA. Les indices gratuits ne révèlent jamais la réponse. `guidedMath` reste dans l'onglet « طريقة موجّهة ».
- [x] Recherche par mot-clé (exemple : « الجمع بالاحتفاظ »). Elle ignore les harakat et les variantes أ/إ/ا, ى/ي, ة/ه.
- [ ] Combler les trous. Le comptage par la banque (3 novembre 2026) trouve 206 quiz en 4AP et 200 en 5AP : le comptage rapide précédent (5 et 15) était faux. Il reste à vérifier la 2AP, la plus faible avec 234 questions. Ancienne note : le comptage rapide trouve seulement 5 quiz en 4AP et 15 en 5AP contre 60 à 130 ailleurs. Vérifier le format des identifiants, sinon écrire et faire relire les questions manquantes.
- [x] **Décidé :** question, indice et règle gratuits ; 3 corrections détaillées pas à pas par jour en gratuit, illimitées en Premium. Le compteur est tenu par le serveur, au niveau du compte famille (une réinstallation ne le remet pas à zéro).
  - **3 novembre 2026, en place côté app :** compteur par compte et par jour algérien, stocké sur l'appareil (`utils/musaidiQuota.ts`). Rouvrir une correction déjà vue le jour même ne compte pas. Le message de limite est neutre sur Android.
  - **3 novembre 2026, compteur serveur :** `GET /api/v1/musaidi/today` et `POST /api/v1/musaidi/open` (`MusaidiQuotaService`, table `musaidi_openings`, migration V106). Le serveur fait foi, par compte famille et par jour algérien, donc une réinstallation ou un deuxième téléphone ne remet pas le compteur à zéro. Sans réseau, l'app retombe sur le compteur de l'appareil (toujours 3 par jour). Premium et admin ne sont pas comptés. Les jours de plus d'une semaine sont purgés chaque nuit. Tests : `MusaidiQuotaServiceTest` (6), `musaidiQuotaServer.test.ts` (6) et `MusaidiPanel.test.tsx`.

### P1 — Ce qui fait payer le parent

- [x] Bilan hebdomadaire partageable sur WhatsApp (image ou PDF) : réussites, points à revoir, prochain cahier conseillé.
  - 3 novembre 2026 : bouton « شارك حصيلة الأسبوع (واتساب) » dans le carnet parent (Premium), `utils/weeklyReport.ts`.
  - Le partage envoie une carte de 1080 × 1350 et le texte avec le lien Google Play ; si l'image ne peut pas être créée, il envoie le texte seul.
  - Rendu de la carte à vérifier sur un téléphone.
- [x] Envoi automatique du bilan par e-mail au parent, chaque semaine (tâche planifiée côté serveur, avec l'adresse recueillie par « خطوتان للبدء »). Fait le 4 novembre 2026 (`WeeklyReportService`, migration V107) :
  - le jeudi à 19 h (heure d'Alger), un e-mail par famille, avec un bloc par enfant actif dans la semaine : séances, « seul / avec indice », réussites, points à revoir, exercices ratés prêts dans le cahier, conseil de 12 minutes pour le lendemain ;
  - une famille sans activité ne reçoit rien, ce qui ménage le quota Resend ; au plus 80 envois par passage ; un envoi est noté pour ne jamais partir deux fois dans la semaine ;
  - lien d'arrêt signé en un clic ; lien « ouvrir le carnet parent » (`/?open=parent-notebook`, derrière le Parent Gate) ; lien vers l'offre web (`/?open=offer`) pour les comptes gratuits seulement ;
  - envoi manuel pour l'admin : `POST /api/v1/admin/weekly-reports/run` ;
  - **à configurer sur Render V2** : `V2_RESEND_API_KEY`, `V2_PUBLIC_API_URL` (adresse publique du backend V2, pour le lien d'arrêt) et `V2_WEB_URL` si le site n'est pas `https://mssid-v2-test.vercel.app`. `V2_WEEKLY_REPORT_ENABLED=false` coupe l'envoi.
- [x] Plan « avant composition » aux dates des trimestres : deux semaines de révision ciblée, puis un examen blanc corrigé. Fait le 4 novembre 2026, en 10 jours (`utils/examPlan.ts`, `components/examPlan/ExamPlanPanel.tsx`, dans le carnet parent) :
  - le parent saisit la date donnée par l'école (une date est proposée : début décembre, début mars, mi-mai) ;
  - chaque jour dure 20 minutes et porte sur la compétence la plus ratée en premier, en alternant maths et arabe ; les compétences « avec aide » et celles pas encore travaillées du trimestre suivent ;
  - un devoir blanc tous les 3 jours, une composition blanche complète la veille (banque d'examens du bon niveau et du bon trimestre) ;
  - boutons : revoir la leçon, imprimer le cahier de rattrapage, ouvrir le sujet blanc ; jours cochés « fait » ;
  - Premium, avec les 2 premiers jours gratuits (`examPlan` dans le registre des droits).
- [ ] Alertes parent : « Amine bloque sur l'addition avec retenue, voici le cahier ». En partie le 4 novembre 2026 : le carnet et le bilan e-mail affichent la compétence où l'enfant bloque, le nombre d'exercices ratés et le cahier de rattrapage qui les contient. Reste une alerte immédiate (notification) au moment du blocage.
- [ ] Plusieurs enfants, un seul abonnement familial.

### P1 — Ce qui fait revenir l'enfant

- [ ] Terminer la carte de Didou en 1AP (8 mondes, en cours, voir `docs/v2-carte-didou.md`), puis les cartes 2AP à 5AP.
- [ ] Voix enregistrées pour les phrases fixes de Didou et les consignes de 1AP et 2AP.
- [ ] Récompenses visibles : médailles, tenues de Didou, certificat de fin de monde imprimable.

### P1 — Confiance

- [ ] Relecture par un ou plusieurs enseignants, badge « راجعه معلّم » sur les leçons relues.
- [ ] Témoignages de parents et d'enseignants sur le site.
- [ ] Essais sur un téléphone Android de milieu de gamme, mode hors ligne.

### P2 — Vente sur le web

- [ ] Page « Premium Famille » centrée sur le résultat pour le parent.
- [ ] Essai Premium gratuit de 7 jours, déclenché depuis le site, **une seule fois par compte**, avec au plus 2 examens blancs en PDF pendant l'essai (pour qu'un essai pris juste avant les compositions ne remplace pas l'abonnement). Pas d'essai de 48 h : trop court pour recevoir le premier bilan hebdomadaire.
- [ ] Paiement CIB/Edahabia via une passerelle algérienne (Chargily ou équivalent : vérifier le statut juridique demandé, registre de commerce ou auto-entrepreneur).
- [x] **Code d'activation (كود التفعيل) au même niveau que la carte** : un seul système pour les cartes prépayées (librairies, écoles de soutien), et les licences d'école (un code de classe pour 30 élèves). **Le code est un moyen de paiement parmi les autres** : le reçu BaridiMob/CCP envoyé dans l'offre web reste possible et active le compte directement (validation par l'admin), et le paiement CIB/Edahabia viendra s'ajouter ; un admin peut aussi envoyer un code à un parent qui a payé autrement. Fait le 4 novembre 2026 (`ActivationCodeService`, migration V108, onglet « أكواد التفعيل » de la console d'administration) :
  - codes `MSD-XXXX-XXXX` sans caractères ambigus ; seule une empreinte SHA-256 est gardée, les codes s'affichent une fois à la génération (copie, CSV, planche de cartes à imprimer) ;
  - trois sortes : carte prépayée, code après un paiement BaridiMob, licence de classe (jusqu'à 60 comptes par code) ; formule de 3 ou 12 mois, date limite facultative, révocation d'un lot entier ;
  - le code ajoute ses mois à un abonnement en cours ; le passage en Premium et l'expiration suivent les mêmes règles qu'un reçu ;
  - le code se saisit **sur le site seulement** (fenêtre de l'offre, « عندي كود تفعيل ») : l'app Android n'en parle pas, et le compte débloqué l'est aussi dans l'app ;
  - 10 essais par 15 minutes et par adresse IP ; chaque essai est journalisé.
- [ ] Campagnes : rentrée, avant les compositions (décembre, mars, mai), Ramadan.
- [ ] Parrainage : un mois offert au parrain et au filleul.

### P2 — Écoles

- [ ] Tableau de bord enseignant : classe, devoirs assignés, résultats.
- [ ] Pilote avec 3 écoles privées ou de soutien, licence par classe.

### P3 — Mesurer

- [ ] Suivi du parcours : inscription → actif chaque semaine → carnet activé → essai → paiement.
- [x] **Écran « خطوتان للبدء »** (plan d'activation, annexe 07), fait le 3 novembre 2026 :
  - après la connexion, quel que soit le mode, y compris Google, il demande le niveau s'il n'a jamais été choisi et qu'aucun profil enfant n'est actif ;
  - il demande aussi l'e-mail du parent s'il manque, avec un raccourci « c'est mon e-mail », et « Plus tard » repousse la question au lendemain ;
  - il ouvre ensuite la carte de Didou en 1AP, ou les cours dans les autres niveaux.
  - Flag `firstSteps`, `components/onboarding/FirstStepsModal.tsx`, nouvelle route serveur `PUT /api/v1/users/me/parent-email`, indicateurs `gradeSet` et `parentEmailSet` dans le profil.
  - **Backend non compilé et non testé localement** (wrapper Maven, Docker éteint). À vérifier avant le déploiement : `UserControllerTest`.
  - Le serveur renvoie toujours « 5AP » quand le niveau est vide : c'est désormais `gradeSet` qui fait foi.
- [ ] **Indicateur « leçon terminée dans les 24 h »** dans le tableau de bord d'administration (plan d'activation ANVREDET, annexe 07). Il mesure la part des nouveaux comptes qui terminent une première leçon dans les 24 heures après l'inscription. Il est calculé par cohorte hebdomadaire d'inscriptions, à partir de la date de création du compte et de la date de la première leçon terminée, et exclut les comptes administrateurs. Il doit aussi apparaître dans l'export CSV des statistiques. Situation au 3 novembre 2026 : non mesuré. Cibles : 35 % à 6 mois, 50 % à 12 mois. À livrer avant les classes pilotes, pour comparer les cohortes avant et après chaque mesure d'activation.
- [ ] Sondage de prix auprès de 20 à 30 familles, test de deux niveaux de prix.
- [ ] Indicateurs cibles :

| Groupe | Familles payantes visées |
|---|---|
| Toutes les familles actives | ≥ 5 % |
| Parents engagés | 25 à 40 % |
| Essais gratuits | ≥ 20 % |
| Classes d'écoles | ≥ 40 % |
