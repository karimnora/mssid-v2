# V2 — Ce que dit Didou pendant une leçon (CL-09)

Rédigé par Claude le 15 novembre 2026, pour la tâche CX-11 de Codex et l'écran É4 de `docs/v2-spec-parcours-5ap-maths.md`.
Statut : **projet**. L'arabe est entièrement vocalisé ; il reste à faire relire par un enseignant avant la vente.

## Règle du genre

Le profil enfant ne contient pas le genre (prénom ou pseudo, niveau, avatar seulement). Donc :

1. **Par défaut, Didou parle au neutre.** Il dit « nous » (« نُحَاوِلُ », « لِنُفَكِّرْ ») ou utilise une phrase sans verbe adressé à l'enfant. C'est ce qui s'applique aujourd'hui.
2. Les variantes **masculin** et **féminin** sont prêtes. Elles ne servent que si un champ « genre » facultatif est ajouté un jour au profil enfant, rempli par le parent. Décision ouverte : ce champ ajoute une donnée personnelle sur l'enfant (loi 18-07), et le neutre suffit pour parler naturellement.
3. Les phrases d'ouverture d'étape actuelles (`STEP_LINES` dans `components/lessonViewer/LessonDidou.tsx`) sont au masculin ; elles passent au neutre ci-dessous.

## Poses

Les poses existent déjà dans `components/world/DidouPortrait` : **parle**, **réfléchit**, **montre**, **célèbre**.

## 1. Ouverture des étapes

Remplace `STEP_LINES`. Les étapes « أكتشف » et « أفهم » gardent le texte tiré de la leçon (`didouLineForStep`).

| Clé | Pose | Neutre (par défaut) | Masculin | Féminin |
|---|---|---|---|---|
| `step.practice` | parle | هَيَّا نَتَدَرَّبُ! نَبْدَأُ بِالمُسْتَوَى الأَوَّلِ، ثُمَّ نَصْعَدُ خُطْوَةً خُطْوَةً. | هَيَّا نَتَدَرَّبُ! اِبْدَأْ بِالمُسْتَوَى الأَوَّلِ، ثُمَّ اصْعَدْ خُطْوَةً خُطْوَةً. | هَيَّا نَتَدَرَّبُ! اِبْدَئِي بِالمُسْتَوَى الأَوَّلِ، ثُمَّ اصْعَدِي خُطْوَةً خُطْوَةً. |
| `step.interactive` | montre | لِنُجَرِّبْ بِأَيْدِينَا: نَنْقُرُ وَنَكْتَشِفُ. | جَرِّبْ بِيَدِكَ: اُنْقُرْ وَاكْتَشِفْ. | جَرِّبِي بِيَدِكِ: اُنْقُرِي وَاكْتَشِفِي. |
| `step.gameplay` | parle | هَيَّا نُجَرِّبُ التَّجْرِبَةَ مَعاً! | (identique) | (identique) |
| `step.evaluation` | parle | حَانَ وَقْتُ التَّقْوِيمِ. نَقْرَأُ كُلَّ سُؤَالٍ بِهُدُوءٍ. | حَانَ وَقْتُ التَّقْوِيمِ. اِقْرَأْ كُلَّ سُؤَالٍ بِهُدُوءٍ. | حَانَ وَقْتُ التَّقْوِيمِ. اِقْرَئِي كُلَّ سُؤَالٍ بِهُدُوءٍ. |
| `step.quiz` | parle | آخِرُ مَرْحَلَةٍ! وَإِذَا وَقَعَ خَطَأٌ، فَأَنَا هُنَا لِلْمُسَاعَدَةِ. | آخِرُ مَرْحَلَةٍ! أَجِبْ، وَإِنْ أَخْطَأْتَ أُسَاعِدُكَ. | آخِرُ مَرْحَلَةٍ! أَجِيبِي، وَإِنْ أَخْطَأْتِ أُسَاعِدُكِ. |

## 2. Pendant un exercice

L'ordre suit l'écran É4 de la spécification : encouragement, puis indice, puis méthode. Jamais la réponse seule au premier essai.

