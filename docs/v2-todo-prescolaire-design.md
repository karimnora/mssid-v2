# TODO préscolaire — design, animation, immersion (8 novembre 2026)

Destinataire : Codex, sur la branche `v2` uniquement. Ne jamais toucher `main`.
Point de départ : l'audit `docs/design/audit-prescolaire/`, les fondations du village (`docs/design/v2-fondations.md`, `components/home/villageTokens.css`, `villageMotion.ts`) et les composants de `frontend/src/components/preschool/`.

**Priorité.** La 5AP reste prioritaire. Ce chantier avance en parallèle, sans bloquer le test familles 5AP. La production d'images (lot 1) peut commencer tout de suite : c'est Karim qui les génère.

## Règles du préscolaire (CLAUDE.md, section 2A) : non négociables
- **Zéro texte nécessaire.** 100 % des consignes ont un audio enregistré en arabe simple (fusha) ; la synthèse vocale du téléphone ne sert qu'en secours.
- **Cibles tactiles** de 72 px visés, 60 px au strict minimum, y compris pour la navigation, la réécoute et la protection parent.
- **Gestes** : un seul tap. Pas de double tap, d'appui long ni de défilement complexe. Le glisser-déposer n'est permis qu'avec une **large zone d'aimantation**, et toujours avec l'**alternative tap-tap** (toucher l'objet, puis sa destination).
- **Retours** : effet de pression 3D, micro-animation de réussite (étoiles, confettis). **Jamais de son d'erreur strident.** Une erreur déclenche un encouragement de Didou et un nouvel essai.
- **Protection parent** devant les achats, les réglages, les fiches imprimables et toute offre Premium.
- **Accessibilité** : mouvement réduit respecté partout (`useMotionPreference`), nombres isolés en LTR en arabe, contraste vérifié (attention au texte blanc sur les dégradés clairs).
- **Contenu religieux** (Basmala, Hamdala, Fatiha, Ikhlas, `PreschoolQuranListen`) : écran calme, **sans confettis, points, étoiles ni décor animé**. Récitation humaine relue uniquement, jamais la synthèse du téléphone. **Exception validée par Karim le 8 novembre 2026** : les 12 fichiers ElevenLabs de `values-bismillah` et `values-alhamdulillah` (ar/fr/en, liste dans `src/data/preschool/approvedValuesAudio.ts`) sont autorisés pour ces deux activités uniquement. Ne pas les retirer ; l'exception ne s'étend ni au Coran ni à d'autres formules.
- **Aucune donnée inventée.** Une réussite après une erreur n'est pas « seul ».
- **Rapport à la fin de chaque lot** : captures en 360×640 et 390×844, vérifications lancées, limites restantes.

---

## Lot 0 — Prérequis (déjà demandés, à terminer d'abord)
1. Sauvegardes séparées par enfant pour toutes les clés `localStorage` sans identifiant d'enfant (`mssid_game_levels` en premier), avec reprise prudente des anciennes données.
2. Remontée « seul / avec aide » vérifiée sur les 15 mécaniques, pas seulement `PreschoolTapChoice`.
3. Les 29 phrases arabes manquantes en voix de Didou (circuit existant), écoutées par une personne. Aucune ne doit être religieuse.
4. Cibles de 48 px portées à 60 px au minimum, nombres en LTR, mouvement réduit de `PreschoolMascot`.

