# V2 — Le sac de Didou (CL-10)

Rédigé par Claude le 15 novembre 2026, pour la tâche CX-12 de Codex.
Statut : **projet**. L'arabe est vocalisé ; les textes et les faits sont à faire relire par un enseignant avant la vente.

## Principe

À la fin de chaque monde, l'enfant ouvre déjà le trésor et gagne la médaille du monde (`utils/journeyProgress.ts`). **Au même moment**, Didou range dans son sac un objet typique du lieu. Aucune nouvelle règle de progression : l'objet suit exactement le trésor.

- **Le sac** est une vitrine de 8 cases, ouverte depuis la planète et la carte. Une case gagnée montre l'objet en couleur ; une case pas encore gagnée montre sa silhouette grise (filtre CSS sur la même image, pas de seconde image).
- **Un tap sur un objet gagné** : Didou dit son nom, puis un fait vrai sur le lieu, lu à voix haute et affiché.
- **Par enfant** : la collection est rangée avec la progression de l'enfant actif (`getActiveProgressOwner`), jamais partagée entre frères et sœurs.
- **Aucune perte** : un objet gagné ne disparaît jamais, même après une longue absence ou la fin du Premium.
- **Accès** : les objets des mondes 1 et 2 se gagnent en gratuit ; ceux des mondes 3 à 8 suivent le cadenas de la carte (`journeyAllWorlds`). Les silhouettes restent visibles pour tous, sans prix.

## Les 8 objets

Didou parle au neutre, comme dans `docs/v2-didou-phrases-lecon.md`.

| Monde | Clé | Objet (arabe · français) | Didou, quand l'objet arrive | Le fait, au tap |
|---|---|---|---|---|
| 1. Le Sahara | `desert-rose` | وَرْدَةُ الرِّمَالِ · La rose des sables | وَرْدَةُ الرِّمَالِ فِي حَقِيبَتِنَا! | تَتَكَوَّنُ وَرْدَةُ الرِّمَالِ فِي الصَّحْرَاءِ مِنْ بَلُّورَاتٍ وَرِمَالٍ، وَتُشْبِهُ زَهْرَةً مِنْ حَجَرٍ. |
| 2. La Casbah | `casbah-lantern` | فَانُوسُ القَصَبَةِ · La lanterne de la Casbah | فَانُوسُ القَصَبَةِ يُضِيءُ حَقِيبَتَنَا! | القَصَبَةُ حَيٌّ قَدِيمٌ فِي مَدِينَةِ الجَزَائِرِ، مُصَنَّفٌ تُرَاثاً عَالَمِيّاً. |
| 3. La mer | `sea-shell` | صَدَفَةُ البَحْرِ · Le coquillage | صَدَفَةٌ مِنْ شَاطِئِ البَحْرِ فِي حَقِيبَتِنَا! | لِلْجَزَائِرِ سَاحِلٌ طَوِيلٌ عَلَى البَحْرِ الأَبْيَضِ المُتَوَسِّطِ. |
| 4. Constantine | `constantine-bridge` | جِسْرُ قَسَنْطِينَةَ الصَّغِيرُ · Le petit pont de Constantine | جِسْرٌ صَغِيرٌ مِنْ قَسَنْطِينَةَ فِي حَقِيبَتِنَا! | تُلَقَّبُ قَسَنْطِينَةُ بِمَدِينَةِ الجُسُورِ المُعَلَّقَةِ، وَهِيَ مَبْنِيَّةٌ عَلَى صَخْرَةٍ فَوْقَ وَادِي الرِّمَالِ. |
| 5. Le Djurdjura | `kabyle-jar` | جَرَّةُ الفَخَّارِ · La jarre en terre cuite | جَرَّةُ فَخَّارٍ مُلَوَّنَةٌ فِي حَقِيبَتِنَا! | فِي مِنْطَقَةِ القَبَائِلِ يُصْنَعُ فَخَّارٌ مُزَخْرَفٌ بِاليَدِ، وَتَكْسُو الثُّلُوجُ قِمَمَ جُرْجُرَةَ فِي الشِّتَاءِ. |
| 6. Timgad | `timgad-mosaic` | قِطْعَةُ فُسَيْفِسَاءَ · Le morceau de mosaïque | قِطْعَةُ فُسَيْفِسَاءَ مِنْ تِيمْقَادَ فِي حَقِيبَتِنَا! | تِيمْقَادُ مَدِينَةٌ أَثَرِيَّةٌ بُنِيَتْ قَبْلَ نَحْوِ أَلْفَيْ سَنَةٍ، وَهِيَ مُصَنَّفَةٌ تُرَاثاً عَالَمِيّاً. |
| 7. Le Tassili | `tassili-rock` | حَجَرُ الزَّرَافَةِ · La pierre à la girafe | حَجَرٌ عَلَيْهِ رَسْمُ زَرَافَةٍ فِي حَقِيبَتِنَا! | فِي الطَّاسِيلِي نَاجِرَ رُسُومٌ قَدِيمَةٌ جِدّاً عَلَى الصُّخُورِ، تُظْهِرُ حَيَوَانَاتٍ عَاشَتْ فِي الصَّحْرَاءِ حِينَ كَانَتْ خَضْرَاءَ. |
| 8. L'espace | `telescope` | المِنْظَارُ الفَلَكِيُّ · La lunette astronomique | مِنْظَارٌ لِرُؤْيَةِ النُّجُومِ فِي حَقِيبَتِنَا! | فِي بُوزَرِيعَةَ، فِي مَدِينَةِ الجَزَائِرِ، مَرْصَدٌ فَلَكِيٌّ قَدِيمٌ يُرَاقِبُ النُّجُومَ مُنْذُ أَكْثَرَ مِنْ مِئَةِ سَنَةٍ. |

