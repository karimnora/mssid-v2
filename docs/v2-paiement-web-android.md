# V2 : paiement web et accès Android

Le navigateur, y compris un navigateur Android et une PWA, conserve les trois offres 3/6/12 mois, les instructions de paiement et le dépôt du reçu. Le backend existant conserve la validation manuelle administrateur, les montants canoniques et l’activation du compte. Aucun prestataire de paiement externe n’est ajouté.

Un accès permanent au statut est disponible dans le profil natif pour les comptes connectés. L’écran reste ouvert quand une activation déverrouille un contenu. Toute application native Capacitor utilise le parcours de consultation : « Mon abonnement », statut, date de fin et actualisation. Le composant de paiement protège également ses accès directs : il rend l’écran de statut plutôt que le formulaire. Le client API refuse le dépôt de reçu depuis une application native. Cette distinction est une règle du parcours client, pas une preuve cryptographique de provenance pour le serveur.

L’actualisation interroge le serveur avec le compte authentifié, puis recharge son profil. Le rôle Premium provient du serveur, jamais d’un reçu simplement déposé. Une réponse d’un ancien compte ne peut pas remplacer le compte courant. Le nouvel endpoint GET /api/v1/payments/subscription ne reçoit aucun identifiant de compte client et renvoie uniquement le statut et les dates du propriétaire connecté. Il ne fournit aucun reçu, montant ou bouton d’achat.

Les liens vers le site et les réseaux sociaux du pied de page sont réservés au navigateur. Les fiches conservent le nom et l’adresse MSSID en texte simple dans l’application native, avec un lien sur le web. Les cours gratuits et les quotas existants restent inchangés.

## Hébergement et publication

Le mode commercial n’est pas destiné à Vercel Hobby. Le projet dispose déjà d’une configuration Render isolée pour le backend V2 ; aucune migration d’hébergement ni aucun déploiement n’est effectué par cette modification. Il reste à sélectionner/configurer l’hébergement web autorisant l’usage commercial, puis brancher site et Android sur le même backend de la V2 avec les domaines et cookies appropriés.

À valider avant publication : vraie connexion sur site et téléphone, dépôt du reçu sur le site, validation administrateur, actualisation Android et expiration. Les règles et la fiche Google Play doivent être revérifiées au moment de la soumission. Les tests navigateur simulant Capacitor ne remplacent pas un APK testé sur appareil réel.

Références : https://support.google.com/googleplay/android-developer/answer/10281818 et https://vercel.com/docs/limits/fair-use-guidelines.

Vérifications de cette étape : tests de formulaire web, garde native, invités, panne réseau, changement de compte, attribution imprimée, statut propriétaire et validation manuelle serveur ; parcours FR/AR du dépôt web et du statut natif simulé, avec contrôle WCAG du dialogue de statut. Aucun service déployé et aucun APK publié.
