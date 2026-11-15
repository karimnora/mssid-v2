# V2 — L'offre Premium en trois piliers (CL-02)

Rédigé par Claude le 15 novembre 2026, pour la tâche CX-06 de Codex (`docs/v2-todo-claude-codex.md`).
But : qu'un parent comprenne l'offre en dix secondes. Les 11 lignes Premium du registre deviennent trois piliers, avec les mêmes mots partout (application, site, e-mail du jeudi).

**Ce document ne change aucun accès.** Les niveaux `free` / `quota` / `premium`, les quotas et les prix restent ceux de `frontend/src/access/entitlements.ts` et de la décision du 3 novembre 2026.

## 1. La promesse (une phrase)

| | Texte |
|---|---|
| Français | Votre enfant apprend seul et avec plaisir dans le monde de Didou, et vous voyez chaque semaine ce qu'il sait et ce qu'il doit revoir. |
| Arabe | يتعلّمُ طفلُكم وحدَه وبمتعة في عالم ديدو، وتعرفون كلَّ أسبوع ما أتقنه وما يحتاج إلى مراجعته. |

## 2. Les trois piliers

Chaque pilier a un nom court, une phrase et trois points au plus. Les points ne décrivent que ce qui existe déjà dans le code de `v2`.

### Pilier 1 — L'aventure de Didou (`adventure`)

| | Français | Arabe |
|---|---|---|
| Nom | L'aventure complète de Didou | مغامرة ديدو كاملة |
| Phrase | Les 8 mondes de l'Algérie, tous les jeux et toutes les missions. | عوالم الجزائر الثمانية، وكلّ الألعاب والمهمّات. |
| Point 1 | Les mondes 3 à 8 de la carte, avec leurs médailles | العوالم من 3 إلى 8 في الخريطة، مع أوسمتها |
| Point 2 | Tous les jeux de Didou, à chaque niveau | كلّ ألعاب ديدو في كلّ مستوى |
| Point 3 | Les missions, ateliers et laboratoires guidés par Didou | المهمّات والورشات والمخابر بمرافقة ديدو |

### Pilier 2 — Le suivi du parent (`parent`)

| | Français | Arabe |
|---|---|---|
| Nom | Le suivi du parent | متابعة الوليّ |
| Phrase | Vous savez chaque semaine où en est votre enfant, et quoi faire ensuite. | تعرفون كلَّ أسبوع مستوى طفلكم، وما الذي تفعلونه بعد ذلك. |
| Point 1 | Le bilan détaillé du jeudi : réussi seul, réussi avec aide, à revoir | حصيلة الخميس المفصّلة: نجح وحده، نجح بمساعدة، يحتاج مراجعة |
| Point 2 | Le carnet complet : compétences, historique, plan de la semaine | الدفتر الكامل: الكفاءات، السجلّ، خطّة الأسبوع |
| Point 3 | Le cahier de rattrapage prêt à imprimer, sur ses vraies erreurs | كرّاسة الاستدراك جاهزة للطباعة، مبنيّة على أخطائه الحقيقية |

### Pilier 3 — La réussite aux examens (`exams`)

| | Français | Arabe |
|---|---|---|
| Nom | La réussite aux examens | النجاح في الامتحانات |
| Phrase | Préparer chaque composition avec un plan fait pour votre enfant. | التحضير لكلّ اختبار بخطّة مصمَّمة لطفلكم. |
| Point 1 | Le plan « 10 jours avant la composition », construit sur ses erreurs | خطّة «10 أيام قبل الاختبار» مبنيّة على أخطائه |
| Point 2 | Les sujets d'examen corrigés et la préparation au collège en 5AP | مواضيع امتحانات مصحَّحة، والتحضير للمتوسّط في السنة الخامسة |
| Point 3 | Les corrections détaillées de « مساعدي » et les cahiers, sans limite | تصحيحات «مساعدي» المفصّلة والكرّاسات بلا حدود |

