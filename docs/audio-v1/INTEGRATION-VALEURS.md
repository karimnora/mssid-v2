# Voix des valeurs et bonnes habitudes

Les trois MP3 fournis le 13 octobre 2026 sont Asmaa à 20:24:47, Léa à 20:25:36 et Quentin à 20:26:09. Ils contiennent 13 phrases par langue, soit 39 nouveaux fichiers. Les trois félicitations « Voici une mosquée » proviennent du lot Algérie : leurs fichiers et leurs durées sont réutilisés directement, sans copie ni génération supplémentaire.

Les sept activités disposent d'une consigne et d'une félicitation dans chaque langue. Le rapport `enregistrements-valeurs.json` conserve les textes, transcriptions de repérage, positions des coupes, durées et empreintes SHA-256. Les originaux sont conservés dans Downloads. Les MP3 découpés sont mono, 44,1 kHz, 96 kbit/s.

La détection automatique a classé le fichier anglais comme arabe. Ses premiers mots transcrits correspondent pourtant à la consigne anglaise (« Drag the fennec, house, apple, salam, gift »). Une nouvelle transcription avec la langue anglaise imposée est utilisée pour contrôler le texte complet et l'alignement, sans confondre cette langue imposée avec une détection automatique indépendante.

La transcription sert au repérage et ne certifie pas la prononciation, notamment des expressions arabes dans les voix française et anglaise. Une écoute sur téléphone reste nécessaire avant publication. Les récitations coraniques ne font pas partie de ce lot.

Aucun crédit ElevenLabs supplémentaire n'a été consommé. Les voix seront disponibles dans le cache web et les assets du prochain build Android. Ces changements locaux ne publient pas une nouvelle version mobile.

Le catalogue contient désormais 837 fichiers et 824 phrases distinctes. Il reste 480 fichiers cibles et 459 générations uniques dans les plans préparés. Les 20 tests ciblés des lots Algérie/Valeurs et du lecteur passent ; ils vérifient aussi que la félicitation de la mosquée reprend le fichier existant et sa durée.

La vérification TypeScript, le build frontend Android et la synchronisation Capacitor passent. Le cache généré contient les 837 voix préscolaires, dont les 39 nouvelles voix du lot Valeurs. La compilation native de l'APK et l'écoute sur téléphone restent à réaliser avec le prochain build mobile.
