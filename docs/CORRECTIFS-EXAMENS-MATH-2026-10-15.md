# Corrigés des examens de mathématiques — 15 octobre 2026

Branche main locale. Vérification déclenchée par le signalement de la section « الحل », notamment le sujet « تقييم مكتسبات نهاية المرحلة الابتدائية — الرياضيات » de 5AP. Les changements nécessitent publication web et nouvelle version Android pour atteindre les utilisateurs.

## Périmètre

Lecture des énoncés et solutions des 59 sujets de mathématiques présents dans la banque, soit 235 exercices et situations d’intégration :

| Niveau | Sujets | Corrigés |
|---|---:|---:|
| 2AP | 9 | 30 |
| 3AP | 15 | 54 |
| 4AP | 15 | 63 |
| 5AP | 20 | 88 |

La banque ne propose pas d’examens formels en 1AP ; ses cours et jeux ne sont pas inclus dans ce décompte. Cette revue vérifie les calculs et la cohérence interne du contenu local ; elle ne constitue pas une certification de conformité au programme ou d’authenticité des sujets historiques.

## Corrections

| Sujet / point | Correction |
|---|---|
| 5AP acquis, calcul décimal | `58.35 − 12.40 = 45.95`, et non `46.95`, dans la solution et l’opération posée. |
| 4AP T1 variante B, achat de ballons | `12 × 750 = 9,000`, total `9,000 + 1,200 = 10,200`. Les anciens résultats étaient `11,400` et `12,600`. Prix unitaires explicités. |
| 4AP T3 variante B, piquets | 75 m de clôture donnent 15 intervalles de 5 m. Avec un piquet à chaque extrémité du portail, il faut 16 piquets. Énoncé et explication précisent les extrémités. |
| 4AP T1, comparaison | Comparer les dizaines `0 < 8` dans `67,508 < 67,580`. Suppression de l’explication incohérente « 6750=6750 puis 8<8 ». |
| 4AP T2, conversion | Réponse dans l’unité demandée : `1,800 g = 1.8 kg`, avec équivalence 1 kg et 800 g. Opérations cohérentes. |
| 5AP devoir T3, pourcentage | Remplacer l’égalité de quantités incompatibles « 20% = 500 DA » par le calcul du montant `(2,500 × 20) ÷ 100 = 500`. |
| 5AP T3 variante C, frais | Préciser que les frais de 2% portent sur le prix après réduction ; calculs détaillés, résultat 4,590 DA. |
| 2AP devoir T3, pommes | Préciser qu’il y a 5 pommes dans **chaque** sac, pour justifier les 15 pommes au total. |
| 5AP devoir T2B, carré et losange | Un carré est un cas particulier du losange. Un losange n’est pas obligé d’avoir des angles non droits. |
| Division euclidienne / centaines | Écrire les identités entières avec quotient et reste au lieu d’une égalité numérique inexacte telle que `17 ÷ 5 = 3`. |
| 2018, vitesse du cycliste | Retirer le renvoi à un dessin absent ; demander directement les distances à vitesse constante. |
| 5AP acquis, reste des cahiers | Écrire séparément le reste en fraction et son calcul numérique, pour éviter un fragment visuellement trompeur « 120=30 ». |

L’exemple `(120 × 3) ÷ 4 = 90` était numériquement correct. Son ancienne mise en forme laissait la parenthèse ouvrante hors du groupe écrit de gauche à droite. Le formateur protège maintenant aussi les parenthèses ouvrantes, le signe moins `−` et les comparaisons `≤/≥`. Les numéros de réponse et parenthèses de la phrase arabe restent hors des calculs.

## Affichage et impression

Sur écran de moins de 480 px, la solution puis les opérations occupent toute la largeur, avec un texte agrandi. Les formules ne sont plus comprimées dans des colonnes d’environ 60 px utiles. Sur grand écran et sur papier, la disposition solution à gauche / opérations à droite est conservée.

## Preuves et limites

- Nouveau contrôle indépendant de l’arithmétique : plus de 250 égalités et comparaisons complètes, avec fractions, décimaux et priorités des opérations, réparties dans les 59 sujets. Il détecte les deux résultats erronés avant correction. Pas d’`eval`.
- Ce contrôle ne prétend pas interpréter toutes les réponses verbales, les unités ou les opérations verticales ; elles ont été examinées avec les énoncés. Les corrections sensibles disposent d’attentes spécifiques.
- 154 tests ciblés réussis, incluant banque d’examens, affichage, formateur, calculs et progression.
- 8 parcours navigateur réussis : corrigé acquis à 320, 390 et 1280 px, PDF du corrigé et cinq contrôles généraux d’impression. Capture 320 px examinée visuellement après correction.
- PDF local de vérification : `frontend/build/math-acquis-corrected.pdf` (artefact ignoré).
- Essai de l’impression native sur téléphone Android encore nécessaire ; aucune APK/AAB signée n’a été compilée ici.

## Extension aux cours, quiz, entraînements et défis

Le contrôle a été étendu aux solutions, explications, formules, résumés et indices de 99 sources de mathématiques (cours et défis), de 1AP à 5AP. Les erreurs pédagogiques volontairement présentées dans « erreurs fréquentes » sont exclues du contrôle des réponses justes. Les 100 cas de test parcourent plus de 450 égalités/comparaisons numériques complètes ; ils ne certifient pas chaque raisonnement verbal ou unité.

Les écritures ambiguës de division avec reste sont remplacées par des identités exactes, par exemple `245 = 8 × 30 + 5`, puis quotient et reste explicités. Les décompositions de fractions utilisent la même convention. Les calculs de pourcentage, de périmètre et de conversion de minutes sont explicités pour éviter des fragments d’égalité trompeurs.

L’isolation des opérations de gauche à droite est aussi appliquée aux explications d’entraînement, aux cartes conceptuelles, aux réponses de quiz, aux jeux de cours, aux défis et aux fiches de révision. Elle prend en charge les chiffres arabo-indiens et reste compatible avec le retour à la ligne sur petit écran. Les textes envoyés à la voix restent inchangés.

Trois cours de division 4AP/5AP ont été ouverts à 320 px : affichage du corrigé détaillé et réponse correcte à une question de quiz, sans débordement. Les trois parcours sont réussis. La suite unitaire globale, après cette extension mathématique, compte 170 fichiers / 1 966 tests réussis. Les petites corrections d’affichage suivantes font l’objet du rapport `AFFICHAGE-ANDROID-2026-10-15.md`.
