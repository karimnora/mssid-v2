# TODO conformité ANPDP — à terminer AVANT la mise en production de la V2 (8 novembre 2026)

Cadre : loi n° 18-07 sur la protection des données personnelles (et son actualisation, loi n° 25-11, dont le texte reste à vérifier).
Destinataires : Codex pour le code (branche `v2` uniquement, ne jamais toucher `main`), Karim pour les démarches.
Point de départ : audit du code de production (`main`) du 8 novembre 2026, résumé ci-dessous.

**Règle.** Aucune fusion de `v2` vers `main` tant que les lots A, B et C ne sont pas terminés et que la demande de transfert (lot D) n'est pas déposée.

## État constaté (production, 8 novembre 2026)
| Exigence | État | Où |
|---|---|---|
| Consentement parental explicite, non pré-coché | ❌ Absent : une simple phrase « En créant un compte, tu acceptes… », adressée à l'enfant | `AuthModal.tsx` ~l. 823 |
| Consentement pour la connexion Google | ❌ Aucune étape | `AuthService.java` |
| Liens CGU et confidentialité | ⚠️ À l'inscription (12 px) et dans les réglages ; pas en bas de chaque page | `AuthModal.tsx`, `SettingsModal.tsx` |
| Droit d'accès (export) | ❌ Absent | — |
| Droit de rectification | ✅ Profil modifiable | `PUT /api/v1/users/me`, `/profile` |
| Droit à l'oubli | ⚠️ Le compte, la progression, les sessions, les codes, les reçus et l'abonnement sont supprimés ; les messages de contact et les journaux d'administration ne le sont pas | `UserService.deleteAccount` |
| Effacement à 30 jours promis par la politique | ❌ Aucune tâche automatique (bouton manuel côté admin seulement) | `AdminController` |
| Purge des comptes inactifs | ❌ Absente | — |
| HTTPS | ✅ Vercel et Render | — |
| Hachage des mots de passe | ✅ BCrypt | `ApplicationConfig.java` |
| Texte libre de l'enfant envoyé à Gemini | ⚠️ Encore actif en production | `AiTutorModal.tsx` ~l. 105 |
| Politique de confidentialité | ✅ Bonne base : loi 18-07, prestataires, transfert hors d'Algérie ; manquent l'IP et les reçus | `public/privacy.html`, `PrivacyPolicyModal.tsx` |

---

## Lot A — Consentement parental (code)
1. **À l'inscription**, une case **obligatoire, non cochée**, avec ce texte exact (ar/fr) :
   « Je confirme être le représentant légal (parent ou tuteur) de l'enfant et j'accepte le traitement de ses données à des fins pédagogiques conformément à la Politique de Confidentialité. »
   Les liens CGU et confidentialité doivent être cliquables à côté de la case, en 16 px au minimum.
2. **Côté serveur** :
   - refuser l'inscription si le consentement est absent ;
   - enregistrer la date et la version du texte acceptées (migration : `parental_consent_at`, `parental_consent_version`) ;
   - ne pas faire confiance à la seule interface.
3. **Connexion Google** : même étape de consentement avant la création du compte. Un compte Google existant sans consentement doit le donner à la connexion suivante.
4. **Comptes existants** : demander le consentement à la prochaine connexion, derrière la protection parent. Tant qu'il n'est pas donné, aucune nouvelle donnée n'est synchronisée.
5. **Texte de l'écran** : s'adresser au parent (« vous »), pas à l'enfant.

## Lot B — Droits du parent (code)
1. **Télécharger les données** : un bouton dans le profil, derrière la protection parent. Il produit un fichier JSON lisible : compte, enfants, progression, abonnement, reçus (métadonnées), consentement. Côté serveur : `GET /api/v1/users/me/export`, pour l'utilisateur connecté uniquement.
2. **Suppression complète** : `deleteAccount` doit aussi :
   - supprimer les messages de contact liés à l'e-mail du compte ;
   - anonymiser l'e-mail dans les journaux d'administration ;
   - couvrir les nouvelles tables de la V2 (profils enfants, résumés de séances, etc.). Un test doit vérifier qu'aucune ligne liée ne reste.
