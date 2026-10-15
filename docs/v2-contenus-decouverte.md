# V2 — Découvertes et mathématiques visuelles

## Références consultées le 15 octobre 2026

| Source officielle | Principe retenu | Adaptation originale dans Mssid |
| --- | --- | --- |
| [Toy Theater, Fraction Strips](https://toytheater.com/fraction-strips/) | Représenter des fractions avec des surfaces manipulables | Carreaux égaux, plusieurs dispositions correctes, explication après validation |
| [DragonBox, For Educators](https://www.dragonbox.com/educators) | Comprendre en manipulant, puis expliquer avec un adulte | Construire des groupes ou un rectangle ; accepter la quantité uniquement si la disposition respecte aussi la consigne |
| [LogicLike, Educational Games](https://logiclike.com/en/educational-games) | Suites et puzzles de difficulté graduelle | Nouvelles suites AB, ABB et AAB dans de petites histoires préscolaires |
| [Khan Academy Kids](https://learn.khanacademy.org/khan-academy-kids/) | Personnages guides, histoires et activités variées | Didou accompagne les défis ; décors simples et illustrations vectorielles locales |

Les pages publiques ont été consultées. Aucun espace abonné ni tableau de bord privé n’a été inspecté. Les textes, illustrations, code et corrigés ajoutés sont originaux ; aucune ressource de ces produits n’est copiée. Leurs promesses commerciales ne sont pas considérées comme des preuves d’efficacité de Mssid.

## Préscolaire : trois parcours, douze activités

Accès : Éveil → Apprendre → Tracé et créatif.

- **Le petit jardin de Didou** : compter trois fleurs, continuer une suite feuille/fleur, associer les images identiques, ordonner la plantation puis raconter.
- **Le pique-nique des amis** : compter quatre pommes, suite pomme/poire/poire, associations visuelles, prendre/laver/manger la pomme.
- **L’atelier des petits artisans** : compter cinq carreaux, suite bleu/bleu/orange, associations, terre/carrelage/mosaïque.

Chaque parcours possède quatre étapes et un décor illustré. Les histoires ont trois nouvelles images vectorielles ; les quantités sont dessinées en groupes lisibles, sans dépendre des emojis du téléphone. Les suites et associations utilisent les composants existants.

Consignes, titres, légendes et conseils parent disponibles en arabe, français et anglais. La langue choisie reste celle de l’activité. Les réussites et tentatives passent par le suivi préscolaire existant. Ces douze activités enrichissent l’accès existant sans le verrouiller derrière Premium.

## Primaire : quinze défis de mosaïques

Accès : Laboratoires → Cahiers → Laboratoires Premium → Les mosaïques de Didou.

| Niveau | Trois défis | Ce qui est réellement validé |
| --- | --- | --- |
| 1AP | Poser 4, 6 puis 9 carreaux | Compter chaque case une seule fois |
| 2AP | Trois rangées de 2, 3 puis 4 carreaux | Même quantité dans chacune des trois rangées |
| 3AP | Rectangles de 6, 9 puis 12 unités d’aire | Bloc rectangulaire contigu, complet, sans trou ; carré accepté |
| 4AP | 1/2, 3/4 puis 2/3 d’une surface de 12 cases | Quantité correspondant à la fraction, sans imposer une disposition décorative |
| 5AP | 2/5 de 10, 3/4 de 20, 25 % de 16 | Fraction de quantité, équivalence et pourcentage |

Chaque case se pose et se retire au toucher ou au clavier. Aucune vitesse exigée. Une erreur permet de modifier la construction. L’indice et les essais incorrects entraînent une observation « avec aide » lors de la réussite suivante. Une réponse validée ne peut pas être enregistrée plusieurs fois par des clics répétés.

Premier défi gratuit et rejouable à chaque niveau ; les deux suivants utilisent les droits Premium déjà existants. Aucun tarif ou quota d’impression modifié. Les observations sont séparées par enfant et niveau, stockées sur cet appareil. Un ancien succès reste dans le carnet même après une reprise difficile ; le parent voit aussi le dernier résultat.

Les défis constituent un enrichissement pédagogique : aucune certification d’alignement exhaustif au programme scolaire n’est revendiquée. Une relecture par un enseignant reste utile avant généralisation.

## Audio et accessibilité

Les enregistrements existants sont recherchés automatiquement avant le recours à la synthèse vocale. Aucune requête payante ElevenLabs n’est effectuée. Les nouvelles phrases qui n’ont pas de clip restent en synthèse vocale ; la qualité dépend du téléphone. Elles pourront être regroupées et dédupliquées dans un prochain lot d’enregistrement.

Les expressions mathématiques affichées sont isolées pour garder leur ordre dans les paragraphes arabes. Les cases ont un état accessible et une zone tactile minimale de 44 pixels. Animations limitées et mode de réduction des mouvements respecté par la nouvelle mosaïque. Les décors sont décoratifs et ignorés par les lecteurs d’écran.

## Objectif commercial : 25 %

C’est un objectif à tester, pas un résultat garanti. Pour rendre la mesure exploitable, utiliser par exemple une cohorte de familles actives qui ont terminé une découverte gratuite, puis mesurer sur 30 jours la part ayant un abonnement réellement activé. Exclure comptes de test et enfants d’un même foyer du dénominateur. Ne pas confondre clic sur l’offre, envoi d’un reçu et paiement validé.

Ce lot n’ajoute pas de collecte analytique sur les enfants. Les prochains travaux commerciaux doivent d’abord vérifier la couverture réelle des événements et le consentement existant.

Priorités suivantes : tester compréhension et plaisir avec des familles ; relire les contenus avec un enseignant ; compléter les voix réellement manquantes ; mesurer sur Android modeste ; proposer ensuite des packs hors ligne maîtrisés et approfondir les compétences les plus utiles. Aucun mode hors ligne complet ou gain d’apprentissage mesuré n’est annoncé ici.

## Vérifications

- Suite frontend complète : **196 fichiers, 2 133 tests réussis**.
- Parcours navigateur : trois langues préscolaires à 390 px et parcours mosaïques français/arabe à 360 px ; persistance après rechargement et annulation de sortie vérifiées.
- Audit automatique WCAG 2 A/AA : aucune violation détectée dans le nouvel atelier testé. Cela ne constitue pas une certification de toute l’application.
- Contrôle TypeScript réussi ; build web réussi. Les avertissements préexistants sur la taille de certains blocs JavaScript restent présents.
- Contrôle visuel des captures mobile : groupes dénombrables distincts, textes et nombres, tailles des cases, navigation.
- Aucun appareil Android réel testé, aucun APK publié dans ce lot.
