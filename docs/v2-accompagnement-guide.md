# Accompagnement guidé V2 — pilote maths 1AP / 2AP

L’aide enfant est préparée dans MSSID, gratuite et sans appel à une IA externe. Elle remplace la conversation Gemini dans le parcours V2. Les routes enfant Gemini et leur quota ne sont pas enregistrés lorsque le backend utilise le profil `v2`. Les profils historiques conservent leur comportement.

**« مساعدي » (3 novembre 2026).** L'aide comporte deux onglets :

- **« أسئلة السنة » :** toutes les questions corrigées du catalogue publié, filtrées par niveau, matière, trimestre et leçon, avec une recherche par mot-clé.
- **« طريقة موجّهة » :** les méthodes guidées de mathématiques de 1AP et 2AP, inchangées.

Pour chaque question :

- l'indice et la règle de la leçon sont gratuits sans limite ;
- la correction détaillée est limitée à 3 par jour pour un compte gratuit, et illimitée en Premium ;
- rouvrir une correction déjà vue le jour même ne compte pas.

Cette règle remplace l'ancienne « aide gratuite sans restriction » pour les corrections détaillées.

## Contenu livré

20 compétences : 12 en 1AP et 8 en 2AP. Chaque fiche contient trois indices progressifs, une méthode en trois étapes et un exemple interactif corrigé, en français et en arabe. Les exemples des premières leçons de 1AP restent dans leur plage de nombres. La lecture vocale utilise le mécanisme de synthèse existant, selon les voix disponibles sur l’appareil.

L’aide apparaît près des questions et des exercices des cours de maths couverts. Le lien de compétence de la question est prioritaire ; une compétence étrangère ne reçoit aucune aide incorrectement attribuée. En l’absence de lien au niveau de la question, l’enfant choisit parmi les notions du cours. Aucun diagnostic individuel n’est inventé.

Le bouton d’accompagnement permet aussi de choisir le niveau et la notion, puis de revoir le cours associé. Les niveaux 3AP–5AP affichent clairement la limite du pilote ; ils peuvent revoir les bases de 1AP–2AP.

L’exemple est un entraînement séparé : aucun point, aucune validation de cours, aucune réponse au quiz enregistrée. L’aide n’est pas ajoutée aux évaluations distinctes. Il n’y a aucune nouvelle restriction payante.

## Validation et suite

Tests ciblés : couverture des compétences, contenu bilingue, limites de contexte, calculs, absence de requêtes AI, retries, navigation, séparation des réponses réelles, profil backend V2 et parcours mobile FR/AR avec audit d’accessibilité.

Une relecture par un enseignant et un essai sur un appareil Android réel restent nécessaires avant publication. La couverture de compétences existantes ne constitue pas une certification de conformité au programme officiel. Le pilote ne fournit pas de conversation libre, d’analyse automatique des erreurs ni de synchronisation nouvelle entre appareils. L’extension 3AP–5AP et les autres matières constituent les prochaines étapes.

Résultats de cette étape : 43 tests frontend ciblés, 17 tests backend et 2 parcours mobiles FR/AR réussis. Audit WCAG 2 A/AA du dialogue sans violation détectée. Les essais mobiles utilisent la préférence d’animations réduites. Compilation frontend et vérification TypeScript réussies. Aucun test sur Android physique ni validation enseignant effectué à cette étape.
