# V2 — Fiche Google Play et plaquette pour les écoles (CL-16)

Rédigé par Claude le 16 novembre 2026. Destinataires : Karim (Play Console, impression) et Codex (captures).
Statut : **projet**. Les textes arabes sont à faire relire. Rien n'est publié avant la mise en ligne de la V2 (CX-22) ; la plaquette n'est imprimée qu'après le feu vert de Karim pour vendre.

## Partie A — Fiche Google Play

### A.0 Règles

- **Aucun prix, aucune offre, aucun mot d'achat** : ni « Premium », ni « abonnement », ni « gratuit pendant 7 jours », ni lien vers le site de vente. La fiche décrit ce que fait l'application.
- Règles de Google sur les métadonnées : pas de « meilleur », « n° 1 », « première application », pas d'avis cités, pas d'emojis en série, pas de mots-clés répétés.
- L'application vise des enfants : la **politique Familles de Google Play** s'applique. Dans Play Console, déclarer le public cible (moins de 13 ans compris), le questionnaire de contenu et la section « Sécurité des données » à partir de `docs/v2-dossier-conformite.md`. Ne pas demander le badge « Approuvé par les enseignants » sans en remplir les conditions.
- Les captures montrent la **vraie application V2**, en arabe, sur un téléphone 1080 × 1920 ou plus, sans maquette retouchée.

### A.1 Textes

| Champ (limite) | Arabe (langue par défaut) | Français |
|---|---|---|
| Nom (30) | مسيد - دروس ابتدائي مع ديدو | Mssid - Primaire avec Didou |
| Description courte (80) | دروس وتمارين التحضيري والابتدائي وفق المنهاج الجزائري، بالصوت ومع ديدو. | Cours et exercices du préscolaire au primaire, programme algérien, avec Didou. |

Les noms font 27 et 27 caractères ; les descriptions courtes 71 et 78. Le nom actuel de l'application (`Mssid DZ - مسيد`) reste dans `capacitor.config` : changer le nom affiché sous l'icône est une décision séparée.

**Description complète — arabe**

> مسيد تطبيق تعليمي للأطفال من التحضيري إلى السنة الخامسة ابتدائي، مبنيّ على برنامج الجيل الثاني الجزائري.
>
> مع ديدو، يتعلّم الطفل خطوة خطوة:
> • دروس قصيرة وواضحة في الرياضيات واللغة العربية والتربية الإسلامية والعلمية والمدنية، والتاريخ والجغرافيا، والفرنسية والإنجليزية ابتداءً من السنة الثالثة.
> • تمارين متدرّجة مع تلميحات، وتصحيح يشرح الخطأ بدل إعطاء الجواب فقط.
> • في التحضيري والسنة الأولى، تُقرأ التعليمات بالصوت، ويكفي لمس الشاشة.
> • حلّ المسائل على طريقة القسم: «الحل» و«العمليات»، وجدول «الكلمة / إعرابها» في قواعد اللغة.
> • عالم ديدو: خريطة تمرّ بالصحراء والقصبة وجبال جرجرة وتيمقاد والطاسيلي، ومحطّاتها دروس حقيقية.
> • امتحانات وتمارين للمراجعة قبل الاختبارات.
>
> للأولياء: دفتر يبيّن الدروس المنجزة وما يحتاج إلى مراجعة، محميّ بسؤال بسيط حتى لا يفتحه الطفل وحده.
>
> بلا إشهار. لا نطلب عن الطفل إلّا اسماً أو لقباً ومستواه.

**Description complète — français**

> Mssid accompagne les enfants du préscolaire à la 5e année primaire, selon le programme algérien de deuxième génération.
>
> Avec Didou, l'enfant apprend pas à pas :
> • des leçons courtes et claires en mathématiques, arabe, éducation islamique, scientifique et civique, histoire-géographie, et en français et anglais dès la 3AP ;
> • des exercices progressifs avec des indices, et des corrections qui expliquent l'erreur au lieu de donner seulement la réponse ;
> • en préscolaire et en 1AP, les consignes sont lues à voix haute et il suffit de toucher l'écran ;
> • les problèmes présentés comme en classe, « الحل » et « العمليات », et le tableau « الكلمة / إعرابها » en grammaire ;
> • le monde de Didou : une carte qui passe par le Sahara, la Casbah, le Djurdjura, Timgad et le Tassili, avec de vraies leçons à chaque étape ;
> • des examens et exercices de révision avant les compositions.
>
> Pour les parents : un carnet qui montre les leçons faites et ce qui reste à revoir, protégé par une petite question pour que l'enfant ne l'ouvre pas seul.
>
> Sans publicité. Nous ne demandons sur l'enfant qu'un prénom ou un pseudo et son niveau.

