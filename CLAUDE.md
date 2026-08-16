# Directives Projet Mssid DZ

## Tech Stack & Conventions
- Frontend : React, Next.js (App Router), Tailwind CSS (classes logiques RTL : ms-*, me-*, ps-*).
- Backend : Spring Boot 3, Java 17+, PostgreSQL, Spring Security (JWT via Cookie HttpOnly).
- PWA : Service Workers, prompt d'installation sur clic explicite uniquement.

## Règles UX/UI RTL (Arabe)
- L'application est en RTL (`dir="rtl"`).
- TOUTES les expressions mathématiques, chiffres isolés et équations DOIVENT être encapsulés dans un composant LTR (`dir="ltr" font-mono`).
- Aucun texte bilingue sur un même bouton.

## Règles Sécurité
- Jamais de Refresh Token dans le LocalStorage. Uniquement des Cookies HttpOnly SameSite=Strict.

## Règles EdTech Enfant
- Composants aérés, contrastes élevés (WCAG AAA pour la lisibilité).
- Section Préscolaire : Tout doit passer par des icônes, des images et des retours audio.