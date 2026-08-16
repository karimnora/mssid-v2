# 🛠️ Guide Pratique Développeur & Tests Local — Mssid DZ (مَسِيد)

Ce guide est destiné aux développeurs souhaitant exécuter, déboguer et tester localement l'application **Mssid DZ**, le Frontend React, le Proxy Express et le Backend Spring Boot.

---

## 💻 1. Démarrage Rapide (Cheat Sheet)

| Action | Commande | Répertoire | Description |
| :--- | :--- | :--- | :--- |
| **Lancer le Frontend + Express (unifié)** | `npm run dev` | `/frontend` | Démarre le serveur unifié dev sur port 3000 |
| **Lancer le Backend Spring** | `./mvnw spring-boot:run` | `/backend` | Démarre l'API Spring Boot sur port 8080 |
| **Tester le Frontend** | `npm run test` | `/frontend` | Exécute les tests Vitest |
| **Linter TypeScript** | `npm run lint` | `/frontend` | Vérifie la conformité du code TypeScript |
| **Tester le Backend Java** | `./mvnw test` | `/backend` | Exécute les tests JUnit 5 |
| **Compiler pour la Prod** | `npm run build` | `/frontend` | Génère la version optimisée dans `dist/` |

> Le seul frontend actif est `frontend/`. Un scaffold initial (racine, jamais mis à jour depuis
> le premier commit) a été déplacé vers `_archive/legacy-ai-studio-prototype/` — voir son README.

---

## 🧪 2. Procédure de Test Frontend (React & Vitest)

### Exécuter les tests unitaires
L'application intègre **Vitest** et **React Testing Library** pour valider le comportement des composants UI.

```bash
cd frontend

# 1. Installer les dépendances si ce n'est pas déjà fait
npm install

# 2. Lancer les tests unitaires
npm run test
```

### Exemple de Test Unitaire (`frontend/src/components/SorobanInteractive.test.tsx`)
Les tests sont colocalisés à côté du composant qu'ils couvrent (ex. `AiTutorModal.tsx` +
`AiTutorModal.test.tsx` dans `frontend/src/components/`) :

```tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import SorobanInteractive from './SorobanInteractive';

describe('SorobanInteractive Component', () => {
  it('renders correctly with title', () => {
    render(<SorobanInteractive />);
    expect(screen.getByText(/المعداد الياباني/i)).toBeInTheDocument();
  });
});
```

---

## ☕ 3. Procédure de Test Backend (Spring Boot & JUnit 5)

Le backend Spring Boot possède une suite de tests d'intégration dans `backend/src/test/java/dz/mssid/education/`.

### Exécuter les tests Spring Boot

```bash
cd backend

# Exécuter l'ensemble des tests
./mvnw test
```

### Tester manuellement les Endpoints REST via cURL

#### A. Test de Santé API (Health Check)
```bash
curl -X GET http://localhost:8080/api/health
```
**Réponse attendue :**
```json
{"status": "UP", "message": "Service Mssid DZ Opérationnel"}
```

#### B. Test d'Inscription Utilisateur (`POST /api/auth/register`)
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Karim Ammar",
    "email": "karim@example.com",
    "password": "password123",
    "grade": "5AP"
  }'
```

#### C. Test de Connexion & Obtention du Token JWT (`POST /api/auth/login`)
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "karim@example.com",
    "password": "password123"
  }'
```

---

## 🤖 4. Tester l'API IA Gemini en Local

Le serveur Express `frontend/server.ts` (lancé via `cd frontend && npm run dev`) héberge la route `/api/gemini/explain` pour interroger l'IA Google Gemini avec limitation du taux de requêtes (rate-limiting par rôle) et mise en cache des réponses.

### Test cURL du Proxy Gemini :
```bash
curl -X POST http://localhost:3000/api/gemini/explain \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "اشرح لي درس القسمة الأقليدية للسنة الخامسة ابتدائي بأسلوب بسيط",
    "grade": "5AP",
    "subject": "الرياضيات",
    "userRole": "ROLE_PREMIUM"
  }'
```

---

## ❓ 5. Dépannage & FAQ Technique

### Q1: `Error: PORT 3000 is already in use`
* **Cause :** Un autre processus Node ou Express utilise déjà le port 3000.
* **Solution :** Arrêtez l'ancien processus (`killall node` ou fermez le terminal en cours).

### Q2: `mvn: command not found`
* **Cause :** Maven n'est pas installé dans le PATH système.
* **Solution :** Utilisez le Maven Wrapper fourni dans le projet : `./mvnw` sous Linux/macOS ou `mvnw.cmd` sous Windows.

### Q3: `Property 'env' does not exist on type 'ImportMeta'`
* **Cause :** Typechecking strict TypeScript dans un environnement hybride Node/Vite.
* **Solution :** Utilisez `(import.meta as any).env` ou importez depuis `vite/client`.
