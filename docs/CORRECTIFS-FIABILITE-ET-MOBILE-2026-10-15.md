# Fiabilité et affichage mobile — 15 octobre 2026

Branche main locale ; travaux de la soirée du 14 et du 15 octobre. Les preuves concernent ce code, avec API simulée pour les parcours navigateur. Aucun compte réel ni déploiement de production n’a été modifié.

## Correctifs demandés

1. Récompense labo : XP, niveau et pièces mis à jour ensemble depuis le dernier état connecté ; niveau invité recalculé. Les gains rapides consécutifs restent cohérents.
2. Navigation : changement de niveau et mise à jour du compte attendent la confirmation. Jouer ouvre bien le catalogue après confirmation. Reprendre une leçon et démarrer un devoir regroupent également leurs actions.
3. Suppression : un échec HTTP ne déconnecte plus le compte et n’efface pas les sauvegardes. La suppression confirmée retire les données locales propres à ce compte.
4. Connexion/restauration : mapping commun et complet pour mot de passe, Google, inscription, démarrage et actualisation. Examens, défis, badges, dates et scores de quiz sont restaurés. Les données invitées ne sont pas attribuées au nouveau compte. Les visites de laboratoires et jeux, sans champs serveur, disposent d’un cache local par compte.
5. Sauvegarde : les gains non confirmés restent sur l’appareil, dans une file propre au compte, avec un statut visible dans le profil. Actualiser et le retour du réseau permettent de réessayer. Un ancien rafraîchissement ne remplace pas un nouveau gain. Une réponse plafonnée par le serveur garde le statut en attente ; les totaux absolus empêchent une attribution supplémentaire lors de la reprise.
6. Récitation : un ancien rejet de lecture après Stop, changement de lecture ou sortie ne démarre plus le son de secours.
7. Studio d’écriture : toucher la lettre déjà sélectionnée réécoute sa prononciation sans effacer les traits. Choisir une autre lettre conserve son comportement de remise à zéro.
8. Micro : action explicite de nouvelle tentative après refus dans les barres de répétition et le préscolaire. Le lecteur coranique conserve également la possibilité de réessayer avec un libellé clair.
9. Examen : un ID déjà terminé ne reçoit plus une seconde récompense de 50 XP.

## Affichage mobile

Le contrôle élargi aux autres écrans, fenêtres et jeux est décrit dans `AFFICHAGE-ANDROID-2026-10-15.md`. Les calculs des cours, quiz et défis ont aussi été contrôlés après la banque d’examens : voir la section d’extension dans `CORRECTIFS-EXAMENS-MATH-2026-10-15.md`.

- 30 laboratoires au niveau 5AP contrôlés à 320 et 390 px : ouverture réelle, absence d’erreur JavaScript, largeur en haut et en bas de l’outil, audit automatique d’accessibilité du laboratoire.
- 18 cours avec lecteur coranique de 1AP à 5AP contrôlés aux mêmes largeurs, y compris changement de sourate, accès au dernier verset et lecture/arrêt. Les appels audio sont simulés : cela vérifie l’interface, pas la disponibilité du fichier distant ni la prononciation.
- Sourati contrôlé aussi à 430 px.
- En-tête adapté aux écrans inférieurs à 360 px pour éviter son débordement.
- Titre Sourati lisible sur fond clair ; légende du récitant avec fond explicite dans les cours sombres.
- Commandes coraniques dans le flux de la page sur mobile : la barre ne masque plus les versets pendant le défilement. Disposition compacte à deux colonnes à partir de 360 px ; boutons de lecture de 72 px de haut.
- Contrastes corrigés dans les projets français et le curriculum tamazight.
- Grille aire/périmètre : cases non comprimées, défilement contenu dans la grille si nécessaire. Sélecteur 2D/3D du laboratoire de vitesse agrandi.
- Les panneaux de corrigés mathématiques ont été vérifiés et corrigés séparément : voir `CORRECTIFS-EXAMENS-MATH-2026-10-15.md`.

Les audits tactiles sont exécutés à une position stable de la page : un bouton partiellement coupé par la navigation fixe à un défilement arbitraire ne constitue pas une mesure de sa taille réelle. Les tests vérifient séparément l’accès par défilement et clic aux commandes coraniques. Les animations/toasts globaux ne sont pas laissés aléatoires dans ces fixtures.

## Validation

- 110 parcours navigateur réussis : 96 contrôles labo/cours aux deux largeurs, 3 Sourati, 3 intégrations des correctifs et 8 confirmations de sortie.
- Suite unitaire globale : 167 fichiers et 1,794 tests réussis avant les dernières extensions maths/cache local ; puis 154 tests ciblés réussis sur ces changements. Ces groupes se recoupent et ne doivent pas être additionnés.
- TypeScript réussi. Builds web et frontend Android réussis sur l’état final. Ces builds ne compilent pas les classes Java et ne produisent pas une APK/AAB signée.
- Les anciens scripts d’audit sous `frontend/build` attendent volontairement les défauts historiques. Ce répertoire d’artefacts est exclu de Vitest ; les vrais tests de non-régression restent sous `src` et `e2e`.

Les essais ne couvrent pas chaque combinaison de mode, langue et niveau dans chacun des laboratoires. Le bouton Retour, les permissions micro, l’impression native et les composants Java doivent être vérifiés avec une nouvelle version installée sur un téléphone Android. Les jeux chronométrés continuent encore pendant la confirmation de sortie ; ce point de l’audit initial n’était pas dans le lot demandé.

## Revue finale

Application de `agent-self-evaluation` : précision 4/5 (preuves automatisées, appareil natif non testé), couverture 4/5 (demandes traitées, toutes les combinaisons de laboratoire non parcourues), clarté 4/5 (rapport détaillé, réponse utilisateur condensée), actionnabilité 4/5 (code et tests présents, publication et essai natif à venir), concision 4/5 (rapports distincts, historique d’audit conservé). Moyenne 4.0/5 ; pas de défaut bloquant connu dans les scénarios vérifiés. L’utilisateur devrait pouvoir juger cet état à partir des preuves et limites explicites. Priorité suivante : essai physique Android, puis publication autorisée.
