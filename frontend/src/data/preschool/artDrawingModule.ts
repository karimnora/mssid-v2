import { PreschoolModule } from './types';

/**
 * "فُنُونِي وَرُسُومَاتِي" — L'Art & le Dessin (Éducation Artistique 0AP).
 *
 * Covers: coloring familiar scenes (face, sun, flower, house, balloon, fish).
 * All activities use the `coloring` interaction type — child taps a region to fill it
 * with whichever color they choose, no "wrong" answer, activity done when every region
 * has a color. Coordinates are in the shared 260×260 canvas box.
 *
 * NOTE: `mainSvgOrImage` is used as the title emoji in the module path step node.
 */
export const ART_DRAWING_MODULE: PreschoolModule = {
  id: 'preschool-art-drawing',
  domain: 'creative',
  icon: '🖍️',
  totalSteps: 8,
  titleI18n: {
    ar: 'فُنُونِي وَرُسُومَاتِي',
    fr: 'Mon Art & Mes Dessins',
    en: 'My Art & Drawings',
  },
  activities: [
    // ── Activity 1 ─ Color a Happy Face ───────────────────────────────────────
    {
      id: 'art-coloring-face',
      domain: 'creative',
      targetValue: 'face',
      stepNumber: 1,
      interactionType: 'coloring',
      i18n: {
        ar: {
          title: 'لَوِّنِ الوَجْهَ السَّعِيد',
          promptAudio: 'لَوِّنِ الوَجْهَ بِأَلْوَانِكَ المُفَضَّلَة! اِخْتَرِ اللَّوْنَ وَاِلْمَسِ الشَّكْل!',
          promptText: 'دع طفلك يختار الألوان بحرية.',
          successAudio: 'تَحْفَة! لَقَدْ رَسَمْتَ وَجْهاً رَائِعاً!',
        },
        fr: {
          title: 'Colorie le Visage Joyeux',
          promptAudio: 'Colorie le visage avec tes couleurs préférées ! Choisis une couleur et touche la forme !',
          promptText: 'Laissez l\'enfant choisir les couleurs librement.',
          successAudio: 'Chef-d\'œuvre ! Tu as fait un visage magnifique !',
        },
        en: {
          title: 'Color the Happy Face',
          promptAudio: 'Color the face with your favorite colors! Pick a color and tap the shape!',
          promptText: 'Let the child choose colors freely.',
          successAudio: 'Masterpiece! You made a wonderful face!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '😊',
        coloringRegions: [
          // Head
          { id: 'head',       shape: 'circle',  x: 130, y: 115, size: 78                },
          // Left eye
          { id: 'eye-left',   shape: 'circle',  x: 100, y: 95,  size: 14                },
          // Right eye
          { id: 'eye-right',  shape: 'circle',  x: 160, y: 95,  size: 14                },
          // Nose
          { id: 'nose',       shape: 'circle',  x: 130, y: 122, size: 9                 },
          // Mouth (wide smile shape approximated as a flat ellipse)
          { id: 'mouth',      shape: 'ellipse', x: 130, y: 148, size: 30,   size2: 12   },
          // Left cheek blush
          { id: 'cheek-left', shape: 'ellipse', x: 80,  y: 135, size: 18,   size2: 12   },
          // Right cheek blush
          { id: 'cheek-right',shape: 'ellipse', x: 180, y: 135, size: 18,   size2: 12   },
        ],
      },
    },

    // ── Activity 2 ─ Color the Sun ────────────────────────────────────────────
    {
      id: 'art-coloring-sun',
      domain: 'creative',
      targetValue: 'sun',
      stepNumber: 2,
      interactionType: 'coloring',
      i18n: {
        ar: {
          title: 'لَوِّنِ الشَّمْسَ المُشْرِقَة',
          promptAudio: 'لَوِّنِ الشَّمْسَ! اِخْتَرِ اللَّوْنَ الأَصْفَرَ أَوِ البُرْتُقَالِيَّ وَالمِسِ الشَّمْسَ!',
          promptText: 'شجّع طفلك على استخدام الألوان الدافئة.',
          successAudio: 'رَائِعٌ! شَمْسُكَ تُنِيرُ كُلَّ مَكَان!',
        },
        fr: {
          title: 'Colorie le Soleil Brillant',
          promptAudio: 'Colorie le soleil ! Choisis le jaune ou l\'orange et touche le soleil !',
          promptText: 'Encouragez l\'enfant à utiliser des couleurs chaudes.',
          successAudio: 'Magnifique ! Ton soleil illumine tout !',
        },
        en: {
          title: 'Color the Bright Sun',
          promptAudio: 'Color the sun! Choose yellow or orange and tap the sun!',
          promptText: 'Encourage the child to use warm colors.',
          successAudio: 'Beautiful! Your sun lights up everything!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '☀️',
        coloringRegions: [
          // Sun disc
          { id: 'sun-disc',    shape: 'circle',  x: 130, y: 130, size: 52               },
          // Rays (4 cardinal)
          { id: 'ray-top',     shape: 'rect',    x: 126, y: 55,  size: 8,   size2: 25  },
          { id: 'ray-bottom',  shape: 'rect',    x: 126, y: 182, size: 8,   size2: 25  },
          { id: 'ray-left',    shape: 'rect',    x: 55,  y: 126, size: 25,  size2: 8   },
          { id: 'ray-right',   shape: 'rect',    x: 182, y: 126, size: 25,  size2: 8   },
          // Diagonal rays (approximated with small rects)
          { id: 'ray-tl',      shape: 'rect',    x: 72,  y: 72,  size: 7,   size2: 20  },
          { id: 'ray-tr',      shape: 'rect',    x: 181, y: 72,  size: 7,   size2: 20  },
          { id: 'ray-bl',      shape: 'rect',    x: 72,  y: 168, size: 7,   size2: 20  },
          { id: 'ray-br',      shape: 'rect',    x: 181, y: 168, size: 7,   size2: 20  },
        ],
      },
    },

    // ── Activity 3 ─ Color the Flower ─────────────────────────────────────────
    {
      id: 'art-coloring-flower',
      domain: 'creative',
      targetValue: 'flower',
      stepNumber: 3,
      interactionType: 'coloring',
      i18n: {
        ar: {
          title: 'لَوِّنِ الزَّهْرَةَ الجَمِيلَة',
          promptAudio: 'لَوِّنِ الزَّهْرَةَ بِأَلْوَانٍ زَاهِيَة! الوُرُودُ جَمِيلَةٌ وَتَمْلَأُ الدُّنْيَا عِطْرَاً!',
          promptText: 'شجّع طفلك على استخدام ألوان متعددة.',
          successAudio: 'وَاوَ! زَهْرَتُكَ رَائِعَةٌ وَجَمِيلَة!',
        },
        fr: {
          title: 'Colorie la Belle Fleur',
          promptAudio: 'Colorie la fleur avec des couleurs vives ! Les fleurs sont belles et embaument le monde !',
          promptText: 'Encouragez l\'enfant à utiliser plusieurs couleurs.',
          successAudio: 'Wow ! Ta fleur est superbe et magnifique !',
        },
        en: {
          title: 'Color the Beautiful Flower',
          promptAudio: 'Color the flower with bright colors! Flowers are beautiful and fill the world with fragrance!',
          promptText: 'Encourage the child to use multiple colors.',
          successAudio: 'Wow! Your flower is amazing and beautiful!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🌸',
        coloringRegions: [
          // Stem
          { id: 'stem',         shape: 'rect',    x: 124, y: 140, size: 12,  size2: 95  },
          // Center of flower
          { id: 'center',       shape: 'circle',  x: 130, y: 98,  size: 30               },
          // Petals (ellipses around the center)
          { id: 'petal-top',    shape: 'ellipse', x: 130, y: 54,  size: 16,  size2: 32  },
          { id: 'petal-bottom', shape: 'ellipse', x: 130, y: 142, size: 16,  size2: 32  },
          { id: 'petal-left',   shape: 'ellipse', x: 86,  y: 98,  size: 32,  size2: 16  },
          { id: 'petal-right',  shape: 'ellipse', x: 174, y: 98,  size: 32,  size2: 16  },
          // Leaf
          { id: 'leaf',         shape: 'ellipse', x: 100, y: 170, size: 22,  size2: 12  },
        ],
      },
    },

    // ── Activity 4 ─ Color the House ──────────────────────────────────────────
    {
      id: 'art-coloring-house',
      domain: 'creative',
      targetValue: 'house',
      stepNumber: 4,
      interactionType: 'coloring',
      i18n: {
        ar: {
          title: 'لَوِّنِ البَيْتَ الجَمِيل',
          promptAudio: 'لَوِّنِ البَيْتَ! الجُدْرَانُ وَالسَّقْفُ وَالبَابُ وَالنَّوَافِذُ! اِجْعَلْهُ بَيْتاً أَحْلَام!',
          promptText: 'تحدث مع طفلك عن أجزاء البيت.',
          successAudio: 'عَظِيمٌ! بَيْتُكَ رَائِعٌ! هَذَا البَيْتُ الجَمِيل!',
        },
        fr: {
          title: 'Colorie la Belle Maison',
          promptAudio: 'Colorie la maison ! Les murs, le toit, la porte et les fenêtres ! Fais-en une maison de rêve !',
          promptText: 'Parlez avec votre enfant des parties de la maison.',
          successAudio: 'Formidable ! Ta maison est splendide ! Quelle belle maison !',
        },
        en: {
          title: 'Color the Beautiful House',
          promptAudio: 'Color the house! The walls, roof, door and windows! Make it a dream home!',
          promptText: 'Talk with your child about the parts of a house.',
          successAudio: 'Amazing! Your house is magnificent! What a beautiful home!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🏡',
        coloringRegions: [
          // Roof (wide flat ellipse approximating a triangle top)
          { id: 'roof',       shape: 'ellipse', x: 130, y: 82,  size: 90,  size2: 32   },
          // Main walls
          { id: 'walls',      shape: 'rect',    x: 50,  y: 112, size: 160, size2: 115  },
          // Door
          { id: 'door',       shape: 'rect',    x: 107, y: 175, size: 46,  size2: 52   },
          // Left window
          { id: 'win-left',   shape: 'rect',    x: 62,  y: 135, size: 40,  size2: 35   },
          // Right window
          { id: 'win-right',  shape: 'rect',    x: 158, y: 135, size: 40,  size2: 35   },
          // Chimney
          { id: 'chimney',    shape: 'rect',    x: 175, y: 58,  size: 22,  size2: 30   },
        ],
      },
    },

    // ── Activity 5 ─ Color the Balloon ────────────────────────────────────────
    {
      id: 'art-coloring-balloon',
      domain: 'creative',
      targetValue: 'balloon',
      stepNumber: 5,
      interactionType: 'coloring',
      i18n: {
        ar: {
          title: 'لَوِّنِ البَالُونَ المُبَهِج',
          promptAudio: 'لَوِّنِ البَالُونَ بِلَوْنِكَ المُفَضَّل! البَالُوناتُ تُفَرِّحُ الأَطْفَالَ فِي الأَعْيَاد!',
          promptText: 'شجّع طفلك على اختيار لونه المفضل.',
          successAudio: 'يَا سَلَام! بَالُونُكَ أَجْمَلُ بَالُونٍ فِي العَالَم!',
        },
        fr: {
          title: 'Colorie le Joyeux Ballon',
          promptAudio: 'Colorie le ballon avec ta couleur préférée ! Les ballons font la joie des enfants aux fêtes !',
          promptText: 'Encouragez l\'enfant à choisir sa couleur préférée.',
          successAudio: 'Oh là là ! Ton ballon est le plus beau du monde !',
        },
        en: {
          title: 'Color the Cheerful Balloon',
          promptAudio: 'Color the balloon with your favorite color! Balloons bring joy to children at parties!',
          promptText: 'Encourage the child to choose their favorite color.',
          successAudio: 'Wow! Your balloon is the most beautiful in the whole world!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🎈',
        coloringRegions: [
          // Balloon body (tall ellipse)
          { id: 'balloon-body',  shape: 'ellipse', x: 130, y: 105, size: 62,  size2: 82   },
          // Knot (small circle at bottom of balloon)
          { id: 'balloon-knot',  shape: 'circle',  x: 130, y: 187, size: 7                },
          // String
          { id: 'balloon-string',shape: 'rect',    x: 128, y: 194, size: 4,   size2: 55   },
          // Shine highlight (small circle upper-left of balloon)
          { id: 'balloon-shine', shape: 'circle',  x: 100, y: 78,  size: 10               },
        ],
      },
    },

    // ── Activity 6 ─ Color the Fennec Fox (mascotte algérienne) ───────────────
    {
      id: 'art-coloring-fennec',
      domain: 'creative',
      targetValue: 'fennec',
      stepNumber: 6,
      interactionType: 'coloring',
      i18n: {
        ar: {
          title: 'لَوِّنِ الفَنَكَ الجَزَائِرِي',
          promptAudio: 'لَوِّنِ الفَنَكَ! حَيَوَانُنَا الجَمِيلُ مِنَ الصَّحْرَاءِ الجَزَائِرِيَّة!',
          promptText: 'الفنك رمز الجزائر الحبيب — ذو آذان كبيرة وعيون صغيرة جميلة.',
          successAudio: 'مَا أَجْمَلَهُ! فَنَكُكَ رَائِعٌ كَصَحْرَاءِ الجَزَائِر!',
        },
        fr: {
          title: 'Colorie le Fennec Algérien',
          promptAudio: 'Colorie le fennec ! Notre beau animal du désert algérien !',
          promptText: 'Le fennec est le symbole de l\'Algérie — grandes oreilles et beaux petits yeux.',
          successAudio: 'Qu\'il est beau ! Ton fennec est magnifique comme le désert algérien !',
        },
        en: {
          title: 'Color the Algerian Fennec',
          promptAudio: 'Color the fennec! Our beautiful animal from the Algerian desert!',
          promptText: 'The fennec is Algeria\'s symbol — big ears and beautiful tiny eyes.',
          successAudio: 'How beautiful! Your fennec is as magnificent as the Algerian desert!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🦊',
        coloringRegions: [
          // Body (large ellipse)
          { id: 'body',      shape: 'ellipse', x: 130, y: 168, size: 66,  size2: 48  },
          // Head (circle)
          { id: 'head',      shape: 'circle',  x: 130, y: 88,  size: 44               },
          // Left big ear (tall ellipse)
          { id: 'ear-left',  shape: 'ellipse', x: 84,  y: 46,  size: 20,  size2: 36  },
          // Right big ear (tall ellipse)
          { id: 'ear-right', shape: 'ellipse', x: 176, y: 46,  size: 20,  size2: 36  },
          // Left eye
          { id: 'eye-left',  shape: 'circle',  x: 112, y: 80,  size: 8                },
          // Right eye
          { id: 'eye-right', shape: 'circle',  x: 148, y: 80,  size: 8                },
          // Nose
          { id: 'nose',      shape: 'ellipse', x: 130, y: 102, size: 10,  size2: 7   },
          // Bushy tail (ellipse angled bottom right)
          { id: 'tail',      shape: 'ellipse', x: 192, y: 192, size: 36,  size2: 18  },
        ],
      },
    },

    // ── Activity 7 ─ Color the Camel (Sahara symbol) ──────────────────────────
    {
      id: 'art-coloring-camel',
      domain: 'creative',
      targetValue: 'camel',
      stepNumber: 7,
      interactionType: 'coloring',
      i18n: {
        ar: {
          title: 'لَوِّنِ الجَمَلَ المَاشِي فِي الصَّحْرَاء',
          promptAudio: 'لَوِّنِ الجَمَلَ! سَفِينَةُ الصَّحْرَاءِ الكَبِيرَة! لَهُ سَنَامٌ يَحْمِلُ المَاء!',
          promptText: 'الجمل يُسمى سفينة الصحراء — يتحمل العطش طويلاً.',
          successAudio: 'جَمَلُكَ رَائِعٌ! سَفِينَةُ صَحْرَائِنَا الجَمِيلَة!',
        },
        fr: {
          title: 'Colorie le Chameau du Sahara',
          promptAudio: 'Colorie le chameau ! Le vaisseau du désert ! Sa bosse garde l\'eau pour le voyage !',
          promptText: 'Le chameau est le vaisseau du désert — il résiste longtemps à la soif.',
          successAudio: 'Ton chameau est superbe ! Le vaisseau de notre beau désert !',
        },
        en: {
          title: 'Color the Sahara Camel',
          promptAudio: 'Color the camel! The ship of the desert! Its hump stores water for long journeys!',
          promptText: 'The camel is the ship of the desert — it endures thirst for a very long time.',
          successAudio: 'Your camel is magnificent! The ship of our beautiful desert!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🐪',
        coloringRegions: [
          // Main body (large ellipse)
          { id: 'body',    shape: 'ellipse', x: 132, y: 168, size: 78,  size2: 46  },
          // Hump (ellipse on top of body)
          { id: 'hump',    shape: 'ellipse', x: 148, y: 114, size: 30,  size2: 32  },
          // Neck (rect connecting head to body)
          { id: 'neck',    shape: 'rect',    x: 108, y: 130, size: 22,  size2: 42  },
          // Head (ellipse)
          { id: 'head',    shape: 'ellipse', x: 106, y: 92,  size: 28,  size2: 22  },
          // Front left leg
          { id: 'leg-fl',  shape: 'rect',    x: 68,  y: 205, size: 18,  size2: 44  },
          // Front right leg
          { id: 'leg-fr',  shape: 'rect',    x: 98,  y: 205, size: 18,  size2: 44  },
          // Back left leg
          { id: 'leg-bl',  shape: 'rect',    x: 152, y: 205, size: 18,  size2: 44  },
          // Back right leg
          { id: 'leg-br',  shape: 'rect',    x: 182, y: 205, size: 18,  size2: 44  },
          // Eye
          { id: 'eye',     shape: 'circle',  x: 93,  y: 83,  size: 7                },
        ],
      },
    },

    // ── Activity 8 ─ Color the Couscous Dish (traditional Algerian food) ──────
    {
      id: 'art-coloring-couscous',
      domain: 'creative',
      targetValue: 'couscous',
      stepNumber: 8,
      interactionType: 'coloring',
      i18n: {
        ar: {
          title: 'لَوِّنْ طَبَقَ الكُسْكُسِ الشَّهِي',
          promptAudio: 'لَوِّنِ الكُسْكُسَ! أَكْلَتُنَا الجَزَائِرِيَّةُ اللَّذِيذَة! البَخَارُ يَعْنِي أَنَّهُ سَاخِن!',
          promptText: 'الكسكس طبق تقليدي جزائري يُحضَّر في الجمعات والأعياد.',
          successAudio: 'يَا سَلَام! طَبَقُكَ شَهِيٌّ! الكُسْكُسُ فَخْرُ مَطْبَخِنَا!',
        },
        fr: {
          title: 'Colorie le Plat de Couscous',
          promptAudio: 'Colorie le couscous ! Notre délicieux plat algérien ! La vapeur montre qu\'il est chaud !',
          promptText: 'Le couscous est un plat traditionnel algérien préparé pour les fêtes et réunions.',
          successAudio: 'Miam ! Ton plat est appétissant ! Le couscous est la fierté de notre cuisine !',
        },
        en: {
          title: 'Color the Couscous Dish',
          promptAudio: 'Color the couscous! Our delicious Algerian dish! The steam shows it is hot!',
          promptText: 'Couscous is a traditional Algerian dish prepared for celebrations and family gatherings.',
          successAudio: 'Yummy! Your dish looks delicious! Couscous is the pride of our cuisine!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🍲',
        coloringRegions: [
          // Pot body
          { id: 'pot',          shape: 'rect',    x: 50,  y: 135, size: 160, size2: 98   },
          // Lid (ellipse on top of pot)
          { id: 'lid',          shape: 'ellipse', x: 130, y: 134, size: 82,  size2: 18   },
          // Lid handle (small circle on center of lid)
          { id: 'lid-handle',   shape: 'circle',  x: 130, y: 116, size: 10               },
          // Couscous visible inside (ellipse)
          { id: 'food',         shape: 'ellipse', x: 130, y: 152, size: 60,  size2: 26   },
          // Steam puff left
          { id: 'steam-left',   shape: 'ellipse', x: 102, y: 95,  size: 12,  size2: 22   },
          // Steam puff center
          { id: 'steam-center', shape: 'ellipse', x: 130, y: 82,  size: 12,  size2: 22   },
          // Steam puff right
          { id: 'steam-right',  shape: 'ellipse', x: 158, y: 95,  size: 12,  size2: 22   },
          // Left handle
          { id: 'handle-left',  shape: 'ellipse', x: 38,  y: 172, size: 16,  size2: 10   },
          // Right handle
          { id: 'handle-right', shape: 'ellipse', x: 222, y: 172, size: 16,  size2: 10   },
        ],
      },
    },
  ],
};
