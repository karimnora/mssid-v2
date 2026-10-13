# Consignes enregistrées des sourates courtes

Les sources du 13 octobre 2026 sont Asmaa à 20:39:50, Léa à 20:39:18 et Quentin à 20:38:36. Pour l'anglais, le fichier fourni porte le suffixe `(1).mp3` ; c'est ce fichier qui est utilisé.

Chaque source contient sept consignes, suivies d'une félicitation commune. Les 24 MP3 mono, 44,1 kHz, 96 kbit/s couvrent les 42 lectures des activités. Les sept activités de chaque langue partagent la même félicitation et sa durée réelle. Aucune copie de cette voix n'est ajoutée pour les six autres sourates. Aucun crédit ElevenLabs supplémentaire n'est consommé.

Les textes, transcriptions, positions des coupes, durées et empreintes SHA-256 sont conservés dans `enregistrements-consignes-sourates.json`. Les originaux restent dans Downloads. Le fichier anglais a été classé à tort en arabe par la détection automatique : une seconde transcription en anglais est utilisée pour contrôler son contenu complet et les limites des phrases.

Le catalogue contient désormais 861 fichiers et 848 phrases distinctes. Pour les plans préparés, il reste 438 fichiers cibles et 435 générations uniques. La félicitation commune évite 18 générations et 18 copies de fichiers.

## Contrôle de prononciation

La transcription française écrit « Al-Fatiha » dans la consigne Al-Falaq, et interprète mal la phrase « Al-Ikhlas. Allah est Un ». Karim a confirmé à l'écoute qu'Al-Falaq est correct ; aucune régénération n'est nécessaire pour cet extrait. La transcription ne certifie pas la prononciation. Une écoute des autres noms des sourates et des expressions arabes en français et anglais reste recommandée avant publication mobile.

Les voix intégrées ne contiennent aucun verset récité. Les récitations professionnelles Warsh existantes restent utilisées par le lecteur Coran et dépendent toujours de leurs URL externes.

Les 20 tests ciblés des consignes, des voix des valeurs et du lecteur passent. Les tests vérifient les fichiers, les textes et langues correspondants, les durées de félicitation et le partage d'un seul fichier de récompense par langue. Ces changements locaux ne publient aucune version Android.

La vérification TypeScript, le build frontend Android et la synchronisation Capacitor passent. Le cache généré contient les 861 voix préscolaires, dont les 24 extraits de ce lot. La compilation native de l'APK et l'écoute sur téléphone restent à réaliser.
