# V2 — Textes du consentement parental (CL-03)

Rédigé par Claude le 15 novembre 2026, pour la tâche CX-04 de Codex (`docs/v2-todo-claude-codex.md`) et le lot A de `docs/v2-todo-conformite-anpdp.md`.
Statut : **projet**. Ces textes ne sont pas un avis juridique ; ils sont à faire relire par un juriste avant la vente (CL-14). Ils peuvent être utilisés dès les essais en local.

## Version

- Identifiant à enregistrer côté serveur : **`parental-consent-2026-11-v1`** (colonne `parental_consent_version`), avec la date d'acceptation (`parental_consent_at`).
- Toute modification d'un texte de la section « Case obligatoire » change l'identifiant (`-v2`, etc.) et redemande le consentement à la connexion suivante.
- Les autres textes (titres, boutons, messages) peuvent changer sans nouvelle version.

## Règles d'affichage

- Les textes s'adressent au **parent** (« vous » / « أنتم »), jamais à l'enfant.
- La case n'est **jamais cochée par défaut**. Le bouton de création du compte reste désactivé tant qu'elle n'est pas cochée ; le serveur refuse aussi l'inscription sans consentement.
- Les liens « conditions d'utilisation » (`/terms.html`) et « politique de confidentialité » (`/privacy.html`) sont cliquables, **en 16 px minimum**, à côté de la case.
- Zone cliquable de la case et de son texte : au moins 60 × 60 px.
- Aucun prix, aucune offre, aucune mention d'achat sur ces écrans (règle Google Play).
- Ces écrans sont derrière la protection parent quand ils apparaissent sur un compte existant (cas 3).

## 1. Case obligatoire (texte versionné)

Le texte entre crochets est le lien.

**Français**

> ☐ Je confirme être le représentant légal (parent ou tuteur) de l'enfant et j'accepte le traitement de ses données à des fins pédagogiques, conformément à la [politique de confidentialité]. J'accepte aussi les [conditions d'utilisation].

**Arabe**

> ☐ أُؤكِّدُ أنّني الوليُّ الشرعيُّ للطفل (الأب أو الأم أو الوصيّ)، وأوافق على معالجة بياناته لأغراضٍ تعليمية وفقاً لـ[سياسة الخصوصية]. كما أوافق على [شروط الاستخدام].

Le premier paragraphe reprend mot pour mot le texte exigé par le lot A ; la phrase sur les conditions d'utilisation remplace l'ancienne mention « En créant un compte, tu acceptes… ».

## 2. Inscription par e-mail

| Élément | Français | Arabe |
|---|---|---|
| Titre au-dessus de la case | Pour le parent | للوليّ |
| Phrase d'explication (sous le titre) | Mssid est utilisé par des enfants. Seul un parent ou un tuteur peut créer le compte. | يستعمل الأطفالُ تطبيقَ مسيد، لذلك لا يُنشئ الحسابَ إلّا الوليُّ. |
| Bouton | Créer le compte | إنشاء الحساب |
| Message si la case n'est pas cochée (affiché sous la case, sans rouge) | Cochez la case pour confirmer que vous êtes le parent ou le tuteur. | يُرجى وضعُ علامةٍ في الخانة لتأكيد أنّكم وليُّ الطفل. |
| Message si le serveur refuse (consentement absent) | Le compte n'a pas été créé : la confirmation du parent est nécessaire. | لم يُنشَأ الحساب: تأكيدُ الوليّ ضروري. |

## 3. Connexion avec Google (nouveau compte)

Écran affiché après le choix du compte Google et **avant** la création du compte. Si le parent ferme l'écran, aucun compte n'est créé.

| Élément | Français | Arabe |
|---|---|---|
| Titre | Une dernière étape pour le parent | خطوةٌ أخيرة للوليّ |
| Phrase | Vous vous connectez avec Google. Avant de créer le compte, confirmez que vous êtes le parent ou le tuteur. | أنتم تسجّلون الدخول بحساب Google. قبل إنشاء الحساب، يُرجى تأكيدُ أنّكم وليُّ الطفل. |
| Case | Texte de la section 1 | نصّ الفقرة 1 |
| Bouton principal | Continuer | متابعة |
| Bouton secondaire | Annuler | إلغاء |

## 4. Compte existant sans consentement enregistré

Écran affiché à la connexion suivante, après la protection parent. Tant que le consentement n'est pas donné, l'enfant peut utiliser l'application, mais **aucune nouvelle donnée n'est envoyée au serveur** (lot A, point 4).

| Élément | Français | Arabe |
|---|---|---|
| Titre | Nous avons besoin de votre accord | نحتاجُ إلى موافقتكم |
| Phrase | Pour continuer à enregistrer les progrès de votre enfant, la loi demande l'accord d'un parent ou d'un tuteur. | لمواصلة حفظ تقدّم طفلكم، يشترط القانونُ موافقةَ الوليّ. |
| Case | Texte de la section 1 | نصّ الفقرة 1 |
| Bouton principal | J'accepte | أوافق |
| Bouton secondaire | Plus tard | لاحقاً |
| Bandeau discret si « Plus tard » (espace parent) | Les nouveaux progrès ne sont pas enregistrés en ligne tant que vous n'avez pas donné votre accord. | لا يُحفَظ التقدّمُ الجديد على الخادم ما لم تُعطوا موافقتكم. |

## 5. Retrait du consentement

À placer dans l'espace parent, près de « Télécharger les données » et « Supprimer le compte » (lot B).

| Élément | Français | Arabe |
|---|---|---|
| Lien | Retirer mon accord | سحبُ موافقتي |
| Phrase de confirmation | Si vous retirez votre accord, nous n'enregistrerons plus les progrès de votre enfant. Pour effacer aussi les données déjà enregistrées, utilisez « Supprimer le compte ». | إذا سحبتم موافقتكم، لن نحفظَ تقدّمَ طفلكم بعد الآن. ولحذف البيانات المحفوظة سابقاً، استعملوا «حذف الحساب». |
| Boutons | Retirer mon accord · Annuler | سحبُ الموافقة · إلغاء |

## Points à faire relire (juriste, CL-14)

- La formule « représentant légal (parent ou tuteur) » et sa traduction « الوليّ الشرعي (الأب أو الأم أو الوصيّ) » dans le sens de la loi 18-07.
- L'âge à partir duquel un enfant peut consentir seul : non traité ici, tous les comptes passent par le parent.
- Le texte de retrait : le retrait arrête l'enregistrement mais ne supprime pas les données ; à confirmer.
