# La mission du jardin de Didou

## Une aventure complète à explorer

Trois séances de deux défis : préparer le jardin, prendre soin des plantes, puis partager et raconter. L’enfant peut faire une pause après chaque séance. Aucun délai, série quotidienne obligatoire ou compte à rebours.

Six versions : préscolaire, 1AP, 2AP, 3AP, 4AP et 5AP. **36 défis adaptés, construits avec six mécaniques réutilisées** ; cela ne signifie pas 36 compétences distinctes. Les six récits sont originaux. Une relecture par un enseignant reste souhaitable avant diffusion large.

## Accès

- Préscolaire : **Éveil → Ateliers → La mission du jardin de Didou**.
- Primaire : **Laboratoires → Cahiers → Laboratoires Premium → La mission du jardin de Didou**.

La première séance de deux défis est gratuite et rejouable. Les deux séances suivantes utilisent le droit Premium existant. Chaque séance suivante s’ouvre après les réussites de la précédente, avec ou sans aide. Les accès gratuits des anciens cours, jeux et activités restent inchangés. Aucun tarif ni quota d’impression modifié.

## Contenu et réponses

| Version | Préparer | Prendre soin | Partager et transmettre |
| --- | --- | --- | --- |
| Préscolaire | Semer 3 graines ; 3 + 1 = 4 | Un jeton d’eau par pot ; comprendre ce qui pousse après plusieurs jours | 3 tomates dans 3 paniers ; correspondance un cube/une assiette avec un adulte |
| 1AP | 6 graines ; 2 sachets de 3 | 2 jetons par pot ; retrouver qui apporte l’eau | 6 tomates en 2 groupes de 3 ; refaire avec des objets |
| 2AP | 3 rangées de 4 ; 3 sachets | 3 jetons par pot ; comprendre le rôle des étiquettes | 12 tomates en 3 groupes de 4 ; expliquer une vérification |
| 3AP | Rectangle plein de 12 unités ; 3 × 25 = 75 DA | 500 mL par pot avec des doses de 250 mL ; repérer le facteur modifié dans une expérience | 18 tomates en 3 groupes de 6 ; réinvestir une répartition ou un rectangle |
| 4AP | La moitié de 12 = 6 ; monnaie de 80 DA | 500 mL par pot ; poursuivre les observations avant de conclure | 12 tomates : 6 école, 3 maison, 3 amis ; représenter une fraction hors écran |
| 5AP | 3/4 de 20 = 15 ; 15 × 12 = 180 DA | 750 mL par pot ; limiter la conclusion aux conditions réellement observées | 25 % de 20 = 5, puis 15 réparties entre 3 familles ; expliquer une fraction hors écran |

Prix et quantités d’eau sont fictifs. Les scènes représentent une histoire sur plusieurs jours ; elles ne simulent pas une pousse instantanée ni une prescription d’arrosage. Les expressions mathématiques et compteurs sont isolés pour garder leur ordre en arabe.

## Guidage et progression

Didou explique la consigne et réagit à une réussite. Les illustrations vectorielles sont locales. L’interaction se fait au toucher ou au clavier, avec grandes cases et animations limitées. La réduction des mouvements est respectée.

Une erreur reste corrigeable. Un indice ou un premier échec fait enregistrer la réussite suivante « avec aide ». Un double clic après validation ne produit pas un deuxième succès. Toucher la séance déjà sélectionnée n’efface pas la construction. Annuler une sortie ou un redémarrage conserve le travail en cours.

Les résultats sont conservés ; les brouillons de constructions ne sont pas sauvegardés après une sortie confirmée. Une ancienne réussite reste dans le carnet après un essai ultérieur difficile, et le parent voit le dernier résultat.

Le dernier défi est une **observation de l’adulte**, accessible avec la porte parent existante. Il peut être reporté : le carnet indique alors « à reprendre ensemble », sans déclarer une réussite ni un apprentissage acquis. Le prochain petit pas repose sur les erreurs, les aides et les activités non essayées, sans IA générative.

## Stockage et langues

Au primaire, les résultats rejoignent le carnet familial existant, séparé par enfant et niveau. Au préscolaire, le carnet de mission est séparé par propriétaire, enfant et langue d’apprentissage. Une identité active d’un autre compte est rejetée. Ces observations restent **locales sur cet appareil** ; aucune synchronisation serveur nouvelle n’est annoncée.

Préscolaire : arabe, français et anglais. Primaire : français ou arabe selon la langue choisie. Les récits sont proposés dans cette langue, sans être présentés comme un cours de lecture d’une autre langue.

## Audio à compléter plus tard

Aucune génération ElevenLabs ou requête payante n’a été effectuée. Le moteur cherche les enregistrements existants puis utilise la synthèse du téléphone. Le fichier **v2-jardin-voix-todo.json** regroupe et déduplique les nouvelles consignes et lectures réellement proposées ; il évite de générer plusieurs fois une phrase partagée entre niveaux. La qualité des nouvelles voix dépend donc encore du téléphone.

## Vérification avant publication

Tests de données, calculs et dispositions ; interactions gratuites et Premium ; persistance et séparation des profils ; observation parent ; sortie annulée ; voix anglaise et arrêt du son. Parcours navigateur sur petit écran, inspection visuelle et audit automatique d’accessibilité ciblé. Le contrôle sur téléphone Android réel et la relecture pédagogique restent à effectuer.

### Résultats du lot

- 199 fichiers de tests frontend : **2 147 tests réussis**. Les données finales ont également été revérifiées après ajustement du tableau de semis de 2AP.
- Cinq scénarios navigateur réussis : mission primaire complète en français et arabe à 360 px ; découverte préscolaire dans les trois langues à 390 px. Les deux parcours primaires ont été rejoués après correction de la mise en page.
- Cases de semis vérifiées à au moins 44 × 44 px dans les parcours testés ; aucun débordement horizontal de page détecté.
- Audit automatique WCAG 2 A/AA : aucune violation détectée sur le carnet de la mission testé, sans certification de l’application entière.
- TypeScript et build web réussis. Avertissements préexistants de taille de certains blocs JavaScript conservés. Le build contient le tableau de semis de 2AP avec des emplacements libres, permettant une vraie vérification des rangées égales.
- 79 phrases audio inédites dédupliquées restent au TODO ; synthèse vocale en attendant.
- Aucun test sur appareil Android réel, aucune publication Android ni modification de main. Publication du lot sur v2 ; déploiement hébergé à vérifier séparément.
