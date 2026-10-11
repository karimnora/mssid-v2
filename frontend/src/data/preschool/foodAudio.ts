import type { PreschoolLanguage } from './types';

// Recordings in Arabic, French and English verified against the food catalog.
export const FOOD_AUDIO_CLIPS: Partial<Record<PreschoolLanguage, Record<string, { prompt: string; success: string; successDurationMs: number }>>> = {
  "ar": {
    "food-fennec-market": {
      "prompt": "/sounds/preschool/ar/food-fennec-market-prompt.mp3",
      "success": "/sounds/preschool/ar/food-fennec-market-success.mp3",
      "successDurationMs": 3757
    },
    "food-fruits-tap": {
      "prompt": "/sounds/preschool/ar/food-fruits-tap-prompt.mp3",
      "success": "/sounds/preschool/ar/food-fruits-tap-success.mp3",
      "successDurationMs": 2501
    },
    "food-vegetables-tap": {
      "prompt": "/sounds/preschool/ar/food-vegetables-tap-prompt.mp3",
      "success": "/sounds/preschool/ar/food-vegetables-tap-success.mp3",
      "successDurationMs": 2374
    },
    "food-milk-tap": {
      "prompt": "/sounds/preschool/ar/food-milk-tap-prompt.mp3",
      "success": "/sounds/preschool/ar/food-milk-tap-success.mp3",
      "successDurationMs": 2840
    },
    "food-sorting": {
      "prompt": "/sounds/preschool/ar/food-sorting-prompt.mp3",
      "success": "/sounds/preschool/ar/food-sorting-success.mp3",
      "successDurationMs": 3468
    },
    "food-from-connect": {
      "prompt": "/sounds/preschool/ar/food-from-connect-prompt.mp3",
      "success": "/sounds/preschool/ar/food-from-connect-success.mp3",
      "successDurationMs": 2873
    },
    "food-memory": {
      "prompt": "/sounds/preschool/ar/food-memory-prompt.mp3",
      "success": "/sounds/preschool/ar/food-memory-success.mp3",
      "successDurationMs": 2762
    }
  },
  "fr": {
    "food-fennec-market": {
      "prompt": "/sounds/preschool/fr/food-fennec-market-prompt.mp3",
      "success": "/sounds/preschool/fr/food-fennec-market-success.mp3",
      "successDurationMs": 3601
    },
    "food-fruits-tap": {
      "prompt": "/sounds/preschool/fr/food-fruits-tap-prompt.mp3",
      "success": "/sounds/preschool/fr/food-fruits-tap-success.mp3",
      "successDurationMs": 2081
    },
    "food-vegetables-tap": {
      "prompt": "/sounds/preschool/fr/food-vegetables-tap-prompt.mp3",
      "success": "/sounds/preschool/fr/food-vegetables-tap-success.mp3",
      "successDurationMs": 2211
    },
    "food-milk-tap": {
      "prompt": "/sounds/preschool/fr/food-milk-tap-prompt.mp3",
      "success": "/sounds/preschool/fr/food-milk-tap-success.mp3",
      "successDurationMs": 2596
    },
    "food-sorting": {
      "prompt": "/sounds/preschool/fr/food-sorting-prompt.mp3",
      "success": "/sounds/preschool/fr/food-sorting-success.mp3",
      "successDurationMs": 2856
    },
    "food-from-connect": {
      "prompt": "/sounds/preschool/fr/food-from-connect-prompt.mp3",
      "success": "/sounds/preschool/fr/food-from-connect-success.mp3",
      "successDurationMs": 2596
    },
    "food-memory": {
      "prompt": "/sounds/preschool/fr/food-memory-prompt.mp3",
      "success": "/sounds/preschool/fr/food-memory-success.mp3",
      "successDurationMs": 2181
    }
  },
  "en": {
    "food-fennec-market": {
      "prompt": "/sounds/preschool/en/food-fennec-market-prompt.mp3",
      "success": "/sounds/preschool/en/food-fennec-market-success.mp3",
      "successDurationMs": 4279
    },
    "food-fruits-tap": {
      "prompt": "/sounds/preschool/en/food-fruits-tap-prompt.mp3",
      "success": "/sounds/preschool/en/food-fruits-tap-success.mp3",
      "successDurationMs": 2793
    },
    "food-vegetables-tap": {
      "prompt": "/sounds/preschool/en/food-vegetables-tap-prompt.mp3",
      "success": "/sounds/preschool/en/food-vegetables-tap-success.mp3",
      "successDurationMs": 2535
    },
    "food-milk-tap": {
      "prompt": "/sounds/preschool/en/food-milk-tap-prompt.mp3",
      "success": "/sounds/preschool/en/food-milk-tap-success.mp3",
      "successDurationMs": 2998
    },
    "food-sorting": {
      "prompt": "/sounds/preschool/en/food-sorting-prompt.mp3",
      "success": "/sounds/preschool/en/food-sorting-success.mp3",
      "successDurationMs": 3530
    },
    "food-from-connect": {
      "prompt": "/sounds/preschool/en/food-from-connect-prompt.mp3",
      "success": "/sounds/preschool/en/food-from-connect-success.mp3",
      "successDurationMs": 2809
    },
    "food-memory": {
      "prompt": "/sounds/preschool/en/food-memory-prompt.mp3",
      "success": "/sounds/preschool/en/food-memory-success.mp3",
      "successDurationMs": 2795
    }
  }
};
