import type { PreschoolLanguage } from './types';

// Supplied recordings for the emotions activities.
export const EMOTIONS_AUDIO_CLIPS: Partial<Record<PreschoolLanguage, Record<string, { prompt: string; success: string; successDurationMs: number }>>> = {
  "ar": {
    "emotion-feelings-path": {
      "prompt": "/sounds/preschool/ar/emotion-feelings-path-prompt.mp3",
      "success": "/sounds/preschool/ar/emotion-feelings-path-success.mp3",
      "successDurationMs": 2788
    },
    "emotion-happy": {
      "prompt": "/sounds/preschool/ar/emotion-happy-prompt.mp3",
      "success": "/sounds/preschool/ar/emotion-happy-success.mp3",
      "successDurationMs": 2107
    },
    "emotion-sad": {
      "prompt": "/sounds/preschool/ar/emotion-sad-prompt.mp3",
      "success": "/sounds/preschool/ar/emotion-sad-success.mp3",
      "successDurationMs": 3022
    },
    "emotion-angry": {
      "prompt": "/sounds/preschool/ar/emotion-angry-prompt.mp3",
      "success": "/sounds/preschool/ar/emotion-angry-success.mp3",
      "successDurationMs": 2962
    },
    "emotion-sort-context": {
      "prompt": "/sounds/preschool/ar/emotion-sort-context-prompt.mp3",
      "success": "/sounds/preschool/ar/emotion-sort-context-success.mp3",
      "successDurationMs": 1950
    },
    "emotion-connect": {
      "prompt": "/sounds/preschool/ar/emotion-connect-prompt.mp3",
      "success": "/sounds/preschool/ar/emotion-connect-success.mp3",
      "successDurationMs": 2034
    },
    "emotion-memory": {
      "prompt": "/sounds/preschool/ar/emotion-memory-prompt.mp3",
      "success": "/sounds/preschool/ar/emotion-memory-success.mp3",
      "successDurationMs": 1673
    },
    "emotion-hug": {
      "prompt": "/sounds/preschool/ar/emotion-hug-prompt.mp3",
      "success": "/sounds/preschool/ar/emotion-hug-success.mp3",
      "successDurationMs": 2339
    }
  },
  "fr": {
    "emotion-feelings-path": {
      "prompt": "/sounds/preschool/fr/emotion-feelings-path-prompt.mp3",
      "success": "/sounds/preschool/fr/emotion-feelings-path-success.mp3",
      "successDurationMs": 2800
    },
    "emotion-happy": {
      "prompt": "/sounds/preschool/fr/emotion-happy-prompt.mp3",
      "success": "/sounds/preschool/fr/emotion-happy-success.mp3",
      "successDurationMs": 1681
    },
    "emotion-sad": {
      "prompt": "/sounds/preschool/fr/emotion-sad-prompt.mp3",
      "success": "/sounds/preschool/fr/emotion-sad-success.mp3",
      "successDurationMs": 3240
    },
    "emotion-angry": {
      "prompt": "/sounds/preschool/fr/emotion-angry-prompt.mp3",
      "success": "/sounds/preschool/fr/emotion-angry-success.mp3",
      "successDurationMs": 2412
    },
    "emotion-sort-context": {
      "prompt": "/sounds/preschool/fr/emotion-sort-context-prompt.mp3",
      "success": "/sounds/preschool/fr/emotion-sort-context-success.mp3",
      "successDurationMs": 2274
    },
    "emotion-connect": {
      "prompt": "/sounds/preschool/fr/emotion-connect-prompt.mp3",
      "success": "/sounds/preschool/fr/emotion-connect-success.mp3",
      "successDurationMs": 1997
    },
    "emotion-memory": {
      "prompt": "/sounds/preschool/fr/emotion-memory-prompt.mp3",
      "success": "/sounds/preschool/fr/emotion-memory-success.mp3",
      "successDurationMs": 1865
    },
    "emotion-hug": {
      "prompt": "/sounds/preschool/fr/emotion-hug-prompt.mp3",
      "success": "/sounds/preschool/fr/emotion-hug-success.mp3",
      "successDurationMs": 1992
    }
  },
  "en": {
    "emotion-feelings-path": {
      "prompt": "/sounds/preschool/en/emotion-feelings-path-prompt.mp3",
      "success": "/sounds/preschool/en/emotion-feelings-path-success.mp3",
      "successDurationMs": 3353
    },
    "emotion-happy": {
      "prompt": "/sounds/preschool/en/emotion-happy-prompt.mp3",
      "success": "/sounds/preschool/en/emotion-happy-success.mp3",
      "successDurationMs": 2356
    },
    "emotion-sad": {
      "prompt": "/sounds/preschool/en/emotion-sad-prompt.mp3",
      "success": "/sounds/preschool/en/emotion-sad-success.mp3",
      "successDurationMs": 3526
    },
    "emotion-angry": {
      "prompt": "/sounds/preschool/en/emotion-angry-prompt.mp3",
      "success": "/sounds/preschool/en/emotion-angry-success.mp3",
      "successDurationMs": 2878
    },
    "emotion-sort-context": {
      "prompt": "/sounds/preschool/en/emotion-sort-context-prompt.mp3",
      "success": "/sounds/preschool/en/emotion-sort-context-success.mp3",
      "successDurationMs": 2490
    },
    "emotion-connect": {
      "prompt": "/sounds/preschool/en/emotion-connect-prompt.mp3",
      "success": "/sounds/preschool/en/emotion-connect-success.mp3",
      "successDurationMs": 2089
    },
    "emotion-memory": {
      "prompt": "/sounds/preschool/en/emotion-memory-prompt.mp3",
      "success": "/sounds/preschool/en/emotion-memory-success.mp3",
      "successDurationMs": 2110
    },
    "emotion-hug": {
      "prompt": "/sounds/preschool/en/emotion-hug-prompt.mp3",
      "success": "/sounds/preschool/en/emotion-hug-success.mp3",
      "successDurationMs": 1235
    }
  }
};
