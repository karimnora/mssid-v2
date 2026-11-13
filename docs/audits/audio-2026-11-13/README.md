# Vérification des autres audios de l'application

13 novembre 2026, V1 locale. Première étape : 109 fichiers réutilisés depuis la V2 sans génération. Complément demandé ensuite : 49 enregistrements absents de la V2, produits avec la même voix cedar. Tous les sons antérieurs restent conservés. Commits locaux uniquement, sans push.

## Contrôles techniques

| Contrôle | Résultat |
|---|---|
| Fichiers locaux présents au début | 1 302 décodés avec FFmpeg, zéro échec, avertissement de décodage ou silence suspect |
| Fichiers V2 importés ensuite | 109 décodés, zéro échec, avertissement ou silence suspect |
| Nouveaux enregistrements Didou, anglais et français | 49 MP3 : WAV non silencieux, compression et décodage FFmpeg contrôlés à la production |
| Total technique couvert | **1 460 fichiers**, environ 61,6 Mo de fichiers locaux |
| Métadonnées | 1 517 entrées vérifiées : existence, durée positive et SHA-256 ; les entrées peuvent référencer le même fichier |
| Références locales littérales | 957 chemins contrôlés, aucun fichier manquant |
| Boîte à sons | 25 sons, tous avec un fichier MP3 ou OGG disponible |
| Récitations distantes | Quatre échantillons : verset 1 d'Al-Fatiha et d'Al-Ikhlas, récitant principal et secours ; HTTP 200 et décodage réussi |

Rapports : [fichiers initiaux](media-checks.json), [fichiers réutilisés](media-reused-checks.json), [raccordements](connections.json), [échantillons de récitations](remote-recitations.json). Les contrôles techniques ne prouvent pas la prononciation, l'identité du récitant, ni la compréhension par un enfant. Les échantillons en ligne ne certifient pas tous les versets et ne garantissent pas le fonctionnement hors connexion.

## Réutilisation de la V2, sans génération

La comparaison a retrouvé **109 phrases exactes déjà enregistrées avec cedar** : 35 en français et 74 en anglais. Elles manquaient dans la V1 pour les modules préscolaires logique/espace, suites, histoires, dessin et jeux créatifs. Ces fichiers ont été vérifiés puis copiés ; aucune nouvelle voix n'a été facturée et les sources V2 n'ont pas été déplacées.

| Consignes et félicitations du préscolaire | Avant | Après |
|---|---:|---:|
| Arabe | 400 / 400 | 400 / 400 |
| Français | 365 / 400 | 400 / 400 |
| Anglais | 326 / 400 | 400 / 400 |

Cela couvre deux messages par activité, pour **200 activités dans 23 modules**. Cela ne signifie pas que chaque mot du micro, chaque carte, chaque récit complet et chaque interface dispose d'un MP3. Les correspondances texte/fichier ne présentent aucun désaccord après prise en compte du tatweel décoratif et de l'ellipse typographique déjà prévue dans les anciens lots de lettres. Aucune voyelle arabe n'a été effacée pour fabriquer une correspondance.

L'index contient désormais 1 420 textes distincts : arabe 483, français 476, anglais 461. Les 1 433 sources enregistrées et les 1 460 fichiers locaux ont des périmètres différents : la boîte à sons et certains fichiers complémentaires ne sont pas des phrases du catalogue.

## Couverture après correction des manques fixes

| Zone et périmètre fixe recensé | Avec MP3 | À compléter |
|---|---:|---:|
| Modèles de prononciation FR/EN | 32 / 32 | Écoute pédagogique à consigner |
| Répliques des dialogues anglais | 21 / 21 | Écoute pédagogique à consigner |
| Textes supports et vocabulaire des projets français | 32 / 32 | Écoute pédagogique à consigner |
| Messages fixes de Didou V1 | 12 / 12 | Écoute pédagogique à consigner |

Les **49 demandes fixes initialement sans MP3** ont été complétées après vérification de la V2. Aucune phrase voisine n'est substituée. Le [plan figé](../../audio-v1/app-manquants-lot-02.json) totalise 2 425 caractères, 207 secondes et 2 113 196 octets de nouveaux MP3 ; le montant réellement facturé n'est pas relevé. L'audit compte maintenant 97 / 97 demandes fixes couvertes, sans référence manquante ni erreur d'empreinte. Une nouvelle simulation du générateur retourne 49 réutilisés et zéro génération restante. Les cours de 1AP–2AP gardent leur [inventaire séparé](../../audio-v1/cours-1ap-2ap/README.md) : les milliers de passages encore non enregistrés ne sont pas inclus dans ces 49 demandes.

