# Lot global des labos et présence de Didou

## Périmètre exact

Le catalogue contient 38 labos (et non 39 annoncés pendant le premier relevé). Tous sont raccordés à une scène thématique et à un guide Didou ; catalog-coverage.json donne la correspondance. Ce raccordement commun ne remplace pas les instruments scientifiques, cartes exactes, drapeaux, textes ou mécanismes pédagogiques de chaque labo.

## Intégrations spécifiques

- SalatLab : sept sprites corrigés sur alpha réel, découpés dans les vides, échelle et ligne de sol communes dans des WebP 480×480. Source orientée à droite, miroir en arabe. Décors issus de la même mosquée ; fondus de changement de posture sans interpolation physique. Didou énonce la description courante ; horaires et nombres de rakʿahs conservés. Les contacts au sol et l’assise restent à faire relire par un enseignant avant diffusion publique.
- ElectricityLabInteractive : objet rendu associé à l’état électrique existant, deux lampes rendues pour série/parallèle, matériaux illustrés. La même silhouette de lampe/LED sert aux deux couches : superposition exacte et fondu de lumière. Moteur de face avec corps et hélice séparés ; seule l’hélice tourne. Buzzer en faible vibration. Les schémas et polarités restent affichés par le code.
- RoadCodeLab : rue et passage piéton peints, personnages et bus séparés, états du feu piéton en couches d’opacité. Le sens physique du regard et de la circulation ne dépend pas du RTL. Guide sur la question courante et sur gauche, droite, traversée ; règles intactes. Les sprites de feux reçus ont des silhouettes légèrement différentes : leur alignement visuel doit être contrôlé à l’écran avant validation finale.
- SoukLab : quatre étals, produits, panier vide/plein et décor rendus. Les prix, dinars et calculs restent dans l’application. Le guide dynamique existant est conservé, son doublon dans l’en-tête est retiré. Réduction des mouvements prise en compte.
- MosqueAdabLab : remplace l’illustration CSS par la même mosquée ; Didou lit la situation courante.
- WuduLab : le guide lit maintenant l’étape en cours, sans changer l’ordre ni les règles du lot déjà poussé.

## Couche commune

Six nouveaux décors sans texte ni drapeau : atelier maths, lecture/langues, sciences, exploration géographique, musée algérien, atelier créatif. Ils encadrent les activités dans ActiveWorkspace en mode monde de jeu. Les autres thèmes réutilisent les décors propres aux labos.

Didou est raccordé aux 30 labos sans guide natif, avec une orientation courte en arabe et une commande audio. Les huit autres conservent leur guide natif. Aucun nouveau Didou généré : utilisation des poses de référence existantes. Le guide du souk utilise les poses parle/réfléchit/bravo ; la pose bravo accompagne les récompenses des labos immersifs.

## Sources et contraintes

Décors générés via image_gen ; prompts : scène 3D de jeu pour enfants, lumière chaude, matières arrondies, contexte algérien, centre calme et objets sur les bords, aucune écriture ni drapeau. Domaines : mathématiques (boulier et formes), langues (livres fermés sans écriture), sciences (microscope et plante), géographie (modèles de relief sans frontière), histoire (poterie et colonnes), créativité (matériel de dessin et cahier vierge). La prière et le moteur ont été corrigés à partir des sources précédentes. Décors exportés à 1500 px, cible ≤250 Ko. 399 nouvelles voix OpenAI sont raccordées au moteur de lecture existant ; les anciens enregistrements sont conservés. Voir docs/audio-v2/OPENAI-V2.md.

## État

Intégrations et vérifications réalisées : TypeScript, suite complète (248 fichiers, 2 522 tests), puis tests ciblés après indexation audio (9 fichiers, 38 tests). Scan des 38 labos en arabe aux deux tailles demandées : 76 vues, sans erreur ni débordement. Rapports dans verification/. Ne pas confondre cette étape avec une validation pédagogique des images religieuses ou avec la fin de la refonte des cours, examens et jeux.
