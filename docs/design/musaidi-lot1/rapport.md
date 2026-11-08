# مساعدي — lot 1

Branche : v2. Aucun commit ni déploiement.

## Changements
- AiTutorModal : suppression des onglets et du niveau pilote forcé ; classe reçue conservée.
- MusaidiPanel : matière → leçon → question ; contexte de leçon direct ; trimestre courant prioritaire, autres leçons repliées ; pagination de 20 conservée.
- Recherche en 4AP/5AP ; écoute des tuiles en 1AP–3AP ; couleurs des matières réutilisées.
- Méthodes préparées intégrées à la question lorsque la compétence est identifiée ou qu’une seule méthode correspond à la leçon. Aucun guide proposé pour une compétence ambiguë.
- Cibles de 60 px minimum et texte de 16 px dans le tuteur et les cartes guidées.
- Tests de navigation, classe, recherche et quotas adaptés.

## Vérifications
- Contrôle TypeScript réussi avant les captures.
- Suite finale ciblée : 20 tests réussis (parcours, banque et quotas).
- Captures 360×640 et 390×844 : aucun débordement horizontal, aucune erreur JavaScript, aucun bouton inférieur à 60 px en hauteur dans la question.
- Captures réalisées sur une leçon de démonstration isolée, sans profil réel. Elles ne constituent pas un test familles ni une capture de contenu publié réel.

## Limites
- Pas de validation TalkBack sur appareil physique ni d’écoute humaine de toutes les voix.
- Le déploiement et les lots suivants ne sont pas réalisés.
- Les exercices sans compétence explicite dans une leçon à plusieurs méthodes restent sans guide, plutôt que d’afficher une méthode incertaine.
