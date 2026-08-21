import { PreschoolModule } from './types';

/**
 * "وَطَنِي الجَزَائِر" — Mon Algérie (Éducation Civique 0AP).
 * Concrete places and objects (flag, mosque, couscous, fennec) — never "touch the symbol".
 * No comparative religion (no cross vs crescent). One memory of 3 pairs only.
 */
export const ALGERIA_MODULE: PreschoolModule = {
  id: 'preschool-algeria',
  domain: 'values',
  icon: '🇩🇿',
  totalSteps: 8,
  titleI18n: {
    ar: 'وَطَنِي الجَزَائِر',
    fr: 'Mon Algérie',
    en: 'My Algeria',
  },
  activities: [
    {
      id: 'algeria-fennec-flag',
      domain: 'values',
      targetValue: 'flag',
      stepNumber: 1,
      interactionType: 'find_path',
      i18n: {
        ar: {
          title: 'رِحْلَةٌ عَبْرَ الجَزَائِر',
          promptAudio: 'اِسْحَبِ الفَنَكَ: صَحْرَاء، نَخْلَة، جَبَل، بَحْر، ثُمَّ العَلَم!',
          promptText: 'من الصحراء إلى البحر حتى العلم الجزائري.',
          successAudio: 'عَاشَتِ الجَزَائِر! بِلَادُنَا جَمِيلَة!',
        },
        fr: {
          title: 'Un Voyage en Algérie',
          promptAudio: 'Glisse le fennec : désert, palmeraie, montagne, mer, puis le drapeau !',
          promptText: 'Du Sahara à la mer, jusqu\'au drapeau algérien.',
          successAudio: 'Vive l\'Algérie ! Notre pays est beau !',
        },
        en: {
          title: 'A Trip Across Algeria',
          promptAudio: 'Drag the fennec: desert, palm, mountain, sea, then the flag!',
          promptText: 'From the Sahara to the sea, all the way to the Algerian flag.',
          successAudio: 'Long live Algeria! Our country is beautiful!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🦊',
        pathTheme: 'algeria',
        pathToken: { startAsset: '🏜️', endAsset: '🇩🇿', travelerAsset: '🦊' },
        pathStops: [
          { x: 14, y: 32, asset: '🏜️', color: '#fde68a' },
          { x: 40, y: 16, asset: '🐪', color: '#fed7aa' },
          { x: 72, y: 26, asset: '🌴', color: '#bbf7d0' },
          { x: 84, y: 56, asset: '⛰️', color: '#e2e8f0' },
          { x: 56, y: 76, asset: '🌊', color: '#bae6fd' },
          { x: 22, y: 78, asset: '🇩🇿', color: '#86efac' },
        ],
      },
    },
    {
      id: 'algeria-flag-color',
      domain: 'values',
      targetValue: 'flag-colors',
      stepNumber: 2,
      interactionType: 'tap_choice',
      i18n: {
        ar: {
          title: 'عَلَمُ الجَزَائِر',
          promptAudio: 'اِلْمَسِ عَلَمَ الجَزَائِر! أَخْضَرُ وَأَبْيَضُ وَهِلَال!',
          promptText: 'الأخضر والأبيض والهلال والنجمة.',
          successAudio: 'أَحْسَنْت! هَذَا عَلَمُنَا!',
        },
        fr: {
          title: 'Le Drapeau Algérien',
          promptAudio: 'Touche le drapeau de l\'Algérie ! Vert, blanc et croissant !',
          promptText: 'Vert, blanc, croissant et étoile.',
          successAudio: 'Bravo ! Voici notre drapeau !',
        },
        en: {
          title: 'The Algerian Flag',
          promptAudio: 'Touch the flag of Algeria! Green, white and a crescent!',
          promptText: 'Green, white, crescent and star.',
          successAudio: 'Well done! That is our flag!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🇩🇿',
        choices: [
          { id: 'dz-flag', asset: '🇩🇿', isCorrect: true },
          { id: 'jp-flag', asset: '🇯🇵', isCorrect: false },
          { id: 'br-flag', asset: '🇧🇷', isCorrect: false },
        ],
      },
    },
    {
      id: 'algeria-mosque',
      domain: 'values',
      targetValue: 'algeria-mosque',
      stepNumber: 3,
      interactionType: 'tap_choice',
      i18n: {
        ar: {
          title: 'المَسْجِد',
          promptAudio: 'اِلْمَسِ المَسْجِد! المَسْجِدُ جَمِيلٌ فِي بِلَادِنَا!',
          promptText: 'المسجد مكان معروف في المدن والقرى الجزائرية.',
          successAudio: 'رَائِع! هَذَا مَسْجِد!',
        },
        fr: {
          title: 'La Mosquée',
          promptAudio: 'Touche la mosquée ! La mosquée est belle dans notre pays !',
          promptText: 'La mosquée est un bâtiment familier des villes et villages d\'Algérie.',
          successAudio: 'Bravo ! Voici une mosquée !',
        },
        en: {
          title: 'The Mosque',
          promptAudio: 'Touch the mosque! The mosque is beautiful in our country!',
          promptText: 'The mosque is a familiar building in Algerian towns and villages.',
          successAudio: 'Great! That is a mosque!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🕌',
        choices: [
          { id: 'mosque', asset: '🕌', isCorrect: true },
          { id: 'house',  asset: '🏠', isCorrect: false },
          { id: 'school', asset: '🏫', isCorrect: false },
        ],
      },
    },
    {
      id: 'algeria-couscous',
      domain: 'values',
      targetValue: 'couscous',
      stepNumber: 4,
      interactionType: 'tap_choice',
      i18n: {
        ar: {
          title: 'الكُسْكُس',
          promptAudio: 'اِلْمَسِ الكُسْكُس! نَأْكُلُ الكُسْكُسَ فِي الجَزَائِر!',
          promptText: 'الكسكس طبق الجمعة والعائلة في الجزائر.',
          successAudio: 'شَهِيّ! هَذَا كُسْكُس!',
        },
        fr: {
          title: 'Le Couscous',
          promptAudio: 'Touche le couscous ! On mange le couscous en Algérie !',
          promptText: 'Le couscous est le plat du vendredi et de la famille.',
          successAudio: 'Miam ! Voici le couscous !',
        },
        en: {
          title: 'Couscous',
          promptAudio: 'Touch the couscous! We eat couscous in Algeria!',
          promptText: 'Couscous is a Friday and family dish in Algeria.',
          successAudio: 'Yum! That is couscous!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🍲',
        choices: [
          { id: 'couscous', asset: '🍲', isCorrect: true },
          { id: 'pizza',    asset: '🍕', isCorrect: false },
          { id: 'icecream', asset: '🍦', isCorrect: false },
        ],
      },
    },
    {
      id: 'algeria-fennec-tap',
      domain: 'values',
      targetValue: 'fennec',
      stepNumber: 5,
      interactionType: 'tap_choice',
      i18n: {
        ar: {
          title: 'فَنَكُ الجَزَائِر',
          promptAudio: 'اِلْمَسِ الفَنَكَ! الفَنَكُ ثَعْلَبُ صَحْرَائِنَا!',
          promptText: 'الفنك حيوان صحراوي معروف في الجزائر.',
          successAudio: 'أَحْسَنْت! هَذَا فَنَكُنَا!',
        },
        fr: {
          title: 'Le Fennec d\'Algérie',
          promptAudio: 'Touche le fennec ! Le fennec est le petit renard de notre Sahara !',
          promptText: 'Le fennec est un animal du désert algérien.',
          successAudio: 'Bravo ! Voici notre fennec !',
        },
        en: {
          title: 'The Algerian Fennec',
          promptAudio: 'Touch the fennec! The fennec is the little fox of our Sahara!',
          promptText: 'The fennec is a desert animal of Algeria.',
          successAudio: 'Well done! That is our fennec!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🦊',
        choices: [
          { id: 'fennec', asset: '🦊', isCorrect: true },
          { id: 'cat',    asset: '🐱', isCorrect: false },
          { id: 'dog',    asset: '🐶', isCorrect: false },
        ],
      },
    },
    {
      id: 'algeria-connect',
      domain: 'values',
      targetValue: 'algeria-places',
      stepNumber: 6,
      interactionType: 'connect_dots',
      i18n: {
        ar: {
          title: 'اِرْبِطْ مَنَاطِقَ بِلَادِنَا',
          promptAudio: 'اِرْبِطِ الصَّحْرَاءَ بِالجَمَل، وَالبَحْرَ بِالسَّمَكَة!',
          promptText: 'صحراء↔جمل، جبال↔ثلج، بحر↔سمكة، واحة↔نخيل.',
          successAudio: 'الجَزَائِرُ فِيهَا صَحْرَاءُ وَجِبَالٌ وَبَحْر!',
        },
        fr: {
          title: 'Relie les Régions de Notre Pays',
          promptAudio: 'Relie le désert au dromadaire, et la mer au poisson !',
          promptText: 'Désert↔dromadaire, montagnes↔neige, mer↔poisson, oasis↔palmier.',
          successAudio: 'L\'Algérie a un désert, des montagnes et la mer !',
        },
        en: {
          title: 'Match Our Country\'s Places',
          promptAudio: 'Match the desert to the camel, and the sea to the fish!',
          promptText: 'Desert↔camel, mountains↔snow, sea↔fish, oasis↔palm.',
          successAudio: 'Algeria has desert, mountains and sea!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🗺️',
        connectPairs: [
          { id: 'sahara-camel', leftAsset: '🏜️', rightAsset: '🐪' },
          { id: 'mountain-snow', leftAsset: '⛰️', rightAsset: '❄️' },
          { id: 'sea-fish', leftAsset: '🌊', rightAsset: '🐟' },
          { id: 'oasis-palm', leftAsset: '🏝️', rightAsset: '🌴' },
        ],
      },
    },
    {
      id: 'algeria-habitat-sort',
      domain: 'values',
      targetValue: 'algeria-habitats',
      stepNumber: 7,
      interactionType: 'sorting',
      i18n: {
        ar: {
          title: 'صَحْرَاءُ أَمْ بَحْر؟',
          promptAudio: 'ضَعِ الجَمَلَ وَالفَنَكَ مَعَ الرَّمْل، وَالسَّمَكَةَ وَالسَّرَطَانَ مَعَ المَوْج!',
          promptText: 'صحراء: فنك، جمل، عقرب. بحر: سمكة، دولفين، سلطعون.',
          successAudio: 'تَعْرِفُ صَحْرَاءَنَا وَبَحْرَنَا!',
        },
        fr: {
          title: 'Désert ou Mer ?',
          promptAudio: 'Mets le dromadaire et le fennec avec le sable, le poisson et le crabe avec les vagues !',
          promptText: 'Désert : fennec, dromadaire, scorpion. Mer : poisson, dauphin, crabe.',
          successAudio: 'Tu connais notre désert et notre mer !',
        },
        en: {
          title: 'Desert or Sea?',
          promptAudio: 'Put the camel and the fennec with the sand, the fish and the crab with the waves!',
          promptText: 'Desert: fennec, camel, scorpion. Sea: fish, dolphin, crab.',
          successAudio: 'You know our desert and our sea!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🦊',
        sortBins: [
          { id: 'sahara_bin', labelAsset: '🏜️' },
          { id: 'sea_bin',    labelAsset: '🌊' },
        ],
        sortItems: [
          { id: 'fennec',   asset: '🦊', correctBinId: 'sahara_bin' },
          { id: 'camel',    asset: '🐪', correctBinId: 'sahara_bin' },
          { id: 'scorpion', asset: '🦂', correctBinId: 'sahara_bin' },
          { id: 'fish',     asset: '🐟', correctBinId: 'sea_bin'    },
          { id: 'dolphin',  asset: '🐬', correctBinId: 'sea_bin'    },
          { id: 'crab',     asset: '🦀', correctBinId: 'sea_bin'    },
        ],
      },
    },
    {
      id: 'algeria-memory',
      domain: 'values',
      targetValue: 'algeria-memory',
      stepNumber: 8,
      interactionType: 'memory_cards',
      i18n: {
        ar: {
          title: 'تَذَكَّرْ بِلَادِي',
          promptAudio: 'اِقْلِبِ البِطَاقَاتِ! قُلْ: عَلَم، جَمَل، مَسْجِد!',
          promptText: 'ثلاث أزواج فقط — اللعبة لا تعرض أكثر.',
          successAudio: 'بَرَاوَ! هَذِهِ الجَزَائِر!',
        },
        fr: {
          title: 'Mémo de Mon Algérie',
          promptAudio: 'Retourne les cartes ! Dis : drapeau, dromadaire, mosquée !',
          promptText: 'Trois paires seulement — le jeu n\'en affiche pas plus.',
          successAudio: 'Bravo ! Voici l\'Algérie !',
        },
        en: {
          title: 'My Algeria Memory',
          promptAudio: 'Flip the cards! Say: flag, camel, mosque!',
          promptText: 'Three pairs only — the game does not show more.',
          successAudio: 'Bravo! This is Algeria!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🧩',
        memoryPairs: [
          { id: 'mem-flag',   asset: '🇩🇿' },
          { id: 'mem-camel',  asset: '🐪' },
          { id: 'mem-mosque', asset: '🕌' },
        ],
      },
    },
  ],
};
