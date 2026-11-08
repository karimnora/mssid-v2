# Audit du préscolaire : contenu, qualité et modèle gratuit/Premium

Date : 8 novembre 2026. Périmètre : V2 locale, catalogue et composants présents après `58dee9d`. Analyse des données réellement importées, des règles de progression, des accès et d’un échantillon visuel en arabe à 390×844. Aucune activité, règle d’accès ou voix modifiée. Ce rapport n’est pas une validation pédagogique par observation d’enfants, ni une certification du programme officiel.

## Recommandation

Conserver le socle actuel gratuitement et sans quota artificiel de parties. Ne pas créer maintenant un abonnement préscolaire séparé. Réserver à terme aux offres familiales Premium de nouvelles aventures guidées, une progression mieux construite et un accompagnement parent fiable. Ne pas mettre derrière un cadenas la qualité de la voix, l’accessibilité, la sécurité ou les contenus déjà ouverts.

Le préscolaire est assez fourni pour une bonne porte d’entrée dans MSSID. En revanche, son homogénéité visuelle et la précision de son suivi ne justifient pas encore, à elles seules, une promesse commerciale de suivi personnalisé Premium. Corriger ces points apporte plus de valeur que doubler le nombre de fiches.

« 100 % gratuit » signifie que tout le préscolaire reste gratuit. « Freemium » signifie un socle gratuit avec des suppléments payants. L’état actuel est déjà proche du second : catalogue largement gratuit, mais suites des missions du jardin et du marché réservées au Premium.

## 1. Quantité réellement disponible

| Élément | Quantité vérifiée | Ce que le nombre signifie |
|---|---:|---|
| Modules du catalogue principal | 32 | Modules publiés dans `PRESCHOOL_MODULES` |
| Activités | 248 | 248 identifiants distincts, pas 744 activités différentes |
| Langues | 3 | Arabe, français et anglais : versions localisées du même socle |
| Mécaniques d’activité | 15 | Choisir, compter/déplacer, tracer, trier, associer, écouter, mémoriser, suites, histoires, etc. |
| Jeux du hub | 8 | Jeux indépendants du catalogue d’activités |
| Niveaux des huit jeux | 68 | Nombre déclaré et retrouvé dans les tableaux de niveaux ; pas 68 compétences évaluées |
| Fiches imprimables | 83 par langue | Modèles localisés ; ne pas les additionner aux activités comme du contenu entièrement nouveau |
| Modèles du tableau de tracé | 70 | Modèles techniques, dont des notions déjà présentes ailleurs |
| Boîte à sons | 25 cartes | Présence dans le catalogue, pas validation à l’écoute de chaque son |
| Musique | 9 comptines déclarées | Plus piano, instruments et percussions ; pas neuf nouvelles leçons |
| Missions du jardin et du marché | 2 missions en plus | Trois séances de deux défis chacune ; découverte ouverte, suite Premium |

Répartition visible dans l’interface : lettres/nombres/formes 82 activités ; sciences/monde 55 ; famille/valeurs 54 ; graphisme/créativité 57. Total : 248.

Les huit jeux : ville 10 niveaux, ferme 14, ballons 8, panier gourmand 8, formes 8, habillage 8, pêche 8, puzzle 4. Les cadenas de niveaux concernent la progression dans ces jeux, pas un achat de chaque niveau.

Fiches papier : graphisme 8, lettres 28, chiffres 16, logique 16, motricité 3, coloriage 12.

Points de profondeur : 42 activités de lettres, mais pas 42 lettres ; 19 activités de tracé, dont neuf tracés de lettres ; 12 activités de remise en ordre d’histoires à trois images, pas 12 albums narrés complets. Il ne faut pas transformer ces nombres en promesses d’heures d’apprentissage ou de maîtrise.

## 2. Qualité : ce qui est solide

