# V2 — Projets de conditions de vente et de politique de confidentialité (CL-14)

Rédigé par Claude le 16 novembre 2026. Destinataires : **un juriste algérien**, qui valide ou corrige, puis Karim.
Statut : **projet, ce n'est pas un avis juridique.** Rien n'est publié avant la validation du juriste et le feu vert de Karim. Les textes actuellement en ligne (`public/terms.html`, `public/privacy.html`, mis à jour le 28 août 2026) restent en place jusque-là.

Les crochets `[...]` marquent une information que seul Karim peut fournir. Ils ne sont jamais remplis par une valeur inventée.

## 0. Questions à trancher par le juriste

Ces points conditionnent le texte. Mes hypothèses sont indiquées ; elles sont à vérifier.

| # | Question | Pourquoi elle compte | Hypothèse de ce projet |
|---|---|---|---|
| J1 | **Loi 18-05 (commerce électronique), article 8.** Le texte soumet l'activité de commerce électronique à l'inscription au registre du commerce (ou de l'artisanat) et à la publication d'un site **hébergé en Algérie, avec l'extension « .com.dz »**, le nom de domaine étant déposé auprès du CNRC (texte vérifié le 16 novembre 2026, page de la loi sur commerce.gov.dz). Question : cela s'applique-t-il à la vente d'abonnements de Mssid, et sous quelle forme ? | Le site est aujourd'hui hébergé chez Vercel, hors d'Algérie, sans extension « .com.dz ». Si l'obligation s'applique, il faut un domaine « .com.dz » et un hébergement en Algérie pour au moins la page de vente, avant de vendre. | **Point bloquant possible, à traiter en premier.** |
| J2 | **Droit de rétractation (حق العدول)** : le texte actuel l'attribue à la loi 18-05 avec un délai de 4 jours ouvrables. | D'après mes recherches, à confirmer : l'article 23 de la loi 18-05 vise le retour d'un produit livré non conforme (4 jours ouvrables) ; le droit de rétractation général viendrait de la loi 09-03 modifiée par la loi 18-09, avec des modalités fixées par voie réglementaire. Pour un service numérique activé tout de suite, le régime peut être différent. | Le projet garde un délai de **4 jours ouvrables** à compter du paiement, avec remboursement si le service n'a pas été utilisé, en attendant la réponse du juriste. |
| J3 | **Mentions obligatoires de l'offre** (loi 18-05, article 11 et suivants) : identité, numéro de registre du commerce, numéro d'identification fiscale, adresse, téléphone, prix toutes taxes comprises, modalités de paiement, de livraison et de résiliation. | La page d'offre et ces conditions doivent les afficher. | Bloc « Mentions légales » au §1, à remplir par Karim. |
| J4 | **Prix TTC ou HT** selon le statut choisi (auto-entrepreneur ou registre du commerce) et le régime fiscal. | Le prix affiché doit être le prix final payé. | 900 DA et 2 400 DA sont des **prix finaux**, tout compris. |
| J5 | **Âge et consentement** : la loi 18-07 exige le consentement du représentant légal pour un enfant. Le texte de la case (`parental-consent-2026-11-v1`, `docs/v2-consentement-parental.md`) suffit-il ? | Condition de toute collecte, essai familial compris. | Oui, sous réserve du juriste. |
| J6 | **Transfert hors d'Algérie** (Vercel, Render, Neon, Resend, Sentry, Google) : la demande d'autorisation à l'ANPDP doit-elle être accordée avant l'ouverture, ou suffit-il qu'elle soit déposée ? | Détermine la date d'ouverture possible. | Le texte cite le numéro de la demande `[n° et date]`. |
| J7 | **Durée de conservation des reçus de paiement** imposée par les obligations comptables. | La politique doit donner une durée. | `[durée légale]`, à fournir. |
| J8 | **E-mails commerciaux aux parents** : la loi 18-05 (article 31, à vérifier) exige-t-elle un accord préalable pour la prospection par e-mail ? | Conditionne les campagnes de `docs/v2-textes-campagnes.md`. | Oui : case non cochée, distincte du bilan du jeudi, et lien de désinscription dans chaque e-mail. |

## 1. Mentions légales (bloc commun aux deux textes et à la page d'offre)

| Champ | Valeur |
|---|---|
| Éditeur | `[nom et prénom, ou raison sociale]` |
| Statut | `[auto-entrepreneur n° … / registre du commerce n° …]` |
| Numéro d'identification fiscale (NIF) | `[…]` |
| Adresse | `[…]` |
| Téléphone | `[…]` |
| E-mail | mssid.dz.app@gmail.com |
| Déclaration ANPDP | `[n° et date du récépissé]` |
| Hébergement | `[selon la réponse à J1]` |

## 2. Conditions générales d'utilisation et de vente

Remplace `public/terms.html` et `TermsOfServiceModal.tsx` (version web). Les articles non cités restent ceux du texte du 28 août 2026 (objet du service, propriété intellectuelle, limites de responsabilité, droit applicable), avec deux retouches : article 2 et article 5 ci-dessous.

### Bandeau d'en-tête

| Arabe | Français |
|---|---|
| تطبيق مَسيد DZ مجّاني في أغلب محتواه. اشتراك «العائلة المميّزة» اختياري، ويُقتنى من الموقع فقط. | Mssid DZ est gratuit pour l'essentiel de son contenu. L'abonnement « Premium Famille » est facultatif et se souscrit uniquement sur le site. |

### Article 2 — Compte et protection des données (retouche)

| Arabe | Français |
|---|---|
| يُنشئ الحسابَ الوليُّ الشرعيُّ للطفل (الأب أو الأم أو الوصيّ)، بعد الموافقة الصريحة على معالجة بيانات الطفل. يمكن أن يضمّ حساب العائلة حتى 6 ملفّات أطفال. تُعالَج البيانات وفقاً للقانون رقم 18-07، كما هو مفصّل في سياسة الخصوصية. | Le compte est créé par le représentant légal de l'enfant (parent ou tuteur), après son accord explicite au traitement des données de l'enfant. Un compte famille peut contenir jusqu'à 6 profils d'enfants. Les données sont traitées conformément à la loi n° 18-07, comme le détaille la politique de confidentialité. |

### Article 3 — Abonnement « Premium Famille » et paiement (remplace l'ancien article 3)

**Français**

1. Le contenu gratuit (cours, exercices, quiz, examens corrigés, deux premiers mondes de Didou, indices de « مساعدي », bilan court du jeudi) reste accessible sans abonnement.
2. L'abonnement « Premium Famille » donne accès, pour tous les enfants du compte (6 au plus), aux services décrits sur la page d'offre. Deux formules : **3 mois pour 900 DA** et **12 mois pour 2 400 DA**, prix finaux.
3. Le paiement est **unique** pour la durée choisie. **Il n'y a pas de renouvellement automatique.** À la fin de la durée, le compte revient au contenu gratuit.
4. Moyens de paiement acceptés : `[liste des moyens actifs à la date de publication : code d'activation ; virement BaridiMob ou CCP avec envoi du reçu ; carte CIB ou Edahabia via [prestataire]]`.
5. **Code d'activation** : il s'utilise une seule fois, sur le site. Il active l'abonnement immédiatement, ou ajoute sa durée à un abonnement en cours.
6. **Reçu de virement** : l'abonnement est activé après vérification du reçu par l'équipe, dans un délai de `[délai fixé par Karim]`. Si le reçu est illisible ou ne correspond pas, le titulaire du compte en est informé avec la raison et peut en envoyer un nouveau.
7. L'abonnement souscrit sur le site s'applique aussi dans l'application Android, avec le même compte. **Aucun achat n'est possible dans l'application.**
8. Les écoles peuvent acquérir une licence de classe ; ses conditions font l'objet d'un devis et d'une facture séparés.

**Arabe**

1. يبقى المحتوى المجّاني (الدروس، التمارين، الاختبارات، الامتحانات المصحَّحة، أوّل عالمين من عوالم ديدو، تلميحات «مساعدي»، الحصيلة المختصرة ليوم الخميس) متاحاً دون اشتراك.
2. يمنح اشتراك «العائلة المميّزة» لكلّ أطفال الحساب (6 على الأكثر) الخدمات الموصوفة في صفحة العرض. صيغتان: **3 أشهر بـ 900 دج** و**12 شهراً بـ 2 400 دج**، والسعر نهائي.
3. يُدفَع المبلغ **مرّة واحدة** للمدّة المختارة، **دون تجديد تلقائي**. عند انتهاء المدّة يعود الحساب إلى المحتوى المجّاني.
4. وسائل الدفع المقبولة: `[الوسائل المفعّلة عند النشر: كود التفعيل؛ تحويل عبر بريدي موب أو الحساب البريدي الجاري مع إرسال الوصل؛ البطاقة البنكية CIB أو الذهبية عبر [مقدّم الخدمة]]`.
5. **كود التفعيل** يُستعمل مرّة واحدة على الموقع، ويفعّل الاشتراك فوراً أو يضيف مدّته إلى اشتراك جارٍ.
6. **وصل التحويل**: يُفعَّل الاشتراك بعد تحقّق الفريق من الوصل، في أجل `[الأجل الذي يحدّده كريم]`. إذا كان الوصل غير واضح أو غير مطابق، يُبلَّغ صاحب الحساب بالسبب ويمكنه إرسال وصل جديد.
7. يسري الاشتراك المقتنى من الموقع في تطبيق أندرويد أيضاً، بنفس الحساب. **لا يمكن الشراء من داخل التطبيق.**
8. يمكن للمدارس اقتناء رخصة للقسم، بشروط تُحدَّد في عرض سعر وفاتورة مستقلّين.

### Article 4 — Rétractation et remboursement (remplace l'ancien article 4, sous réserve de J2)

| Arabe | Français |
|---|---|
| يحقّ لصاحب الحساب العدول عن الاشتراك واسترجاع المبلغ كاملاً خلال 4 أيام عمل من تاريخ الدفع، إذا لم يُستعمَل المحتوى المميّز بعد، وذلك بطلب عبر البريد الإلكتروني. بعد هذا الأجل، لا يُسترجَع المبلغ إلّا إذا ثبت خللٌ تقنيّ من جهتنا منع استعمال الخدمة. | Le titulaire du compte peut se rétracter et être remboursé intégralement dans les 4 jours ouvrables suivant le paiement, si le contenu Premium n'a pas encore été utilisé, par une demande envoyée par e-mail. Après ce délai, aucun remboursement n'est dû, sauf panne technique de notre fait, établie, ayant empêché d'utiliser le service. |

### Article 5 — Fin d'utilisation et suppression du compte (retouche)

| Arabe | Français |
|---|---|
| يمكن للوليّ حذف الحساب نهائياً في أيّ وقت من فضاء الأولياء، فتُحذَف كلّ البيانات المرتبطة به. الحذف لا يُرجِع تلقائياً مبلغ اشتراك جارٍ؛ لطلب الاسترجاع ضمن الأجل، يُرجى مراسلتنا قبل الحذف. | Le parent peut supprimer définitivement le compte à tout moment depuis l'espace parent ; toutes les données liées sont alors supprimées. La suppression ne rembourse pas automatiquement un abonnement en cours ; pour demander un remboursement dans le délai, écrivez-nous avant de supprimer le compte. |

### Version affichée dans l'application Android

Dans l'application Android, l'article 3 et l'article 4 sont remplacés par ce seul texte (point 1 de `docs/v2-revue-android-paiement.md`). Aucun prix, moyen de paiement ni renvoi vers le site.

| Arabe | Français |
|---|---|
| بعض الوظائف مخصّصة لحسابات العائلة المميّزة. يمكنكم الاطّلاع على حالة اشتراككم في «اشتراكي». | Certaines fonctions sont réservées aux comptes Famille Premium. L'état de votre abonnement est visible dans « Mon abonnement ». |

## 3. Politique de confidentialité

Remplace `public/privacy.html` et `PrivacyPolicyModal.tsx`. Les sections « cookies et stockage local », « pas de publicité ciblée » et « sécurité » du texte du 28 août 2026 restent valables et sont gardées telles quelles. Les sections ci-dessous sont nouvelles ou réécrites.

Version proposée : **`privacy-2026-11-v2`**, citée par la case de consentement (`parental-consent-2026-11-v1`). Si la case doit changer après la relecture, son identifiant change aussi.

### 3.1 Responsable du traitement

| Arabe | Français |
|---|---|
| المسؤول عن المعالجة: `[الاسم أو التسمية]`، `[العنوان]`. تصريح لدى السلطة الوطنية لحماية المعطيات ذات الطابع الشخصي رقم `[…]` بتاريخ `[…]`. للتواصل: mssid.dz.app@gmail.com. | Responsable du traitement : `[nom ou raison sociale]`, `[adresse]`. Déclaration auprès de l'Autorité nationale de protection des données à caractère personnel n° `[…]` du `[…]`. Contact : mssid.dz.app@gmail.com. |

### 3.2 Les données collectées (réécrit)

| Données | Arabe | Français | Pourquoi |
|---|---|---|---|
| Compte du parent | الاسم، البريد الإلكتروني، كلمة المرور (مخزّنة مشفّرة)، الولاية | Nom, e-mail, mot de passe (stocké chiffré), wilaya | Créer et sécuriser le compte |
| Consentement | تاريخ موافقة الوليّ ونسخة النصّ المقبول | Date de l'accord du parent et version du texte accepté | Prouver le consentement (loi 18-07) |
| Profils des enfants | الاسم أو لقب مستعار، المستوى الدراسي، الصورة الرمزية | Prénom ou pseudo, niveau scolaire, avatar | Adapter les leçons |
| Progression | الدروس والتمارين المنجزة، الإجابات، النقاط والأوسمة | Leçons et exercices faits, réponses, points et médailles | Suivi de l'enfant et bilan du parent |
| Abonnement | الصيغة، تاريخ البداية والنهاية، طريقة التفعيل | Formule, dates de début et de fin, mode d'activation | Gérer l'abonnement |
| Paiement par virement | صورة الوصل ومرجع المعاملة | Photo du reçu et référence de la transaction | Vérifier le paiement ; obligations comptables |
| Code d'activation | بصمة الكود فقط، لا الكود نفسه | Empreinte du code seulement, jamais le code lui-même | Empêcher un second usage |
| Messages « اتصل بنا » | الاسم والبريد ومحتوى الرسالة | Nom, e-mail et contenu du message | Répondre |
| Données techniques | عنوان IP لحظة الطلب (للحدّ من الإساءة، دون حفظه)، تقارير الأعطال دون بيانات شخصية | Adresse IP au moment de la requête (limitation des abus, non conservée) ; rapports d'erreur sans donnée personnelle | Sécurité et bon fonctionnement |

Nous ne collectons ni le genre, ni la date de naissance, ni la photo de l'enfant. Aucun texte écrit par l'enfant n'est envoyé à un service d'intelligence artificielle.

*Phrase Android, à la place des lignes « Paiement par virement » et « Code d'activation » :* « إذا اقتنيتم اشتراكاً من موقعنا، نحتفظ بالمعلومات اللازمة لتفعيله. » / « Si vous souscrivez un abonnement sur notre site, nous conservons les informations nécessaires à son activation. »

### 3.3 Prestataires et transfert hors d'Algérie (réécrit)

| Prestataire | Rôle | Pays d'hébergement |
|---|---|---|
| Vercel | Site web, statistiques de visite globales (web seulement) | `[région]` |
| Render | Serveur de l'application | `[région]` |
| Neon | Base de données | `[région]` |
| Resend | E-mails (code de confirmation, bilan du jeudi) | `[région]` |
| Sentry | Rapports d'erreur, sans donnée personnelle | `[région]` |
| Google | Connexion avec un compte Google, si le parent la choisit | `[région]` |
| `[passerelle de paiement]` | Paiement par carte, une fois activé | Algérie |

Google Gemini disparaît de la liste : la V2 n'utilise plus d'IA externe (lot C de `docs/v2-todo-conformite-anpdp.md`, à vérifier avant publication). Le texte mentionne la demande d'autorisation de transfert déposée auprès de l'ANPDP (`[n° et date]`), selon la réponse à J6.

### 3.4 Durées de conservation (réécrit)

| Données | Durée |
|---|---|
| Compte, profils, progression | Tant que le compte est utilisé |
| Compte inactif | Supprimé après **24 mois** sans connexion, avec un e-mail de préavis **30 jours** avant |
| Journaux d'administration, messages de contact | **30 jours**, puis supprimés ou anonymisés |
| Reçus de paiement | `[durée légale, J7]` |
| Après suppression du compte | Suppression immédiate de la base ; les sauvegardes sont écrasées en `[durée du cycle de sauvegarde]` |

### 3.5 Vos droits (réécrit)

| Arabe | Français |
|---|---|
| يمكن للوليّ، من فضاء الأولياء ودون مراسلة أحد: تحميل كلّ بيانات أطفاله في ملفّ، وتصحيحها، وحذف الحساب نهائياً. ويمكنه أيضاً الاعتراض على المعالجة أو طرح أيّ سؤال عبر mssid.dz.app@gmail.com، ونجيب في أجل أقصاه 30 يوماً. ويحقّ له تقديم شكوى إلى السلطة الوطنية لحماية المعطيات ذات الطابع الشخصي. | Depuis l'espace parent, sans écrire à personne, le parent peut télécharger toutes les données de ses enfants dans un fichier, les corriger et supprimer définitivement le compte. Il peut aussi s'opposer au traitement ou poser une question à mssid.dz.app@gmail.com ; nous répondons sous 30 jours au plus. Il peut saisir l'Autorité nationale de protection des données à caractère personnel. |

Cette section n'est publiée qu'une fois l'export et la suppression complète construits (CX-18) : la politique ne promet que ce qui existe.

## 4. Ce qui change par rapport aux textes du 28 août 2026

| Texte actuel | Problème | Projet |
|---|---|---|
| « لا يوجد أي اشتراك مدفوع فعّال » | Faux dès l'ouverture de la vente | Article 3 réécrit |
| Accès « لمدة سنة واحدة » au prix « معلن داخل التطبيق » | Faux pour la V2 (3 et 12 mois) et interdit sur Android (aucun prix dans l'application) | Deux formules ; version Android neutre |
| Rétractation fondée sur la loi 18-05 | Fondement à vérifier (J2) | Délai gardé, fondement soumis au juriste |
| « الاشتراك المدفوع: غير مفعّل حالياً » | Faux dès l'ouverture ; reçus et codes absents | Tableau §3.2 |
| Google Gemini cité | Plus utilisé dans la V2 | Retiré, sous réserve de vérification |
| Pas de durée pour les comptes inactifs ni pour les reçus ; pas de droit d'accès | Exigences de la loi 18-07 (lot C) | §3.4 et §3.5 |
| « بالمتابعة في استخدام الحساب تقبل » (consentement implicite, adressé à l'enfant) | Le consentement doit être explicite et donné par le parent | Case de consentement versionnée |

## 5. Après la validation du juriste (pour Codex)

1. Mettre à jour `public/terms.html`, `public/privacy.html`, `TermsOfServiceModal.tsx` et `PrivacyPolicyModal.tsx`, avec la version Android distincte.
2. Ajouter ces deux composants au test `NativeNoPaymentWording` (point 3 de `docs/v2-revue-android-paiement.md`).
3. Mettre à jour la date et la version du texte ; si la case de consentement change, changer son identifiant (`-v2`).
4. Liens vers les deux textes en bas de chaque page du site et dans l'espace parent (lot B, point 4).
