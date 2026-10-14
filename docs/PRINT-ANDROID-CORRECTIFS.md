# Impression Android et web — 14 octobre 2026

## Problème reproduit

L'impression du sujet mathématiques 5AP `exam-2018-trim1-math`, depuis une vue mobile de 390 × 844, laissait le premier texte à environ 103 mm du haut de la première page. Le PDF initial comptait trois pages. La feuille pouvait commencer à l'origine tout en conservant un décalage important de son contenu : vérifier seulement la position de la feuille ne détectait pas ce défaut.

Les styles masquaient l'interface avec `visibility: hidden`, qui conserve son espace. Les conteneurs fixes/positionnés, les transformations et le padding de l'interface pouvaient encore affecter l'impression. Les feuilles cumulaient également leur padding de 12 mm et la marge papier.

## Changements

- Les éléments sans contenu imprimable sont retirés de la mise en page papier ; les ancêtres des feuilles sont remis dans le flux normal, sans transformation, padding ou limite de hauteur.
- Les feuilles utilisent une marge papier de 10 mm, sans padding supplémentaire. Le flux Android natif de la page courante demande également 10 mm au service d'impression. Le flux HTML indépendant conserve ses réglages existants.
- Les examens utilisent des fonds transparents et du texte sombre pour limiter l'encre. Les blocs ont un padding de 3 mm ; les titres restent avec le texte sans imposer le déplacement d'exercices entiers.
- Les fenêtres de feuilles imbriquées dans la racine de l'app restent imprimables. Les examens derrière une fenêtre de feuille ou de certificat sont masqués.
- Les feuilles préscolaires conservent leur hauteur A4 utile de 276 mm et leurs pieds de page. Les modes sujet/corrigé et les lignes de réponse sont conservés.

## Validation

266 tests unitaires/composants existants passent (impression, examens, imprimables préscolaires). Cinq tests Playwright passent : vrai examen mobile sujet/corrigé, fiche de révision dans des conteneurs fixes et transformés, pack préscolaire de deux pages, certificat avec examen derrière, fenêtre de feuille imbriquée dans l'app. Les tests de fenêtres isolent les règles de mise en page avec des fixtures ; ils ne certifient pas tous les contenus de chaque modèle.

Les PDF finaux ont été inspectés et rendus en images : sujet de référence sur deux pages, premier texte à environ 13 mm du haut ; corrigé sur trois pages. La fiche et le certificat de test tiennent chacun sur une page. Le pack préscolaire conserve deux pages et le site `mssid-dz.com` sur chacune. Aucun PDF de test ne comporte de page sans texte. Le test du sujet vérifie aussi le nombre de pages pour détecter une page supplémentaire contenant seulement une ligne de réponse.

TypeScript validé. Les ressources frontend Android sont reconstruites et synchronisées après les dernières corrections. Les exemples PDF restent dans `frontend/build` (fichiers locaux de validation, exclus de Git).

## Audit étendu des vrais composants sur le web

La seconde passe utilise les composants réels dans une page de test Vite isolée, sans connexion à la production. Les premières fixtures structurelles restent utiles pour les pièges de conteneurs ; cette seconde passe vérifie aussi les contenus et les vrais boutons.

Deux défauts supplémentaires corrigés :

- Certains PDF étaient vides si l'impression commençait pendant l'animation d'ouverture : l'opacité initiale n'était pas neutralisée. Les ancêtres et les racines imprimables sont maintenant opaques au moment de l'impression. Les PDF sont contrôlés pour leur contenu, pas seulement leur nombre de pages.
- Les décorations et le filigrane des certificats sortaient de leur cadre lorsque la racine était statique. Le certificat conserve maintenant une position relative, un cadrage fermé et une hauteur utile de 185 mm. Il utilise une page A4 paysage sur le web, et le flux Android reçoit l'orientation paysage. Les examens restent en portrait. L'orientation native est couverte par un test du pont d'impression ; elle reste à vérifier dans un APK installé.

Couverture : les six catégories préscolaires dans les trois langues, vues mobile 390 px et ordinateur 1280 px ; les deux types du générateur (examen et synthèse), une vraie fiche de révision 1AP, certificat d'honneur et certificat des wilayas, douze modèles de certificat, atelier d'écriture arabe/français/anglais/tifinagh, documents tamazight 4AP et 5AP. Les diplômes verrouillés sont testés avec un profil fictif portant les badges nécessaires ; les règles d'accès du produit sont conservées.

Résultats : 75 tests navigateur passent (65 puis 10 variantes), 267 tests unitaires/composants ciblés passent. Les 70 PDF issus des vrais composants totalisent 532 pages, dont 498 pages préscolaires ; toutes contiennent du texte. Chaque page préscolaire conserve `mssid-dz.com`. Les PDF préscolaires français et anglais ne contiennent aucun caractère arabe. Les glyphes tifinagh sont présents dans les PDF tamazight et dans l'atelier d'écriture ; des pages ont aussi été rendues en images et inspectées. Tous les modèles de certificats tiennent sur une page en paysage.

Les boutons ont été actionnés en test, avec interception de la boîte système d'impression. Les exports PDF utilisent Chromium ; Firefox, Safari et les pilotes d'imprimantes physiques ne sont pas certifiés par ces tests. La vérification d'une fiche 1AP ne constitue pas un audit de toutes les fiches de chaque cours. TypeScript, construction frontend Android et synchronisation Capacitor réussis après les correctifs finaux. Aucun commit ni push effectué.

## À vérifier sur téléphone avant publication

Le SDK Android local n'est pas disponible : aucun APK/AAB natif compilé ni installé par ce travail. Les PDF Chromium vérifient le rendu web, pas le service d'impression de chaque téléphone ou imprimante. Construire la nouvelle version Android, puis tester Enregistrer en PDF et une impression physique : premier haut de page, marges, arabe/français, sujet/corrigé, pack préscolaire, fiches et certificats. Le correctif natif de marge nécessite une nouvelle version installée. Aucun bump de version, commit ou push effectué ici.
