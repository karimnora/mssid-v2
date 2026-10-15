import type { PreschoolModule } from './types';
import { withRecordedAudio } from './withRecordedAudio';

/** Original thematic transfers, ages 3–5. Existing mechanics keep progress and language isolation. */
const catalogs: PreschoolModule[] = [
  {
    "id": "preschool-discovery-garden",
    "domain": "creative",
    "icon": "🌱",
    "totalSteps": 4,
    "titleI18n": {
      "fr": "Le petit jardin de Didou",
      "ar": "حَدِيقَةُ دِيدُو الصَّغِيرَةُ",
      "en": "Didou’s little garden"
    },
    "activities": [
      {
        "id": "discovery-garden-count",
        "domain": "numbers",
        "targetValue": 3,
        "stepNumber": 1,
        "interactionType": "tap_choice",
        "i18n": {
          "fr": {
            "title": "Je compte",
            "promptAudio": "Combien de fleurs vois-tu ? Touche le bon nombre.",
            "promptText": "Comptez chaque image une seule fois. Reprenez avec de vrais objets.",
            "successAudio": "Bravo ! Raconte ce que tu as trouvé."
          },
          "ar": {
            "title": "أَعُدُّ",
            "promptAudio": "كَمْ زَهْرَةً تَرَى؟ اِلْمَسِ الْعَدَدَ الصَّحِيحَ.",
            "promptText": "نعدّ كل صورة مرة واحدة، ثم نعيد النشاط بأشياء حقيقية.",
            "successAudio": "أَحْسَنْتَ! احْكِ مَا وَجَدْتَ."
          },
          "en": {
            "title": "I count",
            "promptAudio": "How many flowers can you see? Touch the right number.",
            "promptText": "Count each picture once, then try again with real objects.",
            "successAudio": "Well done! Tell someone what you found."
          }
        },
        "visualAssets": {
          "mainSvgOrImage": "discovery:count-flowers",
          "choices": [
            {
              "id": "discovery-garden-2",
              "asset": "2",
              "isCorrect": false
            },
            {
              "id": "discovery-garden-3",
              "asset": "3",
              "isCorrect": true
            },
            {
              "id": "discovery-garden-4",
              "asset": "4",
              "isCorrect": false
            }
          ]
        }
      },
      {
        "id": "discovery-garden-pattern",
        "domain": "creative",
        "targetValue": "🌼",
        "stepNumber": 2,
        "interactionType": "sequence",
        "i18n": {
          "fr": {
            "title": "Je trouve la suite",
            "promptAudio": "Feuille, fleur, feuille, fleur, feuille. Que vient-il ensuite ?",
            "promptText": "Montrez le groupe qui se répète, puis laissez l’enfant choisir.",
            "successAudio": "Bravo ! Raconte ce que tu as trouvé."
          },
          "ar": {
            "title": "أُكْمِلُ النَّمَطَ",
            "promptAudio": "وَرَقَةٌ، زَهْرَةٌ، وَرَقَةٌ، زَهْرَةٌ، وَرَقَةٌ. مَاذَا يَأْتِي بَعْدُ؟",
            "promptText": "أشر إلى المجموعة المتكررة ثم دع الطفل يختار.",
            "successAudio": "أَحْسَنْتَ! احْكِ مَا وَجَدْتَ."
          },
          "en": {
            "title": "I find the pattern",
            "promptAudio": "Leaf, flower, leaf, flower, leaf. What comes next?",
            "promptText": "Point out the repeating group, then let the child choose.",
            "successAudio": "Well done! Tell someone what you found."
          }
        },
        "visualAssets": {
          "mainSvgOrImage": "🌱",
          "sequencePattern": [
            "🌿",
            "🌼",
            "🌿",
            "🌼",
            "🌿"
          ],
          "choices": [
            {
              "id": "discovery-garden-choice-0",
              "asset": "🌿",
              "isCorrect": false
            },
            {
              "id": "discovery-garden-choice-1",
              "asset": "🌼",
              "isCorrect": true
            },
            {
              "id": "discovery-garden-choice-2",
              "asset": "⭐",
              "isCorrect": false
            }
          ]
        }
      },
      {
        "id": "discovery-garden-pairs",
        "domain": "creative",
        "targetValue": "matching",
        "stepNumber": 3,
        "interactionType": "connect_dots",
        "i18n": {
          "fr": {
            "title": "Je retrouve les mêmes",
            "promptAudio": "Touche une image, puis retrouve la même de l’autre côté.",
            "promptText": "Nommer chaque image et observer les détails, sans demander de lire.",
            "successAudio": "Bravo ! Raconte ce que tu as trouvé."
          },
          "ar": {
            "title": "أَجِدُ الْمُتَشَابِهَ",
            "promptAudio": "اِلْمَسْ صُورَةً ثُمَّ ابْحَثْ عَنْ مِثْلِهَا فِي الْجِهَةِ الْأُخْرَى.",
            "promptText": "سمّ الصور ولاحظ تفاصيلها دون طلب القراءة.",
            "successAudio": "أَحْسَنْتَ! احْكِ مَا وَجَدْتَ."
          },
          "en": {
            "title": "I find matching pictures",
            "promptAudio": "Touch a picture, then find the same picture on the other side.",
            "promptText": "Name the pictures and look at the details. No reading is required.",
            "successAudio": "Well done! Tell someone what you found."
          }
        },
        "visualAssets": {
          "mainSvgOrImage": "🌱",
          "connectPairs": [
            {
              "id": "discovery-garden-pair-0",
              "leftAsset": "🌿",
              "rightAsset": "🌿"
            },
            {
              "id": "discovery-garden-pair-1",
              "leftAsset": "🌼",
              "rightAsset": "🌼"
            },
            {
              "id": "discovery-garden-pair-2",
              "leftAsset": "🌻",
              "rightAsset": "🌻"
            }
          ]
        }
      },
      {
        "id": "discovery-garden-story",
        "domain": "creative",
        "targetValue": "order-and-tell",
        "stepNumber": 4,
        "interactionType": "story_order",
        "i18n": {
          "fr": {
            "title": "Je remets en ordre et je raconte",
            "promptAudio": "Touche les images dans l’ordre : planter la graine, arroser, puis voir la plante pousser.",
            "promptText": "Après l’ordre, laissez raconter avec d’abord, puis, enfin. Ce jeu représente une histoire choisie, pas toutes les façons possibles de faire.",
            "successAudio": "Bravo ! Raconte ce que tu as trouvé."
          },
          "ar": {
            "title": "أُرَتِّبُ وَأَحْكِي",
            "promptAudio": "اِلْمَسِ الصُّوَرَ بِالتَّرْتِيبِ: أَزْرَعُ الْبَذْرَةَ، أَسْقِيهَا، ثُمَّ تَنْبُتُ النَّبْتَةُ.",
            "promptText": "بعد الترتيب، دع الطفل يحكي باستعمال أولاً وثم وأخيراً. هذا تسلسل القصة المعروضة.",
            "successAudio": "أَحْسَنْتَ! احْكِ مَا وَجَدْتَ."
          },
          "en": {
            "title": "I put in order and tell",
            "promptAudio": "Touch the pictures in order: plant the seed, water it, then see the plant grow.",
            "promptText": "After ordering, let the child retell using first, next and finally. This is the order of this particular story.",
            "successAudio": "Well done! Tell someone what you found."
          }
        },
        "visualAssets": {
          "mainSvgOrImage": "🌱",
          "storyFrames": [
            {
              "id": "discovery-garden-frame-0",
              "asset": "discovery:seed",
              "caption": {
                "fr": "Je plante",
                "ar": "أَزْرَعُ",
                "en": "I plant"
              },
              "order": 1
            },
            {
              "id": "discovery-garden-frame-1",
              "asset": "discovery:water",
              "caption": {
                "fr": "J’arrose",
                "ar": "أَسْقِي",
                "en": "I water"
              },
              "order": 2
            },
            {
              "id": "discovery-garden-frame-2",
              "asset": "discovery:sprout",
              "caption": {
                "fr": "La plante pousse",
                "ar": "تَنْبُتُ النَّبْتَةُ",
                "en": "The plant grows"
              },
              "order": 3
            }
          ]
        }
      }
    ]
  },
  {
    "id": "preschool-discovery-picnic",
    "domain": "creative",
    "icon": "🧺",
    "totalSteps": 4,
    "titleI18n": {
      "fr": "Le pique-nique des amis",
      "ar": "نُزْهَةُ الْأَصْدِقَاءِ",
      "en": "The friends’ picnic"
    },
    "activities": [
      {
        "id": "discovery-picnic-count",
        "domain": "numbers",
        "targetValue": 4,
        "stepNumber": 1,
        "interactionType": "tap_choice",
        "i18n": {
          "fr": {
            "title": "Je compte",
            "promptAudio": "Compte les pommes. Touche le nombre de pommes.",
            "promptText": "Comptez chaque image une seule fois. Reprenez avec de vrais objets.",
            "successAudio": "Bravo ! Raconte ce que tu as trouvé."
          },
          "ar": {
            "title": "أَعُدُّ",
            "promptAudio": "عُدَّ التُّفَّاحَاتِ. اِلْمَسْ عَدَدَهَا.",
            "promptText": "نعدّ كل صورة مرة واحدة، ثم نعيد النشاط بأشياء حقيقية.",
            "successAudio": "أَحْسَنْتَ! احْكِ مَا وَجَدْتَ."
          },
          "en": {
            "title": "I count",
            "promptAudio": "Count the apples. Touch the number of apples.",
            "promptText": "Count each picture once, then try again with real objects.",
            "successAudio": "Well done! Tell someone what you found."
          }
        },
        "visualAssets": {
          "mainSvgOrImage": "discovery:count-apples",
          "choices": [
            {
              "id": "discovery-picnic-3",
              "asset": "3",
              "isCorrect": false
            },
            {
              "id": "discovery-picnic-4",
              "asset": "4",
              "isCorrect": true
            },
            {
              "id": "discovery-picnic-5",
              "asset": "5",
              "isCorrect": false
            }
          ]
        }
      },
      {
        "id": "discovery-picnic-pattern",
        "domain": "creative",
        "targetValue": "🍐",
        "stepNumber": 2,
        "interactionType": "sequence",
        "i18n": {
          "fr": {
            "title": "Je trouve la suite",
            "promptAudio": "Pomme, poire, poire. Pomme, poire... quel fruit manque ?",
            "promptText": "Montrez le groupe qui se répète, puis laissez l’enfant choisir.",
            "successAudio": "Bravo ! Raconte ce que tu as trouvé."
          },
          "ar": {
            "title": "أُكْمِلُ النَّمَطَ",
            "promptAudio": "تُفَّاحَةٌ، إِجَّاصَةٌ، إِجَّاصَةٌ. تُفَّاحَةٌ، إِجَّاصَةٌ... أَيُّ ثَمَرَةٍ تَنْقُصُ؟",
            "promptText": "أشر إلى المجموعة المتكررة ثم دع الطفل يختار.",
            "successAudio": "أَحْسَنْتَ! احْكِ مَا وَجَدْتَ."
          },
          "en": {
            "title": "I find the pattern",
            "promptAudio": "Apple, pear, pear. Apple, pear... which fruit is missing?",
            "promptText": "Point out the repeating group, then let the child choose.",
            "successAudio": "Well done! Tell someone what you found."
          }
        },
        "visualAssets": {
          "mainSvgOrImage": "🧺",
          "sequencePattern": [
            "🍎",
            "🍐",
            "🍐",
            "🍎",
            "🍐"
          ],
          "choices": [
            {
              "id": "discovery-picnic-choice-0",
              "asset": "🍎",
              "isCorrect": false
            },
            {
              "id": "discovery-picnic-choice-1",
              "asset": "🍐",
              "isCorrect": true
            },
            {
              "id": "discovery-picnic-choice-2",
              "asset": "⭐",
              "isCorrect": false
            }
          ]
        }
      },
      {
        "id": "discovery-picnic-pairs",
        "domain": "creative",
        "targetValue": "matching",
        "stepNumber": 3,
        "interactionType": "connect_dots",
        "i18n": {
          "fr": {
            "title": "Je retrouve les mêmes",
            "promptAudio": "Touche une image, puis retrouve la même de l’autre côté.",
            "promptText": "Nommer chaque image et observer les détails, sans demander de lire.",
            "successAudio": "Bravo ! Raconte ce que tu as trouvé."
          },
          "ar": {
            "title": "أَجِدُ الْمُتَشَابِهَ",
            "promptAudio": "اِلْمَسْ صُورَةً ثُمَّ ابْحَثْ عَنْ مِثْلِهَا فِي الْجِهَةِ الْأُخْرَى.",
            "promptText": "سمّ الصور ولاحظ تفاصيلها دون طلب القراءة.",
            "successAudio": "أَحْسَنْتَ! احْكِ مَا وَجَدْتَ."
          },
          "en": {
            "title": "I find matching pictures",
            "promptAudio": "Touch a picture, then find the same picture on the other side.",
            "promptText": "Name the pictures and look at the details. No reading is required.",
            "successAudio": "Well done! Tell someone what you found."
          }
        },
        "visualAssets": {
          "mainSvgOrImage": "🧺",
          "connectPairs": [
            {
              "id": "discovery-picnic-pair-0",
              "leftAsset": "🍎",
              "rightAsset": "🍎"
            },
            {
              "id": "discovery-picnic-pair-1",
              "leftAsset": "🍐",
              "rightAsset": "🍐"
            },
            {
              "id": "discovery-picnic-pair-2",
              "leftAsset": "🥕",
              "rightAsset": "🥕"
            }
          ]
        }
      },
      {
        "id": "discovery-picnic-story",
        "domain": "creative",
        "targetValue": "order-and-tell",
        "stepNumber": 4,
        "interactionType": "story_order",
        "i18n": {
          "fr": {
            "title": "Je remets en ordre et je raconte",
            "promptAudio": "D’abord, je prends une pomme. Puis je la lave. Enfin, je la mange. Remets les images dans cet ordre.",
            "promptText": "Après l’ordre, laissez raconter avec d’abord, puis, enfin. Ce jeu représente une histoire choisie, pas toutes les façons possibles de faire.",
            "successAudio": "Bravo ! Raconte ce que tu as trouvé."
          },
          "ar": {
            "title": "أُرَتِّبُ وَأَحْكِي",
            "promptAudio": "أَوَّلاً آخُذُ تُفَّاحَةً، ثُمَّ أَغْسِلُهَا، وَأَخِيراً آكُلُهَا. رَتِّبِ الصُّوَرَ.",
            "promptText": "بعد الترتيب، دع الطفل يحكي باستعمال أولاً وثم وأخيراً. هذا تسلسل القصة المعروضة.",
            "successAudio": "أَحْسَنْتَ! احْكِ مَا وَجَدْتَ."
          },
          "en": {
            "title": "I put in order and tell",
            "promptAudio": "First, I take an apple. Next, I wash it. Finally, I eat it. Put the pictures in this order.",
            "promptText": "After ordering, let the child retell using first, next and finally. This is the order of this particular story.",
            "successAudio": "Well done! Tell someone what you found."
          }
        },
        "visualAssets": {
          "mainSvgOrImage": "🧺",
          "storyFrames": [
            {
              "id": "discovery-picnic-frame-0",
              "asset": "discovery:apple",
              "caption": {
                "fr": "Je prends une pomme",
                "ar": "آخُذُ تُفَّاحَةً",
                "en": "I take an apple"
              },
              "order": 1
            },
            {
              "id": "discovery-picnic-frame-1",
              "asset": "discovery:wash",
              "caption": {
                "fr": "Je la lave",
                "ar": "أَغْسِلُهَا",
                "en": "I wash it"
              },
              "order": 2
            },
            {
              "id": "discovery-picnic-frame-2",
              "asset": "discovery:bite",
              "caption": {
                "fr": "Je la mange",
                "ar": "آكُلُهَا",
                "en": "I eat it"
              },
              "order": 3
            }
          ]
        }
      }
    ]
  },
  {
    "id": "preschool-discovery-tiles",
    "domain": "creative",
    "icon": "🔷",
    "totalSteps": 4,
    "titleI18n": {
      "fr": "L’atelier des petits artisans",
      "ar": "وَرْشَةُ الْحِرَفِيِّ الصَّغِيرِ",
      "en": "The little makers’ workshop"
    },
    "activities": [
      {
        "id": "discovery-tiles-count",
        "domain": "numbers",
        "targetValue": 5,
        "stepNumber": 1,
        "interactionType": "tap_choice",
        "i18n": {
          "fr": {
            "title": "Je compte",
            "promptAudio": "Combien de carreaux bleus vois-tu ? Touche le bon nombre.",
            "promptText": "Comptez chaque image une seule fois. Reprenez avec de vrais objets.",
            "successAudio": "Bravo ! Raconte ce que tu as trouvé."
          },
          "ar": {
            "title": "أَعُدُّ",
            "promptAudio": "كَمْ بَلَاطَةً زَرْقَاءَ تَرَى؟ اِلْمَسِ الْعَدَدَ الصَّحِيحَ.",
            "promptText": "نعدّ كل صورة مرة واحدة، ثم نعيد النشاط بأشياء حقيقية.",
            "successAudio": "أَحْسَنْتَ! احْكِ مَا وَجَدْتَ."
          },
          "en": {
            "title": "I count",
            "promptAudio": "How many blue tiles can you see? Touch the right number.",
            "promptText": "Count each picture once, then try again with real objects.",
            "successAudio": "Well done! Tell someone what you found."
          }
        },
        "visualAssets": {
          "mainSvgOrImage": "discovery:count-tiles",
          "choices": [
            {
              "id": "discovery-tiles-4",
              "asset": "4",
              "isCorrect": false
            },
            {
              "id": "discovery-tiles-5",
              "asset": "5",
              "isCorrect": true
            },
            {
              "id": "discovery-tiles-6",
              "asset": "6",
              "isCorrect": false
            }
          ]
        }
      },
      {
        "id": "discovery-tiles-pattern",
        "domain": "creative",
        "targetValue": "🔶",
        "stepNumber": 2,
        "interactionType": "sequence",
        "i18n": {
          "fr": {
            "title": "Je trouve la suite",
            "promptAudio": "Bleu, bleu, orange. Bleu, bleu... quel carreau vient ensuite ?",
            "promptText": "Montrez le groupe qui se répète, puis laissez l’enfant choisir.",
            "successAudio": "Bravo ! Raconte ce que tu as trouvé."
          },
          "ar": {
            "title": "أُكْمِلُ النَّمَطَ",
            "promptAudio": "أَزْرَقُ، أَزْرَقُ، بُرْتُقَالِيٌّ. أَزْرَقُ، أَزْرَقُ... مَا اللَّوْنُ التَّالِي؟",
            "promptText": "أشر إلى المجموعة المتكررة ثم دع الطفل يختار.",
            "successAudio": "أَحْسَنْتَ! احْكِ مَا وَجَدْتَ."
          },
          "en": {
            "title": "I find the pattern",
            "promptAudio": "Blue, blue, orange. Blue, blue... which tile comes next?",
            "promptText": "Point out the repeating group, then let the child choose.",
            "successAudio": "Well done! Tell someone what you found."
          }
        },
        "visualAssets": {
          "mainSvgOrImage": "🔷",
          "sequencePattern": [
            "🔷",
            "🔷",
            "🔶",
            "🔷",
            "🔷"
          ],
          "choices": [
            {
              "id": "discovery-tiles-choice-0",
              "asset": "🔷",
              "isCorrect": false
            },
            {
              "id": "discovery-tiles-choice-1",
              "asset": "🔶",
              "isCorrect": true
            },
            {
              "id": "discovery-tiles-choice-2",
              "asset": "⭐",
              "isCorrect": false
            }
          ]
        }
      },
      {
        "id": "discovery-tiles-pairs",
        "domain": "creative",
        "targetValue": "matching",
        "stepNumber": 3,
        "interactionType": "connect_dots",
        "i18n": {
          "fr": {
            "title": "Je retrouve les mêmes",
            "promptAudio": "Touche une image, puis retrouve la même de l’autre côté.",
            "promptText": "Nommer chaque image et observer les détails, sans demander de lire.",
            "successAudio": "Bravo ! Raconte ce que tu as trouvé."
          },
          "ar": {
            "title": "أَجِدُ الْمُتَشَابِهَ",
            "promptAudio": "اِلْمَسْ صُورَةً ثُمَّ ابْحَثْ عَنْ مِثْلِهَا فِي الْجِهَةِ الْأُخْرَى.",
            "promptText": "سمّ الصور ولاحظ تفاصيلها دون طلب القراءة.",
            "successAudio": "أَحْسَنْتَ! احْكِ مَا وَجَدْتَ."
          },
          "en": {
            "title": "I find matching pictures",
            "promptAudio": "Touch a picture, then find the same picture on the other side.",
            "promptText": "Name the pictures and look at the details. No reading is required.",
            "successAudio": "Well done! Tell someone what you found."
          }
        },
        "visualAssets": {
          "mainSvgOrImage": "🔷",
          "connectPairs": [
            {
              "id": "discovery-tiles-pair-0",
              "leftAsset": "🔷",
              "rightAsset": "🔷"
            },
            {
              "id": "discovery-tiles-pair-1",
              "leftAsset": "🔶",
              "rightAsset": "🔶"
            },
            {
              "id": "discovery-tiles-pair-2",
              "leftAsset": "🔺",
              "rightAsset": "🔺"
            }
          ]
        }
      },
      {
        "id": "discovery-tiles-story",
        "domain": "creative",
        "targetValue": "order-and-tell",
        "stepNumber": 4,
        "interactionType": "story_order",
        "i18n": {
          "fr": {
            "title": "Je remets en ordre et je raconte",
            "promptAudio": "L’artisan prend de la terre. Il fabrique un carreau. Puis il assemble une mosaïque. Range les trois images.",
            "promptText": "Après l’ordre, laissez raconter avec d’abord, puis, enfin. Ce jeu représente une histoire choisie, pas toutes les façons possibles de faire.",
            "successAudio": "Bravo ! Raconte ce que tu as trouvé."
          },
          "ar": {
            "title": "أُرَتِّبُ وَأَحْكِي",
            "promptAudio": "يَأْخُذُ الْحِرَفِيُّ طِيناً، وَيَصْنَعُ بَلَاطَةً، ثُمَّ يُرَكِّبُ فُسَيْفَسَاءَ. رَتِّبِ الصُّوَرَ الثَّلَاثَ.",
            "promptText": "بعد الترتيب، دع الطفل يحكي باستعمال أولاً وثم وأخيراً. هذا تسلسل القصة المعروضة.",
            "successAudio": "أَحْسَنْتَ! احْكِ مَا وَجَدْتَ."
          },
          "en": {
            "title": "I put in order and tell",
            "promptAudio": "The maker takes clay. He makes a tile. Then he puts tiles together in a mosaic. Put the three pictures in order.",
            "promptText": "After ordering, let the child retell using first, next and finally. This is the order of this particular story.",
            "successAudio": "Well done! Tell someone what you found."
          }
        },
        "visualAssets": {
          "mainSvgOrImage": "🔷",
          "storyFrames": [
            {
              "id": "discovery-tiles-frame-0",
              "asset": "discovery:clay",
              "caption": {
                "fr": "La terre",
                "ar": "الطِّينُ",
                "en": "Clay"
              },
              "order": 1
            },
            {
              "id": "discovery-tiles-frame-1",
              "asset": "discovery:tile",
              "caption": {
                "fr": "Le carreau fabriqué",
                "ar": "الْبَلَاطَةُ الْمَصْنُوعَةُ",
                "en": "The finished tile"
              },
              "order": 2
            },
            {
              "id": "discovery-tiles-frame-2",
              "asset": "discovery:mosaic",
              "caption": {
                "fr": "La mosaïque assemblée",
                "ar": "الْفُسَيْفَسَاءُ الْمُرَكَّبَةُ",
                "en": "The assembled mosaic"
              },
              "order": 3
            }
          ]
        }
      }
    ]
  }
];
export const DISCOVERY_MODULES = catalogs.map(withRecordedAudio);
