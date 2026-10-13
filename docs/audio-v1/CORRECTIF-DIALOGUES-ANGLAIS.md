# Enchaînement des dialogues anglais

Le lecteur `EnglishAudioDialoguesLab` attend désormais la fin réelle de `speakText` pour passer à la réplique suivante, que la voix soit enregistrée ou synthétisée. Les minuteries calculées sur la longueur du texte ont été supprimées.

Chaque lecture possède un identifiant de séquence. L'arrêt, le changement de dialogue ou de vitesse, la sortie et les commandes écouter/enregistrer/réécouter du micro invalident la séquence. Une ancienne fin de lecture ne peut plus démarrer la suite ni effacer l'état d'une nouvelle lecture. Une erreur remontée par le lecteur interrompt la séquence.

Le bouton de lecture complète devient « Stop Dialogue » pendant l'enchaînement. Les vitesses 0,7× et 1× sont transmises également aux MP3 enregistrés ; le réglage normal utilise effectivement 1×.

Les 15 tests ciblés du composant, de la barre micro et du lecteur partagé passent. Ils vérifient l'attente des fins réelles, l'arrêt, la sortie, les changements de dialogue/vitesse, le micro et les anciennes terminaisons.

La suite frontend complète passe : 1736 tests dans 156 fichiers. Le message de l'environnement de test indiquant que `scrollTo` n'est pas implémenté n'entraîne aucun échec.

La vérification TypeScript, le build frontend Android et la synchronisation Capacitor passent également. La compilation native et les tests sur téléphone restent à faire dans le prochain build mobile.

## Mots modèles à enregistrer

Les fichiers `prochains/22-mots-cartes-et-micro/*-texte-a-generer.txt` et `*-a-generer-decoupage.json` ont été préparés après comparaison avec le catalogue actuel :

| Langue | Textes uniques à générer | Fichiers cibles manquants | Lectures déjà disponibles |
| --- | ---: | ---: | ---: |
| Arabe, Asmaa | 39 | 40 | 0 |
| Français, Léa | 35 | 36 | 4 |
| Anglais, Quentin | 37 | 38 | 2 |
| **Total** | **111** | **114** | **6** |

Un MP3 par langue suffit, dans l'ordre du texte avec une pause entre les mots. Les répétitions exactes sont regroupées et les six voix existantes ne doivent pas être régénérées. Les nouveaux mots ne sont pas encore enregistrés ; aucun crédit ElevenLabs supplémentaire n'a été consommé.

Le catalogue contient toujours 931 fichiers. Le reste du plan global est de 432 cibles / 429 générations uniques. Après intégration des mots, les 318 cibles de consignes/félicitations préscolaires resteront à traiter, hors narrations complètes et bibliothèque exhaustive des cours.

Les changements sont locaux. La validation sur téléphone et la construction/publication d'une nouvelle version Android restent nécessaires.
