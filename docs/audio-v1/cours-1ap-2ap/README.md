# Voix arabes des cours 1AP–2AP

État local du 13 novembre 2026, après production et vérification. Les nouveaux enregistrements utilisent **cedar, la voix de Didou V2**. Tous les sons antérieurs sont conservés. Aucun push ni déploiement.

## Couverture des commandes de lecture fixes

| Niveau | Cours | Passages recensés, avec répétitions | Passages couverts |
|---|---:|---:|---:|
| 1AP | 57 | 2 412 | 2 401 |
| 2AP | 61 | 1 519 | 1 519 |

Après déduplication, **3 342 textes fixes sur 3 353** disposent d'une correspondance enregistrée complète, contre 47 au départ. Les 118 cours ont des enregistrements ; 114 couvrent tous leurs passages fixes du périmètre. Les quatre autres sont des cours islamiques 1AP dont certaines questions ou règles citent un verset.

Les **11 passages restants contenant des citations coraniques** sont [identifiés séparément](completion/recitations-a-conserver.json). Le lecteur de récitation existant reste conservé. Aucun de ces passages n'a été synthétisé en remplacement d'une récitation appropriée.

L'inventaire suit entrée, lectures, explications, règles, énoncés, options de quiz 1AP et jeux pédagogiques. Il exclut les retours calculés, simulations et navigation. Un taux sur ces textes fixes ne certifie ni l'ensemble des interactions ni l'autonomie réelle de l'enfant.

## Production et réutilisation

**3 293 nouveaux MP3**, environ **4 h 14 min 35 s**, soit **155,6 Mo**, couvrent 3 295 textes supplémentaires grâce à deux réutilisations explicites. La V2 a été vérifiée avant les générations ; aucun équivalent exact cedar des demandes initiales n'était disponible. Le premier lot historique de 24 titres reste conservé.

Les signes isolés de tanwīn et de comparaison ainsi que le nombre 38 ont été traités explicitement. Pour ces cinq cas, `texte` garde le signe affiché et `spokenText` indique la lecture réellement demandée, par exemple « أَكْبَرُ مِنْ » pour « > ». Les noms de deux signes de tanwīn ont pu réutiliser des sons désormais disponibles en V1 ; trois nouvelles prises ont utilisé **3 réservations sur les 10 appels supplémentaires autorisés**. Il ne reste aucune prise inutilisable dans cette file. Une prise de « ضَ » avait été corrigée individuellement avant cette autorisation.

Quatre phonèmes initialement très faibles ont reçu un gain borné, consigné dans les métadonnées ; leurs WAV originaux restent conservés. Ils font partie des écoutes prioritaires. Le registre des reprises empêche une seconde reprise du même texte et un dépassement du quota, même après relance.

## Vérification et accès

- Chaque nouveau MP3 a une durée, une empreinte SHA-256 et un contrôle de décodage FFmpeg ; le signal WAV a été vérifié avant intégration.
- L'audit global vérifie **4 812 entrées de métadonnées**, sans erreur d'intégrité ni référence locale littérale manquante.
- **43 tests ciblés**, **7 scénarios Chromium**, TypeScript complet et construction de production réussis. Le navigateur vérifie tous les raccordements planifiés, décode des échantillons de chaque section et lit de vrais fichiers 1AP–2AP sans voix arabe installée. Les anciens messages Didou FR/AR et les 49 ajouts précédents passent également.
- Les nouveaux fichiers sont chargés à l'écoute, avec un cache de 400 fichiers au maximum pendant 30 jours. Le test de production démontre une première réponse complète, puis une lecture partielle hors connexion. Les sons non encore chargés nécessitent une connexion.

La prononciation et l'adéquation du débit doivent encore être validées à l'écoute, en priorité les phonèmes et les notions de numération. Le test Chromium ne remplace pas une recette Android réelle ni le test de l'APK. Le [protocole audio](../../audio-qa-protocol.md) reste applicable avant publication.

## Preuves et commandes

- [Bilan mesuré](completion/bilan.json), [couverture par cours](couverture.json), [11 textes à part](ar-manquants.json).
- [Plan figé par section](completion/manifest.json), [production et garde-fous](completion/README.md), [registre des reprises](completion/reprises-autorisees.json).
- Les inventaires se régénèrent avec `npm run audio:audit:early` et `npm run audio:audit:app` depuis `frontend`, sans service payant.

Autoévaluation : exactitude 4/5 (empreintes, décodage et raccordements vérifiés ; phonétique non certifiée), complétude 4/5 (périmètre fixe traité, 11 citations isolées et interactions dynamiques exclues), clarté 4/5 (périmètres et preuves séparés), action possible 4/5 (fichiers intégrés, recette Android à réaliser), concision 4/5 (mesures et limites regroupées). Priorités : écoute arabophone et retours Android, sans régénérer les sons utilisables.
