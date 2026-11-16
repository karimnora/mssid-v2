# V2 — Page « Premium Famille » : plan et textes (CL-13)

Rédigé par Claude le 16 novembre 2026, pour la tâche CX-16 de Codex. Destinataires : Codex (construction) et Karim (validation).
Statut : **projet**. Les textes arabes sont à faire relire par un arabophone avant la vente.

## 0. Règles qui passent avant tout

- **Rien n'est publié avant le feu vert de Karim.** Karim a exclu toute vente et tout affichage commercial tant que ses démarches (statut juridique, déclaration ANPDP, CGV) ne sont pas terminées. La page reste derrière un drapeau, en local sur `v2`.
- **Site web seulement.** Sur Android : ni cette page, ni prix, ni lien vers elle (`docs/v2-revue-android-paiement.md`).
- **Chiffres et droits : une seule source.** Prix et durées de `constants/pricing.ts`, droits de `access/entitlements.ts`, mots des piliers de `docs/v2-offre-trois-piliers.md`. La page n'invente aucun bénéfice.
- **Rien d'inventé :** pas d'avis de parents, pas de nombre d'utilisateurs, pas de « validé par des enseignants » ni « approuvé par le ministère » tant que ce n'est pas vrai et écrit.
- **Un moyen de paiement n'apparaît que s'il fonctionne.** Aujourd'hui : code d'activation et reçu BaridiMob/CCP. CIB/Edahabia n'est affiché qu'une fois branché, sans annonce « bientôt ».
- **L'essai de 7 jours n'apparaît qu'une fois CX-17 fait.** Avant, le bouton principal est « Voir les offres ».
- Interface en arabe par défaut, avec la version française ; tous les textes ci-dessous existent dans les deux langues.

## 1. Plan de la page, de haut en bas

| # | Bloc | Contenu | Source des textes |
|---|---|---|---|
| 1 | En-tête | Promesse, sous-titre, bouton principal | §2.1 |
| 2 | Toujours gratuit | Une ligne, avant toute mention payante | `v2-offre-trois-piliers.md` §3 |
| 3 | Trois piliers | Nom, phrase et trois points par pilier, une illustration de Didou par pilier si les images existent | `v2-offre-trois-piliers.md` §2 |
| 4 | Ligne famille | « jusqu'à 6 enfants, préscolaire compris » | `v2-offre-trois-piliers.md` §2 |
| 5 | Voir un exemple | Le bilan du jeudi d'un enfant fictif, clairement marqué comme exemple | §2.2 |
| 6 | Comment ça marche | Trois étapes | §2.3 |
| 7 | Les deux offres | 900 DA / 3 mois ; 2 400 DA / 12 mois mise en avant | §2.4 |
| 8 | Comment payer | Seulement les moyens actifs | §2.5 |
| 9 | Gratuit ou Premium | Tableau court, 6 lignes | §3 |
| 10 | Questions fréquentes | 9 questions | §4 |
| 11 | Pied de page | Conditions de vente, confidentialité, contact | CL-14 |

Les textes des blocs 2 à 4 ne sont pas recopiés ici : la page les lit dans les mêmes données que l'application, pour qu'ils ne divergent jamais.

## 2. Textes

### 2.1 En-tête

| | Arabe | Français |
|---|---|---|
| Titre | يتعلّمُ طفلُكم وحدَه وبمتعة في عالم ديدو، وتعرفون كلَّ أسبوع ما أتقنه وما يحتاج إلى مراجعته. | Votre enfant apprend seul et avec plaisir dans le monde de Didou, et vous voyez chaque semaine ce qu'il sait et ce qu'il doit revoir. |
| Sous-titre | اشتراك «العائلة المميّزة»: كلّ عوالم ديدو، متابعة أسبوعية مفصّلة، وتحضير الاختبارات. | Premium Famille : tout le monde de Didou, un suivi détaillé chaque semaine et la préparation des compositions. |
| Bouton principal, après CX-17 | جرّبوا مجاناً لمدّة 7 أيام | Essayer gratuitement 7 jours |
| Bouton principal, avant CX-17 | اكتشفوا العروض | Voir les offres |
| Bouton secondaire | شاهدوا مثالاً عن الحصيلة | Voir un exemple de bilan |

### 2.2 Voir un exemple (enfant fictif)

Le bloc reprend le vrai composant du bilan du jeudi, rempli avec le profil de démonstration de CX-16. Un bandeau reste visible au-dessus :

| Arabe | Français |
|---|---|
| مثال توضيحي لطفل افتراضي، وليس حصيلة طفل حقيقي. | Exemple fictif : ce n'est pas le bilan d'un vrai enfant. |

