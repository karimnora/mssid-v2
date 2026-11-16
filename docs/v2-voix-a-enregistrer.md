# V2 — Voix à enregistrer, par ordre d'utilité (CL-12)

Rédigé par Claude le 16 novembre 2026. Destinataires : Karim (décision et budget) et Codex (génération et intégration).
Liste exacte des textes : `docs/v2-voix-a-enregistrer.json`.

## Où on en est

Le 13 novembre, la V1 a fait enregistrer les textes fixes des cours 1AP et 2AP avec **cedar, la voix de Didou V2** : 3 342 textes sur 3 353 (`docs/audio-v1/cours-1ap-2ap/README.md`). Ces sons sont arrivés dans la V2 avec la fusion du 15 novembre. Les consignes, les énoncés, les questions de quiz et les jeux de 1AP et 2AP ont donc déjà une vraie voix.

Ce qui reste a été mesuré le 16 novembre sur `v2`, avec la même fonction de correspondance que l'application (`findRecordedSpeechSequence`) : un texte compte comme enregistré seulement s'il a un son exact.

## Ordre proposé

| Lot | Quoi | Textes | Pourquoi dans cet ordre |
|---|---|---:|---|
| **1** | **Phrases fixes de Didou dans les leçons** (CL-09) : ouverture des étapes, erreur, indice, réussite, série, fin de leçon, mission du jour, « القَاعِدَةُ: » | **18** (environ 1 000 caractères) | Entendues dans chaque leçon de chaque niveau, plusieurs fois par séance. Aucune n'est enregistrée. C'est la voix qui fait exister Didou. |
| **2** | **Quiz 1AP et 2AP** : choix de réponse du quiz 2AP (186) et explications lues après une réponse en 1AP (219) et en 2AP (106) | **511** (environ 10 200 caractères) | Ces textes ont déjà un bouton d'écoute, mais c'est la voix du téléphone qui les lit, souvent mal en arabe. Le quiz doit être réussi à 100 % (règle F-10) : l'explication après une erreur est le moment où l'enfant a le plus besoin de comprendre. |
| 3 | Listes déjà prêtes de la V2 : `v2-enrichissement-voix-todo.json` (261), `v2-jardin-voix-todo.json` (79), `v2-marche-voix-todo.json` (81) | 421 | Ateliers et labos de la V2. Utiles, mais moins souvent entendus qu'une leçon. Vérifier les doublons entre les trois listes avant de générer. |
| — | Indices et corrections détaillées des exercices 1AP et 2AP | 525 | **Pas à enregistrer pour l'instant** : l'application n'a pas de bouton d'écoute sur ces textes. Les enregistrer n'aurait aucun effet. Voir la décision 2. |
| — | 11 passages de cours 1AP qui citent un verset | 11 | **Ne pas synthétiser.** Le lecteur de récitation existant reste en place. |

## Règles de production (reprises du lot du 13 novembre)

- Voix cedar, pour que Didou ait la même voix partout.
- Texte strictement identique à celui de l'application : voyelles, ponctuation, article. Sinon la correspondance échoue et le téléphone reprend la main.
- Ne jamais régénérer un son déjà utilisable ; garder les fichiers d'origine.
- Contrôles par fichier : durée, empreinte SHA-256, décodage FFmpeg (`docs/audio-qa-protocol.md`).
- Écoute par un arabophone avant la vente, en priorité les phrases de Didou du lot 1.

## Décisions pour Karim

1. **Lot 1 maintenant ou après CX-11 ?** Les 18 phrases du lot 1 ne sont pas encore dans le code (Codex les y met en CX-11). Les enregistrer avant est possible, car le texte est figé dans `docs/v2-didou-phrases-lecon.md`. Proposé : enregistrer tout de suite, elles sont courtes. Si un enseignant change une phrase, seule celle-là est à refaire.
2. **Faut-il lire à voix haute les choix des exercices d'entraînement en 1AP ?** Aujourd'hui, l'énoncé est lu mais pas les choix (155 textes sans son, 76 avec). En lecture, lire les choix donnerait la réponse ; en maths ou en sciences, un enfant de 6 ans qui ne lit pas encore bien en a besoin. Proposé : un bouton d'écoute sur les choix seulement hors des exercices de lecture, puis enregistrer ces 155 textes. C'est un changement d'écran, donc une tâche Codex.
