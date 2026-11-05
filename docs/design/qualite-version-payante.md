# Qualité de la version payante — suivi

Périmètre demandé : labos, cours, préscolaire, examens et jeux. Objectif : cohérence graphique, autonomie de l’enfant, valeur pédagogique visible et progression explicable aux parents. Ce document ne constitue pas une promesse de conversion commerciale.

## Premier lot réalisé

- WuduLab : premier rendu 3D intégré ; règles et contenu préservés, dix WebP, RTL et réduction du mouvement.
- Jeu de mémoire de la ferme : nouveau décor algérien sans Didou, cartes et règles préservées.
- Neuf planches corrigées sur transparence réelle et décor des ablutions sans eau fixe. Les originaux restent conservés.
- Inventaire structurel : visual-inventory-2026-11-05.json. Ce relevé ne prétend pas évaluer la qualité visuelle de chaque écran.

## Suite ordonnée

- [ ] Vérifier visuellement le premier labo sur mobile et ordinateur, en arabe, après autorisation des vérifications demandées dans le relais.
- [ ] Corriger les postures de prière et faire relire les gestes religieux.
- [ ] Aligner les états électriques et feux ; séparer hélice et moteur ; découper les éléments d’eau sans fragment voisin.
- [ ] Intégrer électricité, route et souk.
- [ ] Examiner les usages partagés PreschoolAsset et PreschoolDiscoveryArt, puis remplacer les illustrations de faible qualité sans modifier les quantités, couleurs ou signes enseignés.
- [ ] Examiner les cours : illustrations par notion, lisibilité des consignes, schémas précis conservés.
- [ ] Examiner les examens : habillage sobre, aucune image donnant la réponse, impression lisible et peu gourmande en encre.
- [ ] Examiner les jeux : illustrations cohérentes, réactions liées aux actions et ambiance légère.
- [ ] Vérifier les écrans du carnet parent existant avant d’ajouter des indicateurs. Ne montrer que des progrès réellement mesurés.

## Audio

1 278 fichiers audio trouvés dans frontend/public. Le projet possède un lecteur de paroles enregistrées et un générateur ElevenLabs. Aucune nouvelle voix générée ; aucun appel payant réalisé. La qualité des fichiers existants n’a pas été évaluée à l’écoute. Priorité : échantillon Fusha pour les consignes du préscolaire, prononciation, débit et volume. Pour les récitations coraniques, conserver des enregistrements validés et autorisés.

## État de vérification

Pas de tsc, Vitest, e2e, build, commit ni push. Le rendu navigateur n’est pas encore vérifié. La vérification git diff a échoué : Git ne reconnaît pas ce worktree dans l’environnement d’exécution ; ne pas toucher à main ni réparer la configuration Git sans diagnostic séparé.

## Auto-évaluation du premier lot

- Exactitude : 3/5 — logique non modifiée à la lecture, mais rendu et compilation non vérifiés.
- Complétude : 2/5 — premier labo et ferme seulement ; la refonte globale est encore en cours.
- Clarté : 4/5 — assets corrigés séparés des candidats et limites documentées.
- Exploitabilité : 3/5 — fichiers intégrés, contrôle navigateur restant.
- Concision : 4/5 — rapport renvoyant aux inventaires au lieu de dupliquer toutes les entrées.

## Mise à jour — contrôle visuel ciblé effectué

Ablutions et premier niveau de la ferme examinés dans Chromium en arabe, 390×844 et 1280×800, compte et API simulés. En-tête compacté et chevauchement des cibles corrigé. Progression des ablutions vérifiée ; pas de débordement horizontal détecté. Voir labos-preparation-2026-11-05/verification-visuelle/README.md. Ce contrôle ciblé remplace pour ces deux écrans la mention antérieure « rendu navigateur non vérifié ». La refonte globale et les tests complets restent à faire.

## Validation finale du premier lot

TypeScript réussi, 14 tests ciblés réussis, suite complète 2 519 tests réussis. Retour d’eau animé après lavage réussi et désactivé en réduction des mouvements ; contrôle final Chromium et captures aux deux formats effectués. Ce résultat ne signifie pas que la refonte globale est terminée. Le commit porte sur WuduLab, le décor de ferme et les fichiers de préparation/suivi, sans SalatLab ni changement de contenu pédagogique.
