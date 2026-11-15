# Examens et défis — audit du 13 novembre 2026

Révision produit auditée : `2650e11`. Audit demandé par Karim, puis élargi à la pédagogie du préscolaire à la 5AP. Aucun contenu du produit n'a été corrigé dans ce lot d'analyse, aucun nouvel audio généré. Les propositions ci-dessous sont à appliquer dans des lots de correction distincts.

## Verdict

Les parcours principaux fonctionnent, mais la partie n'est pas entièrement validée pour l'autonomie d'un enfant. Les points les plus importants concernent la lecture audio et l'accès à la correction. Les examens sont des sujets d'entraînement avec corrigé, pas un moteur de notation automatique des réponses de l'enfant.

## Ce qui fonctionne dans le périmètre contrôlé

- 369 sujets : les tests vérifient identifiants, barèmes, couverture des matières/trimestres ciblés et liens vers des cours existants.
- 90 défis rédigés, complétés par six défis quotidiens issus des cours le jour de l'audit. Les bonnes réponses de la banque sont présentes parmi les choix.
- La 1AP n'a pas de sujet formel dans cette banque ; les défis 1AP–2AP excluent les formats chronométrés et boss dans la liste principale.
- L'XP d'un défi terminé n'est pas réattribué au rejeu ; la fin d'une même partie est protégée contre un double envoi.
- Les parcours navigateur « terminer un défi » et « marquer un examen terminé » passent. Les corrigés mathématiques ciblés sont vérifiés à 320, 390 et 1280 px, avec contrôle de l'impression à 390 px.

Validation : **116 tests existants dans six fichiers et cinq scénarios navigateur réussis**. Ces vérifications ne certifient pas la justesse de chaque corrigé ni la conformité de chaque sujet au programme officiel.

## Défauts confirmés et conséquences pédagogiques

### EX-01 — La voix arabe reçoit le français d'un examen 3AP — priorité haute

