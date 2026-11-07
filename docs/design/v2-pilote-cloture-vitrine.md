> Évolution : les choix de stockage, de démo gratuite et de mesure décrits ici ont été corrigés. Voir [la revue familles](v2-corrections-revue-familles.md) pour le comportement actuel.

# Pilote fractions clôturé et vitrine Premium accessible

6 novembre 2026 — v2 seulement, commit local sans push.

## Décisions appliquées

Karim a validé le village pour les comptes gratuits et une démonstration fractions rejouable. Cela remplace la proposition antérieure de démonstration unique. Les offres existantes restent 900 DA pour 3 mois et 2 400 DA pour 12 mois, jusqu’à 6 enfants. Aucun contenu gratuit actuel n’est retiré et aucune règle de validation, note ou XP n’est modifiée.

## Pilote

Le résumé de séance est transmis par onPracticeResult au vrai profil actif. Il conserve les observations de découverte et du labo, les exercices seul / avec aide / à retravailler, des exemples réellement tentés, le résultat du quiz et la prochaine étape. Le résumé se met à jour sous un identifiant de séance stable et se retrouve dans le carnet parent après fermeture et rechargement.

Il utilise le stockage et la synchronisation du carnet existants, par compte ou enfant actif. Le serveur conserve une version nettoyée et bornée du résumé. Les fusions client et serveur dédupliquent par identifiant et gardent la version la plus récente. Les observations sont explicitement exclues des réussites hebdomadaires, de la mission du jour et des statistiques de maîtrise. Les exercices notés conservent leur chemin d’origine. Les informations seul / avec aide et la liste d’exercices à reprendre sont également conservées par la synchronisation serveur.

Dans « أتدرّب », le bouton d’aide de Didou est l’unique déclencheur. Les indices restent visibles dans la carte et continuent à compter comme aide. Les cartes classiques gardent leur bouton habituel. Didou est agrandi, le doublon « مع ديدو » est retiré du titre et les petits textes de la scène sont à 16 px minimum.

Après les sept missions, « أجرّب كسورًا أخرى » propose deux autres séries de décomposition / encadrement : 14/4 puis 11/4, et 19/6 puis 9/4. L’équivalence reste le contenu validé 1/2 = 5/10 et 2/3 = 4/6. Il ne s’agit pas d’une modification des questions officielles. Les annonces utilisent les MP3 existants, sans appel payant. Les essais successifs ont une demande vocale distincte ; la réaction du compagnon ne double pas celle du contrôleur du labo. Après erreur, l’indice approprié est relu ; sans indice spécifique de quiz, la règle enregistrée sert de secours.

L’ancien habillage porte maintenant un attribut commun data-legacy-chrome. Le masquage visuel s’applique immédiatement par CSS ; un observateur rend aussi inaccessibles les éléments recréés pendant la leçon. Chaque état est restauré à la sortie. #root et les fenêtres globales restent actifs.

## Vitrine

Le mode monde n’exige plus un abonnement pour afficher l’accueil. Le choix classique reste mémorisé. Les deux premiers mondes restent gratuits et les mondes suivants visibles avec leurs cadenas, selon les droits existants. Un tap propose un aperçu du vrai décor animé sur cinq secondes, désactivé en mouvement réduit, et un bouton « أخبر أوليائي ». Celui-ci invite le parent sur l’appareil ; aucun message externe n’est envoyé.

La carte du cours fractions 5AP ouvre un profil de démonstration clairement signalé aux comptes gratuits. La leçon est rejouable. Ses résultats, ses récompenses de quiz, ses points et son résumé ne sont pas écrits dans le profil réel. Le bilan de démonstration le précise. Les autres cours restent accessibles selon les droits gratuits existants.

L’offre parent réutilise les deux tarifs existants et présente cinq vraies captures WebP (116 014 octets au total) : parcours, voix de Didou, manipulation, aide et bilan. Elles proviennent de la démonstration, pas d’un enfant réel. Leur nature est indiquée dans l’offre. La mention des six enfants et du retour au gratuit sans suppression de progression est visible. Le défi parent précède désormais tout affichage de l’offre, y compris l’entrée directe dans SubscriptionPaywall ; l’envoi d’un reçu conserve sa propre vérification.

