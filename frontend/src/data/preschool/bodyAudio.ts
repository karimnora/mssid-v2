import type { PreschoolLanguage } from './types';

// Recordings in Arabic, French and English verified against the body catalog.
export const BODY_AUDIO_CLIPS: Partial<Record<PreschoolLanguage, Record<string, { prompt: string; success: string; successDurationMs: number }>>> = {
  "ar": {
    "body-fennec-wash": {
      "prompt": "/sounds/preschool/ar/body-fennec-wash-prompt.mp3",
      "success": "/sounds/preschool/ar/body-fennec-wash-success.mp3",
      "successDurationMs": 4063
    },
    "body-toothbrush": {
      "prompt": "/sounds/preschool/ar/body-toothbrush-prompt.mp3",
      "success": "/sounds/preschool/ar/body-toothbrush-success.mp3",
      "successDurationMs": 2496
    },
    "body-eyes": {
      "prompt": "/sounds/preschool/ar/body-eyes-prompt.mp3",
      "success": "/sounds/preschool/ar/body-eyes-success.mp3",
      "successDurationMs": 4051
    },
    "body-ears": {
      "prompt": "/sounds/preschool/ar/body-ears-prompt.mp3",
      "success": "/sounds/preschool/ar/body-ears-success.mp3",
      "successDurationMs": 3526
    },
    "body-hands": {
      "prompt": "/sounds/preschool/ar/body-hands-prompt.mp3",
      "success": "/sounds/preschool/ar/body-hands-success.mp3",
      "successDurationMs": 4173
    },
    "body-senses": {
      "prompt": "/sounds/preschool/ar/body-senses-prompt.mp3",
      "success": "/sounds/preschool/ar/body-senses-success.mp3",
      "successDurationMs": 4264
    },
    "body-sorting": {
      "prompt": "/sounds/preschool/ar/body-sorting-prompt.mp3",
      "success": "/sounds/preschool/ar/body-sorting-success.mp3",
      "successDurationMs": 3582
    },
    "body-memory": {
      "prompt": "/sounds/preschool/ar/body-memory-prompt.mp3",
      "success": "/sounds/preschool/ar/body-memory-success.mp3",
      "successDurationMs": 3934
    }
  },
  "fr": {
    "body-fennec-wash": {
      "prompt": "/sounds/preschool/fr/body-fennec-wash-prompt.mp3",
      "success": "/sounds/preschool/fr/body-fennec-wash-success.mp3",
      "successDurationMs": 3310
    },
    "body-toothbrush": {
      "prompt": "/sounds/preschool/fr/body-toothbrush-prompt.mp3",
      "success": "/sounds/preschool/fr/body-toothbrush-success.mp3",
      "successDurationMs": 2083
    },
    "body-eyes": {
      "prompt": "/sounds/preschool/fr/body-eyes-prompt.mp3",
      "success": "/sounds/preschool/fr/body-eyes-success.mp3",
      "successDurationMs": 3567
    },
    "body-ears": {
      "prompt": "/sounds/preschool/fr/body-ears-prompt.mp3",
      "success": "/sounds/preschool/fr/body-ears-success.mp3",
      "successDurationMs": 2903
    },
    "body-hands": {
      "prompt": "/sounds/preschool/fr/body-hands-prompt.mp3",
      "success": "/sounds/preschool/fr/body-hands-success.mp3",
      "successDurationMs": 3446
    },
    "body-senses": {
      "prompt": "/sounds/preschool/fr/body-senses-prompt.mp3",
      "success": "/sounds/preschool/fr/body-senses-success.mp3",
      "successDurationMs": 4037
    },
    "body-sorting": {
      "prompt": "/sounds/preschool/fr/body-sorting-prompt.mp3",
      "success": "/sounds/preschool/fr/body-sorting-success.mp3",
      "successDurationMs": 2792
    },
    "body-memory": {
      "prompt": "/sounds/preschool/fr/body-memory-prompt.mp3",
      "success": "/sounds/preschool/fr/body-memory-success.mp3",
      "successDurationMs": 3572
    }
  },
  "en": {
    "body-fennec-wash": {
      "prompt": "/sounds/preschool/en/body-fennec-wash-prompt.mp3",
      "success": "/sounds/preschool/en/body-fennec-wash-success.mp3",
      "successDurationMs": 3586
    },
    "body-toothbrush": {
      "prompt": "/sounds/preschool/en/body-toothbrush-prompt.mp3",
      "success": "/sounds/preschool/en/body-toothbrush-success.mp3",
      "successDurationMs": 2008
    },
    "body-eyes": {
      "prompt": "/sounds/preschool/en/body-eyes-prompt.mp3",
      "success": "/sounds/preschool/en/body-eyes-success.mp3",
      "successDurationMs": 4216
    },
    "body-ears": {
      "prompt": "/sounds/preschool/en/body-ears-prompt.mp3",
      "success": "/sounds/preschool/en/body-ears-success.mp3",
      "successDurationMs": 3563
    },
    "body-hands": {
      "prompt": "/sounds/preschool/en/body-hands-prompt.mp3",
      "success": "/sounds/preschool/en/body-hands-success.mp3",
      "successDurationMs": 4125
    },
    "body-senses": {
      "prompt": "/sounds/preschool/en/body-senses-prompt.mp3",
      "success": "/sounds/preschool/en/body-senses-success.mp3",
      "successDurationMs": 3854
    },
    "body-sorting": {
      "prompt": "/sounds/preschool/en/body-sorting-prompt.mp3",
      "success": "/sounds/preschool/en/body-sorting-success.mp3",
      "successDurationMs": 3038
    },
    "body-memory": {
      "prompt": "/sounds/preschool/en/body-memory-prompt.mp3",
      "success": "/sounds/preschool/en/body-memory-success.mp3",
      "successDurationMs": 3993
    }
  }
};
