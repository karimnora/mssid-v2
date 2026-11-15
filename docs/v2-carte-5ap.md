# V2 — Carte de Didou en 5AP : quelle leçon dans quelle station (CL-11)

Vérifié par Claude le 15 novembre 2026 sur `v2` (après la fusion de la V1). Sert à la tâche CX-15.

## Résultat

**La carte 5AP existe déjà et elle est juste.** Le plan `PLAN_5AP` (`frontend/src/data/journey/journeyWorldsByGrade.ts`) est utilisé par la carte et par la planète dès que l'enfant est en 5AP (`JOURNEYS['5AP']` dans `journeyWorlds.ts`). Aucune modification de code n'est nécessaire pour CL-11.

Vérifications faites dans le catalogue :
- les 24 leçons existent ;
- chaque monde respecte l'ordre des trimestres : mondes 1 à 3 au 1er trimestre, 4 à 6 au 2e, 7 et 8 au 3e ;
- les textes d'accueil de Didou respectent le programme (nombres jusqu'au milliard, division euclidienne, décimaux, pourcentages).

## Les 8 mondes en 5AP

| Monde | Accès | Trimestre | Thème | Les 3 stations (leçons) |
|---|---|---|---|---|
| 1. Le Sahara | Gratuit | 1 | Les grands nombres et la place de l'Algérie | `math-5ap-large-numbers` · `math-5ap-operations` · `geo-5ap-location-importance` |
| 2. La Casbah | Gratuit | 1 | La phrase et les époques de l'histoire | `arabic-5ap-sentence-components` · `arabic-5ap-passive-voice` · `history-5ap-periods-landmarks` |
| 3. La mer | Premium | 1 | L'air et la conquête islamique | `science-5ap-respiration-health` · `science-5ap-air-properties` · `history-5ap-islamic-conquest` |
| 4. Constantine | Premium | 2 | Division, fractions, durées | `math-5ap-division` · `math-5ap-fractions` · `math-5ap-durations` |
| 5. Le Djurdjura | Premium | 2 | Électricité, plantes, relief | `science-5ap-electric-circuit` · `science-5ap-plant-reproduction` · `geo-5ap-relief-climate-vegetation` |
| 6. Timgad | Premium | 2 | L'analyse grammaticale avancée | `arabic-5ap-kan-inna` · `arabic-5ap-maf3ul-types` · `arabic-5ap-tamyiz` |
| 7. Le Tassili | Premium | 3 | Résistance, Révolution, le hal | `arabic-5ap-hal-five-names-verbs` · `history-5ap-french-colonization-popular-resistances` · `history-5ap-glorious-revolution-1954` |
| 8. L'espace | Premium | 3 | Décimaux, pourcentages, aires | `math-5ap-decimals` · `math-5ap-percentage-scale` · `math-5ap-perimeters-areas` |

Le cadenas Premium ne porte que sur le parcours de la carte, ses trésors et ses médailles. Les 24 leçons restent gratuites dans « دروسي » (décision du 3 novembre 2026).

## Points à connaître

1. **Les leçons du parcours de référence sont dans un monde Premium.** Les fractions et la division sont dans le monde 4 (Constantine). Un enfant au compte gratuit y accède par « دروسي » et par la mission du jour, pas par la carte. C'est cohérent avec la spécification `v2-spec-parcours-5ap-maths.md` (décision ouverte n° 2).
2. **7 leçons de maths 5AP sur 15 ne sont pas sur la carte** : longueurs, masses et capacités ; droites et angles (1er trimestre) ; polygones et triangles (2e) ; cercle ; organisation de données ; proportionnalité et règle de trois ; symétrie et solides (3e). C'est voulu : chaque monde a exactement 3 stations, et la carte est un parcours de découverte, pas le programme complet. Ces leçons restent dans « دروسي » et dans la mission du jour.
3. **Option, non retenue par défaut :** remplacer `geo-5ap-location-importance` (monde 1) par `math-5ap-lengths-masses-capacities` pour renforcer les maths dans les mondes gratuits, ceux que voit un parent avant de payer. Je la déconseille pour l'instant : la variété des matières dans les mondes gratuits montre mieux l'étendue de l'application.

## Pour CX-15

Le point 3 de CX-15 (relier les mondes aux stations 5AP) est déjà fait dans le code. Il reste à vérifier sur un écran de téléphone que les 24 stations s'affichent sans chevaucher les décors ni les stations de jeux (`gameStationsForJourney`), en arabe et en français.