Contenu de l'exemple : un enfant de 5AP, trois notions « réussi seul », deux « réussi avec aide », une « à revoir », et la prochaine révision proposée. Les notions sont des leçons réelles du catalogue (par exemple `math-5ap-fractions` et `math-5ap-division`).

### 2.3 Comment ça marche

| # | Arabe | Français |
|---|---|---|
| 1 | أنشئوا حساب العائلة وأضيفوا أطفالكم (حتى 6). | Créez le compte famille et ajoutez vos enfants (jusqu'à 6). |
| 2 | يتعلّم طفلكم مع ديدو على الهاتف أو الحاسوب، بالعربية وبالصوت. | Votre enfant apprend avec Didou sur téléphone ou ordinateur, en arabe et avec la voix. |
| 3 | كلّ خميس، تصلكم حصيلة الأسبوع: ما نجح فيه وحدَه، وما يحتاج إلى مراجعته. | Chaque jeudi, vous recevez le bilan de la semaine : ce qu'il a réussi seul et ce qu'il doit revoir. |

### 2.4 Les deux offres

Le même ensemble de services pour les deux offres. L'offre 12 mois est mise en avant.

| | 3 mois | 12 mois (mise en avant) |
|---|---|---|
| Prix | 900 دج | 2 400 دج |
| Ligne sous le prix (ar) | أي 300 دج في الشهر | أي 200 دج في الشهر |
| Ligne sous le prix (fr) | soit 300 DA par mois | soit 200 DA par mois |
| Étiquette (ar) | — | الأوفر: تدّخرون 1 200 دج مقارنةً بأربعة اشتراكات لثلاثة أشهر |
| Étiquette (fr) | — | Le plus avantageux : 1 200 DA d'économie par rapport à quatre trimestres |
| Mention commune (ar) | دفعة واحدة، دون تجديد تلقائي. | |
| Mention commune (fr) | Un seul paiement, sans renouvellement automatique. | |

Calcul : 4 × 900 = 3 600 DA ; 3 600 − 2 400 = 1 200 DA. Les montants mensuels sont ceux de `pricing.ts` (`monthlyDzd`).

### 2.5 Comment payer

Afficher seulement les lignes actives.

| Moyen | Arabe | Français |
|---|---|---|
| Code d'activation | عندكم كود تفعيل؟ أدخلوه هنا لتفعيل الاشتراك مباشرة. | Vous avez un code d'activation ? Saisissez-le ici pour activer l'abonnement tout de suite. |
| Reçu BaridiMob / CCP | ادفعوا عبر بريدي موب أو الحساب البريدي الجاري، ثم أرسلوا صورة الوصل. يُفعَّل الحساب بعد التحقّق منه. | Payez par BaridiMob ou CCP, puis envoyez la photo du reçu. Le compte est activé après vérification. |
| CIB / Edahabia, une fois branché | الدفع بالبطاقة الذهبية أو بطاقة CIB. | Paiement par carte Edahabia ou CIB. |

Le délai de vérification d'un reçu n'est pas annoncé tant que Karim ne l'a pas fixé.

## 3. Gratuit ou Premium (tableau court)

| Arabe | Français | Gratuit | Premium Famille |
|---|---|---|---|
| الدروس والتمارين والاختبارات والامتحانات المصحَّحة | Cours, exercices, quiz et examens corrigés | ✓ | ✓ |
| عالم ديدو | Le monde de Didou | Mondes 1 et 2 | Les 8 mondes, tous les jeux et toutes les missions |
| مساعدي | « مساعدي » | Indices et règle ; 3 corrections détaillées par jour | Corrections détaillées sans limite |
| حصيلة الخميس | Bilan du jeudi | Court | Détaillé, avec cahier de rattrapage |
| تحضير الاختبارات | Préparation des compositions | 2 premiers jours du plan | Plan de 10 jours, sujets d'examen en PDF, préparation au collège (5AP) |
| كرّاسات الكفاءات | Cahiers de compétence | 3 par semaine pour la famille | Sans limite |

Chaque ligne correspond à une clé de `entitlements.ts` (`courseLessons`/`examsV1`, `journeyFreeWorlds`/`journeyAllWorlds`, `musaidiHints`/`musaidiCorrections`, `weeklyReportLight`/`weeklyReportShare`, `examPlan`/`examPapers`/`cemPrep`, `competenceCahiers`). Si une clé change, la ligne change.

## 4. Questions fréquentes

| # | Question (ar) | Réponse (ar) | Question (fr) | Réponse (fr) |
|---|---|---|---|---|
| 1 | ما الذي يبقى مجانياً؟ | كلّ الدروس والتمارين والاختبارات والامتحانات المصحَّحة، أوّل عالمين من عوالم ديدو، تلميحات «مساعدي»، تشخيص المستوى، والحصيلة المختصرة ليوم الخميس. | Qu'est-ce qui reste gratuit ? | Tous les cours, exercices, quiz et examens corrigés, les deux premiers mondes de Didou, les indices de « مساعدي », le diagnostic de niveau et le bilan court du jeudi. |
| 2 | كم طفلاً يشمل الاشتراك؟ | حتى 6 أطفال في حساب العائلة نفسه، بما فيهم التحضيري، وبالسعر نفسه. | Combien d'enfants ? | Jusqu'à 6 enfants sur le même compte famille, préscolaire compris, au même prix. |
| 3 | هل يتجدّد الاشتراك تلقائياً؟ | لا. تدفعون مرّة واحدة لثلاثة أشهر أو لسنة. عند انتهاء المدّة يعود الحساب مجانياً. | L'abonnement se renouvelle-t-il tout seul ? | Non. Vous payez une fois pour 3 mois ou un an. À la fin, le compte redevient gratuit. |
| 4 | هل يعمل الاشتراك في تطبيق أندرويد؟ | نعم. عند تفعيل الحساب على الموقع، يُفتح المحتوى المميّز في التطبيق أيضاً بنفس الحساب. | Le Premium marche-t-il dans l'application Android ? | Oui. Une fois le compte activé sur le site, le contenu Premium s'ouvre aussi dans l'application, avec le même compte. |
| 5 | من أين أحصل على كود التفعيل؟ | [à compléter quand des points de vente existent] | Où trouver un code d'activation ? | [à compléter quand des points de vente existent] |
| 6 | هل المحتوى مطابق للبرنامج الرسمي؟ | الدروس مبنيّة على برنامج الجيل الثاني، من التحضيري إلى السنة الخامسة ابتدائي. | Le contenu suit-il le programme officiel ? | Les leçons suivent le programme de deuxième génération, du préscolaire à la 5AP. |
| 7 | ماذا يحدث لبيانات طفلي؟ | لا نطلب إلا اسماً أو لقباً، والمستوى، وصورة رمزية. لا إشهار، ولا نبيع البيانات. التفاصيل في سياسة الخصوصية. | Que deviennent les données de mon enfant ? | Nous ne demandons qu'un prénom ou un pseudo, le niveau et un avatar. Pas de publicité, aucune revente de données. Le détail est dans la politique de confidentialité. |
| 8 | هل يمكن إلغاء الاشتراك أو استرجاع المبلغ؟ | [selon les conditions de vente, CL-14] | Puis-je annuler ou être remboursé ? | [selon les conditions de vente, CL-14] |
| 9 | هل توجد عروض للمدارس؟ | نعم، رخصة للقسم كاملاً. اتصلوا بنا. | Y a-t-il une offre pour les écoles ? | Oui, une licence pour toute la classe. Contactez-nous. |

Avant publication, Codex vérifie dans le code les réponses 3, 4 et 7 : expiration qui repasse en gratuit sans effacer la progression, déblocage dans l'application, données réellement demandées dans le profil enfant. Une réponse qui n'est pas vraie est retirée, pas adaptée.

Questions retirées volontairement : « Les données sont-elles hébergées en Algérie ? » (dépend de l'hébergement choisi en CX-22) et « Mon enfant peut-il utiliser l'application hors connexion ? » (vérifié seulement en partie). Elles reviennent quand la réponse est sûre.

## 5. Ce qu'on n'écrit pas

- Ni « le meilleur », ni « numéro 1 », ni « garanti », ni « réussite assurée ».
- Pas de compte à rebours, de « places limitées » ou de promotion inventée.
- Pas de culpabilisation du parent (« votre enfant prend du retard »).
- Pas de rouge pour les prix ou les alertes.

## 6. Critères d'acceptation (CX-16)

1. À 360 × 640 et 390 × 844, en arabe et en français, les blocs apparaissent dans l'ordre du §1.
2. Prix, droits et piliers viennent du code ; changer un prix dans `pricing.ts` change la page.
3. L'exemple de bilan porte le bandeau « exemple fictif » à toute taille d'écran.
4. En mode Android natif, la page n'est pas atteignable et aucun texte de prix n'est rendu (test `NativeNoPaymentWording`).
5. Seuls les moyens de paiement actifs sont affichés ; le bouton d'essai n'existe qu'avec CX-17.
6. Les réponses 3, 4 et 7 de la FAQ ont été vérifiées dans le code.
7. Claude relit les captures avant le commit.
