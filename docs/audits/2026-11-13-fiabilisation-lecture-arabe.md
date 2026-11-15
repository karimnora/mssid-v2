# Lecture arabe et réutilisation des MP3 — 1AP–2AP

Les MP3 existants sont prioritaires sur la synthèse, mais ils ne couvrent pas tous les cours. Le lecteur partagé ne doit pas être présenté comme une bibliothèque entièrement enregistrée.

## Corrections du lecteur

- Le texte vocal garde ses voyelles même lorsque le parent masque le tashkīl à l'écran. Cela concerne les cartes de découverte, règles, vocabulaire, exemples, activités à la maison, titres et explications. Les scènes de lecture conservaient déjà leur texte vocalisé.
- Les cartes 1AP peuvent afficher un intitulé abrégé, mais leur audio conserve désormais la phrase complète fournie par l'auteur, sans couper une explication à mi-phrase ni reconstruire sa ponctuation.
- Un passage composé de phrases entièrement enregistrées peut enchaîner les MP3 correspondants. Chaque phrase doit correspondre exactement, dans la bonne langue. Pas de suppression des voyelles pour rapprocher des mots, ni d'assemblage de syllabes.
- En cas d'arrêt, aucune phrase suivante ne démarre. Si un fichier suivant échoue, le secours ne répète pas les phrases déjà entendues.
- Sans voix arabe confirmée, un MP3 qui échoue ne bascule pas vers une voix de téléphone inconnue.
- Dans les cours, chaque bouton vérifie qu'une voix adaptée ou un enregistrement exact est disponible. En 1AP–2AP, les MP3 restent utilisables sans voix arabe installée ; les commandes qui ne pourraient rien lire sont masquées. La synthèse existante reste un secours lorsqu'elle est disponible, sans être qualifiée d'enregistrement.

## Vérifications

60 tests réussis dans six fichiers : lecteur enregistré, coordination avec la synthèse, langue/disponibilité, cartes et affichage des premiers niveaux. Trois scénarios Chromium supplémentaires passent : lecture d'un vrai MP3 1AP puis 2AP, sans voix arabe et sans voyelles affichées ; décodage de 22 MP3 de lectures/consignes arabes, signal non silencieux et durée cohérente avec les métadonnées. Aucun appel à la synthèse pendant les deux lectures testées.

Les six scénarios navigateur de l'écoute 3AP passent également. TypeScript et contrôle de patch réussis avant commit. API simulée : pas de test de compte réel ni de publication.

Ces contrôles prouvent le raccordement et la lisibilité des fichiers. Ils ne certifient pas la prononciation. Le compte rendu antérieur indique que Karim a validé « هَذَا كِتَابٌ » à l'écoute ; une transcription automatique différente ne suffit pas à invalider ce fichier. La validation d'écoute des autres passages reste à consigner.

Voir l'[inventaire et le premier lot à produire](../audio-v1/cours-1ap-2ap/README.md).
