# Fractions : découvrir sans réponse affichée, conserver les fenêtres globales

6 novembre 2026 — branche v2, commit local uniquement.

## Périmètre

Deux corrections suite à la relecture du pilote : le dessin de départ ne fournit plus la décomposition ; la scène ne désactive plus #root. Les autres demandes (bilan durable dans le carnet, aide unique, variantes et finitions de Didou) restent à traiter séparément.

## Manipulation

L’étape de décomposition commence avec 17 parts égales en vrac, et avec 7 parts dans le transfert. Aucun entier prérempli n’est présenté. Une part quitte visuellement la réserve lorsqu’elle est affectée à la construction ; les unités complètes apparaissent uniquement après leur formation par l’enfant. Défaire une unité restitue ses parts à la réserve. Les emplacements restent réservés pour éviter de déplacer les cibles pendant les touches répétées.

La réserve est une illustration avec une description accessible actualisée ; les contrôles tactiles et les alternatives +/− existants restent les commandes. Seuls transform et opacity sont animés ; la préférence de réduction des mouvements désactive la transition. Les barres utiles aux étapes suivantes et les corrections après validation restent présentes. Aucune donnée pédagogique, règle de notation ou récompense n’a changé.

## Interface et fenêtres globales

VillageLessonScene suspend uniquement l’en-tête V1, sa navigation mobile, son espace de travail, son pied de page et le décor du parcours. Chaque élément retrouve ses valeurs précédentes de display, inert et aria-hidden à la sortie. #root demeure visible et accessible, y compris pour une notification arrivée après l’ouverture de la leçon.

La scène passe au niveau 46, au-dessus du parcours (45) et sous les fenêtres de l’application (50 et plus). Les composants globaux AppModals et AndroidUpdateBanner sont hors des surfaces suspendues. Le bandeau d’installation PWA conserve sa condition habituelle : accueil seulement. Aucun nouveau bandeau hors ligne ni nouveau mécanisme d’expiration de session n’est introduit.

## Vérifications

- TypeScript : réussi.
- Tests ciblés : 7 réussis, réserve initiale sans unités préremplies, quantité restante, restitution et conservation des alertes globales.
- Chromium : les six parcours complets passent (lien direct et jardin, en arabe, 360×640, 390×844 et 1280×800). Réserve de 17 puis 7 parts, unités après regroupement, commandes ≥60 px et stables, sortie annulée sans perte, sept annonces enregistrées, protection parent et quiz d’origine conservés. Aucun débordement horizontal ni erreur JavaScript.
- Fenêtres globales : vrais composants BadgeUnlockToast et AuthModal montés dans un hôte global de vérification pendant la leçon, dans les deux parcours. Badge visible et touchable ; champ de connexion visible, accessible et éditable. La protection parent est vérifiée par son parcours réel. Cette preuve de superposition ne constitue pas un test complet de révocation de session côté serveur ni une simulation Android native.
- Build Vite/PWA : réussi ; avertissement préexistant sur la taille de certains bundles.
- Suite complète : **2 554 tests réussis sur 253 fichiers**, 549,03 secondes, deux workers et délai local de 20 secondes par test. Les avertissements JSDOM scrollTo/play non implémentés ne sont pas des échecs. Aucun réglage CI modifié et aucun workflow distant lancé.

Preuves : [parcours et quantités](fractions-loose-browser-verification.json), [composants globaux](fractions-system-layer-verification.json). Captures et journaux locaux dans C:/Users/Karim/.codex/visualizations/2026/11/05/01a1ac76-e238-7532-9072-bbec939fcfdb/ (loose-*, global-* et linear-*).

## Auto-évaluation

| Axe | Note /5 | Preuve et limite |
|---|---:|---|
| Exactitude | 4 | Conservation des quantités et validation officielle inchangée ; relecture enseignant toujours utile. |
| Complétude | 4 | Les deux priorités sont traitées ; carnet durable et autres finitions hors de ce lot. |
| Clarté | 4 | Réserve sans résultat prémâché ; les commandes sont distinctes de l’illustration. |
| Utilisabilité | 4 | Six parcours et superposition de vrais composants vérifiés ; essai avec enfants et Android natif à prévoir. |
| Sobriété | 4 | Aucun nouvel asset, appel vocal payant ou workflow distant. |
