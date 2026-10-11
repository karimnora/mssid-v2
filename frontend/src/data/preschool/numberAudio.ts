import type { PreschoolLanguage } from './types';

// Recorded number activities 0–10, including the corrected Standard Arabic instructions.
export const NUMBER_AUDIO_CLIPS: Partial<Record<PreschoolLanguage, Record<string, { prompt: string; success: string; successDurationMs: number }>>> = {
  "fr": {
    "num-0": {
      "prompt": "/sounds/preschool/fr/num-0-prompt.mp3",
      "success": "/sounds/preschool/fr/num-0-success.mp3",
      "successDurationMs": 2135
    },
    "num-1": {
      "prompt": "/sounds/preschool/fr/num-1-prompt.mp3",
      "success": "/sounds/preschool/fr/num-1-success.mp3",
      "successDurationMs": 2090
    },
    "num-10-count": {
      "prompt": "/sounds/preschool/fr/num-10-count-prompt.mp3",
      "success": "/sounds/preschool/fr/num-10-count-success.mp3",
      "successDurationMs": 2064
    },
    "num-10": {
      "prompt": "/sounds/preschool/fr/num-10-prompt.mp3",
      "success": "/sounds/preschool/fr/num-10-success.mp3",
      "successDurationMs": 3269
    },
    "num-2": {
      "prompt": "/sounds/preschool/fr/num-2-prompt.mp3",
      "success": "/sounds/preschool/fr/num-2-success.mp3",
      "successDurationMs": 2190
    },
    "num-3": {
      "prompt": "/sounds/preschool/fr/num-3-prompt.mp3",
      "success": "/sounds/preschool/fr/num-3-success.mp3",
      "successDurationMs": 1908
    },
    "num-4": {
      "prompt": "/sounds/preschool/fr/num-4-prompt.mp3",
      "success": "/sounds/preschool/fr/num-4-success.mp3",
      "successDurationMs": 2548
    },
    "num-5": {
      "prompt": "/sounds/preschool/fr/num-5-prompt.mp3",
      "success": "/sounds/preschool/fr/num-5-success.mp3",
      "successDurationMs": 2556
    },
    "num-6": {
      "prompt": "/sounds/preschool/fr/num-6-prompt.mp3",
      "success": "/sounds/preschool/fr/num-6-success.mp3",
      "successDurationMs": 1988
    },
    "num-7": {
      "prompt": "/sounds/preschool/fr/num-7-prompt.mp3",
      "success": "/sounds/preschool/fr/num-7-success.mp3",
      "successDurationMs": 2293
    },
    "num-8-count": {
      "prompt": "/sounds/preschool/fr/num-8-count-prompt.mp3",
      "success": "/sounds/preschool/fr/num-8-count-success.mp3",
      "successDurationMs": 1953
    },
    "num-8": {
      "prompt": "/sounds/preschool/fr/num-8-prompt.mp3",
      "success": "/sounds/preschool/fr/num-8-success.mp3",
      "successDurationMs": 2482
    },
    "num-9-count": {
      "prompt": "/sounds/preschool/fr/num-9-count-prompt.mp3",
      "success": "/sounds/preschool/fr/num-9-count-success.mp3",
      "successDurationMs": 2142
    },
    "num-9": {
      "prompt": "/sounds/preschool/fr/num-9-prompt.mp3",
      "success": "/sounds/preschool/fr/num-9-success.mp3",
      "successDurationMs": 2520
    }
  },
  "ar": {
    "num-0": {
      "prompt": "/sounds/preschool/ar/num-0-prompt.mp3",
      "success": "/sounds/preschool/ar/num-0-success.mp3",
      "successDurationMs": 2517
    },
    "num-1": {
      "prompt": "/sounds/preschool/ar/num-1-prompt.mp3",
      "success": "/sounds/preschool/ar/num-1-success.mp3",
      "successDurationMs": 2561
    },
    "num-10-count": {
      "prompt": "/sounds/preschool/ar/num-10-count-prompt.mp3",
      "success": "/sounds/preschool/ar/num-10-count-success.mp3",
      "successDurationMs": 2338
    },
    "num-10": {
      "prompt": "/sounds/preschool/ar/num-10-prompt.mp3",
      "success": "/sounds/preschool/ar/num-10-success.mp3",
      "successDurationMs": 3434
    },
    "num-2": {
      "prompt": "/sounds/preschool/ar/num-2-prompt.mp3",
      "success": "/sounds/preschool/ar/num-2-success.mp3",
      "successDurationMs": 2818
    },
    "num-3": {
      "prompt": "/sounds/preschool/ar/num-3-prompt.mp3",
      "success": "/sounds/preschool/ar/num-3-success.mp3",
      "successDurationMs": 2656
    },
    "num-4": {
      "prompt": "/sounds/preschool/ar/num-4-prompt.mp3",
      "success": "/sounds/preschool/ar/num-4-success.mp3",
      "successDurationMs": 2334
    },
    "num-5": {
      "prompt": "/sounds/preschool/ar/num-5-prompt.mp3",
      "success": "/sounds/preschool/ar/num-5-success.mp3",
      "successDurationMs": 2879
    },
    "num-6": {
      "prompt": "/sounds/preschool/ar/num-6-prompt.mp3",
      "success": "/sounds/preschool/ar/num-6-success.mp3",
      "successDurationMs": 2784
    },
    "num-7": {
      "prompt": "/sounds/preschool/ar/num-7-prompt.mp3",
      "success": "/sounds/preschool/ar/num-7-success.mp3",
      "successDurationMs": 2996
    },
    "num-8-count": {
      "prompt": "/sounds/preschool/ar/num-8-count-prompt.mp3",
      "success": "/sounds/preschool/ar/num-8-count-success.mp3",
      "successDurationMs": 2840
    },
    "num-8": {
      "prompt": "/sounds/preschool/ar/num-8-prompt.mp3",
      "success": "/sounds/preschool/ar/num-8-success.mp3",
      "successDurationMs": 2824
    },
    "num-9-count": {
      "prompt": "/sounds/preschool/ar/num-9-count-prompt.mp3",
      "success": "/sounds/preschool/ar/num-9-count-success.mp3",
      "successDurationMs": 2203
    },
    "num-9": {
      "prompt": "/sounds/preschool/ar/num-9-prompt.mp3",
      "success": "/sounds/preschool/ar/num-9-success.mp3",
      "successDurationMs": 2540
    }
  },
  "en": {
    "num-0": {
      "prompt": "/sounds/preschool/en/num-0-prompt.mp3",
      "success": "/sounds/preschool/en/num-0-success.mp3",
      "successDurationMs": 2799
    },
    "num-1": {
      "prompt": "/sounds/preschool/en/num-1-prompt.mp3",
      "success": "/sounds/preschool/en/num-1-success.mp3",
      "successDurationMs": 2300
    },
    "num-10-count": {
      "prompt": "/sounds/preschool/en/num-10-count-prompt.mp3",
      "success": "/sounds/preschool/en/num-10-count-success.mp3",
      "successDurationMs": 2568
    },
    "num-10": {
      "prompt": "/sounds/preschool/en/num-10-prompt.mp3",
      "success": "/sounds/preschool/en/num-10-success.mp3",
      "successDurationMs": 3507
    },
    "num-2": {
      "prompt": "/sounds/preschool/en/num-2-prompt.mp3",
      "success": "/sounds/preschool/en/num-2-success.mp3",
      "successDurationMs": 2640
    },
    "num-3": {
      "prompt": "/sounds/preschool/en/num-3-prompt.mp3",
      "success": "/sounds/preschool/en/num-3-success.mp3",
      "successDurationMs": 2492
    },
    "num-4": {
      "prompt": "/sounds/preschool/en/num-4-prompt.mp3",
      "success": "/sounds/preschool/en/num-4-success.mp3",
      "successDurationMs": 2508
    },
    "num-5": {
      "prompt": "/sounds/preschool/en/num-5-prompt.mp3",
      "success": "/sounds/preschool/en/num-5-success.mp3",
      "successDurationMs": 3007
    },
    "num-6": {
      "prompt": "/sounds/preschool/en/num-6-prompt.mp3",
      "success": "/sounds/preschool/en/num-6-success.mp3",
      "successDurationMs": 2397
    },
    "num-7": {
      "prompt": "/sounds/preschool/en/num-7-prompt.mp3",
      "success": "/sounds/preschool/en/num-7-success.mp3",
      "successDurationMs": 2475
    },
    "num-8-count": {
      "prompt": "/sounds/preschool/en/num-8-count-prompt.mp3",
      "success": "/sounds/preschool/en/num-8-count-success.mp3",
      "successDurationMs": 2412
    },
    "num-8": {
      "prompt": "/sounds/preschool/en/num-8-prompt.mp3",
      "success": "/sounds/preschool/en/num-8-success.mp3",
      "successDurationMs": 2448
    },
    "num-9-count": {
      "prompt": "/sounds/preschool/en/num-9-count-prompt.mp3",
      "success": "/sounds/preschool/en/num-9-count-success.mp3",
      "successDurationMs": 2339
    },
    "num-9": {
      "prompt": "/sounds/preschool/en/num-9-prompt.mp3",
      "success": "/sounds/preschool/en/num-9-success.mp3",
      "successDurationMs": 2281
    }
  }
};
