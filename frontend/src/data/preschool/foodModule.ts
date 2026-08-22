import { PreschoolModule } from './types';

/**
 * "الأَطْعِمَةُ الصَّحِيَّة" — Les Aliments (Éducation Scientifique 0AP).
 * Concrete food first (pomme, carotte, lait) — never "touche le fruit" as an abstract label.
 * Algerian souk path, fruit/veg sort, then where food comes from (cow/hen/bee/wheat).
 */
export const FOOD_MODULE: PreschoolModule = {
  id: 'preschool-food',
  domain: 'world',
  icon: '🍎',
  totalSteps: 7,
  titleI18n: {
    ar: 'الأَطْعِمَةُ الصَّحِيَّة',
    fr: 'Les aliments sains',
    en: 'Healthy food',
  },
  activities: [
    {
      id: 'food-fennec-market',
      domain: 'world',
      targetValue: 'market',
      stepNumber: 1,
      interactionType: 'find_path',
      i18n: {
        ar: {
          title: 'الفَنَكُ فِي السُّوق',
          promptAudio: 'اِسْحَبِ الفَنَكَ: طَمَاطِم، خُبْز، زَيْتُون، عِنَب، ثُمَّ السُّوق!',
          promptText: 'اسحب الفنك على أطعمة السوق حتى يصل إلى الدكان.',
          successAudio: 'وَصَلْنَا! نَأْكُلُ الفَاكِهَةَ وَالخُضَارَ لِنَقْوَى!',
        },
        fr: {
          title: 'Le Fennec au Marché',
          promptAudio: 'Glisse le fennec : tomate, pain, olives, raisin, puis le marché !',
          promptText: 'Aidez l\'enfant à passer les étals jusqu\'au magasin.',
          successAudio: 'On est arrivés ! On mange fruits et légumes pour être forts !',
        },
        en: {
          title: 'The Fennec at the Market',
          promptAudio: 'Drag the fennec: tomato, bread, olives, grapes, then the market!',
          promptText: 'Help the child visit the stalls all the way to the shop.',
          successAudio: 'We made it! We eat fruit and vegetables to grow strong!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🦊',
        pathTheme: 'market',
        pathToken: { startAsset: '🍅', endAsset: '🏪', travelerAsset: '🦊' },
        pathStops: [
          { x: 14, y: 30, asset: '🍅', color: '#fecaca' },
          { x: 40, y: 18, asset: '🥖', color: '#fde68a' },
          { x: 72, y: 28, asset: '🫒', color: '#bbf7d0' },
          { x: 84, y: 62, asset: '🍇', color: '#e9d5ff' },
          { x: 22, y: 78, asset: '🏪', color: '#fed7aa' },
        ],
      },
    },
    {
      id: 'food-fruits-tap',
      domain: 'world',
      targetValue: 'fruits',
      stepNumber: 2,
      interactionType: 'tap_choice',
      i18n: {
        ar: {
          title: 'التُّفَّاحَةُ الحَمْرَاء',
          promptAudio: 'اِلْمَسِ التُّفَّاحَة! التُّفَّاحُ فَاكِهَةٌ حُلْوَة!',
          promptText: 'الفاكهة حلوة : تفاح، برتقال، عنب.',
          successAudio: 'أَحْسَنْت! هَذِهِ تُفَّاحَة!',
        },
        fr: {
          title: 'La Pomme Rouge',
          promptAudio: 'Touche la pomme ! La pomme est un fruit sucré !',
          promptText: 'Les fruits sont sucrés : pomme, orange, raisin.',
          successAudio: 'Bravo ! Voici une pomme !',
        },
        en: {
          title: 'The Red Apple',
          promptAudio: 'Touch the apple! The apple is a sweet fruit!',
          promptText: 'Fruits are sweet: apple, orange, grapes.',
          successAudio: 'Well done! That is an apple!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🍎',
        choices: [
          { id: 'apple',  asset: '🍎', isCorrect: true  },
          { id: 'carrot', asset: '🥕', isCorrect: false },
          { id: 'bread',  asset: '🍞', isCorrect: false },
        ],
      },
    },
    {
      id: 'food-vegetables-tap',
      domain: 'world',
      targetValue: 'vegetables',
      stepNumber: 3,
      interactionType: 'tap_choice',
      i18n: {
        ar: {
          title: 'الجَزَرَةُ البُرْتُقَالِيَّة',
          promptAudio: 'اِلْمَسِ الجَزَرَة! الجَزَرُ خُضَارٌ يُقَوِّي العَيْنَيْن!',
          promptText: 'الخضار : جزر، فلفل، بصل.',
          successAudio: 'مُمْتَاز! هَذِهِ جَزَرَة!',
        },
        fr: {
          title: 'La Carotte Orange',
          promptAudio: 'Touche la carotte ! La carotte est un légume qui aide les yeux !',
          promptText: 'Les légumes : carotte, poivron, oignon.',
          successAudio: 'Super ! Voici une carotte !',
        },
        en: {
          title: 'The Orange Carrot',
          promptAudio: 'Touch the carrot! The carrot is a vegetable that helps our eyes!',
          promptText: 'Vegetables: carrot, pepper, onion.',
          successAudio: 'Excellent! That is a carrot!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🥕',
        choices: [
          { id: 'carrot', asset: '🥕', isCorrect: true  },
          { id: 'banana', asset: '🍌', isCorrect: false },
          { id: 'cake',   asset: '🎂', isCorrect: false },
        ],
      },
    },
    {
      id: 'food-milk-tap',
      domain: 'world',
      targetValue: 'milk',
      stepNumber: 4,
      interactionType: 'tap_choice',
      i18n: {
        ar: {
          title: 'الحَلِيبُ الأَبْيَض',
          promptAudio: 'اِلْمَسِ الحَلِيب! نَشْرَبُ الحَلِيبَ لِنَكْبَرَ أَقْوِيَاء!',
          promptText: 'الحليب والماء أفضل من العصائر السكرية والحلويات.',
          successAudio: 'رَائِع! الحَلِيبُ يُقَوِّي العِظَام!',
        },
        fr: {
          title: 'Le Lait Blanc',
          promptAudio: 'Touche le lait ! On boit du lait pour grandir forts !',
          promptText: 'Le lait et l\'eau valent mieux que les sodas et les bonbons.',
          successAudio: 'Bravo ! Le lait fortifie les os !',
        },
        en: {
          title: 'The White Milk',
          promptAudio: 'Touch the milk! We drink milk to grow strong!',
          promptText: 'Milk and water are better than soda and sweets.',
          successAudio: 'Great! Milk makes bones strong!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🥛',
        choices: [
          { id: 'milk',  asset: '🥛', isCorrect: true  },
          { id: 'soda',  asset: '🥤', isCorrect: false },
          { id: 'candy', asset: '🍬', isCorrect: false },
        ],
      },
    },
    {
      id: 'food-sorting',
      domain: 'world',
      targetValue: 'fruits-vs-veggies',
      stepNumber: 5,
      interactionType: 'sorting',
      i18n: {
        ar: {
          title: 'فَاكِهَةٌ أَمْ خُضَار؟',
          promptAudio: 'ضَعِ التُّفَّاحَ وَالعِنَبَ مَعَ الفَرَاوِلَة، وَالجَزَرَ وَالفُلْفُلَ مَعَ البُرُوكْلِي!',
          promptText: 'ثلاث فواكه / ثلاثة خضار — assez pour un tri sans surcharge.',
          successAudio: 'عَظِيم! أَنْتَ تُمَيِّزُ الفَاكِهَةَ وَالخُضَار!',
        },
        fr: {
          title: 'Fruit ou Légume ?',
          promptAudio: 'Mets la pomme et le raisin avec la fraise, la carotte et le poivron avec le brocoli !',
          promptText: 'Trois fruits / trois légumes — assez pour trier sans surcharge.',
          successAudio: 'Génial ! Tu distingues fruits et légumes !',
        },
        en: {
          title: 'Fruit or Vegetable?',
          promptAudio: 'Put the apple and grapes with the strawberry, the carrot and pepper with the broccoli!',
          promptText: 'Three fruits / three veggies — enough to sort without clutter.',
          successAudio: 'Amazing! You can tell fruits and vegetables apart!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🧺',
        sortBins: [
          { id: 'fruits-bin', labelAsset: '🍓' },
          { id: 'veggies-bin', labelAsset: '🥦' },
        ],
        sortItems: [
          { id: 'sort-apple',  asset: '🍎', correctBinId: 'fruits-bin'  },
          { id: 'sort-grapes', asset: '🍇', correctBinId: 'fruits-bin'  },
          { id: 'sort-orange', asset: '🍊', correctBinId: 'fruits-bin'  },
          { id: 'sort-carrot', asset: '🥕', correctBinId: 'veggies-bin' },
          { id: 'sort-pepper', asset: '🫑', correctBinId: 'veggies-bin' },
          { id: 'sort-onion',  asset: '🧅', correctBinId: 'veggies-bin' },
        ],
      },
    },
    {
      id: 'food-from-connect',
      domain: 'world',
      targetValue: 'food-origin',
      stepNumber: 6,
      interactionType: 'connect_dots',
      i18n: {
        ar: {
          title: 'مِنْ أَيْنَ يَأْتِي الطَّعَام؟',
          promptAudio: 'اِرْبِطِ الحَلِيبَ بِالبَقَرَة، وَالبَيْضَ بِالدَّجَاجَة!',
          promptText: 'الحليب من البقرة، البيض من الدجاجة، العسل من النحلة، الخبز من القمح.',
          successAudio: 'وَاوَ! تَعْرِفُ مِنْ أَيْنَ يَأْتِي الطَّعَام!',
        },
        fr: {
          title: 'D\'où vient la Nourriture ?',
          promptAudio: 'Relie le lait à la vache, et l\'œuf à la poule !',
          promptText: 'Lait = vache, œuf = poule, miel = abeille, pain = blé.',
          successAudio: 'Wow ! Tu sais d\'où vient la nourriture !',
        },
        en: {
          title: 'Where Does Food Come From?',
          promptAudio: 'Match the milk to the cow, and the egg to the hen!',
          promptText: 'Milk = cow, egg = hen, honey = bee, bread = wheat.',
          successAudio: 'Wow! You know where food comes from!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🌾',
        connectPairs: [
          { id: 'milk-cow',   leftAsset: '🥛', rightAsset: '🐄' },
          { id: 'egg-hen',    leftAsset: '🥚', rightAsset: '🐔' },
          { id: 'honey-bee',  leftAsset: '🍯', rightAsset: '🐝' },
          { id: 'bread-wheat', leftAsset: '🥖', rightAsset: '🌾' },
        ],
      },
    },
    {
      id: 'food-memory',
      domain: 'world',
      targetValue: 'food-memory',
      stepNumber: 7,
      interactionType: 'memory_cards',
      i18n: {
        ar: {
          title: 'تَذَكَّرِ الأَطْعِمَة',
          promptAudio: 'اِقْلِبِ البِطَاقَاتِ! قُلْ: تُفَّاحَة، جَزَرَة، حَلِيب!',
          promptText: 'ثلاث أزواج فقط — اللعبة لا تعرض أكثر.',
          successAudio: 'بَرَاوَ! أَنْتَ تَعْرِفُ طَعَامَكَ!',
        },
        fr: {
          title: 'Mémo des Aliments',
          promptAudio: 'Retourne les cartes ! Dis : pomme, carotte, lait !',
          promptText: 'Trois paires seulement — le jeu n\'en affiche pas plus.',
          successAudio: 'Bravo ! Tu connais tes aliments !',
        },
        en: {
          title: 'Food Memory Game',
          promptAudio: 'Flip the cards! Say: apple, carrot, milk!',
          promptText: 'Three pairs only — the game does not show more.',
          successAudio: 'Bravo! You know your foods!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🧩',
        memoryPairs: [
          { id: 'mem-apple',  asset: '🍎' },
          { id: 'mem-carrot', asset: '🥕' },
          { id: 'mem-milk',   asset: '🥛' },
        ],
      },
    },
  ],
};