| Clé | Moment | Pose | Neutre (par défaut) | Masculin | Féminin |
|---|---|---|---|---|---|
| `error.first` | 1re erreur | réfléchit | مُحَاوَلَةٌ جَيِّدَةٌ! نُعِيدُ قِرَاءَةَ السُّؤَالِ وَنُحَاوِلُ مَرَّةً أُخْرَى. | مُحَاوَلَةٌ جَيِّدَةٌ! أَعِدْ قِرَاءَةَ السُّؤَالِ وَحَاوِلْ مَرَّةً أُخْرَى. | مُحَاوَلَةٌ جَيِّدَةٌ! أَعِيدِي قِرَاءَةَ السُّؤَالِ وَحَاوِلِي مَرَّةً أُخْرَى. |
| `error.first.alt` | 1re erreur (variante, pour ne pas répéter) | réfléchit | الخَطَأُ يُعَلِّمُنَا. لِنُفَكِّرْ مِنْ جَدِيدٍ. | الخَطَأُ يُعَلِّمُنَا. فَكِّرْ مِنْ جَدِيدٍ. | الخَطَأُ يُعَلِّمُنَا. فَكِّرِي مِنْ جَدِيدٍ. |
| `error.hint` | 2e erreur, avant l'indice | montre | هَذَا تَلْمِيحٌ صَغِيرٌ يُسَاعِدُنَا: | إِلَيْكَ تَلْمِيحاً صَغِيراً: | إِلَيْكِ تَلْمِيحاً صَغِيراً: |
| `error.method` | 3e erreur, avant la méthode | montre | لِنَنْظُرْ إِلَى الطَّرِيقَةِ خُطْوَةً خُطْوَةً، ثُمَّ نُجَرِّبُ تَمْرِيناً شَبِيهاً. | اُنْظُرْ إِلَى الطَّرِيقَةِ خُطْوَةً خُطْوَةً، ثُمَّ جَرِّبْ تَمْرِيناً شَبِيهاً. | اُنْظُرِي إِلَى الطَّرِيقَةِ خُطْوَةً خُطْوَةً، ثُمَّ جَرِّبِي تَمْرِيناً شَبِيهاً. |
| `help.asked` | tap sur « ساعدني » | réfléchit | حَسَناً، نُفَكِّرُ مَعاً. | (identique) | (identique) |
| `success.alone` | réussite sans aide, avant la règle | célèbre | إِجَابَةٌ صَحِيحَةٌ! | أَحْسَنْتَ! | أَحْسَنْتِ! |
| `success.helped` | réussite après indice ou méthode | célèbre | نَجَحْنَا مَعاً! وَفِي المَرَّةِ القَادِمَةِ نُحَاوِلُ دُونَ مُسَاعَدَةٍ. | نَجَحْتَ بِمُسَاعَدَةٍ صَغِيرَةٍ. وَفِي المَرَّةِ القَادِمَةِ سَتَنْجَحُ وَحْدَكَ! | نَجَحْتِ بِمُسَاعَدَةٍ صَغِيرَةٍ. وَفِي المَرَّةِ القَادِمَةِ سَتَنْجَحِينَ وَحْدَكِ! |
| `streak.3` | 3 réussites de suite | célèbre | ثَلَاثُ إِجَابَاتٍ صَحِيحَةٍ مُتَتَالِيَةٍ! رَائِعٌ! | (identique) | (identique) |
| `streak.5` | 5 réussites de suite | célèbre | خَمْسُ إِجَابَاتٍ صَحِيحَةٍ مُتَتَالِيَةٍ! عَمَلٌ مُمْتَازٌ! | (identique) | (identique) |

**Après `success.alone` :** Didou lit ensuite la règle de la leçon, précédée de « القَاعِدَةُ: » (`rulesAr[0]` ou `keyFormulas[0]`). Si la leçon n'en a pas, il s'arrête à la félicitation.

**Après `error.hint` et `error.method` :** Didou lit l'indice ou la méthode tels qu'ils sont dans le catalogue ou dans « مساعدي ». Aucun texte n'est généré.

## 3. Fin de leçon

| Clé | Moment | Pose | Neutre (par défaut) | Masculin | Féminin |
|---|---|---|---|---|---|
| `lesson.done` | quiz réussi à 100 % | célèbre | أَنْهَيْنَا الدَّرْسَ! كُلُّ الإِجَابَاتِ صَحِيحَةٌ. | أَحْسَنْتَ! أَنْهَيْتَ الدَّرْسَ وَكُلُّ إِجَابَاتِكَ صَحِيحَةٌ. | أَحْسَنْتِ! أَنْهَيْتِ الدَّرْسَ وَكُلُّ إِجَابَاتِكِ صَحِيحَةٌ. |
| `lesson.almost` | quiz pas encore à 100 % | réfléchit | اِقْتَرَبْنَا! نُرَاجِعُ الأَسْئِلَةَ الَّتِي أَخْطَأْنَا فِيهَا، ثُمَّ نُعِيدُ. | اِقْتَرَبْتَ! رَاجِعِ الأَسْئِلَةَ الَّتِي أَخْطَأْتَ فِيهَا، ثُمَّ أَعِدِ المُحَاوَلَةَ. | اِقْتَرَبْتِ! رَاجِعِي الأَسْئِلَةَ الَّتِي أَخْطَأْتِ فِيهَا، ثُمَّ أَعِيدِي المُحَاوَلَةَ. |
| `mission.done` | mission du jour terminée (accueil) | célèbre | مُهِمَّةُ اليَوْمِ تَمَّتْ! نَلْتَقِي غَداً بِمُهِمَّةٍ جَدِيدَةٍ. | (identique) | (identique) |

## 4. Règles pour Codex (CX-11)

- Ranger ces phrases dans un seul fichier de données, par exemple `frontend/src/data/didou/lessonLines.ts`, avec les clés ci-dessus et les trois formes `neutral`, `m`, `f`. Une fonction choisit la forme : `neutral` tant que le profil n'a pas de genre.
- Alterner `error.first` et `error.first.alt` pour qu'un enfant n'entende pas deux fois de suite la même phrase.
- Le texte est affiché sous Didou **et** lu ; un bouton « اِسْتَمِعْ إِلَى دِيدُو » permet de réécouter (déjà dans `DidouGuide`).
- Aucune phrase ne dit de réponse, de prix ou de nombre de points.
- Ces phrases fixes sont les premières candidates à l'enregistrement d'une vraie voix (CL-12). D'ici là, la synthèse vocale lit le texte vocalisé.
- Test ciblé : chaque clé a ses trois formes non vides, et la forme neutre ne contient aucun pronom ni verbe à la 2e personne du singulier (`ـكَ`, `ـكِ`, `أَنْتَ`, `أَنْتِ`).
