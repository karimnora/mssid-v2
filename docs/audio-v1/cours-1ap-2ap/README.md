# Voix arabes des cours 1AP–2AP

Inventaire local du 13 novembre 2026. **La couverture enregistrée est encore très partielle.** Les voix du téléphone ne sont pas comptées comme des MP3 enregistrés. Les fichiers existants sont des voix générées avec ElevenLabs, dont Asmaa pour l'arabe ; ils ne sont pas présentés comme des prises d'un enseignant.

## Couverture mesurée

| Niveau | Cours | Passages fixes recensés, avec répétitions | Passages couverts | Cours ayant au moins un passage enregistré |
|---|---:|---:|---:|---:|
| 1AP | 57 | 2 412 | 11 | 7 |
| 2AP | 61 | 1 519 | 12 | 2 |

Après déduplication entre cours, **3 354 textes distincts**, dont **23 couverts par 22 fichiers existants** et **3 331 sans correspondance enregistrée complète**. Un texte peut réutiliser plusieurs phrases déjà enregistrées. Un cours ayant un passage enregistré n'est pas considéré comme entièrement couvert.

Le relevé suit les textes fixes des commandes de lecture : entrée, lecture, explications, règles, énoncés, options de quiz 1AP et jeux pédagogiques. Il exclut les retours calculés, les simulations et la navigation. Ce n'est donc pas un taux de couverture de toute parole possible de l'application. Les répétitions entre onglets peuvent correspondre au même texte et au même fichier à produire.

Les **454 fichiers arabes déclarés dans les métadonnées ont une durée positive, existent et correspondent à leur SHA-256**. Cela garantit leur intégrité, pas leur prononciation. Les 22 fichiers réutilisés dans le périmètre proviennent des lectures et des consignes existantes. Les autres sons préscolaires ne sont pas substitués à des phrases différentes simplement parce qu'ils concernent la même notion.

## Fichiers livrés

- [couverture.json](couverture.json) : bilan par cours et correspondances enregistrées.
- [ar-manquants.json](ar-manquants.json) : tous les textes sans correspondance, avec noms de fichiers proposés et cours destinataires.
- [lot-01-ar-texte-a-relire.txt](lot-01-ar-texte-a-relire.txt) : premier lot limité à 24 entrées, 12 par niveau.
- [lot-01-ar-decoupage.json](lot-01-ar-decoupage.json) : ordre, texte, nom de fichier et destinations de ce premier lot.

Le premier lot traite l'entrée des cours ; il ne couvre pas leurs exercices. Les noms de fichiers sont stables pour cet état de l'inventaire, pas des identifiants à recalculer après production.

## Production et validation restantes

1. Relire les textes du premier lot en arabe littéral, compléter ou corriger la vocalisation utile et écrire explicitement les nombres si le moteur les lit mal. Les textes portent `reviewRequired: true` : ils ne sont pas certifiés prêts à prononcer.
2. Produire les MP3 avec la voix arabe retenue pour le préscolaire si elle convient toujours, en gardant la correspondance texte/fichier. Aucun service de génération audio n'est connecté dans cette session : les MP3 manquants n'ont pas été créés.
3. Écouter chaque clip avec un arabophone compétent : bonne phrase, lettres et voyelles, pas de mot coupé, débit compréhensible par un enfant. Les récitations coraniques exigent leur lecteur/récitant approprié, pas un remplacement générique par la voix des consignes.
4. Intégrer les fichiers avec durée, empreinte et texte effectivement prononcé ; ajouter leurs métadonnées à l'index partagé et refaire l'inventaire. Ne pas modifier un texte approuvé pour le faire artificiellement correspondre à un mauvais audio.
5. Tester sur Android sans voix arabe installée, puis en mode avion si l'usage hors connexion est visé. Les contrôles navigateur ne valent pas recette de l'APK ni du cache réel du téléphone.

L'inventaire se régénère depuis `frontend` avec `npm run audio:audit:early`. Ce script produit des fichiers de travail et vérifie les métadonnées arabes ; il n'appelle aucun service payant et ne certifie pas la prononciation.

## Évaluation de ce lot

Exactitude 4/5 : correspondances strictes et empreintes vérifiées, écoute humaine encore requise. Complétude 3/5 : lecteur corrigé et inventaire concret, mais 3 331 textes restent sans MP3. Clarté, possibilité d'action et concision 4/5 chacune : premier lot de 24 et destinations fournis, mais production externe nécessaire. Moyenne 3,8/5. Amélioration prioritaire : produire puis valider ce premier lot, avant d'annoncer une couverture complète. L'objectif d'enregistrements pour tous les cours reste ouvert.
