# 🆘 Runbook — Sauvegarde, restauration et rollback (Mssid DZ)

> Répond au point RGPD/DevOps de l'audit pré-prod : "Aucun APM, aucune alerte, aucun runbook
> de rollback. Les backups Neon / PITR ne sont pas dans le dépôt." Ce document ne remplace pas
> une vérification manuelle dans les dashboards Neon/Render — il donne la procédure exacte à
> suivre, et personne d'autre que toi n'a les identifiants pour le faire.

---

## 1. Vérifier le PITR (Point-In-Time Recovery) Neon

Neon garde un historique des changements de la base et permet de revenir à un instant T, mais
la **fenêtre de rétention dépend du plan** :

- **Free** : ~24h de PITR (peut varier, à confirmer dans le dashboard).
- **Launch/Scale** (payant) : plusieurs jours configurables.

### À faire dans le dashboard Neon (https://console.neon.tech)

1. Ouvre le projet → **Settings** → **Backup & restore** (ou "Point-in-time restore" selon la
   version de l'UI).
2. Note la fenêtre de rétention actuelle (ex. "24 hours"). C'est ta perte de données maximale
   en cas d'incident si tu ne restaures pas à temps.
3. Si le plan actuel est Free et que la fenêtre te semble trop courte pour un service avec des
   comptes d'enfants (recommandé : au moins 7 jours), c'est un arbitrage produit/coût à trancher
   — pas un correctif technique.

---

## 2. Tester une restauration (sans toucher à la prod)

Neon permet de créer une **branche** de la base à partir d'un timestamp passé — c'est la façon
sûre de tester une restauration sans jamais modifier la branche `main`/prod.

1. Dashboard Neon → projet → **Branches** → **Create branch**.
2. Choisis **"Time travel"** / **"Point in time"**, sélectionne un timestamp d'il y a quelques
   heures.
3. Une fois la branche créée, récupère sa chaîne de connexion (bouton "Connect").
4. Depuis ta machine, connecte-toi à cette branche avec `psql` (ou DBeaver/TablePlus) et vérifie :
   - Les tables attendues existent (`users`, `refresh_tokens`, `admin_audit_log`, etc.).
   - Un compte que tu sais avoir existé à ce moment-là est bien présent.
5. **Supprime la branche de test** une fois la vérification faite (elle consomme du quota).

> Refaire ce test tous les 1-3 mois suffit — l'objectif est de savoir que la fonctionnalité
> marche vraiment, pas de la tester en continu.

---

## 3. Rollback applicatif (Render)

Si un déploiement casse la prod (erreur au boot, régression bloquante) :

1. Dashboard Render → service `mssid-backend` → onglet **Events** / **Deploys**.
2. Repère le dernier déploiement qui fonctionnait (avant le commit fautif).
3. Clique **"Rollback to this deploy"** (ou redeploie manuellement ce commit précis via
   **Manual Deploy** → choisir le commit dans le sélecteur).
4. Vérifie `GET /api/health` répond `200` après le rollback.

⚠️ Un rollback applicatif ne touche pas la base de données. Si le déploiement fautif a aussi fait
tourner une migration Flyway destructive (colonne supprimée, etc.), le rollback du code seul ne
suffit pas — il faut évaluer si la migration doit être compensée par une nouvelle migration
corrective, jamais en éditant un fichier `V*.sql` déjà appliqué en prod.

---

## 4. Checklist après un incident de données

- [ ] Isoler la cause (déploiement récent ? requête manuelle en prod ? bug applicatif ?).
- [ ] Si perte de données : créer une branche Neon "Time travel" juste avant l'incident (voir §2)
      pour comparer/récupérer les lignes perdues, sans écraser la branche prod à l'aveugle.
- [ ] Si un rollback de code est nécessaire : suivre §3.
- [ ] Une fois résolu, noter ici (ou dans un fichier `docs/incidents/AAAA-MM-JJ.md`) : cause,
      détection, correctif, durée d'indisponibilité — sert de mémoire pour la prochaine fois.

---

## 5. Ce qui reste à décider (pas un correctif de code)

- Fenêtre de rétention PITR Neon suffisante pour un service avec des comptes d'enfants (§1).
- Monitoring/alerting (ex. Sentry) — sans ça, un incident se découvre par les retours
  utilisateurs, pas par une alerte automatique.
