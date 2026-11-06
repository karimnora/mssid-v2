# Fondations visuelles V2 — le village de Didou

6 novembre 2026. Réalisation des lots **1 et 2 du TODO validé par Karim** : consolidation du jardin et signature visuelle commune. Cela correspond aux lots 0 et 1 de la recommandation Claude. La tranche pédagogique 5AP maths n'est pas encore réalisée dans ce lot.

## Direction

Chaleur, convivialité et mouvement utile : décor algérien illustré, objets lisibles et touchables, Didou réactif, surfaces de lecture calmes. Le jardin approuvé reste la référence. Le mouvement sert à montrer une conséquence, orienter ou célébrer ; les cibles restent stables et la préférence de mouvement réduit prime.

## Tokens réellement extraits

Source : `frontend/src/components/home/villageTokens.css` ; durées et ressorts : `villageMotion.ts`.

| Usage | Valeur |
|---|---|
| Fond des futures surfaces de contenu | `--v-page: #FFFBF0` |
| Surface du village | `--v-surface: #fff9e6` |
| Texte principal / secondaire | `--v-ink: #173f37` / `--v-ink-muted: #365b49` |
| Action principale | `--v-action: #237c5b`, sommet `#389f79` |
| Cours / labos / jeux | `#3a94b2` / `#278774` / `#d88734` |
| Examens | fond `#eee7ff`, contour `#ba9cdd`, texte `#47316c` |
| Police | Cairo, sans-serif |
| Corps de lecture | 16 px sur téléphone, 20 px dans la bulle sur ordinateur |
| Cible tactile | au moins 60 × 60 px |
| Rayon bouton / carte / dialogue | 18 / 16 / 32 px |
| Ombres | `--v-shadow-action`, `--v-shadow-dialog` : relief approuvé du village |

Le village conserve son décor et son ciel en exception au fond crème. Les petits libellés de statut existants sont conservés pour respecter la comparaison visuelle ; ce lot ne constitue pas une certification WCAG AA générale. Les prochains écrans utilisent au moins 16 px pour le texte utile et ne placent pas les consignes sur un décor chargé.

Mouvement : réaction 0,18 s ; entrée 0,32 s ; respiration parlée 1,4 s ; attente 3,8 s ; célébration 0,65 s, maintenue 1,8 s. Ailes des animaux 0,5–1,2 s ; trajet doux 4,8 s. Seulement transform/opacity, jamais top/left/width/height animés. Les mêmes presets sont utilisés par Didou et les animaux.

## Composants disponibles

Tous dans `frontend/src/components/home/` :

- `DidouVillageHome` : accueil connecté ; les callbacks existants gardent les accès, missions et validations.
- `useDidouVoice` : une lecture à la fois, arrêt, erreurs, événements tardifs ignorés, préchargement limité à six clips, respect de saveData, nettoyage au départ.
- `VillageButton` : variantes primary et secondary ; examens distingués par leur style dédié.
- `VillageCard` : surface de contenu, utilisée pour la mission.
- `VillageDialog` : une seule structure pour les deux fenêtres ; focus initial, boucle Tab, Escape et retour au déclencheur.
- `DidouBubble` : sous-titre, état vocal, actions ; le gros bouton réécoute et Didou touchable sont conservés, sans réintroduire le petit bouton de flèche supprimé à la demande de Karim.
- `VillageProgress` : indicateur natif alimenté uniquement par des résultats réels.
- `VillagePremiumMark` : étoile ✦ ou cadenas doré et formulation unique « مع العائلة المميّزة ».
- `VillageFamilyOffer` : réutilise `PremiumOffer`, son Parent Gate et `SubscriptionPaywall`, sans nouveau prix ni second parcours de paiement.

Pour utiliser les primitives sur les prochains écrans, placer leur contenu dans un conteneur `village-theme`. Les tokens restent locaux : aucune modification globale de body ni des contrôles des autres écrans. Les marques Premium sont disponibles pour les lots suivants ; aucune nouvelle sollicitation commerciale n'est ajoutée au jardin dans cette consolidation.

`frontend/src/hooks/useFocusTrap.ts` est partagé avec `PlanetShelf`. `useMotionPreference` est aussi déplacé dans hooks. Les déclarations de MP3 sont dans types/audio-assets.d.ts. Le dossier design ne garde que l'entrée de démonstration, qui importe le même accueil que l'application. Sa classe de démonstration est un paramètre explicite ; les destinations de production utilisent la vraie classe, sans 2AP codée en dur.

Les sélecteurs CSS home-preview et les attributs de vérification sont conservés pour garantir la stabilité du rendu et des contrôles. La feuille est désormais lisible et structurée par taille d'écran ; 109 déclarations surchargées sont retirées (833 → 724 avant extraction des dernières variables). Un ajustement explicite garde le padding du dialogue mobile à sa valeur approuvée.

## Didou : poses et intentions

| Pose | État | Utilisation |
|---|---|---|
| Accueille | Image existante | Bonjour, attente calme ; léger mouvement respiratoire. |
| Montre | Image existante | Choix d'un lieu, présentation ou invitation à examiner une zone. |
| Célèbre | Image existante | Découverte réelle ou réussite effectivement validée ; réaction brève. |
| Réfléchit | À produire | Temps de réflexion et invitation à chercher ; pas de réponse révélée. |
| Encourage après erreur | À produire | Retour constructif et indice issu du contenu pédagogique existant. |
| Regarde un objet | À produire | Orientation du regard vers la manipulation ou l'élément expliqué. |

Référence inchangée : fennec orange, foulard vert avec étoile rouge, sans lunettes ni gilet. Les nouvelles poses ne sont ni générées ni simulées dans ce lot. Une aide pédagogique ultérieure s'appuie sur les règles et corrections existantes ; aucune récompense ou maîtrise inventée.

## Livraison et suite

Voir [les captures, vérifications et limites du lot](v2-fondations-verification.md). Prochain lot : clarifier les lieux et la reprise, puis éprouver ces fondations sur la tranche 5AP maths.
