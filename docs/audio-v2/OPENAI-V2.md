# Voix OpenAI de la V2

Production hors navigateur : la clé est lue uniquement par le script local et ne doit jamais être préfixée par VITE_, embarquée dans l'application ou ajoutée à Git.

## Économies

- Inventaire sans appel payant par défaut : `npm run audio:openai`.
- Déduplication par langue et texte exact normalisé NFC/espaces ; les voyelles arabes restent conservées.
- Réutilisation du catalogue existant et des fichiers déjà produits, vérifiés par SHA-256.
- Un enregistrement par phrase réutilisable, une voix constante, aucune génération pendant l'utilisation par l'enfant.
- Sauvegarde après chaque réponse réussie. Seuls les refus explicites de débit sont retentés, avec attente ; les erreurs réseau ne déclenchent pas de nouvelle facturation automatique.
- Compression MP3 locale à 80 kbit/s mono ; les WAV originaux sont archivés hors du dépôt après vérification.

## Commandes

Depuis frontend, avec une clé locale disponible :

```
npm run audio:openai -- --scope labs
npm run audio:openai -- --generate --limit 20 --env-file CHEMIN_DU_FICHIER_LOCAL
python scripts/compact-openai-audio.py --archive CHEMIN_ARCHIVE_HORS_DEPOT
npm run audio:index
```

Le périmètre `labs` couvre les orientations Didou, les étapes des ablutions et de la prière, les questions/explications de leurs quiz, les consignes de route et de mosquée et les phrases fixes des labos immersifs. Sans ce filtre, les listes de voix déjà recensées dans les documents V2 et les accueils de mondes sont ajoutés. Cet inventaire ne constitue pas un recensement exhaustif de toutes les phrases dynamiques de l'application.

Les prières utilisent une phrase canonique partagée entre génération et lecture pour éviter deux enregistrements du même message. Les récitations coraniques existantes ne sont pas remplacées par ce lot.

## Qualité et suivi

Métadonnées : `docs/audio-v1/enregistrements-v2-openai.json`.
Contrôles techniques : `docs/audio-v2/openai-generation-audit.json` (signal non silencieux, durée WAV, décodage MP3, intégrité).
Ces contrôles ne certifient pas le naturel, la prononciation ni la conformité d'une récitation : une écoute humaine reste nécessaire. Aucun ancien enregistrement n'est remplacé sur la seule base de ses caractéristiques techniques.

Modèle de production configurable via OPENAI_TTS_MODEL ; voix via OPENAI_TTS_VOICE (cedar par défaut). La documentation OpenAI indique le retrait de l'ancien point d'accès Speech au 6 janvier 2027 : adapter le générateur pour de futures productions après cette date. Les fichiers statiques déjà générés restent indépendants de cette API.

Documentation : https://developers.openai.com/api/docs/guides/text-to-speech
