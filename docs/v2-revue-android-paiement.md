# V2 — Revue des écrans Android : mots liés au prix ou à l'achat (CL-04)

Revue faite par Claude le 15 novembre 2026, **à partir du code** de `v2` (commit `8a7a9fa`), sans lancer l'application. Elle ne remplace pas le parcours écran par écran sur un vrai téléphone, prévu avec l'APK bêta (CX-22).

Règle vérifiée (Google Play, `docs/v2-todo-business.md`) : dans l'application Android, ni prix, ni bouton d'achat, ni moyen de paiement, ni renvoi vers le site pour payer. Dire qu'une fonction « fait partie de Premium » est permis.

## Résultat en bref

Le parcours d'achat est bien fermé sur Android. Deux textes légaux font exception : ils nomment BaridiMob et CCP, décrivent l'envoi d'un reçu et annoncent un prix « affiché dans l'application ». Ils sont visibles dans l'application et contredisent aussi les décisions de la V2. Le garde-fou automatique ne les voit pas, parce qu'il ne lit que les fichiers de traduction.

## À corriger

| # | Où | Ce qui pose problème | Gravité | Correction proposée |
|---|---|---|---|---|
| 1 | `components/TermsOfServiceModal.tsx`, section « الاشتراك والدفع » (et `public/terms.html`, même texte) | Visible sur Android. Nomme BaridiMob / CCP, décrit l'envoi d'une photo du reçu, parle d'un prix « affiché dans l'application » et d'une durée d'un an. Faux pour la V2 : deux offres de 3 et 12 mois, aucun prix dans l'application, code d'activation. | Haute : risque de refus Google Play et texte inexact | Sur Android (`!canUseWebCheckout()`), remplacer la section par un texte neutre : « Certaines fonctions sont réservées aux comptes Famille Premium. L'état de votre abonnement est visible dans « Mon abonnement ». » / « بعض الوظائف مخصّصة لحسابات العائلة المميّزة. يمكنكم الاطّلاع على حالة اشتراككم في «اشتراكي». » Le texte complet du site sera réécrit en CL-14. |
| 2 | `components/PrivacyPolicyModal.tsx` (ligne « الاشتراك المدفوع ») et `public/privacy.html` | Dit que l'abonnement payant n'est pas activé. Faux dès l'ouverture de la vente ; ne cite pas les reçus ni les codes d'activation. | Moyenne : exactitude légale | Réécrit en CL-14 (politique de confidentialité), en même temps que le lot C de la conformité ANPDP. Aucun moyen de paiement nommé dans la version affichée sur Android. |
| 3 | `components/NativeNoPaymentWording.test.tsx` | Le test ne contrôle que les clés de traduction et `NATIVE_OFFER_COPY`. Un texte écrit directement dans un composant, comme le n° 1, passe sans alerte. | Moyenne : le problème peut revenir | Ajouter au test le rendu en mode Android (`Capacitor.isNativePlatform` simulé) de `TermsOfServiceModal`, `PrivacyPolicyModal`, et de l'état verrouillé de `GameStationSheet`, `MissionBanner`, `DiagnosticModal`, `ExamPlanPanel` et `MusaidiPanel`, puis appliquer la même liste `FORBIDDEN` au texte affiché. |

## Vérifié et correct

| Élément | Constat |
|---|---|
| Bouton Premium commun (`PremiumOffer`, 12 écrans) | Sur Android, il ouvre « Mon abonnement » après la protection parent, jamais l'offre. Libellé par défaut « اشتراكي » / « Mon abonnement ». Le seul libellé personnalisé (« أخبر أوليائي » sur la carte) est neutre. |
| Écran d'offre (`SubscriptionPaywall`) | Sur Android, il affiche seulement l'état de l'abonnement (`SubscriptionStatusPanel`). La vitrine, le formulaire de code d'activation et le suivi du reçu n'existent que dans la version web. |
| Message de limite de « مساعدي » | Variante Android neutre (`NATIVE_OFFER_COPY.musaidiLimit`). |
| Studio famille, cahiers, carnet parent, préparation au collège | Variante Android neutre pour chaque message Premium. |
| Atelier mosaïque, mission jardin, plan avant composition | « Fait partie de Premium » / « متاح لحسابات العائلة المميّزة » : permis, sans prix ni renvoi. |
| Nom du site dans les fiches imprimées et le pied de page | Affiché en texte simple sur Android, sans lien (`BrandWebsiteLink`) : choix déjà documenté dans `v2-paiement-web-android.md`. |
| Dinars dans le contenu pédagogique | Marché aux dinars, problèmes de prix, jeux de calcul : c'est de l'apprentissage, pas une offre commerciale. |
| Console d'administration | Contient les mots « paiement » et « reçu », mais n'est visible que des comptes administrateurs. |

## Non vérifiable depuis le code

- Les notifications Android et la fiche Google Play.
- Le rendu réel dans la WebView Android.
- Ces points restent pour le parcours sur téléphone avec l'APK bêta (CX-22).
