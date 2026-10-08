import { PreschoolModule } from './types';

/**
 * "عَقْلِي الصَّغِيرُ يُفَكِّرُ" — Logique & espace (3-5 ans).
 * Compare objects that LOOK different (train vs car), never snake vs worm
 * (same emoji size). Patterns use the real `sequence` widget, not a tap
 * on a blob of "🔴🔵🔴🔵❓".
 */
export const LOGIC_SPATIAL_MODULE: PreschoolModule = {
  id: 'preschool-logic-spatial',
  domain: 'shapes',
  icon: '🧠',
  totalSteps: 10,
  titleI18n: {
    ar: 'أُفَكِّرُ وَأُرَتِّبُ',
    fr: 'Logique et espace',
    en: 'Logic and space',
  },
  activities: [
    {
      id: 'logic-think-path',
      domain: 'shapes',
      targetValue: 'think-path',
      stepNumber: 1,
      interactionType: 'find_path',
      i18n: {
        ar: {
          title: 'عَقْلِي يَتَمَشَّى',
          promptAudio: 'اِسْحَبْ: قِطَار طَوِيل، حَجَر ثَقِيل، عُصْفُور فَوْق، بَيْت، بَالُون خَفِيف، ثُمَّ الدِّمَاغ!',
          promptText: 'كل محطة فكرة سنلعبها بعد قليل: طويل، ثقيل، فوق، داخل، خفيف.',
          successAudio: 'عَقْلُكَ الصَّغِيرُ يُفَكِّر! بَرَاوَ!',
        },
        fr: {
          title: 'Mon Esprit se Promène',
          promptAudio: 'Glisse : train long, pierre lourde, oiseau en haut, maison, ballon léger, puis le cerveau !',
          promptText: 'Chaque station est une idée : long, lourd, haut, dedans, léger.',
          successAudio: 'Ton petit esprit réfléchit ! Bravo !',
        },
        en: {
          title: 'My Mind Takes a Walk',
          promptAudio: 'Drag: long train, heavy stone, bird up high, house, light balloon, then the brain!',
          promptText: 'Each stop is an idea: long, heavy, up, inside, light.',
          successAudio: 'Your little mind is thinking! Bravo!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🧠',
        pathTheme: 'logic',
        pathToken: { startAsset: '🚂', endAsset: '🧠', travelerAsset: '🦊' },
        pathStops: [
          { x: 14, y: 30, asset: '🚂', color: '#fecaca' },
          { x: 40, y: 16, asset: '🪨', color: '#e2e8f0' },
          { x: 72, y: 26, asset: '🐦', color: '#bae6fd' },
          { x: 84, y: 56, asset: '🏠', color: '#fed7aa' },
          { x: 56, y: 76, asset: '🎈', color: '#fecaca' },
          { x: 22, y: 78, asset: '🧠', color: '#ddd6fe' },
        ],
      },
    },
    {
      id: 'logic-long-short',
      domain: 'shapes',
      targetValue: 'long',
      stepNumber: 2,
      interactionType: 'tap_choice',
      i18n: {
        ar: {
          title: 'القِطَارُ الطَّوِيل',
          promptAudio: 'اِلْمَسِ القِطَار! القِطَارُ طَوِيل، السَّيَّارَةُ قَصِيرَة!',
          promptText: 'القطار أطول من السيارة — الفرق مرئي، بخلاف ثعبان/دودة بنفس حجم الإيموجي.',
          successAudio: 'أَحْسَنْت! هَذَا قِطَارٌ طَوِيل!',
        },
        fr: {
          title: 'Le Long Train',
          promptAudio: 'Touche le train ! Le train est long, la voiture est courte !',
          promptText: 'Le train est visiblement plus long que la voiture.',
          successAudio: 'Bravo ! Voici un long train !',
        },
        en: {
          title: 'The Long Train',
          promptAudio: 'Touch the train! The train is long, the car is short!',
          promptText: 'The train is visibly longer than the car.',
          successAudio: 'Well done! That is a long train!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🚂',
        choices: [
          { id: 'train', asset: '🚂', isCorrect: true },
          { id: 'car',   asset: '🚗', isCorrect: false },
          { id: 'ball',  asset: '⚽', isCorrect: false },
        ],
      },
    },
    {
      id: 'logic-heavy-tap',
      domain: 'shapes',
      targetValue: 'weight',
      stepNumber: 3,
      interactionType: 'tap_choice',
      i18n: {
        ar: {
          title: 'الحَجَرُ الثَّقِيل',
          promptAudio: 'اِلْمَسِ الحَجَر! الحَجَرُ ثَقِيل، البَالُونُ خَفِيف!',
          promptText: 'حجر ثقيل / بالون خفيف — مفهوم ملموس قبل الفرز.',
          successAudio: 'نَعَم! الحَجَرُ ثَقِيل!',
        },
        fr: {
          title: 'La Pierre Lourde',
          promptAudio: 'Touche la pierre ! La pierre est lourde, le ballon est léger !',
          promptText: 'Pierre lourde / ballon léger — avant le tri.',
          successAudio: 'Oui ! La pierre est lourde !',
        },
        en: {
          title: 'The Heavy Stone',
          promptAudio: 'Touch the stone! The stone is heavy, the balloon is light!',
          promptText: 'Heavy stone / light balloon — before sorting.',
          successAudio: 'Yes! The stone is heavy!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🪨',
        choices: [
          { id: 'rock',    asset: '🪨', isCorrect: true },
          { id: 'balloon', asset: '🎈', isCorrect: false },
          { id: 'feather', asset: '🪶', isCorrect: false },
        ],
      },
    },
    {
      id: 'logic-above-below',
      domain: 'shapes',
      targetValue: 'above',
      stepNumber: 4,
      interactionType: 'tap_choice',
      i18n: {
        ar: {
          title: 'العُصْفُورُ فَوْق',
          promptAudio: 'اِلْمَسِ العُصْفُور! العُصْفُورُ يَطِيرُ فَوْقَ، الدُّودَةُ تَحْتَ فِي التُّرَاب!',
          promptText: 'فوق = طائر في السماء. تحت = دودة في الأرض.',
          successAudio: 'العُصْفُورُ فَوْق! أَحْسَنْت!',
        },
        fr: {
          title: 'L\'Oiseau en Haut',
          promptAudio: 'Touche l\'oiseau ! L\'oiseau vole en haut, le ver est en bas dans la terre !',
          promptText: 'Haut = oiseau dans le ciel. Bas = ver dans la terre.',
          successAudio: 'L\'oiseau est en haut ! Bravo !',
        },
        en: {
          title: 'The Bird Up High',
          promptAudio: 'Touch the bird! The bird flies up high, the worm is down in the dirt!',
          promptText: 'Up = bird in the sky. Down = worm in the ground.',
          successAudio: 'The bird is up high! Well done!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '☁️',
        choices: [
          { id: 'bird', asset: '🐦', isCorrect: true },
          { id: 'worm', asset: '🐛', isCorrect: false },
          { id: 'fish', asset: '🐟', isCorrect: false },
        ],
      },
    },
    {
      id: 'logic-heavy-light',
      domain: 'shapes',
      targetValue: 'heavy-light',
      stepNumber: 5,
      interactionType: 'sorting',
      i18n: {
        ar: {
          title: 'ثَقِيلٌ أَمْ خَفِيف؟',
          promptAudio: 'ضَعِ الحَجَرَ وَالسَّيَّارَةَ مَعَ الفِيل، وَالبَالُونَ وَالوَرَقَةَ مَعَ الرِّيشَة!',
          promptText: 'ثقيل: حجر، سيارة، حقيبة. خفيف: بالون، فراشة، ورقة. بدون مرساة بحرية.',
          successAudio: 'مَيَّزْتَ الثَّقِيلَ وَالخَفِيف!',
        },
        fr: {
          title: 'Lourd ou Léger ?',
          promptAudio: 'Mets la pierre et la voiture avec l\'éléphant, le ballon et la feuille avec la plume !',
          promptText: 'Lourd : pierre, voiture, sac. Léger : ballon, papillon, feuille. Pas d\'ancre.',
          successAudio: 'Tu connais le lourd et le léger !',
        },
        en: {
          title: 'Heavy or Light?',
          promptAudio: 'Put the stone and the car with the elephant, the balloon and the leaf with the feather!',
          promptText: 'Heavy: stone, car, bag. Light: balloon, butterfly, leaf. No ship anchor.',
          successAudio: 'You know heavy and light!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '⚖️',
        sortBins: [
          { id: 'heavy', labelAsset: '🐘' },
          { id: 'light', labelAsset: '🪶' },
        ],
        sortItems: [
          { id: 'rock',      asset: '🪨', correctBinId: 'heavy' },
          { id: 'car',       asset: '🚗', correctBinId: 'heavy' },
          { id: 'bag',       asset: '🎒', correctBinId: 'heavy' },
          { id: 'balloon',   asset: '🎈', correctBinId: 'light' },
          { id: 'butterfly', asset: '🦋', correctBinId: 'light' },
          { id: 'leaf',      asset: '🍃', correctBinId: 'light' },
        ],
      },
    },
    {
      id: 'logic-inside-outside',
      domain: 'shapes',
      targetValue: 'inside',
      stepNumber: 6,
      interactionType: 'tap_choice',
      i18n: {
        ar: {
          title: 'الكُرَةُ دَاخِلَ الصُّنْدُوق',
          promptAudio: 'اِلْمَسِ الكُرَةَ الَّتِي دَاخِلَ الصُّنْدُوق! نَفْسُ الكُرَة، مَكَانَانِ مُخْتَلِفَان!',
          promptText: 'نفس الكرة. داخل الصندوق مقابل بجانب الصندوق.',
          successAudio: 'نَعَم! الكُرَةُ دَاخِلَ الصُّنْدُوق!',
          image: '📦',
        },
        fr: {
          title: 'Le ballon dans la boîte',
          promptAudio: 'Touche le ballon qui est DANS la boîte ! C’est le même ballon, deux places !',
          promptText: 'Même ballon. Dans la boîte, ou à côté de la boîte.',
          successAudio: 'Oui ! Le ballon est dans la boîte !',
          image: '📦',
        },
        en: {
          title: 'The ball inside the box',
          promptAudio: 'Touch the ball that is INSIDE the box! Same ball, two places!',
          promptText: 'Same ball. Inside the box, or next to the box.',
          successAudio: 'Yes! The ball is inside the box!',
          image: '📦',
        },
      },
      visualAssets: {
        mainSvgOrImage: '📦',
        choices: [
          {
            id: 'inside',
            asset: '⚽',
            scene: { kind: 'inside', object: '⚽', landmark: '📦' },
            isCorrect: true,
            label: { ar: 'دَاخِل', fr: 'Dedans', en: 'Inside' },
          },
          {
            id: 'outside',
            asset: '⚽',
            scene: { kind: 'outside', object: '⚽', landmark: '📦' },
            isCorrect: false,
            label: { ar: 'خَارِج', fr: 'Dehors', en: 'Outside' },
          },
        ],
      },
    },
    {
      id: 'logic-front-behind',
      domain: 'shapes',
      targetValue: 'front',
      stepNumber: 7,
      interactionType: 'tap_choice',
      i18n: {
        ar: {
          title: 'الدُّبُّ أَمَامَ الصُّنْدُوق',
          promptAudio: 'اِلْمَسِ الدُّبَّ الَّذِي أَمَامَ الصُّنْدُوق! نَفْسُ الدُّبّ، مَكَانَانِ مُخْتَلِفَان!',
          promptText: 'نفس الدب. أمام الصندوق (أقرب إلينا) مقابل وراء الصندوق (يختفي جزء منه).',
          successAudio: 'نَعَم! الدُّبُّ أَمَامَ الصُّنْدُوق!',
          image: '📦',
        },
        fr: {
          title: 'L’ours devant la boîte',
          promptAudio: 'Touche l’ours qui est DEVANT la boîte ! C’est le même ours, deux places différentes !',
          promptText: 'Même ours. Devant la boîte (plus près de nous) ou derrière (en partie caché).',
          successAudio: 'Oui ! L’ours est devant la boîte !',
          image: '📦',
        },
        en: {
          title: 'The bear in front of the box',
          promptAudio: 'Touch the bear that is IN FRONT of the box! Same bear, two different places!',
          promptText: 'Same bear. In front of the box (closer to us) or behind (partly hidden).',
          successAudio: 'Yes! The bear is in front of the box!',
          image: '📦',
        },
      },
      visualAssets: {
        mainSvgOrImage: '📦',
        choices: [
          {
            id: 'front',
            asset: '🧸',
            scene: { kind: 'front', object: '🧸', landmark: '📦' },
            isCorrect: true,
            label: { ar: 'أَمَام', fr: 'Devant', en: 'In front' },
          },
          {
            id: 'behind',
            asset: '🧸',
            scene: { kind: 'behind', object: '🧸', landmark: '📦' },
            isCorrect: false,
            label: { ar: 'وَرَاء', fr: 'Derrière', en: 'Behind' },
          },
        ],
      },
    },
    {
      id: 'logic-right-left',
      domain: 'shapes',
      targetValue: 'right',
      stepNumber: 8,
      interactionType: 'tap_choice',
      i18n: {
        ar: {
          title: 'اليَدُ اليُمْنَى',
          promptAudio: 'اِلْمَسِ اليَدَ اليُمْنَى! بِهَا نَأْكُلُ وَنُصَافِح!',
          promptText: 'اليمنى تشير لليمين 🫱. اليسرى تشير لليسار 🫲.',
          successAudio: 'هَذِهِ اليَدُ اليُمْنَى! أَحْسَنْت!',
        },
        fr: {
          title: 'La Main Droite',
          promptAudio: 'Touche la main droite ! Avec elle on mange et on salue !',
          promptText: 'La main droite pointe à droite 🫱. La main gauche pointe à gauche 🫲.',
          successAudio: 'Voici la main droite ! Bravo !',
        },
        en: {
          title: 'The Right Hand',
          promptAudio: 'Touch the right hand! We eat and shake hands with it!',
          promptText: 'The right hand points right 🫱. The left hand points left 🫲.',
          successAudio: 'That is the right hand! Well done!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '👋',
        choices: [
          { id: 'right', asset: '🫱', isCorrect: true },
          { id: 'left',  asset: '🫲', isCorrect: false },
          { id: 'fist',  asset: '✊', isCorrect: false },
        ],
      },
    },
    {
      id: 'logic-pattern-colors',
      domain: 'shapes',
      targetValue: 'pattern',
      stepNumber: 9,
      interactionType: 'sequence',
      i18n: {
        ar: {
          title: 'مَاذَا يَأْتِي بَعْد؟',
          promptAudio: 'قِطَار، سَيَّارَة، قِطَار، سَيَّارَة، قِطَار... مَاذَا بَعْد؟',
          promptText: 'نمط AB. ينتهي بالقطار → الجواب السيارة.',
          successAudio: 'السَّيَّارَةُ بَعْدَ القِطَار! أَحْسَنْت!',
        },
        fr: {
          title: 'Qu\'est-ce qui Vient Ensuite ?',
          promptAudio: 'Train, voiture, train, voiture, train... ensuite ?',
          promptText: 'Motif AB. La rangée finit sur le train → réponse voiture.',
          successAudio: 'La voiture vient après le train ! Bravo !',
        },
        en: {
          title: 'What Comes Next?',
          promptAudio: 'Train, car, train, car, train... what is next?',
          promptText: 'AB pattern. The row ends on the train → answer is car.',
          successAudio: 'The car comes after the train! Well done!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🔁',
        sequencePattern: ['🚂', '🚗', '🚂', '🚗', '🚂'],
        choices: [
          { id: 'car',   asset: '🚗', isCorrect: true },
          { id: 'train', asset: '🚂', isCorrect: false },
          { id: 'ball',  asset: '⚽', isCorrect: false },
        ],
      },
    },
    {
      id: 'logic-memory',
      domain: 'shapes',
      targetValue: 'logic-memory',
      stepNumber: 10,
      interactionType: 'memory_cards',
      i18n: {
        ar: {
          title: 'تَذَكَّرْ وَفَكِّر',
          promptAudio: 'اِقْلِبِ البِطَاقَاتِ! قُلْ: قِطَار، فِيل، عُصْفُور!',
          promptText: 'ثلاث أزواج فقط — اللعبة لا تعرض أكثر.',
          successAudio: 'عَقْلُكَ قَوِيّ!',
        },
        fr: {
          title: 'Mémo de Mon Esprit',
          promptAudio: 'Retourne les cartes ! Dis : train, éléphant, oiseau !',
          promptText: 'Trois paires seulement — le jeu n\'en affiche pas plus.',
          successAudio: 'Ton esprit est fort !',
        },
        en: {
          title: 'Thinking Memory',
          promptAudio: 'Flip the cards! Say: train, elephant, bird!',
          promptText: 'Three pairs only — the game does not show more.',
          successAudio: 'Your mind is strong!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🧩',
        memoryPairs: [
          { id: 'mem-train', asset: '🚂' },
          { id: 'mem-elephant', asset: '🐘' },
          { id: 'mem-bird', asset: '🐦' },
        ],
      },
    },
  ],
};
