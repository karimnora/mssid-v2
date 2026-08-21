import { PreschoolModule } from './types';

/**
 * "أَلْغَازُ التَّسَلْسُل" — Puzzles Séquences (0AP).
 * `sequencePattern` = what is SHOWN (incomplete). The missing next item is the
 * one correct choice. AB/ABB never end on a full period (that made "next" look wrong).
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
    {
      id: 'seq-colors-ab',
      domain: 'creative',
      targetValue: 'red-blue',
      stepNumber: 1,
      interactionType: 'sequence',
      i18n: {
        ar: {
          title: 'أَحْمَر ثُمَّ أَزْرَق',
          promptAudio: 'أَحْمَر، أَزْرَق، أَحْمَر، أَزْرَق، أَحْمَر... مَاذَا بَعْد؟',
          promptText: 'نمط AB. المعروض ينتهي بالأحمر → الجواب الأزرق.',
          successAudio: 'الأَزْرَقُ بَعْدَ الأَحْمَر! أَحْسَنْت!',
        },
        fr: {
          title: 'Rouge puis Bleu',
          promptAudio: 'Rouge, bleu, rouge, bleu, rouge... ensuite ?',
          promptText: 'Motif AB. La rangée finit sur rouge → réponse bleu.',
          successAudio: 'Le bleu vient après le rouge ! Bravo !',
        },
        en: {
          title: 'Red then Blue',
          promptAudio: 'Red, blue, red, blue, red... what is next?',
          promptText: 'AB pattern. The row ends on red → answer is blue.',
          successAudio: 'Blue comes after red! Well done!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🔁',
        sequencePattern: ['🔴', '🔵', '🔴', '🔵', '🔴'],
        choices: [
          { id: 'blue',  asset: '🔵', isCorrect: true },
          { id: 'red',   asset: '🔴', isCorrect: false },
          { id: 'green', asset: '🟢', isCorrect: false },
        ],
      },
    },
    {
      id: 'seq-animals-ab',
      domain: 'creative',
      targetValue: 'cat-dog',
      stepNumber: 2,
      interactionType: 'sequence',
      i18n: {
        ar: {
          title: 'قِطَّة ثُمَّ كَلْب',
          promptAudio: 'قِطَّة، كَلْب، قِطَّة، كَلْب، قِطَّة... مَاذَا بَعْد؟',
          promptText: 'ينتهي بالقطة → الجواب الكلب.',
          successAudio: 'الكَلْبُ بَعْدَ القِطَّة! أَحْسَنْت!',
        },
        fr: {
          title: 'Chat puis Chien',
          promptAudio: 'Chat, chien, chat, chien, chat... ensuite ?',
          promptText: 'La rangée finit sur le chat → réponse chien.',
          successAudio: 'Le chien vient après le chat ! Bravo !',
        },
        en: {
          title: 'Cat then Dog',
          promptAudio: 'Cat, dog, cat, dog, cat... what is next?',
          promptText: 'The row ends on the cat → answer is dog.',
          successAudio: 'The dog comes after the cat! Well done!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🐾',
        sequencePattern: ['🐱', '🐶', '🐱', '🐶', '🐱'],
        choices: [
          { id: 'dog',  asset: '🐶', isCorrect: true },
          { id: 'cat',  asset: '🐱', isCorrect: false },
          { id: 'fish', asset: '🐟', isCorrect: false },
        ],
      },
    },
    {
      id: 'seq-day-night',
      domain: 'creative',
      targetValue: 'sun-moon',
      stepNumber: 3,
      interactionType: 'sequence',
      i18n: {
        ar: {
          title: 'شَمْس ثُمَّ قَمَر',
          promptAudio: 'شَمْس، قَمَر، شَمْس، قَمَر، شَمْس... مَاذَا بَعْد؟',
          promptText: 'ينتهي بالشمس → الجواب القمر.',
          successAudio: 'القَمَرُ بَعْدَ الشَّمْس! مُمْتَاز!',
        },
        fr: {
          title: 'Soleil puis Lune',
          promptAudio: 'Soleil, lune, soleil, lune, soleil... ensuite ?',
          promptText: 'La rangée finit sur le soleil → réponse lune.',
          successAudio: 'La lune vient après le soleil ! Super !',
        },
        en: {
          title: 'Sun then Moon',
          promptAudio: 'Sun, moon, sun, moon, sun... what is next?',
          promptText: 'The row ends on the sun → answer is moon.',
          successAudio: 'The moon comes after the sun! Great!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🌗',
        sequencePattern: ['☀️', '🌙', '☀️', '🌙', '☀️'],
        choices: [
          { id: 'moon',  asset: '🌙', isCorrect: true },
          { id: 'sun',   asset: '☀️', isCorrect: false },
          { id: 'star',  asset: '⭐', isCorrect: false },
        ],
      },
    },
    {
      id: 'seq-fruits-ab',
      domain: 'creative',
      targetValue: 'apple-banana',
      stepNumber: 4,
      interactionType: 'sequence',
      i18n: {
        ar: {
          title: 'تُفَّاحَة ثُمَّ مَوْزَة',
          promptAudio: 'تُفَّاحَة، مَوْزَة، تُفَّاحَة، مَوْزَة، تُفَّاحَة... مَاذَا بَعْد؟',
          promptText: 'ينتهي بالتفاحة → الجواب الموزة.',
          successAudio: 'المَوْزَةُ بَعْدَ التُّفَّاحَة!',
        },
        fr: {
          title: 'Pomme puis Banane',
          promptAudio: 'Pomme, banane, pomme, banane, pomme... ensuite ?',
          promptText: 'La rangée finit sur la pomme → réponse banane.',
          successAudio: 'La banane vient après la pomme !',
        },
        en: {
          title: 'Apple then Banana',
          promptAudio: 'Apple, banana, apple, banana, apple... what is next?',
          promptText: 'The row ends on the apple → answer is banana.',
          successAudio: 'Banana comes after the apple!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🍎',
        sequencePattern: ['🍎', '🍌', '🍎', '🍌', '🍎'],
        choices: [
          { id: 'banana', asset: '🍌', isCorrect: true },
          { id: 'apple',  asset: '🍎', isCorrect: false },
          { id: 'grape',  asset: '🍇', isCorrect: false },
        ],
      },
    },
    {
      id: 'seq-big-small',
      domain: 'creative',
      targetValue: 'elephant-mouse',
      stepNumber: 5,
      interactionType: 'sequence',
      i18n: {
        ar: {
          title: 'فِيل ثُمَّ فَأْر',
          promptAudio: 'فِيل، فَأْر، فِيل، فَأْر، فِيل... مَاذَا بَعْد؟',
          promptText: 'ينتهي بالفيل → الجواب الفأر.',
          successAudio: 'الفَأْرُ الصَّغِيرُ بَعْدَ الفِيل!',
        },
        fr: {
          title: 'Éléphant puis Souris',
          promptAudio: 'Éléphant, souris, éléphant, souris, éléphant... ensuite ?',
          promptText: 'La rangée finit sur l\'éléphant → réponse souris.',
          successAudio: 'La petite souris vient après l\'éléphant !',
        },
        en: {
          title: 'Elephant then Mouse',
          promptAudio: 'Elephant, mouse, elephant, mouse, elephant... what is next?',
          promptText: 'The row ends on the elephant → answer is mouse.',
          successAudio: 'The small mouse comes after the elephant!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🐘',
        sequencePattern: ['🐘', '🐭', '🐘', '🐭', '🐘'],
        choices: [
          { id: 'mouse',    asset: '🐭', isCorrect: true },
          { id: 'elephant', asset: '🐘', isCorrect: false },
          { id: 'cat',      asset: '🐱', isCorrect: false },
        ],
      },
    },
    {
      id: 'seq-transport-abb',
      domain: 'creative',
      targetValue: 'car-bus-bus',
      stepNumber: 6,
      interactionType: 'sequence',
      i18n: {
        ar: {
          title: 'سَيَّارَة ثُمَّ حَافِلَتَان',
          promptAudio: 'سَيَّارَة، حَافِلَة، حَافِلَة، سَيَّارَة، حَافِلَة... مَاذَا بَعْد؟',
          promptText: 'نمط ABB. بعد سيارة+حافلة يبقى حافلة.',
          successAudio: 'حَافِلَةٌ ثَانِيَة! أَحْسَنْت!',
        },
        fr: {
          title: 'Voiture puis deux Bus',
          promptAudio: 'Voiture, bus, bus, voiture, bus... ensuite ?',
          promptText: 'Motif ABB. Après voiture+bus, il manque le 2e bus.',
          successAudio: 'Un deuxième bus ! Bravo !',
        },
        en: {
          title: 'Car then Two Buses',
          promptAudio: 'Car, bus, bus, car, bus... what is next?',
          promptText: 'ABB pattern. After car+bus, the 2nd bus is missing.',
          successAudio: 'A second bus! Well done!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🚦',
        sequencePattern: ['🚗', '🚌', '🚌', '🚗', '🚌'],
        choices: [
          { id: 'bus',  asset: '🚌', isCorrect: true },
          { id: 'car',  asset: '🚗', isCorrect: false },
          { id: 'bike', asset: '🚲', isCorrect: false },
        ],
      },
    },
    {
      id: 'seq-weather-abc',
      domain: 'creative',
      targetValue: 'sun-cloud-rain',
      stepNumber: 7,
      interactionType: 'sequence',
      i18n: {
        ar: {
          title: 'شَمْس، غَيْم، مَطَر',
          promptAudio: 'شَمْس، غَيْم، مَطَر، شَمْس، غَيْم... مَاذَا بَعْد؟',
          promptText: 'نمط ABC. بعد شمس+غيم يأتي المطر.',
          successAudio: 'المَطَرُ بَعْدَ الغَيْم! عَبْقَرِي!',
        },
        fr: {
          title: 'Soleil, Nuage, Pluie',
          promptAudio: 'Soleil, nuage, pluie, soleil, nuage... ensuite ?',
          promptText: 'Motif ABC. Après soleil+nuage vient la pluie.',
          successAudio: 'La pluie vient après le nuage ! Génie !',
        },
        en: {
          title: 'Sun, Cloud, Rain',
          promptAudio: 'Sun, cloud, rain, sun, cloud... what is next?',
          promptText: 'ABC pattern. After sun+cloud comes rain.',
          successAudio: 'Rain comes after the cloud! Genius!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '⛅',
        sequencePattern: ['☀️', '☁️', '🌧️', '☀️', '☁️'],
        choices: [
          { id: 'rain', asset: '🌧️', isCorrect: true },
          { id: 'sun',  asset: '☀️', isCorrect: false },
          { id: 'snow', asset: '❄️', isCorrect: false },
        ],
      },
    },
    {
      id: 'seq-numbers-inc',
      domain: 'creative',
      targetValue: '1-2-3-4',
      stepNumber: 8,
      interactionType: 'sequence',
      i18n: {
        ar: {
          title: 'نَعُدُّ مَعاً',
          promptAudio: 'وَاحِد، اثْنَان، ثَلَاثَة... مَا العَدَدُ التَّالِي؟',
          promptText: 'عدّ +1 : بعد 3 يأتي 4.',
          successAudio: 'أَرْبَعَة! بَطَلُ الأَعْدَاد!',
        },
        fr: {
          title: 'On Compte Ensemble',
          promptAudio: 'Un, deux, trois... quel chiffre ensuite ?',
          promptText: 'Compter +1 : après 3 vient 4.',
          successAudio: 'Quatre ! Champion des chiffres !',
        },
        en: {
          title: 'We Count Together',
          promptAudio: 'One, two, three... which number is next?',
          promptText: 'Count +1: after 3 comes 4.',
          successAudio: 'Four! Numbers champion!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🔢',
        sequencePattern: ['1️⃣', '2️⃣', '3️⃣'],
        choices: [
          { id: 'four', asset: '4️⃣', isCorrect: true },
          { id: 'two',  asset: '2️⃣', isCorrect: false },
          { id: 'five', asset: '5️⃣', isCorrect: false },
        ],
      },
    },
  ],
};
