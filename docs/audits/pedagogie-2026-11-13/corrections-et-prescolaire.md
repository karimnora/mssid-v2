# Corrections pédagogiques et préscolaire — 13 novembre 2026

Travail local, sans push ni déploiement. Ce bilan complète l’audit historique ; ses reproductions décrivent la version antérieure et ne sont pas réécrites.

## Bugs et ambiguïtés corrigés

- Quiz : conserver les signes arabes lorsque leur suppression rend des choix identiques ou vides. Couvre les quatre questions identifiées dans l’audit.
- Jeu du tanwin : conserver les marques indispensables aux six choix.
- Défis : lire le texte vocalisé d’origine pour retrouver les enregistrements correspondants ; ne plus imbriquer le bouton d’écoute dans le bouton de réponse. Cacher les commandes quand ni voix ni enregistrement correspondant n’est disponible.
- Examens : employer la langue de la matière pour les passages sans arabe, conserver l’arabe pour les intitulés arabes. Régression vérifiée sur un exercice français de 3AP. Les paragraphes mêlant plusieurs langues ne bénéficient pas d’un découpage vocal phrase par phrase.
- Nombres : remplacer les virgules de groupement par des espaces fines insécables dans les banques d’examens et de défis, sans modifier les nombres décimaux ni les littéraux numériques TypeScript. Vérification reproductible : `node frontend/scripts/normalize-course-thousands.cjs --banks` ; résultat après corrections : aucun changement restant.
- Sciences 3AP : remplacer l’idée d’un air « pollué par les poumons » par une formulation sur l’air expiré et le dioxyde de carbone.
- Maths 3AP : parler de la masse du sac de pommes en kilogrammes.
- Proportionnalité 4AP : remplacer `2 = 100` par des quantités explicites, deux cahiers et leur prix en dinars.
- Défis : retirer les promesses inexactes de dix questions, deux minutes ou une à deux questions.

Les récompenses de révision et les outils de correction d’examen selon la classe sont des choix produit relevés dans l’audit, pas des erreurs techniques démontrées : leur comportement n’a pas été modifié.

## Préscolaire livré

- 23 modules, **206 activités**, dont 20 dans les deux parcours de nombres, contre 14 auparavant.
- Six préparations guidées pour les quantités de 3 à 8. Des places visuelles soutiennent le comptage, puis l’activité d’origine propose le même objectif sans ces repères.
- Ajout par toucher ou clavier en complément du glisser-déposer ; plafond de quantité uniquement dans les étapes guidées et retour au plateau possible. Sans aide, le panier accepte les objets en trop et « J’ai fini » vérifie la quantité exacte. Le compteur ne révèle plus la quantité attendue.
- Histoires : modèle consultable, légendes agrandies, conservation des étapes justes après une erreur, étape de récit oral conservée.
- Une idée à pratiquer en famille accessible dans chaque parcours, dans les trois langues. Conseils spécifiques pour les histoires, le corps, les émotions et le calendrier.
- Didou illustré avec les images existantes de la V2, selon son humeur ; mouvement d’attente limité.
- Accueil avec décor du village réutilisé, « Apprendre » prioritaire sur mobile, cartes plus compactes et suppression du second bandeau d’impression. Impression toujours accessible dans la barre supérieure.

## Audios et progression

Aucun fichier audio supprimé, remplacé ou généré. Aucun appel payant. Les six étapes guidées héritent des textes, fichiers et durées enregistrés de leur activité source, sans modifier les paroles. Les tests comparent ces données et contrôlent les fichiers du catalogue existant.

Les identifiants des anciennes activités sont conservés. La revue de Claude a corrigé la régression de progression : réussir une activité ordinaire implique désormais la réussite de sa préparation guidée. Cela s’applique au chargement des anciennes sauvegardes et immédiatement après une réussite dans la session courante. Une aide réussie ne valide jamais l’exercice ordinaire.

## Validation

