import type { PreschoolLanguage } from './types';

// Recordings in Arabic, French and English verified against the world catalog.
export const WORLD_AUDIO_CLIPS: Partial<Record<PreschoolLanguage, Record<string, { prompt: string; success: string; successDurationMs: number }>>> = {
  "ar": {
    "world-day-path": {
      "prompt": "/sounds/preschool/ar/world-day-path-prompt.mp3",
      "success": "/sounds/preschool/ar/world-day-path-success.mp3",
      "successDurationMs": 2677
    },
    "world-algerian-animals": {
      "prompt": "/sounds/preschool/ar/world-algerian-animals-prompt.mp3",
      "success": "/sounds/preschool/ar/world-algerian-animals-success.mp3",
      "successDurationMs": 2950
    },
    "world-fennec": {
      "prompt": "/sounds/preschool/ar/world-fennec-prompt.mp3",
      "success": "/sounds/preschool/ar/world-fennec-success.mp3",
      "successDurationMs": 2275
    },
    "world-match-homes": {
      "prompt": "/sounds/preschool/ar/world-match-homes-prompt.mp3",
      "success": "/sounds/preschool/ar/world-match-homes-success.mp3",
      "successDurationMs": 3650
    },
    "world-morning-routine": {
      "prompt": "/sounds/preschool/ar/world-morning-routine-prompt.mp3",
      "success": "/sounds/preschool/ar/world-morning-routine-success.mp3",
      "successDurationMs": 2943
    },
    "world-day-night": {
      "prompt": "/sounds/preschool/ar/world-day-night-prompt.mp3",
      "success": "/sounds/preschool/ar/world-day-night-success.mp3",
      "successDurationMs": 1991
    },
    "world-memory": {
      "prompt": "/sounds/preschool/ar/world-memory-prompt.mp3",
      "success": "/sounds/preschool/ar/world-memory-success.mp3",
      "successDurationMs": 2528
    }
  },
  "fr": {
    "world-day-path": {
      "prompt": "/sounds/preschool/fr/world-day-path-prompt.mp3",
      "success": "/sounds/preschool/fr/world-day-path-success.mp3",
      "successDurationMs": 2495
    },
    "world-algerian-animals": {
      "prompt": "/sounds/preschool/fr/world-algerian-animals-prompt.mp3",
      "success": "/sounds/preschool/fr/world-algerian-animals-success.mp3",
      "successDurationMs": 2843
    },
    "world-fennec": {
      "prompt": "/sounds/preschool/fr/world-fennec-prompt.mp3",
      "success": "/sounds/preschool/fr/world-fennec-success.mp3",
      "successDurationMs": 2313
    },
    "world-match-homes": {
      "prompt": "/sounds/preschool/fr/world-match-homes-prompt.mp3",
      "success": "/sounds/preschool/fr/world-match-homes-success.mp3",
      "successDurationMs": 2480
    },
    "world-morning-routine": {
      "prompt": "/sounds/preschool/fr/world-morning-routine-prompt.mp3",
      "success": "/sounds/preschool/fr/world-morning-routine-success.mp3",
      "successDurationMs": 2670
    },
    "world-day-night": {
      "prompt": "/sounds/preschool/fr/world-day-night-prompt.mp3",
      "success": "/sounds/preschool/fr/world-day-night-success.mp3",
      "successDurationMs": 1793
    },
    "world-memory": {
      "prompt": "/sounds/preschool/fr/world-memory-prompt.mp3",
      "success": "/sounds/preschool/fr/world-memory-success.mp3",
      "successDurationMs": 2328
    }
  },
  "en": {
    "world-day-path": {
      "prompt": "/sounds/preschool/en/world-day-path-prompt.mp3",
      "success": "/sounds/preschool/en/world-day-path-success.mp3",
      "successDurationMs": 2659
    },
    "world-algerian-animals": {
      "prompt": "/sounds/preschool/en/world-algerian-animals-prompt.mp3",
      "success": "/sounds/preschool/en/world-algerian-animals-success.mp3",
      "successDurationMs": 3271
    },
    "world-fennec": {
      "prompt": "/sounds/preschool/en/world-fennec-prompt.mp3",
      "success": "/sounds/preschool/en/world-fennec-success.mp3",
      "successDurationMs": 2461
    },
    "world-match-homes": {
      "prompt": "/sounds/preschool/en/world-match-homes-prompt.mp3",
      "success": "/sounds/preschool/en/world-match-homes-success.mp3",
      "successDurationMs": 3074
    },
    "world-morning-routine": {
      "prompt": "/sounds/preschool/en/world-morning-routine-prompt.mp3",
      "success": "/sounds/preschool/en/world-morning-routine-success.mp3",
      "successDurationMs": 3116
    },
    "world-day-night": {
      "prompt": "/sounds/preschool/en/world-day-night-prompt.mp3",
      "success": "/sounds/preschool/en/world-day-night-success.mp3",
      "successDurationMs": 1755
    },
    "world-memory": {
      "prompt": "/sounds/preschool/en/world-memory-prompt.mp3",
      "success": "/sounds/preschool/en/world-memory-success.mp3",
      "successDurationMs": 3140
    }
  }
};
