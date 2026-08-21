import { PreschoolModule } from './types';

/**
 * "أَلْعَابُ الحَرَكَةِ وَالتَّرْكِيزِ" — Movement & focus (8 short games).
 * No fruit/veg or clothes sorts (already in Aliments / Saisons).
 * Mazes show the real goal (carrot, island, nest).
 */
export const ARCADE_GAMES_MODULE: PreschoolModule = {
  id: 'preschool-arcade-games',
  domain: 'creative',
  icon: '🎮',
  totalSteps: 8,
  titleI18n: {
    ar: 'أَلْعَابُ الحَرَكَةِ وَالتَّرْكِيزِ',
    fr: 'Jeux de Mouvement et Concentration',
    en: 'Movement & Focus Games',
  },
  activities: [
    {
      id: 'arcade-maze-rabbit',
      domain: 'creative',
      targetValue: 'rabbit',
      stepNumber: 1,
      interactionType: 'maze',
      i18n: {
        ar: {
          title: 'الأَرْنَبُ إِلَى الجَزَرَة',
          promptAudio: 'اِسْحَبِ الأَرْنَبَ حَتَّى الجَزَرَة!',
          promptText: 'الهدف جزرة، ليس علماً.',
          successAudio: 'وَجَدَ الأَرْنَبُ جَزَرَتَهُ!',
        },
        fr: {
          title: 'Le Lapin vers la Carotte',
          promptAudio: 'Glisse le lapin jusqu\'à la carotte !',
          promptText: 'L\'arrivée est une carotte.',
          successAudio: 'Le lapin a trouvé sa carotte !',
        },
        en: {
          title: 'Rabbit to the Carrot',
          promptAudio: 'Drag the rabbit all the way to the carrot!',
          promptText: 'The goal is a carrot.',
          successAudio: 'The rabbit found its carrot!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🐰',
        mazeTravelerAsset: '🐰',
        mazeGoalAsset: '🥕',
        mazeWaypoints: [
          { x: 20, y: 20 },
          { x: 70, y: 70 },
          { x: 50, y: 140 },
          { x: 120, y: 180 },
          { x: 190, y: 150 },
          { x: 235, y: 230 },
        ],
      },
    },
    {
      id: 'arcade-maze-boat',
      domain: 'creative',
      targetValue: 'boat',
      stepNumber: 2,
      interactionType: 'maze',
      i18n: {
        ar: {
          title: 'القَارِبُ إِلَى الجَزِيرَة',
          promptAudio: 'اِسْحَبِ القَارِبَ فَوْقَ المَوْجِ حَتَّى الجَزِيرَة!',
          promptText: 'الهدف جزيرة.',
          successAudio: 'وَصَلَ القَارِبُ إِلَى الجَزِيرَة!',
        },
        fr: {
          title: 'Le Bateau vers l\'Île',
          promptAudio: 'Glisse le bateau sur les vagues jusqu\'à l\'île !',
          promptText: 'L\'arrivée est une île.',
          successAudio: 'Le bateau est arrivé à l\'île !',
        },
        en: {
          title: 'Boat to the Island',
          promptAudio: 'Drag the boat over the waves to the island!',
          promptText: 'The goal is an island.',
          successAudio: 'The boat reached the island!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '⛵',
        mazeTravelerAsset: '⛵',
        mazeGoalAsset: '🏝️',
        mazeWaypoints: [
          { x: 15, y: 130 },
          { x: 70, y: 90 },
          { x: 130, y: 150 },
          { x: 180, y: 100 },
          { x: 220, y: 160 },
          { x: 240, y: 60 },
        ],
      },
    },
    {
      id: 'arcade-maze-bird',
      domain: 'creative',
      targetValue: 'bird',
      stepNumber: 3,
      interactionType: 'maze',
      i18n: {
        ar: {
          title: 'العُصْفُورُ إِلَى العُش',
          promptAudio: 'اِسْحَبِ العُصْفُورَ فِي السَّمَاءِ حَتَّى العُش!',
          promptText: 'الهدف عش.',
          successAudio: 'العُصْفُورُ فِي عُشِّهِ!',
        },
        fr: {
          title: 'L\'Oiseau vers le Nid',
          promptAudio: 'Glisse l\'oiseau dans le ciel jusqu\'au nid !',
          promptText: 'L\'arrivée est un nid.',
          successAudio: 'L\'oiseau est dans son nid !',
        },
        en: {
          title: 'Bird to the Nest',
          promptAudio: 'Drag the bird through the sky to the nest!',
          promptText: 'The goal is a nest.',
          successAudio: 'The bird is in its nest!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🐦',
        mazeTravelerAsset: '🐦',
        mazeGoalAsset: '🪺',
        mazeWaypoints: [
          { x: 230, y: 20 },
          { x: 170, y: 60 },
          { x: 190, y: 130 },
          { x: 110, y: 150 },
          { x: 70, y: 110 },
          { x: 20, y: 220 },
        ],
      },
    },
    {
      id: 'arcade-drag-apples',
      domain: 'creative',
      targetValue: 'apples',
      stepNumber: 4,
      interactionType: 'drag_drop',
      i18n: {
        ar: {
          title: 'التُّفَّاحُ فِي السَّلَّة',
          promptAudio: 'اِسْحَبْ كُلَّ تُفَّاحَةٍ إِلَى السَّلَّة!',
          promptText: 'أربع تفاحات — ليس أكثر.',
          successAudio: 'السَّلَّةُ مَلآنَة!',
        },
        fr: {
          title: 'Les Pommes dans le Panier',
          promptAudio: 'Glisse chaque pomme dans le panier !',
          promptText: 'Quatre pommes seulement.',
          successAudio: 'Le panier est plein !',
        },
        en: {
          title: 'Apples in the Basket',
          promptAudio: 'Drag each apple into the basket!',
          promptText: 'Four apples only.',
          successAudio: 'The basket is full!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🧺',
        dragItems: [
          { id: 'apple1', asset: '🍎' },
          { id: 'apple2', asset: '🍎' },
          { id: 'apple3', asset: '🍎' },
          { id: 'apple4', asset: '🍎' },
        ],
        dropZoneCount: 4,
      },
    },
    {
      id: 'arcade-drag-stars',
      domain: 'creative',
      targetValue: 'stars',
      stepNumber: 5,
      interactionType: 'drag_drop',
      i18n: {
        ar: {
          title: 'النُّجُومُ فِي الجَرَّة',
          promptAudio: 'اِسْحَبْ كُلَّ نَجْمَةٍ إِلَى الجَرَّة!',
          promptText: 'ثلاث نجوم — أسهل من خمس على شاشة صغيرة.',
          successAudio: 'الجَرَّةُ تُضِيء!',
        },
        fr: {
          title: 'Les Étoiles dans le Bocal',
          promptAudio: 'Glisse chaque étoile dans le bocal !',
          promptText: 'Trois étoiles — plus lisible que cinq.',
          successAudio: 'Le bocal brille !',
        },
        en: {
          title: 'Stars in the Jar',
          promptAudio: 'Drag each star into the jar!',
          promptText: 'Three stars — easier than five on a small screen.',
          successAudio: 'The jar shines!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🫙',
        dragItems: [
          { id: 'star1', asset: '⭐' },
          { id: 'star2', asset: '⭐' },
          { id: 'star3', asset: '⭐' },
        ],
        dropZoneCount: 3,
      },
    },
    {
      id: 'arcade-sort-sky-land',
      domain: 'creative',
      targetValue: 'sky_land',
      stepNumber: 6,
      interactionType: 'sorting',
      i18n: {
        ar: {
          title: 'يَطِيرُ أَمْ يَمْشِي؟',
          promptAudio: 'ضَعِ العُصْفُورَ وَالفَرَاشَةَ مَعَ الغَيْمَة، وَالكَلْبَ وَالخَرُوفَ مَعَ الشَّجَرَة!',
          promptText: 'يطير: عصفور، فراشة، نحلة. يمشي: كلب، خروف، قط.',
          successAudio: 'تَعْرِفُ مَنْ يَطِيرُ وَمَنْ يَمْشِي!',
        },
        fr: {
          title: 'Il Vole ou Il Marche ?',
          promptAudio: 'Mets l\'oiseau et le papillon avec le nuage, le chien et le mouton avec l\'arbre !',
          promptText: 'Vole : oiseau, papillon, abeille. Marche : chien, mouton, chat.',
          successAudio: 'Tu sais qui vole et qui marche !',
        },
        en: {
          title: 'Does It Fly or Walk?',
          promptAudio: 'Put the bird and the butterfly with the cloud, the dog and the sheep with the tree!',
          promptText: 'Fly: bird, butterfly, bee. Walk: dog, sheep, cat.',
          successAudio: 'You know who flies and who walks!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🌤️',
        sortBins: [
          { id: 'sky_bin', labelAsset: '☁️' },
          { id: 'land_bin', labelAsset: '🌳' },
        ],
        sortItems: [
          { id: 'bird1', asset: '🐦', correctBinId: 'sky_bin' },
          { id: 'butterfly1', asset: '🦋', correctBinId: 'sky_bin' },
          { id: 'bee1', asset: '🐝', correctBinId: 'sky_bin' },
          { id: 'dog1', asset: '🐶', correctBinId: 'land_bin' },
          { id: 'sheep1', asset: '🐑', correctBinId: 'land_bin' },
          { id: 'cat1', asset: '🐱', correctBinId: 'land_bin' },
        ],
      },
    },
    {
      id: 'arcade-sort-vehicles',
      domain: 'creative',
      targetValue: 'vehicles',
      stepNumber: 7,
      interactionType: 'sorting',
      i18n: {
        ar: {
          title: 'سِمَاءٌ أَمْ طَرِيق؟',
          promptAudio: 'ضَعِ الطَّائِرَةَ مَعَ الغَيْمَة، وَالسَّيَّارَةَ مَعَ الطَّرِيق!',
          promptText: 'سماء: طائرة، مروحية. طريق: سيارة، حافلة، دراجة.',
          successAudio: 'تَعْرِفُ مَرْكَبَاتِ السَّمَاءِ وَالطَّرِيق!',
        },
        fr: {
          title: 'Ciel ou Route ?',
          promptAudio: 'Mets l\'avion avec le nuage, et la voiture avec la route !',
          promptText: 'Ciel : avion, hélico. Route : voiture, bus, vélo.',
          successAudio: 'Tu connais les véhicules du ciel et de la route !',
        },
        en: {
          title: 'Sky or Road?',
          promptAudio: 'Put the plane with the cloud, and the car with the road!',
          promptText: 'Sky: plane, helicopter. Road: car, bus, bike.',
          successAudio: 'You know sky vehicles and road vehicles!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🚦',
        sortBins: [
          { id: 'sky_vehicle_bin', labelAsset: '☁️' },
          { id: 'road_vehicle_bin', labelAsset: '🛣️' },
        ],
        sortItems: [
          { id: 'plane1', asset: '✈️', correctBinId: 'sky_vehicle_bin' },
          { id: 'helicopter1', asset: '🚁', correctBinId: 'sky_vehicle_bin' },
          { id: 'car1', asset: '🚗', correctBinId: 'road_vehicle_bin' },
          { id: 'bus1', asset: '🚌', correctBinId: 'road_vehicle_bin' },
          { id: 'bike1', asset: '🚲', correctBinId: 'road_vehicle_bin' },
        ],
      },
    },
    {
      id: 'arcade-click-boat',
      domain: 'creative',
      targetValue: 'boat-tap',
      stepNumber: 8,
      interactionType: 'tap_choice',
      i18n: {
        ar: {
          title: 'مَنْ يَسِيرُ عَلَى المَاء؟',
          promptAudio: 'اِلْمَسِ القَارِب! القَارِبُ يَسِيرُ عَلَى البَحْر!',
          promptText: 'قارب ≠ سيارة ≠ صاروخ.',
          successAudio: 'القَارِبُ عَلَى المَاء! أَحْسَنْت!',
        },
        fr: {
          title: 'Qui Navigue sur l\'Eau ?',
          promptAudio: 'Touche le bateau ! Le bateau avance sur la mer !',
          promptText: 'Bateau ≠ voiture ≠ fusée.',
          successAudio: 'Le bateau sur l\'eau ! Bravo !',
        },
        en: {
          title: 'Who Sails on Water?',
          promptAudio: 'Touch the boat! The boat sails on the sea!',
          promptText: 'Boat ≠ car ≠ rocket.',
          successAudio: 'The boat on the water! Well done!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '⛵',
        choices: [
          { id: 'boat', asset: '⛵', isCorrect: true },
          { id: 'car', asset: '🚗', isCorrect: false },
          { id: 'rocket', asset: '🚀', isCorrect: false },
        ],
      },
    },
  ],
};