- Les thèmes couvrent un large éveil : nombres jusqu’à 10, lettres, formes, couleurs, repérage spatial, corps, saisons, famille, émotions, Algérie, valeurs, créativité. Cohérence générale avec le référentiel interne ; conformité officielle détaillée non établie ici.
- Quinze mécaniques sont effectivement présentes. Le catalogue ne se limite donc pas à des QCM. Le choix d’image domine toutefois : 90 activités sur 248, soit environ 36 %.
- Les grandes cartes d’activité sont compréhensibles, les jeux comportent des niveaux, les réponses peuvent être réessayées. Les activités du parcours peuvent être ouvertes sans achat individuel.
- Le guidage audio a une base réelle : 200 activités disposent d’une consigne et d’un retour de réussite enregistrés pour chacune des trois langues, avec fichiers trouvés sur disque.
- Le tracé distingue tentative et tracé suffisamment couvert au lieu de valider tout gribouillage. Ce seuil reste une tolérance de jeu, pas une évaluation d’écriture scolaire.
- Les fiches papier et ateliers créatifs permettent une continuité hors écran. Les missions jardin/marché distinguent des réponses vérifiées par le jeu et des observations avec un adulte : c’est une piste intéressante pour le Premium.

## 3. Défauts prioritaires observés

### P0 — Séparer les niveaux de jeux par enfant

`useLevelProgress.ts` utilise la clé commune `mssid_game_levels`, puis l’identifiant du jeu. Aucun identifiant de profil n’entre dans cette clé. Les étoiles/niveaux des huit jeux ne sont donc pas correctement individualisés entre enfants sur le même navigateur. Ce problème concerne ces niveaux de jeux ; le catalogue principal utilise, lui, des propriétaires de progression séparés et des snapshots.

Avant de vendre une promesse familiale de suivi individuel, isoler ces sauvegardes, prévoir la reprise prudente des anciennes données et vérifier le changement de profil. Ne pas attribuer automatiquement des étoiles historiques communes à tous les enfants.

### P0 — Ne pas interpréter une réussite finale comme une réussite autonome

Dans `PreschoolTapChoice`, une erreur produit un retour visuel/sonore mais n’est pas transmise au parent orchestrateur. La réussite appelle ensuite `onComplete()` sans préciser les essais antérieurs. `PreschoolActivityPlayer` prend alors la valeur par défaut `done`, et `PreschoolApp` l’enregistre dans le snapshot comme `independent`.

Conséquence : réussir après plusieurs erreurs peut être classé comme indépendant. Ce chemin est établi par lecture du code ; une reproduction dédiée doit accompagner le correctif. Conserver « activité terminée » est légitime, mais cela ne prouve pas « seul, du premier coup ». Préserver les acquis existants sans inventer rétrospectivement une autonomie non observée.

Le carnet différencie déjà découverte, plusieurs passages, aide et essai. Il n’établit pas pour autant une acquisition durable. Deux passages de la même activité ne constituent pas un test de transfert ou de mémorisation à distance.

### P1 — Fermer les manques d’audio de façon économique

Après vérification du fichier explicite ET de la recherche d’enregistrement partagé utilisée à l’exécution :

| Langue | Activités avec consigne + réussite enregistrées | Activités dépendant encore de la synthèse locale |
|---|---:|---:|
| Arabe | 200 / 248 | 48 |
| Français | 200 / 248 | 48 |
| Anglais | 200 / 248 | 48 |

Les 48 sont les trois modules découverte (12 activités) et les six modules exploration (36). Ce ne sont pas forcément des activités silencieuses : la synthèse du téléphone prend le relais, avec une qualité et une disponibilité variables.

Par langue, les 96 références manquantes (consigne + réussite) correspondent à seulement 29 phrases distinctes. Préparer d’abord ces 29 phrases arabes, vérifier les réemplois possibles et l’écoute humaine, puis traiter les autres langues si elles sont prioritaires. Les trois langues représentent 87 textes distincts, pas 288 fichiers différents à produire. Aucune génération payante n’a été lancée dans cet audit. La présence des fichiers existants ne valide pas leur prononciation, leur énergie ou les récitations à l’écoute.

Le micro proposé à certains endroits sert à enregistrer et réécouter. Ce n’est pas une analyse automatique fiable de prononciation ni une conversation intelligente avec Didou.

### P1 — Didou et présentation encore hétérogènes

