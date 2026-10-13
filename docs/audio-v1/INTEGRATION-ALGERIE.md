# Voix de Découvrir l'Algérie

Les sources fournies le 13 octobre 2026 sont Asmaa à 20:14:59, Léa à 20:14:19 et Quentin à 20:13:29. Elles couvrent huit activités : une consigne et une félicitation par activité et par langue, soit 48 MP3 mono, 44,1 kHz, 96 kbit/s. Les originaux restent dans Downloads.

Le rapport `enregistrements-algerie.json` conserve les textes attendus, la transcription de repérage, les positions des coupes, les durées et les empreintes SHA-256 des sources et des extraits. La langue détectée est vérifiée avant alignement ; chaque coupe est placée dans une pause et chaque fichier est décodé pour vérifier la présence de son et sa durée.

Les activités utilisent désormais les fichiers enregistrés et leur durée réelle de félicitation, avec le secours vocal existant. Le catalogue partagé permet aussi de réutiliser ces phrases ailleurs : trois demandes de futurs lots sont déjà couvertes par ces voix. Le catalogue contient maintenant 798 fichiers, correspondant à 785 phrases distinctes. Il reste 519 fichiers cibles et 498 générations uniques pour les plans préparés.

## Contrôle de prononciation

La reconnaissance automatique écrit « phoenix » pour « fennec » dans quatre consignes/félicitations anglaises (`algeria-fennec-flag-prompt`, `algeria-fennec-tap-prompt`, `algeria-fennec-tap-success`, `algeria-habitat-sort-prompt`). Karim a confirmé entendre « fé-nek » le 13 octobre 2026 après présentation de l'extrait. Les fichiers sont conservés sans nouvelle génération ni consommation de crédits. Cette différence est traitée comme une erreur de reconnaissance.

Les autres différences de transcription sont conservées dans le rapport pour une écoute de contrôle ; la reconnaissance ne certifie pas la qualité pédagogique de la voix.

Les 17 tests ciblés des fichiers et du lecteur passent, ainsi que la vérification TypeScript et le build frontend Android. Le cache généré contient les 798 voix préscolaires, dont les 48 voix Algérie. Ces changements ne publient pas une nouvelle version Android ; l'installation d'un nouveau build et l'écoute sur téléphone restent nécessaires.
