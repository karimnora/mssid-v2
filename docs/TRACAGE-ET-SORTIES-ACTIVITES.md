# Tracé préscolaire et sorties des activités — 14 octobre 2026

## Bug corrigé

« J’ai essayé / جَرَّبْتُ / I tried » déclenchait un retour au parcours après le retour sonore. La tentative est maintenant enregistrée séparément : l’enfant conserve ses traits et reste dans l’exercice. Elle n’accorde ni réussite ni étoile. Une réussite réelle conserve la progression habituelle.

Le résultat du tracé est annulé lorsque le composant est quitté ou remplacé. Le lecteur préscolaire ignore les anciens résultats après un changement d’activité et empêche une publication double de réussite. Cette protection couvre les widgets préscolaires qui lui transmettent leurs résultats.

Les résultats différés des puzzles, de l’habillage et du tri des formes sont annulés à la sortie. Le duel de calcul annule également sa fin différée à la sortie et ne publie qu’un seul résultat lorsque la perte de la dernière vie coïncide avec la fin du chronomètre.

## Vérification

- 898 tests préscolaires et du mécanisme de résultat différé réussis.
- 14 tests ciblés réussis, dont le tracé réel dans les trois langues, la conservation des traits, la sortie avant le retour sonore et les deux scénarios du duel.
- Confirmation de sortie : 135 tests de composants, cours, navigation et préscolaire réussis, puis 22 tests des cours et de la fenêtre réussis après ajout du contrôle des réponses non validées (un scénario supplémentaire).
- 8 parcours Chromium en vue mobile réussis : trois langues du tracé, historique Retour/Avancer, changement de niveau, tracé vide, sortie interne du puzzle et laboratoire réel avec nouvelle visite propre.
- L’audit des appels différés et des chemins de fin des jeux, cours et laboratoires examinés ne démontre pas l’absence de tout bug possible. Un essai sur téléphone reste nécessaire pour le tactile et le bouton Retour Android.

## Confirmation de sortie ajoutée

Une protection commune demande confirmation lorsque l’enfant quitte une activité commencée : interactions préscolaires, dessin du tableau magique, parties de jeux, quiz ou exercices des cours partiellement réussis, examen avec chronomètre démarré et laboratoire après interaction.

« Continuer » est l’action principale et reçoit le focus ; « Quitter » est secondaire. La fenêtre suit la langue du préscolaire (arabe, français, anglais) ou de l’interface principale. Le clavier reste dans la fenêtre, Échap et un second Retour Android annulent la sortie. Les catalogues, lectures simples et activités terminées ne sont pas enregistrés comme travail en cours. Le passage explicite à l’étape suivante reste libre.

Les boutons de retour intégrés, onglets, changements de niveau et navigation principale passent par la même protection. Retour/Avancer du navigateur restaure d’abord l’entrée courante avant de demander confirmation : annuler conserve l’écran et son URL. Le rechargement ou la fermeture de l’onglet demande l’avertissement standard du navigateur lorsque celui-ci le permet. Les laboratoires repartent avec un état propre après un changement d’outil ou de niveau.

Le plugin natif Navigation intercepte Retour Android via OnBackPressedDispatcher et consulte le frontend avant de revenir dans l’historique ou de fermer l’activité. Il nécessite une nouvelle version Android. Le retour natif réel et l’APK restent à vérifier sur téléphone : les tests de navigateur et la préparation du frontend ne compilent pas les classes Java.

La confirmation conserve le composant et ses données en mémoire après annulation ; elle n’ajoute pas de sauvegarde persistante des dessins ou des parties. Les chronomètres continuent pendant la fenêtre. Si une activité se termine naturellement pendant la confirmation, la demande de sortie devenue obsolète est annulée.

## Contrôle sur téléphone

1. Tracer puis toucher « جَرَّبْتُ » : rester dans l’exercice avec les mêmes traits, sans réussite affichée.
2. Recommencer, poursuivre le tracé et valider une réussite : vérifier la progression habituelle.
3. Quitter puzzle, habillage, tri ou duel pendant le retour de fin : aucun ancien résultat ne doit rouvrir une activité ou changer le nouvel écran.
4. Tester également le Retour Android. Les corrections embarquées nécessitent une nouvelle version installée.