`PreschoolMascot` affiche encore 🦊 et porte un libellé « Amine the Fennec ». Ce n’est pas le Didou illustré du village avec son foulard vert et son étoile rouge. L’écran d’accueil observé affiche également ce renard emoji alors que le texte parle de Didou.

La bonne direction est une identité constante : même personnage, mêmes réactions et même voix courte contextuelle. Il faut évaluer séparément la qualité des illustrations des différentes activités ; cet audit visuel ne couvre pas chaque jeu.

### P1 — Navigation non lectrice et petit téléphone

Sur l’échantillon 390×844, le défi quotidien et les accès d’impression prennent beaucoup de place avant les trois destinations. « Apprendre » et « Jouer » demandent du défilement. L’impression est proposée deux fois sur l’accueil. Pour 3–5 ans, montrer d’abord trois grandes destinations visuelles et vocalisées ; déplacer la gestion des fiches vers l’espace adulte.

Certaines commandes de navigation/réécoute et de protection parent sont codées avec une cible minimale de 48 px (`min-h-12/min-w-12`), sous la règle interne de 60 px. Ne pas confondre ces petites commandes avec les grosses réponses bien plus larges.

Sur l’écran arabe des domaines, les fractions de progression ne sont pas isolées en LTR : `0 / 82` est visuellement ambigu/inversé. Corriger l’affichage des nombres. Les dégradés clairs avec texte blanc demandent une vérification de contraste.

Le composant `PreschoolMascot` ne consulte pas la préférence de mouvement réduit. Vérifier ce point sur les autres composants animés avant de conclure à une conformité globale.

### P2 — Progression pédagogique trop linéaire

Les données principales n’exposent pas de palier d’âge/difficulté. `suggestNextActivity` propose la première activité non terminée, en privilégiant le dernier module visité. C’est une reprise de navigation utile, pas une adaptation pédagogique générale. Certains jeux ont bien leur propre progression en niveaux.

Structurer des parcours indicatifs 3, 4 et 5 ans, validés par un enseignant, avec entrée souple selon l’enfant. Réutiliser une notion dans de nouveaux contextes et la revoir plus tard. Ne pas imposer le calendrier, tous les mois ou tous les tracés comme prérequis identiques à trois ans.

### Disponibilité du carnet parent à vérifier

Le carnet existe dans le code mais dépend du drapeau `preschoolParentBilan`, désactivé par défaut dans `featureFlags.ts`. Son activation effective sur un serveur déployé n’a pas été vérifiée. Il n’était pas visible dans l’échantillon local avec API de drapeaux simulée sans surcharge. Ne pas le présenter comme une fonctionnalité universellement disponible avant ce contrôle.

## 4. Gratuit ou payant ?

| Option | Intérêt | Limite | Avis |
|---|---|---|---|
| Tout le préscolaire, y compris toutes les futures créations, gratuit | Adoption et confiance | Aucun revenu direct préscolaire ; budget d’entretien à financer ailleurs | Possible stratégie d’acquisition, pas une garantie de conversion |
| Fermer le catalogue actuel derrière un abonnement | Revenu potentiel immédiat | Frustration, perte de confiance, qualité trop hétérogène pour cette promesse | Déconseillé |
| Socle généreux gratuit + aventures supplémentaires dans Premium famille | Essai réel, confiance et différenciation | Nécessite une vraie qualité des suppléments et un suivi fiable | Recommandé |

Je garderais ouverts : les 248 activités actuelles, les huit jeux et leur progression de base, les fiches déjà ouvertes, les ateliers créatifs, les consignes vocales, l’accessibilité et le suivi élémentaire. Éviter les quotas quotidiens de parties, les consommables payants et les achats présentés directement à l’enfant.

Pour Premium, ajouter de la valeur nouvelle :

1. Aventures scénarisées complètes en plusieurs séances, Didou illustré et voix cohérente, gestes réutilisés dans des situations différentes.
2. Parcours mieux construits par âge/besoin, avec retour sur les difficultés observées et situations de transfert.
3. Bilan parent avancé fiable : ce qui a été essayé, avec quelle aide, ce qui reste non observé et une activité concrète à proposer ensuite.
4. Nouveaux ensembles écran/papier/vie quotidienne, avec guide parent, distincts des 83 fiches déjà disponibles.

