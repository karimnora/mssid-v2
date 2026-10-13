# Réduire le calcul Neon au repos — V1

## Comportement

- `GET /api/health` vérifie que le backend répond. Il ne prend aucune connexion et n'exécute aucune requête SQL. Render doit continuer à utiliser ce chemin pour ses sondes fréquentes.
- `GET /api/health/database` exécute le diagnostic SQL uniquement sur demande. Une authentification avec le rôle `ADMIN` est nécessaire ; cet endpoint ne doit pas être utilisé par une sonde périodique. Il renvoie 503 si la base est inaccessible, sans exposer les détails de connexion.
- En profil `prod`, Hikari ne maintient aucune connexion inactive minimale, libère les connexions inutilisées après environ 60 à 90 secondes et désactive les pings de maintien en vie. Les connexions utilisées ne sont pas interrompues par ce délai d'inactivité.
- Flyway reste activé et Hibernate reste en `ddl-auto=validate` : un problème de base ou de schéma au démarrage fait toujours échouer le démarrage. Le nouveau contrôle du serveur ne remplace pas ces vérifications.

## Application en production

1. Publier les changements de V1 sur `main`, puis redéployer le **backend Render** concerné. Un déploiement frontend Vercel ou une mise à jour Android ne suffit pas et n'est pas nécessaire pour ce correctif backend.
2. Dans Render, confirmer `SPRING_PROFILES_ACTIVE=prod` et conserver le chemin de health check `/api/health`.
3. Vérifier qu'aucune variable Render `SPRING_DATASOURCE_HIKARI_*` ne remplace les valeurs de ce correctif : minimum idle 0, idle timeout 60000 ms, keepalive time 0. Ne pas ajouter de ping automatique à `/api/health/database`.
4. Vérifier une opération réelle de l'application utilisant la base, puis laisser une fenêtre de 10 à 15 minutes sans activité SQL. Fermer les outils SQL et vérifier qu'aucun autre backend, environnement de test, monitor ou traitement ne sollicite la même base.
5. Dans Neon, vérifier que le compute passe à l'état suspendu/idle, puis confirmer la reprise sur une nouvelle opération réelle. Le contrôle `/api/health` seul doit rester disponible sans réveiller Neon.

Les connexions locales et les tâches quotidiennes peuvent encore réveiller la base. Une activité réelle continue empêchera normalement la mise en veille. Les CU-heures déjà consommées ne sont pas récupérées ; ce correctif vise à limiter la consommation future au repos.

La mise en veille effective et l'économie obtenue doivent être mesurées dans Neon après déploiement. Les tests locaux valident les sondes sans SQL, la protection du diagnostic et les erreurs de base ; ils n'émulent pas le service Neon.

## Références

- [Render : health checks](https://render.com/docs/health-checks)
- [Neon : scale to zero](https://neon.com/docs/introduction/scale-to-zero)
- [HikariCP : paramètres du pool](https://github.com/brettwooldridge/HikariCP)