3. **Rectification** : vérifier que chaque donnée modifiable l'est bien depuis l'espace parent, profils enfants de la V2 compris.
4. **Liens légaux** : CGU et confidentialité visibles en bas de chaque page (pied de page web) et dans l'espace parent.

## Lot C — Conservation et prestataires (code)
1. **Tâche automatique chaque nuit** (sur le modèle de `SubscriptionExpiryService`) :
   - effacer les journaux d'administration et les messages de contact de plus de 30 jours, comme la politique le promet ;
   - pour les comptes **inactifs depuis 24 mois** : envoyer un e-mail de préavis 30 jours avant, puis les supprimer avec la même routine que `deleteAccount`.
2. **Gemini** : couper l'envoi du texte libre de l'enfant. La V2 « مساعدي » n'utilise plus d'IA ; vérifier qu'aucun appel à `/v1/ai/explain` ne reste dans la V2. Toute future IA passe par le lot 4 du TODO tuteur (clé payante sans entraînement, feu vert de Karim).
3. **Sentry** : désactiver l'envoi de données personnelles et filtrer les e-mails des messages d'erreur, côté frontend et backend.
4. **Politique de confidentialité** : ajouter l'adresse IP (limitation des abus, non conservée), les images de reçus de paiement et leur durée de conservation, la durée de 24 mois pour les comptes inactifs, le droit d'accès et la façon de l'exercer. Mettre à jour la date et la version du texte, liée au consentement du lot A.

## Lot D — Démarches ANPDP (Karim)
1. Créer le compte « responsable de traitement » sur **anpdp.dz**.
2. **Registre des traitements**, un fichier par traitement :
   1. comptes élèves et enfants (nom, classe, wilaya, progression) ;
   2. données parent (e-mail du compte et du parent, reçus de paiement, abonnement) ;
   3. messages de contact ;
   4. journaux techniques (journaux d'administration, IP de limitation, Sentry).
3. **Demande d'autorisation de transfert vers l'étranger** : Vercel, Render, Neon, Resend, Sentry et Google (connexion Google). Ajouter Gemini seulement si une IA revient un jour.
4. **Sécuriser les accès** : activer la double authentification sur Neon, Render, Vercel, GitHub, Resend, Sentry et le compte Google. Accès à la base de production limité à Karim.
5. Conserver l'accusé de réception de l'e-mail déjà envoyé à l'ANPDP.

## Lot E — Dossier de conformité interne (à rédiger, puis à garder à jour)
1. **Cartographie des données** : quelles données, où (prestataire et pays), pourquoi, qui y a accès.
2. **Durées de conservation** : compte actif, 24 mois d'inactivité, 30 jours pour les journaux et les messages, reçus de paiement (durée à fixer selon les obligations comptables).
3. **Mesures de sécurité** : HTTPS, BCrypt, cookies HttpOnly, limitation des abus, contrôle des rôles, double authentification, sauvegardes.
4. **Procédure en cas de fuite** : détecter, contenir, évaluer, **prévenir l'ANPDP rapidement**, informer les familles concernées si nécessaire, tenir un registre des incidents.
5. **Liste des prestataires** : pour chacun, la région d'hébergement et un lien vers ses engagements de sécurité.

## Critères d'acceptation avant la mise en production de la V2
- Aucune création de compte, y compris via Google, sans consentement parental enregistré côté serveur.
- Un parent peut télécharger, corriger et supprimer toutes les données d'un enfant sans écrire à personne.
- Après une suppression, aucune ligne liée ne reste en base (vérifié par un test).
- La tâche automatique de conservation fonctionne et est testée.
- Aucun texte d'enfant n'est envoyé à un service d'IA externe.
- Registre et demande de transfert déposés auprès de l'ANPDP ; dossier interne rédigé.
