import type { PreschoolLanguage } from './types';

// Recordings in Arabic, French and English verified against the shapes catalog.
export const SHAPE_AUDIO_CLIPS: Partial<Record<PreschoolLanguage, Record<string, { prompt: string; success: string; successDurationMs: number }>>> = {
  "fr": {
    "shape-circle-cookie": {
      "prompt": "/sounds/preschool/fr/shape-circle-cookie-prompt.mp3",
      "success": "/sounds/preschool/fr/shape-circle-cookie-success.mp3",
      "successDurationMs": 2520
    },
    "shape-square-gift": {
      "prompt": "/sounds/preschool/fr/shape-square-gift-prompt.mp3",
      "success": "/sounds/preschool/fr/shape-square-gift-success.mp3",
      "successDurationMs": 2277
    },
    "shape-triangle-pizza": {
      "prompt": "/sounds/preschool/fr/shape-triangle-pizza-prompt.mp3",
      "success": "/sounds/preschool/fr/shape-triangle-pizza-success.mp3",
      "successDurationMs": 2488
    },
    "shape-star-night": {
      "prompt": "/sounds/preschool/fr/shape-star-night-prompt.mp3",
      "success": "/sounds/preschool/fr/shape-star-night-success.mp3",
      "successDurationMs": 2428
    },
    "shape-heart-love": {
      "prompt": "/sounds/preschool/fr/shape-heart-love-prompt.mp3",
      "success": "/sounds/preschool/fr/shape-heart-love-success.mp3",
      "successDurationMs": 2341
    },
    "shape-diamond-ring": {
      "prompt": "/sounds/preschool/fr/shape-diamond-ring-prompt.mp3",
      "success": "/sounds/preschool/fr/shape-diamond-ring-success.mp3",
      "successDurationMs": 2484
    },
    "shape-trace-circle": {
      "prompt": "/sounds/preschool/fr/shape-trace-circle-prompt.mp3",
      "success": "/sounds/preschool/fr/shape-trace-circle-success.mp3",
      "successDurationMs": 3713
    },
    "shape-sort-triangles": {
      "prompt": "/sounds/preschool/fr/shape-sort-triangles-prompt.mp3",
      "success": "/sounds/preschool/fr/shape-sort-triangles-success.mp3",
      "successDurationMs": 3095
    },
    "shape-connect-twins": {
      "prompt": "/sounds/preschool/fr/shape-connect-twins-prompt.mp3",
      "success": "/sounds/preschool/fr/shape-connect-twins-success.mp3",
      "successDurationMs": 2781
    },
    "shape-memory-pairs": {
      "prompt": "/sounds/preschool/fr/shape-memory-pairs-prompt.mp3",
      "success": "/sounds/preschool/fr/shape-memory-pairs-success.mp3",
      "successDurationMs": 2325
    }
  },
  "en": {
    "shape-circle-cookie": {
      "prompt": "/sounds/preschool/en/shape-circle-cookie-prompt.mp3",
      "success": "/sounds/preschool/en/shape-circle-cookie-success.mp3",
      "successDurationMs": 2987
    },
    "shape-square-gift": {
      "prompt": "/sounds/preschool/en/shape-square-gift-prompt.mp3",
      "success": "/sounds/preschool/en/shape-square-gift-success.mp3",
      "successDurationMs": 2533
    },
    "shape-triangle-pizza": {
      "prompt": "/sounds/preschool/en/shape-triangle-pizza-prompt.mp3",
      "success": "/sounds/preschool/en/shape-triangle-pizza-success.mp3",
      "successDurationMs": 2892
    },
    "shape-star-night": {
      "prompt": "/sounds/preschool/en/shape-star-night-prompt.mp3",
      "success": "/sounds/preschool/en/shape-star-night-success.mp3",
      "successDurationMs": 2537
    },
    "shape-heart-love": {
      "prompt": "/sounds/preschool/en/shape-heart-love-prompt.mp3",
      "success": "/sounds/preschool/en/shape-heart-love-success.mp3",
      "successDurationMs": 2699
    },
    "shape-diamond-ring": {
      "prompt": "/sounds/preschool/en/shape-diamond-ring-prompt.mp3",
      "success": "/sounds/preschool/en/shape-diamond-ring-success.mp3",
      "successDurationMs": 2860
    },
    "shape-trace-circle": {
      "prompt": "/sounds/preschool/en/shape-trace-circle-prompt.mp3",
      "success": "/sounds/preschool/en/shape-trace-circle-success.mp3",
      "successDurationMs": 3507
    },
    "shape-sort-triangles": {
      "prompt": "/sounds/preschool/en/shape-sort-triangles-prompt.mp3",
      "success": "/sounds/preschool/en/shape-sort-triangles-success.mp3",
      "successDurationMs": 3097
    },
    "shape-connect-twins": {
      "prompt": "/sounds/preschool/en/shape-connect-twins-prompt.mp3",
      "success": "/sounds/preschool/en/shape-connect-twins-success.mp3",
      "successDurationMs": 2945
    },
    "shape-memory-pairs": {
      "prompt": "/sounds/preschool/en/shape-memory-pairs-prompt.mp3",
      "success": "/sounds/preschool/en/shape-memory-pairs-success.mp3",
      "successDurationMs": 2700
    }
  },
  "ar": {
    "shape-circle-cookie": {
      "prompt": "/sounds/preschool/ar/shape-circle-cookie-prompt.mp3",
      "success": "/sounds/preschool/ar/shape-circle-cookie-success.mp3",
      "successDurationMs": 2479
    },
    "shape-square-gift": {
      "prompt": "/sounds/preschool/ar/shape-square-gift-prompt.mp3",
      "success": "/sounds/preschool/ar/shape-square-gift-success.mp3",
      "successDurationMs": 2291
    },
    "shape-triangle-pizza": {
      "prompt": "/sounds/preschool/ar/shape-triangle-pizza-prompt.mp3",
      "success": "/sounds/preschool/ar/shape-triangle-pizza-success.mp3",
      "successDurationMs": 2393
    },
    "shape-star-night": {
      "prompt": "/sounds/preschool/ar/shape-star-night-prompt.mp3",
      "success": "/sounds/preschool/ar/shape-star-night-success.mp3",
      "successDurationMs": 2245
    },
    "shape-heart-love": {
      "prompt": "/sounds/preschool/ar/shape-heart-love-prompt.mp3",
      "success": "/sounds/preschool/ar/shape-heart-love-success.mp3",
      "successDurationMs": 2269
    },
    "shape-diamond-ring": {
      "prompt": "/sounds/preschool/ar/shape-diamond-ring-prompt.mp3",
      "success": "/sounds/preschool/ar/shape-diamond-ring-success.mp3",
      "successDurationMs": 2444
    },
    "shape-trace-circle": {
      "prompt": "/sounds/preschool/ar/shape-trace-circle-prompt.mp3",
      "success": "/sounds/preschool/ar/shape-trace-circle-success.mp3",
      "successDurationMs": 3465
    },
    "shape-sort-triangles": {
      "prompt": "/sounds/preschool/ar/shape-sort-triangles-prompt.mp3",
      "success": "/sounds/preschool/ar/shape-sort-triangles-success.mp3",
      "successDurationMs": 3041
    },
    "shape-connect-twins": {
      "prompt": "/sounds/preschool/ar/shape-connect-twins-prompt.mp3",
      "success": "/sounds/preschool/ar/shape-connect-twins-success.mp3",
      "successDurationMs": 2648
    },
    "shape-memory-pairs": {
      "prompt": "/sounds/preschool/ar/shape-memory-pairs-prompt.mp3",
      "success": "/sounds/preschool/ar/shape-memory-pairs-success.mp3",
      "successDurationMs": 2744
    }
  }
};
