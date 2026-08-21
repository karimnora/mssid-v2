import { PreschoolModule } from './types';

/**
 * "أَلْغَازُ التَّسَلْسُل وَالمَنْطِق" — Puzzles Logiques Séquentiels (0AP)
 * 8 activités "Qu'est-ce qui vient ensuite ?" sur des patterns AB/ABB/ABC simples.
 * Interaction type : 'sequence' — affiche le pattern visuellement + 3 choix de réponse.
 * Ciblé 4-5 ans (logique spatiale / pré-mathématique).
 */
export const SEQUENCE_MODULE: PreschoolModule = {
  id: 'preschool-sequences',
  domain: 'creative',
  icon: '🔁',
  totalSteps: 8,
  titleI18n: {
    ar: 'أَلْغَازُ التَّسَلْسُل',
    fr: 'Puzzles Séquences',
    en: 'Sequence Puzzles',
  },
  activities: [
    // ── 1. Couleurs AB ────────────────────────────────────────────────────────
    {
      id: 'seq-colors-ab',
      domain: 'creative',
      targetValue: 'red-blue',
      stepNumber: 1,
      interactionType: 'sequence',
      i18n: {
        ar: {
          title: 'مَا التَّالِي فِي النَّمَط؟',
          promptAudio: 'أَحْمَر، أَزْرَق، أَحْمَر، أَزْرَق... مَاذَا يَأْتِي بَعْدَ ذَلِك؟ اِلْمَسِ الإِجَابَة!',
          successAudio: 'صَحِيح! أَحْمَر يَأْتِي بَعْدَ الأَزْرَق! أَنْتَ ذَكِيٌّ جِدَّاً!',
        },
        fr: {
          title: 'Qu\'est-ce qui vient ensuite ?',
          promptAudio: 'Rouge, bleu, rouge, bleu... Qu\'est-ce qui vient ensuite ? Touche la bonne réponse !',
          successAudio: 'Exact ! Rouge vient après bleu ! Tu es très malin !',
        },
        en: {
          title: 'What comes next?',
          promptAudio: 'Red, blue, red, blue... What comes next? Tap the right answer!',
          successAudio: 'Correct! Red comes after blue! You are very smart!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🔁',
        sequencePattern: ['🔴', '🔵', '🔴', '🔵'],
        choices: [
          { id: 'red',   asset: '🔴', isCorrect: true  },
          { id: 'blue',  asset: '🔵', isCorrect: false },
          { id: 'green', asset: '🟢', isCorrect: false },
        ],
      },
    },
    // ── 2. Animaux AB ─────────────────────────────────────────────────────────
    {
      id: 'seq-animals-ab',
      domain: 'creative',
      targetValue: 'cat-dog',
      stepNumber: 2,
      interactionType: 'sequence',
      i18n: {
        ar: {
          title: 'مَا الحَيَوَانُ التَّالِي؟',
          promptAudio: 'قِطَّة، كَلْب، قِطَّة، كَلْب... مَا الَّذِي يَأْتِي بَعْدَ ذَلِك؟',
          successAudio: 'أَحْسَنْتَ! القِطَّةُ تَأْتِي بَعْدَ الكَلْب!',
        },
        fr: {
          title: 'Quel animal vient ensuite ?',
          promptAudio: 'Chat, chien, chat, chien... Lequel vient ensuite ?',
          successAudio: 'Bravo ! Le chat vient après le chien !',
        },
        en: {
          title: 'Which animal comes next?',
          promptAudio: 'Cat, dog, cat, dog... Which one comes next?',
          successAudio: 'Well done! The cat comes after the dog!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🐾',
        sequencePattern: ['🐱', '🐶', '🐱', '🐶'],
        choices: [
          { id: 'cat',  asset: '🐱', isCorrect: true  },
          { id: 'dog',  asset: '🐶', isCorrect: false },
          { id: 'fish', asset: '🐟', isCorrect: false },
        ],
      },
    },
    // ── 3. Jour / Nuit AB ─────────────────────────────────────────────────────
    {
      id: 'seq-day-night',
      domain: 'creative',
      targetValue: 'sun-moon',
      stepNumber: 3,
      interactionType: 'sequence',
      i18n: {
        ar: {
          title: 'نَهَارٌ أَمْ لَيْلٌ؟',
          promptAudio: 'شَمْسٌ، قَمَرٌ، شَمْسٌ، قَمَرٌ... مَاذَا يَأْتِي بَعْدَ ذَلِك؟',
          successAudio: 'مُمْتَاز! الشَّمْسُ تَأْتِي بَعْدَ القَمَر! صَحِيح تَمَاماً!',
        },
        fr: {
          title: 'Jour ou nuit ?',
          promptAudio: 'Soleil, lune, soleil, lune... Qu\'est-ce qui vient ensuite ?',
          successAudio: 'Excellent ! Le soleil vient après la lune ! Parfaitement juste !',
        },
        en: {
          title: 'Day or night?',
          promptAudio: 'Sun, moon, sun, moon... What comes next?',
          successAudio: 'Excellent! The sun comes after the moon! Perfectly right!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🌗',
        sequencePattern: ['☀️', '🌙', '☀️', '🌙'],
        choices: [
          { id: 'sun',   asset: '☀️', isCorrect: true  },
          { id: 'moon',  asset: '🌙', isCorrect: false },
          { id: 'cloud', asset: '⭐', isCorrect: false },
        ],
      },
    },
    // ── 4. Fruits AB ──────────────────────────────────────────────────────────
    {
      id: 'seq-fruits-ab',
      domain: 'creative',
      targetValue: 'apple-banana',
      stepNumber: 4,
      interactionType: 'sequence',
      i18n: {
        ar: {
          title: 'مَا الفَاكِهَةُ التَّالِيَة؟',
          promptAudio: 'تُفَّاحَة، مَوْزَة، تُفَّاحَة، مَوْزَة... مَاذَا يَأْتِي بَعْدَ ذَلِك؟',
          successAudio: 'رَائِعٌ! التُّفَّاحَةُ تَأْتِي بَعْدَ المَوْزَة!',
        },
        fr: {
          title: 'Quel fruit vient ensuite ?',
          promptAudio: 'Pomme, banane, pomme, banane... Quel fruit vient ensuite ?',
          successAudio: 'Super ! La pomme vient après la banane !',
        },
        en: {
          title: 'Which fruit comes next?',
          promptAudio: 'Apple, banana, apple, banana... Which fruit comes next?',
          successAudio: 'Great! The apple comes after the banana!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🍎',
        sequencePattern: ['🍎', '🍌', '🍎', '🍌'],
        choices: [
          { id: 'apple',   asset: '🍎', isCorrect: true  },
          { id: 'banana',  asset: '🍌', isCorrect: false },
          { id: 'grape',   asset: '🍇', isCorrect: false },
        ],
      },
    },
    // ── 5. Grande / Petite (AB) ───────────────────────────────────────────────
    {
      id: 'seq-big-small',
      domain: 'creative',
      targetValue: 'elephant-mouse',
      stepNumber: 5,
      interactionType: 'sequence',
      i18n: {
        ar: {
          title: 'كَبِيرٌ أَمْ صَغِير؟',
          promptAudio: 'فِيلٌ، فَأْرٌ، فِيلٌ، فَأْرٌ... مَا الَّذِي يَأْتِي بَعْدَ ذَلِك؟',
          successAudio: 'ذَكِيٌّ! الفِيلُ الكَبِيرُ يَأْتِي بَعْدَ الفَأْرِ الصَّغِير!',
        },
        fr: {
          title: 'Grand ou petit ?',
          promptAudio: 'Éléphant, souris, éléphant, souris... Qu\'est-ce qui vient ensuite ?',
          successAudio: 'Intelligent ! Le grand éléphant vient après la petite souris !',
        },
        en: {
          title: 'Big or small?',
          promptAudio: 'Elephant, mouse, elephant, mouse... What comes next?',
          successAudio: 'Smart! The big elephant comes after the small mouse!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🐘',
        sequencePattern: ['🐘', '🐭', '🐘', '🐭'],
        choices: [
          { id: 'elephant', asset: '🐘', isCorrect: true  },
          { id: 'mouse',    asset: '🐭', isCorrect: false },
          { id: 'cat',      asset: '🐱', isCorrect: false },
        ],
      },
    },
    // ── 6. Transport ABB ──────────────────────────────────────────────────────
    {
      id: 'seq-transport-abb',
      domain: 'creative',
      targetValue: 'car-bus-bus',
      stepNumber: 6,
      interactionType: 'sequence',
      i18n: {
        ar: {
          title: 'مَا المَرْكَبَةُ التَّالِيَة؟',
          promptAudio: 'سَيَّارَة، حَافِلَة، حَافِلَة، سَيَّارَة، حَافِلَة، حَافِلَة... مَاذَا يَأْتِي بَعْدَ ذَلِك؟',
          successAudio: 'مُمْتَاز! السَّيَّارَةُ تَأْتِي بَعْدَ الحَافِلَتَيْن!',
        },
        fr: {
          title: 'Quel véhicule vient ensuite ?',
          promptAudio: 'Voiture, bus, bus, voiture, bus, bus... Qu\'est-ce qui vient ensuite ?',
          successAudio: 'Excellent ! La voiture vient après deux bus !',
        },
        en: {
          title: 'Which vehicle comes next?',
          promptAudio: 'Car, bus, bus, car, bus, bus... What comes next?',
          successAudio: 'Excellent! The car comes after two buses!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🚦',
        sequencePattern: ['🚗', '🚌', '🚌', '🚗', '🚌', '🚌'],
        choices: [
          { id: 'car',   asset: '🚗', isCorrect: true  },
          { id: 'bus',   asset: '🚌', isCorrect: false },
          { id: 'bike',  asset: '🚲', isCorrect: false },
        ],
      },
    },
    // ── 7. Météo ABC ──────────────────────────────────────────────────────────
    {
      id: 'seq-weather-abc',
      domain: 'creative',
      targetValue: 'sun-cloud-rain',
      stepNumber: 7,
      interactionType: 'sequence',
      i18n: {
        ar: {
          title: 'مَا طَقْسُ اليَوْمِ التَّالِي؟',
          promptAudio: 'شَمْسٌ، غَيْمٌ، مَطَرٌ، شَمْسٌ، غَيْمٌ... مَاذَا يَأْتِي بَعْدَ ذَلِك؟',
          successAudio: 'رَائِعٌ! المَطَرُ يَأْتِي بَعْدَ الغَيْم! عَبْقَرِيٌّ!',
        },
        fr: {
          title: 'Quel temps vient ensuite ?',
          promptAudio: 'Soleil, nuage, pluie, soleil, nuage... Qu\'est-ce qui vient ensuite ?',
          successAudio: 'Magnifique ! La pluie vient après le nuage ! Génie !',
        },
        en: {
          title: 'What weather comes next?',
          promptAudio: 'Sun, cloud, rain, sun, cloud... What comes next?',
          successAudio: 'Magnificent! Rain comes after the cloud! Genius!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '⛅',
        sequencePattern: ['☀️', '☁️', '🌧️', '☀️', '☁️'],
        choices: [
          { id: 'rain',  asset: '🌧️', isCorrect: true  },
          { id: 'sun',   asset: '☀️', isCorrect: false },
          { id: 'snow',  asset: '❄️', isCorrect: false },
        ],
      },
    },
    // ── 8. Chiffres +1 ────────────────────────────────────────────────────────
    {
      id: 'seq-numbers-inc',
      domain: 'creative',
      targetValue: '1-2-3-4',
      stepNumber: 8,
      interactionType: 'sequence',
      i18n: {
        ar: {
          title: 'مَا العَدَدُ التَّالِي؟',
          promptAudio: 'وَاحِد، اثْنَان، ثَلَاثَة... مَاذَا يَأْتِي بَعْدَ ذَلِك؟ اِحْسُبْ مَعِي!',
          successAudio: 'أَرْبَعَة! صَحِيحٌ تَمَاماً! أَنْتَ بَطَلٌ فِي الأَعْدَاد!',
        },
        fr: {
          title: 'Quel chiffre vient ensuite ?',
          promptAudio: 'Un, deux, trois... Quel chiffre vient ensuite ? Compte avec moi !',
          successAudio: 'Quatre ! Parfaitement juste ! Tu es un champion des chiffres !',
        },
        en: {
          title: 'Which number comes next?',
          promptAudio: 'One, two, three... Which number comes next? Count with me!',
          successAudio: 'Four! Perfectly correct! You are a numbers champion!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🔢',
        sequencePattern: ['1️⃣', '2️⃣', '3️⃣'],
        choices: [
          { id: 'four',  asset: '4️⃣', isCorrect: true  },
          { id: 'two',   asset: '2️⃣', isCorrect: false },
          { id: 'five',  asset: '5️⃣', isCorrect: false },
        ],
      },
    },
  ],
};
