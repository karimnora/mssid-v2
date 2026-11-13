# Complément des voix de cours 1AP–2AP

Plan figé le 13 novembre 2026 à partir des textes effectivement raccordés aux boutons de lecture : 3 306 passages sans MP3, 3 295 à produire en dix sections, 11 citations réservées au circuit de récitation. Les lectures de récitation déjà intégrées ne sont pas remplacées. La vérification de la V2 ne retrouve aucun équivalent exact avec cedar pour ces demandes.

Les fichiers par niveau/matière conservent le texte d'origine et ses voyelles, ainsi que les usages destinataires. Les textes calculés, simulations et navigation sont hors périmètre. Une disponibilité technique n'est pas une certification de la prononciation.

Production : `node frontend/node_modules/tsx/dist/cli.mjs frontend/scripts/complete-early-course-audio.ts --generate`. Quatre appels au plus en parallèle, regroupés par lots de 24 sans relancer le processus entre lots d’une même section. Chaque son a un WAV original conservé localement hors Git, une durée, une empreinte et un contrôle FFmpeg. Un échec réseau, quota, authentification ou sauvegarde arrête les nouveaux appels ; les requêtes déjà lancées terminent leur sauvegarde. Une prise refusée au contrôle de signal est conservée et mise à part dans `reprises-necessaires.json`, sans nouvelle facturation automatique. La relance réutilise les métadonnées et ne régénère pas les sons déjà produits.

Chaque section est indexée, inventoriée et committée localement avec une liste explicite de fichiers. Aucun push. Le journal détaillé reste dans `output/course-audio-completion/production.log` (ignoré). Les outils ne chargent la clé que côté processus local et ne l'affichent jamais.

Les nouveaux fichiers cedar sont chargés et mis en cache à l'écoute (400 derniers au maximum), pour ne pas télécharger tous les cours à l'installation. Leurs premières écoutes demandent une connexion ; le cache hors ligne doit être vérifié sur Android.

Contrôles initiaux : sept tests couvrant la réutilisation V2 et la file de production, dont la limite de concurrence et l'arrêt après erreur. Les contrôles de fin et la couverture actualisée sont à consigner après production. Écoute arabophone et recette Android restent nécessaires avant publication.

Récupération locale : certains phonèmes isolés (تَ، بَ، لَ…) arrivent très faibles. Un gain limité à 30 dB et à une crête de 0,9 est autorisé uniquement pour un phonème arabe isolé ayant un signal mesurable ; silence, bruit trop faible et phrase anormalement faible restent refusés. Le gain est consigné en métadonnées (`normalizationDb`). Un WAV déjà reçu est repris localement, sans nouvel appel payant. Ces contrôles ne valident pas la phonétique. Douze tests des outils de production et leur contrôle TypeScript ciblé passent.

Reprises supplémentaires : Karim a explicitement autorisé le 13 novembre un maximum de dix nouveaux appels, une seule nouvelle prise par texte, toujours cedar. `retry-rejected-course-audio.ts --generate` réserve chaque appel dans `reprises-autorisees.json` avant le lancement ; un appel incertain consomme aussi sa réservation et une relance ne peut ni dépasser dix ni reprendre deux fois le même texte. Les originaux refusés sont conservés. Les marques vocaliques seules sont nommées explicitement en arabe (par exemple « تَنْوِينُ الفَتْحِ » pour « ً ») ; le texte réellement demandé figure alors dans `spokenText`.

Sauvegarde Windows : seuls les renommages locaux sont réessayés face aux verrous temporaires. Les sauvegardes utilisent un fichier temporaire propre au processus ; aucun appel API n’est déclenché par une erreur locale de renommage. Les tests vérifient la récupération et la conservation de l’ancien fichier en cas d’échec persistant.