L'inventaire source examine 467 fichiers et repère 35 appels directs au lecteur partagé. Les wrappers des laboratoires de sciences, du marché, des wilayas et du musée demandent bien l'arabe ; les dialogues anglais et projets français demandent leur langue respective. Les textes calculés, réponses du tuteur et variantes dynamiques ne sont pas recensés exhaustivement par l'extraction statique. Les boutons et parcours de chaque jeu ne sont pas tous validés individuellement par cet audit.

Le laboratoire tamazight conserve, conformément au choix antérieur de Karim, son secours français pour certaines translittérations. Cela ne constitue pas une prononciation tamazight validée ; il faut des modèles d'un locuteur compétent pour en faire une référence pédagogique. Les récitations professionnelles existantes ne sont pas remplacées par une voix de consigne.

## Corrections et garde-fous

- Les futurs appels du générateur vérifient obligatoirement les métadonnées et fichiers de la V2, dans la bonne langue et la voix demandée. Si la source est absente/inaccessible ou son empreinte incorrecte, pas de génération de remplacement silencieuse.
- La réutilisation conserve les fichiers V1 déjà présents et refuse de les écraser s'ils diffèrent. Les importations sont idempotentes.
- Les clés de recherche ignorent le tatweel, purement visuel, et conservent les voyelles, accents et ponctuation significative. Les phrases portant des voyelles différentes restent distinctes.
- Dans le studio Didou, les MP3 restent accessibles sans voix système. La recherche enlève les émojis comme le lecteur ; le secours vocal est interdit si aucune voix correspondante n'est confirmée. Les boutons sont masqués lorsque la lecture vocale est désactivée. Les messages restent lisibles.
- Didou et les deux laboratoires concernés signalent que la voix est synthétique. Le générateur garde les enregistrements antérieurs et ne transmet jamais la clé au navigateur.

Commandes hors navigateur : `npm run audio:audit:app`, `npm run audio:reuse:v2` (simulation), `npm run audio:reuse:v2 -- --apply` (copie), `npm run audio:check:media` (décodage). La copie et l'audit n'utilisent aucune clé ni service payant. L'import réalisé est conservé dans `docs/audio-v1/enregistrements-reutilises-v2.json`.

## Validation et limites

Complément des 49 sons : 38 tests ciblés réussis dans sept fichiers (studio Didou, lecture et langues, protection de la réutilisation V2, dialogues anglais). Trois scénarios Chromium passent : décodage non silencieux des 49 MP3, puis lecture réelle de Didou en arabe et en français sans aucune voix système et sans appel à la synthèse du téléphone. Les contrôles avant publication restent distincts du décodage technique. Le modèle de génération utilisé par la V2 est conservé pour ce lot ; sa fermeture annoncée au 6 janvier 2027 nécessite de migrer les futures générations, sans affecter les MP3 statiques déjà livrés. Source : [documentation OpenAI](https://developers.openai.com/api/docs/guides/text-to-speech).

Étape initiale de l’audit : **865 tests réussis dans 35 fichiers**, incluant préscolaire, lecture/arrêt/pause, absence de voix, changements de page, dialogues, récitations, studio Didou et protection de la réutilisation V2. Cinq scénarios navigateur passent : trois configurations du studio Didou et deux activités préscolaires en français/anglais lisant un vrai fichier V2 sans voix correspondante du téléphone ni appel à la synthèse. TypeScript vérifié avant commit. Les fichiers de décodage sont séparés pour conserver la preuve de l'état initial et des 109 ajouts.

Restent la validation linguistique à l'écoute, les essais sur Android réel (haut-parleur/casque, interruption, mode avion), les récits et mots non couverts, et la généralisation de la couverture des cours. Le [protocole audio](../../audio-qa-protocol.md) conserve ces exigences avant publication.

Le cache initial PWA inclut actuellement les MP3 des trois langues et la boîte à sons. Le volume local d'audio contrôlé est d'environ 61,6 Mo ; ce chiffre n'est pas une mesure du trafic ni du cache effectif d'un téléphone. Une stratégie de téléchargement par langue mérite d'être étudiée après mesure mobile, sans supprimer les fichiers existants dans ce lot.

Autoévaluation : exactitude 4/5 (mesures reproductibles, phonétique non certifiée), complétude 3/5 (tous les fichiers locaux contrôlés, toutes les interactions et variantes non couvertes), clarté 4/5 (périmètres séparés), action possible 4/5 (109 copies effectuées et prochaines demandes identifiées), concision 4/5 (preuves liées). Moyenne 3,8/5. Les 49 manques fixes sont complétés ; priorité restante : écoute ciblée des contenus pédagogiques et recette Android, sans régénérer les fichiers déjà utilisables.
