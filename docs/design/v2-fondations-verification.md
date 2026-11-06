# Vérification — consolidation et fondations du jardin

6 novembre 2026. [Spécification des fondations](v2-fondations.md).

## Vérifications et livraison

Références visuelles avant/après en arabe : 360×640, 390×844, 1280×800, accueil et fenêtre des apprentissages. Préférence de mouvement réduit utilisée pour figer les captures ; mouvement et voix vérifiés séparément. Fichiers locaux `foundations-before-*`, `foundations-after-*` et `foundations-comparison.json` dans les artefacts de session.

Comparaison finale sur les imports définitifs : les six captures sont strictement identiques pixel par pixel (accueil et fenêtre des apprentissages, aux trois tailles). Pas de modification des images, des MP3, du texte pédagogique, des XP, des tarifs ou des accès.

40 tests ciblés réussis, incluant économie de données, erreurs et nettoyage audio, clavier et retour de focus. TypeScript réussi. Résultats de la suite complète et du build ajoutés à la fin après exécution.

## Suite du TODO

Prochain lot : clarifier les lieux et rendre la reprise immédiatement visible ; puis réaliser la tranche de référence 5AP maths, son labo et son bilan parent. L'ouverture aux comptes gratuits, les langues et la nouvelle carte des lieux restent des décisions distinctes. Ce travail ne les applique pas implicitement.


### Suite complète finale

250 fichiers / 2 538 tests réussis, deux workers avec pool threads (357,59 s). Les parcours Chromium confirment aussi la présentation vocale welcome → stories → workshop → games, sa fin normale, l'interruption par sélection ou saut, les quatre découvertes, la remise à zéro et l'arrêt des animations selon la préférence système. Aucune erreur JS ni débordement dans ces parcours. Les fichiers MP3 et images existants ne sont pas régénérés.

### Relecture finale

| Axe | Note | Preuve et limite |
|---|---:|---|
| Exactitude | 4/5 | 2 538 tests et parcours Chromium ; appareils Android physiques non testés dans ce lot. |
| Complétude | 4/5 | Les fondations sont utilisées par le jardin ; leur application aux autres écrans est le déploiement suivant. |
| Clarté | 4/5 | Responsabilités voix/focus/dialogue séparées et CSS lisible ; les anciens sélecteurs sont conservés pour la stabilité. |
| Utilité | 4/5 | Composants réutilisables documentés et exemples d'usage ; déploiement distant à confirmer après push. |
| Concision | 4/5 | Logique partagée extraite ; le contrôleur conserve le rendu détaillé du village. |

Moyenne : 4,0/5. Améliorations suivantes : éprouver les fondations sur la tranche 5AP, vérifier les usages sur Android/TalkBack, puis produire les trois nouvelles poses de Didou. L'utilisateur peut contrôler le résultat attendu de ce lot : même rendu et mêmes activités, meilleure base pour étendre le style.


TypeScript final réussi ; build Vite/PWA réussi en 27,06 s, 1 962 entrées précachées. Validation des imports autonomes des composants incluse. Livraison exclusivement sur v2 ; main reste hors intervention. Résultat du déploiement distant à confirmer.
