# Archive — Scaffold initial Google AI Studio (abandonné)

Ce dossier contient le scaffold généré automatiquement lors de la création du projet via
Google AI Studio (`metadata.json` : `MAJOR_CAPABILITY_SERVER_SIDE_GEMINI_API`). Il n'a reçu
qu'un seul commit (`feat: initialize Mssid DZ application`) et n'a jamais été mis à jour depuis :
tout le développement réel s'est fait dans `frontend/` (React/Vite/Capacitor) et `backend/`
(Spring Boot).

**Conservé uniquement pour référence historique.** Ne pas lancer, ne pas maintenir, ne pas
utiliser comme base de nouveau code.

Points notables qui le rendent obsolète et non sûr à exécuter tel quel :

- `server.ts` embarque un faux backend avec une "base de données" JSON sur disque
  (`data/database.json`), des mots de passe stockés en clair (`password123`, `admin123`), et un
  faux JWT non signé (simple base64). Le vrai backend est `backend/` (Spring Boot, JWT signé,
  cookie HttpOnly).
- `index.html` / `vite.config.ts` ne contiennent aucune CSP ni configuration PWA réelle,
  contrairement à `frontend/index.html` et `frontend/vite.config.ts`.
- `.env.example` référence des variables spécifiques à l'environnement AI Studio
  (`GEMINI_API_KEY`, `APP_URL` injectées automatiquement), pas le modèle utilisé par le vrai
  frontend (voir `frontend/.env.example`, `VITE_SPRING_BOOT_URL`).

Déplacé ici (au lieu d'être supprimé) le 2026-08-16 pour préserver l'historique git, dans le
cadre du nettoyage de repo (Sprint S0 de la roadmap Mssid DZ).
