import { PreschoolModule } from './types';

/**
 * "فُنُونِي وَرُسُومَاتِي" — Art & dessin (0AP).
 * Coloring book: tap a region, any color is OK. Pictures a 3-5 yo can recognise
 * (visage, soleil, fleur, maison, fennec, chameau, couscous) — no tiny un-tappable bits.
 */
export const ART_DRAWING_MODULE: PreschoolModule = {
  id: 'preschool-art-drawing',
  domain: 'creative',
  icon: '🖍️',
  totalSteps: 8,
  titleI18n: {
    ar: 'فُنُونِي وَرُسُومَاتِي',
    fr: 'Mes dessins',
    en: 'My drawings',
  },
  activities: [
    {
      id: 'art-crayon-path',
      domain: 'creative',
      targetValue: 'crayon-path',
      stepNumber: 1,
      interactionType: 'find_path',
      i18n: {
        ar: {
          title: 'قَلَمِي المُلَوِّن',
          promptAudio: 'اِسْحَبِ القَلَمَ: وَجْه، شَمْس، زَهْرَة، بَيْت، فَنَك، ثُمَّ الكُسْكُس!',
          promptText: 'كل محطة صورة سنلوّنها بعد قليل.',
          successAudio: 'دَفْتَرُ الرَّسْمِ جَاهِز! أَحْسَنْت!',
        },
        fr: {
          title: 'Mon Crayon de Couleur',
          promptAudio: 'Glisse le crayon : visage, soleil, fleur, maison, fennec, puis le couscous !',
          promptText: 'Chaque station est un dessin à colorier ensuite.',
          successAudio: 'Le cahier de dessin est prêt ! Bravo !',
        },
        en: {
          title: 'My Coloring Crayon',
          promptAudio: 'Drag the pencil: face, sun, flower, house, fennec, then couscous!',
          promptText: 'Each stop is a picture to color next.',
          successAudio: 'The drawing book is ready! Well done!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🖍️',
        pathTheme: 'writing',
        pathToken: { startAsset: '😊', endAsset: '🍲', travelerAsset: '🖍️' },
        pathStops: [
          { x: 14, y: 30, asset: '😊', color: '#fde68a' },
          { x: 40, y: 16, asset: '☀️', color: '#fed7aa' },
          { x: 72, y: 26, asset: '🌸', color: '#fbcfe8' },
          { x: 84, y: 56, asset: '🏡', color: '#bbf7d0' },
          { x: 56, y: 76, asset: '🦊', color: '#fed7aa' },
          { x: 22, y: 78, asset: '🍲', color: '#fde68a' },
        ],
      },
    },
    {
      id: 'art-coloring-face',
      domain: 'creative',
      targetValue: 'face',
      stepNumber: 2,
      interactionType: 'coloring',
      i18n: {
        ar: {
          title: 'لَوِّنِ الوَجْه',
          promptAudio: 'اِخْتَرْ لَوْناً وَالمِسِ الوَجْهَ وَالعَيْنَيْنِ وَالفَم!',
          promptText: 'أي لون مقبول. مناطق كبيرة سهلة اللمس.',
          successAudio: 'وَجْهٌ جَمِيل! أَنْتَ فَنَّان!',
        },
        fr: {
          title: 'Colorie le Visage',
          promptAudio: 'Choisis une couleur et touche le visage, les yeux et la bouche !',
          promptText: 'Toute couleur est OK. Grandes zones faciles à tapoter.',
          successAudio: 'Un beau visage ! Tu es un artiste !',
        },
        en: {
          title: 'Color the Face',
          promptAudio: 'Pick a color and tap the face, the eyes and the mouth!',
          promptText: 'Any color is OK. Big easy tap zones.',
          successAudio: 'A lovely face! You are an artist!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '😊',
        coloringRegions: [
          { id: 'head', shape: 'circle', x: 130, y: 120, size: 82 },
          { id: 'eye-left', shape: 'circle', x: 100, y: 100, size: 18 },
          { id: 'eye-right', shape: 'circle', x: 160, y: 100, size: 18 },
          { id: 'mouth', shape: 'ellipse', x: 130, y: 155, size: 32, size2: 14 },
        ],
      },
    },
    {
      id: 'art-coloring-sun',
      domain: 'creative',
      targetValue: 'sun',
      stepNumber: 3,
      interactionType: 'coloring',
      i18n: {
        ar: {
          title: 'لَوِّنِ الشَّمْس',
          promptAudio: 'لَوِّنِ الشَّمْسَ! المِسِ الدَّائِرَةَ وَالأَشِعَّة!',
          promptText: 'قرص + 4 أشعة فقط — بدون مستطيلات قطرية متداخلة.',
          successAudio: 'شَمْسُكَ تُضِيء! رَائِع!',
        },
        fr: {
          title: 'Colorie le Soleil',
          promptAudio: 'Colorie le soleil ! Touche le rond et les rayons !',
          promptText: 'Disque + 4 rayons seulement.',
          successAudio: 'Ton soleil brille ! Bravo !',
        },
        en: {
          title: 'Color the Sun',
          promptAudio: 'Color the sun! Tap the circle and the rays!',
          promptText: 'Disc + 4 rays only.',
          successAudio: 'Your sun shines! Well done!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '☀️',
        coloringRegions: [
          { id: 'sun-disc', shape: 'circle', x: 130, y: 130, size: 48 },
          { id: 'ray-top', shape: 'rect', x: 122, y: 42, size: 16, size2: 32 },
          { id: 'ray-bottom', shape: 'rect', x: 122, y: 186, size: 16, size2: 32 },
          { id: 'ray-left', shape: 'rect', x: 42, y: 122, size: 32, size2: 16 },
          { id: 'ray-right', shape: 'rect', x: 186, y: 122, size: 32, size2: 16 },
        ],
      },
    },
    {
      id: 'art-coloring-flower',
      domain: 'creative',
      targetValue: 'flower',
      stepNumber: 4,
      interactionType: 'coloring',
      i18n: {
        ar: {
          title: 'لَوِّنِ الزَّهْرَة',
          promptAudio: 'لَوِّنِ الزَّهْرَة! البَتَلَاتُ وَالوَسَطُ وَالسَّاق!',
          promptText: 'شجّع على ألوان مختلفة للبتلات.',
          successAudio: 'زَهْرَةٌ رَائِعَة!',
        },
        fr: {
          title: 'Colorie la Fleur',
          promptAudio: 'Colorie la fleur ! Les pétales, le cœur et la tige !',
          promptText: 'Une couleur différente par pétale, si l\'enfant veut.',
          successAudio: 'Quelle belle fleur !',
        },
        en: {
          title: 'Color the Flower',
          promptAudio: 'Color the flower! The petals, the center and the stem!',
          promptText: 'A different color per petal if the child wants.',
          successAudio: 'A wonderful flower!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🌸',
        coloringRegions: [
          { id: 'stem', shape: 'rect', x: 122, y: 150, size: 16, size2: 88 },
          { id: 'center', shape: 'circle', x: 130, y: 100, size: 28 },
          { id: 'petal-top', shape: 'ellipse', x: 130, y: 58, size: 22, size2: 28 },
          { id: 'petal-bottom', shape: 'ellipse', x: 130, y: 142, size: 22, size2: 28 },
          { id: 'petal-left', shape: 'ellipse', x: 88, y: 100, size: 28, size2: 22 },
          { id: 'petal-right', shape: 'ellipse', x: 172, y: 100, size: 28, size2: 22 },
        ],
      },
    },
    {
      id: 'art-coloring-house',
      domain: 'creative',
      targetValue: 'house',
      stepNumber: 5,
      interactionType: 'coloring',
      i18n: {
        ar: {
          title: 'لَوِّنِ البَيْت',
          promptAudio: 'لَوِّنِ البَيْت! السَّقْفُ وَالجِدَارُ وَالبَابُ وَالنَّافِذَة!',
          promptText: 'أجزاء البيت: سقف، جدار، باب، نافذة.',
          successAudio: 'بَيْتٌ جَمِيل!',
        },
        fr: {
          title: 'Colorie la Maison',
          promptAudio: 'Colorie la maison ! Le toit, le mur, la porte et la fenêtre !',
          promptText: 'Toit, mur, porte, fenêtre.',
          successAudio: 'Une belle maison !',
        },
        en: {
          title: 'Color the House',
          promptAudio: 'Color the house! The roof, the wall, the door and the window!',
          promptText: 'Roof, wall, door, window.',
          successAudio: 'A beautiful house!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🏡',
        coloringRegions: [
          { id: 'roof', shape: 'ellipse', x: 130, y: 78, size: 92, size2: 36 },
          { id: 'walls', shape: 'rect', x: 52, y: 108, size: 156, size2: 118 },
          { id: 'door', shape: 'rect', x: 104, y: 168, size: 52, size2: 58 },
          { id: 'win-left', shape: 'rect', x: 64, y: 128, size: 36, size2: 32 },
          { id: 'win-right', shape: 'rect', x: 160, y: 128, size: 36, size2: 32 },
        ],
      },
    },
    {
      id: 'art-coloring-fennec',
      domain: 'creative',
      targetValue: 'fennec',
      stepNumber: 6,
      interactionType: 'coloring',
      i18n: {
        ar: {
          title: 'لَوِّنِ الفَنَك',
          promptAudio: 'لَوِّنِ الفَنَكَ! آذانٌ كَبِيرَةٌ، ثَعْلَبُ صَحْرَائِنَا!',
          promptText: 'الفنك حيوان الجزائر: جسم، رأس، أذنان، ذيل.',
          successAudio: 'فَنَكٌ رَائِع!',
        },
        fr: {
          title: 'Colorie le Fennec',
          promptAudio: 'Colorie le fennec ! Grandes oreilles, le petit renard du Sahara !',
          promptText: 'Corps, tête, deux oreilles, queue.',
          successAudio: 'Un superbe fennec !',
        },
        en: {
          title: 'Color the Fennec',
          promptAudio: 'Color the fennec! Big ears, the little fox of our Sahara!',
          promptText: 'Body, head, two ears, tail.',
          successAudio: 'A wonderful fennec!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🦊',
        coloringRegions: [
          { id: 'body', shape: 'ellipse', x: 130, y: 170, size: 70, size2: 50 },
          { id: 'head', shape: 'circle', x: 130, y: 92, size: 46 },
          { id: 'ear-left', shape: 'ellipse', x: 84, y: 48, size: 22, size2: 38 },
          { id: 'ear-right', shape: 'ellipse', x: 176, y: 48, size: 22, size2: 38 },
          { id: 'tail', shape: 'ellipse', x: 196, y: 196, size: 38, size2: 20 },
        ],
      },
    },
    {
      id: 'art-coloring-camel',
      domain: 'creative',
      targetValue: 'camel',
      stepNumber: 7,
      interactionType: 'coloring',
      i18n: {
        ar: {
          title: 'لَوِّنِ الجَمَل',
          promptAudio: 'لَوِّنِ الجَمَل! سَفِينَةُ الصَّحْرَاءِ وَسَنَامُهُ!',
          promptText: 'جسم، سنام، رأس، أرجل.',
          successAudio: 'جَمَلٌ قَوِي!',
        },
        fr: {
          title: 'Colorie le Dromadaire',
          promptAudio: 'Colorie le dromadaire ! Le vaisseau du désert et sa bosse !',
          promptText: 'Corps, bosse, tête, pattes.',
          successAudio: 'Un dromadaire fort !',
        },
        en: {
          title: 'Color the Camel',
          promptAudio: 'Color the camel! The ship of the desert and its hump!',
          promptText: 'Body, hump, head, legs.',
          successAudio: 'A strong camel!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🐪',
        coloringRegions: [
          { id: 'body', shape: 'ellipse', x: 132, y: 168, size: 80, size2: 48 },
          { id: 'hump', shape: 'ellipse', x: 150, y: 112, size: 34, size2: 36 },
          { id: 'head', shape: 'ellipse', x: 88, y: 100, size: 32, size2: 24 },
          { id: 'leg-front', shape: 'rect', x: 78, y: 200, size: 22, size2: 48 },
          { id: 'leg-back', shape: 'rect', x: 168, y: 200, size: 22, size2: 48 },
        ],
      },
    },
    {
      id: 'art-coloring-couscous',
      domain: 'creative',
      targetValue: 'couscous',
      stepNumber: 8,
      interactionType: 'coloring',
      i18n: {
        ar: {
          title: 'لَوِّنِ الكُسْكُس',
          promptAudio: 'لَوِّنِ طَبَقَ الكُسْكُس! القِدْرُ وَالغِطَاءُ وَالطَّعَام!',
          promptText: 'الكسكس طبق الجمعة والعائلة في الجزائر.',
          successAudio: 'شَهِيّ! طَبَقُكَ جَاهِز!',
        },
        fr: {
          title: 'Colorie le Couscous',
          promptAudio: 'Colorie le plat de couscous ! La marmite, le couvercle et le plat !',
          promptText: 'Le couscous, plat du vendredi et de la famille.',
          successAudio: 'Miam ! Ton plat est prêt !',
        },
        en: {
          title: 'Color the Couscous',
          promptAudio: 'Color the couscous dish! The pot, the lid and the food!',
          promptText: 'Couscous is a Friday and family dish in Algeria.',
          successAudio: 'Yum! Your dish is ready!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🍲',
        coloringRegions: [
          { id: 'pot', shape: 'rect', x: 52, y: 138, size: 156, size2: 90 },
          { id: 'lid', shape: 'ellipse', x: 130, y: 132, size: 84, size2: 22 },
          { id: 'food', shape: 'ellipse', x: 130, y: 168, size: 64, size2: 28 },
          { id: 'handle-left', shape: 'ellipse', x: 40, y: 176, size: 18, size2: 12 },
          { id: 'handle-right', shape: 'ellipse', x: 220, y: 176, size: 18, size2: 12 },
        ],
      },
    },
  ],
};
