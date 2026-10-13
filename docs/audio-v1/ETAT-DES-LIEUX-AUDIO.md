# État des lieux audio — V1, branche main

Inventaire du code et des fichiers locaux au 11 octobre 2026, après le commit 08f3f94. Les nombres ci-dessous décrivent le code poussé, pas une vérification du déploiement Vercel ni une certification de la prononciation sur téléphone.

## Vue générale

| Partie | Situation actuelle | À compléter |
| --- | --- | --- |
| Préscolaire : consignes et félicitations | 750 MP3 ElevenLabs, soit 125 activités entièrement couvertes en arabe, français et anglais | 75 activités : 450 extraits supplémentaires |
| Préscolaire : cartes et micro | Les mots isolés utilisent encore la synthèse vocale | Lot préparé : 40 entrées par langue, 120 extraits à enregistrer et raccorder |
| Histoires préscolaires | Narration des cartes encore lue par synthèse vocale | Enregistrer les récits eux-mêmes en plus des consignes/félicitations du module |
| Boîte à sons | 25 fichiers réels : 23 MP3 et 2 OGG ; les noms et certaines consignes utilisent la synthèse vocale | Compléter les voix et le cache initial web des fichiers sonores |
| Jeux et animations | Effets sonores générés localement, certains sons réels réutilisés depuis la boîte à sons | Vérifier les niveaux, le silence et les chevauchements sur téléphone |
| Cours de 1AP à 5AP | Lecture par synthèse vocale, langue choisie selon la matière, débit adapté | Pas de bibliothèque de voix ElevenLabs des cours intégrée actuellement |
| Laboratoires | Synthèse vocale dans les laboratoires de langues, syllabes, dialogues, maths/sciences et découverte | Prioriser les modèles de prononciation et dialogues fixes |
| Sourates | Lecteur de récitations Warsh configuré vers EveryAyah, avec un second récitant de secours | Vérifier l'accès réseau et prévoir un mécanisme explicite de téléchargement/cache si le hors connexion est requis |
| Micro | Enregistrement et réécoute locale, sans envoi au serveur dans ce mécanisme | Modèles enregistrés à compléter ; aucune évaluation automatique de prononciation |
| Tamazight | Lecture désactivée dans les cours ; le lecteur spécifique Tamazight emploie encore une voix française | Supprimer l'approximation ou fournir des enregistrements d'un locuteur compétent |

## Enregistrements préscolaires déjà intégrés

Chaque activité dispose d'une consigne et d'une félicitation dans chacune des trois langues. Asmaa : arabe ; Léa : français ; Quentin : anglais. Il s'agit de voix générées avec ElevenLabs.

| Lot | Activités | Extraits, trois langues |
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
| **Total** | **125** | **750** |

Le catalogue comprend 200 activités dans 23 modules. Les consignes et félicitations enregistrées couvrent 62,5 % des activités. Ce pourcentage ne mesure pas toute la voix du préscolaire : les noms des cartes, mots du micro et récits ont un périmètre distinct.

Les fichiers sont mono, 44,1 kHz, 96 kbit/s. Ils sont associés aux bons identifiants d'activités et aux langues. Les félicitations disposent d'une durée utilisée par le lecteur pour attendre leur fin. En cas d'échec de lecture, le lecteur tente la synthèse vocale de la langue concernée. Les fichiers préscolaires sont inclus dans le cache initial PWA et dans les prochains builds Android contenant ces assets.

## Dix modules à enregistrer

| Lot | Activités | Extraits, trois langues |
| --- | ---: | ---: |
| Algérie | 8 | 48 |
| Valeurs et foi | 7 | 42 |
| Consignes et félicitations des petites sourates | 7 | 42 |
| Émotions | 8 | 48 |
| Tracés | 8 | 48 |
| Logique et espace | 10 | 60 |
| Suites | 8 | 48 |
| Histoires : consignes et félicitations | 3 | 18 |
| Dessins | 8 | 48 |
| Jeux créatifs | 8 | 48 |
| **Total** | **75** | **450** |

