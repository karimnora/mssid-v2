# V2 — réutiliser les voix ElevenLabs déjà enregistrées

État au 2026-11-04.

## Ce qui existe

- **Les originaux.** 48 enregistrements ElevenLabs dans `C:\Users\Karim\Downloads` (`ElevenLabs_2026-10-1x…`), faits du 11 au 14 octobre 2026. Voix : Asmaa (arabe), Léa (français), Quentin (anglais).
- **Ils sont déjà tous intégrés.** Découpés en 1 251 extraits (mono, 44,1 kHz, 96 kbit/s), présents à l'identique sur `main` (V1) et sur `v2` dans `frontend/public/sounds/`. Le détail de chaque découpe est dans `docs/audio-v1/enregistrements-*.json`.
- **L'index.** `src/data/recordedSpeechCatalog.ts` contient 453 textes en arabe, 411 en français et 374 en anglais. Le fichier `docs/audio-v1/REUTILISATION-AUDIO.json` liste en plus 109 phrases jamais enregistrées (« pending »).

## Comment la V2 s'en sert

`speakText(texte, langue)` joue automatiquement l'extrait enregistré quand le texte est **identique** à un texte de l'index : mêmes voyelles, même ponctuation, même article. Sinon, c'est la voix du téléphone qui lit.

Pour réutiliser une voix enregistrée, il suffit donc d'écrire exactement la phrase de l'index. Il ne faut pas adapter l'index : une voyelle différente change la prononciation (`الخَرُوفُ` ≠ `خَرُوف`).

## Ce qui est réutilisable

Les missions 5AP, la planète et les ateliers de la V2 n'ont aucune phrase en commun avec l'index : les enregistrements portent sur le vocabulaire du préscolaire et de la 1AP.

Les **jeux du préscolaire** (`data/games/packsPre.ts`) sont, eux, très proches. Pour 20 mots sur 40, une phrase enregistrée existe déjà. Utiliser ces phrases telles quelles, en `successAr` ou au toucher d'une carte, donne la vraie voix d'Asmaa au lieu de la voix du téléphone.

### packsPre — 20 mots sur 40 ont déjà une phrase enregistrée

| Mot du jeu | Phrase enregistrée réutilisable |
|---|---|
| الخَرُوفُ | « رَائِع! هَذَا خَرُوف! » (animals-sheep-success.mp3)<br>« المِسِ الخَرُوفَ! صُوفُهُ نَاعِمٌ وَدَافِئ! » (animals-sheep-prompt.mp3) |
| البَقَرَةُ | « بَقَرَة » (animals-cow-echo.mp3)<br>« أَحْسَنْت! هَذِهِ بَقَرَة! » (animals-cow-success.mp3) |
| الجَمَلُ | « جَمَلٌ قَوِي! » (art-coloring-camel-success.mp3)<br>« رَائِع! جَ… جَمَلٌ قَوِيّ! » (letters-jeem-camel-success.mp3) |
| البُرْتُقَالُ | « ضَعِ التَّمْرَ وَالبُرْتُقَالَ فِي سَلَّةِ الفَوَاكِه، وَالحَلْوَى فِي صَحْنِ الحَلْوَى! » (letters-fruit-basket-prompt.mp3) |
| العِنَبُ | « المِسِ اللَّوْنَ البَنَفْسَجِيَّ! مِثْلُ عُنْقُودِ العِنَبِ! » (colors-purple-grapes-prompt.mp3)<br>« اِسْحَبِ الفَنَكَ: طَمَاطِم، خُبْز، زَيْتُون، عِنَب، ثُمَّ السُّوق! » (food-fennec-market-prompt.mp3) |
| الدَّائِرَةُ | « أَحْسَنْت! هَذِهِ دَائِرَة! » (shape-circle-cookie-success.mp3)<br>« شَمْسٌ مُشْرِقَة! دَائِرَةٌ رَائِعَة! » (writing-loop-line-success.mp3) |
| المُرَبَّعُ | « رَائِع! هَذَا مُرَبَّع! » (shape-square-gift-success.mp3)<br>« المِسِ المُرَبَّعَ! مِثْلُ عُلْبَةِ الهَدِيَّة! » (shape-square-gift-prompt.mp3) |
| المُثَلَّثُ | « مُمْتَاز! هَذَا مُثَلَّث! » (shape-triangle-pizza-success.mp3)<br>« المِسِ المُثَلَّثَ! مِثْلُ قِطْعَةِ البِيتْزَا! » (shape-triangle-pizza-prompt.mp3) |
| النَّجْمَةُ | « رَائِع! هَذِهِ نَجْمَة! » (shape-star-night-success.mp3)<br>« أَحْسَنْت! نَجْمَةٌ لَكَ! » (surah-fatiha-success.mp3) |
| كَبِيرَةٌ | « اِرْسُمِ الشَّمْسَ! دُرْ دُرْ دُرْ، دَائِرَةٌ كَبِيرَة! » (writing-loop-line-prompt.mp3)<br>« لَوِّنِ الفَنَكَ! آذانٌ كَبِيرَةٌ، ثَعْلَبُ صَحْرَائِنَا! » (art-coloring-fennec-prompt.mp3) |
| صَغِيرٌ | « مُمْتَاز! دُبٌّ صَغِيرٌ لَطِيف! » (letters-dal-bear-success.mp3)<br>« الفَأْرُ الصَّغِيرُ بَعْدَ الفِيل! » (seq-big-small-success.mp3) |
| صِفْرٌ | « أَحْسَنْت! هَذَا هُوَ الصِّفْر! » (num-0-success.mp3)<br>« اِلْمَسِ الصِّفْر! الصَّحْنُ فَارِغ، لَيْسَ فِيهِ شَيْء! » (num-0-prompt.mp3) |
| وَاحِدٌ | « رَائِع! هَذَا هُوَ الوَاحِد! » (num-1-success.mp3) |
| اثْنَانِ | « وَاحِد، اثْنَان، ثَلَاثَة… مَا العَدَدُ التَّالِي؟ » (seq-numbers-inc-prompt.mp3) |
| ثَلَاثَةٌ | « وَاحِد، اثْنَان، ثَلَاثَة… مَا العَدَدُ التَّالِي؟ » (seq-numbers-inc-prompt.mp3) |
| أَرْبَعَةٌ | « أَرْبَعَة! بَطَلُ الأَعْدَاد! » (seq-numbers-inc-success.mp3) |
| سِتَّةٌ | « مُمْتَاز! سَمِعْتَ أَوَّلَ سِتَّةِ أَشْهُر! » (calendar-months-1-success.mp3) |
| ثَمَانِيَةٌ | « أَحْسَنْت! كَتَبْتَ الرَّقْمَ ثَمَانِيَة! » (num-8-success.mp3)<br>« تَتَبَّعِ الرَّقْمَ ثَمَانِيَة بِإِصْبَعِكَ! » (num-8-prompt.mp3) |
| تِسْعَةٌ | « رَائِع! كَتَبْتَ الرَّقْمَ تِسْعَة! » (num-9-success.mp3)<br>« تَتَبَّعِ الرَّقْمَ تِسْعَة بِإِصْبَعِكَ! » (num-9-prompt.mp3) |
| عَشَرَةٌ | « تَتَبَّعِ الرَّقْمَ عَشَرَة بِإِصْبَعِكَ! أَنْتَ بَطَلُ الأَرْقَام! » (num-10-prompt.mp3) |

