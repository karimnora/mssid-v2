import type { PreschoolLanguage } from './types';

// Supplied Arabic, French and English recordings aligned with the Algeria activities.
export const ALGERIA_AUDIO_CLIPS: Partial<Record<PreschoolLanguage, Record<string, { prompt: string; success: string; successDurationMs: number }>>> = {
  "ar": {
    "algeria-fennec-flag": {
      "prompt": "/sounds/preschool/ar/algeria-fennec-flag-prompt.mp3",
      "success": "/sounds/preschool/ar/algeria-fennec-flag-success.mp3",
      "successDurationMs": 3222
    },
    "algeria-flag-color": {
      "prompt": "/sounds/preschool/ar/algeria-flag-color-prompt.mp3",
      "success": "/sounds/preschool/ar/algeria-flag-color-success.mp3",
      "successDurationMs": 2368
    },
    "algeria-mosque": {
      "prompt": "/sounds/preschool/ar/algeria-mosque-prompt.mp3",
      "success": "/sounds/preschool/ar/algeria-mosque-success.mp3",
      "successDurationMs": 2208
    },
    "algeria-couscous": {
      "prompt": "/sounds/preschool/ar/algeria-couscous-prompt.mp3",
      "success": "/sounds/preschool/ar/algeria-couscous-success.mp3",
      "successDurationMs": 2350
    },
    "algeria-fennec-tap": {
      "prompt": "/sounds/preschool/ar/algeria-fennec-tap-prompt.mp3",
      "success": "/sounds/preschool/ar/algeria-fennec-tap-success.mp3",
      "successDurationMs": 2392
    },
    "algeria-connect": {
      "prompt": "/sounds/preschool/ar/algeria-connect-prompt.mp3",
      "success": "/sounds/preschool/ar/algeria-connect-success.mp3",
      "successDurationMs": 3606
    },
    "algeria-habitat-sort": {
      "prompt": "/sounds/preschool/ar/algeria-habitat-sort-prompt.mp3",
      "success": "/sounds/preschool/ar/algeria-habitat-sort-success.mp3",
      "successDurationMs": 2309
    },
    "algeria-memory": {
      "prompt": "/sounds/preschool/ar/algeria-memory-prompt.mp3",
      "success": "/sounds/preschool/ar/algeria-memory-success.mp3",
      "successDurationMs": 2530
    }
  },
  "fr": {
    "algeria-fennec-flag": {
      "prompt": "/sounds/preschool/fr/algeria-fennec-flag-prompt.mp3",
      "success": "/sounds/preschool/fr/algeria-fennec-flag-success.mp3",
      "successDurationMs": 2830
    },
    "algeria-flag-color": {
      "prompt": "/sounds/preschool/fr/algeria-flag-color-prompt.mp3",
      "success": "/sounds/preschool/fr/algeria-flag-color-success.mp3",
      "successDurationMs": 2326
    },
    "algeria-mosque": {
      "prompt": "/sounds/preschool/fr/algeria-mosque-prompt.mp3",
      "success": "/sounds/preschool/fr/algeria-mosque-success.mp3",
      "successDurationMs": 2264
    },
    "algeria-couscous": {
      "prompt": "/sounds/preschool/fr/algeria-couscous-prompt.mp3",
      "success": "/sounds/preschool/fr/algeria-couscous-success.mp3",
      "successDurationMs": 2406
    },
    "algeria-fennec-tap": {
      "prompt": "/sounds/preschool/fr/algeria-fennec-tap-prompt.mp3",
      "success": "/sounds/preschool/fr/algeria-fennec-tap-success.mp3",
      "successDurationMs": 2422
    },
    "algeria-connect": {
      "prompt": "/sounds/preschool/fr/algeria-connect-prompt.mp3",
      "success": "/sounds/preschool/fr/algeria-connect-success.mp3",
      "successDurationMs": 3524
    },
    "algeria-habitat-sort": {
      "prompt": "/sounds/preschool/fr/algeria-habitat-sort-prompt.mp3",
      "success": "/sounds/preschool/fr/algeria-habitat-sort-success.mp3",
      "successDurationMs": 2463
    },
    "algeria-memory": {
      "prompt": "/sounds/preschool/fr/algeria-memory-prompt.mp3",
      "success": "/sounds/preschool/fr/algeria-memory-success.mp3",
      "successDurationMs": 2191
    }
  },
  "en": {
    "algeria-fennec-flag": {
      "prompt": "/sounds/preschool/en/algeria-fennec-flag-prompt.mp3",
      "success": "/sounds/preschool/en/algeria-fennec-flag-success.mp3",
      "successDurationMs": 4244
    },
    "algeria-flag-color": {
      "prompt": "/sounds/preschool/en/algeria-flag-color-prompt.mp3",
      "success": "/sounds/preschool/en/algeria-flag-color-success.mp3",
      "successDurationMs": 2680
    },
    "algeria-mosque": {
      "prompt": "/sounds/preschool/en/algeria-mosque-prompt.mp3",
      "success": "/sounds/preschool/en/algeria-mosque-success.mp3",
      "successDurationMs": 2347
    },
    "algeria-couscous": {
      "prompt": "/sounds/preschool/en/algeria-couscous-prompt.mp3",
      "success": "/sounds/preschool/en/algeria-couscous-success.mp3",
      "successDurationMs": 2462
    },
    "algeria-fennec-tap": {
      "prompt": "/sounds/preschool/en/algeria-fennec-tap-prompt.mp3",
      "success": "/sounds/preschool/en/algeria-fennec-tap-success.mp3",
      "successDurationMs": 2616
    },
    "algeria-connect": {
      "prompt": "/sounds/preschool/en/algeria-connect-prompt.mp3",
      "success": "/sounds/preschool/en/algeria-connect-success.mp3",
      "successDurationMs": 3470
    },
    "algeria-habitat-sort": {
      "prompt": "/sounds/preschool/en/algeria-habitat-sort-prompt.mp3",
      "success": "/sounds/preschool/en/algeria-habitat-sort-success.mp3",
      "successDurationMs": 2257
    },
    "algeria-memory": {
      "prompt": "/sounds/preschool/en/algeria-memory-prompt.mp3",
      "success": "/sounds/preschool/en/algeria-memory-success.mp3",
      "successDurationMs": 2803
    }
  }
};
