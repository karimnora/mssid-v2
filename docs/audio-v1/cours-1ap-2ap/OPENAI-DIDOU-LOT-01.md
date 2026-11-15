# Premier lot OpenAI — même voix que Didou V2

13 novembre 2026. Karim demande de conserver les sons existants et la voix de Didou V2. La source locale `docs/audio-v1/enregistrements-v2-openai.json` de la branche V2 identifie **cedar**, modèle **gpt-4o-mini-tts**, pour cette voix. Les 29 extraits V2 en nova constituent un autre lot : ils ne servent pas de référence pour ces nouveaux cours.

## Production effectuée

- 24 requêtes correspondant aux 24 textes figés dans `openai-lot-01-demande.json`, 1 293 caractères au total.
- Même modèle, voix et consignes de Didou que dans le générateur V2 : arabe littéral, voyelles/consonnes précises, ton chaleureux, pauses douces, sans musique ni mots ajoutés.
- 24 MP3 mono, 24 kHz, 80 kbit/s ; 142,55 secondes et 1 446 576 octets au total.
- Les WAV originaux sont conservés dans `output/course-audio-originals/`, ignoré par Git ; aucun son antérieur n'est écrasé.
- Métadonnées : `docs/audio-v1/enregistrements-cours-openai.json` ; texte, durée, SHA-256, empreinte WAV, modèle, voix et destinations. État qualité : `listening-required`.
- Index partagé régénéré : les titres utilisent ces fichiers même sans voix arabe installée. Les 1 238 correspondances préexistantes de la V1 sont inchangées. Les 428 fichiers OpenAI de la V2 correspondent toujours à leurs empreintes et n'ont pas été déplacés ni remplacés.

Ce lot couvre des titres, pas les 118 cours en entier. Le nouvel inventaire trouve 47 textes distincts enregistrés, 3 307 manquants, et 34 cours ayant au moins un passage enregistré. Un de ces titres est partagé entre deux niveaux.

## Exécution maîtrisée

Depuis `frontend` :

```text
npm run audio:generate:courses -- --limit 24
npm run audio:generate:courses -- --generate --limit 24
```

La première commande est un inventaire sans appel payant. La seconde est bornée au plan figé et au maximum à 24 extraits. Le résultat après production est `reused: 24, pending: 0` : un nouveau passage ne refacture pas ce lot. Les fichiers existants et leurs empreintes sont vérifiés, aucune écriture ne les écrase. Les erreurs réseau ne sont pas retentées automatiquement. La clé est chargée uniquement dans ce processus local depuis le fichier privé déjà fourni, qui reste ignoré par Git.

Contrôle ajouté à la demande de Karim : le générateur inspecte obligatoirement la bibliothèque V2 avant tout nouvel appel payant. Il reprend un enregistrement dans la même langue et la même voix si le texte correspond ; les fichiers sont vérifiés par empreinte. Si la V2 est inaccessible ou si le fichier correspondant est corrompu, il s'arrête plutôt que de payer une génération de remplacement. Le worktree `v2` est découvert par Git ; `MSSID_V2_ROOT` permet de préciser son emplacement. Les voyelles et accents restent significatifs ; seul l'allongement visuel arabe (tatweel) est ignoré, en plus des espaces.

La [documentation officielle OpenAI](https://developers.openai.com/api/docs/guides/text-to-speech) décrit l'API et les consignes de voix. Elle annonce le retrait de cette API historique au 6 janvier 2027 ; les MP3 produits restent indépendants de l'API et continuent à fonctionner. Adapter le générateur pour de futures productions après ce retrait. Les voix sont signalées comme générées par IA dans les cours des premiers niveaux.

## Contrôles et validation restante

Tous les WAV ont un signal non silencieux, une durée exploitable et ont été convertis puis redécodés avec FFmpeg. Les 478 fichiers arabes référencés passent les vérifications d'intégrité. Cinq scénarios navigateur vérifient les anciens MP3, les nouveaux titres 1AP–2AP sans voix arabe installée, et le décodage de 46 fichiers utilisés dans ce périmètre. Les 48 tests ciblés de quatre fichiers et TypeScript passent.

La validation technique ne certifie pas la prononciation. Karim doit écouter notamment les nombres, les directions et les terminaisons arabes. Aucun ancien clip n'est remplacé sur la seule base d'une transcription ou d'un score. Le coût facturé exact est à consulter dans le compte API ; aucune estimation non vérifiée de solde ou de dépense n'est présentée.

Pour essayer le premier titre : `/lesson/math-1ap-t1-spatial-relations?g=1AP`, bouton d'écoute du titre. Le fichier est `/sounds/preschool/ar/course-cedar-57332addd6c96e64.mp3`.

Autoévaluation : exactitude 4/5 (métadonnées et source V2 vérifiées, écoute restante), complétude 3/5 (24 titres produits, contenu complet encore à enregistrer), clarté 4/5 (périmètre explicite), action possible 4/5 (écoute locale et reprise sans doublons), concision 4/5 (preuves liées). Moyenne 3,8/5. Prochaine étape : retour d'écoute, puis production bornée des explications et exercices prioritaires.