### Ligne commune sous les trois piliers

| Français | Arabe |
|---|---|
| Un seul abonnement pour toute la famille : jusqu'à 6 enfants, préscolaire compris. | اشتراكٌ واحد لكلّ العائلة: حتى 6 أطفال، بما فيهم التحضيري. |

## 3. Ce qui reste gratuit (à afficher avant les piliers)

| Français | Arabe |
|---|---|
| Toujours gratuit : tous les cours, exercices, quiz et examens corrigés, les deux premiers mondes de Didou, les indices de « مساعدي », le diagnostic de niveau et le bilan court du jeudi. | مجّاني دائماً: كلّ الدروس والتمارين والاختبارات والامتحانات المصحَّحة، أوّل عالمين من عوالم ديدو، تلميحات «مساعدي»، تشخيص المستوى، والحصيلة المختصرة ليوم الخميس. |

## 4. Classement des clés du registre

À ajouter dans `access/entitlements.ts` : un champ facultatif `pillar?: 'adventure' | 'parent' | 'exams'` sur les clés `premium` et `quota`. Les clés `free` n'ont pas de pilier.

| Clé | Niveau actuel (inchangé) | Pilier |
|---|---|---|
| `journeyAllWorlds` | premium | `adventure` |
| `learningGames` | premium | `adventure` |
| `immersiveMissions` | premium | `adventure` |
| `familyWorkshops` | premium | `adventure` |
| `preschoolMissions` | premium | `adventure` |
| `familyStudio` | premium | `adventure` |
| `parentNotebookDetail` | premium | `parent` |
| `weeklyReportShare` | premium | `parent` |
| `examPlan` | premium | `exams` |
| `examPapers` | premium | `exams` |
| `cemPrep` | premium | `exams` |
| `musaidiCorrections` | quota (3 par jour) | `exams` |
| `competenceCahiers` | quota (3 par semaine) | `exams` |

Le cahier de rattrapage du pilier 2 vient de `weeklyReportShare` ; les cahiers sans limite du pilier 3 viennent de `competenceCahiers`. Les deux mentions sont voulues : le parent voit l'outil là où il s'en sert.

## 5. Où l'appliquer (CX-06)

1. **Fiche d'offre sur le site** (`PremiumOffer.tsx` et la vitrine `PremiumShowcase.tsx`) : promesse, ligne « Toujours gratuit », trois piliers, ligne famille, puis les deux offres (900 DA / 3 mois, 2 400 DA / 12 mois mise en avant). Aucun autre texte de bénéfice.
2. **Cadenas et messages Premium dans l'application** : le message neutre existant (« متاح لحسابات العائلة المميزة ») peut ajouter le **nom du pilier** concerné, par exemple « Fait partie de l'aventure complète de Didou » / « جزء من مغامرة ديدو كاملة ». Sur Android : jamais de prix, de bouton d'achat ni de renvoi vers le site.
3. **E-mail du jeudi** (comptes gratuits seulement) : une ligne qui nomme le pilier 2, « Le bilan détaillé fait partie du suivi du parent », avec le lien existant vers l'offre.
4. **Tableau généré `docs/v2-gratuit-payant.md`** : ajouter une colonne « Pilier » via `renderEntitlementsTable()`, pour que le test `entitlements.test.ts` reste la seule source de vérité.

Critère d'acceptation : sur la fiche d'offre, un parent ne lit que la promesse, la ligne gratuite, trois noms de piliers avec trois points chacun, la ligne famille et deux prix ; les tests ciblés de `entitlements` et de la fiche d'offre passent.

## Points ouverts

- Faut-il un visuel par pilier (Didou explorateur, Didou avec le carnet, Didou avec un diplôme) ? Si oui, consignes d'image à rédiger par Claude, génération par Codex.
- Les textes arabes sont à faire relire par un enseignant ou un relecteur arabophone avant la vente.
