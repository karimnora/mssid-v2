import { PreschoolModule } from './types';

// "خُطُوطِي التَّحْضِيرِيَّةُ" — Pre-writing graphism (fine motor / tracé préparatoire).
// The printable worksheets (printablesData.ts, category "graphisme") already offer 4 paper sheets
// for straight/zigzag/wavy/loop lines — this module adds the missing INTERACTIVE digital counterpart
// (using the existing 'trace' interactionType, which renders `mainSvgOrImage` as a big traceable
// glyph) plus the two line orientations not covered on paper: vertical and oblique.
export const PRE_WRITING_MODULE: PreschoolModule = {
  id: 'preschool-pre-writing',
  domain: 'writing',
  icon: '✏️',
  totalSteps: 6,
  titleI18n: {
    ar: 'خُطُوطِي التَّحْضِيرِيَّةُ',
    fr: 'Mes Petits Tracés',
    en: 'My First Strokes',
  },
  activities: [
    {
      id: 'writing-vertical-line',
      domain: 'writing',
      targetValue: 'vertical',
      stepNumber: 1,
      interactionType: 'trace',
      i18n: {
        ar: {
          title: 'الخَطُّ العَمُودِيُّ',
          promptAudio: 'اِرْسُمْ خَطّاً عَمُودِيّاً بِإِصْبَعِكَ! مِنْ أَعْلَى إِلَى أَسْفَل!',
          promptText: 'شجع طفلك على تمرير إصبعه من أعلى الخط إلى أسفله.',
          successAudio: 'خَطٌّ عَمُودِيٌّ رَائِع! يَدُكَ قَوِيَّةٌ وَثَابِتَة!',
        },
        fr: {
          title: 'La Ligne Verticale',
          promptAudio: 'Trace une ligne verticale avec ton doigt ! De haut en bas !',
          promptText: 'Encouragez l\'enfant à tracer du haut vers le bas.',
          successAudio: 'Superbe ligne verticale ! Ta main est ferme et sûre !',
        },
        en: {
          title: 'The Vertical Line',
          promptAudio: 'Trace a vertical line with your finger! From top to bottom!',
          promptText: 'Encourage your child to trace from top to bottom.',
          successAudio: 'Wonderful vertical line! Your hand is steady and strong!',
        },
      },
      visualAssets: { mainSvgOrImage: '｜' },
    },
    {
      id: 'writing-horizontal-line',
      domain: 'writing',
      targetValue: 'horizontal',
      stepNumber: 2,
      interactionType: 'trace',
      i18n: {
        ar: {
          title: 'الخَطُّ الأُفُقِيُّ',
          promptAudio: 'اِرْسُمْ خَطّاً أُفُقِيّاً بِإِصْبَعِكَ! مِنَ اليَمِينِ إِلَى اليَسَار!',
          promptText: 'شجع طفلك على تمرير إصبعه من اليمين إلى اليسار.',
          successAudio: 'خَطٌّ أُفُقِيٌّ مُسْتَقِيمٌ رَائِع!',
        },
        fr: {
          title: 'La Ligne Horizontale',
          promptAudio: 'Trace une ligne horizontale avec ton doigt ! De gauche à droite !',
          promptText: 'Encouragez l\'enfant à tracer de gauche à droite.',
          successAudio: 'Belle ligne horizontale bien droite !',
        },
        en: {
          title: 'The Horizontal Line',
          promptAudio: 'Trace a horizontal line with your finger! From left to right!',
          promptText: 'Encourage your child to trace from left to right.',
          successAudio: 'Nice straight horizontal line!',
        },
      },
      visualAssets: { mainSvgOrImage: '―' },
    },
    {
      id: 'writing-oblique-line',
      domain: 'writing',
      targetValue: 'oblique',
      stepNumber: 3,
      interactionType: 'trace',
      i18n: {
        ar: {
          title: 'الخَطُّ المَائِلُ',
          promptAudio: 'اِرْسُمْ خَطّاً مَائِلاً بِإِصْبَعِكَ! مِنَ الأَسْفَلِ إِلَى الأَعْلَى!',
          promptText: 'شجع طفلك على تمرير إصبعه بشكل مائل.',
          successAudio: 'خَطٌّ مَائِلٌ مُمْتَاز! أَنْتَ فَنَّانٌ صَغِير!',
        },
        fr: {
          title: 'La Ligne Oblique',
          promptAudio: 'Trace une ligne oblique avec ton doigt ! En diagonale !',
          promptText: 'Encouragez l\'enfant à tracer en diagonale.',
          successAudio: 'Excellente ligne oblique ! Tu es un petit artiste !',
        },
        en: {
          title: 'The Oblique Line',
          promptAudio: 'Trace an oblique line with your finger! Diagonally!',
          promptText: 'Encourage your child to trace diagonally.',
          successAudio: 'Great oblique line! You are a little artist!',
        },
      },
      visualAssets: { mainSvgOrImage: '╱' },
    },
    {
      id: 'writing-zigzag-line',
      domain: 'writing',
      targetValue: 'zigzag',
      stepNumber: 4,
      interactionType: 'trace',
      i18n: {
        ar: {
          title: 'الخَطُّ المُنْكَسِرُ',
          promptAudio: 'اِرْسُمْ خَطّاً مُتَعَرِّجاً بِإِصْبَعِكَ! فَوْقَ وَتَحْت، فَوْقَ وَتَحْت!',
          promptText: 'شجع طفلك على رسم خط متعرج مثل أسنان المنشار.',
          successAudio: 'خَطٌّ مُتَعَرِّجٌ رَائِع! مِثْلَ البَرْقِ تَمَاماً!',
        },
        fr: {
          title: 'La Ligne en Zigzag',
          promptAudio: 'Trace une ligne en zigzag avec ton doigt ! En haut, en bas !',
          promptText: 'Encouragez l\'enfant à tracer un zigzag comme des dents de scie.',
          successAudio: 'Super zigzag ! Comme un éclair !',
        },
        en: {
          title: 'The Zigzag Line',
          promptAudio: 'Trace a zigzag line with your finger! Up and down!',
          promptText: 'Encourage your child to trace a saw-tooth zigzag.',
          successAudio: 'Great zigzag! Just like lightning!',
        },
      },
      visualAssets: { mainSvgOrImage: '⚡' },
    },
    {
      id: 'writing-wavy-line',
      domain: 'writing',
      targetValue: 'wave',
      stepNumber: 5,
      interactionType: 'trace',
      i18n: {
        ar: {
          title: 'الخَطُّ المُتَمَوِّجُ',
          promptAudio: 'اِرْسُمْ خَطّاً مُتَمَوِّجاً بِإِصْبَعِكَ! مِثْلَ مَوْجِ البَحْر!',
          promptText: 'شجع طفلك على رسم خط متموج ناعم.',
          successAudio: 'خَطٌّ مُتَمَوِّجٌ نَاعِمٌ رَائِع! مِثْلَ أَمْوَاجِ البَحْر!',
        },
        fr: {
          title: 'La Ligne Ondulée',
          promptAudio: 'Trace une ligne ondulée avec ton doigt ! Comme les vagues de la mer !',
          promptText: 'Encouragez l\'enfant à tracer une vague douce.',
          successAudio: 'Belle ligne ondulée ! Comme les vagues de la mer !',
        },
        en: {
          title: 'The Wavy Line',
          promptAudio: 'Trace a wavy line with your finger! Like ocean waves!',
          promptText: 'Encourage your child to trace a smooth wave.',
          successAudio: 'Beautiful wavy line! Just like ocean waves!',
        },
      },
      visualAssets: { mainSvgOrImage: '〜' },
    },
    {
      id: 'writing-loop-line',
      domain: 'writing',
      targetValue: 'loop',
      stepNumber: 6,
      interactionType: 'trace',
      i18n: {
        ar: {
          title: 'الدَّوَائِرُ وَالمُنْحَنَيَاتُ',
          promptAudio: 'اِرْسُمْ دَائِرَةً بِإِصْبَعِكَ! دُرْ، دُرْ، دُرْ!',
          promptText: 'شجع طفلك على رسم دائرة أو حلقة كاملة.',
          successAudio: 'دَائِرَةٌ رَائِعَة! يَدُكَ تَتَحَكَّمُ فِي الحَرَكَةِ بِمَهَارَة!',
        },
        fr: {
          title: 'Les Boucles et les Ronds',
          promptAudio: 'Trace un rond avec ton doigt ! Tourne, tourne, tourne !',
          promptText: 'Encouragez l\'enfant à tracer une boucle complète.',
          successAudio: 'Superbe boucle ! Ta main contrôle bien le mouvement !',
        },
        en: {
          title: 'Loops and Curves',
          promptAudio: 'Trace a circle with your finger! Round, round, round!',
          promptText: 'Encourage your child to trace a full loop.',
          successAudio: 'Wonderful loop! Your hand controls the movement so well!',
        },
      },
      visualAssets: { mainSvgOrImage: '◯' },
    },
  ],
};
