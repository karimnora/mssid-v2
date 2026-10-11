import type { PreschoolLanguage } from './types';

// Recordings in Arabic, French and English verified against the colors catalog.
export const COLOR_AUDIO_CLIPS: Partial<Record<PreschoolLanguage, Record<string, { prompt: string; success: string; successDurationMs: number }>>> = {
  "ar": {
    "colors-fennec-path": {
      "prompt": "/sounds/preschool/ar/colors-fennec-path-prompt.mp3",
      "success": "/sounds/preschool/ar/colors-fennec-path-success.mp3",
      "successDurationMs": 3861
    },
    "colors-red-strawberry": {
      "prompt": "/sounds/preschool/ar/colors-red-strawberry-prompt.mp3",
      "success": "/sounds/preschool/ar/colors-red-strawberry-success.mp3",
      "successDurationMs": 2951
    },
    "colors-orange-fruit": {
      "prompt": "/sounds/preschool/ar/colors-orange-fruit-prompt.mp3",
      "success": "/sounds/preschool/ar/colors-orange-fruit-success.mp3",
      "successDurationMs": 3254
    },
    "colors-yellow-sun": {
      "prompt": "/sounds/preschool/ar/colors-yellow-sun-prompt.mp3",
      "success": "/sounds/preschool/ar/colors-yellow-sun-success.mp3",
      "successDurationMs": 3050
    },
    "colors-green-frog": {
      "prompt": "/sounds/preschool/ar/colors-green-frog-prompt.mp3",
      "success": "/sounds/preschool/ar/colors-green-frog-success.mp3",
      "successDurationMs": 2932
    },
    "colors-blue-sea": {
      "prompt": "/sounds/preschool/ar/colors-blue-sea-prompt.mp3",
      "success": "/sounds/preschool/ar/colors-blue-sea-success.mp3",
      "successDurationMs": 2942
    },
    "colors-purple-grapes": {
      "prompt": "/sounds/preschool/ar/colors-purple-grapes-prompt.mp3",
      "success": "/sounds/preschool/ar/colors-purple-grapes-success.mp3",
      "successDurationMs": 3352
    },
    "colors-sort-red-green-blue": {
      "prompt": "/sounds/preschool/ar/colors-sort-red-green-blue-prompt.mp3",
      "success": "/sounds/preschool/ar/colors-sort-red-green-blue-success.mp3",
      "successDurationMs": 3200
    },
    "colors-pottery-bubble": {
      "prompt": "/sounds/preschool/ar/colors-pottery-bubble-prompt.mp3",
      "success": "/sounds/preschool/ar/colors-pottery-bubble-success.mp3",
      "successDurationMs": 1611
    },
    "colors-memory-gems": {
      "prompt": "/sounds/preschool/ar/colors-memory-gems-prompt.mp3",
      "success": "/sounds/preschool/ar/colors-memory-gems-success.mp3",
      "successDurationMs": 3518
    }
  },
  "fr": {
    "colors-fennec-path": {
      "prompt": "/sounds/preschool/fr/colors-fennec-path-prompt.mp3",
      "success": "/sounds/preschool/fr/colors-fennec-path-success.mp3",
      "successDurationMs": 3693
    },
    "colors-red-strawberry": {
      "prompt": "/sounds/preschool/fr/colors-red-strawberry-prompt.mp3",
      "success": "/sounds/preschool/fr/colors-red-strawberry-success.mp3",
      "successDurationMs": 2663
    },
    "colors-orange-fruit": {
      "prompt": "/sounds/preschool/fr/colors-orange-fruit-prompt.mp3",
      "success": "/sounds/preschool/fr/colors-orange-fruit-success.mp3",
      "successDurationMs": 2638
    },
    "colors-yellow-sun": {
      "prompt": "/sounds/preschool/fr/colors-yellow-sun-prompt.mp3",
      "success": "/sounds/preschool/fr/colors-yellow-sun-success.mp3",
      "successDurationMs": 2513
    },
    "colors-green-frog": {
      "prompt": "/sounds/preschool/fr/colors-green-frog-prompt.mp3",
      "success": "/sounds/preschool/fr/colors-green-frog-success.mp3",
      "successDurationMs": 2598
    },
    "colors-blue-sea": {
      "prompt": "/sounds/preschool/fr/colors-blue-sea-prompt.mp3",
      "success": "/sounds/preschool/fr/colors-blue-sea-success.mp3",
      "successDurationMs": 2521
    },
    "colors-purple-grapes": {
      "prompt": "/sounds/preschool/fr/colors-purple-grapes-prompt.mp3",
      "success": "/sounds/preschool/fr/colors-purple-grapes-success.mp3",
      "successDurationMs": 2578
    },
    "colors-sort-red-green-blue": {
      "prompt": "/sounds/preschool/fr/colors-sort-red-green-blue-prompt.mp3",
      "success": "/sounds/preschool/fr/colors-sort-red-green-blue-success.mp3",
      "successDurationMs": 3129
    },
    "colors-pottery-bubble": {
      "prompt": "/sounds/preschool/fr/colors-pottery-bubble-prompt.mp3",
      "success": "/sounds/preschool/fr/colors-pottery-bubble-success.mp3",
      "successDurationMs": 3188
    },
    "colors-memory-gems": {
      "prompt": "/sounds/preschool/fr/colors-memory-gems-prompt.mp3",
      "success": "/sounds/preschool/fr/colors-memory-gems-success.mp3",
      "successDurationMs": 2978
    }
  },
  "en": {
    "colors-fennec-path": {
      "prompt": "/sounds/preschool/en/colors-fennec-path-prompt.mp3",
      "success": "/sounds/preschool/en/colors-fennec-path-success.mp3",
      "successDurationMs": 3006
    },
    "colors-red-strawberry": {
      "prompt": "/sounds/preschool/en/colors-red-strawberry-prompt.mp3",
      "success": "/sounds/preschool/en/colors-red-strawberry-success.mp3",
      "successDurationMs": 2880
    },
    "colors-orange-fruit": {
      "prompt": "/sounds/preschool/en/colors-orange-fruit-prompt.mp3",
      "success": "/sounds/preschool/en/colors-orange-fruit-success.mp3",
      "successDurationMs": 2854
    },
    "colors-yellow-sun": {
      "prompt": "/sounds/preschool/en/colors-yellow-sun-prompt.mp3",
      "success": "/sounds/preschool/en/colors-yellow-sun-success.mp3",
      "successDurationMs": 2718
    },
    "colors-green-frog": {
      "prompt": "/sounds/preschool/en/colors-green-frog-prompt.mp3",
      "success": "/sounds/preschool/en/colors-green-frog-success.mp3",
      "successDurationMs": 2960
    },
    "colors-blue-sea": {
      "prompt": "/sounds/preschool/en/colors-blue-sea-prompt.mp3",
      "success": "/sounds/preschool/en/colors-blue-sea-success.mp3",
      "successDurationMs": 2789
    },
    "colors-purple-grapes": {
      "prompt": "/sounds/preschool/en/colors-purple-grapes-prompt.mp3",
      "success": "/sounds/preschool/en/colors-purple-grapes-success.mp3",
      "successDurationMs": 2705
    },
    "colors-sort-red-green-blue": {
      "prompt": "/sounds/preschool/en/colors-sort-red-green-blue-prompt.mp3",
      "success": "/sounds/preschool/en/colors-sort-red-green-blue-success.mp3",
      "successDurationMs": 3251
    },
    "colors-pottery-bubble": {
      "prompt": "/sounds/preschool/en/colors-pottery-bubble-prompt.mp3",
      "success": "/sounds/preschool/en/colors-pottery-bubble-success.mp3",
      "successDurationMs": 3316
    },
    "colors-memory-gems": {
      "prompt": "/sounds/preschool/en/colors-memory-gems-prompt.mp3",
      "success": "/sounds/preschool/en/colors-memory-gems-success.mp3",
      "successDurationMs": 2574
    }
  }
};
