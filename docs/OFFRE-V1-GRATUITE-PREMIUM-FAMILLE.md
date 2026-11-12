# MSSID — offre gratuite et Premium Famille

Date : 12 novembre 2026. Document de travail local, non publié.

## Statut prioritaire — réflexion commerciale différée

**Karim a précisé après la rédaction : pas de vente sur la V1 et aucun affichage commercial.** Ses démarches administratives sont en cours. Ce document conserve une réflexion interne et un inventaire historique ; ses textes, tarifs, quotas commerciaux et étapes de vente ne doivent pas être intégrés ou affichés dans la V1 actuelle, même dans l'espace parent.

Aucun prix, abonnement, bouton d'achat ou de découverte Premium, formulaire de paiement ou dépôt de reçu n'est à ajouter à la V1. Aucun message annonçant une prochaine mise en paiement n'est demandé. Le pilote pédagogique reste gratuit. Les checklists commerciales ci-dessous sont différées et ne constituent pas la prochaine action autorisée.

Une éventuelle commercialisation nécessitera une nouvelle instruction explicite après les démarches. Le feu vert donné à un push du design ou de la pédagogie gratuite ne vaut pas autorisation de vendre. Cette instruction remplace toute suggestion contraire dans la suite du document.

## Décision de produit

**Une même qualité visuelle et pédagogique pour tous ; un accompagnement familial supplémentaire dans Premium.**

La V1 garde ses cours, exercices, quiz, corrections, examens et impressions déjà gratuits. La clarification des consignes, la vulgarisation, les démonstrations et la correction des erreurs bénéficient au socle gratuit.

La V2 conserve une valeur commerciale : organisation des révisions, suivi détaillé pour le parent, nouveaux cahiers et parcours supplémentaires. Le portage du design ne doit pas importer automatiquement tous les droits Premium dans la V1.

La V2 dispose déjà de nombreuses briques correspondantes. Leur présence dans les sources n'est pas une preuve de disponibilité en production ni de validation commerciale.

## Tarifs retrouvés dans la V2

| Formule | Prix total | Durée | Services |
|---|---:|---|---|
| Premium Famille — 3 mois | **900 DA** | 3 mois | Même ensemble de services Premium |
| Premium Famille — 12 mois | **2 400 DA** | 12 mois | Même ensemble de services Premium |

Périmètre familial documenté : jusqu'à **6 enfants** par abonnement. Le prix est présenté comme un montant total payé pour la durée choisie, pas comme un prélèvement mensuel.

Ces prix sont repris des décisions V2 du 3 novembre 2026 et de `frontend/src/constants/pricing.ts` sur `v2`. Ils ne sont pas une nouvelle estimation de disposition à payer. Aucun nouveau tarif n'est inventé et aucune offre supplémentaire de six mois n'est ajoutée.

La V1 contient encore un ancien tarif annuel à **1 500 DA** dans sa propre constante. **Ne pas remplacer cette constante seule :** affichage, validation serveur, durée, reçus historiques et état des abonnements doivent être cohérents lors d'une future intégration. Aucun de ces paramètres n'est modifié par ce document.

## Séparation de l'offre

