# Enregistrements intégrés — V1, lettres du préscolaire

Asmaa : arabe ; Léa : français ; Quentin : anglais. 42 activités avec une consigne et une félicitation par langue : 252 clips MP3 mono à 96 kbit/s dans frontend/public/sounds/preschool/{ar,fr,en}/.

Les clips sont liés par activité et langue dans letterAudio.ts, avec secours par synthèse vocale en cas d’échec. Les transitions attendent la durée des félicitations enregistrées. Les sorties annulent la lecture et les transitions en attente. Les fichiers sont inclus dans le précache web et embarqués par les builds Android.

## Vérifications

Les fichiers ont été alignés au texte par une transcription locale horodatée, avec ajustement des coupures sur les pauses. Les 252 clips sont décodables, contiennent du son et correspondent aux durées prévues. La transcription sert au repérage, pas à certifier la prononciation.

Le rapport enregistrements-integres.json conserve le texte attendu, les limites de découpage, la transcription reconnue et les empreintes SHA-256. Les originaux fournis restent dans Downloads et ne sont pas copiés dans le dépôt.

Avant publication pédagogique, écouter les sons isolés et les noms de lettres. Le reconnaisseur confond J et G sur certains passages français ; Karim a écouté le passage de J et confirmé la prononciation « ji ». Cette confusion de transcription ne justifie donc pas de modifier cet extrait. Les passages peuvent être remplacés individuellement sans refaire le lot complet.

Ce lot couvre les deux modules de lettres du préscolaire. Les mots lus sur les cartes et les autres modules gardent leur lecture actuelle.
