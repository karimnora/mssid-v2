import { PreschoolModule } from './types';

/**
 * "عَالَمِي الصَّغِير" — Discovery of the child's day & Algerian living world (0AP).
 * Hygiene lives in Mon Corps — here: day cycle, Sahara animals, habitats, tidy-up, day vs night.
 */
export const WORLD_MODULE: PreschoolModule = {
  id: 'preschool-world',
  domain: 'world',
  icon: '🌍',
  totalSteps: 7,
  titleI18n: {
    ar: 'عَالَمِي الصَّغِير',
    fr: 'Mon Petit Monde',
    en: 'My Little World',
  },
  activities: [
    {
      id: 'world-day-path',
      domain: 'world',
      targetValue: 'day',
      stepNumber: 1,
      interactionType: 'find_path',
      i18n: {
        ar: {
          title: 'يَوْمِي مِنَ الصَّبَاحِ إِلَى اللَّيْل',
          promptAudio: 'اِسْحَبِ العُصْفُورَ: فَجْر، شَمْس، غُرُوب، قَمَر، ثُمَّ البَيْت!',
          promptText: 'الصباح ثم الظهر ثم المساء ثم الليل ثم البيت.',
          successAudio: 'يَوْمٌ كَامِل! أَحْسَنْت!',
        },
        fr: {
          title: 'Ma Journée du Matin au Soir',
          promptAudio: 'Glisse l\'oiseau : aube, soleil, coucher, lune, puis la maison !',
          promptText: 'Matin, midi, soir, nuit, puis la maison.',
          successAudio: 'Une journée complète ! Bravo !',
        },
        en: {
          title: 'My Day from Morning to Night',
          promptAudio: 'Drag the bird: dawn, sun, sunset, moon, then home!',
          promptText: 'Morning, noon, evening, night, then home.',
          successAudio: 'A whole day! Well done!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🐦',
        pathTheme: 'day',
        pathToken: { startAsset: '🌅', endAsset: '🏡', travelerAsset: '🐦' },
        pathStops: [
          { x: 14, y: 32, asset: '🌅', color: '#fed7aa' },
          { x: 42, y: 16, asset: '☀️', color: '#fde68a' },
          { x: 74, y: 28, asset: '🌇', color: '#fdba74' },
          { x: 84, y: 60, asset: '🌙', color: '#c7d2fe' },
          { x: 48, y: 78, asset: '🏡', color: '#bbf7d0' },
        ],
      },
    },
    {
      id: 'world-algerian-animals',
      domain: 'animals',
      targetValue: 'camel',
      stepNumber: 2,
      interactionType: 'tap_choice',
      i18n: {
        ar: {
          title: 'الجَمَلُ سَفِينَةُ الصَّحْرَاء',
          promptAudio: 'اِلْمَسِ الجَمَل! الجَمَلُ يَعِيشُ فِي الصَّحْرَاء!',
          promptText: 'الجمل والفنك والخروف حيوانات نراها في الجزائر.',
          successAudio: 'أَحْسَنْت! هَذَا جَمَلٌ قَوِيّ!',
        },
        fr: {
          title: 'Le Dromadaire du Sahara',
          promptAudio: 'Touche le dromadaire ! Le dromadaire vit dans le désert !',
          promptText: 'Dromadaire, fennec et mouton : des animaux d\'Algérie.',
          successAudio: 'Super ! Voici le roi des dunes !',
        },
        en: {
          title: 'The Desert Camel',
          promptAudio: 'Touch the camel! The camel lives in the desert!',
          promptText: 'Camel, fennec and sheep: animals we see in Algeria.',
          successAudio: 'Well done! That is a strong camel!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🏜️',
        choices: [
          { id: 'camel', asset: '🐪', isCorrect: true },
          { id: 'fennec', asset: '🦊', isCorrect: false },
          { id: 'sheep', asset: '🐑', isCorrect: false },
        ],
      },
    },
    {
      id: 'world-fennec',
      domain: 'animals',
      targetValue: 'fennec',
      stepNumber: 3,
      interactionType: 'tap_choice',
      i18n: {
        ar: {
          title: 'الفَنَكُ صَدِيقُ الصَّحْرَاء',
          promptAudio: 'اِلْمَسِ الفَنَكَ! آذانُهُ كَبِيرَةٌ وَهُوَ ثَعْلَبُ الصَّحْرَاء!',
          promptText: 'الفنك حيوان جزائري صغير بأذنين كبيرتين.',
          successAudio: 'رَائِع! هَذَا فَنَك!',
        },
        fr: {
          title: 'Le Fennec du Désert',
          promptAudio: 'Touche le fennec ! Il a de grandes oreilles, c\'est le petit renard du Sahara !',
          promptText: 'Le fennec est un petit animal d\'Algérie aux grandes oreilles.',
          successAudio: 'Bravo ! Voici un fennec !',
        },
        en: {
          title: 'The Desert Fennec',
          promptAudio: 'Touch the fennec! He has big ears — he is the little desert fox!',
          promptText: 'The fennec is a small Algerian animal with big ears.',
          successAudio: 'Great! That is a fennec!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🦊',
        choices: [
          { id: 'fennec', asset: '🦊', isCorrect: true },
          { id: 'camel',  asset: '🐪', isCorrect: false },
          { id: 'cat',    asset: '🐱', isCorrect: false },
        ],
      },
    },
    {
      id: 'world-match-homes',
      domain: 'animals',
      targetValue: 'habitat',
      stepNumber: 4,
      interactionType: 'connect_dots',
      i18n: {
        ar: {
          title: 'كُلُّ حَيَوَانٍ فِي بَيْتِهِ',
          promptAudio: 'اِرْبِطِ الجَمَلَ بِالصَّحْرَاء، وَالسَّمَكَةَ بِالبَحْر!',
          promptText: 'جمل↔صحراء، طائر↔شجرة، سمكة↔بحر، خروف↔حقل.',
          successAudio: 'عَادَتِ الحَيَوَانَاتُ إِلَى بُيُوتِهَا! بَرَافُو!',
        },
        fr: {
          title: 'Chaque Animal dans sa Maison',
          promptAudio: 'Relie le dromadaire au désert, et le poisson à la mer !',
          promptText: 'Dromadaire↔désert, oiseau↔arbre, poisson↔mer, mouton↔champ.',
          successAudio: 'Tous les animaux sont rentrés ! Bravo !',
        },
        en: {
          title: 'Each Animal at Home',
          promptAudio: 'Match the camel to the desert, and the fish to the sea!',
          promptText: 'Camel↔desert, bird↔tree, fish↔sea, sheep↔field.',
          successAudio: 'All the animals are home! Well done!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🏕️',
        connectPairs: [
          { id: 'camel-desert', leftAsset: '🐪', rightAsset: '🏜️' },
          { id: 'bird-tree',    leftAsset: '🐦', rightAsset: '🌳' },
          { id: 'fish-sea',     leftAsset: '🐟', rightAsset: '🌊' },
          { id: 'sheep-field',  leftAsset: '🐑', rightAsset: '🌾' },
        ],
      },
    },
    {
      id: 'world-morning-routine',
      domain: 'world',
      targetValue: 'tidy',
      stepNumber: 5,
      interactionType: 'sorting',
      i18n: {
        ar: {
          title: 'أُرَتِّبُ غُرْفَتِي',
          promptAudio: 'ضَعِ الصَّابُونَ مَعَ الفُرْشَاة، وَالسَّيَّارَةَ مَعَ الدُّبّ!',
          promptText: 'أدوات النظافة في الحمام، الألعاب في الصندوق.',
          successAudio: 'غُرْفَةٌ مُرَتَّبَة! أَنْتَ بَطَل!',
        },
        fr: {
          title: 'Je Range Ma Chambre',
          promptAudio: 'Mets le savon avec la brosse, et la voiture avec l\'ours !',
          promptText: 'Affaires de toilette au lavabo, jouets dans le coffre.',
          successAudio: 'Chambre rangée ! Tu es un champion !',
        },
        en: {
          title: 'I Tidy My Room',
          promptAudio: 'Put the soap with the brush, and the car with the teddy !',
          promptText: 'Wash things by the sink, toys in the toy box.',
          successAudio: 'A tidy room! You are a champion!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🧸',
        sortBins: [
          { id: 'hygiene', labelAsset: '🪥' },
          { id: 'toys', labelAsset: '🧸' },
        ],
        sortItems: [
          { id: 'soap', asset: '🧼', correctBinId: 'hygiene' },
          { id: 'brush', asset: '🪥', correctBinId: 'hygiene' },
          { id: 'towel', asset: '🧻', correctBinId: 'hygiene' },
          { id: 'car', asset: '🚗', correctBinId: 'toys' },
          { id: 'ball', asset: '⚽', correctBinId: 'toys' },
          { id: 'blocks', asset: '🧱', correctBinId: 'toys' },
        ],
      },
    },
    {
      id: 'world-day-night',
      domain: 'world',
      targetValue: 'day-night',
      stepNumber: 6,
      interactionType: 'sorting',
      i18n: {
        ar: {
          title: 'نَهَارٌ أَمْ لَيْل؟',
          promptAudio: 'ضَعِ النَّظَّارَةَ وَالدِّيكَ مَعَ الشَّمْس، وَالبُومَةَ وَالسَّرِيرَ مَعَ القَمَر!',
          promptText: 'النهار: شمس، ديك، نظارات. الليل: قمر، بومة، سرير.',
          successAudio: 'تَعْرِفُ النَّهَارَ وَاللَّيْل!',
        },
        fr: {
          title: 'Jour ou Nuit ?',
          promptAudio: 'Mets les lunettes et le coq avec le soleil, le hibou et le lit avec la lune !',
          promptText: 'Jour : soleil, coq, lunettes. Nuit : lune, hibou, lit.',
          successAudio: 'Tu connais le jour et la nuit !',
        },
        en: {
          title: 'Day or Night?',
          promptAudio: 'Put the sunglasses and the rooster with the sun, the owl and the bed with the moon!',
          promptText: 'Day: sun, rooster, glasses. Night: moon, owl, bed.',
          successAudio: 'You know day and night!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🌤️',
        sortBins: [
          { id: 'day-bin', labelAsset: '☀️' },
          { id: 'night-bin', labelAsset: '🌙' },
        ],
        sortItems: [
          { id: 'glasses', asset: '🕶️', correctBinId: 'day-bin' },
          { id: 'rooster', asset: '🐓', correctBinId: 'day-bin' },
          { id: 'flower',  asset: '🌻', correctBinId: 'day-bin' },
          { id: 'owl',     asset: '🦉', correctBinId: 'night-bin' },
          { id: 'bed',     asset: '🛏️', correctBinId: 'night-bin' },
          { id: 'stars',   asset: '⭐', correctBinId: 'night-bin' },
        ],
      },
    },
    {
      id: 'world-memory',
      domain: 'world',
      targetValue: 'world-memory',
      stepNumber: 7,
      interactionType: 'memory_cards',
      i18n: {
        ar: {
          title: 'تَذَكَّرْ عَالَمِي',
          promptAudio: 'اِقْلِبِ البِطَاقَاتِ! قُلْ: جَمَل، شَمْس، بَيْت!',
          promptText: 'ثلاث أزواج : جمل، شمس، بيت.',
          successAudio: 'بَرَاوَ! هَذَا عَالَمُكَ!',
        },
        fr: {
          title: 'Mémo de Mon Monde',
          promptAudio: 'Retourne les cartes ! Dis : dromadaire, soleil, maison !',
          promptText: 'Trois paires : dromadaire, soleil, maison.',
          successAudio: 'Bravo ! C\'est ton petit monde !',
        },
        en: {
          title: 'My World Memory',
          promptAudio: 'Flip the cards! Say: camel, sun, house!',
          promptText: 'Three pairs: camel, sun, house.',
          successAudio: 'Bravo! That is your little world!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🧩',
        memoryPairs: [
          { id: 'mem-camel', asset: '🐪' },
          { id: 'mem-sun',   asset: '☀️' },
          { id: 'mem-home',  asset: '🏡' },
        ],
      },
    },
  ],
};
