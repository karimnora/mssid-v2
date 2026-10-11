import type { PreschoolLanguage } from './types';

// Prepared from the supplied ElevenLabs recordings. Keep languages isolated.
export const LETTER_AUDIO_CLIPS: Partial<Record<PreschoolLanguage, Record<string, { prompt: string; success: string; successDurationMs: number }>>> = {
  "fr": {
    "letters-alif-rabbit": {
      "prompt": "/sounds/preschool/fr/letters-alif-rabbit-prompt.mp3",
      "success": "/sounds/preschool/fr/letters-alif-rabbit-success.mp3",
      "successDurationMs": 3080
    },
    "letters-boat-alif-baa": {
      "prompt": "/sounds/preschool/fr/letters-boat-alif-baa-prompt.mp3",
      "success": "/sounds/preschool/fr/letters-boat-alif-baa-success.mp3",
      "successDurationMs": 2475
    },
    "letters-trace-alif": {
      "prompt": "/sounds/preschool/fr/letters-trace-alif-prompt.mp3",
      "success": "/sounds/preschool/fr/letters-trace-alif-success.mp3",
      "successDurationMs": 2665
    },
    "letters-taa-apple": {
      "prompt": "/sounds/preschool/fr/letters-taa-apple-prompt.mp3",
      "success": "/sounds/preschool/fr/letters-taa-apple-success.mp3",
      "successDurationMs": 2375
    },
    "letters-thaa-fox": {
      "prompt": "/sounds/preschool/fr/letters-thaa-fox-prompt.mp3",
      "success": "/sounds/preschool/fr/letters-thaa-fox-success.mp3",
      "successDurationMs": 2715
    },
    "letters-jeem-camel": {
      "prompt": "/sounds/preschool/fr/letters-jeem-camel-prompt.mp3",
      "success": "/sounds/preschool/fr/letters-jeem-camel-success.mp3",
      "successDurationMs": 2395
    },
    "letters-trace-jeem": {
      "prompt": "/sounds/preschool/fr/letters-trace-jeem-prompt.mp3",
      "success": "/sounds/preschool/fr/letters-trace-jeem-success.mp3",
      "successDurationMs": 2730
    },
    "letters-dal-bear": {
      "prompt": "/sounds/preschool/fr/letters-dal-bear-prompt.mp3",
      "success": "/sounds/preschool/fr/letters-dal-bear-success.mp3",
      "successDurationMs": 2560
    },
    "letters-trace-baa": {
      "prompt": "/sounds/preschool/fr/letters-trace-baa-prompt.mp3",
      "success": "/sounds/preschool/fr/letters-trace-baa-success.mp3",
      "successDurationMs": 2685
    },
    "letters-seen-fish": {
      "prompt": "/sounds/preschool/fr/letters-seen-fish-prompt.mp3",
      "success": "/sounds/preschool/fr/letters-seen-fish-success.mp3",
      "successDurationMs": 2525
    },
    "letters-meem-banana": {
      "prompt": "/sounds/preschool/fr/letters-meem-banana-prompt.mp3",
      "success": "/sounds/preschool/fr/letters-meem-banana-success.mp3",
      "successDurationMs": 2385
    },
    "letters-trace-meem": {
      "prompt": "/sounds/preschool/fr/letters-trace-meem-prompt.mp3",
      "success": "/sounds/preschool/fr/letters-trace-meem-success.mp3",
      "successDurationMs": 2610
    },
    "letters-fruit-basket": {
      "prompt": "/sounds/preschool/fr/letters-fruit-basket-prompt.mp3",
      "success": "/sounds/preschool/fr/letters-fruit-basket-success.mp3",
      "successDurationMs": 2940
    },
    "letters-match-words": {
      "prompt": "/sounds/preschool/fr/letters-match-words-prompt.mp3",
      "success": "/sounds/preschool/fr/letters-match-words-success.mp3",
      "successDurationMs": 2780
    },
    "letters-haa-milk": {
      "prompt": "/sounds/preschool/fr/letters-haa-milk-prompt.mp3",
      "success": "/sounds/preschool/fr/letters-haa-milk-success.mp3",
      "successDurationMs": 2345
    },
    "letters-khaa-bread": {
      "prompt": "/sounds/preschool/fr/letters-khaa-bread-prompt.mp3",
      "success": "/sounds/preschool/fr/letters-khaa-bread-success.mp3",
      "successDurationMs": 2585
    },
    "letters-thal-wolf": {
      "prompt": "/sounds/preschool/fr/letters-thal-wolf-prompt.mp3",
      "success": "/sounds/preschool/fr/letters-thal-wolf-success.mp3",
      "successDurationMs": 2240
    },
    "letters-raa-feather": {
      "prompt": "/sounds/preschool/fr/letters-raa-feather-prompt.mp3",
      "success": "/sounds/preschool/fr/letters-raa-feather-success.mp3",
      "successDurationMs": 2225
    },
    "letters-zay-giraffe": {
      "prompt": "/sounds/preschool/fr/letters-zay-giraffe-prompt.mp3",
      "success": "/sounds/preschool/fr/letters-zay-giraffe-success.mp3",
      "successDurationMs": 2360
    },
    "letters-trace-raa": {
      "prompt": "/sounds/preschool/fr/letters-trace-raa-prompt.mp3",
      "success": "/sounds/preschool/fr/letters-trace-raa-success.mp3",
      "successDurationMs": 2710
    },
    "letters-sheen-sun": {
      "prompt": "/sounds/preschool/fr/letters-sheen-sun-prompt.mp3",
      "success": "/sounds/preschool/fr/letters-sheen-sun-success.mp3",
      "successDurationMs": 2235
    },
    "letters-sad-falcon": {
      "prompt": "/sounds/preschool/fr/letters-sad-falcon-prompt.mp3",
      "success": "/sounds/preschool/fr/letters-sad-falcon-success.mp3",
      "successDurationMs": 2350
    },
    "letters-dad-frog": {
      "prompt": "/sounds/preschool/fr/letters-dad-frog-prompt.mp3",
      "success": "/sounds/preschool/fr/letters-dad-frog-success.mp3",
      "successDurationMs": 2445
    },
    "letters-trace-sad": {
      "prompt": "/sounds/preschool/fr/letters-trace-sad-prompt.mp3",
      "success": "/sounds/preschool/fr/letters-trace-sad-success.mp3",
      "successDurationMs": 2705
    },
    "letters-taa2-peacock": {
      "prompt": "/sounds/preschool/fr/letters-taa2-peacock-prompt.mp3",
      "success": "/sounds/preschool/fr/letters-taa2-peacock-success.mp3",
      "successDurationMs": 2385
    },
    "letters-za-gazelle": {
      "prompt": "/sounds/preschool/fr/letters-za-gazelle-prompt.mp3",
      "success": "/sounds/preschool/fr/letters-za-gazelle-success.mp3",
      "successDurationMs": 2615
    },
    "letters-ayn-bird": {
      "prompt": "/sounds/preschool/fr/letters-ayn-bird-prompt.mp3",
      "success": "/sounds/preschool/fr/letters-ayn-bird-success.mp3",
      "successDurationMs": 2265
    },
    "letters-ghayn-sheep": {
      "prompt": "/sounds/preschool/fr/letters-ghayn-sheep-prompt.mp3",
      "success": "/sounds/preschool/fr/letters-ghayn-sheep-success.mp3",
      "successDurationMs": 2300
    },
    "letters-faa-elephant": {
      "prompt": "/sounds/preschool/fr/letters-faa-elephant-prompt.mp3",
      "success": "/sounds/preschool/fr/letters-faa-elephant-success.mp3",
      "successDurationMs": 2400
    },
    "letters-trace-faa": {
      "prompt": "/sounds/preschool/fr/letters-trace-faa-prompt.mp3",
      "success": "/sounds/preschool/fr/letters-trace-faa-success.mp3",
      "successDurationMs": 2585
    },
    "letters-qaf-monkey": {
      "prompt": "/sounds/preschool/fr/letters-qaf-monkey-prompt.mp3",
      "success": "/sounds/preschool/fr/letters-qaf-monkey-success.mp3",
      "successDurationMs": 2215
    },
    "letters-kaf-dog": {
      "prompt": "/sounds/preschool/fr/letters-kaf-dog-prompt.mp3",
      "success": "/sounds/preschool/fr/letters-kaf-dog-success.mp3",
      "successDurationMs": 2180
    },
    "letters-lam-lemon": {
      "prompt": "/sounds/preschool/fr/letters-lam-lemon-prompt.mp3",
      "success": "/sounds/preschool/fr/letters-lam-lemon-success.mp3",
      "successDurationMs": 2805
    },
    "letters-trace-lam": {
      "prompt": "/sounds/preschool/fr/letters-trace-lam-prompt.mp3",
      "success": "/sounds/preschool/fr/letters-trace-lam-success.mp3",
      "successDurationMs": 2820
    },
    "letters-noon-bee": {
      "prompt": "/sounds/preschool/fr/letters-noon-bee-prompt.mp3",
      "success": "/sounds/preschool/fr/letters-noon-bee-success.mp3",
      "successDurationMs": 2710
    },
    "letters-haa2-moon": {
      "prompt": "/sounds/preschool/fr/letters-haa2-moon-prompt.mp3",
      "success": "/sounds/preschool/fr/letters-haa2-moon-success.mp3",
      "successDurationMs": 2560
    },
    "letters-waw-rose": {
      "prompt": "/sounds/preschool/fr/letters-waw-rose-prompt.mp3",
      "success": "/sounds/preschool/fr/letters-waw-rose-success.mp3",
      "successDurationMs": 2685
    },
    "letters-trace-waw": {
      "prompt": "/sounds/preschool/fr/letters-trace-waw-prompt.mp3",
      "success": "/sounds/preschool/fr/letters-trace-waw-success.mp3",
      "successDurationMs": 2655
    },
    "letters-yaa-hand": {
      "prompt": "/sounds/preschool/fr/letters-yaa-hand-prompt.mp3",
      "success": "/sounds/preschool/fr/letters-yaa-hand-success.mp3",
      "successDurationMs": 2340
    },
    "letters-rhyme-sort": {
      "prompt": "/sounds/preschool/fr/letters-rhyme-sort-prompt.mp3",
      "success": "/sounds/preschool/fr/letters-rhyme-sort-success.mp3",
      "successDurationMs": 2970
    },
    "letters-match-words-2": {
      "prompt": "/sounds/preschool/fr/letters-match-words-2-prompt.mp3",
      "success": "/sounds/preschool/fr/letters-match-words-2-success.mp3",
      "successDurationMs": 2390
    },
    "letters-listen-faa": {
      "prompt": "/sounds/preschool/fr/letters-listen-faa-prompt.mp3",
      "success": "/sounds/preschool/fr/letters-listen-faa-success.mp3",
      "successDurationMs": 3064
    }
  },
  "ar": {
    "letters-alif-rabbit": {
      "prompt": "/sounds/preschool/ar/letters-alif-rabbit-prompt.mp3",
      "success": "/sounds/preschool/ar/letters-alif-rabbit-success.mp3",
      "successDurationMs": 3365
    },
    "letters-boat-alif-baa": {
      "prompt": "/sounds/preschool/ar/letters-boat-alif-baa-prompt.mp3",
      "success": "/sounds/preschool/ar/letters-boat-alif-baa-success.mp3",
      "successDurationMs": 3520
    },
    "letters-trace-alif": {
      "prompt": "/sounds/preschool/ar/letters-trace-alif-prompt.mp3",
      "success": "/sounds/preschool/ar/letters-trace-alif-success.mp3",
      "successDurationMs": 2840
    },
    "letters-taa-apple": {
      "prompt": "/sounds/preschool/ar/letters-taa-apple-prompt.mp3",
      "success": "/sounds/preschool/ar/letters-taa-apple-success.mp3",
      "successDurationMs": 3190
    },
    "letters-thaa-fox": {
      "prompt": "/sounds/preschool/ar/letters-thaa-fox-prompt.mp3",
      "success": "/sounds/preschool/ar/letters-thaa-fox-success.mp3",
      "successDurationMs": 3450
    },
    "letters-jeem-camel": {
      "prompt": "/sounds/preschool/ar/letters-jeem-camel-prompt.mp3",
      "success": "/sounds/preschool/ar/letters-jeem-camel-success.mp3",
      "successDurationMs": 2805
    },
    "letters-trace-jeem": {
      "prompt": "/sounds/preschool/ar/letters-trace-jeem-prompt.mp3",
      "success": "/sounds/preschool/ar/letters-trace-jeem-success.mp3",
      "successDurationMs": 3030
    },
    "letters-dal-bear": {
      "prompt": "/sounds/preschool/ar/letters-dal-bear-prompt.mp3",
      "success": "/sounds/preschool/ar/letters-dal-bear-success.mp3",
      "successDurationMs": 2400
    },
    "letters-trace-baa": {
      "prompt": "/sounds/preschool/ar/letters-trace-baa-prompt.mp3",
      "success": "/sounds/preschool/ar/letters-trace-baa-success.mp3",
      "successDurationMs": 2840
    },
    "letters-seen-fish": {
      "prompt": "/sounds/preschool/ar/letters-seen-fish-prompt.mp3",
      "success": "/sounds/preschool/ar/letters-seen-fish-success.mp3",
      "successDurationMs": 3365
    },
    "letters-meem-banana": {
      "prompt": "/sounds/preschool/ar/letters-meem-banana-prompt.mp3",
      "success": "/sounds/preschool/ar/letters-meem-banana-success.mp3",
      "successDurationMs": 3495
    },
    "letters-trace-meem": {
      "prompt": "/sounds/preschool/ar/letters-trace-meem-prompt.mp3",
      "success": "/sounds/preschool/ar/letters-trace-meem-success.mp3",
      "successDurationMs": 2965
    },
    "letters-fruit-basket": {
      "prompt": "/sounds/preschool/ar/letters-fruit-basket-prompt.mp3",
      "success": "/sounds/preschool/ar/letters-fruit-basket-success.mp3",
      "successDurationMs": 3875
    },
    "letters-match-words": {
      "prompt": "/sounds/preschool/ar/letters-match-words-prompt.mp3",
      "success": "/sounds/preschool/ar/letters-match-words-success.mp3",
      "successDurationMs": 3400
    },
    "letters-haa-milk": {
      "prompt": "/sounds/preschool/ar/letters-haa-milk-prompt.mp3",
      "success": "/sounds/preschool/ar/letters-haa-milk-success.mp3",
      "successDurationMs": 2830
    },
    "letters-khaa-bread": {
      "prompt": "/sounds/preschool/ar/letters-khaa-bread-prompt.mp3",
      "success": "/sounds/preschool/ar/letters-khaa-bread-success.mp3",
      "successDurationMs": 2325
    },
    "letters-thal-wolf": {
      "prompt": "/sounds/preschool/ar/letters-thal-wolf-prompt.mp3",
      "success": "/sounds/preschool/ar/letters-thal-wolf-success.mp3",
      "successDurationMs": 2590
    },
    "letters-raa-feather": {
      "prompt": "/sounds/preschool/ar/letters-raa-feather-prompt.mp3",
      "success": "/sounds/preschool/ar/letters-raa-feather-success.mp3",
      "successDurationMs": 2905
    },
    "letters-zay-giraffe": {
      "prompt": "/sounds/preschool/ar/letters-zay-giraffe-prompt.mp3",
      "success": "/sounds/preschool/ar/letters-zay-giraffe-success.mp3",
      "successDurationMs": 3435
    },
    "letters-trace-raa": {
      "prompt": "/sounds/preschool/ar/letters-trace-raa-prompt.mp3",
      "success": "/sounds/preschool/ar/letters-trace-raa-success.mp3",
      "successDurationMs": 2880
    },
    "letters-sheen-sun": {
      "prompt": "/sounds/preschool/ar/letters-sheen-sun-prompt.mp3",
      "success": "/sounds/preschool/ar/letters-sheen-sun-success.mp3",
      "successDurationMs": 2855
    },
    "letters-sad-falcon": {
      "prompt": "/sounds/preschool/ar/letters-sad-falcon-prompt.mp3",
      "success": "/sounds/preschool/ar/letters-sad-falcon-success.mp3",
      "successDurationMs": 3320
    },
    "letters-dad-frog": {
      "prompt": "/sounds/preschool/ar/letters-dad-frog-prompt.mp3",
      "success": "/sounds/preschool/ar/letters-dad-frog-success.mp3",
      "successDurationMs": 2915
    },
    "letters-trace-sad": {
      "prompt": "/sounds/preschool/ar/letters-trace-sad-prompt.mp3",
      "success": "/sounds/preschool/ar/letters-trace-sad-success.mp3",
      "successDurationMs": 3040
    },
    "letters-taa2-peacock": {
      "prompt": "/sounds/preschool/ar/letters-taa2-peacock-prompt.mp3",
      "success": "/sounds/preschool/ar/letters-taa2-peacock-success.mp3",
      "successDurationMs": 3295
    },
    "letters-za-gazelle": {
      "prompt": "/sounds/preschool/ar/letters-za-gazelle-prompt.mp3",
      "success": "/sounds/preschool/ar/letters-za-gazelle-success.mp3",
      "successDurationMs": 2910
    },
    "letters-ayn-bird": {
      "prompt": "/sounds/preschool/ar/letters-ayn-bird-prompt.mp3",
      "success": "/sounds/preschool/ar/letters-ayn-bird-success.mp3",
      "successDurationMs": 3440
    },
    "letters-ghayn-sheep": {
      "prompt": "/sounds/preschool/ar/letters-ghayn-sheep-prompt.mp3",
      "success": "/sounds/preschool/ar/letters-ghayn-sheep-success.mp3",
      "successDurationMs": 2815
    },
    "letters-faa-elephant": {
      "prompt": "/sounds/preschool/ar/letters-faa-elephant-prompt.mp3",
      "success": "/sounds/preschool/ar/letters-faa-elephant-success.mp3",
      "successDurationMs": 3120
    },
    "letters-trace-faa": {
      "prompt": "/sounds/preschool/ar/letters-trace-faa-prompt.mp3",
      "success": "/sounds/preschool/ar/letters-trace-faa-success.mp3",
      "successDurationMs": 3180
    },
    "letters-qaf-monkey": {
      "prompt": "/sounds/preschool/ar/letters-qaf-monkey-prompt.mp3",
      "success": "/sounds/preschool/ar/letters-qaf-monkey-success.mp3",
      "successDurationMs": 2675
    },
    "letters-kaf-dog": {
      "prompt": "/sounds/preschool/ar/letters-kaf-dog-prompt.mp3",
      "success": "/sounds/preschool/ar/letters-kaf-dog-success.mp3",
      "successDurationMs": 2805
    },
    "letters-lam-lemon": {
      "prompt": "/sounds/preschool/ar/letters-lam-lemon-prompt.mp3",
      "success": "/sounds/preschool/ar/letters-lam-lemon-success.mp3",
      "successDurationMs": 3100
    },
    "letters-trace-lam": {
      "prompt": "/sounds/preschool/ar/letters-trace-lam-prompt.mp3",
      "success": "/sounds/preschool/ar/letters-trace-lam-success.mp3",
      "successDurationMs": 3005
    },
    "letters-noon-bee": {
      "prompt": "/sounds/preschool/ar/letters-noon-bee-prompt.mp3",
      "success": "/sounds/preschool/ar/letters-noon-bee-success.mp3",
      "successDurationMs": 3355
    },
    "letters-haa2-moon": {
      "prompt": "/sounds/preschool/ar/letters-haa2-moon-prompt.mp3",
      "success": "/sounds/preschool/ar/letters-haa2-moon-success.mp3",
      "successDurationMs": 2940
    },
    "letters-waw-rose": {
      "prompt": "/sounds/preschool/ar/letters-waw-rose-prompt.mp3",
      "success": "/sounds/preschool/ar/letters-waw-rose-success.mp3",
      "successDurationMs": 3235
    },
    "letters-trace-waw": {
      "prompt": "/sounds/preschool/ar/letters-trace-waw-prompt.mp3",
      "success": "/sounds/preschool/ar/letters-trace-waw-success.mp3",
      "successDurationMs": 2825
    },
    "letters-yaa-hand": {
      "prompt": "/sounds/preschool/ar/letters-yaa-hand-prompt.mp3",
      "success": "/sounds/preschool/ar/letters-yaa-hand-success.mp3",
      "successDurationMs": 2765
    },
    "letters-rhyme-sort": {
      "prompt": "/sounds/preschool/ar/letters-rhyme-sort-prompt.mp3",
      "success": "/sounds/preschool/ar/letters-rhyme-sort-success.mp3",
      "successDurationMs": 4230
    },
    "letters-match-words-2": {
      "prompt": "/sounds/preschool/ar/letters-match-words-2-prompt.mp3",
      "success": "/sounds/preschool/ar/letters-match-words-2-success.mp3",
      "successDurationMs": 3280
    },
    "letters-listen-faa": {
      "prompt": "/sounds/preschool/ar/letters-listen-faa-prompt.mp3",
      "success": "/sounds/preschool/ar/letters-listen-faa-success.mp3",
      "successDurationMs": 3614
    }
  },
  "en": {
    "letters-alif-rabbit": {
      "prompt": "/sounds/preschool/en/letters-alif-rabbit-prompt.mp3",
      "success": "/sounds/preschool/en/letters-alif-rabbit-success.mp3",
      "successDurationMs": 2780
    },
    "letters-boat-alif-baa": {
      "prompt": "/sounds/preschool/en/letters-boat-alif-baa-prompt.mp3",
      "success": "/sounds/preschool/en/letters-boat-alif-baa-success.mp3",
      "successDurationMs": 2710
    },
    "letters-trace-alif": {
      "prompt": "/sounds/preschool/en/letters-trace-alif-prompt.mp3",
      "success": "/sounds/preschool/en/letters-trace-alif-success.mp3",
      "successDurationMs": 2695
    },
    "letters-taa-apple": {
      "prompt": "/sounds/preschool/en/letters-taa-apple-prompt.mp3",
      "success": "/sounds/preschool/en/letters-taa-apple-success.mp3",
      "successDurationMs": 2700
    },
    "letters-thaa-fox": {
      "prompt": "/sounds/preschool/en/letters-thaa-fox-prompt.mp3",
      "success": "/sounds/preschool/en/letters-thaa-fox-success.mp3",
      "successDurationMs": 2635
    },
    "letters-jeem-camel": {
      "prompt": "/sounds/preschool/en/letters-jeem-camel-prompt.mp3",
      "success": "/sounds/preschool/en/letters-jeem-camel-success.mp3",
      "successDurationMs": 2595
    },
    "letters-trace-jeem": {
      "prompt": "/sounds/preschool/en/letters-trace-jeem-prompt.mp3",
      "success": "/sounds/preschool/en/letters-trace-jeem-success.mp3",
      "successDurationMs": 2755
    },
    "letters-dal-bear": {
      "prompt": "/sounds/preschool/en/letters-dal-bear-prompt.mp3",
      "success": "/sounds/preschool/en/letters-dal-bear-success.mp3",
      "successDurationMs": 2685
    },
    "letters-trace-baa": {
      "prompt": "/sounds/preschool/en/letters-trace-baa-prompt.mp3",
      "success": "/sounds/preschool/en/letters-trace-baa-success.mp3",
      "successDurationMs": 3035
    },
    "letters-seen-fish": {
      "prompt": "/sounds/preschool/en/letters-seen-fish-prompt.mp3",
      "success": "/sounds/preschool/en/letters-seen-fish-success.mp3",
      "successDurationMs": 2600
    },
    "letters-meem-banana": {
      "prompt": "/sounds/preschool/en/letters-meem-banana-prompt.mp3",
      "success": "/sounds/preschool/en/letters-meem-banana-success.mp3",
      "successDurationMs": 2625
    },
    "letters-trace-meem": {
      "prompt": "/sounds/preschool/en/letters-trace-meem-prompt.mp3",
      "success": "/sounds/preschool/en/letters-trace-meem-success.mp3",
      "successDurationMs": 2660
    },
    "letters-fruit-basket": {
      "prompt": "/sounds/preschool/en/letters-fruit-basket-prompt.mp3",
      "success": "/sounds/preschool/en/letters-fruit-basket-success.mp3",
      "successDurationMs": 3080
    },
    "letters-match-words": {
      "prompt": "/sounds/preschool/en/letters-match-words-prompt.mp3",
      "success": "/sounds/preschool/en/letters-match-words-success.mp3",
      "successDurationMs": 3010
    },
    "letters-haa-milk": {
      "prompt": "/sounds/preschool/en/letters-haa-milk-prompt.mp3",
      "success": "/sounds/preschool/en/letters-haa-milk-success.mp3",
      "successDurationMs": 2685
    },
    "letters-khaa-bread": {
      "prompt": "/sounds/preschool/en/letters-khaa-bread-prompt.mp3",
      "success": "/sounds/preschool/en/letters-khaa-bread-success.mp3",
      "successDurationMs": 2860
    },
    "letters-thal-wolf": {
      "prompt": "/sounds/preschool/en/letters-thal-wolf-prompt.mp3",
      "success": "/sounds/preschool/en/letters-thal-wolf-success.mp3",
      "successDurationMs": 2755
    },
    "letters-raa-feather": {
      "prompt": "/sounds/preschool/en/letters-raa-feather-prompt.mp3",
      "success": "/sounds/preschool/en/letters-raa-feather-success.mp3",
      "successDurationMs": 2685
    },
    "letters-zay-giraffe": {
      "prompt": "/sounds/preschool/en/letters-zay-giraffe-prompt.mp3",
      "success": "/sounds/preschool/en/letters-zay-giraffe-success.mp3",
      "successDurationMs": 2725
    },
    "letters-trace-raa": {
      "prompt": "/sounds/preschool/en/letters-trace-raa-prompt.mp3",
      "success": "/sounds/preschool/en/letters-trace-raa-success.mp3",
      "successDurationMs": 2700
    },
    "letters-sheen-sun": {
      "prompt": "/sounds/preschool/en/letters-sheen-sun-prompt.mp3",
      "success": "/sounds/preschool/en/letters-sheen-sun-success.mp3",
      "successDurationMs": 2660
    },
    "letters-sad-falcon": {
      "prompt": "/sounds/preschool/en/letters-sad-falcon-prompt.mp3",
      "success": "/sounds/preschool/en/letters-sad-falcon-success.mp3",
      "successDurationMs": 2755
    },
    "letters-dad-frog": {
      "prompt": "/sounds/preschool/en/letters-dad-frog-prompt.mp3",
      "success": "/sounds/preschool/en/letters-dad-frog-success.mp3",
      "successDurationMs": 2640
    },
    "letters-trace-sad": {
      "prompt": "/sounds/preschool/en/letters-trace-sad-prompt.mp3",
      "success": "/sounds/preschool/en/letters-trace-sad-success.mp3",
      "successDurationMs": 2615
    },
    "letters-taa2-peacock": {
      "prompt": "/sounds/preschool/en/letters-taa2-peacock-prompt.mp3",
      "success": "/sounds/preschool/en/letters-taa2-peacock-success.mp3",
      "successDurationMs": 2615
    },
    "letters-za-gazelle": {
      "prompt": "/sounds/preschool/en/letters-za-gazelle-prompt.mp3",
      "success": "/sounds/preschool/en/letters-za-gazelle-success.mp3",
      "successDurationMs": 2690
    },
    "letters-ayn-bird": {
      "prompt": "/sounds/preschool/en/letters-ayn-bird-prompt.mp3",
      "success": "/sounds/preschool/en/letters-ayn-bird-success.mp3",
      "successDurationMs": 2635
    },
    "letters-ghayn-sheep": {
      "prompt": "/sounds/preschool/en/letters-ghayn-sheep-prompt.mp3",
      "success": "/sounds/preschool/en/letters-ghayn-sheep-success.mp3",
      "successDurationMs": 2530
    },
    "letters-faa-elephant": {
      "prompt": "/sounds/preschool/en/letters-faa-elephant-prompt.mp3",
      "success": "/sounds/preschool/en/letters-faa-elephant-success.mp3",
      "successDurationMs": 2670
    },
    "letters-trace-faa": {
      "prompt": "/sounds/preschool/en/letters-trace-faa-prompt.mp3",
      "success": "/sounds/preschool/en/letters-trace-faa-success.mp3",
      "successDurationMs": 2660
    },
    "letters-qaf-monkey": {
      "prompt": "/sounds/preschool/en/letters-qaf-monkey-prompt.mp3",
      "success": "/sounds/preschool/en/letters-qaf-monkey-success.mp3",
      "successDurationMs": 2695
    },
    "letters-kaf-dog": {
      "prompt": "/sounds/preschool/en/letters-kaf-dog-prompt.mp3",
      "success": "/sounds/preschool/en/letters-kaf-dog-success.mp3",
      "successDurationMs": 2555
    },
    "letters-lam-lemon": {
      "prompt": "/sounds/preschool/en/letters-lam-lemon-prompt.mp3",
      "success": "/sounds/preschool/en/letters-lam-lemon-success.mp3",
      "successDurationMs": 2635
    },
    "letters-trace-lam": {
      "prompt": "/sounds/preschool/en/letters-trace-lam-prompt.mp3",
      "success": "/sounds/preschool/en/letters-trace-lam-success.mp3",
      "successDurationMs": 2905
    },
    "letters-noon-bee": {
      "prompt": "/sounds/preschool/en/letters-noon-bee-prompt.mp3",
      "success": "/sounds/preschool/en/letters-noon-bee-success.mp3",
      "successDurationMs": 2625
    },
    "letters-haa2-moon": {
      "prompt": "/sounds/preschool/en/letters-haa2-moon-prompt.mp3",
      "success": "/sounds/preschool/en/letters-haa2-moon-success.mp3",
      "successDurationMs": 2645
    },
    "letters-waw-rose": {
      "prompt": "/sounds/preschool/en/letters-waw-rose-prompt.mp3",
      "success": "/sounds/preschool/en/letters-waw-rose-success.mp3",
      "successDurationMs": 2575
    },
    "letters-trace-waw": {
      "prompt": "/sounds/preschool/en/letters-trace-waw-prompt.mp3",
      "success": "/sounds/preschool/en/letters-trace-waw-success.mp3",
      "successDurationMs": 3415
    },
    "letters-yaa-hand": {
      "prompt": "/sounds/preschool/en/letters-yaa-hand-prompt.mp3",
      "success": "/sounds/preschool/en/letters-yaa-hand-success.mp3",
      "successDurationMs": 2930
    },
    "letters-rhyme-sort": {
      "prompt": "/sounds/preschool/en/letters-rhyme-sort-prompt.mp3",
      "success": "/sounds/preschool/en/letters-rhyme-sort-success.mp3",
      "successDurationMs": 4100
    },
    "letters-match-words-2": {
      "prompt": "/sounds/preschool/en/letters-match-words-2-prompt.mp3",
      "success": "/sounds/preschool/en/letters-match-words-2-success.mp3",
      "successDurationMs": 3480
    },
    "letters-listen-faa": {
      "prompt": "/sounds/preschool/en/letters-listen-faa-prompt.mp3",
      "success": "/sounds/preschool/en/letters-listen-faa-success.mp3",
      "successDurationMs": 3368
    }
  }
};
