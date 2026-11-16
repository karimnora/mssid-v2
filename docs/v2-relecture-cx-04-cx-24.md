# Relecture Claude — CX-04 (consentement parental) et CX-24 (textes Android)

16 novembre 2026, règle 3 de `docs/v2-todo-claude-codex.md`. Relecture du code non commité sur `v2` et des comptes rendus `v2-cx-04-verification.md` et `v2-cx-24-verification.md`. Je n'ai pas relancé les tests : je m'appuie sur ceux de Codex.

**Verdict : CX-24 peut être commité après deux petites retouches. CX-04 peut être commité après correction du point bloquant B1 et séparation de B2.**

## CX-04 — Consentement parental

### Ce qui est bon

- Serveur : refus avant toute création de compte (inscription et nouveau compte Google), date posée par le serveur, version vérifiée, champs renvoyés en lecture seule, migration V112 sans valeur par défaut pour les anciens comptes.
- Filtre `ParentalConsentFilter` placé après le JWT. J'ai comparé sa liste à toutes les routes d'écriture des contrôleurs : il couvre bien les profils enfants, la progression, le profil, les instantanés d'apprentissage, Musaidi et l'IA. Les routes laissées ouvertes sont des actions de parent ou de compte (reçu de paiement, code d'activation, e-mail du parent, cahiers) ou ne lisent pas l'identité (`/analytics/premium-funnel` ne prend que la charge utile, pas l'utilisateur). Le miroir côté client (`isChildDataWrite`) a la même liste.
- Annuler l'étape Google ne crée aucun compte ; une réponse tardive ne peut pas valider l'accord d'un autre compte.

### Bloquant avant commit

| # | Constat | Correction |
|---|---|---|
| **B1** | La case de consentement (`ParentalConsentCheckbox.tsx`) renvoie vers `/privacy.html` et `/terms.html`, des pages publiques ouvertes dans un nouvel onglet. `public/terms.html` contient encore 5 mentions de prix, de paiement ou de remboursement : dans l'application Android, ces liens montrent exactement ce que CX-24 vient de retirer (règle 9 : aucun prix dans l'application Android). Avant ce lot, le formulaire ouvrait les fenêtres internes `TermsOfServiceModal` et `PrivacyPolicyModal`. | Passer à la case deux rappels `onOpenTerms` / `onOpenPrivacy` et ouvrir les fenêtres internes (celles de CX-24), au moins quand `canUseWebCheckout()` est faux. Ajouter un cas au garde-fou `NativeNoPaymentWording.test.tsx` : formulaire d'inscription en mode natif, clic sur les deux liens. |
| **B2** | `App.tsx` contient, en plus du branchement du consentement, le changement de **CX-05** (« Village ouvert aux comptes gratuits ») : `premiumPlanetHome` → `worldHome`, retrait de `isPremiumRole` ; `components/journey/JourneyMap.tsx`, `journey.css` et `JourneyScreen.access.test.tsx` en font partie. *(Correction du 16 novembre : j'avais d'abord pris ce changement pour un écart de produit ; c'est une tâche prévue.)* | Commiter CX-05 dans son propre commit, avec sa propre relecture ; pour CX-04, ne garder dans `App.tsx` que l'import et `<ParentalConsentPrompt />`. |

### À décider avec Karim (non bloquant pour le commit sur `v2`, bloquant avant la mise en ligne)

| # | Constat | Proposition |
|---|---|---|
| D1 | **Anciennes versions de l'application Android.** Le serveur V2 refusera toute inscription sans les nouveaux champs : une application déjà installée (V1) recevra une erreur 400 sans message utile. Et pour les comptes existants, toutes les écritures sont bloquées tant que l'accord n'est pas donné ; une ancienne application n'affiche pas la demande, donc la progression cessera d'être enregistrée sans que la famille le sache. | Avant la mise en ligne : version minimale obligatoire de l'application (écran « mettez à jour ») ou, à défaut, un message clair renvoyé par le serveur (`code: "APP_UPDATE_REQUIRED"`). À ajouter au plan de mise en ligne (CX-23). |
| D2 | **La demande s'ouvre à chaque séance, directement sur la porte parents**, pour tout compte existant sans accord, par-dessus ce que fait l'enfant (z-index 200), y compris pendant une leçon. Un enfant seul la fermera à chaque fois (« لاحقاً »). | Ne pas l'ouvrir d'office pendant une activité : bandeau discret à l'accueil (« سؤال لوليّ الأمر ») qui ouvre la porte parents, plus le rappel déjà présent dans le carnet. |
| D3 | Le formulaire d'inscription dit maintenant que seul le parent crée le compte (`consentParentIntro`), mais le champ de nom reste « الاسم الكامل » avec un exemple d'enfant. On ne sait plus de qui c'est le nom. | « اسم الطفل أو لقبه » (même correction que M-03 sur `main`, point E3 des essais). |

## CX-24 — Textes Android

### Ce qui est bon

- Conditions et politique de confidentialité basculent selon `canUseWebCheckout()` ; les variantes web restent intactes.
- Le garde-fou rend les vrais écrans (7 composants, arabe et français) et prouve qu'il attrape les anciens textes.

### Retouches avant commit

| # | Constat | Correction |
|---|---|---|
| R1 | Le garde-fou `FORBIDDEN` ne contient presque que des mots français ou latins (`prix`, `achat`, `DA`…). En arabe, seul « دج » est cherché : « سعر », « ثمن », « شراء », « اشترِ », « اقتنى », « دفع » passeraient. | Ajouter `/سعر|ثمن|شراء|اشتر|اقتن|الدفع|دفعة/` (après suppression des voyelles, comme c'est déjà fait). |
| R2 | La phrase Android de la politique de confidentialité, « إذا اقتنيتم اشتراكاً من موقعنا، نحتفظ بالمعلومات اللازمة لتفعيله », vient de mon document CL-14 (section 3.2). Elle parle d'achat sur le site : c'est un renvoi vers un achat externe, que Google Play interdit dans l'application. R1 la ferait d'ailleurs échouer. | Remplacer par : « نحتفظ بالمعلومات اللازمة لتفعيل حساب العائلة المميّزة وحفظ حالته. » Je corrige aussi CL-14 de mon côté. |

## Ordre proposé

1. Codex corrige B1, R1 et R2, et relance les tests ciblés (`NativeNoPaymentWording`, `AuthModal.consent`, `ParentalConsentPrompt`).
2. Commit CX-24, puis CX-04 sans le changement d'accueil (B2).
3. CX-05 (accueil « monde » pour tous) dans un commit séparé, après sa relecture.
4. D1 à D3 vont dans le plan de mise en ligne et dans CX-08.
