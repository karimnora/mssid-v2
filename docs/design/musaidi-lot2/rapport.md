# مساعدي — lot 2 : valeur Premium

Branche `v2`. Travail local, sans commit, push ni déploiement.

## Résultat
- Trois suggestions au maximum à partir des erreurs non résolues ou du dernier échec dans les 30 jours. Chaque suggestion affiche sa raison et reste dans la classe et le catalogue publiés reçus. Aucune suggestion sans données.
- Gratuit : questions de la leçon actuelle ou de la dernière leçon ouverte, conservée même après un atelier. Indices, règle, voix et trois corrections complètes par jour conservés ; quota familial inchangé.
- Premium : étapes préparées révélées progressivement. « Essayer » ouvre une zone de réflexion sans note ; aucun correcteur génératif et aucun diagnostic sur le texte saisi.
- Après les étapes, question jumelle de la même compétence, uniquement si une question différente et un QCM vérifiable existent. Résultat remonté avec `helped: true`, sans XP ni validation de leçon. La compétence exacte est transmise au carnet.
- Révisions du trimestre sur les erreurs réelles quand le compte à rebours fourni par l’application est actif.
- Résumé dans le carnet parent Premium : nombre réel de demandes et leçon à revoir. Une demande est comptée à la première aide explicite dans une ouverture de question (indice, règle, méthode ou correction), sans recompter les étapes.
- Isolation par propriétaire de progression : remise à zéro de l’écran au changement d’enfant et rejet des retours asynchrones d’une ancienne vue.
- Formats officiels : correction préparée à deux colonnes depuis le module `TwoColumnProblem`, tableau grammatical et fractions isolées en LTR.
- Marque Premium et offre parent existantes réutilisées. Protection parent placée au-dessus du tuteur.
- Quatre événements anonymes : suggestion ouverte, correction ouverte, question jumelle réussie, révision ouverte. Aucun identifiant d’enfant, énoncé ou réponse transmis.

## Fichiers concernés
- Intégration : `App.tsx`, `AppModals.tsx`, `AiTutorModal.tsx`, `musaidi/MusaidiPanel.tsx`.
- Affichage : `MusaidiCorrection.tsx`, `MusaidiTwin.tsx`, `MusaidiText.tsx`, `MusaidiParentSummary.tsx`, `GuidedMathSupport.tsx`, `TwoColumnProblem.tsx`.
- Données : `musaidiBank.ts`, `musaidiPersonalization.ts`, `musaidiHistory.ts`, `competenceProgress.ts`, `lastActivity.ts`.
- Offre : `PremiumOffer.tsx`, `ParentGateModal.tsx`, `premiumFunnel.ts`.
- Parent : ajout ciblé à `ParentNotebookModal.tsx`, en conservant ses modifications préexistantes.
- Serveur : `PremiumFunnelService`, son test et migration `V111__add_musaidi_premium_events.sql`.

## Vérifications
- Tests frontend ciblés : 55 tests réussis dans 13 fichiers.
- Tests serveur `PremiumFunnelServiceTest` sous Java 21 : 3 réussis.
- TypeScript : contrôle final réussi après toutes les modifications.
- Captures en 360×640 et 390×844 : suggestions, correction progressive, question jumelle, carnet et protection parent.
- Captures sur profil de démonstration local et contenu existant ; aucune donnée réelle d’enfant.
- Aucun débordement horizontal, erreur JavaScript ni bouton inférieur à 60 px dans les vues du tuteur contrôlées. Protection parent à la couche 130 vérifiée.
- L’aperçu temporaire a été retiré après capture.

## Limites et suite
- Les compteurs d’aide du parent sont locaux à cet appareil, par enfant. Pas encore de synchronisation multi-appareils de ces compteurs.
- Une question jumelle n’est proposée que si la compétence est fiable et qu’un QCM existant permet une validation réelle ; sinon rien n’est inventé. Les formats d’exercice libre, classement et appariement ne sont pas ajoutés à ce parcours.
- Aucun nouveau contenu pédagogique. Les manques de compétences et de questions restent à inventorier au lot 3.
- Pas de test familles, de TalkBack sur téléphone physique ni de migration appliquée à une base déployée. La migration V111 doit accompagner le déploiement serveur pour les nouveaux événements.
- Le calendrier des compositions reste celui de l’application existante.
