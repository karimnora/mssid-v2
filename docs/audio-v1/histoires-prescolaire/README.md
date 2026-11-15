# Histoires préscolaires — 13 novembre 2026

## Livré

Le module **Petites histoires** contient désormais 12 activités : les trois histoires existantes sont conservées et neuf récits sont ajoutés. Accès : **Apprendre → Tracé et créatif → Petites histoires**.

Les nouveaux récits : Didou au marché, Chez grand-mère, Une journée à la plage, La joie de l’Aïd, La graine de Didou, Dans le verger d’oliviers, Une sortie au Sahara, Didou et la pluie, Un livre à la bibliothèque.

Chaque nouveau récit propose une narration courte, trois repères illustrés, deux questions à deux choix, l’écoute séparée de chaque réponse et une invitation à raconter avec ses propres mots. Une erreur reste réessayable. La réussite est enregistrée après les deux bonnes réponses et la confirmation du récit oral. Cette confirmation ne mesure pas automatiquement les compétences orales de l’enfant.

Les trois activités d’ordre initiales restent inchangées. Les anciens identifiants et les réussites sont conservés ; les nouvelles histoires constituent du contenu supplémentaire à découvrir.

## Audio

- Voix **cedar**, même modèle et mêmes instructions que la chaîne audio existante de Didou.
- 165 phrases distinctes préparées dans `demande.json`.
- V1 et V2 inspectées avant génération : 3 phrases déjà disponibles, aucun autre enregistrement V2 exact réutilisable.
- **162 nouveaux fichiers** : 52 en arabe, 55 en français, 55 en anglais.
- Durée totale : **714,2 secondes** ; taille : **7 282 968 octets**.
- Aucune suppression ni remplacement d’audio existant. Aucune nouvelle prise automatique. Le budget antérieur des reprises n’est pas consommé par ce lot de textes nouveaux.
- Narrations, questions, mots des réponses et feedbacks couverts par des fichiers enregistrés dans les trois langues. Le lecteur n’a pas besoin d’une voix de téléphone pour ces phrases.
- Les fichiers gardent le préfixe `course-cedar-` pour bénéficier du cache audio à la demande existant. Ils ne sont pas ajoutés en bloc au précache d’installation.

Les textes sont originaux, en arabe standard, français et anglais. Les contrôles automatiques portent sur le décodage, la durée, le niveau sonore, la présence des fichiers, leur empreinte et leur correspondance au texte. **Une écoute humaine, notamment de la prononciation arabe, reste à faire avant publication.** Les métadonnées conservent donc le statut `listening-required`.

Référence technique consultée : [documentation officielle OpenAI sur la synthèse vocale](https://developers.openai.com/api/docs/guides/text-to-speech). La clé reste dans le fichier local ignoré, jamais dans les données du navigateur.

## Validation

- Catalogue et lecteur préscolaires : 945 tests distincts validés après reprise isolée d’un test d’impression qui avait dépassé sa limite de cinq secondes lors de l’exécution concurrente.
- Les 21 tests ciblés d’impression, de lecteur, d’interactions et de couverture audio passent après les derniers ajustements.
- 8 scénarios navigateur passent : anciens ateliers, comptage à trois largeurs, contrôle des boutons des défis et parcours complet d’une nouvelle histoire dans chacune des trois langues sans voix native.
- Les parcours navigateur vérifient aussi le service HTTP des nouveaux fichiers audio et l’absence de débordement dans l’écran de récit oral.
- Typage TypeScript complet et compilation de production réussis. Précache PWA : 1 504 entrées, environ 67,6 Mio ; les nouveaux MP3 restent chargés à la demande.
- Captures mobiles inspectées dans `output/story-browser` (non versionnées).

## Reproduire

Depuis la racine :

```powershell
node frontend/node_modules/tsx/dist/cli.mjs frontend/scripts/prepare-story-audio.ts
node frontend/node_modules/tsx/dist/cli.mjs frontend/scripts/generate-course-audio.ts --plan docs/audio-v1/histoires-prescolaire/demande.json --complete-plan
```

Ces deux commandes ne génèrent aucun audio payant. L’index a été reconstruit après production avec `frontend/scripts/index-recorded-speech.ts`, qui contrôle aussi l’intégrité de tous les enregistrements indexés.

## Relecture du lot

Exactitude : 4/5, correspondances audio et parcours vérifiés mais écoute humaine encore nécessaire. Complétude : 4/5, neuf nouveaux récits complets, illustrations par pictogrammes plutôt que scènes dessinées sur mesure. Clarté : 4/5, étapes explicites, à observer avec de jeunes enfants. Action possible : 4/5, module local testable, validation téléphone/famille avant publication. Concision : 4/5, détails conservés dans ce document. Moyenne : 4/5.


## Correction de la question arabe de « Chez grand-mère »

La première question est désormais « عِنْدَ مَنْ ذَهَبَ دِيدُو؟ ». Après recherche V1/V2 sans correspondance, une seule nouvelle prise cedar a été produite : `course-cedar-c87fa7f2f9c5c6e4.mp3`, 3,35 secondes. Le texte affiché, le plan et l’index audio utilisent cette même phrase. L’ancien enregistrement est conservé. Aucun push.
