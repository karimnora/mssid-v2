# Premier lot des laboratoires et lectures 1AP–2AP

## Parcours préparé

- Atelier français « Écoute et répète » : 12 mots et 4 phrases courtes. Les mots proposent notamment roue/rue et poisson/poison, ainsi que des mots en « ch ».
- Onglet anglais Phonics remplacé par un atelier utilisable : 12 mots et 4 phrases, avec ship/sheep, thin/tin, three/tree, cat/cap et pen/pan.
- Chaque modèle est affiché séparément ; l'enfant écoute, peut enregistrer sa voix et la réécouter. Navigation précédent/suivant, arrêt du modèle en changeant de carte, nettoyage du micro à la sortie.
- Les laboratoires de langues conservent leurs niveaux d'accès existants. Les cours 1AP–2AP actuels de cette sélection sont en arabe.
- Deux lectures très courtes ajoutées aux cours de 1AP « école » et « famille » : quatre phrases au total. Les deux histoires 2AP déjà présentes (« école », « quartier ») fournissent onze scènes. Le bouton audio utilise toujours le texte vocalisé même si les voyelles sont masquées à l'écran.

## Enregistrement nécessaire

Le lot `prochains/23-prononciation-et-lectures` contient les fichiers de texte et de découpage : 16 phrases pour Léa (français), 16 pour Quentin (anglais), 15 pour Asmaa (arabe). Les mots isolés sont suivis d'un point dans le texte à générer pour créer une pause ; le texte modèle de l'app reste le mot seul.

Les 47 MP3 ElevenLabs ont été fournis puis intégrés ; le lecteur partagé les privilégie désormais. Les syllabes/phonèmes isolés ne sont pas remplacés par le nom des lettres ; ce premier lot utilise des mots et phrases entiers afin de permettre une vérification à l'écoute. Voir `INTEGRATION-PRONONCIATION-LECTURES.md`, notamment le contrôle à l'écoute des premières phrases arabes encore demandé.

Lors de la préparation, aucune des 47 entrées ne correspondait à un fichier déjà enregistré. Après intégration, les six textes aussi demandés dans d'autres lots sont réutilisables. Voir `INTEGRATION-PRONONCIATION-LECTURES.md` pour les totaux mis à jour et le prochain lot.

## Choix de Karim

Al-Falaq en français a été confirmé correct à l'écoute ; aucune nouvelle génération nécessaire. Karim préfère conserver l'audio du laboratoire Tamazight même sans voix ElevenLabs disponible. Cet atelier n'est pas modifié par les améliorations françaises/anglaises. La disponibilité d'un locuteur compétent reste une piste pour améliorer sa prononciation ultérieurement.

## Validation

Les 23 tests ciblés du nouvel atelier et des lectures passent, notamment l'alignement entre le modèle affiché et celui du micro, la présence des lectures dans le cours 1AP et la conservation des voyelles dans le texte vocal.

La vérification TypeScript, le build frontend Android et la synchronisation Capacitor passent également. La compilation native et la validation sur téléphone restent à faire avec la prochaine version mobile.

Les changements sont locaux. Les fichiers audio à générer restent nécessaires pour valider la prononciation à l'écoute ; aucune nouvelle version mobile n'est publiée par ce lot.