| Fonction | Gratuit | Premium Famille | Règle de portage |
|---|---|---|---|
| Design soigné, navigation et Didou de base | Oui | Oui | Peut bénéficier à la V1 |
| Cours V1 des trois trimestres, exercices et quiz | Oui | Oui | Aucun nouveau verrou trimestriel pour cette offre |
| Explications simples, démonstrations et corrections des exercices V1 | Oui | Oui | La qualité et les correctifs ne deviennent pas payants |
| Laboratoires du catalogue, examens corrigés et impressions V1 déjà gratuits | Oui | Oui | Conserver les accès existants |
| Carnet parent simple V2 | Résumé et prochaine révision | Inclus | Réutilisation à intégrer et vérifier |
| Carnet parent détaillé V2 | Aperçu / résumé | Compétences, historique, plan de la semaine | Valeur Premium à préserver |
| Plan V2 avant composition | Deux premiers jours | Plan complet de dix jours | Premier service à mettre à l'épreuve dans le pilote |
| Nouveaux cahiers de compétences V2 | Aperçu + 3 nouveaux cahiers par semaine pour la famille | Sans quota hebdomadaire | Ne concerne pas les fiches V1 |
| Bilan hebdomadaire partageable V2 | Résumé simple dans le carnet | Bilan détaillé partageable | Partage volontaire effectué par le parent |
| Questions, indices et règle dans « مساعدي » V2 | Sans quota selon le registre V2 | Inclus | Ne pas limiter les indices de base |
| Corrections détaillées supplémentaires de « مساعدي » V2 | 3 par jour et par compte | Sans quota de corrections selon l'offre V2 | Service distinct des corrigés gratuits des cours ; règles et disponibilité à expliquer |
| Carte de Didou V2 | Mondes 1–2 | Mondes 3–8 | Les cours restent accessibles gratuitement hors de la carte |
| Studio, ateliers, missions et jeux supplémentaires V2 | Découvertes selon le registre | Parcours complets | Ne pas transférer les accès complets avec un simple changement de design |
| Profils enfants | Accès de base à confirmer dans le parcours final | Jusqu'à 6 enfants annoncés dans l'offre | Tester réellement la séparation et la reprise des progrès |

Les quotas et avantages ci-dessus décrivent le modèle retrouvé en V2. Les fonctions V2 absentes de V1 ne sont pas présentées comme disponibles dans V1. Aucun compteur ni écran d'achat n'est activé ici.

### Ce que le parent achète

- Savoir quoi faire réviser à son enfant et dans quel ordre.
- Trouver des exercices supplémentaires sur les difficultés observées.
- Comprendre ce que l'enfant réussit seul, avec aide, ou doit encore revoir.
- Organiser les révisions de plusieurs enfants depuis un compte familial, après validation du fonctionnement réel.

Ne pas promettre de hausse des notes, d'autonomie garantie, de diagnostic médical ou de réussite à un examen. Les observations d'exercices ne mesurent pas à elles seules une acquisition durable.

## Inventaire vérifié dans les sources

Références : V1 locale `main` au commit `cfefd3b`, V2 au commit `0f67d38`. Les changements de design V1 non commités sont conservés.

| Élément | V1 | V2 | Conclusion |
|---|---|---|---|
| Tarification | Constante 1 500 DA | P3M 900 DA / P12M 2 400 DA | Réconcilier avant intégration commerciale |
| Contrôle des accès | Ancien verrou T2/T3, désactivé par défaut | Registre central `access/entitlements.ts` | Reprendre une règle explicite de cours V1 gratuits |
| Paiement | Formulaire de reçu et services existants ; paiements désactivés par défaut | Formules, statut et traitement des reçus plus détaillés | Présence de code, pas validation de vente réelle |
| Offre parent | Ancien discours sur corrigés/PDF verrouillés et IA illimitée | Offre derrière porte parentale | Ne pas réutiliser les anciens textes V1 tels quels |
| Carnet parent et révisions | Pas de carnet primaire équivalent identifié dans les fichiers examinés | `ParentNotebookModal`, `examPlan`, bilans et services associés | Réutiliser après examen des dépendances |
| Famille | Pas de service de profils enfants équivalent identifié dans le périmètre examiné | Contrôleur/service de profils, migrations et tests présents | Recette multi-enfants nécessaire |
| Web / Android natif | Ancien parcours à revoir | `paymentPlatform.ts` sépare achat web et consultation native | Conserver cette séparation lors du portage |

