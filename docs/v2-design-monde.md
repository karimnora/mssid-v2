# V2 — Design « monde de jeu » des écrans enfant

## Décision de Karim (3 novembre 2026)

- Les écrans enfant passent au style « monde de jeu » : ciel de nuit, boutons brillants façon bonbon, titres en Lalezar, et Didou qui parle sur un ruban violet.
- Les écrans parents (carnet, abonnement, réglages, admin) gardent la charte crème `#FFFBF0` / `#0f172a`.
- Maquette validée avant l'application : https://claude.ai/artifact/AtzpPFF6br7ytASvpmoP3i. Elle contient l'accueil, une leçon, un quiz et le nouveau Didou.
- Didou est plus réaliste : fourrure en dégradé, yeux ambrés avec reflets, foulard vert à étoile rouge (`components/world/DidouPortrait.tsx`).
- La darija est reportée à plus tard. Didou parle en arabe littéral ou en français, selon la langue de l'app.

## Fonctionnement

- Flag `worldDesign`, activé par défaut sur `v2` et réglable dans l'onglet admin.
- `App.tsx` pose `<html data-world>` uniquement sur les écrans enfant : aujourd'hui l'accueil, les matières et les leçons, hors préscolaire et hors carte. Les fenêtres parents, les surfaces d'exercice, les laboratoires et le pied de leçon gardent les couleurs crème : c'est la règle « Parent and exercise surfaces » de `world.css`.
- `styles/world.css` redéfinit les couleurs de l'app (`--app-*`, `--kids-*`) et ajoute le ciel, les tuiles brillantes, les titres et le ruban. Les composants ne changent pas : avec le flag coupé, l'app retrouve exactement l'ancien rendu.
- La police Lalezar est hébergée par l'app (`@fontsource/lalezar`), car la politique de sécurité n'autorise que les polices locales.
- `components/world/DidouRibbon.tsx` affiche Didou, sa phrase et un bouton d'écoute qui passe par `speakText`. Les clips ElevenLabs sont utilisés quand ils existent.

## Étapes

- [x] Accueil (3 novembre 2026). Vérifié dans Edge en 390 × 844 et 1280 × 800, sans erreur JavaScript.
- [x] Choix des matières et lecteur de leçon (3 novembre 2026) : ciel de nuit autour des cartes blanches, comme sur la maquette. Les étiquettes d'étape et le titre « كلمات جديدة » sont rendus lisibles. Vérifié dans Edge en 390 × 844, sans erreur JavaScript.
- [ ] Lecteur de leçon : étapes reliées comme sur la carte, gros bouton « التالي » bonbon.
- [x] Quiz (3 novembre 2026) : réponses en boutons bonbons. Une bonne réponse devient verte avec un anneau doré ; une erreur devient lavande douce, jamais rouge. Didou apparaît dans la correction. Vérifié dans Edge.
- [ ] Étoiles animées à la fin du quiz.
- [ ] « مساعدي », laboratoires, examens.
- [ ] Barre du haut et barre du bas dans le même style.
- [ ] Remplacer l'ancien compagnon (`DidouVirtualCompanion`) par le nouveau dessin de Didou.
- [ ] Essai sur un vrai téléphone Android.

## Fenêtres : toujours un bouton fermer

- Chaque fenêtre affiche en haut le même bouton rond ✕ (`components/ui/ModalCloseButton.tsx`) : 48 px, libellé « أغلق » ou « Fermer » pour le lecteur d'écran.
- Ajouté le 3 novembre 2026 sur :
  - les rubans de Didou de la carte et de la planète, où la croix déclenche le premier choix (« لا » ou le bouton unique) pour que le voyage ne reste jamais bloqué ;
  - « خطوتان للبدء », qui revient à la session suivante ;
  - le choix de l'enfant, où la croix vaut « passer » ;
  - le menu « nourrir Didou » ;
  - le certificat des wilayas.
- Les fenêtres « Bravo » des jeux préscolaires se ferment seules au bout de 1,4 à 1,8 seconde.
- Tests : `components/ui/ModalCloseButton.test.tsx`.