Dans [ExamsViewer.tsx](../../../frontend/src/components/ExamsViewer.tsx#L126), `handleSpeak` force `ar-SA`. Le titre et les consignes arabes peuvent légitimement employer cette voix ; un énoncé français doit employer le français.

Reproduction : ouvrir le premier sujet de français 3AP (`exam-3ap-french-t1-2026`) et écouter le premier exercice : `Complète : « Bonjour ! Je ...... Yassine. »`. L'appel reçu est `speakText(texteFrançais, 'ar-SA', 0.85)`. Le même routage est utilisé pour l'anglais.

Correction proposée : choisir la langue du passage effectivement lu ; conserver l'arabe pour les titres/consignes arabes et traiter correctement les passages mixtes. Vérifier la disponibilité de cette langue, pas uniquement de l'arabe.

### DEF-01 — Les défis retirent les voyelles avant la lecture — priorité haute

[ChallengesArena.tsx](../../../frontend/src/components/ChallengesArena.tsx#L759) retire systématiquement le tashkīl des questions et options, même si le texte d'origine est vocalisé. L'index des enregistrements conserve intentionnellement ces voyelles pour éviter de confondre les sons.

Mesure sur **274 chaînes distinctes** de questions/options rédigées pour 1AP–2AP : 55 sont couvertes en recherchant le texte original, 31 avec le texte effectivement dépouillé de ses voyelles. **27 correspondances enregistrées sont perdues** ; trois autres apparaissent après retrait, d'où un écart net de 24. Exemples perdus : `بَ`, `بُ`, `بِ`, `بْ`, `هَذَا`, `هَذِهِ`, `تُفَّاحَةٌ`.

Correction proposée : garder le texte vocalisé pour la voix, indépendamment de la préférence d'affichage ; réutiliser la détection par texte déjà présente dans les cours. Les boutons restent actuellement affichés sans garantie qu'un fichier ou une voix appropriée soit disponible. Restaurer les correspondances ne suffira pas à enregistrer toutes les autres consignes des défis.

### DEF-02 — Boutons d'écoute imbriqués dans les réponses — priorité moyenne

[ChallengesArena.tsx](../../../frontend/src/components/ChallengesArena.tsx#L784) place `TapSpeakButton`, qui est un bouton, dans un autre bouton-réponse. Reproduit sur un défi 1AP à 390 px ; Axe détecte `nested-interactive`. Voir [preuve navigateur](defis-accessibilite.json).

Correction proposée : séparer le bouton d'écoute et le bouton de sélection, comme le font déjà les quiz de cours. Vérifier ensuite le toucher, le clavier et le lecteur d'écran.

## Choix pédagogiques et produit à clarifier

### EX-02 — Les corrigés 2AP–3AP sont masqués à l'écran

`showExamTools` est vrai uniquement en 4AP–5AP. Les solutions 2AP–3AP existent, peuvent être imprimées avec le corrigé, mais restent dans une zone `print-corrige--screen-hidden` à l'écran. C'est un comportement délibérément couvert par les tests existants, pas une panne du bouton.

Conséquence : un enfant qui travaille sur téléphone ne peut pas comparer facilement sa réponse au corrigé. Proposition : permettre une consultation progressive du corrigé et une explication simple après la tentative, en réutilisant les données existantes.

### EX-03 — « Terminé » est une déclaration, pas un résultat vérifié

Le bouton de fin appelle `onExamComplete(id)` ; il ne collecte ni réponses ni note. La progression accorde 50 XP à la première déclaration. Il faut présenter cette progression comme un entraînement terminé, sans en déduire une compétence acquise ou un examen réussi au sens scolaire.

### DEF-03 — Le rejeu peut encore donner des pièces

Reproduction : défi déjà présent dans `completedChallengeIds`, toutes les réponses justes. Le callback de fin reçoit **0 XP**, mais `onEarnCoins(10)` est encore appelé. Le bonus de niveau de Didou peut ensuite modifier ce montant dans le profil.

Ce comportement est confirmé ; son caractère indésirable dépend de la règle produit. Une récompense de révision peut être pertinente, mais l'app doit distinguer répétition du même questionnaire, révision utile et première réussite. Ne pas retirer mécaniquement toute récompense sans fixer cette règle.

### DEF-04 — Des promesses de durée/volume ne correspondent pas toujours au contenu

- Le mode rapide annonce dix questions ; les défis rédigés peuvent en avoir cinq et les défis quotidiens jusqu'à huit.
- Le mode chrono annonce deux minutes ; les durées dépendent du défi.
- Le texte d'accueil 1AP–2AP annonce « une ou deux questions », alors que les défis proposés ont au moins cinq questions.

Utiliser les durées et nombres réels dans les libellés.

### TRANSVERSE — Séparateurs de milliers encore incohérents

Le relevé repère **110 champs d'examens et 97 champs de défis** contenant des nombres avec une virgule de groupement, par exemple `45,618`. Les cours compilés ne présentent pas ces occurrences dans ce relevé. Harmoniser avec les espaces utilisés dans les cours, en protégeant les vraies virgules décimales de 5AP.

## Ordre de correction proposé

1. Langue des examens, conservation des voyelles et disponibilité réelle des écoutes.
2. Corrigés accessibles en 2AP–3AP et boutons d'écoute séparés des réponses.
3. Libellés de durée/volume et typographie numérique.
4. Décision explicite sur récompenses de révision et interprétation de la progression.

Les sept reproductions unitaires temporaires du lot global constatent des défauts/comportements existants : elles ne sont pas des tests attestant que ces défauts sont corrigés. Les preuves sont dans [reproductions.json](reproductions.json). Les sources des probes et une capture sont conservées localement sous `output/pedagogy-audit`, hors Git.

Voir aussi le [bilan pédagogique global](README.md). Aucun push.