Le jardin et le marché constituent les deux prototypes les plus naturels à améliorer et à valider. Il est inutile de lancer immédiatement dix nouveaux mondes ou des centaines de nouvelles cartes. Leur première séance gratuite doit rester une expérience complète et rejouable, pas une coupure au milieu d’un geste.

L’état actuel comprend déjà deux exceptions au gratuit : la suite du jardin et du marché. Une communication « tout le préscolaire est gratuit » serait donc inexacte sans modifier ces accès. Aucun accès n’est modifié par cet audit.

Conserver les deux offres familiales existantes (900 DA / 3 mois ; 2 400 DA / 12 mois), sans créer une troisième formule préscolaire maintenant. L’intérêt commercial et la volonté de payer ne se déduisent pas du nombre d’activités. Le test familles 5AP ne validera pas à lui seul l’offre pour des enfants de 3–5 ans.

## 5. Repères de marché consultés le 8 novembre 2026

- [Khan Academy Kids](https://en.khanacademy.org/kids) annonce une application entièrement gratuite, sans abonnement : le nombre d’activités seul ne crée donc pas une justification suffisante du paiement.
- [Lingokids Basic](https://help.lingokids.com/hc/en-us/articles/115005840745-Lingokids-Basic-Free-Version) distingue une sélection gratuite et des services/accès Plus. Son quota n’est pas un modèle à recopier mécaniquement pour MSSID.
- [FAQ officielle Adibou](https://wiloki.com/fr/adibou-faq/) présente des achats de modules en une fois et des essais limités. Sa qualité visuelle est une référence possible, mais son modèle n’est pas celui d’un abonnement préscolaire.

Ces exemples montrent plusieurs modèles viables chez des éditeurs différents ; ils ne prouvent ni leur rentabilité pour MSSID ni un taux de conversion en Algérie. Les hypothèses d’acquisition, de retour et de paiement doivent être confrontées à des parents du public ciblé.

## 6. Ordre d’action recommandé

1. Fiabiliser les profils de jeux et les observations d’autonomie avant de vendre le suivi détaillé.
2. Harmoniser Didou, compléter les 29 textes arabes manquants et écouter les voix existantes.
3. Simplifier l’entrée enfant, corriger les petites cibles, le RTL numérique et les mouvements réduits.
4. Faire essayer le socle gratuit à quelques familles préscolaires ; observer l’autonomie réelle et demander ce qui justifierait une dépense.
5. Valider une seule aventure Premium améliorée, incluse dans l’offre familiale, avant d’en produire d’autres.

Maintenir la priorité de développement 5AP déjà décidée. Le préscolaire peut servir de porte d’entrée forte, mais la conversion vers le primaire peut prendre longtemps pour les plus petits : ne pas la compter comme un revenu immédiat acquis.

## 7. Preuves et reproductibilité

- `inventory.json` : quantités, modules, interactions, niveaux, fiches, statuts audio et textes manquants dédupliqués ; empreinte du catalogue.
- Commande depuis `frontend` : `node scripts/audit-preschool-content.cjs`.
- Sources principales : `data/preschool/index.ts`, `types.ts`, `withRecordedAudio.ts`, `gamesHubCatalog.ts`, tableaux `LEVEL_DEFS`, `printablesData.ts`, `PreschoolAsset.tsx`, `PreschoolMascot.tsx`, `PreschoolActivityPlayer.tsx`, `PreschoolTapChoice.tsx`, `PreschoolApp.tsx`, `useLevelProgress.ts`, `preschoolProgress.ts`, `featureFlags.ts` et les accès jardin/marché.
- Contrôles structurels exécutés : 248 ID distincts, totaux cohérents, consignes localisées non vides, une bonne réponse dans les choix contrôlés ; aucune anomalie dans ce périmètre. Présence des fichiers audio contrôlée ; fichiers de récitation non validés à l’écoute.
- Échantillon visuel local : accueil et sélection des domaines en arabe, profil fictif, API simulée. Pas une revue complète des 248 activités ni un test avec enfants. Pas de nouvelle suite de tests, d’appel audio payant, de modification de gameplay ou de push.
