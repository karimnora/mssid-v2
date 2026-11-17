# CX-04 — Consentement parental : vérification locale

Date : 16 novembre 2026. Branche `v2`. Statut : relu par Claude, réserves levées le 17 novembre, prêt pour commit local. La case CX-04 reste ouverte.

## Comportement livré

- Inscription par e-mail : case obligatoire non cochée, texte arabe/français de CL-03, liens légaux de 16 px et zone de sélection de 60 px minimum. Le serveur refuse un accord absent, faux ou d'une ancienne version avant de créer le compte.
- Nouveau compte Google : identité vérifiée d'abord, puis étape d'accord avant création. Annuler ne crée aucun compte. Un compte Google existant conserve sa connexion et passe par le parcours des comptes anciens si nécessaire.
- Migration V112 : colonnes `parental_consent_at` et `parental_consent_version`, laissées nulles pour les anciens comptes. La date vient du serveur, version `parental-consent-2026-11-v1`. Les champs retournés au client sont en lecture seule.
- Compte existant : demande derrière la protection parent, case non cochée, choix « Plus tard », rappel dans le carnet parent. Les parcours locaux restent disponibles ; les écritures de profils enfants, progression, instantanés d'apprentissage et appels pédagogiques IA sont bloquées côté client avant toute requête et côté serveur avant le contrôleur.
- Après confirmation du serveur, les progrès conservés localement sont restaurés et leur envoi est relancé. Une réponse tardive ne peut pas accepter l'accord pour un autre compte connecté.
- Une ancienne version impose un nouvel accord. Les lectures, l'authentification, les actions sur le compte parent et les suppressions restent disponibles. Le retrait du consentement relève du lot B / CX-18.

## Vérifications effectuées

### Frontend

62 tests réussis dans les six fichiers ciblés ci-dessous (61 lors de la première relance, puis ajout et réussite d'un test de conservation/reprise des progrès ; les cinq tests de ce dernier fichier ont été relancés) :

```text
npx vitest run src/utils/parentalConsent.test.ts src/components/AuthModal.consent.test.tsx src/components/ParentalConsentPrompt.test.tsx src/services/authService.test.ts src/services/springBootApi.test.ts src/services/parentalConsentSession.test.ts
npx vitest run src/services/parentalConsentSession.test.ts
```

Le premier passage avait relevé deux anciens jeux de données sans métadonnées d'accord et un test dont le faux contexte Auth ne redessinait pas le rappel après acceptation. Ces tests ont été corrigés puis relancés avec succès. Les tests voisins AuthModal, AuthModal.native, AuthModal.network, progressSync et ParentNotebookModal avaient aussi réussi au premier passage ciblé.

### Serveur

47 tests distincts réussis dans sept classes, sous Java 21 avec les dépendances Maven locales :

```text
mvn -o -B -Dtest=AuthServiceTest,AuthControllerTest,ParentalConsentServiceTest,GoogleParentalConsentTest,ParentalConsentFilterTest,ParentalConsentControllerTest test
mvn -o -B -Dtest=ParentalConsentPersistenceIT,ParentalConsentFilterTest test
```

Le premier groupe a réussi ses 43 tests. Le second a réussi ses sept tests : trois d'intégration et quatre du filtre, dont trois déjà présents dans le premier groupe.

L'intégration utilise exclusivement `jdbc:postgresql://localhost:5433/mssid_v2_cx04_test`, une base dédiée créée dans PostgreSQL V2 local, avec le profil `v2`. Les 29 migrations ont été appliquées sur cette base neuve, jusqu'à V112. Chaque scénario est transactionnel et annulé après le test ; les services d'e-mail sont remplacés par des doublures.

Les scénarios prouvent l'absence de compte après refus, l'enregistrement SQL de la version et d'une date serveur malgré une fausse date client, le blocage effectif des écritures avec un JWT valide d'ancien compte, la reprise après accord et le refus d'une ancienne version.

Le premier passage d'intégration a relevé un chemin servlet vide dans MockMvc : le filtre utilise maintenant le chemin de requête sans le contexte dans ce cas. Une régression dédiée couvre aussi un contexte non vide ; les tests d'intégration et du filtre ont ensuite réussi.

## Suite de la relecture — 17 novembre 2026

Claude a validé le serveur et demandé B1 (fenêtres légales internes sur Android) et B2 (séparer CX-05). B1 est corrigé : les deux formulaires d'inscription transmettent leurs rappels internes ; en leur absence, notamment pour le compte existant, la case ouvre directement les fenêtres internes au-dessus du dialogue d'accord. Sur Android, aucun lien public vers `terms.html` / `privacy.html` n'est rendu. Le web garde ses liens. L'ouverture d'un texte légal ne coche ni n'enregistre le consentement.

Les trois fichiers demandés par la relecture passent : `NativeNoPaymentWording`, `AuthModal.consent`, `ParentalConsentPrompt` (37 tests). Les deux tests voisins `AuthModal` / `AuthModal.native` avaient aussi réussi, soit 50 tests distincts d'interface. Aucun code serveur n'a changé depuis les 47 vérifications précédentes.

B2 est traité par l'indexation des seuls import et rendu de `ParentalConsentPrompt` dans `App.tsx` pour CX-04 ; le renommage de l'accueil et les cadenas appartiennent au commit séparé CX-05, déjà relu favorablement par Claude le 17 novembre. D1 à D3 restent explicitement à traiter avant mise en ligne (CX-23 et CX-08).

## Limites et suite

- Aucun build Docker, aucune suite complète, aucun test navigateur, aucun push, aucun changement sur `main` ni changement de permissions.
- Le site Docker déjà ouvert sur `localhost:3002` utilise encore son image précédente ; ce lot n'y est pas activé. L'autorisation de build antérieure concernait CX-01.
- Google est couvert par des tests du vérificateur d'identité et du formulaire avec des doublures ; aucun compte Google réel n'a été utilisé pour ce lot.
- Relecture de Claude avant commit, conformément à la règle 3 de `docs/v2-todo-claude-codex.md`. Les modifications des autres lots restent hors de ce travail.
