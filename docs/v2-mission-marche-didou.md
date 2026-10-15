# La mission du marché de Didou

Une deuxième mission complète, complémentaire au jardin. Trois séances de deux défis : préparer une commande, choisir et payer, partager et expliquer. Six versions adaptées (préscolaire et 1AP–5AP), soit 36 défis construits avec six mécaniques, et six récits originaux. Il ne s’agit pas de 36 compétences distinctes.

## Accès

- Préscolaire : Éveil → Ateliers → La mission du marché de Didou (FR, AR, EN).
- Primaire : Laboratoires → Cahiers → Laboratoires Premium → La mission du marché de Didou (FR, AR).
- La séance découverte est gratuite et rejouable. Les deux suivantes utilisent le droit Premium existant et demandent les réussites précédentes. Aucun changement des tarifs, quotas, cours ou anciens laboratoires.
- Le précédent atelier court « Le marché de Didou » est conservé ; la nouvelle entrée porte « La mission du marché de Didou » pour les distinguer.

## Contenu et contrôles mathématiques

| Niveau | Commande | Comparer | Payer | Vérifier le récit | Partager |
| --- | --- | --- | --- | --- | --- |
| Préscolaire | 3 pommes, 2 carottes | 3 ou 5 pommes | 4 jetons de jeu | retrouver les pommes | 4 pommes / 2 paniers |
| 1AP | 4 pommes, 2 carottes | 7 ou 5 carottes | 20 DA | repérer les carottes manquantes | 6 / 2 |
| 2AP | 2 × 3 pommes, 3 carottes | 12 ou 15 DA pour lots identiques | 35 DA | 6 − 2 = 4 pommes manquantes | 12 / 3 |
| 3AP | 3 × 4 pommes, 2 × 3 carottes | offres de 6 pommes à 60 ou 70 DA | 2 × 30 + 15 = 75 DA | corriger un reçu demandé à 85 DA | 18 / 3 |
| 4AP | moitié de 18, quart de 12 | 1 kg à 180 ou deux lots de 500 g à 100 | 3 × 40 + 25 = 145 DA | 200 − 145 = 55 DA | 24 / 4 |
| 5AP | 3/4 de 20, 25 % de 12 | 200 ou 180 DA/kg | 240 − (240 × 25 / 100) = 180 DA | 750 g à 200 DA/kg = 150 DA | 20 − (20 × 25 / 100) = 15, puis 15 / 3 |

Les prix sont fictifs. Les pièces sont des objets de jeu, sans promesse de reproduire les espèces en circulation. Aucune transaction ou sortie réelle n’est nécessaire. Toutes les compositions donnant le bon total sont acceptées. Pour le préscolaire, des jetons remplacent les dinars.

## Expérience enfant et parent

Décor original de marché, fruits illustrés en SVG, objets et compteurs tactiles, instructions de Didou, récit écoutable, transition courte respectant la réduction des animations. Chaque défi garde un objectif visible. On peut retirer les objets et la dernière pièce avant de vérifier.

Une erreur ou un indice fait classer la réussite suivante « avec aide ». L’écoute ne compte pas comme aide. Les doubles validations sont bloquées. Le dernier défi exige le contrôle parent existant pour valider une observation. Reporter cette observation marque « à reprendre », jamais une réussite automatique.

Le carnet affiche les derniers essais, distingue validation automatique et observation adulte, propose un défi à reprendre, et conserve l’ouverture obtenue par une réussite historique. Les résultats restent locaux à l’appareil ; aucune nouvelle synchronisation serveur du carnet de mission. En préscolaire, séparation par compte, enfant et langue, avec refus d’un propriétaire appartenant à un autre compte. Les erreurs de sauvegarde sont signalées.

Le défi en cours est protégé à la sortie et au redémarrage. Revenir sur la séance déjà sélectionnée ne réinitialise pas le travail. Les réussites terminées sont conservées ; les objets d’un défi non validé ne sont pas restaurés après fermeture de l’application.

## Vérifications à garder pour la recette finale V2

1. Sur le téléphone réel, ouvrir la mission, remplir le panier et vérifier la lisibilité des objets, la voix et les boutons.
2. Annuler une sortie ou un redémarrage : garder le panier intact ; confirmer une sortie : revenir au bon atelier.
3. Compte gratuit : finir les deux défis de découverte, les rejouer ; vérifier que les séances suivantes restent fermées.
4. Premium : faire les trois séances, essayer une mauvaise réponse puis un indice, vérifier le bilan.
5. Reporter l’observation finale, puis la refaire avec un adulte via le contrôle parent.
6. Changer d’enfant et de langue, puis revenir : aucune progression mélangée. Recharger : conserver les résultats terminés.
7. Tester le français et l’arabe sur mobile, puis l’anglais au préscolaire. Vérifier aussi les anciens ateliers et le jardin.

## Audio et limites

Voir v2-marche-voix-todo.json : phrases réellement vocalisées, dédupliquées et comparées au catalogue existant et au TODO jardin. Aucune génération ElevenLabs payante effectuée ; synthèse vocale en attendant. Relecture pédagogique par un enseignant et essai sur appareil Android réel encore nécessaires. Ces contenus ne constituent pas une certification de conformité exhaustive au programme officiel.

Le jardin et les correctifs précédents ont été poussés dans les commits 87dcaf8 et 33d7020. Cette nouvelle mission est publiée sur la branche v2, sans modification de main ni nouvelle version Android. Le déploiement hébergé reste à vérifier séparément.

## Validation automatique du lot

- Suite frontend : 202 fichiers et 2 164 tests réussis ; les 17 tests du marché ont été rejoués après enrichissement des indices.
- Cinq parcours navigateur du marché réussis : primaire complet en français et arabe à 360 px, et découverte gratuite préscolaire en français, arabe et anglais à 320 px.
- Cinq parcours du jardin rejoués avec succès après intégration du marché.
- Huit scénarios finaux réussis : les cinq du marché et trois protections de sortie / changement de niveau / tracé.
- Aucune violation WCAG 2 A/AA détectée dans le carnet du marché audité automatiquement ; aucune certification globale de l’application.
- Boutons de manipulation contrôlés à au moins 44 × 44 px, absence de débordement horizontal dans les parcours vérifiés. Contrôle visuel des captures FR et AR ; titres des séances raccourcis après ce contrôle.
- TypeScript et build web/PWA réussis. Avertissements préexistants sur la taille de certains blocs conservés. Aucun build Android natif exécuté.