**Quand les 8 objets sont réunis :** « حَقِيبَتُنَا مُمْتَلِئَةٌ بِكُنُوزِ الجَزَائِرِ! » (pose : célèbre).

**Textes de l'écran du sac :**

| Élément | Arabe | Français |
|---|---|---|
| Titre | حَقِيبَةُ دِيدُو | Le sac de Didou |
| Sous-titre | كَنْزٌ مِنْ كُلِّ عَالَمٍ | Un trésor de chaque monde |
| Case pas encore gagnée (lecture d'écran) | لَمْ نَصِلْ إِلَى هَذَا العَالَمِ بَعْدُ | Monde pas encore atteint |
| Bouton de fermeture | رُجُوع | Retour |

## Consignes d'image pour Codex (génération en CX-12)

**Style commun aux 8 images :**
- même rendu 3D doux que les objets existants (`frontend/src/assets/world/objects/obj-chest.webp`, `obj-star.webp`) et que Didou ;
- un seul objet, centré, vu de trois quarts légèrement en plongée, qui remplit environ 80 % du cadre ;
- fond uni vert pur (#00FF00) pour le détourage, ou fond transparent ; ombre douce sous l'objet ;
- format carré, 512 × 512 px en sortie, exporté en WebP de 40 Ko au plus ;
- couleurs chaudes et lisibles sur le ciel de nuit de la planète comme sur le fond crème ;
- **interdits** : aucun texte, aucune lettre, aucun chiffre, aucun drapeau, aucun logo, aucun visage humain, rien de religieux sur l'objet.

**Ce que montre chaque image :**

| Clé | Description |
|---|---|
| `desert-rose` | Une rose des sables couleur ocre et sable, aux pétales de cristal plats et serrés, posée sur un petit tas de sable fin. |
| `casbah-lantern` | Une lanterne traditionnelle en cuivre ciselé, aux vitres colorées (bleu, rouge, vert), allumée d'une lumière chaude. Inspirée des lanternes artisanales algériennes, sans motif d'un autre pays. |
| `sea-shell` | Un coquillage nacré rose et blanc, avec une petite étoile de mer orange à côté, sur un peu de sable mouillé. |
| `constantine-bridge` | Une maquette de pont suspendu en pierre et métal posée sur un rocher, avec un petit vide en dessous comme une gorge. Pas une copie exacte d'un pont réel, pas de texte. |
| `kabyle-jar` | Une jarre en terre cuite claire, peinte de motifs géométriques rouges et noirs (triangles, losanges), dans l'esprit de la poterie kabyle. |
| `timgad-mosaic` | Un carreau de mosaïque romaine aux petites tesselles colorées formant un motif géométrique et une feuille, bords légèrement abîmés. |
| `tassili-rock` | Une pierre plate couleur grès, gravée d'une girafe stylisée au trait, comme les gravures rupestres anciennes. |
| `telescope` | Une petite lunette astronomique ancienne en laiton sur son trépied, pointée vers le haut, avec quelques étoiles dorées autour. |

Claude relit chaque image avant intégration : fidélité au lieu, aucun élément interdit, lisibilité en petit (80 px).

## Règles pour Codex (CX-12)

- Données dans un seul fichier, par exemple `frontend/src/data/journey/didouBag.ts` : clé, monde, nom arabe et français, phrase d'arrivée, fait, image.
- L'objet est gagné quand le trésor du monde est ouvert ; rien d'autre ne le donne.
- Les faits et les phrases s'affichent tels quels : pas de texte généré.
- Mouvement réduit : l'objet apparaît sans animation de vol ; mode « données légères » : images chargées seulement à l'ouverture du sac.
- Test ciblé : 8 objets, un par monde, chaque texte présent en arabe et en français, aucun objet partagé entre deux profils.

## Points à faire vérifier

- **Les faits**, par l'enseignant relecteur, en particulier la date de Timgad (fondée vers l'an 100) et l'ancienneté de l'observatoire de Bouzaréah (fin du XIXe siècle).
- **L'objet de la Casbah** : Karim préfère peut-être un autre symbole (la porte de la Casbah, un plateau en cuivre).
