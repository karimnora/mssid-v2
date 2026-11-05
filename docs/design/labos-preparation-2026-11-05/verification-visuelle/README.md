# Contrôle visuel — ablutions et ferme

5 novembre 2026. Worktree v2 ; aperçu http://localhost:3002, car 3000 était occupé. Chromium complet via Playwright, compte fictif ROLE_PREMIUM, appels API interceptés, langue arabe, formats 390×844 et 1280×800. Aucun compte réel ni appel au serveur de production.

## Corrections effectuées

- En-tête des ablutions compacté localement : Didou, consigne et commande audio conservés.
- Portrait du guide réduit à 60 px et bouton audio de 60 px.
- Espacement des cibles bouche/mains corrigé après mesure d’un chevauchement sur mobile.
- La scène des ablutions se situe plus haut mais demande encore un défilement sur téléphone ; l’application conserve ses barres de navigation.

## Résultats

- Aucun événement pageerror détecté sur les parcours contrôlés.
- Aucun débordement horizontal sur les deux écrans et les deux formats.
- Sept cibles des ablutions de 72×60 px ; aucun chevauchement mesuré au second contrôle.
- Mauvais choix : étape actuelle conservée, aux deux formats.
- Sept choix corrects : fin d’activité atteinte, aux deux formats.
- Onglet d’ordre : vignettes affichées et captures conservées. Le classement complet n’a pas été parcouru.
- Ferme : entrée depuis le préscolaire en arabe, carte des niveaux ouverte puis premier niveau de mémoire affiché ; décor confirmé dans le style calculé. La résolution des paires n’a pas été parcourue.
- Captures avec prefers-reduced-motion: reduce. Cela ne constitue pas un audit global des animations.

## Limites

Contrôle visuel ciblé, sans baseline de régression. Le panneau de bienvenue de l’application apparaît sur certaines captures des ablutions et recouvre le haut de l’écran : son comportement global reste à examiner. Pas d’audit complet d’accessibilité ou de performances. Pas de tsc, Vitest, suite e2e, build, commit ni push. Aucun verdict de mise en production.

## Suite

Terminer la mise en scène des ablutions (eau synchronisée, ajustement fin des repères anatomiques), puis corriger les images de prière et intégrer SalatLab. Les cartes de la ferme utilisent encore leurs illustrations emoji existantes ; le nouveau décor seul ne termine pas la refonte graphique de ce jeu.

## Validation finale avant commit

Autorisation de tests, commit et push donnée par Karim le 5 novembre 2026. TypeScript via PowerShell : réussi. Vitest ciblé : 14 tests sur 2 fichiers réussis. Vitest complet avec deux workers : 2 519 tests sur 247 fichiers réussis (394 s).

Un bref effet d’eau a été ajouté après les gestes de lavage réussis, hors intention et passage des mains sur la tête. Il utilise uniquement transform et opacity, ne modifie ni la progression ni les réponses, et est masqué avec prefers-reduced-motion. Vérification Chromium finale : animation wudu-water-fall détectée après lavage des mains, display none en réduction du mouvement. Captures finales en arabe aux deux formats mises à jour ; aucun événement pageerror, débordement horizontal ou chevauchement des cibles détecté.

Il reste à affiner les repères anatomiques, le panneau de bienvenue et les illustrations des cartes de la ferme. Les anciens constats « eau synchronisée à faire » et « pas de tests lancés » décrivent les étapes précédentes et sont remplacés par le présent bilan. La prière et les autres labos ne sont pas intégrés dans ce lot.
