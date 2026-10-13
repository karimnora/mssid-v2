# État des lieux audio — V1, main — 13 octobre 2026

Inventaire du code et des fichiers locaux. Il actualise l'inventaire du 11 octobre (`ETAT-DES-LIEUX-AUDIO.md`). Les travaux récents sont non commités ; cet inventaire ne confirme pas leur disponibilité en production ou dans l'application déjà installée.

## Chiffres vérifiés

- 861 MP3 préscolaires présents sur disque et dans le cache de production généré.
- 848 phrases distinctes, langue comprise, dans le catalogue partagé.
- 147 activités sur 200 disposent d'une consigne et d'une félicitation enregistrées dans les trois langues : 73,5 % de couverture technique de ces deux lectures, 16 modules sur 23.
- Ce pourcentage ne mesure pas la couverture des mots isolés, récits complets ou de toute la voix de l'application.
- 53 activités restent à compléter, soit 318 lectures cibles. Les 120 mots des cartes et du micro portent le plan restant à 438 fichiers cibles, correspondant à 435 générations uniques.
- Les cours, laboratoires et narrations complètes ne sont pas inclus dans ces 435 générations.

## Préscolaire intégré

Asmaa pour l'arabe, Léa pour le français, Quentin pour l'anglais : voix générées avec ElevenLabs. Les MP3 découpés sont mono, 44,1 kHz, 96 kbit/s. Les rapports conservent sources, textes, transcriptions de repérage, coupes, durées et empreintes SHA-256.

| Lot | Activités couvertes | Fichiers MP3 |
| --- | ---: | ---: |
| Lettres, deux modules | 42 | 252 |
| Nombres de 0 à 10, deux modules | 14 | 84 |
| Formes | 10 | 60 |
| Couleurs | 10 | 60 |
| Animaux | 10 | 60 |
| Corps | 8 | 48 |
| Saisons | 7 | 42 |
| Calendrier | 4 | 24 |
| Aliments | 7 | 42 |
| Petit monde | 7 | 42 |
| Famille | 6 | 36 |
| Algérie | 8 | 48 |
| Valeurs et foi | 7 | 39 nouveaux ; 3 lectures reprises d'Algérie |
| Consignes des sourates courtes | 7 | 24 ; une félicitation commune par langue |
| **Total** | **147** | **861 fichiers distincts** |

Les trois derniers lots ajoutent 111 fichiers aux 750 précédents. Les sept sourates partagent une félicitation par langue, évitant 18 copies et générations.

## Préscolaire restant

| Lot | Activités | Lectures cibles, trois langues |
| --- | ---: | ---: |
| Émotions | 8 | 48 |
| Tracés | 8 | 48 |
| Logique et espace | 10 | 60 |
| Suites | 8 | 48 |
| Histoires : consignes et félicitations | 3 | 18 |
| Dessins | 8 | 48 |
| Jeux créatifs | 8 | 48 |
| **Total activités** | **53** | **318** |
| Mots des cartes et du micro | 40 mots par langue | 120 |
| **Plan restant** | | **438 cibles, 435 générations uniques** |

Les textes sont dans les lots 15 à 22 de `docs/audio-v1/prochains`. Les narrations des cartes d'histoires doivent être traitées en plus des consignes/félicitations. Mots et narrations peuvent encore utiliser la synthèse vocale ; le lecteur réutilise une voix existante uniquement si texte et langue correspondent.

## Autres parties de l'application

