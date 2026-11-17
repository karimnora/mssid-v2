# CX-24 — Textes Android : vérification locale

Date : 16 novembre 2026. Branche `v2`. Statut : relu par Claude, R1 et R2 corrigés le 17 novembre, prêt pour commit local. La case de la roadmap reste ouverte.

## Changements

- `TermsOfServiceModal.tsx` utilise `canUseWebCheckout()` : dans l'application native, les articles sur l'abonnement et les remboursements sont remplacés par le texte neutre arabe/français de CL-04, confirmé en section « Version affichée dans l'application Android » de CL-14. Le bandeau annonçant une gratuité totale et les renvois aux remboursements sont réservés au web.
- `PrivacyPolicyModal.tsx` utilise la phrase Android fournie par CL-14, section 3.2, à la place de la ligne annonçant la collecte d'un reçu. Ce changement limité permet de contrôler l'écran entier avec le même garde-fou. La réécriture complète des documents légaux et des fichiers publics relève du lot prévu par CL-14.
- `NativeNoPaymentWording.test.tsx` contrôle le texte réellement rendu de `TermsOfServiceModal`, `PrivacyPolicyModal`, `GameStationSheet`, `MissionBanner`, `DiagnosticModal`, `ExamPlanPanel` et `MusaidiPanel`, en arabe et en français. Les cinq derniers sont placés dans leur état verrouillé ou de quota atteint, avec le vrai bouton Premium. Le panneau d'état d'abonnement et les contrôles existants des dictionnaires restent couverts.
- Le garde-fou détecte aussi CCP et les mots arabes vocalisés. Un test rend les anciennes conditions en mode web et vérifie qu'elles sont rejetées par ce garde-fou ; les variantes web sont conservées.

## Validation

```text
npx vitest run src/components/NativeNoPaymentWording.test.tsx
```

Résultat final : **19 tests réussis, un fichier, zéro échec**. Les premiers échecs venaient des nouvelles fixtures : contexte Auth incomplet, diagnostic entièrement sauté sans détail verrouillé et libellé arabe du bouton Musaidi incorrect. Les fixtures ont été corrigées, puis le fichier a été relancé avec succès. Aucun composant de jeu ni contenu pédagogique n'a été modifié.

`git diff --check` : aucune erreur d'espacement.

## Suite de la relecture — 17 novembre 2026

Claude a relu ce lot dans `docs/v2-relecture-cx-04-cx-24.md` : R1 et R2 sont corrigés. Le garde-fou reconnaît les mots arabes de prix et d'achat, y compris vocalisés, sans bloquer « اشتراك » / « اشتراكي ». La phrase native de confidentialité reprend le texte neutre corrigé dans CL-14.

La dernière exécution réussit 29 tests dans le garde-fou : 27 propres à CX-24 et deux cas de navigation légale depuis l'inscription, rattachés au commit CX-04. Les cinq fichiers d'interface concernés totalisent 50 tests distincts réussis (37 dans les trois fichiers relancés après les derniers ajouts et 13 tests voisins déjà réussis). Le fichier du garde-fou est indexé partiellement pour que le commit CX-24 ne dépende pas encore de CX-04.

## Suite et limites

- Relecture croisée de Claude avant commit (règle 3 de la roadmap).
- Aucun build, aucune suite complète, aucun test navigateur ni essai dans une WebView Android. Les tests simulent `Capacitor.isNativePlatform()` ; l'essai sur appareil reste CX-22.
- Aucun commit, push ni changement sur `main`. L'image Docker du site n'a pas été reconstruite.
- Vérification en lecture seule de `main` : les deux anciens textes de paiement y existent également. Le report à préparer est inscrit sous M-12 dans `docs/a-reporter-sur-main.md`, avec un risque estimé de 2/5 ; aucune branche de report n'a été créée pour ce lot.
