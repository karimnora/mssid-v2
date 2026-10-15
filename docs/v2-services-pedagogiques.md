# Studio familial V2 : contenu et validation

> Mise à jour du 16 octobre 2026 : la synchronisation des nouvelles observations, le bilan parent et la distribution serveur des cahiers/sujets CEM sont implémentés dans le lot décrit dans [Validation avant vente](v2-validation-avant-vente.md). Leur mise en service exige le backend V2 et la migration V105. Les autres ateliers interactifs restent distribués dans le frontend. Les mentions de stockage seulement local ci-dessous décrivent les étapes antérieures.


## Services livrés

Entrée : Outils → Parcours famille et cahiers A4 (`/labs/cahiers_lab?g=1AP`). Onglets 1AP à 5AP. Version arabe et française de l’interface ; les activités de langue gardent leur langue d’apprentissage.

- Vacances : 4 semaines, 5 rendez-vous par semaine. Phases de découverte, pratique, rappel et transfert. Les rappels répètent volontairement certaines activités ; il ne s’agit pas de 20 sujets inédits. Repère de 15 minutes ; les rédactions longues peuvent être poursuivies plus tard. Défis sans écran.
- Rentrée : acquis du niveau précédent, diagnostic et adaptation explicite. Pour entrer en 1AP : comptage concret, récit oral et tracés, sans exiger de lecture.
- Semaine guidée : priorités issues des essais à reprendre, des réponses avec aide et du suivi de compétences existant. Un programme sans observation est un parcours de départ. Le bouton Adapter fige la nouvelle semaine ; enregistrer un résultat ne déplace pas la séance en cours.
- Évaluations : choix d’une notion déjà étudiée et de 3, 5 ou 7 jours. Les trois premiers jours ciblent des exercices différents ; les jours suivants consolident par rappel et réutilisation. Aucun pronostic de note ni sujet officiel revendiqué.

## Contenu

33 modules, 99 exercices originaux avec consigne, indice, réponse et démarche expliquée, plus 3 activités de préparation à la 1AP.

| Niveau | Domaines |
| --- | --- |
| 1AP / 2AP | Nombres, calcul/problèmes, mesures, compréhension arabe, écriture arabe |
| 3AP / 4AP | Les mêmes domaines + français et anglais |
| 5AP | Les mêmes domaines + fractions/décimaux et proportionnalité/pourcentages |

La couverture constitue un ensemble ciblé de révisions ; elle ne remplace pas l’intégralité du programme scolaire. Références de compétences existantes pour 1AP, 2AP et 5AP ; diagnostic des activités pour les autres domaines. L’activité française/anglaise peut bénéficier d’une explication orale par le parent.

Les résultats numériques sont vérifiés, y compris chiffres arabes et virgule décimale. Les productions et réponses ouvertes sont observées par le parent à l’aide de critères : réussi seul, avec aide, à reprendre. Aucune note automatique inventée ; une réussite n’est jamais présentée comme une maîtrise durable.

## Laboratoires

- Marché de Didou : panier manipulable, calcul du total puis de la monnaie. Montants gradués de 1AP à 5AP ; exemple concret en DA, démarche et vérification. Les résultats de calcul alimentent les priorités des domaines correspondants.
- Aventure du lecteur : 5 récits originaux en arabe ; informations explicites, inférence et justification par les indices du texte. Trois étapes à choix, distracteurs et nouvelle tentative. Les réponses ouvertes équivalentes restent acceptables dans les cahiers.
- Atelier des ombres : prédire, changer un seul facteur, comparer et expliquer. Modèle géométrique de lumière parallèle, poteau vertical et sol plat : longueur = hauteur / tan(angle). Cette formule calcule la simulation et n’est pas une connaissance exigée de l’enfant. En 1AP/2AP : plus court/plus long ; aux niveaux suivants, lecture des mesures. Aucune observation réelle ni preuve expérimentale simulée présentée comme réelle.

Chaque laboratoire possède un mode interactif et un mode histoire (contexte narratif, mêmes objectifs et retours explicatifs). Pas de microphone ou de correction vocale automatique annoncé.

## Accès, sauvegarde et impressions

- Toutes les durées Premium contiennent les mêmes services.
- Un exercice par séance et première mission par laboratoire en découverte. Le diagnostic est gratuit. Les séances et missions complètes et leurs impressions nécessitent un accès Premium confirmé par l’API ; une erreur réseau ne déverrouille pas le contenu.
- Observations propres au compte, à l’enfant actif et au niveau dans le stockage local de cet appareil. Pas de promesse de synchronisation entre appareils. Une erreur de sauvegarde est signalée.
- Impression A4 du sujet ou du corrigé, regroupement des séances courtes et corrigés sans doublons, place pour écrire et site mssid-dz.com en pied de page. Les rédactions longues ont plus d’espace. Dialogue accessible, fermeture Échap et restitution du focus.
- Le quota serveur de 3 cahiers gratuits et les accès des fiches existantes restent inchangés.

## Fondement pédagogique et limites avant vente

La conception utilise des objectifs explicites, un essai avant corrigé, un retour actionnable et une réflexion sur la méthode. Repères de conception : [EEF — feedback](https://educationendowmentfoundation.org.uk/education-evidence/guidance-reports/feedback) et [EEF — métacognition](https://educationendowmentfoundation.org.uk/education-evidence/guidance-reports/metacognition). Ces références ne valident ni le contenu algérien ni une efficacité mesurée de cette application.

Avant vente générale : relecture par un enseignant algérien pour niveau et formulation, essais Android réels (dont impression WebView), migration PostgreSQL V2 et paiement, distribution serveur protégée du contenu payant (les données sont actuellement dans les fichiers frontend). Aucun déploiement main ou production réalisé.
