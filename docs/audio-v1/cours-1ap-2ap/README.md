# Voix arabes des cours 1AP–2AP

Inventaire local du 13 novembre 2026. **La couverture enregistrée est encore très partielle.** Les voix du téléphone ne sont pas comptées comme des MP3 enregistrés. Les fichiers ElevenLabs existants sont conservés. À la demande de Karim, les nouveaux cours utilisent **cedar**, la voix OpenAI de Didou V2. Ces voix synthétiques ne sont pas présentées comme des prises d'un enseignant.

Premier lot produit : **24 MP3**, environ **142,55 secondes**, reliés aux titres de cours existants. Ils ne couvrent pas encore leurs explications et exercices. [Détails de génération et contrôles](OPENAI-DIDOU-LOT-01.md).

## Couverture mesurée

| Niveau | Cours | Passages fixes recensés, avec répétitions | Passages couverts | Cours ayant au moins un passage enregistré |
|---|---:|---:|---:|---:|
| 1AP | 57 | 2 412 | 24 | 20 |
| 2AP | 61 | 1 519 | 24 | 14 |

Après déduplication entre cours, **3 354 textes distincts**, dont **47 couverts par 46 fichiers** et **3 307 sans correspondance enregistrée complète**. Un texte peut réutiliser plusieurs phrases déjà enregistrées. Un cours ayant un passage enregistré n'est pas considéré comme entièrement couvert.

Le relevé suit les textes fixes des commandes de lecture : entrée, lecture, explications, règles, énoncés, options de quiz 1AP et jeux pédagogiques. Il exclut les retours calculés, les simulations et la navigation. Ce n'est donc pas un taux de couverture de toute parole possible de l'application. Les répétitions entre onglets peuvent correspondre au même texte et au même fichier à produire.

Les **478 fichiers arabes déclarés dans les métadonnées ont une durée positive, existent et correspondent à leur SHA-256**. Cela garantit leur intégrité, pas leur prononciation. Les anciens fichiers du périmètre proviennent des lectures et consignes existantes, auxquels s'ajoutent 24 titres avec Didou. Les autres sons préscolaires ne sont pas substitués à des phrases différentes simplement parce qu'ils concernent la même notion.

## Fichiers livrés

- [couverture.json](couverture.json) : bilan par cours et correspondances enregistrées.
- [ar-manquants.json](ar-manquants.json) : tous les textes sans correspondance, avec noms de fichiers proposés et cours destinataires.
- [openai-lot-01-demande.json](openai-lot-01-demande.json) : demande figée des 24 entrées désormais produites ; les fichiers `lot-01-ar-*` conservent le plan initial.
- [prochain-lot-ar-texte-a-relire.txt](prochain-lot-ar-texte-a-relire.txt) et [son découpage](prochain-lot-ar-decoupage.json) : prochains textes non couverts, à relire avant production.

Le premier lot traite l'entrée des cours ; il ne couvre pas leurs exercices. Les nouveaux noms proposés pour les manquants reposent sur l'empreinte du texte : retirer un texte produit ne renumérote plus tous les autres. La demande de génération d'un lot reste figée avant production.

## Production et validation restantes

1. Relire les textes du premier lot en arabe littéral, compléter ou corriger la vocalisation utile et écrire explicitement les nombres si le moteur les lit mal. Les textes portent `reviewRequired: true` : ils ne sont pas certifiés prêts à prononcer.
2. Produire les prochains MP3 avec la voix cedar de Didou V2, en gardant la correspondance texte/fichier. La clé locale fournie par Karim fonctionne pour ce premier lot ; aucune clé n'est copiée dans le navigateur ou Git.
3. Écouter chaque clip avec un arabophone compétent : bonne phrase, lettres et voyelles, pas de mot coupé, débit compréhensible par un enfant. Les récitations coraniques exigent leur lecteur/récitant approprié, pas un remplacement générique par la voix des consignes.
4. Intégrer les fichiers avec durée, empreinte et texte effectivement prononcé ; ajouter leurs métadonnées à l'index partagé et refaire l'inventaire. Ne pas modifier un texte approuvé pour le faire artificiellement correspondre à un mauvais audio.
5. Tester sur Android sans voix arabe installée, puis en mode avion si l'usage hors connexion est visé. Les contrôles navigateur ne valent pas recette de l'APK ni du cache réel du téléphone.

L'inventaire se régénère depuis `frontend` avec `npm run audio:audit:early`. Ce script produit des fichiers de travail et vérifie les métadonnées arabes ; il n'appelle aucun service payant et ne certifie pas la prononciation.

## Évaluation de ce lot

Exactitude 4/5 : correspondances strictes et empreintes vérifiées, écoute humaine encore requise. Complétude 3/5 : lecteur corrigé et premier lot généré, mais 3 307 textes restent sans MP3. Clarté, possibilité d'action et concision 4/5 chacune : lot raccordé et prochains textes fournis, mais validation pédagogique et production suivantes nécessaires. Moyenne 3,8/5. Priorité : écouter le premier lot avant d'annoncer une couverture complète. L'objectif d'enregistrements pour tous les cours reste ouvert.
