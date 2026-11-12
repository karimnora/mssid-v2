# Correctifs de présentation et de lecture des cours

12 novembre 2026. V1 locale, sans publication.

## Réalisé

1. **Statut de vérification réservé à l'administration.** Le bloc qui affichait « contenu à vérifier », « corroboré » ou « officiellement vérifié » est retiré du lecteur enfant. Les champs de provenance, les filtres et contrôles administratifs restent présents ; aucun cours n'a été déclaré vérifié par cette modification.
2. **Groupes de milliers harmonisés.** Inventaire initial : 956 occurrences dans sept fichiers du catalogue. Le script `frontend/scripts/normalize-course-thousands.cjs` modifie uniquement les chaînes de texte, pas les valeurs numériques du code. Première passe : 476 chaînes. La passe typographique insécable harmonise 477 chaînes, dont une qui comportait déjà des espaces. Les séparateurs décimaux existants ne sont pas convertis.
3. **Arabe RTL : espace fine insécable U+202F.** Un contrôle Chromium a reproduit l'inversion visuelle de `23 405` avec l'espace ordinaire. U+202F conserve le bon ordre des groupes et empêche leur séparation en fin de ligne. Les expressions mathématiques et la comparaison des réponses entières acceptent cette typographie ; l'enfant peut saisir `23405` ou `23 405`.
4. **Haut de leçon plus court.** Les objectifs restent consultables dans un élément dépliable fermé au départ. Sur petit écran, un sélecteur natif de 60 px remplace la grille des onglets ; les étapes restent librement accessibles. La grille est conservée sur les écrans plus larges.
5. **Écoute 4AP–5AP conditionnée à une voix disponible.** Les boutons sont cachés pendant la détection et si la langue du cours n'est pas disponible. Une liste de voix vide termine désormais la détection après environ deux secondes. Les enregistrements et le chemin de lecture des petites classes sont conservés. Les abonnements aux changements de voix ne s'écrasent plus entre composants.

Le script démarre en mode aperçu sans `--write`. Il reconnaît la notation de milliers présente dans ce catalogue ; une virgule suivie de trois chiffres peut être ambiguë dans un futur contenu. Relire le contexte avant de relancer une migration sur de nouveaux cours, notamment des décimaux. Ce lot ne remplace pas une vérification pédagogique de toutes les valeurs.

## Réessai guidé

Karim a ensuite **validé les deux cours de référence 4AP–5AP**. Le réessai guidé a été étendu à l'onglet « أتدرب », avec correction directement accessible lorsqu'aucun indice exploitable n'existe. Voir le [compte rendu de cette extension](2026-11-12-reessai-guide-entrainement.md). Cette validation de référence ne constitue pas à elle seule une observation de l'autonomie d'enfants.

## Vérification

- **87 tests réussis dans 11 fichiers** : catalogue, mise en forme, réponses numériques, voix indisponibles, lecteur de leçon, exercices, pilotes et contrôles de revue admin.
- **20 tests de lecture vocale existants réussis dans quatre fichiers supplémentaires**, dont le chemin Android simulé.
- **12 scénarios Chromium réussis** : navigation des cinq niveaux, quatre parcours pilotes, puis mobile 4AP avec aucune voix, une voix française seule et une voix arabe.
- Les nouveaux tests navigateur vérifient l'ordre visuel réel des groupes de chiffres, les objectifs dépliables, le changement d'étape sur mobile et l'absence de bouton d'écoute inopérant en 4AP.
- TypeScript complet et `git diff --check` réussis. Nouvelle exécution du script en mode aperçu : zéro changement, ce qui vérifie son idempotence sur le catalogue actuel.
- Captures actualisées : `output/lesson-polish-preview/`, `output/course-design-preview/`, `output/pedagogy-preview/`.

Pas de test sur Android physique ni de nouvelle voix enregistrée. Les tests simulant Android ne prouvent pas la disponibilité d'une voix sur le téléphone de Karim.

## Relecture

Exactitude 4/5 : inversion RTL reproduite puis corrigée, pas de revue enseignant de tout le catalogue. Couverture 4/5 : quatre ajustements livrés et réessai global conditionné aux retours. Clarté 4/5 : lecteur simplifié, perception par les enfants à observer. Caractère opérationnel 4/5 : tests, captures et accès Wi-Fi local disponibles, pas de recette physique. Concision 4/5 : composants existants réutilisés, migration limitée aux textes et sans nouvelle fonction de gamification.
