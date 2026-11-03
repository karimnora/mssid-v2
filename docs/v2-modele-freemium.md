# Offre familiale V2

> La liste à jour de ce qui est gratuit et de ce qui est payant se trouve dans `docs/v2-gratuit-payant.md`, généré depuis `frontend/src/access/entitlements.ts`. En cas de désaccord, c'est elle qui fait foi.

- V1 : cours, exercices et impressions déjà gratuits conservés. Aucun quota ajouté aux fiches V1 ou au préscolaire.
- Nouveaux cahiers V2 : 3 documents par semaine pour tout le compte familial. Renouvellement lundi 00:00 Africa/Algiers. Aperçu d’un exercice gratuit ; bouton explicite Débloquer = 1 crédit. Réouvrir et réimprimer un cahier gratuit débloqué, même une semaine ultérieure, ne consomme rien.
- Le serveur conserve les déblocages (migration V102) et verrouille la ligne du compte pendant l’opération : quota commun à tous les enfants et appareils. Identifiants autorisés dans cahier-ids.txt ; test de cohérence avec le catalogue frontend.
- Premium : tous les cahiers, sans quota hebdomadaire. Un accès Premium seul ne crée pas un déblocage gratuit permanent.
- Carnet gratuit : bilan simple, prochaine révision, accès au cahier correspondant avec le même quota. Premium : détails par compétence, historique et bilan hebdomadaire partageable.
- Collège : premier exercice du premier sujet en découverte ; parcours complet et carnet d’erreurs Premium. Examens V1 conservés.
> **Décisions du 3 novembre 2026** (détail dans `v2-todo-business.md`). Il n'y a plus que deux offres : 900 DA pour 3 mois et 2 400 DA pour 12 mois ; l'offre de 6 mois est abandonnée. Les corrections détaillées de « مساعدي » sont limitées à 3 par jour en gratuit. Les mondes 3 à 8 de la carte de Didou sont Premium. Les passages ci-dessous qui disent le contraire décrivent l'état antérieur.

- Accompagnement enfant sans API externe : pilote maths 1AP/2AP, indices, méthodes et exemples préparés. Gratuit dans toutes les formules, sans quota (règle antérieure, remplacée le 3 novembre 2026 pour les corrections détaillées de « مساعدي »). Le tutorat Gemini et ses routes sont désactivés lorsque le profil serveur v2 est actif. Les quotas IA historiques ne sont plus un avantage Premium annoncé en V2.
- Trois durées avec les mêmes services Premium pour la famille : 3 mois à 900 DA, 6 mois à 1 500 DA, 12 mois à 2 400 DA. Paiement en une fois, activation après validation du reçu, renouvellement volontaire. Un renouvellement anticipé conserve les jours payés. Les anciens reçus à 1 500 DA pour 12 mois restent annuels (LEGACY_12M). La migration V103 ne modifie aucune date existante. L’offre n’apparaît qu’après une action volontaire, avec porte parentale et sortie gratuite. Vente réelle non ouverte tant que serveur de test, paiement, conditions et activation n’ont pas été validés.

## Vérification manuelle

1. Compte gratuit : ouvrir un aperçu (aucun débit), débloquer trois cahiers, refuser le quatrième avec date de renouvellement visible.
2. Réouvrir le premier, imprimer recto et corrigé, fermer puis revenir : aucun crédit supplémentaire.
3. Changer d’enfant et d’appareil avec le même compte : même quota et mêmes documents débloqués.
4. Compte Premium : tous les cahiers, historique détaillé et sujets collège complets ; compte gratuit : résumé et séance découverte.
5. Vérifier les impressions V1 et préscolaires, les cours des trois trimestres et les exercices gratuits.
6. Tester la frontière lundi 00:00 heure d’Algérie et la conservation des cahiers débloqués.

Les vérifications navigateur simulent l’API. Un essai de migration et de concurrence sur PostgreSQL V2 séparé reste nécessaire avant vente. Le contenu pédagogique des cahiers et des sujets collège est encore livré dans les fichiers frontend ; les contrôles d’interface ne constituent pas une protection contre l’extraction des fichiers. Une distribution protégée côté serveur peut être ajoutée avant l’ouverture commerciale.

Le studio familial V2 propose désormais vacances (4 semaines), préparation de la rentrée, semaine adaptée et révisions avant évaluation de 1AP à 5AP, ainsi que trois laboratoires en mode interactif et histoire. Ces services sont inclus dans toute formule Premium active. La découverte propose un exercice par séance et une première mission de chaque laboratoire. Les fiches V1 et les cahiers déjà débloqués gardent leurs accès. Voir v2-services-pedagogiques.md pour la couverture et les limites.

Chaque nouveau reçu doit préciser P3M, P6M ou P12M et le montant exact. Aucun tarif historique ne peut être réclamé par omission de la formule. Les reçus existants LEGACY_12M conservent leur durée stockée.