Sources V2 : `frontend/src/access/entitlements.ts`, `frontend/src/constants/pricing.ts`, `frontend/src/components/PremiumOffer.tsx`, `frontend/src/components/ParentNotebookModal.tsx`, `frontend/src/utils/examPlan.ts`, `frontend/src/utils/paymentPlatform.ts`, `docs/v2-todo-business.md` et `docs/v2-validation-avant-vente.md`.

Certaines anciennes sections de `docs/v2-modele-freemium.md` mentionnent encore six mois ou d'anciens états de protection des contenus. Pour cette proposition, retenir le registre actuel pour les droits et les constantes actuelles pour les tarifs ; vérifier la protection effective dans le code avant vente.

## Offre pilote prioritaire : révisions accompagnées 4AP–5AP

Le pilote met à l'épreuve une tranche de **Premium Famille existant**, pas une troisième formule à vendre.

### Promesse à tester

> Préparez les prochaines révisions de votre enfant : un programme clair, des exercices ciblés et un bilan simple pour savoir quoi revoir.

### Périmètre minimal

- Un profil enfant de test, en 4AP ou en 5AP, et une matière mathématique prioritaire.
- Une courte activité de départ pour choisir une notion à travailler, avec correction relue.
- Une mission comprenant exemple concret, démonstration, exercice aidé et exercice nouveau.
- Un plan de révision issu de la brique V2, cohérent avec les compétences réellement couvertes.
- Un cahier supplémentaire correspondant à la difficulté choisie.
- Un bilan parent fondé sur les tentatives observées : seul, avec aide, à revoir.
- Le passage découverte → offre parent, sans bloquer le retour aux cours gratuits.

Pour le test initial, les fonctions sont démontrées avec un compte de test. Les ventes et envois automatiques ne démarrent pas pendant la préparation locale.

### Ce qui ne doit pas retarder le pilote

Ne pas faire dépendre ce premier parcours de l'intégration complète du village, de tous les jeux, du collège, de nouveaux services d'IA ou d'une refonte de toutes les matières. Une famille doit pouvoir juger une expérience complète et fiable sur une difficulté précise.

## Texte d'offre à faire relire par Karim

Ces textes sont des brouillons pour l'espace parent. Ils ne sont pas insérés dans l'application actuelle et ne doivent être utilisés commercialement qu'après validation des services correspondants.

### Français

**MSSID Premium Famille**

**Des révisions organisées, des progrès plus faciles à comprendre.**

Les cours, exercices et corrigés V1 restent gratuits. Avec Premium Famille, bénéficiez de parcours de révision, de cahiers supplémentaires et d'un suivi détaillé des activités de vos enfants.

- Un plan pour préparer les prochaines évaluations.
- Des cahiers de compétences pour continuer à s'entraîner.
- Un carnet détaillé pour repérer les réussites et les points à revoir.
- Jusqu'à six enfants dans l'abonnement familial, lorsque ce parcours est validé.

**900 DA pour 3 mois** ou **2 400 DA pour 12 mois**. Montant total pour la durée choisie.

Actions de la prévisualisation : **Découvrir un exemple de révision** / **Continuer gratuitement**. Le choix d'une formule appartient au parent ; aucun paiement n'est demandé dans la démonstration locale.

### Arabe

**مَسِيد Premium للعائلة**

**مراجعة منظّمة، وفهم أوضح لتقدّم طفلك.**

تبقى دروس V1 وتمارينها وتصحيحاتها مجانية. يضيف Premium مسارات للمراجعة، وكراسات إضافية، ودفترًا مفصّلًا لمتابعة نشاط أطفالك.

- خطة للمراجعة قبل الاختبارات.
- كراسات كفاءات لمزيد من التدريب.
- دفتر يوضّح النجاحات والنقاط التي تحتاج إلى مراجعة.
- حتى ستة أطفال في الاشتراك العائلي، بعد التحقّق من عمل هذه الخدمة.

**900 دج لمدة 3 أشهر** أو **2400 دج لمدة 12 شهرًا**. المبلغ الإجمالي للمدة المختارة.

