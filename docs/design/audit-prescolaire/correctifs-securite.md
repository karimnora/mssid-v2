# Suite de l’audit validé — 8 novembre 2026

Branche v2 uniquement. Audit initial commité dans `a79bbb2`. Aucun push. Ce document distingue les corrections techniques des validations humaines encore nécessaires.

## Sauvegardes et propriétaires

L’inventaire reproductible `storage-inventory.json` recense les appels effectifs et conserve les expressions des clés calculées ; le nombre d’appels n’est pas un nombre de clés distinctes. Commande : `node frontend/scripts/audit-local-storage.cjs`. Périmètre : sources exécutées `frontend/src`, hors tests ; aucune utilisation dans les fichiers JS/HTML de `frontend/public` lors de la recherche complémentaire.

| Famille | Décision |
|---|---|
| `mssid_game_levels`, `mssid_learning_games_v1`, `mssid_missions_v1` | Nouvelle clé suffixée par `guest`, `user:N` ou `user:N:child:M`. Étoiles et reçus XP restent ensemble. |
| `mssid_discovered_wilayas`, `mssid_completed_expeditions` | Même isolation ; les états transitoires sont remontés à neuf lors du changement de profil. |
| `mssid_daily_objective`, `mssid.cemRewarded` | Compteur et reçu propres au profil actif. |
| `mssid_exam_plan_v1` | Identifiant du propriétaire + classe ; le prénom n’est plus une identité. Les anciennes clés par prénom sont conservées mais jamais attribuées automatiquement. |
| Récompenses de quiz et dernière activité | Les compartiments déjà identifiés restent valides. Les anciens objets plats restent `legacy-unassigned` ; lire, effacer un profil ou se connecter ne les attribue plus implicitement. |
| Préscolaire : progression, événements, nom, défi, badges | Les clés avaient déjà un propriétaire. L’adoption automatique du travail invité vers tout compte vide est retirée du parcours normal. Les anciens identifiants `child-1` (invité) et `user-N` (compte) sont conservés pour éviter une rupture. |
| Jardin, marché, observations, parcours, missions du jour, carnet familial, traces de labos | Déjà isolés par propriétaire, avec classe/langue lorsque nécessaire. |
| Profil principal et activités locales du compte | Caches de compte/serveur ; les profils enfants ont leurs clés distinctes. Le cache anonyme ne remplace pas les données du compte serveur. La sauvegarde de secours reste une archive, pas une preuve de propriété. |
| Quota Musaidi et synchronisation | Propriétaire de compte, volontairement ; changer d’enfant ne réinitialise pas le quota familial. |
| Thème, langue, son/muet, design, installation PWA, rappel de mise à jour, note, classe de navigation, flags locaux | Réglages de l’appareil, volontairement partagés. Le muet reste immédiatement accessible à l’enfant. |
| Identifiant de profil actif, session connue, onboarding, reçus de développement | Sélecteur/caches de compte ou outils de développement, pas résultats pédagogiques à copier entre enfants. |
| Funnel Premium | Compteurs anonymes agrégés de l’appareil ; ils n’identifient pas un enfant. |

### Reprise prudente

Les anciennes sauvegardes ne sont pas supprimées. Dans le profil, une récupération explicite propose les catégories anonymes disponibles ; le défi parent précède l’attribution au profil affiché. Une destination existante n’est jamais remplacée. Une même catégorie ne peut pas être attribuée ensuite à un deuxième enfant. L’import ne verse aucun XP et conserve les reçus déjà présents. Les archives préscolaires invitées et les anciens plannings par prénom restent conservés ; leur éventuelle reprise nécessite une attribution parent explicite distincte, sans deviner leur propriétaire.

La progression des niveaux réagit au changement de propriétaire ; les callbacks restés ouverts pour l’enfant précédent ne peuvent pas écrire pour le nouveau. Les parties en cours sont fermées lors du changement de profil.

## Observations : les 15 mécaniques

Terminer une activité ne prouve pas une compétence maîtrisée. Les erreurs ne retirent ni points ni progression ; elles empêchent seulement l’étiquette « seul ».

| Mécanique | Signal effectivement observé |
|---|---|
| tap_choice | Choix incorrect avant réussite → `done_helped`. |
| sequence | Mauvais élément de suite → `done_helped`. |
| drag_drop | Validation d’une quantité incorrecte → `done_helped`. Le simple déplacement n’est pas une erreur. |
| sorting | Dépôt dans un mauvais bac → `done_helped`. Un dépôt hors bac n’est pas une réponse. |
| connect_dots | Association incorrecte → `done_helped`. |
| memory_cards | Paire non concordante → `done_helped` ; découverte et mémorisation restent encouragées. |
| jigsaw | Pièce déposée dans une autre case → `done_helped`. |
| story_order | Image hors ordre → `done_helped`. L’enregistrement libre de récit n’évalue pas la langue de l’enfant. |
| listen_tap | Mode question : choix incorrect → `done_helped`. Mode écoute libre : `explored`. |
| trace | Tracé tolérant → `explored`, pas une certification d’écriture. Une tentative insuffisante reste une tentative. |
| find_path | Parcours permissif → `explored`. |
| maze | Passage par des repères, sans évaluation des murs → `explored`. |
| coloring | Participation libre → `explored`. |
| creative_extra | Participation libre → `explored`. |
| quran_listen | Écoute terminée → `explored`, jamais une mesure de mémorisation/récitation. |

