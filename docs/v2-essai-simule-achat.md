# V2 — Essai simulé du parcours d'achat (CL-18)

Joué par Claude le 16 novembre 2026 sur la V2 locale (site `localhost:3002`, serveur `localhost:8081`, base `mssid_v2`), avec des comptes fictifs `@example.test` et le compte administrateur fictif de `docs/v2-tests-isoles.md`. Aucun paiement réel, aucun courriel envoyé (envoi non configuré en local). **Essai simulé.**

## Ce qui a été joué

| Étape | Comment | Résultat |
|---|---|---|
| Essai gratuit | Recherche dans le code (serveur, droits d'accès, abonnement) | **Il n'existe pas de période d'essai.** Le mot « التجربة » de la page Premium désigne la phase bêta (« خلال التجربة لا نعلن مهلة تفعيل مضمونة ») : un parent peut le lire comme « pendant l'essai gratuit ». |
| Code d'activation | Code 3 mois généré par l'administrateur fictif, saisi dans l'application par le parent (`salma.essai@example.test`) | Compte passé Premium ; abonnement `P3M` actif du 16/11/2026 au 16/02/2027. |
| Reçu | Parent fictif `chrono.essai@example.test` : carnet → porte parents → « اكتشاف Premium » → porte parents → 3 mois → BaridiMob → référence `BM-ESSAI-0001`, montant 900, image d'un reçu fictif → « إرسال وصل الدفع » ; puis validation par l'administrateur fictif (`PUT /api/v1/payments/admin/receipts/2/verify`) | Reçu enregistré « بانتظار التحقق » avec la bonne formule (`P3M`, 3 mois, 900 DA) ; après validation, compte Premium, abonnement actif du 16/11/2026 au 16/02/2027. |
| Fin d'abonnement et retour au gratuit | Lecture du code (`SubscriptionExpiryService`, `ActivationCodeService`, `PaymentServiceImpl`) ; pas de déclenchement possible pendant l'essai (tâche planifiée à 3 h, sans route) | Un seul abonnement par compte, prolongé à chaque renouvellement (les jours restants sont gardés). La nuit qui suit la date de fin, l'abonnement passe « EXPIRED » et le rôle redevient gratuit ; rien d'autre n'est effacé, donc la progression des enfants reste. Le test `SubscriptionExpiryServiceTest` existe (non relancé par Claude). |

## Constats

| # | Constat | Gravité | Correction proposée |
|---|---|---|---|
| A1 | **Le parent ne voit nulle part la date de fin de son abonnement sur le web** : le profil affiche seulement « PREMIUM », le carnet rien ; le bouton « اشتراكي » (état de l'abonnement) n'existe que dans l'application Android. | Moyenne | Ligne « العائلة المميّزة حتى 16 فبراير 2027 » dans le carnet et le profil, sur le web comme sur Android (sans prix sur Android). |
| A2 | **Délais contradictoires** sur la même page : « خلال التجربة لا نعلن مهلة تفعيل مضمونة » puis « التحقق يدوي … خلال 24 إلى 48 ساعة ». | Moyenne | Choisir une seule promesse. Tant que la bêta n'a pas de délai garanti : « نتحقّق من الوصل يدوياً، عادةً في أقلّ من يومين ». |
| A3 | « خلال التجربة » se lit comme « pendant l'essai gratuit », qui n'existe pas. | Basse | « خلال المرحلة التجريبية » ou « خلال فترة الإطلاق ». |
| A4 | Le parent qui vient d'envoyer un reçu n'est prévenu de la validation que s'il revient sur la page Premium (pas de message à l'ouverture suivante, et pas de courriel en local). | Basse | À l'ouverture suivante, bandeau « فُعّلت العائلة المميّزة » une seule fois ; vérifier que le courriel de validation part en production. |
| A5 | Le retour au gratuit se fait la nuit suivant la date de fin, à 3 h : un abonnement qui finit le 16 février reste Premium jusqu'au 17 février à 3 h. | Info | Rien à corriger ; à dire dans les conditions (« حتى نهاية يوم … »). |
| A6 | Un compte créé sans niveau tombe d'abord sur « في أي قسم تدرس؟ » avant de pouvoir ouvrir les réglages (même bug que E20, CX-28). | — | CX-28. |

## Ce qui marche bien

- Le serveur refuse un montant qui ne correspond pas à la formule et exige une image de reçu.
- Le code d'activation et le reçu aboutissent au même état (formule, durée, dates).
- Le renouvellement anticipé ajoute les mois à la date de fin en cours, comme promis sur la page Premium.
- La fin d'abonnement ne touche qu'au rôle : la progression est gardée.
- Les deux portes parents protègent l'accès à l'offre.

## Données laissées dans la base locale

Comptes `salma.essai@example.test` et `chrono.essai@example.test` (Premium jusqu'au 16/02/2027), un lot de codes `essai-cl01-profil8`, un reçu `BM-ESSAI-0001` validé. Base V2 locale uniquement.
