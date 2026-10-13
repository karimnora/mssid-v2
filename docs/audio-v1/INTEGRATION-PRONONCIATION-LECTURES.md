# Modèles enregistrés français/anglais et lectures 1AP–2AP

Les MP3 fournis le 13 octobre 2026 sont Quentin à 21:15:58, Léa à 21:15:27 et Asmaa à 21:14:40. Les 47 nouveaux fichiers couvrent 16 modèles français, 16 anglais et 15 scènes de lecture arabe.

Le lecteur partagé les retrouve par texte et langue ; ils sont utilisés par l'atelier de prononciation, sa répétition au micro et les boutons des scènes 1AP–2AP. Aucun fichier existant n'a été remplacé. Les six mots également prévus dans d'autres lots sont maintenant réutilisables sans nouvelle génération.

Le rapport `enregistrements-prononciation-lectures.json` conserve les textes attendus, la transcription de repérage, les coupes, durées et empreintes SHA-256 des sources et extraits. Les langues ont été imposées au moteur de transcription pour ce lot ; elles ne sont pas présentées comme une détection indépendante. Les extraits sont décodés pour vérifier son et durée, avec coupes dans les pauses. Format : MP3 mono, 44,1 kHz, 96 kbit/s. Les originaux restent dans Downloads.

La reconnaissance distingue roue/rue, poisson/poison, ship/sheep, thin/tin, three/tree et pen/pan. Cela ne remplace pas une écoute pour valider la prononciation pédagogique. Les premières phrases arabes sont transcrites avec un tanwin accusatif (« كتاباً », « قلماً », « أماً »), alors que les textes attendus ont un tanwin nominatif. Karim a confirmé que « هَذَا كِتَابٌ » est correct à l'écoute ; aucune nouvelle génération n'est demandée pour cette phrase. Ne pas régénérer sur la seule base de cette transcription.

Le catalogue comporte désormais 908 fichiers et 895 phrases distinctes. Cela inclut les 861 fichiers des lots préscolaires précédents et les 47 fichiers des laboratoires/lectures. Les consignes/félicitations préscolaires restent couvertes pour 147 activités sur 200.

## Prochain lot préparé

`prochains/24-dialogues-projets-et-consignes` contient 8 extraits français (vocabulaire et textes des deux premiers projets 3AP), 8 répliques anglaises (deux dialogues 3AP/4AP existants) et 7 consignes des cours thématiques 1AP en arabe. Seuls les textes réellement lus par les commandes de l'app sont sélectionnés ; les réponses des quiz non lues sont exclues.

La formulation impérative « اسْمِ » a été corrigée en « سَمِّ » dans les consignes de nomination 1AP avant génération. L'abréviation « 3AP » est développée en « troisième année primaire » dans le texte support français et le plan pour une lecture naturelle. Les niveaux d'accès existants sont conservés.

Après ajout de ce prochain lot, le plan global contient 455 fichiers cibles et 452 générations uniques. Les 23 nouveaux textes ne disposent pas encore de voix enregistrées.

Les 13 tests ciblés des fichiers, du lecteur et des composants passent. L'écoute sur téléphone, la compilation native APK et la publication mobile restent à réaliser.

La vérification TypeScript, le build frontend Android et la synchronisation Capacitor passent. Le cache généré contient les 908 fichiers enregistrés, dont les 47 nouveaux modèles et lectures.
