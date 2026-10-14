# Contrôle d’affichage Android — 15 octobre 2026

État local sur `main`, non publié. Les essais portent sur l’interface partagée web/Android dans Chromium, avec tailles de téléphone et agent utilisateur Android. Ils ne constituent pas une validation d’une APK installée.

## Écrans contrôlés

| Périmètre | Vérifications |
|---|---|
| Accueil, catalogue des matières, examens, défis, accueil préscolaire | Six configurations : 320×740 arabe clair / français sombre ; 390×844 arabe sombre ; 430×932 français clair ; 844×390 arabe clair / français sombre. Largeur, défilement, navigation, erreurs JavaScript, audit automatique d’accessibilité à une position stable. |
| Réglages, profil, tuteur, connexion et inscription | Fenêtres dans l’écran, contenu défilable sans débordement horizontal, fermeture encore utilisable après défilement. Formulaire aussi avec hauteur réduite à 480 px (approximation de l’espace disponible avec clavier). |
| Outils dans les cours | 19 cours représentatifs des outils interactifs, incluant la présentation compacte 1AP/2AP. Largeur avant/après une interaction et maintien dans le cours, à 390 px. |
| Jeux actuellement accessibles | Trois jeux de l’arène et huit jeux préscolaires à 320/390 px. Préscolaire : ouverture du premier niveau réel, vérification des surfaces et des canvas Phaser. |

Les 30 laboratoires et les 18 cours avec lecteur coranique ont été contrôlés séparément à 320/390 px : voir `CORRECTIFS-FIABILITE-ET-MOBILE-2026-10-15.md`. Les corrigés de mathématiques et leur impression sont détaillés dans `CORRECTIFS-EXAMENS-MATH-2026-10-15.md`.

## Corrections apportées

- Examens : contraste des catégories sélectionnées, notamment acquis / compositions / devoirs, et de leurs sous-titres.
- Défis : libellé sombre sur bouton jaune dans les deux sélecteurs ; descriptions et raccourcis lisibles en thème clair et sombre.
- Badges partagés : fond explicite et texte contrasté, au lieu d’un texte sombre posé sur un fond translucide sombre. Bouton d’accent jaune : texte foncé.
- Didou sur l’accueil : retour à la ligne du titre et du badge, largeur du bloc d’informations bornée, texte lisible quand le thème sombre est choisi manuellement.
- Préscolaire : textes sombres sur le défi du jour orange ; portes et entrée des imprimables avec un fond plus contrasté. Compteur du défi écrit de gauche à droite en arabe. Suppression d’une marge latérale inutile sur un bouton de pleine largeur.
- Profil : libellé accessible pour fermer la fenêtre.

Les couleurs ont été ajustées sans changer les règles de progression, les permissions, la facturation ou les récompenses.

## Preuves

- 83 scénarios distincts réussis : 42 écrans/fenêtres, 19 outils de cours, 22 jeux. Les exécutions de 64 puis 47 tests se recoupent et ne doivent pas être additionnées.
- 10 parcours complémentaires réussis : connexion, inscription, quiz complet, validation d’un examen, trois corrigés de cours de division et trois contrôles des corrigés d’examens (dont un grand écran et un PDF). Le script historique d’examen utilisait un bouton d’en-tête caché sur mobile ; son sélecteur cible désormais le bouton visible et le scénario mobile réussit.
- Captures examinées : catalogue arabe 320 px, accueil français sombre 320 px avant/après correction, défis sombres, accueil préscolaire, jeu En ville et habillage de Didou au premier niveau.
- 211 tests unitaires ciblés réussis après les changements de contenu et de composants. Suite globale précédente après l’extension mathématique : 170 fichiers / 1 966 tests réussis.
- Avant commit et push, nouvelle exécution complète sur l’état final : 170 fichiers / 1 966 tests réussis. Aucun échec dans les tests de progression, récompenses, synchronisation, suppression de compte et confirmations de sortie. Vérification des fichiers à publier : pas de secret détecté, pas de suppression de fichier, pas de changement du backend ni des workflows.
- TypeScript réussi. Builds web et frontend Android réussis, puis synchronisation Capacitor Android réussie. Cette préparation ne compile pas le code Java et ne produit pas une APK/AAB signée.

## Limites et essais restants

- Pas de téléphone, émulateur ou SDK Android utilisable dans cet environnement. Tester avec une nouvelle APK : barres système / encoche, clavier réel, rotation, tailles de police Android, bouton Retour, micro et impression native.
- Les scénarios sont représentatifs ; ils ne couvrent pas chaque leçon, chaque question, tous les niveaux de jeux ni toutes les combinaisons de langue/thème. L’arène et les catalogues principaux sont contrôlés surtout en 5AP ; les cours couvrent aussi les interfaces 1AP/2AP.
- Les anciens six jeux `ArcadeGamesSection` n’ont actuellement aucun bouton d’entrée dans `ChallengesArena` : ils ne sont pas présentés comme contrôlés dans le parcours utilisateur. Aucun accès n’a été ajouté pour élargir artificiellement ce contrôle.
- À 320 px, les petites étiquettes dessinées dans les cartes En ville / ferme restent très petites après réduction du canvas. Les commandes tactiles externes restent accessibles ; la lisibilité de ces étiquettes est un point d’amélioration, à confirmer sur appareil.
- L’audit automatique ne certifie pas toute l’accessibilité, notamment les textes dessinés dans un canvas et certains fonds dégradés. La vérification visuelle a servi à compléter ces limites.

Conclusion : aucun blocage ou débordement détecté dans les scénarios vérifiés après correction. La conformité native complète reste à valider sur appareil.

Revue finale (`agent-self-evaluation`) : preuves et clarté 4/5, couverture 4/5 en raison des variantes non parcourues et de l’absence d’appareil natif. Priorité : essai d’une nouvelle APK, puis décision de publication. Aucune publication, hausse de version ou modification d’hébergement effectuée dans ce lot.
