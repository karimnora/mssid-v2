# V2 — Habillage « fait main » des cours, défis et exercices (CL-19)

Destinataires : Codex (construction, tâche CX-25) et Karim (validation). Rédigé le 16 novembre 2026.
Branche `v2` uniquement. Rien de ce document ne s'applique à `main`.

## 1. Pourquoi

Les écrans immersifs de la V2 (planète, carte de Didou, mondes peints) ont une identité forte. Les écrans de cours, de défis et d'exercices sont restés plus neutres : cartes blanches, icônes standard. Karim veut leur donner une identité algérienne reconnaissable, qui ne ressemble pas à une interface générée, **sans toucher aux écrans immersifs**.

Karim a validé trois éléments sur maquette le 16 novembre 2026 : un fond zellige discret, une bande à motif berbère, des icônes au même trait d'encre.

## 2. Périmètre

### Concerné

| Écran | Fichiers |
|---|---|
| Leçon, affichage classique | `components/LessonViewer.tsx`, `components/lessonViewer/LessonContentPanel.tsx`, `LessonStepFooter.tsx` |
| Exercices de la leçon | `components/lessonViewer/LessonPracticePanel.tsx`, `LessonQuizPanel.tsx`, `LessonEvaluationPanel.tsx` |
| Défis | `components/ChallengesArena.tsx` |

### Exclu, à ne pas modifier

- Tout `components/journey/` et `components/world/` : planète, carte, stations, décors peints, ambiance.
- La leçon ouverte dans un monde : `VillageLessonLayout.tsx`, `VillageLessonScene.tsx`, `JourneyLessonStage.tsx`. Dans ce mode, le décor peint reste seul ; aucun motif ne s'ajoute.
- Préscolaire (refait sur la V1 le 13 novembre), laboratoires, espace parent, examens (`ExamsViewer.tsx` : mise en page proche du sujet papier et de l'impression).
- Questions, corrigés, règles de validation, calcul des étoiles et de l'XP : aucun changement. L'habillage est visuel seulement.

## 3. Les trois éléments

Les deux fichiers de motif sont dans `docs/v2-habillage/`. Codex les copie dans `frontend/src/assets/motifs/` ; ils sont chargés en local, sans appel réseau.

### 3.1 Fond zellige

- Fichier : `zellige.svg` (étoile à huit branches, carreau de 56 px, trait `#F1E3C4`, 425 octets).
- Où : sur le fond de page crème (`--app-bg`, `#FFFBF0`) des écrans concernés, derrière les cartes. Répété, taille `56px 56px`.
- **Jamais derrière du texte.** Tout texte reste sur une carte pleine (`--app-card-bg` ou `--app-card-subtle`). Le contraste des textes ne change donc pas.
- Désactivé à l'impression (`@media print`) et dans le thème sombre (le trait clair n'y a pas de sens ; pas de variante sombre dans ce lot).
- Une seule classe partagée, par exemple `.motif-zellige` dans `index.css`, posée sur le conteneur de page de la leçon classique et de l'arène des défis.

### 3.2 Bande berbère

- Fichier : `bande-berbere.svg` (losanges ambre et crème sur émeraude, tuile de 32 × 16 px).
- Où : en haut de la carte de titre, à la place de la bande de couleur unie. Hauteur 16 px, répétée sur la largeur.
  - Leçon : la carte `lesson-reading-heading` de `LessonViewer.tsx`.
  - Défis : la carte d'en-tête de `ChallengesArena.tsx`.
- **Une seule bande par écran.** Elle ne se répète pas sur chaque carte.
- Décorative : `aria-hidden="true"`.

### 3.3 Icônes au même trait

Les écrans concernés utilisent `lucide-react`. On ne redessine pas les icônes dans ce lot : on leur donne un trait commun.

- Un petit composant partagé, par exemple `components/ui/InkIcon.tsx`, qui reçoit une icône lucide et un rôle, et la rend avec : contour encre `#33261A`, épaisseur 2.2, extrémités arrondies, et un aplat de couleur selon le rôle.

| Rôle | Aplat | Exemples d'icônes |
|---|---|---|
| Récompense | `#FFD98A` | `Trophy`, `Award`, `Sparkles` |
| Réussite | `#9BE8BD` | `CheckCircle2` |
| Information, cours | `#BFD4FF` | `BookOpen`, `GraduationCap`, `Eye`, `EyeOff` |
| Indice | `#FFF1CC` | `Lightbulb` |
| Neutre, à revoir | `#F3EEE3` | `XCircle`, `RotateCcw`, `Shuffle` |

- Une réponse fausse reste en ton neutre, jamais en rouge (règle de `CLAUDE.md`).
- L'aplat s'applique seulement sur une surface claire (carte, `.exercise-surface`, `.light-surface`). Ailleurs, et dans le thème sombre, l'icône garde `currentColor` sans aplat.
- Une icône placée sur un bouton plein (texte blanc sur émeraude) ne change pas.
- Remplacer uniquement les icônes des fichiers du périmètre. Les 120 autres fichiers qui utilisent lucide restent tels quels.

## 4. Ce qui ne fait pas partie de ce lot

- **Titres écrits à la main** et **voix réelles** : ils demandent une personne (calligraphe, enseignant). À reprendre quand Karim aura les fichiers.
- **Icônes redessinées par un illustrateur** : même chose, en même temps que les poses de Didou si Karim le décide.
- **Report sur la V1** : après validation sur la V2, dans une branche séparée, jamais directement sur `main`.

## 5. Contraintes

- Drapeau : nouvel interrupteur `handmadeSkin` dans `featureFlags.ts`, actif par défaut en local. Karim peut ainsi comparer avec et sans.
- Règles inchangées : cibles tactiles (48 px, 60 px en 1AP), audio des consignes en 1AP et 2AP, RTL, deux colonnes `الحل` / `العمليات`, tableau `الكلمة` / `إعرابها`, aucun mot de paiement sur Android.
- Aucune animation nouvelle dans ce lot. Le mode « données légères » (CX-14) n'a rien à couper : les deux motifs pèsent moins de 1 Ko.
- Tests : seulement ceux des fichiers modifiés (règle 8 de `v2-todo-claude-codex.md`).

## 6. Critères d'acceptation

1. Captures à 360 × 640 et 390 × 844, en arabe, de : une leçon de maths 5AP (contenu, exercice, quiz), une leçon d'arabe 2AP, l'arène des défis. Le fond zellige est visible entre les cartes et derrière aucun texte ; une bande berbère et une seule par écran.
2. Les mêmes écrans avec `handmadeSkin` coupé sont identiques à l'état actuel.
3. La planète, la carte et une leçon ouverte dans un monde sont inchangées, drapeau actif ou non.
4. Impression d'une fiche et thème sombre : aucun motif.
5. Une réponse fausse n'affiche aucun rouge ; les icônes du tableau 3.3 ont le contour encre et l'aplat de leur rôle.
6. Claude relit les captures avant le commit.
