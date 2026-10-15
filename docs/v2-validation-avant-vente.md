# V2 — validation avant vente (16 octobre 2026)

## Ce que livre ce lot

1. Observations des ateliers primaire (Studio, bibliothèque, laboratoires et missions qui l'utilisent) : conservation locale + synchronisation authentifiée par compte/enfant et niveau. Préscolaire : nouvelles observations d'activités par langue et missions jardin/marché par langue. Une réponse tardive d'un ancien compte est ignorée. Une panne laisse un état « à réessayer », pas une fausse confirmation de sauvegarde distante.
2. Le carnet parent présente un résumé des sept derniers jours des ateliers, les réussites seul/avec aide/à revoir, trois ateliers prioritaires au maximum, impression et partage volontaire par le parent. Il complète le carnet des cours existant ; les compteurs représentent le dernier essai de chaque activité, pas toutes les tentatives ni une mesure d'acquisition durable.
3. Le dernier reçu reste consultable après fermeture depuis web et Android : en attente, accepté ou refusé, avec motif éventuel. L'accès vient de la validation serveur. Aucun délai de 24 h n'est promis pendant la bêta. Aucun bouton d'achat web n'est ajouté dans le parcours natif.
4. Les cahiers complets et les trois sujets de préparation CEM sont distribués par API avec vérification serveur des droits, réponses non mises en cache publiquement. Le navigateur embarque seulement le premier exercice d'aperçu des cahiers et du premier sujet CEM. Les déblocages gratuits déjà acquis restent consultables. Les droits liés à un abonnement expiré/annulé sont refusés sans attendre la prochaine tâche de déclassement du rôle.
5. Dossier de recette familles et relecture enseignant préparé, sans inventer de retours utilisateurs.

## Limites précises

- La migration V105 et les nouvelles API doivent être déployées sur le backend V2 avant le frontend. Un ancien backend laisse apparaître l'état de synchronisation à réessayer ; les aperçus gratuits restent disponibles, mais pas les documents complets protégés.
- Les anciens historiques préscolaires sans heure exacte restent locaux ; ne pas fabriquer d'événements datés pour les exporter. Les nouvelles observations sont synchronisées et les activités déjà achevées sur un autre appareil sont reconnues. Les badges, séries quotidiennes et événements détaillés préscolaires historiques ne sont pas synchronisés par cette API.
- Les statistiques de cours suivent leur mécanisme existant. La fusion des séances est rendue idempotente et l'import enfant conserve les observations locales plus récentes. Les anciens compteurs agrégés fusionnent par maximum, pas par addition : ne pas les vendre comme comptage exhaustif multi-appareils.
- Les autres aventures/ateliers interactifs restent distribués dans le frontend. Une barrière d'interface ne rend pas leur contenu secret. Ce lot protège les documents complets cités ci-dessus, pas l'ensemble des contenus pédagogiques de l'application.
- Un document déjà reçu, imprimé ou partagé par une famille ne peut pas être rendu impossible à copier.
- Aucun compte de famille réelle, aucun vrai paiement, aucune validation d'enseignant et aucun téléphone Android réel ne sont simulés comme étant validés.
- Aucun déploiement V1/main ni publication Android dans ce lot.

## Ordre de mise en place sur l'environnement de test

- Vérifier que le site V2, le service Render V2 et la base V2 sont distincts de la production V1. Ne pas utiliser de copie des données personnelles de production.
- Backend : profils prod,v2, variables V2_DATABASE_URL / V2_DATABASE_USERNAME / V2_DATABASE_PASSWORD / V2_JWT_SECRET / V2_CORS_ALLOWED_ORIGINS dédiées. Le garde de démarrage reconnaît maintenant une même base malgré les différences de préfixe JDBC, identifiants ou paramètres de connexion.
- Déployer le backend V2 avec V105 ; vérifier démarrage/migrations sur la base V2, puis déployer le site V2 avec VITE_V2_SPRING_BOOT_URL pointant vers son API.
- Vérifier les deux services depuis un compte de test gratuit, un compte Premium de test et deux profils enfants. Aucun justificatif bancaire réel dans les captures ou fiches de recette.
- Exécuter les scénarios des deux documents de recette ; décider seulement ensuite d'ouvrir la vente.

## Maintenance des documents protégés

Les sources complètes sont dans frontend/content-authoring, hors imports de l'application. Depuis frontend : exécuter npm run content:export après modification (script scripts/export-cahiers.ts). Il génère les JSON backend et les aperçus frontend. Le test contentDistribution vérifie leur égalité avec les sources. Aucun fichier complet ne doit être recopié dans public ou dist.

## Décision de lancement

Ne pas annoncer « prêt pour la vente » sur la seule base des tests automatiques. Fermer les anomalies de perte/mélange de progrès, d'accès indu ou de paiement ; obtenir la recette sur deux appareils et la relecture des contenus. Conserver les tarifs et quotas actuels. Aucune promesse de 25 % de conversion n'est justifiée sans observations de familles.

## Contrôles effectués dans ce lot

- Backend hors intégration PostgreSQL : 233 tests réussis, puis 30 contrôles ciblés réussis après les régressions ajoutées (ne pas additionner ces deux nombres, les périmètres se recouvrent).
- Navigateur simulé mobile : quatre scénarios Studio existants et trois nouveaux parcours (reprise dans un autre navigateur, absence de mélange de comptes, coupure réseau/reprise, bilan parent et impression, séparation de deux enfants sur un appareil).
- Contrôle visuel du bilan à 360 px et vérification des passages CEM protégés absents du JavaScript de production.
- TypeScript, build web, PWA et serveur compilés.
- Les deux tests Spring nécessitant une base PostgreSQL ont échoué au démarrage faute de base locale sur localhost:5432 ; ils ne sont pas présentés comme validés. Docker local indisponible. Aucune base distante n’a été utilisée.
- La suite frontend complète sur le code figé est consignée dans frontend/build/v2-readiness-unit-frozen.log (artefact local ignoré par Git).

### Résultat final

- Suite frontend générale : 211 fichiers / 2 279 tests réussis sur le lot figé.
- Le dernier scénario multi-enfants a ensuite révélé une remise à zéro du propriétaire actif par une mise à jour du compte parent. Correctif appliqué dans AuthService ; 42 tests ciblés (dont deux nouvelles régressions) et les trois nouveaux scénarios navigateur réussissent après ce correctif.
- Les tests navigateur utilisent des API simulées. Ils ne remplacent pas une recette avec le backend PostgreSQL V2 et deux appareils physiques.
- TypeScript et build web/PWA/serveur réussis après le dernier correctif. Main est inchangée. Lot destiné à la branche v2 ; déploiement hébergé et migration V105 à vérifier séparément.
