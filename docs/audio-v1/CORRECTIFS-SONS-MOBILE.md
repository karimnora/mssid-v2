# Correctifs audio pour la prochaine version mobile

## Priorités traitées

1. Le lecteur Tamazight n'utilise plus une voix française pour prononcer les mots latins/Tifinagh. Les contrôles approximatifs ont été retirés ; les cours et activités restent disponibles. Des enregistrements d'un locuteur compétent seront nécessaires pour rétablir la prononciation.
2. La commande principale de lecture propose un arrêt fonctionnel sur Android au lieu d'une pause dépendant du moteur vocal du navigateur. Les lectures sont interrompues à la sortie de l'écran et les anciennes terminaisons ne modifient plus l'état d'une nouvelle lecture.
3. Les voix enregistrées existantes sont prioritaires quand le texte et la langue correspondent exactement. Une erreur de fichier peut déclencher la synthèse vocale dans la langue demandée, mais une lecture arrêtée ou remplacée ne peut pas redémarrer par un secours tardif.
4. Le coq et le tonnerre disposent maintenant d'un MP3 dérivé de leur OGG existant, sans génération ElevenLabs. Les 25 sons réels représentent 27 fichiers audio, avec ces deux variantes. Tous les MP3/OGG de la boîte à sons sont inclus dans le cache initial web et les assets Android.
5. Le délai maximal d'un son réel commence à sa lecture effective. Les événements tardifs d'un son arrêté ou remplacé ne relancent pas le son et n'arrêtent pas son successeur.
6. La voix du modèle préscolaire s'arrête avant l'enregistrement ou la réécoute de l'enfant. La réécoute de l'enfant est suspendue avant de lire le modèle dans les laboratoires. Une permission micro accordée après un départ ou une réinitialisation est libérée sans démarrer une prise ; les erreurs de création du recorder libèrent également le micro.
7. Le manifeste Android déclare désormais `MODIFY_AUDIO_SETTINGS` en plus de `RECORD_AUDIO`. Le pont WebView de Capacitor demande les deux et refuse la capture si une manque, même lorsque l'utilisateur a autorisé le micro. Un test vérifie le contrat avec la version de Capacitor installée. Les erreurs techniques d'enregistrement ne sont plus présentées comme un refus d'autorisation ; elles permettent une nouvelle tentative et affichent un message adapté dans les trois langues, y compris dans le lecteur Coran et le préscolaire. Cette correction native nécessite une nouvelle installation Android.

## Réutilisation et coût ElevenLabs

`frontend/scripts/index-recorded-speech.ts` vérifie les empreintes SHA-256 des fichiers déjà intégrés et construit le catalogue commun des voix. La commande `npm run audio:index`, depuis frontend, reconstruit ce catalogue et le plan de réutilisation.

- Après les lots Algérie, Valeurs, Consignes des sourates et Modèles/lectures, 908 fichiers intégrés correspondent à 895 phrases distinctes, langue comprise.
- Le plan préscolaire contient 438 demandes encore sans fichier correspondant, soit 435 générations uniques. Al-Falaq en français a été confirmé correct par Karim.
- Le premier lot laboratoires/lectures est intégré. Après préparation du prochain lot Dialogues/projets/consignes, le plan global contient 455 cibles et **452 générations uniques**, avec 3 répétitions exactes évitées. Le rapport `REUTILISATION-AUDIO.json` associe chaque texte aux fichiers cibles qui pourront réutiliser la même génération.
- Les accents, les voyelles arabes, la casse et la ponctuation sont préservés. Seuls les espaces et les représentations Unicode équivalentes sont normalisés. Une phrase française n'est jamais réutilisée pour l'arabe ou l'anglais.
- Les anciens fichiers restent en place pour préserver les références des activités déjà publiées. Aucun crédit ElevenLabs n'a été consommé pour ces correctifs.

## Vérifications

La suite frontend a passé 1702 tests après les corrections du lecteur partagé, de Tamazight et des sons. Après les ajustements du micro, ses tests et ceux des composants concernés ont été exécutés séparément : la dernière passe couvre 12 tests, dont les permissions du manifeste, les vrais refus d'accès et un micro occupé qui doit permettre une nouvelle tentative. La vérification TypeScript et le build frontend de production destiné à Android ont passé. Capacitor a synchronisé les assets et les plugins Android.

Le lot Algérie ajoute 48 voix aux 750 enregistrements précédents ; voir `INTEGRATION-ALGERIE.md`, notamment la confirmation à l'écoute de « fennec » en anglais par Karim.

La compilation native locale de l'APK nécessite un SDK Android absent sur ce PC. Le workflow GitHub `Android Release Build` est le chemin de construction prévu par le dépôt. Le numéro de version n'a pas encore été augmenté ; aucune version mobile n'a été publiée par ces travaux.

## Avant publication mobile

- Construire l'APK/AAB via le workflow Android, après validation et publication des changements.
- Écouter sur téléphone les lettres et mots modèles dans les trois langues : les tests techniques ne certifient pas la prononciation.
- Vérifier arrêt/relecture rapide, sortie pendant une lecture, son silencieux, micro autorisé/refusé et réécoute de la voix de l'enfant.
- Vérifier les voix et la boîte à sons hors connexion après installation.
- Vérifier séparément les récitations : leurs URL externes restent dépendantes du réseau. Elles ne sont pas remplacées par ElevenLabs.
- Les mots des cartes/micro sont maintenant couverts : 111 nouveaux fichiers et réutilisation des sons existants pour 120 cibles. Le catalogue atteint 1 042 fichiers / 1 029 textes distincts par langue. Il reste 318 consignes/récompenses (53 activités dans trois langues) dans les plans ; les textes dynamiques des cours et laboratoires peuvent encore utiliser la synthèse vocale. Voir `INTEGRATION-MOTS-CARTES-MICRO.md` pour la validation du lot.
