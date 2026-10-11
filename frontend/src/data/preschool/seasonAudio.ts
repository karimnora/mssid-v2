import type { PreschoolLanguage } from './types';

// Recordings in Arabic, French and English verified against the seasons catalog.
export const SEASON_AUDIO_CLIPS: Partial<Record<PreschoolLanguage, Record<string, { prompt: string; success: string; successDurationMs: number }>>> = {
  "ar": {
    "seasons-year-path": {
      "prompt": "/sounds/preschool/ar/seasons-year-path-prompt.mp3",
      "success": "/sounds/preschool/ar/seasons-year-path-success.mp3",
      "successDurationMs": 2643
    },
    "seasons-spring": {
      "prompt": "/sounds/preschool/ar/seasons-spring-prompt.mp3",
      "success": "/sounds/preschool/ar/seasons-spring-success.mp3",
      "successDurationMs": 2659
    },
    "seasons-summer": {
      "prompt": "/sounds/preschool/ar/seasons-summer-prompt.mp3",
      "success": "/sounds/preschool/ar/seasons-summer-success.mp3",
      "successDurationMs": 2556
    },
    "seasons-autumn": {
      "prompt": "/sounds/preschool/ar/seasons-autumn-prompt.mp3",
      "success": "/sounds/preschool/ar/seasons-autumn-success.mp3",
      "successDurationMs": 2774
    },
    "seasons-winter": {
      "prompt": "/sounds/preschool/ar/seasons-winter-prompt.mp3",
      "success": "/sounds/preschool/ar/seasons-winter-success.mp3",
      "successDurationMs": 2648
    },
    "seasons-clothes-sorting": {
      "prompt": "/sounds/preschool/ar/seasons-clothes-sorting-prompt.mp3",
      "success": "/sounds/preschool/ar/seasons-clothes-sorting-success.mp3",
      "successDurationMs": 3180
    },
    "seasons-connect": {
      "prompt": "/sounds/preschool/ar/seasons-connect-prompt.mp3",
      "success": "/sounds/preschool/ar/seasons-connect-success.mp3",
      "successDurationMs": 2931
    }
  },
  "fr": {
    "seasons-year-path": {
      "prompt": "/sounds/preschool/fr/seasons-year-path-prompt.mp3",
      "success": "/sounds/preschool/fr/seasons-year-path-success.mp3",
      "successDurationMs": 2324
    },
    "seasons-spring": {
      "prompt": "/sounds/preschool/fr/seasons-spring-prompt.mp3",
      "success": "/sounds/preschool/fr/seasons-spring-success.mp3",
      "successDurationMs": 2729
    },
    "seasons-summer": {
      "prompt": "/sounds/preschool/fr/seasons-summer-prompt.mp3",
      "success": "/sounds/preschool/fr/seasons-summer-success.mp3",
      "successDurationMs": 2691
    },
    "seasons-autumn": {
      "prompt": "/sounds/preschool/fr/seasons-autumn-prompt.mp3",
      "success": "/sounds/preschool/fr/seasons-autumn-success.mp3",
      "successDurationMs": 2883
    },
    "seasons-winter": {
      "prompt": "/sounds/preschool/fr/seasons-winter-prompt.mp3",
      "success": "/sounds/preschool/fr/seasons-winter-success.mp3",
      "successDurationMs": 2794
    },
    "seasons-clothes-sorting": {
      "prompt": "/sounds/preschool/fr/seasons-clothes-sorting-prompt.mp3",
      "success": "/sounds/preschool/fr/seasons-clothes-sorting-success.mp3",
      "successDurationMs": 3216
    },
    "seasons-connect": {
      "prompt": "/sounds/preschool/fr/seasons-connect-prompt.mp3",
      "success": "/sounds/preschool/fr/seasons-connect-success.mp3",
      "successDurationMs": 2711
    }
  },
  "en": {
    "seasons-year-path": {
      "prompt": "/sounds/preschool/en/seasons-year-path-prompt.mp3",
      "success": "/sounds/preschool/en/seasons-year-path-success.mp3",
      "successDurationMs": 2622
    },
    "seasons-spring": {
      "prompt": "/sounds/preschool/en/seasons-spring-prompt.mp3",
      "success": "/sounds/preschool/en/seasons-spring-success.mp3",
      "successDurationMs": 2981
    },
    "seasons-summer": {
      "prompt": "/sounds/preschool/en/seasons-summer-prompt.mp3",
      "success": "/sounds/preschool/en/seasons-summer-success.mp3",
      "successDurationMs": 2689
    },
    "seasons-autumn": {
      "prompt": "/sounds/preschool/en/seasons-autumn-prompt.mp3",
      "success": "/sounds/preschool/en/seasons-autumn-success.mp3",
      "successDurationMs": 2702
    },
    "seasons-winter": {
      "prompt": "/sounds/preschool/en/seasons-winter-prompt.mp3",
      "success": "/sounds/preschool/en/seasons-winter-success.mp3",
      "successDurationMs": 2968
    },
    "seasons-clothes-sorting": {
      "prompt": "/sounds/preschool/en/seasons-clothes-sorting-prompt.mp3",
      "success": "/sounds/preschool/en/seasons-clothes-sorting-success.mp3",
      "successDurationMs": 3473
    },
    "seasons-connect": {
      "prompt": "/sounds/preschool/en/seasons-connect-prompt.mp3",
      "success": "/sounds/preschool/en/seasons-connect-success.mp3",
      "successDurationMs": 2866
    }
  }
};
