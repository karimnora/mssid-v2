import { PreschoolModule } from './types';

/**
 * "خُطُوطِي التَّحْضِيرِيَّةُ" — Graphisme préparatoire (3-5 ans).
 * Trace a concrete object (arbre, serpent, cerf-volant…) — never "ligne verticale"
 * as an abstract label a preschooler cannot picture.
 */
export const PRE_WRITING_MODULE: PreschoolModule = {
  id: 'preschool-pre-writing',
  domain: 'writing',
  icon: '✏️',
  totalSteps: 8,
  titleI18n: {
    ar: 'خُطُوطِي التَّحْضِيرِيَّةُ',
    fr: 'Mes Petits Tracés',
    en: 'My First Strokes',
  },
  activities: [
    {
      id: 'writing-pencil-path',
      domain: 'writing',
      targetValue: 'pencil-path',
      stepNumber: 1,
      interactionType: 'find_path',
      i18n: {
        ar: {
          title: 'قَلَمِي يَتَمَرَّن',
          promptAudio: 'اِسْحَبِ القَلَمَ: شَجَرَة، ثُعْبَان، طَائِرَةٌ وَرَقِيَّة، بَرْق، مَوْج، ثُمَّ الشَّمْس!',
          promptText: 'كل محطة هي نوع خط سنتتبعه بعد قليل.',
          successAudio: 'يَدُكَ جَاهِزَة! أَحْسَنْت!',
        },
        fr: {
          title: 'Mon Crayon s\'échauffe',
          promptAudio: 'Glisse le crayon : arbre, serpent, cerf-volant, éclair, vague, puis le soleil !',
          promptText: 'Chaque station est un trait que l\'enfant va tracer ensuite.',
          successAudio: 'Ta main est prête ! Bravo !',
        },
        en: {
          title: 'My Pencil Warms Up',
          promptAudio: 'Drag the pencil: tree, snake, kite, lightning, wave, then the sun!',
          promptText: 'Each stop is a stroke the child will trace next.',
          successAudio: 'Your hand is ready! Well done!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '✏️',
        pathTheme: 'writing',
        pathToken: { startAsset: '🌲', endAsset: '☀️', travelerAsset: '✏️' },
        pathStops: [
          { x: 14, y: 28, asset: '🌲', color: '#bbf7d0' },
          { x: 40, y: 16, asset: '🐍', color: '#fde68a' },
          { x: 72, y: 26, asset: '🪁', color: '#e9d5ff' },
          { x: 84, y: 56, asset: '⚡', color: '#fef08a' },
          { x: 56, y: 76, asset: '🌊', color: '#bae6fd' },
          { x: 22, y: 78, asset: '☀️', color: '#fed7aa' },
        ],
      },
    },
    {
      id: 'writing-vertical-line',
      domain: 'writing',
      targetValue: 'vertical',
      stepNumber: 2,
      interactionType: 'trace',
      i18n: {
        ar: {
          title: 'أَرْسُمُ الشَّجَرَة',
          promptAudio: 'اِرْسُمِ الشَّجَرَة! مِنَ الأَعْلَى إِلَى الأَسْفَل، مِثْلَ الجِذْع!',
          promptText: 'حركة عمودية من الأعلى إلى الأسفل — جذع الشجرة.',
          successAudio: 'شَجَرَةٌ قَوِيَّة! يَدُكَ ثَابِتَة!',
        },
        fr: {
          title: 'Je Trace l\'Arbre',
          promptAudio: 'Trace l\'arbre ! Du haut vers le bas, comme le tronc !',
          promptText: 'Geste vertical haut → bas, comme un tronc.',
          successAudio: 'Un bel arbre ! Ta main est ferme !',
        },
        en: {
          title: 'I Trace the Tree',
          promptAudio: 'Trace the tree! From top to bottom, like the trunk!',
          promptText: 'Vertical stroke top → bottom, like a trunk.',
          successAudio: 'A strong tree! Your hand is steady!',
        },
      },
      visualAssets: { mainSvgOrImage: '🌲' },
    },
    {
      id: 'writing-horizontal-line',
      domain: 'writing',
      targetValue: 'horizontal',
      stepNumber: 3,
      interactionType: 'trace',
      i18n: {
        ar: {
          title: 'أَرْسُمُ الثُّعْبَان',
          promptAudio: 'اِرْسُمِ الثُّعْبَان! مِنَ اليَمِينِ إِلَى اليَسَار، يَزْحَفُ عَلَى الأَرْض!',
          promptText: 'في العربية نتحرّك من اليمين إلى اليسار. بالفرنسية/الإنجليزية: gauche → droite.',
          successAudio: 'ثُعْبَانٌ طَوِيل! أَحْسَنْت!',
        },
        fr: {
          title: 'Je Trace le Serpent',
          promptAudio: 'Trace le serpent ! De gauche à droite, il rampe sur le sol !',
          promptText: 'Geste horizontal gauche → droite (préparation latin).',
          successAudio: 'Un long serpent ! Bravo !',
        },
        en: {
          title: 'I Trace the Snake',
          promptAudio: 'Trace the snake! From left to right, it crawls on the ground!',
          promptText: 'Horizontal stroke left → right (Latin preparation).',
          successAudio: 'A long snake! Well done!',
        },
      },
      visualAssets: { mainSvgOrImage: '🐍' },
    },
    {
      id: 'writing-oblique-line',
      domain: 'writing',
      targetValue: 'oblique',
      stepNumber: 4,
      interactionType: 'trace',
      i18n: {
        ar: {
          title: 'أَرْسُمُ الطَّائِرَةَ الوَرَقِيَّة',
          promptAudio: 'اِرْسُمِ الطَّائِرَةَ الوَرَقِيَّة! تَصْعَدُ فِي الهَوَاءِ بِخَطٍّ مَائِل!',
          promptText: 'حركة مائلة، مثل خيط الطائرة الورقية.',
          successAudio: 'طَارَتْ فِي السَّمَاء! أَنْتَ فَنَّان!',
        },
        fr: {
          title: 'Je Trace le Cerf-volant',
          promptAudio: 'Trace le cerf-volant ! Il monte dans le ciel en diagonale !',
          promptText: 'Geste oblique, comme la ficelle du cerf-volant.',
          successAudio: 'Il vole dans le ciel ! Petit artiste !',
        },
        en: {
          title: 'I Trace the Kite',
          promptAudio: 'Trace the kite! It goes up in the sky on a slant!',
          promptText: 'Diagonal stroke, like a kite string.',
          successAudio: 'It flies in the sky! Little artist!',
        },
      },
      visualAssets: { mainSvgOrImage: '🪁' },
    },
    {
      id: 'writing-zigzag-line',
      domain: 'writing',
      targetValue: 'zigzag',
      stepNumber: 5,
      interactionType: 'trace',
      i18n: {
        ar: {
          title: 'أَرْسُمُ البَرْق',
          promptAudio: 'اِرْسُمِ البَرْق! فَوْقَ وَتَحْت، فَوْقَ وَتَحْت، زِكْزَاك!',
          promptText: 'خط منكسر مثل البرق.',
          successAudio: 'بَرْقٌ سَرِيع! وَاوَ!',
        },
        fr: {
          title: 'Je Trace l\'Éclair',
          promptAudio: 'Trace l\'éclair ! En haut, en bas, en haut, en bas, zigzag !',
          promptText: 'Ligne brisée, comme un éclair.',
          successAudio: 'Un éclair rapide ! Wow !',
        },
        en: {
          title: 'I Trace the Lightning',
          promptAudio: 'Trace the lightning! Up, down, up, down, zigzag!',
          promptText: 'Broken line, like lightning.',
          successAudio: 'Fast lightning! Wow!',
        },
      },
      visualAssets: { mainSvgOrImage: '⚡' },
    },
    {
      id: 'writing-wavy-line',
      domain: 'writing',
      targetValue: 'wave',
      stepNumber: 6,
      interactionType: 'trace',
      i18n: {
        ar: {
          title: 'أَرْسُمُ المَوْج',
          promptAudio: 'اِرْسُمِ المَوْج! نَاعِمٌ مِثْلَ بَحْرِ الجَزَائِر!',
          promptText: 'خط متموّج ناعم — بحر الجزائر.',
          successAudio: 'مَوْجَةٌ جَمِيلَة! بَحْرُنَا!',
        },
        fr: {
          title: 'Je Trace la Vague',
          promptAudio: 'Trace la vague ! Douce comme la mer d\'Algérie !',
          promptText: 'Ligne ondulée — la Méditerranée.',
          successAudio: 'Une belle vague ! Notre mer !',
        },
        en: {
          title: 'I Trace the Wave',
          promptAudio: 'Trace the wave! Soft like the sea of Algeria!',
          promptText: 'Wavy line — the Mediterranean.',
          successAudio: 'A beautiful wave! Our sea!',
        },
      },
      visualAssets: { mainSvgOrImage: '🌊' },
    },
    {
      id: 'writing-loop-line',
      domain: 'writing',
      targetValue: 'loop',
      stepNumber: 7,
      interactionType: 'trace',
      i18n: {
        ar: {
          title: 'أَرْسُمُ الشَّمْس',
          promptAudio: 'اِرْسُمِ الشَّمْسَ! دُرْ دُرْ دُرْ، دَائِرَةٌ كَبِيرَة!',
          promptText: 'حلقة / دائرة كاملة — تحضير الحروف المستديرة.',
          successAudio: 'شَمْسٌ مُشْرِقَة! دَائِرَةٌ رَائِعَة!',
        },
        fr: {
          title: 'Je Trace le Soleil',
          promptAudio: 'Trace le soleil ! Tourne, tourne, tourne, un grand rond !',
          promptText: 'Boucle / cercle — préparation des lettres rondes.',
          successAudio: 'Un soleil brillant ! Superbe rond !',
        },
        en: {
          title: 'I Trace the Sun',
          promptAudio: 'Trace the sun! Round, round, round, a big circle!',
          promptText: 'Loop / circle — getting ready for round letters.',
          successAudio: 'A bright sun! A wonderful circle!',
        },
      },
      visualAssets: { mainSvgOrImage: '☀️' },
    },
    {
      id: 'writing-pencil-maze',
      domain: 'writing',
      targetValue: 'pencil-maze',
      stepNumber: 8,
      interactionType: 'maze',
      i18n: {
        ar: {
          title: 'القَلَمُ إِلَى الكُرَّاس',
          promptAudio: 'اِسْحَبِ القَلَمَ عَلَى الخَطِّ حَتَّى الكُرَّاس!',
          promptText: 'تتبع الطريق المتقطع بالإصبع — motricité fine.',
          successAudio: 'وَصَلَ القَلَمُ! نَكْتُب!',
        },
        fr: {
          title: 'Le Crayon vers le Cahier',
          promptAudio: 'Glisse le crayon sur la ligne jusqu\'au cahier !',
          promptText: 'Suivre le pointillé du doigt — motricité fine.',
          successAudio: 'Le crayon est arrivé ! On écrit !',
        },
        en: {
          title: 'Pencil to the Notebook',
          promptAudio: 'Drag the pencil along the line all the way to the notebook!',
          promptText: 'Follow the dotted path with a finger — fine motor.',
          successAudio: 'The pencil arrived! We write!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '📓',
        mazeTravelerAsset: '✏️',
        mazeWaypoints: [
          { x: 28, y: 220 },
          { x: 70, y: 170 },
          { x: 50, y: 110 },
          { x: 130, y: 90 },
          { x: 190, y: 140 },
          { x: 230, y: 50 },
        ],
      },
    },
  ],
};
