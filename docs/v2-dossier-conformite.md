# V2 — Dossier de conformité interne et brouillon du registre des traitements (CL-15)

Rédigé par Claude le 16 novembre 2026 à partir du code de la branche `v2` (entités Java, migrations V1 à V111, configuration de déploiement). Destinataire : Karim, pour le lot D (démarches ANPDP) et le lot E de `docs/v2-todo-conformite-anpdp.md`.
Statut : **brouillon de travail interne, pas un avis juridique.** À faire relire par le juriste en même temps que `docs/v2-projets-cgv-confidentialite.md` (CL-14). À tenir à jour à chaque nouvelle table ou nouveau prestataire.

Les crochets `[...]` sont à remplir par Karim. Une région notée « à confirmer » n'a pas été lue dans un tableau de bord.

## 1. Cartographie des données

| Donnée | Où elle est stockée | Pourquoi | Qui y accède |
|---|---|---|---|
| Compte : nom, e-mail, mot de passe haché (BCrypt), wilaya, niveau, avatar, mode de connexion (e-mail ou Google, identifiant Google) | Table `users` (Neon) | Créer et sécuriser le compte | Le titulaire ; Karim (administration) |
| E-mail du parent (facultatif) et préférences du bilan du jeudi | Table `users` (`parent_email`, `weekly_report_*`) | Envoyer le bilan au parent | Karim ; Resend pour l'envoi |
| Profils d'enfants : prénom ou pseudo (40 caractères), niveau, avatar facultatif. Ni date de naissance, ni photo, ni nom de famille | Table `child_profiles` (V100) | Adapter les leçons à chaque enfant | Le parent ; Karim |
| Progression : leçons, examens et défis terminés, scores de quiz, compétences, séances, résumés du village, points, médailles, série de jours | Table `users` (colonnes JSON) et `learning_snapshots` (V105) | Suivi de l'enfant, bilan du parent | Le parent ; Karim |
| Consentement parental : date et version du texte | Table `users` (colonnes de CX-04, **pas encore créées**) | Prouver l'accord du parent | Karim |
| Abonnement : formule, dates | Table `subscriptions` (formules : V103) | Gérer les droits Premium | Le titulaire ; Karim |
| Reçus de virement : image du reçu, moyen, référence de transaction, montant, statut, motif de refus | Table `payment_receipts` (V104 : l'image est stockée en base) | Vérifier le paiement ; comptabilité | Karim |
| Codes d'activation : empreinte SHA-256 du code (jamais le code), qui l'a utilisé et quand | Tables `activation_codes`, `activation_code_redemptions` (V108) | Empêcher un second usage | Karim |
| Messages « اتصل بنا » : nom, e-mail, message | Table `contact_messages` | Répondre | Karim |
| Journaux d'administration (e-mail de l'administrateur et action) | Table `admin_audit_logs` | Sécurité, traçabilité | Karim |
| Compteurs de l'offre : nombres d'actions par jour, **sans compte, enfant, cookie ni IP** | Table `premium_funnel_daily` (V110) | Mesurer le parcours | Karim |
| Adresse IP | **Mémoire du serveur seulement** (`RateLimitFilter`), jamais en base | Limiter les abus (connexion, mot de passe oublié, codes) | Personne |
| Cookies de session (`mssid_auth_token` 24 h, `mssid_refresh_token` 30 jours) et table `refresh_tokens` | Navigateur ; Neon | Garder la connexion | Personne |
| Stockage local du navigateur (progression d'interface, préférences) | Appareil de l'utilisateur | Fonctionnement hors connexion | Personne d'autre |
| Rapports d'erreur, sans nom ni e-mail (`sendDefaultPii` désactivé, filtre `beforeSend`) | Sentry | Corriger les pannes | Karim |

**Écart à corriger :** le prix par défaut d'un reçu est encore `1500.0` et la formule par défaut `LEGACY_12M` (`PaymentReceipt.java`), hérités de la V1. Ce n'est pas une donnée personnelle, mais un reçu enregistré sans formule explicite aurait un montant faux. À signaler à Codex.

## 2. Prestataires

| Prestataire | Rôle | Région | Engagements de sécurité |
|---|---|---|---|
| Vercel | Site web (`mssid-dz.com`), statistiques globales de visite (web seulement) | `[à confirmer]` | `[lien]` |
| Render | Serveur (`render.yaml`, formule gratuite) | Le fichier ne fixe pas de région ; Render prend alors sa région par défaut, **à confirmer dans le tableau de bord** | `[lien]` |
| Neon | Base PostgreSQL | `[à confirmer dans console.neon.tech]` | `[lien]` |
| Resend | E-mails : code de confirmation, mot de passe, bilan du jeudi | `[à confirmer]` | `[lien]` |
| Sentry | Rapports d'erreur | `[à confirmer]` | `[lien]` |
| Google | Connexion avec Google (si choisie) | Mondial | `[lien]` |
| Google Gemini | Plus utilisé par la V2 (« مساعدي » sans IA) ; encore actif sur la V1 en production (`AiTutorModal.tsx`) | — | À retirer de la liste une fois la V1 remplacée |

Tous ces prestataires sont hors d'Algérie, sauf une future passerelle de paiement algérienne. D'où la demande d'autorisation de transfert (lot D, point 3) et la question J1 de CL-14 (hébergement en Algérie exigé par la loi 18-05 pour le commerce électronique).

## 3. Durées de conservation

| Donnée | Durée | État dans le code |
|---|---|---|
| Compte, profils, progression | Tant que le compte est utilisé | ✅ |
| Compte inactif | Suppression après 24 mois, e-mail de préavis 30 jours avant | ❌ À construire (CX-19) |
| Journaux d'administration, messages de contact | 30 jours | ❌ Promis par la politique actuelle, pas de tâche automatique (CX-19) |
| Reçus de paiement (image comprise) | `[durée comptable légale]` | ❌ Aucune purge |
| Codes de confirmation et de mot de passe | Jusqu'à expiration | `[à vérifier : purge des codes expirés]` |
| Jetons de session | 30 jours | ✅ Expiration ; `[purge des jetons expirés à vérifier]` |
| Après suppression du compte | Immédiate ; suppression en cascade des tables liées | ⚠️ Messages de contact et journaux d'administration non supprimés (CX-18) |
| Sauvegardes de la base | `[durée de rétention des sauvegardes Neon]` | `[à vérifier]` |

## 4. Mesures de sécurité

| Mesure | État |
|---|---|
| HTTPS partout (Vercel, Render) | ✅ |
| Mots de passe hachés (BCrypt) | ✅ |
| Cookies `HttpOnly`, `Secure`, `SameSite=None` limités aux origines autorisées (CORS) | ✅ |
| Limitation des abus par adresse IP, en mémoire | ✅ (10 essais de code par 15 minutes) |
| Contrôle des rôles côté serveur (admin, Premium) | ✅ |
| Codes d'activation stockés en empreinte seulement | ✅ |
| Rapports d'erreur sans donnée personnelle | ✅ côté site ; `[à vérifier côté serveur]` |
| Double authentification sur Neon, Render, Vercel, GitHub, Resend, Sentry, Google | `[à activer et cocher par Karim]` |
| Accès à la base de production réservé à Karim | `[à confirmer]` |
| Sauvegardes et essai de restauration | `[à faire une fois]` |
| Images de reçus : accès réservé à l'administrateur | `[à vérifier dans le code]` |

## 5. Procédure en cas de fuite de données

1. **Détecter.** Alerte Sentry, comportement anormal, signalement d'un parent ou d'un prestataire. Noter l'heure.
2. **Contenir, dans l'heure.** Changer les secrets touchés (`JWT_SECRET`, mot de passe de la base, clé Resend), révoquer les sessions (vider `refresh_tokens`), couper le service si besoin.
3. **Évaluer.** Quelles données, combien de comptes, des enfants sont-ils concernés, les données sont-elles lisibles (un mot de passe haché ne l'est pas, une image de reçu l'est).
4. **Prévenir l'ANPDP sans tarder**, avec ce qui est connu ; compléter ensuite. Le délai légal exact est à confirmer par le juriste.
5. **Informer les familles concernées** quand le risque est réel, par e-mail : ce qui s'est passé, ce qui est touché, ce que nous avons fait, ce qu'elles peuvent faire.
6. **Tenir le registre des incidents**, même pour un incident sans conséquence : date, faits, données, décisions, mesures prises.

| Date | Faits | Données et personnes touchées | ANPDP prévenue | Familles informées | Mesures |
|---|---|---|---|---|---|
| | | | | | |

## 6. Brouillon du registre des traitements (lot D, point 2)

Un tableau par traitement, dans l'ordre des champs habituels d'une déclaration. Le formulaire d'anpdp.dz peut les demander autrement : recopier champ par champ.

### Traitement 1 — Comptes et apprentissage des enfants

| Champ | Contenu |
|---|---|
| Finalité | Permettre à des enfants du préscolaire à la 5AP de suivre des leçons et exercices, et à leur parent de suivre leur progression |
| Base légale | Consentement du représentant légal (loi 18-07), enregistré avec sa date et sa version |
| Personnes concernées | Parents ou tuteurs titulaires du compte ; enfants de 3 à 11 ans environ |
| Données | Parent : nom, e-mail, mot de passe haché, wilaya, identifiant Google éventuel. Enfant : prénom ou pseudo, niveau, avatar, progression scolaire |
| Données sensibles | Aucune (ni santé, ni religion déclarée, ni photo, ni date de naissance) |
| Destinataires | Karim (administration) ; prestataires techniques du §2 |
| Transfert hors d'Algérie | Oui : Vercel, Render, Neon, Sentry, Google (autorisation demandée : `[n° et date]`) |
| Durée | Tant que le compte est utilisé ; suppression après 24 mois d'inactivité |
| Droits | Accès et export, rectification, suppression depuis l'espace parent ; e-mail mssid.dz.app@gmail.com |
| Sécurité | §4 |

### Traitement 2 — Abonnement et paiement

| Champ | Contenu |
|---|---|
| Finalité | Vendre et gérer l'abonnement « Premium Famille » |
| Base légale | Exécution du contrat ; obligations comptables |
| Personnes concernées | Parents qui souscrivent |
| Données | Formule et dates ; reçu de virement (image, moyen, référence, montant) ; usage d'un code d'activation (empreinte du code, date) |
| Destinataires | Karim ; `[passerelle de paiement, une fois activée]` |
| Transfert hors d'Algérie | Oui : base Neon, serveur Render |
| Durée | `[durée comptable légale]` pour les reçus ; durée de l'abonnement pour le reste |
| Sécurité | §4 ; images de reçus visibles par l'administrateur seulement |

### Traitement 3 — Messages de contact

| Champ | Contenu |
|---|---|
| Finalité | Répondre aux questions des familles et des écoles |
| Base légale | Consentement (envoi volontaire du message) |
| Personnes concernées | Toute personne qui écrit |
| Données | Nom, e-mail, contenu du message |
| Destinataires | Karim |
| Transfert hors d'Algérie | Oui : base Neon |
| Durée | 30 jours après traitement |

### Traitement 4 — Journaux techniques et sécurité

| Champ | Contenu |
|---|---|
| Finalité | Sécurité du service, correction des pannes, mesure globale du parcours |
| Base légale | Intérêt légitime de sécurité `[à confirmer par le juriste : la loi 18-07 ne retient pas forcément cette base]` |
| Personnes concernées | Utilisateurs et administrateurs |
| Données | Journaux d'administration (e-mail de l'administrateur, action) ; adresse IP en mémoire seulement ; rapports d'erreur sans donnée personnelle ; compteurs anonymes par jour |
| Destinataires | Karim ; Sentry |
| Transfert hors d'Algérie | Oui : Sentry, Neon |
| Durée | 30 jours pour les journaux ; IP non conservée |

## 7. À faire, par personne

| Qui | Quoi |
|---|---|
| Karim | Remplir les crochets ; lire les régions dans les tableaux de bord ; activer la double authentification ; déposer le registre et la demande de transfert |
| Juriste | Bases légales (traitement 4), délai de notification d'une fuite, durée de conservation des reçus, question J1 |
| Codex | CX-04 (consentement), CX-18 (export, suppression complète), CX-19 (purges et préavis) ; montant par défaut des reçus (§1) |
| Claude | Mettre ce dossier à jour après chaque lot de Codex |