Le conseil parent consulté marque l’accompagnement. Réécouter la consigne ordinaire ne pénalise pas l’enfant. `done_helped` et `explored` gardent la fin d’activité et les parcours débloqués. Les observations synchronisées ne transforment plus une exploration en autonomie. Les mesures historiques produites avant ce correctif ne peuvent pas être certifiées rétrospectivement. Le carnet parent préscolaire reste désactivé par défaut.

## Audio

29 phrases arabes uniques, 1 874 caractères, réutilisées par 48 activités. Voix Didou Nova synthétique, modèle `gpt-4o-mini-tts`, lot borné ; aucun texte religieux. Les fichiers déjà présents sont réutilisés, les métadonnées sont sauvegardées après chaque réponse et les WAV sont archivés hors dépôt avant compression MP3 mono. Le lot compressé pèse environ 1,58 Mo. Les données de provenance et les empreintes sont dans `audio-didou-review.json`.

**À écouter humainement** : ouvrir `ecoute-didou.html`. Les contrôles de décodage et de non-silence ne valident pas la prononciation. Le nouvel inventaire indique 0 phrase arabe sans fichier dans le périmètre audité, mais cela n’équivaut pas à 100 % de validation humaine.

**Bloquant pour les deux activités religieuses** : les anciennes Basmala/Hamdala viennent d’ElevenLabs. Elles sont bloquées dans le lecteur préscolaire, avec un message d’accompagnement, sans secours par la voix du téléphone. Voir `enregistrements-humains-a-preparer.md` : quatre fichiers arabes prioritaires, douze fichiers au total avec les consignes FR/EN. La Fatiha et Al-Ikhlas utilisent des fichiers de récitation via `useQuranRecitation`, avec un secours audio et aucun TTS ; leur relecture à l’écoute reste à confirmer.

Le lot ne prétend donc pas clore l’obligation « 100 % des consignes avec audio » tant que les enregistrements humains des deux activités et l’écoute des nouvelles voix ne sont pas validés. Les 29 phrases françaises et 29 anglaises manquantes ne font pas partie de la génération arabe autorisée.

## Accessibilité et protection parent

Les commandes préscolaires sont portées à un minimum de 60 × 60 px, y compris muet, palettes, outils, contrôles de jeux et actions secondaires du jardin/marché. Les grilles d’outils sont adaptées ; les rangées d’instruments gardent leurs touches de 60 px et deviennent défilables lorsque nécessaire. Les ratios de progression sont isolés en LTR dans l’interface RTL. La mascotte respecte le mouvement réduit du système, sans remplacer son illustration dans ce lot.

Premier choix de langue et changement ultérieur : défi parent. Le muet reste une commande directe. Jardin/marché : découverte gratuite rejouable, deux suites désactivées sans droit Premium, pas de prix ni de paiement dans les activités. L’offre générale reste derrière `ParentGateModal`. L’observation manuelle de l’adulte utilise déjà `ParentGateButton`. Le contrôle de droits serveur reste nécessaire : le défi parent n’est pas une autorisation d’abonnement.

## Validation

- Suite complète sur une copie figée du lot, base `a79bbb2` : **264 fichiers, 2 607 tests réussis**, 548 secondes. Cette copie exclut les modifications simultanées du tuteur Musaidi.
- Après les derniers garde-fous de callbacks et la conservation d’une tentative avant abandon : **39 fichiers, 189 tests ciblés réussis** sur le worktree v2 courant (préscolaire, profils, jeux, missions, expéditions, carte, tuteur).
- Vérification TypeScript PowerShell : réussie. `npm run build` : réussi, y compris Vite, service worker et serveur. Les avertissements de taille de certains chunks restent présents ; aucune erreur de compilation.
- Captures arabes et interactions : voir `verification-visuelle.md` (360×640, 390×844, 1280×800, dessin, musique, protection du réglage de langue).
- Dry run du lot audio après intégration : **29 réutilisées, 0 à générer**. Pas de second appel payant.
- Backend non modifié par ce lot ; ses tests n’ont pas été relancés pour ces changements frontend. D’autres changements du backend présents dans le worktree appartiennent à un autre travail et sont exclus du commit.

Pas de test avec de vrais enfants, pas de validation religieuse ou linguistique inventée. Priorité 5AP conservée ; aucune nouvelle aventure ni nouvelle offre commerciale.
