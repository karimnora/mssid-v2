# Accueil illustré — 13 novembre 2026

Le premier écran met davantage en avant le démarrage d'une activité. Le village et Didou sont des images existantes de la V2, réutilisées à l'identique ; aucune nouvelle image générée n'était nécessaire pour ce lot.

- Bandeau avec décor du village, voile sombre pour le texte, Didou plus présent et bouton principal jaune de 64 px minimum. La direction des flèches suit l'arabe ou le français.
- La reprise de la dernière activité reste prioritaire lorsqu'elle existe ; sinon le bouton ouvre les mathématiques comme auparavant. Les récompenses et règles d'accès restent celles de la V1.
- Les quatre matières viennent avant le compagnon sur téléphone. Sur ordinateur, cours et compagnon occupent deux colonnes. Les cartes sont disposées en deux colonnes sur petit écran avec illustrations et écoute facultative.
- Pendant l'import du catalogue, quatre emplacements réservent la zone des matières, avec un libellé accessible. Un catalogue réellement vide affiche un message distinct.
- L'inscription est proposée après les activités et le compagnon. Les laboratoires occupent deux colonnes sur grand écran et une sur téléphone.
- Les styles sont limités à l'accueil ; le composant partagé des matières reçoit seulement un attribut pour cibler son illustration. Aucun ajout de dépendance.

## Vérifications

- 35 tests réussis dans trois fichiers : accueil, studio Didou et écoute des cours. Après les derniers ajustements visuels, les 14 tests de l'accueil ont été relancés et passent.
- Huit scénarios Chromium réussis : cinq accueils couvrant 1AP à 5AP, 320/390/768/1440 px, arabe/français et thèmes clair/sombre ; trois parcours du studio Didou. Les cinq accueils ont été relancés après correction des boutons d'écoute coupés et du titre arabe trop serré : tous passent.
- Navigation du bouton principal et des cartes vers les cours, absence de débordement horizontal, chargement de l'image, visibilité des cartes et du bouton principal, absence d'erreurs JavaScript.
- Axe ciblé sur l'accueil dans les cinq configurations, sans violation automatique signalée ; le contrôle ne remplace pas une recette au lecteur d'écran.
- TypeScript complet et contrôle de patch réussis. API simulée en invité : aucune écriture sur un compte réel.

Captures finales : `output/home-refresh/1AP-ar-320.png`, `2AP-fr-390.png`, `3AP-fr-768.png`, `4AP-ar-390.png` et `5AP-fr-1440.png`. Revue visuelle effectuée sur les captures mobile arabe/français et ordinateur arabe. Il ne s'agit pas d'une comparaison automatique à une référence visuelle approuvée.

Le village ajoute 240 078 octets de fichier WebP, déjà optimisé dans la V2. Les dimensions de l'image sont réservées ; aucun score de performance sur réseau mobile réel n'a été mesuré. Recette restante : Android de Karim, lisibilité, fluidité et préférence visuelle avant toute publication.

## Autoévaluation

Exactitude, complétude, clarté, possibilité de test et concision : 4/5 chacun. Preuves : tests de navigation, captures et TypeScript ; limites : pas de téléphone réel, pas de mesure réseau et préférence visuelle de Karim encore attendue. Priorité suivante : son essai de l'accueil sur le téléphone habituel. Cette note ne remplace pas sa validation.
