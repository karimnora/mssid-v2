# V2 — To-do conversion et business model

Établi le 3 novembre 2026, à partir de l'état de la branche `v2` (commit `a8133a5`) et des décisions de Karim du même jour.

## Objectif réaliste

40 % de toutes les familles actives qui paient n'est pas un objectif réaliste pour une application grand public : les meilleures applications éducatives freemium convertissent environ 5 à 10 % de leurs utilisateurs actifs (ordre de grandeur public, pas une étude du marché algérien). L'objectif de 40 % est retenu pour deux groupes précis :

- les **parents engagés** : carnet parent activé et enfant actif au moins 3 fois par semaine ;
- les **écoles** qui achètent pour une classe entière.

## Business model

| Canal | Ce qu'on y fait | Paiement |
|---|---|---|
| App Android (Google Play) | Téléchargement et contenu gratuits ; un compte Premium acheté ailleurs se débloque automatiquement | **Aucun.** Ni prix, ni bouton d'achat, ni lien ou texte qui oriente vers le site pour payer |
| Site web mssid | Souscription « Premium Famille » (jusqu'à 4 enfants) | CIB/Edahabia via une passerelle algérienne, cartes prépayées à code, reçu en secours |
| Écoles (privées, soutien) | Licence par classe et tableau de bord enseignant | Facture et virement |

- **Gratuit :** tous les cours, quiz et exercices ; la carte de Didou (au moins le premier monde) ; le bilan simple ; les cahiers de la V1.
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
- [ ] **Décidé :** question, indice et règle gratuits ; 3 corrections détaillées pas à pas par jour en gratuit, illimitées en Premium. Le compteur est tenu par le serveur, au niveau du compte famille (une réinstallation ne le remet pas à zéro).
  - **3 novembre 2026, en place côté app :** compteur par compte et par jour algérien, stocké sur l'appareil (`utils/musaidiQuota.ts`). Rouvrir une correction déjà vue le jour même ne compte pas. Le message de limite est neutre sur Android.
  - **Reste à faire :** l'endpoint serveur (Spring Boot) pour que le compteur survive à une réinstallation. Prévoir un test backend une fois le wrapper Maven réparé. Mettre à jour la règle « aide gratuite sans restriction » de `docs/v2-accompagnement-guide.md`.

### P1 — Ce qui fait payer le parent

- [x] Bilan hebdomadaire partageable sur WhatsApp (image ou PDF) : réussites, points à revoir, prochain cahier conseillé.
  - 3 novembre 2026 : bouton « شارك حصيلة الأسبوع (واتساب) » dans le carnet parent (Premium), `utils/weeklyReport.ts`.
  - Le partage envoie une carte de 1080 × 1350 et le texte avec le lien Google Play ; si l'image ne peut pas être créée, il envoie le texte seul.
  - Rendu de la carte à vérifier sur un téléphone.
- [ ] Envoi automatique du bilan par e-mail au parent, chaque semaine (tâche planifiée côté serveur, avec l'adresse recueillie par « خطوتان للبدء »).
- [ ] Plan « avant composition » aux dates des trimestres : deux semaines de révision ciblée, puis un examen blanc corrigé.
- [ ] Alertes parent : « Amine bloque sur l'addition avec retenue, voici le cahier ».
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
- [ ] **Code d'activation (كود التفعيل) au même niveau que la carte** : un seul système pour les cartes prépayées (librairies, écoles de soutien), les parents qui paient par BaridiMob et envoient le reçu, et les licences d'école (un code de classe pour 30 élèves). Le reçu manuel existant devient une façon d'obtenir un code.
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
