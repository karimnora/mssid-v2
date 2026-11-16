# V2 — Textes de campagne (CL-17)

Rédigé par Claude le 16 novembre 2026. Destinataires : Karim (validation, envoi) et Codex (modèles d'e-mail, CX-20).
Statut : **projet**. Aucun envoi avant le feu vert de Karim pour vendre. Les textes arabes sont à faire relire.

## 0. Règles d'envoi

- **Canal : e-mail au parent seulement.** Jamais dans l'application Android, jamais adressé à l'enfant.
- **Seulement aux parents qui l'ont accepté.** Question pour le juriste (à ajouter à CL-14, J8) : la loi 18-05 semble interdire la prospection par communication électronique sans accord préalable (article 31, à vérifier). Proposition : une case **non cochée** « Recevoir les conseils et offres de Mssid » dans l'espace parent, distincte du bilan du jeudi.
- **Chaque e-mail a un lien de désinscription** qui marche en un clic.
- Le bilan du jeudi reste un service : il ne contient qu'**une ligne** sur l'offre, jamais un e-mail commercial déguisé.
- Interdit : fausse urgence (« dernières heures », compte à rebours), culpabilisation (« votre enfant prend du retard »), promesse de résultat (« réussite garantie »), avis inventés.
- Prix et durées tirés de `constants/pricing.ts` au moment de l'envoi. Aucune promotion tant que Karim n'en a pas décidé une.
- Le lien mène à la page « Premium Famille » (`docs/v2-page-premium-famille.md`).

## 1. Ligne de l'e-mail du jeudi (comptes gratuits)

Placée après le bilan court, en texte simple, sans bouton.

| Arabe | Français |
|---|---|
| الحصيلة المفصّلة (ما نجح فيه وحدَه، ما نجح فيه بمساعدة، وكرّاسة استدراك) جزءٌ من «متابعة الوليّ» في اشتراك العائلة المميّزة. [اكتشفوا العرض] | Le bilan détaillé (réussi seul, réussi avec aide, cahier de rattrapage) fait partie du « suivi du parent » de Premium Famille. [Découvrir l'offre] |

Fréquence : une semaine sur deux au plus, pour ne pas lasser. Jamais dans le premier bilan reçu par une famille.

## 2. Avant les compositions du 2e trimestre

Envoi : deux semaines avant la première composition, selon le calendrier officiel 2026-2027 (`[date à fixer]`). Un seul e-mail, et un rappel une semaine après seulement à ceux qui l'ont ouvert sans cliquer.

| | Arabe | Français |
|---|---|---|
| Objet | اختبارات الفصل الثاني: خطّة مراجعة على مقاس طفلكم | Compositions du 2e trimestre : un plan de révision fait pour votre enfant |
| Pré-en-tête | 10 أيام، مبنيّة على أخطائه الحقيقية. | 10 jours, construits sur ses vraies erreurs. |
| Corps | السلام عليكم،<br><br>تقترب اختبارات الفصل الثاني. بدل مراجعة كلّ شيء، يقترح مسيد خطّة من 10 أيام تبدأ بما أخطأ فيه طفلكم في التمارين، درساً بدرس.<br><br>• كلّ يوم: مراجعة قصيرة وتمارين على نقطة واحدة.<br>• مواضيع امتحانات مصحَّحة للتدرّب.<br>• حصيلة يوم الخميس لتعرفوا أين وصل.<br><br>اليومان الأوّلان من الخطّة مجّانيان في حسابكم. الخطّة كاملة جزءٌ من اشتراك العائلة المميّزة. | Bonjour,<br><br>Les compositions du 2e trimestre approchent. Plutôt que de tout réviser, Mssid propose un plan de 10 jours qui commence par ce que votre enfant a raté dans ses exercices, leçon par leçon.<br><br>• Chaque jour : une courte révision et des exercices sur un seul point.<br>• Des sujets d'examen corrigés pour s'entraîner.<br>• Le bilan du jeudi pour savoir où il en est.<br><br>Les deux premiers jours du plan sont gratuits dans votre compte. Le plan complet fait partie de Premium Famille. |
| Bouton | ابدؤوا الخطّة | Commencer le plan |
| Signature | فريق مسيد | L'équipe Mssid |

Le bouton ouvre d'abord les deux jours gratuits (`examPlan`, `freeAllowance`), pas la page de paiement : le parent voit le plan avant qu'on lui parle de l'offre.

## 3. Ramadan

Envoi : la veille du premier jour de Ramadan 1448 (début attendu vers le 8 février 2027 ; `[date à confirmer selon l'annonce officielle]`). Pas d'offre commerciale dans ce message : c'est un message de service, utile et respectueux. L'offre peut apparaître seulement en dernière ligne.

| | Arabe | Français |
|---|---|---|
| Objet | رمضان كريم: مراجعة خفيفة بعد الإفطار | Ramadan Karim : une révision légère après le ftour |
| Pré-en-tête | 15 دقيقة تكفي مع ديدو. | 15 minutes suffisent avec Didou. |
| Corps | رمضان كريم،<br><br>في رمضان تتغيّر الأوقات والتعب أكبر. نقترح موعداً قصيراً بعد الإفطار: 15 دقيقة مع ديدو، درس واحد أو بعض التمارين.<br><br>• في عالم ديدو، يواصل طفلكم من حيث توقّف.<br>• الدروس كلّها متاحة دون اشتراك.<br>• تصلكم حصيلة الخميس كالعادة.<br><br>نتمنّى لكم ولعائلتكم شهراً مباركاً. | Ramadan Karim,<br><br>Pendant le Ramadan, les horaires changent et la fatigue est plus grande. Nous proposons un rendez-vous court après le ftour : 15 minutes avec Didou, une leçon ou quelques exercices.<br><br>• Dans le monde de Didou, votre enfant reprend là où il s'est arrêté.<br>• Toutes les leçons restent accessibles sans abonnement.<br>• Le bilan du jeudi arrive comme d'habitude.<br><br>Nous vous souhaitons, à vous et à votre famille, un mois béni. |
| Dernière ligne (facultative) | لمن يريد متابعة أدقّ: الحصيلة المفصّلة جزءٌ من اشتراك العائلة المميّزة. | Pour un suivi plus précis : le bilan détaillé fait partie de Premium Famille. |
| Bouton | نواصل مع ديدو | Continuer avec Didou |

## 4. Mesure (CX-20)

Pour chaque envoi : nombre d'e-mails envoyés, ouverts, cliqués, puis essais et paiements dans les 7 jours, **en chiffres globaux**, sans suivi individuel au-delà de ce que la politique de confidentialité annonce. Un envoi dont le taux de désinscription dépasse `[seuil fixé par Karim]` n'est pas répété.