À vérifier avant publication : chaque point doit exister dans la version publiée (en particulier les mondes cités, le carnet parent sans abonnement, et les matières par niveau). Un point qui n'existe pas est retiré.

### A.2 Captures (8, dans cet ordre)

| # | Écran | Légende arabe (sur la capture, 6 mots au plus) | Légende française |
|---|---|---|---|
| 1 | Carte de Didou, monde du Sahara | تعلّم مع ديدو في عالم الجزائر | Apprendre avec Didou, en Algérie |
| 2 | Accueil du préscolaire | التحضيري: ألمس وأسمع وأتعلّم | Préscolaire : je touche, j'écoute, j'apprends |
| 3 | Leçon de 1AP avec le bouton d'écoute | كلّ تعليمة تُقرأ بالصوت | Chaque consigne lue à voix haute |
| 4 | Exercice de maths 5AP avec « الحل / العمليات » | المسائل كما في القسم | Les problèmes comme en classe |
| 5 | Correction après une erreur, avec Didou | ديدو يشرح الخطأ | Didou explique l'erreur |
| 6 | Tableau « الكلمة / إعرابها » (4AP ou 5AP) | الإعراب خطوة خطوة | La grammaire pas à pas |
| 7 | Écran de fin de leçon (étoiles) | أنهيتُ الدرس! | Leçon terminée ! |
| 8 | Carnet parent, partie gratuite | تابعوا تقدّم طفلكم | Suivez les progrès de votre enfant |

Aucune capture ne montre un cadenas, un prix ou un écran d'offre. La capture 8 ne montre que la partie gratuite du carnet.

## Partie B — Plaquette pour les écoles

Une feuille A4 recto, en arabe au recto et en français au verso. Pour les écoles privées et les écoles de soutien.

### B.1 Texte arabe

> **مسيد في قسمكم**
>
> تطبيق تعليمي من التحضيري إلى السنة الخامسة ابتدائي، مبنيّ على برنامج الجيل الثاني.
>
> **ما يجده التلميذ**
> • دروس وتمارين متدرّجة في كلّ المواد، مع تصحيح يشرح الخطأ.
> • عرض المسائل بـ«الحل» و«العمليات»، وجدول «الكلمة / إعرابها».
> • صوت يقرأ التعليمات للصغار.
> • امتحانات للمراجعة قبل الاختبارات.
>
> **ما يجده الوليّ**
> • حصيلة كلّ خميس: ما نجح فيه طفله وحده، وما يحتاج إلى مراجعته.
>
> **رخصة القسم**
> • كود واحد لكلّ قسم، يفعّل الحسابات المميّزة لتلاميذه.
> • المدّة: 3 أشهر أو سنة دراسية.
> • السعر: `[بعد المصادقة]` — فاتورة باسم المؤسّسة.
>
> للتواصل: mssid.dz.app@gmail.com — `[الهاتف]`

### B.2 Texte français

> **Mssid dans votre classe**
>
> Une application d'apprentissage du préscolaire à la 5AP, selon le programme de deuxième génération.
>
> **Pour l'élève**
> • Des leçons et exercices progressifs dans toutes les matières, avec des corrections qui expliquent l'erreur.
> • Les problèmes présentés avec « الحل » et « العمليات », le tableau « الكلمة / إعرابها ».
> • Une voix qui lit les consignes aux plus jeunes.
> • Des examens pour réviser avant les compositions.
>
> **Pour le parent**
> • Un bilan chaque jeudi : ce que son enfant a réussi seul et ce qu'il doit revoir.
>
> **Licence de classe**
> • Un code par classe, qui active les comptes Premium de ses élèves.
> • Durée : 3 mois ou une année scolaire.
> • Prix : `[après validation]` — facture au nom de l'établissement.
>
> Contact : mssid.dz.app@gmail.com — `[téléphone]`

### B.3 À vérifier avant d'imprimer

| Point | Pourquoi |
|---|---|
| Nombre de comptes par code de classe | Le code accepte jusqu'à 60 comptes (`ActivationCodeService`) ; la note de business parle de 30 élèves. La plaquette ne donne pas de chiffre tant que ce n'est pas tranché. |
| Durée « année scolaire » | Le code ne connaît que 3 et 12 mois : « année scolaire » veut dire 12 mois à partir de l'activation. À dire tel quel ou à changer. |
| Tableau de bord enseignant | Cité dans le modèle d'affaires, mais je ne l'ai pas trouvé dans le code : il n'est pas sur la plaquette. |
| Facture | Demande le statut juridique (question J1 de CL-14). |