## Lot 1 — L'identité de Didou au préscolaire (production d'images)
1. **Remplacer le 🦊 « Amine the Fennec »** de `PreschoolMascot` par le **Didou illustré de référence** : fennec orange, foulard vert, étoile rouge, sans lunettes ni gilet. Corriger le libellé `aria-label`.
2. **Rédiger les prompts Nano Banana** dans `docs/v2-prescolaire-prompts-nanobanana.md`, sur le modèle de `docs/v2-labos-prompts-nanobanana.md`. Karim génère les images et les dépose dans `C:\Users\Karim\Downloads\didou-prescolaire\`. Il faut produire :
   - **6 expressions de Didou**, en planche sur fond vert uni pour le détourage : il accueille, il écoute (main à l'oreille), il réfléchit, il encourage après une erreur (doux, jamais triste), il célèbre, il montre du doigt.
   - **4 décors peints**, en paysage et en portrait : le jardin, le marché, la maison (cuisine et salon algériens), la plage ou la forêt. Les décors doivent rester calmes dans le tiers inférieur, là où se placent les cibles.
   - **Une planche d'objets** pour les activités : fruits et légumes locaux, ustensiles, animaux de la ferme, vêtements.
3. **Détourer et exporter en WebP**, avec un budget de 250 Ko maximum par décor et 60 Ko par pose ; regrouper les références dans un fichier d'art préscolaire.

**Critère d'acceptation** : le même Didou partout (village, leçons, préscolaire). Aucun emoji renard ne reste.

## Lot 2 — L'accueil préscolaire : « trois portes »
1. **Remplacer l'accueil actuel** : aujourd'hui, le défi du jour et deux accès aux fiches imprimables passent avant les destinations.
2. **Trois grandes portes illustrées**, sur le modèle du village : **أتعلّم** (Apprendre), **ألعب** (Jouer), **أبدع** (Créer). Ce sont des cibles d'au moins 120 px, chacune avec sa voix (« هنا نتعلّم! »).
3. **Didou au centre.** Un tap le fait se présenter et nommer les trois portes, avec un sous-titre facultatif, une interruption propre et une seule voix à la fois.
4. **Pour l'enfant qui revient**, Didou propose la dernière activité avec un gros bouton ▶. Il n'affiche pas de compteur.
5. **Hors de l'écran enfant** :
   - les fiches imprimables, les réglages et le carnet passent dans un **coin parent** protégé par la protection parent ;
   - le défi du jour devient une petite étoile près de Didou, qui ne prend plus toute la largeur.
6. **Aucun défilement** n'est nécessaire en 360×640.

**Critères d'acceptation** : un enfant qui ne lit pas atteint une activité en 2 taps, guidé uniquement par la voix ; il n'y a aucun texte nécessaire à l'écran.

## Lot 3 — L'enveloppe immersive commune des activités
Créer **un seul composant `PreschoolScene`** qui enveloppe toutes les activités, plutôt que de refaire chaque mécanique.
1. **Le décor peint du thème** (lot 1) en fond, plein écran, et l'ancienne interface masquée, comme `VillageLessonScene`.
2. **Une barre minimale de 72 px** : retour, réécoute de la consigne, son. Rien d'autre.
3. **Didou en bas d'écran**, toujours au même endroit, qui change d'expression selon l'état : il écoute pendant la consigne, il réfléchit pendant l'attente, il encourage après une erreur, il célèbre à la réussite.
4. **Une zone de jeu centrale fixe** : les cibles ne bougent jamais pendant que l'enfant vise.
5. **Une progression sans chiffres** : 3 à 5 petites graines qui fleurissent, et pas de « 2 / 5 » à lire.
6. **Une fin de série commune** : une célébration courte de moins de 2 secondes, puis deux gros boutons, « encore » (🔁) et « autre chose » (▶), en icônes vocalisées.
7. **Brancher les 15 mécaniques** sur cette enveloppe **sans changer leurs règles**.

## Lot 4 — Le système d'animation
1. **Étendre `villageMotion.ts`** avec des préréglages pour le préscolaire :
   - appui (enfoncement en 3D) ;
   - aimantation lors d'un dépôt ;
   - réussite (rebond, puis étoiles) ;
   - encouragement (petit hochement) ;
   - consigne (Didou parle) ;
   - attente (respiration).
2. **Animer uniquement `transform` et `opacity`**, et jamais la position ni la taille.
3. **Didou** :
   - passe d'une pose à l'autre en fondu (0,18 s) ;
   - respire légèrement au repos ;
   - fait des mouvements de bouche simples **seulement pendant que sa voix est jouée**. Ne pas promettre une synchronisation labiale.
4. **Des célébrations graduées** : une petite étoile pour une bonne réponse, des confettis seulement en fin de série. Ne pas surstimuler.
5. **Des sons doux** pour l'appui, le dépôt et la réussite. Une erreur est toujours un son neutre et grave, puis la voix d'encouragement.
6. **L'ambiance du décor** (nuages, oiseaux, feuilles) reprend `WorldAmbience` : discrète, mise en pause quand le mouvement est réduit, et jamais au-dessus des cibles.
7. **Les boucles vidéo**, si elles sont utilisées pour les décors : WebM de 1 Mo maximum, chargé en différé, non précaché, avec une image fixe en secours.

## Lot 5 — Pilote immersif : la mission du jardin (prototype Premium)
1. **Reprendre `PreschoolGardenMission`** dans l'enveloppe du lot 3, avec le décor du jardin, sur 3 séances : planter, arroser, récolter et compter.
2. **La première séance reste gratuite**, complète et rejouable. On ne coupe jamais l'enfant au milieu d'un geste.
3. **Le bilan parent** : ce qui a été essayé, avec quelle aide, ce qui n'a pas encore été observé, et une activité à faire ensuite à la maison (« عدّا الطماطم معًا في المطبخ »).
4. **Mesurer** l'ouverture, la fin de séance et l'arrêt en cours de route, avec les compteurs anonymes existants.

**Critère d'acceptation** : la séance de la mission du jardin se joue sans aucune lecture, à 60 fps sur un Android d'entrée de gamme.

## Lot 6 — Étendre, puis valider
1. Appliquer l'enveloppe et les décors aux modules principaux, dans cet ordre : **nombres, lettres, formes et couleurs, monde**.
2. **Budget de performance** : premier affichage de l'accueil préscolaire sous 2,5 s en 4G lente sur un Android d'entrée de gamme. Images et sons chargés à la demande.
3. **Test avec 3 à 5 enfants de 3 à 5 ans**, accompagnés d'un parent, après le test 5AP.
   - Observer : y arrivent-ils sans lire ? où hésitent-ils ? Didou est-il compris ? l'animation est-elle trop forte ?
   - Relecture par une enseignante du préscolaire.
4. **À ne pas faire avant ce test** : de nouveaux mondes, de nouvelles activités en masse, ou un abonnement préscolaire séparé.

## Ordre
Lot 0, puis lot 1 (les prompts maintenant, les images de Karim en parallèle), puis lots 2, 3, 4, 5 et 6. Les lots 2 à 4 peuvent avancer avec des images provisoires si les images finales du lot 1 ne sont pas encore livrées.
