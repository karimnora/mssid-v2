# Design du parcours matière → cours → leçon

Travail local du 12 novembre 2026, V1 sur `main`. Aperçu : `http://127.0.0.1:3100/courses?g=1AP`. Aucun push, déploiement ou activation commerciale.

## Changements

- Le catalogue accueille l'enfant avec une consigne courte et la pose de Didou déjà préparée pour la V2. Les cartes de matières existantes restent utilisées.
- La liste présente la matière, le niveau, le nombre de cours terminés et trois boutons de trimestre. Les libellés arabes ne mélangent plus les deux langues.
- Un raccourci ouvre le premier cours non terminé accessible du trimestre choisi ; si tout est terminé, il propose de revoir un cours. Aucun cours n'est déclaré terminé par ce raccourci.
- Les cartes de cours donnent la priorité au titre, au statut et à l'action. Les résumés sont masqués en 1AP–2AP. La durée uniforme de 15 minutes, non fondée sur une mesure propre à chaque cours, a été retirée.
- Chaque carte possède un vrai bouton, utilisable au clavier. L'écoute reste un bouton séparé pour éviter l'imbrication de contrôles interactifs.
- Le fil de navigation suit la langue de l'interface et occupe moins de place sur téléphone. Le titre de la leçon n'est plus répété visuellement dans ce fil.
- Les titres, surfaces, espacements, boutons et étapes des leçons sont harmonisés avec l'accueil. Les étapes sont formulées avec des verbes courts : comprendre, retenir, essayer, s'entraîner, résoudre seul, se tester.
- L'étape active est identifiée pour les technologies d'assistance. Les étapes précédentes ne portent plus une coche pouvant faire croire que l'exercice est validé simplement parce qu'on a navigué.
- Les compteurs et les informations de l'en-tête utilisent les couleurs du thème ; la navigation et les cartes respectent la réduction des animations.

Les contenus des cours restent dans leur langue d'enseignement. La traduction du cadre de navigation ne traduit pas les exercices. Le fonctionnement existant du compte gratuit et de l'accès invité est conservé ; les cadenas d'un invité ouvrent l'inscription gratuite déjà présente dans l'application.

## Vérification et captures

Résultats sur la version finale :

- **41 tests de composants réussis**, sur cinq fichiers : accueil, choix des cours, lecteur de leçon, navigation de bas de leçon et parcours pédagogiques pilotes. Les contrôles de confirmation avant sortie d'un quiz en cours sont conservés.
- **9 scénarios Chromium réussis** : cinq parcours de navigation 1AP–5AP et quatre parcours complets des deux pilotes, avec erreur, indice, nouvel essai et transfert.
- **TypeScript complet réussi**, avec une limite mémoire Node de 6 Go et un cache incrémental dans `tmp/`.
- **`git diff --check` réussi**. Les avertissements de conversion LF/CRLF reflètent la configuration Git Windows.
- Les contrôles Axe ciblés ne signalent plus de violation automatique après correction de deux textes trop pâles de l'en-tête de leçon.

Le banc local intercepte les API avec des réponses sans compte et utilise uniquement des profils invités fictifs. Les avertissements `Window.scrollTo` de jsdom apparaissent dans certains tests de composants ; le défilement et la navigation sont également exercés dans Chromium.

Les captures sont dans `output/course-design-preview/` : pour chaque niveau de 1AP à 5AP, catalogue des matières, liste des cours et première leçon. Configurations : 1AP arabe à 320 px, 2AP français à 390 px, 3AP arabe à 768 px, 4AP arabe sombre à 390 px et 5AP français à 1440 px.

Le test navigateur vérifie le changement de trimestre, le raccourci de cours, l'ouverture au clavier en 3AP, le retour à la liste, l'absence de débordement et d'erreur JavaScript. Axe contrôle la liste des cours et, en 4AP–5AP, l'en-tête de leçon et ses étapes. Il ne s'agit pas d'une certification de toute l'application.

## Limites et suite

- Tests Android physique et lecture vocale réelle à faire avec Karim.
- Pas de mesure de vitesse avant/après ; les animations ont été limitées mais aucun gain de performance chiffré n'est revendiqué.
- Pas de réécriture complète des cours, des quiz ou de leurs résultats dans ce lot. Les deux missions pédagogiques restent les pilotes à tester avec des enfants.
- L'espace parent et les écrans commerciaux V2 ne sont pas importés.
- Les essais avec un compte gratuit connecté et la sauvegarde serveur multi-appareils restent une recette distincte.

## Relecture

| Axe | Note | Éléments et limite |
|---|---|---|
| Exactitude | 4/5 | Titres et statuts issus des données réelles ; validation terrain absente |
| Couverture | 4/5 | Parcours des cinq niveaux et deux pilotes ; quiz/résultats hors de ce lot |
| Clarté | 4/5 | Actions courtes, hiérarchie simplifiée ; préférence et compréhension à confirmer avec les familles |
| Caractère opérationnel | 4/5 | Aperçu local et captures ; aucun appareil physique ni publication |
| Concision | 4/5 | Composants de cartes et navigation simplifiés ; styles dédiés nécessaires pour le mobile et les thèmes |

L'avis de Karim et l'observation d'enfants restent nécessaires avant extension. Aucun feu vert de publication n'a été donné.