## Mesure et limites

Quatre compteurs agrégés restent uniquement sur l’appareil : cadenas ouvert, demande parent, offre ouverte, démo terminée. Aucune identité, réponse scolaire, date ou requête réseau n’est ajoutée. Ce n’est pas encore un tableau de conversion partagé ni une mesure des abonnements réellement encaissés.

Les tests navigateur utilisent des API simulées et des profils fictifs identifiés. Le code du chemin serveur est testé séparément. La synchronisation sur un serveur déployé n’est pas certifiée par ces captures. Les modifications backend devront être déployées avec le frontend avant d’annoncer la conservation sur plusieurs appareils.

Pas de push, de déploiement de prévisualisation, de test avec de vraies familles, de validation juridique ou de contrôle TalkBack / Android natif dans ce lot. Le pilote fractions sert de référence ; le format n’est pas encore généralisé aux autres leçons.

## Vérifications

- 56 tests ciblés réussis sur 10 fichiers.
- Tests serveur ciblés : 17 réussis, nettoyage et conservation des observations, déduplication et exclusion des statistiques hebdomadaires.
- Six parcours réels du pilote en arabe : direct et jardin × 360×640, 390×844 et 1280×800.
- Démo gratuite complète en 390×844 et 1280×800 : progression et récompenses inchangées, quiz et bilan parent disponibles, compteur de fin une fois par ouverture.
- Carnet aux deux formats : envoi du résumé dans le payload API simulé, rechargement, défi parent, résumé unique retrouvé.
- Offre aux deux formats : village gratuit, cadenas, défi parent avant la vitrine, cinq images chargées, compteurs locaux et absence de débordement.
- Audio : démarrage réel des sept annonces, annonces des grandes phases, arrêt avec le bouton son et absence de nouvelle lecture pendant la coupure.
- TypeScript final : réussi. Build Vite/PWA final : réussi (32,80 s pour Vite), avertissement préexistant sur certains bundles >500 Ko.
- Suite complète locale : **2 557 tests réussis sur 254 fichiers**, 406,81 secondes, deux workers et délai local de 20 secondes par test. Aucun workflow distant lancé.
- Après la suite complète, **10 tests UI réussis sur 3 fichiers** ont confirmé le retrait de l’aide auxiliaire des cartes du pilote et les derniers ajustements tactiles.
- Dernier ajustement tactile : la grille s’adapte aux six parts sur petit écran et le bouton de nouvelle série atteint 60 px. Les trois séries ont ensuite été parcourues en 360×640 et 390×844, sans débordement, avec conservation des quantités. Le typage et le build finaux incluent cet ajustement.
- Dernier contrôle du carnet : l’exemple 17/5 réellement essayé réapparaît avec le bilan après rechargement aux deux tailles.

Preuves structurées dans [premium-vitrine](premium-vitrine/). Journaux et captures : C:/Users/Karim/.codex/visualizations/2026/11/05/01a1ac76-e238-7532-9072-bbec939fcfdb/premium-*.

## Étapes suivantes

1. Revoir cette version localement avec Karim ; préparer une prévisualisation uniquement avec son autorisation de publication.
2. Préparer le test de 5 à 10 familles 5AP, les conditions de collecte et la relecture pédagogique ; vérifier un vrai Android.
3. Observer la compréhension des enfants et des parents avant de généraliser.
4. Extraire les manipulations réutilisables et équiper environ dix leçons prioritaires de 5AP.
5. Étendre aux autres niveaux ensuite ; activités religieuses relues avant leur diffusion.

## Auto-évaluation

| Axe | Note /5 | Preuve et limite |
|---|---:|---|
| Exactitude | 4 | Les observations ne deviennent pas des notes ; API réelle déployée à vérifier. |
| Complétude | 4 | Clôture du pilote et première vitrine livrées ; validation familles et généralisation restent à faire. |
| Clarté | 4 | Démo identifiée, offre protégée, observations distinctes des réussites officielles. |
| Utilisabilité | 4 | Parcours mobile / ordinateur vérifiés ; essai enfant et TalkBack non réalisés. |
| Sobriété | 4 | Voix réutilisées, captures légères, compteurs locaux, aucun workflow distant. |
