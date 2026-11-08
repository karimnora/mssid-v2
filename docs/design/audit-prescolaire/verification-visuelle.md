# Vérification visuelle et interactions — 8 novembre 2026

Aperçu local v2, navigateur Chromium automatisé, API entièrement simulée, profil fictif. Aucun appel à un compte réel et aucun paiement. Cette vérification ne remplace ni un essai sur Android physique ni le test familles.

| Écran | Résultat mesuré |
|---|---|
| Accueil arabe 360 × 640 | Aucun débordement horizontal ; 14 commandes mesurées, toutes au moins 60 × 60 px. |
| Accueil arabe 390 × 844 | Même résultat. |
| Accueil arabe 1280 × 800 | Même résultat. |
| Domaines d’apprentissage arabes 390 × 844 | Aucun petit bouton dans le périmètre mesuré ; ratios `0 / 82`, `0 / 55`, `0 / 54`, `0 / 57` isolés en LTR. |
| Tableau magique arabe 390 × 844 | Aucun débordement horizontal ; aucun bouton mesuré sous 60 px. |
| Piano arabe 390 × 844 | Aucun débordement de page ; aucun bouton mesuré sous 60 px. Rangée de touches défilable. |
| Changement AR → FR | Défi parent affiché ; langue enregistrée toujours `ar` avant validation. |

Aucune erreur JavaScript de page remontée sur ces parcours. Mouvement réduit activé pour les captures ; la mascotte a également une branche explicite sans animation. Les contrôles en dehors de ces écrans et la totalité des 248 activités n’ont pas été joués visuellement dans ce lot.

Captures et rapports JSON conservés dans les artefacts locaux de cette conversation : `preschool-safety-home-{360,390,1280}.png`, `preschool-safety-learn-{360,390,1280}.png`, `preschool-safety-board-390.png`, `preschool-safety-music-390.png`, `preschool-safety-parent-gate.png`, `preschool-safety-browser.json` et `preschool-safety-interactions.json`.

Verdict de comparaison visuelle automatique : INCONCLUSIVE, faute de référence de pixels figée. Les mesures ci-dessus sont des contrôles de géométrie et d’interaction, pas une certification WCAG ni une validation pédagogique.
