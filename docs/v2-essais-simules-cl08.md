# V2 — Essais simulés 1AP, préscolaire et 4AP (CL-08)

Joués par Claude le 16 novembre 2026, sur la V2 locale (http://localhost:3002), navigateur Chromium piloté par script, écran 360 × 640, arabe. Image web construite le 16 novembre au soir : elle ne contient pas encore les corrections faites ensuite dans le code (avatar, Musaidi, accord des nombres d'examens).
Statut : **essais simulés, pas des essais avec de vrais enfants.**

**Voix.** Le navigateur de test n'a pas de voix arabe. Pour vérifier les boutons d'écoute, le script installe une voix arabe factice et relève les enregistrements joués (fichiers `.mp3`). On sait donc si un son part, pas s'il est juste ni s'il s'entend bien.

## Profils joués

| Niveau | Profil | Parcours |
|---|---|---|
| 1AP | Enfant qui ne lit pas encore, invité | Village de Didou → leçon du jour `math-1ap-t1-spatial-relations` (4 étapes), une erreur puis la bonne réponse |
| Préscolaire | Enfant de 4 ans avec un parent pour l'entrée | Coin « éveil » → choix de la langue (porte parents) → « أتعلّم » → « من صفر إلى خمسة » → une activité, une erreur puis la bonne réponse |
| 4AP | Enfant de 4AP, invité | Liste des maths, leçon `math-4ap-numbers-under-100k`, leçon d'arabe `arabic-4ap-parts-of-speech-sentences` (tableau الكلمة / إعرابها), leçon de français `french-4ap-projet1-seq1-presentation-famille` |

## Constats

| # | Niveau | Constat | Gravité | Correction proposée | Capture |
|---|---|---|---|---|---|
| P1 | 1AP | **Après une erreur, la question devient illisible** : la carte passe sur fond crème mais le texte reste blanc (« أين توجد الشمس في النهار؟ »). | **Haute** | Couleur de texte explicite (encre foncée) sur la carte en état « erreur », comme pour Musaidi. | `1ap-question-illisible-apres-erreur.png` |
| P2 | 1AP | **Le message d'erreur n'est pas lu à voix haute** (aucun enregistrement ni voix déclenché) et il est trop difficile pour un enfant de 6 ans : « هذا الخيار («تحت في الأرض») غير مناسب. حاول مرة أخرى اعتمادا على قاعدة الدرس. » Règle de CLAUDE.md : audio sur chaque consigne en 1AP. | **Haute** | Phrase courte et lue : « لَيْسَ هٰذَا. اِسْمَعْ وَحَاوِلْ مَرَّةً أُخْرَى! » (lot 1 de CL-12, phrases de Didou). | — |
| P3 | 1AP | **À l'étape « ألعب », les réponses n'ont pas de bouton d'écoute** (« فوق الغصن » / « تحت الغصن ») : seule la question en a un. Un enfant qui ne lit pas ne peut pas choisir. À l'étape 4, chaque réponse a son bouton : c'est le bon modèle. | **Haute** | Bouton d'écoute sur chaque choix des exercices 1AP et 2AP, comme à l'étape 4. | `1ap-reponses-sans-ecoute.png` |
| P4 | 1AP | Boutons d'écoute de la leçon à 56 × 56 px (et 48 × 48 à l'étape 4), boutons d'en-tête à 44 × 44 px, « معلومة لولي الأمر » à 17 px de haut. CLAUDE.md demande 60 px au moins en 1AP. Le village, lui, respecte les 60 px partout. | Moyenne | Passer ces boutons à 60 px en 1AP et au préscolaire. | `1ap-lecon-boutons-ecoute.png` |
| P5 | 1AP | Le bouton « أحتاج مساعدة (0/1) » des exercices est touché par le même défaut que le profil 4 de la 5AP : l'indice promis après la 1re erreur n'apparaît pas. | Moyenne | CX-29. | — |
| P6 | Préscolaire | **Sur le chemin des chiffres, chaque bulle porte une pastille d'ordre décalée d'un cran** : la bulle « 1 » porte un « 2 », la bulle « 2 » un « 3 ». Un enfant qui apprend les chiffres voit deux chiffres différents sur la même bulle. | **Haute** | Retirer la pastille d'ordre au préscolaire (ou la remplacer par une étoile ou un cadenas). | `pre-pastilles-chiffres.png` |
| P7 | Préscolaire | **L'accueil du coin préscolaire n'a aucun bouton d'écoute** pour sa consigne (« اِخْتَرْ باباً والْعَبْ مَعَ دِيدُو ») et aucun son ne part à l'arrivée ; même chose dans « أتعلّم » et la liste des activités. Règle « zéro texte » de CLAUDE.md. | **Haute** | Consigne lue à l'arrivée et bouton « اسمع » de 60 px sur chaque écran de choix. | `pre-accueil-sans-ecoute.png` |
| P8 | Préscolaire | Le premier choix de langue est protégé par la porte parents, mais les boutons AR / FR / EN en haut de l'accueil changent la langue en un geste, sans porte. | Moyenne | Même porte parents que le premier choix, ou boutons déplacés dans les réglages. | `pre-accueil-sans-ecoute.png` |
| P9 | Préscolaire | Après une mauvaise réponse dans l'activité des chiffres, aucune phrase n'est jouée et rien ne change à l'écran que le script puisse relever. Une animation ou un petit son (Web Audio) peuvent exister sans être visibles pour le script. | À vérifier | Vérifier sur téléphone ; sinon, phrase douce enregistrée (« حَاوِلْ مَرَّةً أُخْرَى ») et léger tremblement de la carte. | — |
| P10 | Préscolaire | La fenêtre de badge « 🏅 وِسَامٌ جَدِيد! … أَنْهَيْتَ أَوَّلَ نَشَاط! » n'est que du texte, non lu, et au masculin. | Basse | Lire la phrase ; tournure neutre (« أَوَّلُ نَشَاطٍ اكْتَمَلَ! »). | — |
| P11 | 4AP | « بين ألفين متتاليتين » au lieu de « متتاليين » (ألف est masculin), y compris dans un titre de leçon : 22 occurrences (3AP, 4AP, examens). | Moyenne | **Corrigé le 16 novembre** sur `v2` et sur la branche `fix/textes-faible-risque` pour `main` (M-14). | — |
| P12 | 4AP | **Leçon de français affichée de droite à gauche** : titre, résumé et règle sont alignés à droite comme de l'arabe ; seul l'encadré de la mission est en `ltr`. | Moyenne | `dir="ltr"` sur les blocs de contenu des leçons de français et d'anglais (sauf les aides en arabe pour le parent). | `4ap-francais-rtl.png` |
| P13 | Tous | Le logo de l'en-tête est coupé à 360 px (« .SID DZ » en 1AP, « Z » seul en 4AP et 5AP). | Basse | Logo court (icône seule) sous 400 px. | `1ap-lecon-boutons-ecoute.png` |
| P14 | 4AP / 5AP | Sur téléphone, « العمليات » et « الحل / الأجوبة » sont empilés l'un sous l'autre, pas côte à côte comme dans la présentation officielle à deux colonnes. | À décider | Garder l'empilement à 360 px (lisible) ou forcer deux colonnes étroites ; à trancher avec l'enseignant. | — |

## Ce qui marche bien

- **Village 1AP** : toutes les zones à toucher font 60 px ou plus ; « اسمع مهمتي » et « اسمع ديدو » jouent des enregistrements (voix réelle, pas la voix du téléphone).
- **Étape 4 de la leçon 1AP** : chaque réponse a son bouton d'écoute ; la bonne réponse passe en vert avec « إجابة صحيحة ».
- **Activité des chiffres du préscolaire** : consigne jouée dès l'arrivée (`num-2-prompt.mp3`), bouton « إعادة الاستماع », trois grands chiffres de 96 px, presque aucun texte ; la réussite joue `num-2-success.mp3` et passe à l'activité suivante.
- **Choix de la langue au préscolaire** protégé par la porte parents.
- **4AP arabe** : le tableau « الكَلِمَةُ / إِعْرَابُهَا » est bien présent à l'étape « أتذكر القاعدة », de droite à gauche.

## Suite

- Codex : P1 à P4, P6 à P8 et P12 dans CX-08 (du plus grave au moins grave) ; P5 dans CX-29.
- Claude : rejouer ces parcours après correction, et P9 sur un vrai téléphone Android.
- Non joué : 2AP et 3AP (hors du périmètre de CL-08).
