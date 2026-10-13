import type { PreschoolLanguage } from './types';

// Supplied Arabic, French and English recordings aligned with the values activities.
export const VALUES_AUDIO_CLIPS: Partial<Record<PreschoolLanguage, Record<string, { prompt: string; success: string; successDurationMs: number }>>> = {
  "ar": {
    "values-mosque-path": {
      "prompt": "/sounds/preschool/ar/values-mosque-path-prompt.mp3",
      "success": "/sounds/preschool/ar/values-mosque-path-success.mp3",
      "successDurationMs": 2796
    },
    "values-bismillah": {
      "prompt": "/sounds/preschool/ar/values-bismillah-prompt.mp3",
      "success": "/sounds/preschool/ar/values-bismillah-success.mp3",
      "successDurationMs": 2255
    },
    "values-alhamdulillah": {
      "prompt": "/sounds/preschool/ar/values-alhamdulillah-prompt.mp3",
      "success": "/sounds/preschool/ar/values-alhamdulillah-success.mp3",
      "successDurationMs": 2195
    },
    "values-salam": {
      "prompt": "/sounds/preschool/ar/values-salam-prompt.mp3",
      "success": "/sounds/preschool/ar/values-salam-success.mp3",
      "successDurationMs": 2428
    },
    "values-mosque-tap": {
      "prompt": "/sounds/preschool/ar/values-mosque-tap-prompt.mp3",
      "success": "/sounds/preschool/ar/algeria-mosque-success.mp3",
      "successDurationMs": 2208
    },
    "values-good-manners": {
      "prompt": "/sounds/preschool/ar/values-good-manners-prompt.mp3",
      "success": "/sounds/preschool/ar/values-good-manners-success.mp3",
      "successDurationMs": 3299
    },
    "values-memory": {
      "prompt": "/sounds/preschool/ar/values-memory-prompt.mp3",
      "success": "/sounds/preschool/ar/values-memory-success.mp3",
      "successDurationMs": 2379
    }
  },
  "fr": {
    "values-mosque-path": {
      "prompt": "/sounds/preschool/fr/values-mosque-path-prompt.mp3",
      "success": "/sounds/preschool/fr/values-mosque-path-success.mp3",
      "successDurationMs": 2496
    },
    "values-bismillah": {
      "prompt": "/sounds/preschool/fr/values-bismillah-prompt.mp3",
      "success": "/sounds/preschool/fr/values-bismillah-success.mp3",
      "successDurationMs": 2099
    },
    "values-alhamdulillah": {
      "prompt": "/sounds/preschool/fr/values-alhamdulillah-prompt.mp3",
      "success": "/sounds/preschool/fr/values-alhamdulillah-success.mp3",
      "successDurationMs": 2311
    },
    "values-salam": {
      "prompt": "/sounds/preschool/fr/values-salam-prompt.mp3",
      "success": "/sounds/preschool/fr/values-salam-success.mp3",
      "successDurationMs": 2422
    },
    "values-mosque-tap": {
      "prompt": "/sounds/preschool/fr/values-mosque-tap-prompt.mp3",
      "success": "/sounds/preschool/fr/algeria-mosque-success.mp3",
      "successDurationMs": 2264
    },
    "values-good-manners": {
      "prompt": "/sounds/preschool/fr/values-good-manners-prompt.mp3",
      "success": "/sounds/preschool/fr/values-good-manners-success.mp3",
      "successDurationMs": 3106
    },
    "values-memory": {
      "prompt": "/sounds/preschool/fr/values-memory-prompt.mp3",
      "success": "/sounds/preschool/fr/values-memory-success.mp3",
      "successDurationMs": 3149
    }
  },
  "en": {
    "values-mosque-path": {
      "prompt": "/sounds/preschool/en/values-mosque-path-prompt.mp3",
      "success": "/sounds/preschool/en/values-mosque-path-success.mp3",
      "successDurationMs": 2859
    },
    "values-bismillah": {
      "prompt": "/sounds/preschool/en/values-bismillah-prompt.mp3",
      "success": "/sounds/preschool/en/values-bismillah-success.mp3",
      "successDurationMs": 2334
    },
    "values-alhamdulillah": {
      "prompt": "/sounds/preschool/en/values-alhamdulillah-prompt.mp3",
      "success": "/sounds/preschool/en/values-alhamdulillah-success.mp3",
      "successDurationMs": 2368
    },
    "values-salam": {
      "prompt": "/sounds/preschool/en/values-salam-prompt.mp3",
      "success": "/sounds/preschool/en/values-salam-success.mp3",
      "successDurationMs": 2798
    },
    "values-mosque-tap": {
      "prompt": "/sounds/preschool/en/values-mosque-tap-prompt.mp3",
      "success": "/sounds/preschool/en/algeria-mosque-success.mp3",
      "successDurationMs": 2347
    },
    "values-good-manners": {
      "prompt": "/sounds/preschool/en/values-good-manners-prompt.mp3",
      "success": "/sounds/preschool/en/values-good-manners-success.mp3",
      "successDurationMs": 3932
    },
    "values-memory": {
      "prompt": "/sounds/preschool/en/values-memory-prompt.mp3",
      "success": "/sounds/preschool/en/values-memory-success.mp3",
      "successDurationMs": 3197
    }
  }
};