| Partie | Situation | Travail restant |
| --- | --- | --- |
| Cours 1AP–5AP, exercices et examens | Principalement synthèse native Android ou navigateur ; voix enregistrée prioritaire en cas de correspondance exacte | Pas de bibliothèque ElevenLabs complète des cours ; rendu dépendant du moteur installé |
| Laboratoires de langues, syllabes et dialogues | Modèles principalement lus par synthèse, avec réutilisation exacte du catalogue | Prioriser sons phonétiques, mots modèles et dialogues fixes |
| Compagnon, accueil, découverte, sciences, monnaie | Lecteur partagé pour phrases fixes et textes variables | Les textes calculés ne peuvent pas tous devenir un fichier fixe |
| Tamazight : cours et lecteur spécifique | Lecture approximative retirée de `TamazightCurriculumViewer`, lecture des cours désactivée | Voix d'un locuteur compétent à fournir |
| Tamazight : laboratoire | Audio existant conservé à la demande de Karim ; `TamazightLabInteractive.tsx` utilise une voix française pour des modèles translittérés | Voix d'un locuteur compétent souhaitable ultérieurement |
| Boîte à sons | 25 sons réels, 27 fichiers : 25 MP3 et 2 OGG conservés ; MP3 coq/tonnerre ajoutés ; cache web configuré | Noms/consignes encore partiellement en synthèse ; niveaux à écouter |
| Jeux et animations | Effets locaux et sons réels réutilisés | Vérifier volume, silence et chevauchements sur téléphone |
| Récitations | Récitant professionnel Warsh, URL EveryAyah et récitant de secours | Dépendance réseau ; aucun cache explicite garantissant le hors connexion |
| Micro | Prise locale en mémoire, limitée à 20 s, réécoute, sans envoi au serveur dans ce mécanisme | Pas de notation de prononciation ; correctif Android à tester dans une nouvelle installation |

## Correctifs locaux réalisés

1. Voix enregistrées prioritaires par texte/langue, accents et voyelles arabes préservés ; synthèse de secours et protection contre les erreurs tardives d'une ancienne lecture.
2. Arrêt fonctionnel sur Android ; pause/reprise web ; anciennes terminaisons sans effet sur une nouvelle lecture.
3. Cache des 861 voix préscolaires et 27 fichiers de la boîte à sons vérifié ; assets Android synchronisés. Les récitations externes restent distinctes.
4. Délai des sons réels compté depuis le début effectif ; événements périmés ignorés.
5. Arrêt du modèle avant prise/réécoute ; libération du micro si permission tardive ou création du recorder en erreur.
6. Ajout de `MODIFY_AUDIO_SETTINGS` au manifeste Android, en plus de `RECORD_AUDIO`, car Capacitor demande les deux. Erreurs techniques distinguées du refus d'autorisation, avec nouvelle tentative possible.
7. Approximation retirée du lecteur de cours Tamazight. Le laboratoire distinct conserve son audio existant à la demande de Karim ; une voix d'un locuteur compétent reste une amélioration possible ultérieurement.

## Validation et limites

- 1702 tests frontend ont passé après les premiers correctifs du lecteur, des sons et du lecteur Tamazight. Les changements suivants ont reçu des tests ciblés ; une suite complète n'a pas été relancée après chaque lot.
- La dernière passe Sourates/Valeurs/lecteur couvre 20 tests réussis. Correspondances fichiers/textes/langues, durées et partage des félicitations sont vérifiés.
- Tests du micro : refus réel, micro occupé, libération tardive, contrat des permissions Android.
- TypeScript, builds frontend Android et synchronisations Capacitor ont passé.
- Aucun APK natif n'a été construit localement : SDK Android absent. Le workflow GitHub Android Release Build est le chemin de construction prévu.
- Karim a confirmé « fé-nek » dans l'extrait anglais d'Algérie. Une différence de transcription ne justifie pas à elle seule une nouvelle génération.
- **Al-Falaq en français a été confirmé correct par Karim à l'écoute** malgré une transcription erronée. Al-Ikhlas en français et les autres noms arabes lus en français/anglais méritent une écoute. Les transcriptions ne certifient pas la prononciation.

## Priorités avant la prochaine version mobile

1. Améliorer les modèles des laboratoires français/anglais et les lectures courtes 1AP–2AP : voir `PRONONCIATION-ET-LECTURES.md`.
2. Construire un Android de test intégrant le correctif du micro. L'audio du laboratoire Tamazight est conservé à la demande de Karim.
3. Sur téléphone : langues, coupes, volumes, arrêt, sortie d'écran, lectures rapides, silence, micro autorisé/refusé/occupé et réécoute.
4. Vérifier hors connexion voix intégrées/boîte à sons ; récitations séparément avec réseau.
5. Compléter les sept lots préscolaires et les mots du micro ; ensuite modèles phonétiques des laboratoires, lectures fixes 1AP–2AP, puis niveaux suivants.

Les changements récents ne sont pas encore commités, poussés ni publiés sur Android. L'application en production n'est pas certifiée par cet inventaire.
