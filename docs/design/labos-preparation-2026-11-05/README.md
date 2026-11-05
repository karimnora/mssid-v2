# Préparation des images — 5 novembre 2026

## Résultat

20 sources L05–L24 générées via image_gen, plus deux corrections (L08, L12). Il ne s’agit pas de nouvelles sorties Nano Banana. Aucun composant modifié, aucune intégration runtime, aucun test ni commit.

81 exports WebP candidats : 71 sprites et 10 décors, environ 3,3 Mo. Sprites de 480 px maximum, sans agrandissement. Tous les décors restent sous 250 Ko. Les décors portrait restent à 900 px de large pour conserver leurs proportions et éviter un agrandissement artificiel. Découpe par recherche des vides entre objets, puis recadrage à leur contenu ; aucune découpe aveugle en cellules fixes. Les coordonnées sont dans manifest.json.

## Contrôle visuel

- planche-contact.jpg : 22 sources numérotées ; inventaire.json donne la correspondance.
- controle-decoupes.jpg : exports sur damier. Les contours restent à reprendre : ce sont des candidats, pas des fichiers validés.
- L08 initial refusé : mains sur la calotte. La correction montre les cheveux découverts et respecte les sept étapes de wudu.ts. Le rinçage du nez n’est pas démontré séparément : ne pas présenter cette image comme une démonstration exhaustive de cette étape.
- L12 initial refusé : dos incliné, pied droit non dressé. Correction : dos horizontal et pied dressé, mais contact du nez en prosternation ambigu. Les sept sprites et les décors sont isolés dans review-salat ; ne pas les diffuser avant relecture.
- L06 : filet d’eau déjà dessiné dans le décor paysage. À fermer avant d’y superposer une animation liée au geste.
- L10/L11 : motifs et architecture différents. Paire à harmoniser.
- L15 : fond vert contaminant les halos de l’ampoule et de la LED allumées. États non alignés au pixel. À reprendre avant fondu. Le moteur comprend son hélice : la séparer du corps avant de l’animer.
- L16 : vert visible dans les transparences du verre et de la règle. À régénérer sur transparence réelle, sans supprimer les verts légitimes des autres objets.
- L19 : enfant arrêté regardant encore vers la droite de l’image ; ne démontre pas clairement le regard à gauche. À remplacer. États des feux à aligner.
- L22 : étals très proches aux séparations ; contrôler à taille réelle avant utilisation.
- Plusieurs sprites ont un liseré vert résiduel. Seul le fond quasi pur (R<25, G>235, B<25) a été retiré pour préserver les verts utiles. Ne pas étendre arbitrairement le détourage à toute la gamme des verts.

## Prochain travail

Corriger les transparences et les contours, régénérer les visuels refusés, harmoniser les paires de décors, aligner les états et séparer les pièces mobiles. Copier uniquement les éléments validés vers frontend/src/assets/labs lors de l’intégration. Les candidats restent ici pour ne pas les confondre avec les assets prêts.
