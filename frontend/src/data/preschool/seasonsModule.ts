import { PreschoolModule } from './types';

/**
 * "فُصُولُ السَّنَةِ الأَرْبَعَةُ" — Les Saisons (Éducation Scientifique 0AP).
 * Covers: 4 seasons, weather symbols, seasonal clothes, seasonal fruits & activities.
 * Interaction mix: find_path, tap_choice ×4, sorting, connect_dots.
 */
export const SEASONS_MODULE: PreschoolModule = {
  id: 'preschool-seasons',
  domain: 'world',
  icon: '🌸',
  totalSteps: 6,
  titleI18n: {
    ar: 'فُصُولُ السَّنَةِ الأَرْبَعَة',
    fr: 'Les Quatre Saisons',
    en: 'The Four Seasons',
  },
  activities: [
    {
      id: 'seasons-spring',
      domain: 'world',
      targetValue: 'spring',
      stepNumber: 1,
      interactionType: 'tap_choice',
      i18n: {
        ar: {
          title: 'فَصْلُ الرَّبِيع',
          promptAudio: 'اِلْمَسِ الرَّبِيعَ! فَصْلُ الوُرُودِ وَالأَزْهَارِ وَالطَّيُورِ الغَنَّاءَة!',
          promptText: 'تحدث عن الطقس الدافئ وأزهار الربيع.',
          successAudio: 'رَائِعٌ! الرَّبِيعُ فَصْلٌ جَمِيلٌ تَتَفَتَّحُ فِيهِ الأَزْهَار!',
        },
        fr: {
          title: 'Le Printemps',
          promptAudio: 'Touche le printemps ! La saison des fleurs, des roses et des oiseaux chanteurs !',
          promptText: 'Parlez du temps chaud et des fleurs du printemps.',
          successAudio: 'Génial ! Le printemps est une belle saison où les fleurs s\'ouvrent !',
        },
        en: {
          title: 'Spring',
          promptAudio: 'Touch spring! The season of flowers, roses and singing birds!',
          promptText: 'Talk about warm weather and spring flowers.',
          successAudio: 'Wonderful! Spring is a beautiful season when flowers bloom!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🌸',
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
      stepNumber: 2,
      interactionType: 'tap_choice',
      i18n: {
        ar: {
          title: 'فَصْلُ الصَّيْف',
          promptAudio: 'اِلْمَسِ الصَّيْفَ! فَصْلُ الشَّمْسِ الحَارَّةِ وَالبَطِّيخِ وَالسِّبَاحَة!',
          promptText: 'تحدث عن حرارة الصيف والفواكه الصيفية.',
          successAudio: 'أَحْسَنْت! الصَّيْفُ فَصْلٌ حَارٌّ نَأْكُلُ فِيهِ البَطِّيخَ وَالتِّين!',
        },
        fr: {
          title: 'L\'Été',
          promptAudio: 'Touche l\'été ! La saison du soleil chaud, de la pastèque et de la natation !',
          promptText: 'Parlez de la chaleur estivale et des fruits d\'été.',
          successAudio: 'Bravo ! L\'été est une saison chaude où on mange la pastèque et les figues !',
        },
        en: {
          title: 'Summer',
          promptAudio: 'Touch summer! The season of hot sun, watermelon and swimming!',
          promptText: 'Talk about summer heat and summer fruits.',
          successAudio: 'Well done! Summer is a hot season where we eat watermelon and figs!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '☀️',
        choices: [
          { id: 'summer', asset: '☀️', isCorrect: true },
          { id: 'rain',   asset: '🌧️', isCorrect: false },
          { id: 'snow',   asset: '❄️', isCorrect: false },
        ],
      },
    },
    {
      id: 'seasons-autumn',
      domain: 'world',
      targetValue: 'autumn',
      stepNumber: 3,
      interactionType: 'tap_choice',
      i18n: {
        ar: {
          title: 'فَصْلُ الخَرِيف',
          promptAudio: 'اِلْمَسِ الخَرِيفَ! فَصْلُ سُقُوطِ الأَوْرَاقِ الصَّفْرَاءِ وَالحَمْرَاء!',
          promptText: 'تحدث عن تغير لون الأوراق في الخريف.',
          successAudio: 'مُمْتَاز! الخَرِيفُ فَصْلٌ رَائِعٌ تَسْقُطُ فِيهِ الأَوْرَاقُ المُلَوَّنَة!',
        },
        fr: {
          title: 'L\'Automne',
          promptAudio: 'Touche l\'automne ! La saison où les feuilles jaunes et rouges tombent des arbres !',
          promptText: 'Parlez du changement de couleur des feuilles en automne.',
          successAudio: 'Super ! L\'automne est une belle saison avec des feuilles colorées !',
        },
        en: {
          title: 'Autumn',
          promptAudio: 'Touch autumn! The season when yellow and red leaves fall from the trees!',
          promptText: 'Talk about the change of leaf colors in autumn.',
          successAudio: 'Excellent! Autumn is a beautiful season with colorful leaves!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🍂',
        choices: [
          { id: 'autumn', asset: '🍂', isCorrect: true },
          { id: 'flower', asset: '🌸', isCorrect: false },
          { id: 'sun',    asset: '☀️', isCorrect: false },
        ],
      },
    },
    {
      id: 'seasons-winter',
      domain: 'world',
      targetValue: 'winter',
      stepNumber: 4,
      interactionType: 'tap_choice',
      i18n: {
        ar: {
          title: 'فَصْلُ الشِّتَاء',
          promptAudio: 'اِلْمَسِ الشِّتَاءَ! فَصْلُ البَرْدِ وَالمَطَرِ وَالثَّلْجِ فِي الجِبَال!',
          promptText: 'تحدث عن ملابس الشتاء والثلج في الجبال الجزائرية.',
          successAudio: 'بَرَاوَ! الشِّتَاءُ فَصْلٌ بَارِدٌ نَلْبَسُ فِيهِ المَعَاطِفَ الدَّافِئَة!',
        },
        fr: {
          title: 'L\'Hiver',
          promptAudio: 'Touche l\'hiver ! La saison du froid, de la pluie et de la neige dans les montagnes !',
          promptText: 'Parlez des vêtements d\'hiver et de la neige dans les montagnes algériennes.',
          successAudio: 'Bravo ! L\'hiver est une saison froide où on met des manteaux chauds !',
        },
        en: {
          title: 'Winter',
          promptAudio: 'Touch winter! The season of cold, rain and snow in the mountains!',
          promptText: 'Talk about winter clothes and snow in the Algerian mountains.',
          successAudio: 'Bravo! Winter is a cold season where we wear warm coats!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '❄️',
        choices: [
          { id: 'winter', asset: '❄️', isCorrect: true },
          { id: 'leaf',   asset: '🍂', isCorrect: false },
          { id: 'flower', asset: '🌸', isCorrect: false },
        ],
      },
    },
    {
      id: 'seasons-clothes-sorting',
      domain: 'world',
      targetValue: 'seasonal-clothes',
      stepNumber: 5,
      interactionType: 'sorting',
      i18n: {
        ar: {
          title: 'مَلَابِسُ كُلِّ فَصْل',
          promptAudio: 'صَنِّفِ المَلَابِسَ! المَعْطَفُ لِلشِّتَاءِ وَالمَايُوهُ لِلصَّيْفِ وَالسُّتْرَةُ لِلرَّبِيع!',
          promptText: 'ساعد طفلك على تمييز الملابس الشتوية والصيفية.',
          successAudio: 'مُمْتَاز! أَنْتَ تَعْرِفُ مَلَابِسَ كُلِّ فَصْل!',
        },
        fr: {
          title: 'Les Vêtements de Chaque Saison',
          promptAudio: 'Classe les vêtements ! Le manteau pour l\'hiver, le maillot pour l\'été et le pull pour le printemps !',
          promptText: 'Aidez l\'enfant à distinguer les vêtements d\'hiver et d\'été.',
          successAudio: 'Super ! Tu connais les vêtements de chaque saison !',
        },
        en: {
          title: 'Clothes for Each Season',
          promptAudio: 'Sort the clothes! The coat for winter, the swimsuit for summer, the sweater for spring!',
          promptText: 'Help the child distinguish winter and summer clothing.',
          successAudio: 'Excellent! You know the clothes for every season!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '👕',
        sortBins: [
          { id: 'summer-bin', labelAsset: '☀️' },
          { id: 'winter-bin', labelAsset: '❄️' },
        ],
        sortItems: [
          { id: 'cl-hat',     asset: '🧢',  correctBinId: 'summer-bin' },
          { id: 'cl-swim',    asset: '🩱',  correctBinId: 'summer-bin' },
          { id: 'cl-coat',    asset: '🧥',  correctBinId: 'winter-bin' },
          { id: 'cl-scarf',   asset: '🧣',  correctBinId: 'winter-bin' },
          { id: 'cl-gloves',  asset: '🧤',  correctBinId: 'winter-bin' },
          { id: 'cl-glasses', asset: '🕶️', correctBinId: 'summer-bin' },
        ],
      },
    },
    {
      id: 'seasons-connect',
      domain: 'world',
      targetValue: 'season-symbols',
      stepNumber: 6,
      interactionType: 'connect_dots',
      i18n: {
        ar: {
          title: 'اِرْبِطِ الفَصْلَ بِرَمْزِه',
          promptAudio: 'اِرْبِطْ كُلَّ فَصْلٍ بِرَمْزِهِ المُنَاسِب! الرَّبِيعُ مَعَ الوَرْدَةِ وَالشِّتَاءُ مَعَ الثَّلْج!',
          promptText: 'ساعد طفلك على ربط كل فصل برمزه.',
          successAudio: 'وَاوَ! أَنْتَ تَعْرِفُ جَمِيعَ فُصُولِ السَّنَة!',
        },
        fr: {
          title: 'Relie la Saison à son Symbole',
          promptAudio: 'Relie chaque saison à son symbole ! Le printemps avec la fleur et l\'hiver avec la neige !',
          promptText: 'Aidez l\'enfant à associer chaque saison à son symbole.',
          successAudio: 'Wow ! Tu connais toutes les saisons de l\'année !',
        },
        en: {
          title: 'Match Season to Its Symbol',
          promptAudio: 'Match each season to its symbol! Spring with the flower and winter with the snow!',
          promptText: 'Help the child associate each season with its symbol.',
          successAudio: 'Wow! You know all the seasons of the year!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '📅',
        connectPairs: [
          { id: 'spring-flower', leftAsset: '🌸', rightAsset: '🌻' },
          { id: 'summer-sun',    leftAsset: '☀️', rightAsset: '🍉' },
          { id: 'autumn-leaf',   leftAsset: '🍂', rightAsset: '🍎' },
          { id: 'winter-snow',   leftAsset: '❄️', rightAsset: '⛄' },
        ],
      },
    },
  ],
};
