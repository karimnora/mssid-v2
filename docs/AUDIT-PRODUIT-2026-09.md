# Audit produit Mssid DZ — 23 septembre 2026

Cet audit porte sur le dépôt local, pas sur les données privées de Play Console ni sur des observations en classe. Aucune modification ne peut garantir la croissance. Les décisions ci-dessous doivent être évaluées avec des mesures et de courts essais auprès de parents et d'enseignants.

## Ce qui fonctionne déjà

- Parcours du préscolaire à la 5AP, cours, exercices, évaluations, ateliers et jeux ; contenus en arabe et français, avec une partie en anglais.
- Accès invité et inscription Google / mot de passe ; progression, récompenses et console administrative.
- Tests automatisés, contrôle TypeScript, rapports d'erreurs Sentry optionnels, statistiques de comptes et d'activité côté backend.
- Boutons de retour et de téléchargement préscolaires corrigés récemment.

## Priorités, par ordre de risque et d'impact supposé

| Rang | Action | Pourquoi | Risque / validation |
| --- | --- | --- | --- |
| 1 | Lire dans Play Console les visites de fiche, clics d'installation, installations, désinstallations, utilisateurs actifs et Android vitals, ventilés par langue et appareil. | Distinguer manque de découverte, fiche peu convaincante, abandon après installation et problème technique. | Aucun changement applicatif. Ne pas déduire la cause de la seule valeur « utilisateurs ». |
| 2 | Observer cinq familles et deux enseignants sur trois tâches : choisir un niveau, terminer une première activité, reprendre le lendemain. | Voir les hésitations réelles avant de refaire l'accueil. | Aucun risque de régression. Noter temps, blocages et mots employés, sans collecter de données d'enfant inutiles. |
| 3 | Réviser la fiche Play en arabe et en français : promesse simple, captures réelles montrant niveau, exercice et résultat ; vérifier que les captures correspondent à la version Play actuelle. | La fiche est le point de conversion avant installation. | Ne modifier qu'un élément à la fois et conserver les données de référence. Utiliser les expériences de fiche Play si le volume le permet. |
| 4 | Rendre la première activité plus évidente sur l'accueil : une action principale selon le niveau, puis « continuer » si une activité a déjà été commencée. | L'accueil contient aujourd'hui le compagnon, les cours, examens, défis et laboratoires. Cette richesse peut disperser un nouvel utilisateur. | Moyen : ne modifier ce parcours qu'après les observations et avec test de retour/progression. |
| 5 | Mesurer le parcours « ouverture → choix du niveau → première activité → activité terminée → retour J7 » avec des événements agrégés et une politique adaptée aux enfants. | La console actuelle mesure surtout les comptes et l'activité après XP ; elle ne montre pas où un invité abandonne. | Moyen : revoir confidentialité et déclaration Play avant d'ajouter une mesure côté Android. Ne pas enregistrer noms, réponses d'enfants ou contenu de cours. |
| 6 | Contrôler en priorité un échantillon représentatif de cours et évaluations par niveau : exactitude, langue, consigne, réponse et cohérence avec la source citée. | La quantité de contenu ne suffit pas à créer la confiance ; plusieurs textes emploient « officiel » ou « correction officielle ». | Faible pour l'audit, plus élevé pour une réécriture massive. Corriger par petits lots validés. |
| 7 | Mesurer le chargement sur téléphone Android modeste et réseau mobile, puis réduire les gros morceaux JavaScript seulement si les chiffres le justifient. | Le build contient des morceaux importants (application, catalogue de cours et moteur de jeux). | Mesure sans risque ; découpage technique à faire isolément avec tests de parcours. |
| 8 | Étendre l'audit d'accessibilité automatique aux écrans d'accueil, inscription, cours et préscolaire, puis tester avec enfants lecteurs débutants. | Les tests axe existants ciblent surtout les laboratoires ; les petits textes et commandes serrées méritent un contrôle réel. | Faible si les corrections restent locales et sont vérifiées sur mobile. |
| 9 | Ajuster le retour d'information lorsque l'on nourrit Didou : afficher l'énergie réellement gagnée et envisager une jauge pleine sans dépense inutile de pièces. | Le message annonce le bonus nominal même lorsque la jauge atteint son plafond. | Faible pour le texte ; décider avec des familles avant de changer les récompenses ou les coûts. |

## Correction sûre effectuée pendant l'audit

Les descriptions SEO et de partage du site ont été reformulées pour décrire les fonctions visibles. Elles ne présentent plus l'application comme « première », ne figent plus un nombre d'examens, ne qualifient plus les corrigés d'« officiels » sans preuve et ne mettent plus des moyens de paiement à la place du bénéfice éducatif. Les parcours, données, abonnements et numéros de version ne changent pas.

Le nourrissage de Didou depuis l'accueil additionnait le bonus à l'énergie enregistrée, alors que la jauge affichait une énergie diminuée depuis le dernier repas. Après plusieurs jours, elle pouvait ainsi bondir directement à 100 %. Le calcul part maintenant de la valeur affichée, comme dans le vestiaire, avec un test de régression. Une friandise peut toujours atteindre 100 % normalement si l'énergie est déjà proche du maximum : le premier repas part par exemple de 90 % et une friandise à +20 % remplit la jauge. Ce réglage de progression n'a pas été modifié.

## Indicateurs à suivre chaque semaine

- Découverte : visites de la fiche Play et trafic du site par source/langue.
- Conversion : clics d'installation depuis la fiche, installations effectives et première ouverture ; ne pas confondre ces mesures.
- Activation : part des nouvelles installations qui terminent une première activité utile.
- Fidélisation : part qui revient apprendre après 7 et 30 jours, par cohorte si les volumes le permettent.
- Qualité : crashs, ANR, plaintes récurrentes, réussite Google Sign-In, temps de chargement et abandons.

La console administrative expose déjà DAU/WAU/MAU et des taux de retour basés sur `lastActiveDate` après une action qui rapporte de l'XP. Ces taux ne sont pas une rétention par cohorte et ignorent les simples ouvertures ou abandons avant activité.

## Sources de référence

- Google Play — statistiques de fiche et d'acquisition : https://support.google.com/googleplay/android-developer/answer/9859173
- Google Play — bonnes pratiques de fiche et expériences : https://support.google.com/googleplay/android-developer/answer/13393723 et https://support.google.com/googleplay/android-developer/answer/12053285
- Android vitals : https://developer.android.com/topic/performance/vitals
- Web Vitals : https://web.dev/articles/vitals
- Google Play — audience des enfants : https://support.google.com/googleplay/android-developer/answer/9867159
