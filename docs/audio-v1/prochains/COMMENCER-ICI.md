# Prochains enregistrements — préscolaire V1

Ces textes viennent du contenu actuel de l'application. Chaque dossier contient trois textes complets (fr, ar, en) et leurs plans de découpage JSON. Les rapports INTEGRATION dans le dossier parent indiquent quels lots ont déjà été enregistrés et intégrés.

Lots enregistrés dans les trois langues : De 0 à 5, De 6 à 10, Mes Petites Formes, Mes couleurs, Mes Animaux, Mon Corps Merveilleux, Les Quatre Saisons, Jours et mois, Les aliments sains, Mon Petit Monde, Ma Chère Famille. Prochain module : Mon Algérie.

## Commencer par les quatre premiers lots

Nombres de zéro à cinq, nombres de six à dix, formes, puis couleurs. Ensuite suivre les dossiers dans l'ordre. Un MP3 par dossier et par langue permet de contrôler et refaire un petit lot facilement.

## Dans ElevenLabs

1. Ouvrir le fichier `fr-texte-complet.txt`, `ar-texte-complet.txt` ou `en-texte-complet.txt` du lot choisi.
2. Copier uniquement son contenu. Garder les paragraphes et l'ordre, sans ajouter de titre ni de numéro.
3. Utiliser Léa pour le français, Asmaa pour l'arabe et Quentin pour l'anglais, avec les mêmes réglages que les lettres. Débit calme, ton chaleureux, sans musique.
4. Préserver une petite pause entre les paragraphes. Si la limite de l'outil impose plusieurs générations, couper entre deux paragraphes et conserver leur ordre.
5. Nommer le résultat avec le dossier et la langue : par exemple `01-numbers-0-5-fr.mp3`. Pour plusieurs parties : `…-fr-partie-01.mp3`, `…-fr-partie-02.mp3`.
6. Fournir les MP3 pour le découpage et l'intégration. Les JSON servent à repérer les extraits ; ne pas les faire lire par la voix.

Pour l'arabe, conserver les voyelles présentes et écouter les noms des nombres et les accords. Les consignes correspondent aux gestes réels de l'activité : ne pas supprimer les quantités ou les indications « j'ai fini ».

## Lots

| Dossier | Module | Activités | Phrases par langue |
| --- | --- | ---: | ---: |
| 01-numbers-0-5 | De 0 à 5 | 6 | 12 |
| 02-numbers-6-10 | De 6 à 10 | 8 | 16 |
| 03-shapes | Mes Petites Formes | 10 | 20 |
| 04-colors | Mes couleurs | 10 | 20 |
| 05-animals | Mes Animaux | 10 | 20 |
| 06-body | Mon Corps Merveilleux | 8 | 16 |
| 07-seasons | Les Quatre Saisons | 7 | 14 |
| 08-calendar | Jours et mois | 4 | 8 |
| 09-food | Les aliments sains | 7 | 14 |
| 10-world | Mon Petit Monde | 7 | 14 |
| 11-family | Ma Chère Famille | 6 | 12 |
| 12-algeria | Mon Algérie | 8 | 16 |
| 13-islamic-values | Mes valeurs et ma foi | 7 | 14 |
| 14-short-surahs | Mes petites sourates | 7 | 14 |
| 15-emotions | Nos Émotions | 8 | 16 |
| 16-pre-writing | Mes Petits Tracés | 8 | 16 |
| 17-logic-spatial | Logique et espace | 10 | 20 |
| 18-sequences | Qu’est-ce qui vient après ? | 8 | 16 |
| 19-stories | Petites histoires | 3 | 6 |
| 20-art-drawing | Mes dessins | 8 | 16 |
| 21-creative-games | Mes Jeux Créatifs | 8 | 16 |

Total hors lettres : **158 activités, 316 phrases par langue**, soit 948 extraits futurs.

## Mots des cartes et du micro

Le dossier `22-mots-cartes-et-micro` contient 40 mots ou courtes expressions par langue, séparés des consignes. Il inclut aussi les cartes des lettres. Lire chaque paragraphe isolément et laisser une pause nette. Ces extraits demanderont leur propre raccordement dans les composants après réception des voix.

## Périmètre

Le lot des petites sourates contient uniquement les consignes et les félicitations. La récitation Warsh professionnelle déjà utilisée par l'app reste séparée.

Ces exports ne couvrent pas les missions dynamiques des mini-jeux libres, les messages techniques de l'interface ni les cours 1AP–5AP. Les audios des lettres déjà intégrés restent en place. Si un texte de cours change avant l'enregistrement, relancer l'export pour garder le texte et l'activité synchronisés.

Export reproductible depuis frontend : `node --import tsx scripts/export-preschool-recording-texts.ts`.
