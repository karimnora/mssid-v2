import type { PreschoolLanguage } from './types';

// Recordings in Arabic, French and English verified against the animals catalog.
export const ANIMAL_AUDIO_CLIPS: Partial<Record<PreschoolLanguage, Record<string, { prompt: string; success: string; successDurationMs: number }>>> = {
  "ar": {
    "animals-cow": {
      "prompt": "/sounds/preschool/ar/animals-cow-prompt.mp3",
      "success": "/sounds/preschool/ar/animals-cow-success.mp3",
      "successDurationMs": 2499
    },
    "animals-sheep": {
      "prompt": "/sounds/preschool/ar/animals-sheep-prompt.mp3",
      "success": "/sounds/preschool/ar/animals-sheep-success.mp3",
      "successDurationMs": 2362
    },
    "animals-chicken": {
      "prompt": "/sounds/preschool/ar/animals-chicken-prompt.mp3",
      "success": "/sounds/preschool/ar/animals-chicken-success.mp3",
      "successDurationMs": 2603
    },
    "animals-cat": {
      "prompt": "/sounds/preschool/ar/animals-cat-prompt.mp3",
      "success": "/sounds/preschool/ar/animals-cat-success.mp3",
      "successDurationMs": 2358
    },
    "animals-dog": {
      "prompt": "/sounds/preschool/ar/animals-dog-prompt.mp3",
      "success": "/sounds/preschool/ar/animals-dog-success.mp3",
      "successDurationMs": 2164
    },
    "animals-lion": {
      "prompt": "/sounds/preschool/ar/animals-lion-prompt.mp3",
      "success": "/sounds/preschool/ar/animals-lion-success.mp3",
      "successDurationMs": 2486
    },
    "animals-sort-big-small": {
      "prompt": "/sounds/preschool/ar/animals-sort-big-small-prompt.mp3",
      "success": "/sounds/preschool/ar/animals-sort-big-small-success.mp3",
      "successDurationMs": 3215
    },
    "animals-favorite-food": {
      "prompt": "/sounds/preschool/ar/animals-favorite-food-prompt.mp3",
      "success": "/sounds/preschool/ar/animals-favorite-food-success.mp3",
      "successDurationMs": 2933
    },
    "animals-bubble-pop": {
      "prompt": "/sounds/preschool/ar/animals-bubble-pop-prompt.mp3",
      "success": "/sounds/preschool/ar/animals-bubble-pop-success.mp3",
      "successDurationMs": 2808
    },
    "animals-memory-farm": {
      "prompt": "/sounds/preschool/ar/animals-memory-farm-prompt.mp3",
      "success": "/sounds/preschool/ar/animals-memory-farm-success.mp3",
      "successDurationMs": 3317
    }
  },
  "fr": {
    "animals-cow": {
      "prompt": "/sounds/preschool/fr/animals-cow-prompt.mp3",
      "success": "/sounds/preschool/fr/animals-cow-success.mp3",
      "successDurationMs": 2295
    },
    "animals-sheep": {
      "prompt": "/sounds/preschool/fr/animals-sheep-prompt.mp3",
      "success": "/sounds/preschool/fr/animals-sheep-success.mp3",
      "successDurationMs": 2219
    },
    "animals-chicken": {
      "prompt": "/sounds/preschool/fr/animals-chicken-prompt.mp3",
      "success": "/sounds/preschool/fr/animals-chicken-success.mp3",
      "successDurationMs": 2240
    },
    "animals-cat": {
      "prompt": "/sounds/preschool/fr/animals-cat-prompt.mp3",
      "success": "/sounds/preschool/fr/animals-cat-success.mp3",
      "successDurationMs": 2073
    },
    "animals-dog": {
      "prompt": "/sounds/preschool/fr/animals-dog-prompt.mp3",
      "success": "/sounds/preschool/fr/animals-dog-success.mp3",
      "successDurationMs": 2150
    },
    "animals-lion": {
      "prompt": "/sounds/preschool/fr/animals-lion-prompt.mp3",
      "success": "/sounds/preschool/fr/animals-lion-success.mp3",
      "successDurationMs": 2135
    },
    "animals-sort-big-small": {
      "prompt": "/sounds/preschool/fr/animals-sort-big-small-prompt.mp3",
      "success": "/sounds/preschool/fr/animals-sort-big-small-success.mp3",
      "successDurationMs": 2893
    },
    "animals-favorite-food": {
      "prompt": "/sounds/preschool/fr/animals-favorite-food-prompt.mp3",
      "success": "/sounds/preschool/fr/animals-favorite-food-success.mp3",
      "successDurationMs": 2698
    },
    "animals-bubble-pop": {
      "prompt": "/sounds/preschool/fr/animals-bubble-pop-prompt.mp3",
      "success": "/sounds/preschool/fr/animals-bubble-pop-success.mp3",
      "successDurationMs": 2914
    },
    "animals-memory-farm": {
      "prompt": "/sounds/preschool/fr/animals-memory-farm-prompt.mp3",
      "success": "/sounds/preschool/fr/animals-memory-farm-success.mp3",
      "successDurationMs": 3051
    }
  },
  "en": {
    "animals-cow": {
      "prompt": "/sounds/preschool/en/animals-cow-prompt.mp3",
      "success": "/sounds/preschool/en/animals-cow-success.mp3",
      "successDurationMs": 2784
    },
    "animals-sheep": {
      "prompt": "/sounds/preschool/en/animals-sheep-prompt.mp3",
      "success": "/sounds/preschool/en/animals-sheep-success.mp3",
      "successDurationMs": 2378
    },
    "animals-chicken": {
      "prompt": "/sounds/preschool/en/animals-chicken-prompt.mp3",
      "success": "/sounds/preschool/en/animals-chicken-success.mp3",
      "successDurationMs": 2659
    },
    "animals-cat": {
      "prompt": "/sounds/preschool/en/animals-cat-prompt.mp3",
      "success": "/sounds/preschool/en/animals-cat-success.mp3",
      "successDurationMs": 2520
    },
    "animals-dog": {
      "prompt": "/sounds/preschool/en/animals-dog-prompt.mp3",
      "success": "/sounds/preschool/en/animals-dog-success.mp3",
      "successDurationMs": 2398
    },
    "animals-lion": {
      "prompt": "/sounds/preschool/en/animals-lion-prompt.mp3",
      "success": "/sounds/preschool/en/animals-lion-success.mp3",
      "successDurationMs": 2753
    },
    "animals-sort-big-small": {
      "prompt": "/sounds/preschool/en/animals-sort-big-small-prompt.mp3",
      "success": "/sounds/preschool/en/animals-sort-big-small-success.mp3",
      "successDurationMs": 2891
    },
    "animals-favorite-food": {
      "prompt": "/sounds/preschool/en/animals-favorite-food-prompt.mp3",
      "success": "/sounds/preschool/en/animals-favorite-food-success.mp3",
      "successDurationMs": 2717
    },
    "animals-bubble-pop": {
      "prompt": "/sounds/preschool/en/animals-bubble-pop-prompt.mp3",
      "success": "/sounds/preschool/en/animals-bubble-pop-success.mp3",
      "successDurationMs": 3170
    },
    "animals-memory-farm": {
      "prompt": "/sounds/preschool/en/animals-memory-farm-prompt.mp3",
      "success": "/sounds/preschool/en/animals-memory-farm-success.mp3",
      "successDurationMs": 2668
    }
  }
};