Les textes et plans sont dans `docs/audio-v1/prochains/12-algeria` à `21-creative-games`. Le lot `22-mots-cartes-et-micro` ajoute 40 entrées par langue, soit 120 extraits. Le plan préparé représente donc **570 extraits restants**, sans inclure une nouvelle bibliothèque des cours/laboratoires ni la narration complète des histoires. Les récitations Warsh existantes sont distinctes des voix de consigne.

## Cours, laboratoires et interfaces

La lecture partagée passe par `frontend/src/utils/speech.ts` : synthèse native Capacitor sur Android, synthèse du navigateur sur le web. Le timbre, la disponibilité des langues et le rendu dépendent donc du moteur installé. Les fichiers ElevenLabs préscolaires ne remplacent pas cette synthèse dans les autres zones.

Des appels à cette lecture existent notamment dans les cours, exercices, examens, tutorat, compagnon Didou, laboratoires français et anglais, dialogues anglais, projets français, syllabes, marché de monnaie, musée d'histoire, sciences et découverte. Des réponses calculées ou textes variables nécessitent une stratégie différente des phrases fixes : modèles préenregistrés avec valeurs séparées, ou synthèse vocale de secours.

Le micro est raccordé aux laboratoires de langues, à l'atelier arabe, aux projets français, aux syllabes, à l'écriture et au lecteur de mémorisation du Coran ; le préscolaire dispose aussi de son composant de répétition. Le mécanisme conserve l'enregistrement en mémoire, limite une prise à 20 secondes et permet la réécoute. Il ne mesure pas la qualité de prononciation et ne fournit pas de diagnostic vocal.

## Points à corriger ou vérifier

1. **Tamazight** : le lecteur `TamazightCurriculumViewer.tsx` appelle une voix française pour des mots Tamazight. La désactivation dans `useLessonSpeech.tsx` n'élimine pas ce second chemin. Enregistrer un locuteur compétent ou désactiver cette lecture approximative.
2. **Boîte à sons hors connexion web** : les 25 fichiers audio de `sounds/box` ne figurent pas dans les règles de cache initial de `frontend/vite.config.ts`. Les règles de cache à la demande visibles ne ciblent pas ces sons. Ils sont des assets locaux pour Android, mais leur présence dans un build publié reste à vérifier.
3. **Récitations hors connexion** : le lecteur utilise des URL externes ; aucun cache audio explicite n'est configuré dans les règles PWA examinées. Ne pas promettre l'écoute hors connexion sur cette base.
4. **Qualité réelle** : les tests de correspondance, de durée, le décodage des MP3 et les compilations ont passé lors des intégrations. Une écoute sur téléphone reste nécessaire pour la prononciation, les coupes, les niveaux et le confort d'écoute.
5. **Publication** : les modifications sont poussées sur main ; le déploiement Vercel a rencontré un blocage d'attribution de l'auteur. Un push ne confirme pas leur présence dans le site publié. L'application Android déjà installée doit recevoir un nouveau build contenant les nouveaux fichiers.

## Ordre de travail proposé pour la reprise

1. Valider le déploiement web et préparer un build Android de test.
2. Corriger les chemins Tamazight et les limites du cache audio.
3. Terminer les 10 modules et les mots des cartes/micro ; traiter séparément les récits complets.
4. Enregistrer les sons et mots pédagogiques des laboratoires français/anglais, puis les dialogues et lectures courtes prioritaires de 1AP–2AP.
5. Étendre progressivement aux autres niveaux, en gardant une solution de synthèse vocale pour les textes variables.
6. Valider sur téléphone : langue, prononciation, début/fin des clips, volume, répétitions rapides, navigation, micro refusé, mode silencieux et hors connexion.

Cet inventaire n'applique aucun correctif audio supplémentaire et ne relance pas les enregistrements mis en pause.
