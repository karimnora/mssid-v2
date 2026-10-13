# Dialogues, projets français et consignes 1AP

Sources fournies le 13 octobre 2026 : Asmaa à 21:27:37, Léa à 21:27:01 et Quentin à 21:26:07. Les 23 nouveaux MP3 couvrent sept consignes arabes de 1AP, huit extraits français (six mots et deux textes) et huit répliques de dialogues anglais existants.

Le lecteur partagé les utilise par texte et langue, dans les cours 1AP, les projets français et les boutons de dialogue anglais. Le rapport `enregistrements-dialogues-projets-consignes.json` conserve textes attendus, transcription de repérage, coupes, durées et empreintes SHA-256. Les originaux sont conservés dans Downloads. Format : mono, 44,1 kHz, 96 kbit/s.

La frontière entre « La chambre » et le texte de famille français a été ajustée pour conserver deux pauses distinctes : les timestamps de reconnaissance donnaient deux limites proches de la même pause. Chaque fichier est décodé pour vérifier présence de son et durée. La reconnaissance sert au repérage et ne certifie pas la prononciation.

Le catalogue contient désormais 931 fichiers et 918 phrases distinctes. Le plan restant contient 432 cibles et 429 générations uniques : 318 lectures de consignes/félicitations pour les 53 activités préscolaires non couvertes et 114 mots de cartes/micro encore sans correspondance. Les narrations complètes d'histoires et une bibliothèque exhaustive des cours/laboratoires ne sont pas comprises dans ces nombres.

Karim a confirmé à l'écoute que « هَذَا كِتَابٌ » du lot précédent est correct : aucune nouvelle génération n'est demandée pour cette phrase. Les autres fichiers restent à écouter sur téléphone avant publication.

Les 12 tests ciblés des enregistrements et du lecteur passent. La lecture enchaînée des dialogues anglais a ensuite été corrigée pour attendre réellement chaque lecture et annuler la suite à la sortie/changement ou avant le micro : voir `CORRECTIF-DIALOGUES-ANGLAIS.md`. Les boutons de réplique individuels utilisent les enregistrements intégrés.

Les changements restent locaux et non publiés. Avant version mobile : sécuriser les enchaînements, construire un Android de test, vérifier micro/arrêt/navigation/volume/hors connexion et écouter les modèles. Le SDK Android local est absent ; la compilation native passe par le workflow prévu du dépôt.

Le build frontend Android et la synchronisation Capacitor passent. Le cache généré contient les 931 fichiers enregistrés.
