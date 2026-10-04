import { PreschoolModule } from './types';

/**
 * "فُصُولُ السَّنَةِ الأَرْبَعَةُ" — Les Saisons (Éducation Scientifique 0AP).
 * Concrete objects first (fleur, soleil, feuille, flocon) — never "touche le printemps"
 * as an abstract label a 3-5 yo cannot read. Ends with clothes sorting and matching.
 */
export const SEASONS_MODULE: PreschoolModule = {
  id: 'preschool-seasons',
  domain: 'world',
  icon: '🌸',
  totalSteps: 7,
  titleI18n: {
    ar: 'فُصُولُ السَّنَةِ الأَرْبَعَة',
    fr: 'Les Quatre Saisons',
    en: 'The Four Seasons',
  },
  activities: [
    {
      id: 'seasons-year-path',
      domain: 'world',
      targetValue: 'spring',
      stepNumber: 1,
      interactionType: 'find_path',
      i18n: {
        ar: {
          title: 'دَوْرَةُ السَّنَة',
          promptAudio: 'اِسْحَبِ العُصْفُورَ عَبْرَ الفُصُول: زَهْرَة، شَمْس، وَرَقَة، ثَلْج!',
          promptText: 'اسحب العصفور على الفصول الأربعة بالترتيب.',
          successAudio: 'عَامٌ كَامِل! أَحْسَنْت!',
        },
        fr: {
          title: 'Le Tour de l\'Année',
          promptAudio: 'Glisse l\'oiseau à travers les saisons : fleur, soleil, feuille, neige !',
          promptText: 'Aidez l\'enfant à passer les quatre saisons dans l\'ordre.',
          successAudio: 'Une année complète ! Bravo !',
        },
        en: {
          title: 'Around the Year',
          promptAudio: 'Drag the bird through the seasons: flower, sun, leaf, snow!',
          promptText: 'Help the child visit all four seasons in order.',
          successAudio: 'A whole year! Well done!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🐦',
        pathTheme: 'seasons',
        pathToken: { startAsset: '🌸', endAsset: '🌈', travelerAsset: '🐦' },
        pathStops: [
          { x: 14, y: 30, asset: '🌸', color: '#fbcfe8' },
          { x: 42, y: 18, asset: '☀️', color: '#fde68a' },
          { x: 74, y: 32, asset: '🍂', color: '#fed7aa' },
          { x: 82, y: 62, asset: '❄️', color: '#e0f2fe' },
          { x: 48, y: 78, asset: '🌈', color: '#ddd6fe' },
        ],
      },
    },
    {
      id: 'seasons-spring',
      domain: 'world',
      targetValue: 'spring',
      stepNumber: 2,
      interactionType: 'tap_choice',
      i18n: {
        ar: {
          title: 'زَهْرَةُ الرَّبِيع',
          promptAudio: 'الفَرَاشَةُ هُنَا! اِلْمَسِ الزَّهْرَة! هَذَا الرَّبِيع!',
          promptText: 'في الربيع تتفتح الأزهار وتطير الفراشات.',
          successAudio: 'رَائِع! الزَّهْرَةُ لِلرَّبِيع!',
        },
        fr: {
          title: 'La Fleur du Printemps',
          promptAudio: 'Le papillon est là ! Touche la fleur ! C\'est le printemps !',
          promptText: 'Au printemps, les fleurs s\'ouvrent et les papillons volent.',
          successAudio: 'Bravo ! La fleur, c\'est le printemps !',
        },
        en: {
          title: 'The Spring Flower',
          promptAudio: 'The butterfly is here! Touch the flower! That is spring!',
          promptText: 'In spring, flowers open and butterflies fly.',
          successAudio: 'Well done! The flower is for spring!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🦋',
        choices: [
          { id: 'spring', asset: '🌸', isCorrect: true },
          { id: 'winter', asset: '❄️', isCorrect: false },
          { id: 'autumn', asset: '🍂', isCorrect: false },
        ],
      },
    },
    {
      id: 'seasons-summer',
      domain: 'world',
      targetValue: 'summer',
      stepNumber: 3,
      interactionType: 'tap_choice',
      i18n: {
        ar: {
          title: 'شَمْسُ الصَّيْف',
          promptAudio: 'نَأْكُلُ البَطِّيخَ! اِلْمَسِ الشَّمْسَ! هَذَا الصَّيْف!',
          promptText: 'في الصيف الحر والبطيخ والسباحة.',
          successAudio: 'أَحْسَنْت! الشَّمْسُ لِلصَّيْف!',
        },
        fr: {
          title: 'Le Soleil de l\'Été',
          promptAudio: 'On mange la pastèque ! Touche le soleil ! C\'est l\'été !',
          promptText: 'En été : chaleur, pastèque et baignade.',
          successAudio: 'Bravo ! Le soleil, c\'est l\'été !',
        },
        en: {
          title: 'The Summer Sun',
          promptAudio: 'We eat watermelon! Touch the sun! That is summer!',
          promptText: 'In summer: heat, watermelon and swimming.',
          successAudio: 'Well done! The sun is for summer!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🍉',
        choices: [
          { id: 'summer', asset: '☀️', isCorrect: true },
          { id: 'rain', asset: '🌧️', isCorrect: false },
          { id: 'snow', asset: '❄️', isCorrect: false },
        ],
      },
    },
    {
      id: 'seasons-autumn',
      domain: 'world',
      targetValue: 'autumn',
      stepNumber: 4,
      interactionType: 'tap_choice',
      i18n: {
        ar: {
          title: 'أَوْرَاقُ الخَرِيف',
          promptAudio: 'التُّفَّاحُ نَاضِج! اِلْمَسِ الوَرَقَةَ الصَّفْرَاء! هَذَا الخَرِيف!',
          promptText: 'في الخريف تسقط الأوراق ويتغير لونها.',
          successAudio: 'مُمْتَاز! الوَرَقَةُ لِلخَرِيف!',
        },
        fr: {
          title: 'Les Feuilles d\'Automne',
          promptAudio: 'Les pommes sont mûres ! Touche la feuille jaune ! C\'est l\'automne !',
          promptText: 'En automne, les feuilles changent de couleur et tombent.',
          successAudio: 'Super ! La feuille, c\'est l\'automne !',
        },
        en: {
          title: 'Autumn Leaves',
          promptAudio: 'The apples are ripe! Touch the yellow leaf! That is autumn!',
          promptText: 'In autumn, leaves change color and fall.',
          successAudio: 'Excellent! The leaf is for autumn!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🍎',
        choices: [
          { id: 'autumn', asset: '🍂', isCorrect: true },
          { id: 'flower', asset: '🌸', isCorrect: false },
          { id: 'sun', asset: '☀️', isCorrect: false },
        ],
      },
    },
    {
      id: 'seasons-winter',
      domain: 'world',
      targetValue: 'winter',
      stepNumber: 5,
      interactionType: 'tap_choice',
      i18n: {
        ar: {
          title: 'ثَلْجُ الشِّتَاء',
          promptAudio: 'نَلْبَسُ الوِشَاحَ! اِلْمَسِ النُّدْفَة! هَذَا الشِّتَاء!',
          promptText: 'في الشتاء البرد والمطر، والثلج في الجبال الجزائرية.',
          successAudio: 'بَرَاوَ! النُّدْفَةُ لِلشِّتَاء!',
        },
        fr: {
          title: 'Le Flocon d\'Hiver',
          promptAudio: 'On met l\'écharpe ! Touche le flocon ! C\'est l\'hiver !',
          promptText: 'En hiver : froid, pluie, et neige dans les montagnes d\'Algérie.',
          successAudio: 'Bravo ! Le flocon, c\'est l\'hiver !',
        },
        en: {
          title: 'The Winter Snowflake',
          promptAudio: 'We wear a scarf! Touch the snowflake! That is winter!',
          promptText: 'In winter: cold, rain, and snow in the Algerian mountains.',
          successAudio: 'Bravo! The snowflake is for winter!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🧣',
        choices: [
          { id: 'winter', asset: '❄️', isCorrect: true },
          { id: 'leaf', asset: '🍂', isCorrect: false },
          { id: 'flower', asset: '🌸', isCorrect: false },
        ],
      },
    },
    {
      id: 'seasons-clothes-sorting',
      domain: 'world',
      targetValue: 'seasonal-clothes',
      stepNumber: 6,
      interactionType: 'sorting',
      i18n: {
        ar: {
          title: 'مَلَابِسُ كُلِّ فَصْل',
          promptAudio: 'ضَعِ المَايُوهَ وَالقُبَّعَةَ مَعَ الشَّمْس، وَالمِعْطَفَ مَعَ الثَّلْج، وَالمِظَلَّةَ وَقُبَّعَةَ القَشِّ مَعَ الزَّهْرَة!',
          promptText: 'صيف = سباحة وقبعة. شتاء = معطف. ربيع = مظلة وقبعة قش.',
          successAudio: 'مُمْتَاز! تَعْرِفُ مَلَابِسَ كُلِّ فَصْل!',
        },
        fr: {
          title: 'Les Vêtements de Chaque Saison',
          promptAudio: 'Mets le maillot et la casquette avec le soleil, le manteau avec la neige, le parapluie et le chapeau de paille avec la fleur !',
          promptText: 'Été = baignade et casquette. Hiver = manteau. Printemps = parapluie et chapeau de paille.',
          successAudio: 'Super ! Tu connais les vêtements de chaque saison !',
        },
        en: {
          title: 'Clothes for Each Season',
          promptAudio: 'Put the swimsuit and the cap with the sun, the coat with the snow, the umbrella and the straw hat with the flower!',
          promptText: 'Summer = swimming and cap. Winter = coat. Spring = umbrella and straw hat.',
          successAudio: 'Excellent! You know the clothes for every season!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '👕',
        sortBins: [
          { id: 'summer-bin', labelAsset: '☀️' },
          { id: 'winter-bin', labelAsset: '❄️' },
          { id: 'spring-bin', labelAsset: '🌸' },
        ],
        sortItems: [
          { id: 'cl-swim', asset: '🩱', correctBinId: 'summer-bin', label: { ar: 'مَايُوه', fr: 'maillot', en: 'swimsuit' } },
          { id: 'cl-cap', asset: '🧢', correctBinId: 'summer-bin', label: { ar: 'قُبَّعَة', fr: 'casquette', en: 'cap' } },
          { id: 'cl-glasses', asset: '🕶️', correctBinId: 'summer-bin', label: { ar: 'نَظَّارَات', fr: 'lunettes', en: 'sunglasses' } },
          { id: 'cl-coat', asset: '🧥', correctBinId: 'winter-bin', label: { ar: 'مِعْطَف', fr: 'manteau', en: 'coat' } },
          { id: 'cl-scarf', asset: '🧣', correctBinId: 'winter-bin', label: { ar: 'وِشَاح', fr: 'écharpe', en: 'scarf' } },
          { id: 'cl-umbrella', asset: '☔', correctBinId: 'spring-bin', label: { ar: 'مِظَلَّة', fr: 'parapluie', en: 'umbrella' } },
          { id: 'cl-hat', asset: '👒', correctBinId: 'spring-bin', label: { ar: 'قُبَّعَةُ قَشّ', fr: 'chapeau de paille', en: 'straw hat' } },
        ],
      },
    },
    {
      id: 'seasons-connect',
      domain: 'world',
      targetValue: 'season-symbols',
      stepNumber: 7,
      interactionType: 'connect_dots',
      i18n: {
        ar: {
          title: 'اِرْبِطِ الفَصْلَ بِصُورَتِه',
          promptAudio: 'عَلَى اليَسَارِ الفُصُول. عَلَى اليَمِينِ الصُّوَر. اِرْبِطْ كُلَّ فَصْلٍ بِصُورَتِه!',
          promptText: 'اليسار = أسماء الفصول. اليمين = صورة من حياة الطفل (فراشة، بطيخ، تفاح، وشاح).',
          successAudio: 'وَاوَ! تَعْرِفُ كُلَّ فُصُولِ السَّنَة!',
        },
        fr: {
          title: 'Relie la saison à son image',
          promptAudio: 'À gauche les saisons, à droite les images. Relie chaque saison à son image !',
          promptText: 'Gauche = nom de la saison. Droite = une image déjà vue (papillon, pastèque, pomme, écharpe).',
          successAudio: 'Wow ! Tu connais toutes les saisons !',
        },
        en: {
          title: 'Match the season to its picture',
          promptAudio: 'Seasons on the left, pictures on the right. Match each season to its picture!',
          promptText: 'Left = season name. Right = a picture already seen (butterfly, watermelon, apple, scarf).',
          successAudio: 'Wow! You know all the seasons!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '📅',
        connectColumnTitles: {
          left: { ar: 'الفَصْل', fr: 'Saison', en: 'Season' },
          right: { ar: 'الصُّورَة', fr: 'Image', en: 'Picture' },
        },
        connectPairs: [
          {
            id: 'spring-butterfly',
            leftAsset: '🌸',
            rightAsset: '🦋',
            leftLabel: { ar: 'الرَّبِيع', fr: 'Printemps', en: 'Spring' },
            rightLabel: { ar: 'فَرَاشَة', fr: 'Papillon', en: 'Butterfly' },
          },
          {
            id: 'summer-melon',
            leftAsset: '☀️',
            rightAsset: '🍉',
            leftLabel: { ar: 'الصَّيْف', fr: 'Été', en: 'Summer' },
            rightLabel: { ar: 'بَطِّيخ', fr: 'Pastèque', en: 'Watermelon' },
          },
          {
            id: 'autumn-apple',
            leftAsset: '🍂',
            rightAsset: '🍎',
            leftLabel: { ar: 'الخَرِيف', fr: 'Automne', en: 'Autumn' },
            rightLabel: { ar: 'تُفَّاح', fr: 'Pomme', en: 'Apple' },
          },
          {
            id: 'winter-scarf',
            leftAsset: '❄️',
            rightAsset: '🧣',
            leftLabel: { ar: 'الشِّتَاء', fr: 'Hiver', en: 'Winter' },
            rightLabel: { ar: 'وِشَاح', fr: 'Écharpe', en: 'Scarf' },
          },
        ],
      },
    },
  ],
};
