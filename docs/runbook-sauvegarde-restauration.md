# 🆘 Runbook — Sauvegarde, restauration et rollback (Mssid DZ)

> Répond au point RGPD/DevOps de l'audit pré-prod : "Aucun APM, aucune alerte, aucun runbook
> de rollback. Les backups Neon / PITR ne sont pas dans le dépôt." Ce document ne remplace pas
> une vérification manuelle dans les dashboards Neon/Render — il donne la procédure exacte à
> suivre, et personne d'autre que toi n'a les identifiants pour le faire.

---

## 1. Vérifier le PITR (Point-In-Time Recovery) Neon

Neon garde un historique des changements de la base et permet de revenir à un instant T, mais
la **fenêtre de rétention dépend du plan**.

**Confirmé le 28/08/2026 sur le projet de prod (`ep-orange-unit-za6ig2of`, plan Free) :
fenêtre de 6 heures seulement** (Branches → Backup & Restore → "Restore from history").
C'est court : un incident découvert après un week-end ou une nuit dépasse largement cette
fenêtre, surtout tant qu'aucun monitoring (Sentry) n'est en place pour détecter un problème
rapidement. Passer à un plan payant (rétention configurable, plusieurs jours) est un arbitrage
coût/risque à trancher plus tard — pas bloquant pour un lancement gratuit modeste, mais à garder
en tête si le trafic ou le nombre de comptes augmente.

### Mitigation gratuite immédiate : snapshot manuel avant toute opération à risque

Le plan Free permet de créer un **snapshot manuel** (bouton "Create" dans Backup & Restore →
"Or restore from a snapshot") sans limite de 6h — mais sans planification automatique (ça,
c'est réservé au plan payant, "Upgrade for schedules"). Un snapshot manuel n'expire pas comme
la fenêtre glissante de 6h.

**Règle à suivre : créer un snapshot manuel juste avant toute action à risque**, c'est-à-dire :
- un déploiement backend qui inclut une nouvelle migration Flyway (`V*.sql`),
- une action admin en masse (changement de rôle en lot, suppression, etc.),
- toute opération qu'on ne peut pas facilement annuler autrement.

Ça coûte 30 secondes et zéro euro, et ça couvre exactement les moments où le risque d'erreur
humaine est le plus élevé.

### À vérifier périodiquement dans le dashboard Neon (https://console.neon.tech)

1. Ouvre le projet de prod → **Branches** → **Backup & Restore** sur la branche `production`.
2. Relis la fenêtre affichée ("Restore from history to any point in the past N hour window") —
   Neon peut faire évoluer ce chiffre selon le plan/l'usage, donc revérifier de temps en temps.

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

- Fenêtre PITR de 6h (plan Free) suffisante ou upgrade Neon nécessaire, à réévaluer si le
  trafic/nombre de comptes augmente (§1).
- Un second projet Neon nommé "mssid" existe dans l'organisation, inactif depuis 11+ jours —
  probablement un doublon de configuration initiale. À confirmer qu'il ne contient aucune donnée
  utile avant de le supprimer (évite toute confusion future sur "quel projet est la vraie prod").
- Monitoring/alerting (ex. Sentry) — sans ça, un incident se découvre par les retours
  utilisateurs, pas par une alerte automatique, ce qui aggrave l'impact de la fenêtre PITR courte
  ci-dessus (le temps de détection mange une partie du budget de 6h).