- **904 tests unitaires et composants réussis**, 34 fichiers, incluant les banques d’examens et défis, le catalogue préscolaire et les correspondances des enregistrements.
- **9 scénarios navigateur distincts réussis** : parcours d’examen, défi complet, ateliers mobiles, enregistrements FR/EN sans voix correspondante du téléphone, comptage guidé à 320/390/1280 px, absence de contrôles imbriqués dans un défi 1AP.
- Contrôle TypeScript complet réussi, avec 8 Go de mémoire alloués au processus.
- Compilation de production réussie. Avertissement existant sur la taille de certains bundles ; précache PWA d’environ 67,5 Mio. Les nouveaux parcours n’ajoutent pas de fichiers audio à télécharger.
- Inspection visuelle des captures d’accueil et de comptage à 390 px. Aucun débordement horizontal détecté dans le scénario de comptage aux trois largeurs testées.
- Premières exécutions corrigées : tests audio lancés depuis le mauvais répertoire ; attente navigateur initialement trop courte pour le chargement local ; erreur JSX intermédiaire détectée et corrigée avant validation finale.

## Suite du contenu

Ce lot améliore l’accompagnement des activités existantes. Il ne crée pas encore les nouvelles histoires du marché, de la plage et de la grand-mère, ni un module d’hygiène séparé. Leur rédaction, leurs illustrations et leurs nouvelles narrations cohérentes restent à préparer ; aucun ancien audio n’a été affecté à une histoire différente pour simuler une couverture enregistrée.

Une nouvelle séance quotidienne et une nouvelle planification des erreurs n’ont pas été ajoutées : le défi quotidien existant reste en place. La validation sur un Android réel et avec quelques enfants reste à faire avant publication.

## Autoévaluation

| Axe | Note | Éléments et limite |
| --- | --- | --- |
| Exactitude | 4/5 | Régressions, contenu et compilation contrôlés ; écoute sur Android physique encore nécessaire. |
| Complétude | 4/5 | Corrections et accompagnement préscolaire livrés ; nouvelles histoires et hygiène séparée restent une suite identifiée. |
| Clarté | 4/5 | Changements, conservation des audios et limites explicités ; les réactions d’enfants ne sont pas encore observées. |
| Action possible | 4/5 | Parcours locaux et scénarios mobiles testables ; validation parent/enfant avant publication. |
| Concision | 4/5 | Bilan séparé de l’audit historique ; détails techniques réservés à ce document. |

Moyenne : 4/5. Priorités suivantes : test réel sur téléphone, observation des étapes guidées avec un enfant, puis nouveaux récits avec des narrations adaptées. Cette appréciation doit être confrontée aux retours de Karim et des familles.


## Revue de Claude intégrée

Les deux corrections sont conservées : progression acquise reconnue et véritable comptage sans aide. Complément de Codex : appliquer aussi les étapes guidées implicites immédiatement lors d’une réussite, et tester leur sauvegarde dans le parcours de l’application. Le délai explicite du premier chargement navigateur et les sélecteurs des tests de cours/mobile sont relus et validés avant commit. Aucun audio ni texte enregistré n’est modifié.

Validation de la revue : 917 tests préscolaires réussis dans 46 fichiers ; les 3 tests de navigation/intégration, dont le nouveau cas de réussite immédiate, passent également en exécution ciblée. Typage complet réussi. Les 13 scénarios navigateur distincts passent après reprise isolée des trois cas de maths : le premier passage concurrent avait dépassé les 60 secondes sur le premier cas, avec réponse et explication présentes dans la capture. Aucun changement du code produit pour contourner cet échec de durée.


Mise à jour du lot suivant : les neuf nouveaux récits et leurs questions sont maintenant ajoutés avec leurs enregistrements dans les trois langues. Voir [le bilan des histoires](../../audio-v1/histoires-prescolaire/README.md). Le module d’hygiène séparé reste hors de ce lot.
