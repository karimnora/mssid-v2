import { PreschoolModule } from './types';

/**
 * "الأَطْعِمَةُ الصَّحِيَّة" — Les Aliments (Éducation Scientifique 0AP).
 * Covers: fruits, vegetables, Algerian traditional foods, nutrition basics.
 * Interaction mix: find_path, tap_choice ×2, sorting, connect_dots, memory_cards.
 */
export const FOOD_MODULE: PreschoolModule = {
  id: 'preschool-food',
  domain: 'world',
  icon: '🍎',
  totalSteps: 6,
  titleI18n: {
    ar: 'الأَطْعِمَةُ الصَّحِيَّة',
    fr: 'Les Aliments Sains',
    en: 'Healthy Foods',
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
          promptAudio: 'اِسْحَبِ الفَنَكَ نَحْوَ السُّوقِ لِيَشْتَرِيَ الفَاكِهَةَ وَالخُضَارَ الطَّازَجَة!',
          promptText: 'اسحب الفنك نحو السوق.',
          successAudio: 'رَائِعٌ! نَأْكُلُ الفَاكِهَةَ وَالخُضَارَ لِنَكُونَ أَصِحَّاءَ وَأَقْوِيَاء!',
        },
        fr: {
          title: 'Le Fennec au Marché',
          promptAudio: 'Fais glisser le fennec vers le marché pour acheter des fruits et légumes frais !',
          promptText: 'Aide l\'enfant à glisser le fennec vers le marché.',
          successAudio: 'Super ! On mange des fruits et légumes pour être en bonne santé et forts !',
        },
        en: {
          title: 'The Fennec at the Market',
          promptAudio: 'Drag the fennec toward the market to buy fresh fruits and vegetables!',
          promptText: 'Help the child drag the fennec to the market.',
          successAudio: 'Great! We eat fruits and vegetables to be healthy and strong!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🦊',
        pathToken: { startAsset: '🦊', endAsset: '🏪', travelerAsset: '🦊' },
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
          title: 'اِلْمَسِ الفَاكِهَة',
          promptAudio: 'اِلْمَسِ الفَاكِهَةَ! التُّفَّاحُ وَالبُرْتُقَالُ وَالبَطِّيخُ كُلُّهَا فَوَاكِهُ لَذِيذَة!',
          promptText: 'تحدث عن أنواع الفاكهة الجزائرية.',
          successAudio: 'أَحْسَنْت! الفَاكِهَةُ حُلْوَةٌ وَمُفِيدَةٌ لِصِحَّتِنَا!',
        },
        fr: {
          title: 'Touche le Fruit',
          promptAudio: 'Touche le fruit ! La pomme, l\'orange et la pastèque sont tous de délicieux fruits !',
          promptText: 'Parlez des variétés de fruits algériens.',
          successAudio: 'Super ! Les fruits sont sucrés et bons pour notre santé !',
        },
        en: {
          title: 'Touch the Fruit',
          promptAudio: 'Touch the fruit! Apple, orange and watermelon are all delicious fruits!',
          promptText: 'Talk about varieties of Algerian fruits.',
          successAudio: 'Well done! Fruits are sweet and good for our health!',
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
          title: 'اِلْمَسِ الخُضَار',
          promptAudio: 'اِلْمَسِ الخُضَارَ! الجَزَرُ وَالبَصَلُ وَالفَلْفَلُ كُلُّهَا خُضَارٌ مُفِيدَة!',
          promptText: 'تحدث عن أنواع الخضروات.',
          successAudio: 'مُمْتَاز! الخُضَارُ مُفِيدٌ جِدَّاً وَيُقَوِّي جِسْمَنَا!',
        },
        fr: {
          title: 'Touche le Légume',
          promptAudio: 'Touche le légume ! La carotte, l\'oignon et le poivron sont tous des légumes utiles !',
          promptText: 'Parlez des différentes variétés de légumes.',
          successAudio: 'Excellent ! Les légumes sont très utiles et renforcent notre corps !',
        },
        en: {
          title: 'Touch the Vegetable',
          promptAudio: 'Touch the vegetable! Carrot, onion and pepper are all useful vegetables!',
          promptText: 'Talk about different types of vegetables.',
          successAudio: 'Excellent! Vegetables are very beneficial and strengthen our body!',
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
      id: 'food-sorting',
      domain: 'world',
      targetValue: 'fruits-vs-veggies',
      stepNumber: 4,
      interactionType: 'sorting',
      i18n: {
        ar: {
          title: 'فَاكِهَةٌ أَمْ خُضَار؟',
          promptAudio: 'صَنِّفِ الأَطْعِمَةَ! اِضَعِ الفَاكِهَةَ فِي سَلَّتِهَا وَالخُضَارَ فِي سَلَّتِهِ!',
          promptText: 'ساعد طفلك على التمييز بين الفاكهة والخضار.',
          successAudio: 'عَظِيمٌ! أَنْتَ تُمَيِّزُ بَيْنَ الفَاكِهَةِ وَالخُضَار!',
        },
        fr: {
          title: 'Fruit ou Légume ?',
          promptAudio: 'Classe les aliments ! Mets les fruits dans leur panier et les légumes dans le leur !',
          promptText: 'Aidez l\'enfant à distinguer les fruits des légumes.',
          successAudio: 'Génial ! Tu sais distinguer les fruits des légumes !',
        },
        en: {
          title: 'Fruit or Vegetable?',
          promptAudio: 'Sort the foods! Put the fruits in their basket and the vegetables in theirs!',
          promptText: 'Help the child distinguish fruits from vegetables.',
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
          { id: 'sort-apple',   asset: '🍎', correctBinId: 'fruits-bin'  },
          { id: 'sort-banana',  asset: '🍌', correctBinId: 'fruits-bin'  },
          { id: 'sort-orange',  asset: '🍊', correctBinId: 'fruits-bin'  },
          { id: 'sort-grapes',  asset: '🍇', correctBinId: 'fruits-bin'  },
          { id: 'sort-carrot',  asset: '🥕', correctBinId: 'veggies-bin' },
          { id: 'sort-corn',    asset: '🌽', correctBinId: 'veggies-bin' },
          { id: 'sort-pepper',  asset: '🫑', correctBinId: 'veggies-bin' },
        ],
      },
    },
    {
      id: 'food-colors-connect',
      domain: 'world',
      targetValue: 'food-colors',
      stepNumber: 5,
      interactionType: 'connect_dots',
      i18n: {
        ar: {
          title: 'اِرْبِطِ الأَكْلَةَ بِلَوْنِهَا',
          promptAudio: 'اِرْبِطْ كُلَّ طَعَامٍ بِلَوْنِهِ! التُّفَّاحُ أَحْمَرُ وَالمَوْزُ أَصْفَرُ وَالعِنَبُ بَنَفْسَجِيّ!',
          promptText: 'ساعد طفلك على ربط كل طعام بلونه.',
          successAudio: 'وَاوَ! أَنْتَ تَعْرِفُ أَلْوَانَ الفَوَاكِهِ وَالخُضَار!',
        },
        fr: {
          title: 'Relie l\'Aliment à sa Couleur',
          promptAudio: 'Relie chaque aliment à sa couleur ! La pomme est rouge, la banane est jaune, le raisin est violet !',
          promptText: 'Aidez l\'enfant à associer chaque aliment à sa couleur.',
          successAudio: 'Wow ! Tu connais les couleurs des fruits et légumes !',
        },
        en: {
          title: 'Match Food to Its Color',
          promptAudio: 'Match each food to its color! Apple is red, banana is yellow, grapes are purple!',
          promptText: 'Help the child associate each food with its color.',
          successAudio: 'Wow! You know the colors of fruits and vegetables!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🌈',
        connectPairs: [
          { id: 'apple-red',    leftAsset: '🍎', rightAsset: '🔴' },
          { id: 'banana-yellow',leftAsset: '🍌', rightAsset: '🟡' },
          { id: 'grapes-purple',leftAsset: '🍇', rightAsset: '🟣' },
          { id: 'orange-orange',leftAsset: '🍊', rightAsset: '🟠' },
        ],
      },
    },
    {
      id: 'food-memory',
      domain: 'world',
      targetValue: 'food-memory',
      stepNumber: 6,
      interactionType: 'memory_cards',
      i18n: {
        ar: {
          title: 'تَذَكَّرِ الأَطْعِمَة',
          promptAudio: 'اِقْلِبِ البِطَاقَاتِ وَاجِدِ الأَزْوَاجَ! قُلِ اسْمَ كُلِّ طَعَامٍ وَلَوْنَهُ!',
          promptText: 'شجّع طفلك على تسمية كل طعام يكتشفه.',
          successAudio: 'بَرَاوَ بَطَل! أَنْتَ تَعْرِفُ كَثِيراً مِنَ الأَطْعِمَة!',
        },
        fr: {
          title: 'Mémo des Aliments',
          promptAudio: 'Retourne les cartes et trouve les paires ! Dis le nom et la couleur de chaque aliment !',
          promptText: 'Encouragez l\'enfant à nommer chaque aliment qu\'il découvre.',
          successAudio: 'Bravo champion ! Tu connais plein d\'aliments !',
        },
        en: {
          title: 'Food Memory Game',
          promptAudio: 'Flip the cards and find the pairs! Say the name and color of each food!',
          promptText: 'Encourage the child to name each food they discover.',
          successAudio: 'Bravo champion! You know so many foods!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🧩',
        memoryPairs: [
          { id: 'mem-apple',  asset: '🍎' },
          { id: 'mem-banana', asset: '🍌' },
          { id: 'mem-carrot', asset: '🥕' },
          { id: 'mem-grapes', asset: '🍇' },
          { id: 'mem-orange', asset: '🍊' },
        ],
      },
    },
  ],
};
