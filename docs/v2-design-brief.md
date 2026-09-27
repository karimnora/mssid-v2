# V2 — Brief design et UX (prototype)

Base : proposition de direction du 27 septembre 2026 (trois espaces, séance guidée, six écrans prototypés avant toute refonte). Ce brief ajoute les contraintes déjà fixées par le projet. Références : `.cursorrules`, `CLAUDE.md`, `docs/cahier-des-charges.md`, `docs/roadmap-v2.md` (phase 2), `docs/v2-inventaire.md`.

## Direction retenue

- **Trois espaces, une identité :** préscolaire (très visuel, peu de choix, audio), primaire (progression visible, accès rapide aux matières et à la dernière activité), parent (sobre : profils, progrès, fiches, réglages).
- **Séance guidée :** consigne → activité → correction expliquée → nouvelle tentative si nécessaire → fin de séance. Une seule activité à l’écran, un bouton pour réécouter, une progression discrète, une sortie toujours accessible.
- **Accueil enfant :** une action principale « Continuer avec Didou », deux accès secondaires « M’entraîner » et « Explorer ».
- **Méthode :** six écrans prototypés, comparés aux écrans actuels, puis décision de refonte écran par écran.

## Contraintes existantes (non négociables sans décision de Karim)

### Identité visuelle (`.cursorrules`)

| Rôle | Valeur |
|---|---|
| Fond | crème `#FFFBF0` |
| Cartes | `#FFFFFF`, bord `#E7E2D7` |
| Indices / hints | `#FFF8E7` |
| Texte | `#0f172a` |
| Action principale, succès | émeraude `#008751` |
| Récompenses, pièces, XP | ambre `#F59E0B` |
| Info, examens | bleu `#2563EB` |
| Erreur, destructif | corail `#C42A23` (jamais en texte agressif sur une erreur d’exercice) |

- Pas de rose ni d’indigo hors de ces rôles.
- Typographie : Cairo et Readex Pro, hébergées localement. Corps de texte ~18 px (`--type-body`). `font-black` réservé aux titres d’écran.
- Coins très arrondis (`rounded-2xl`, `rounded-3xl`).
- Accueil : cartes crème avec bande colorée, pas de murs de dégradés.

**Point à trancher avant la bibliothèque de composants :** le cahier des charges (PED-05) indique encore un fond `#F8F9FA` et un texte `#1E293B`. Ce brief suit `.cursorrules` en attendant la décision.

### Ergonomie

- Un seul bouton d’action principal émeraude par écran.
- Zones tactiles : 48 px minimum (`--hit`) ; **60 px minimum, 72 px idéalement en préscolaire et en 1AP** (`CLAUDE.md`).
- Préscolaire et 1AP : toutes les consignes ont un bouton audio ; tap simple ; pas de double tap, d’appui long ni de défilement complexe ; glisser-déposer seulement avec une aimantation large.
- Jamais de son d’erreur strident ; retour constructif.
- Ne jamais bloquer le zoom (`user-scalable`).
- Animations : `framer-motion`, transitions `spring`, `whileTap={{ scale: 0.95 }}` sur les cibles tactiles, pas de `whileHover` scale sur les grandes surfaces.

### Pédagogie et affichage

- Arabe RTL natif ; zones en écriture latine en LTR lorsque le contenu l’exige (français, anglais, nombres dans certains exercices).
- Problèmes de maths 2AP–5AP : affichage officiel en deux colonnes, `الحل / الأجوبة` et `العمليات`.
- Grammaire arabe : tableau `الكلمة | إعرابها`.
- Les cours, leçons et sujets restent en arabe même si l’interface est en français (sauf langues étrangères et tamazight).

### Parcours (cahier des charges)

- **F-01 :** un invité atteint une leçon en moins de trois tapotements, sans compte. **L’écran « Choix du profil enfant » est facultatif** : il n’apparaît que pour un compte qui a plusieurs profils. L’invité arrive directement sur l’accueil.
- **F-08 :** les examens ne doivent pas disparaître derrière un menu. Le prototype indique où se trouvent examens, labs et défis depuis l’accueil primaire.
- **F-10 :** une leçon n’est validée que si son quiz est réussi à 100 %. La nouvelle tentative de la séance guidée ne contourne pas cette règle.
- **F-15 :** l’XP des défis et des jeux n’est donné qu’au premier succès.
- **F-05 :** les actions sensibles de l’espace parent passent par le Parent Gate.
- Rien d’existant ne reçoit de cadenas. L’abonnement n’apparaît dans l’espace parent qu’à partir de la phase 8, derrière un flag.

## Les six écrans du prototype

| # | Écran | Points à vérifier |
|---|---|---|
| 1 | Choix du profil enfant | Facultatif ; passage direct pour l’invité ; ajout de profil derrière le Parent Gate |
| 2 | Accueil préscolaire | Cibles 60–72 px, audio sur chaque consigne, trois choix au plus |
| 3 | Accueil primaire | « Continuer » comme action unique émeraude ; accès visible aux matières, examens, labs, défis |
| 4 | Exercice avec consigne audio et correction | Vrai exercice du catalogue, en arabe avec nombres ; un problème de maths en deux colonnes |
| 5 | Bilan de séance | Réussites, points à revoir, Didou ; pas de message culpabilisant |
| 6 | Tableau de bord parent | Profils, activités récentes, points à revoir, fiches ; langage simple |

## Réalisation

- Exploration du style : deux ou trois variantes de l’écran 3, en maquette (Figma ou équivalent), sans toucher au code.
- Prototype : les six écrans codés dans la branche `v2`, avec des contenus réels du catalogue, derrière une route de prototype qui n’est pas accessible depuis la navigation.
- Test sur un Android milieu de gamme et en conditions réelles avec quelques familles.
- Une seule personne ou un seul agent travaille à la fois sur les fichiers du prototype.