أزرار المعاينة: **اكتشف مثالًا للمراجعة** / **واصل مجانًا**. اختيار الاشتراك للولي، ولا يُطلب أي دفع في العرض المحلي.

## Todo d'intégration

### P0 — Cohérence du modèle

- [x] Retrouver tarifs et droits existants en V2.
- [x] Documenter les écarts avec la V1.
- [x] Définir le gratuit, le Premium et le pilote.
- [ ] Faire valider par Karim le périmètre proposé, les prix retrouvés et les textes.
- [ ] Vérifier les fonctions effectivement actives dans les environnements concernés, sans changer leurs réglages.
- [ ] Harmoniser textes V1, droits, prix et modalités avant activation commerciale.

### P1 — Démonstration utile

- [ ] Corriger les erreurs pédagogiques prioritaires du cours choisi.
- [ ] Choisir un parcours V2 réutilisable et examiner ses dépendances une par une.
- [ ] Préparer un bilan alimenté par des essais réels de test, sans données de progrès inventées.
- [ ] Faire fonctionner la découverte et le retour au gratuit.
- [ ] Tester avec quelques familles 4AP–5AP : compréhension de l'offre, utilité du plan, autonomie de l'enfant et intérêt pour le prix.

### P2 — Ouverture commerciale après recette

- [ ] Vérifier les droits côté serveur, les expirations et les profils enfants.
- [ ] Tester dépôt, acceptation, refus et statut d'un reçu avec des données de test.
- [ ] Préserver les reçus et abonnements historiques ; ne pas changer leur durée implicitement.
- [ ] Vérifier les documents complets réellement protégés et distinguer les simples barrières d'interface.
- [ ] Présenter les conditions et la durée réelles du service, sans promesse d'activation instantanée non vérifiée.
- [ ] Vérifier la séparation web / Android natif dans le parcours retenu.
- [ ] Passer la recette sur appareils et les tests de Karim.
- [ ] Attendre son feu vert explicite avant push ; inclure l'effet d'un éventuel déploiement automatique dans ce feu vert.

## Mesurer le pilote

Suivre séparément : familles invitées, découverte commencée, séance terminée, offre consultée par le parent, intérêt déclaré, puis achat confirmé uniquement lorsque la vente est ouverte. Ne pas compter une consultation ou une intention comme un achat.

Pour l'usage : observer retours, séances et tâches nouvelles réussies seul. Pour la monétisation : suivre les recettes réellement encaissées et les coûts de service avant d'estimer une rentabilité. Aucun taux de conversion cible n'est annoncé sans base observée.

## Limites de cette préparation

Cette étape repose sur la lecture des sources et des documents V1/V2. Aucun test de paiement, migration, déploiement ou fonctionnement multi-appareils n'a été exécuté dans ce travail de cadrage. Aucun accès gratuit ni tarif effectif n'a été changé, aucune sollicitation n'a été envoyée et aucun paiement n'a été activé.

### Relecture du cadrage

| Axe | Note | Preuve et limite |
|---|---|---|
| Exactitude | 4/5 | Droits et tarifs retrouvés dans les sources ; réglages des environnements non vérifiés |
| Couverture | 4/5 | Gratuit, Premium, pilote et intégration cadrés ; recette commerciale encore à faire |
| Clarté | 4/5 | Brouillons français/arabe et statut des fonctions explicités ; vocabulaire à éprouver avec les parents |
| Caractère opérationnel | 4/5 | Todo et critères du pilote définis ; démonstration intégrée à préparer |
| Concision | 4/5 | Un document de référence ; détail conservé pour éviter les contradictions V1/V2 |

Moyenne : 4/5. Prochaine amélioration utile : vérifier une tranche complète du service Premium sur environnement de test et confronter la proposition à des parents, sans présenter la présence de code comme une preuve de préparation à la vente.
